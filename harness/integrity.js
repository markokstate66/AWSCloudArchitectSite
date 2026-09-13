// Content-integrity gate.
//   node integrity.js snapshot --label <name> [--force]      -> harness/baseline/<name>.json
//   node integrity.js compare  --base <name>                 -> exit 1 on any unapproved change
// Compares, per page: title, meta description, canonical, robots, og/twitter tags, headings,
// rendered visible text, JSON-LD (normalised), internal links, external links, images+alt,
// AdSense loader, GA id, consent mode, ad units (count, slot ids, above-the-fold at 390 and 1440).
// UI chrome is excluded from the text/heading comparison: <nav>, <button>, .ad-well and any element
// carrying data-ui (copy buttons, breadcrumbs, 'On this page', 'Advertisement' labels). The text of
// data-ui elements is recorded separately (uiText) and reported so a critic can audit it.
// Changes are allowed only when docs/APPROVALS.json holds a named, dated, exact substitution:
//   {"page":"index.html","field":"text","from":"...","to":"...","approvedBy":"Name","date":"YYYY-MM-DD"}
// The substitution is applied to the BASELINE value and must reproduce the CURRENT value exactly;
// `from` must occur exactly once in the field (so "$10"->"$14" can never rewrite "$10,000").
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { PAGES, EXTRA } = require('./pages');
const { installAdBlock } = require('./adblock');
const ROOT = path.resolve(__dirname, '..');
const args = Object.fromEntries(process.argv.slice(3).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : []).filter(Boolean));
const cmd = process.argv[2];
const BASE = args.base_url || 'http://127.0.0.1:4173';
const BL = path.join(__dirname, 'baseline');
fs.mkdirSync(BL, { recursive: true });
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });

function extract() {
  const q = (sel) => Array.from(document.querySelectorAll(sel));
  const attr = (sel, a) => { const e = document.querySelector(sel); return e ? (e.getAttribute(a) || '') : ''; };
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
  const meta = {};
  q('meta[name],meta[property]').forEach(m => { const k = m.getAttribute('name') || m.getAttribute('property'); if (/^(description|robots|og:|twitter:|keywords|author)/.test(k)) meta[k] = norm(m.getAttribute('content')); });
  const ld = q('script[type="application/ld+json"]').map(s => { try { return JSON.stringify(JSON.parse(s.textContent)); } catch (e) { return 'INVALID:' + norm(s.textContent).slice(0, 80); } });
  const links = q('a[href]').map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('javascript:'));
  const isExt = h => /^https?:\/\//.test(h) && !/awscloudarchitect\.com/.test(h);
  // Unique set of page targets (fragment stripped): an on-page TOC or breadcrumb pointing at
  // pages already linked does not change the set; a link to a new page or a dropped page does.
  // Fragment-only hrefs (#roadmap, #main) are on-page navigation, not content links: ignored.
  const internal = Array.from(new Set(links.filter(h => !isExt(h) && !h.startsWith('#')).map(h => h.replace(/^https?:\/\/(www\.)?awscloudarchitect\.com/, '').replace(/#.*$/, '')))).sort();
  const external = links.filter(isExt).sort();
  const CHROME = '[data-harness-placeholder],[data-ui],nav,button,.ad-well';
  const headings = q('h1,h2,h3,h4').filter(h => !h.closest(CHROME)).map(h => h.tagName + ':' + norm(h.textContent));
  const uiText = q('[data-ui]').map(e => norm(e.innerText)).filter(Boolean);
  const images = q('img').map(i => (i.getAttribute('src') || '') + '|' + (i.getAttribute('alt') === null ? 'NOALT' : norm(i.getAttribute('alt'))));
  const scripts = q('script[src]').map(s => s.getAttribute('src'));
  // Exact (whitespace-preserving) text of every <pre>: the normalised text check would let an
  // indentation change inside a code sample slip through, and copied code must stay byte-exact.
  const pre = q('pre').filter(p => !p.closest('[data-harness-placeholder]')).map(p => p.textContent);
  const ads = q('ins.adsbygoogle').map(el => { const r = el.getBoundingClientRect(); const top = r.top + window.scrollY; return { slot: el.getAttribute('data-ad-slot') || '', format: el.getAttribute('data-ad-format') || '', top: Math.round(top), height: Math.round(r.height), aboveFold: top < window.innerHeight }; });
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll(CHROME + ',script,style,noscript,template,ins.adsbygoogle').forEach(n => n.remove());
  // innerText needs layout; attach the clone off-screen briefly.
  clone.style.cssText = 'position:absolute;left:-99999px;top:0;width:1200px';
  document.documentElement.appendChild(clone);
  const text = norm(clone.innerText);
  clone.remove();
  const html = document.documentElement.innerHTML;
  return {
    title: norm(document.title), canonical: attr('link[rel="canonical"]', 'href'), lang: document.documentElement.lang || '', meta, ld,
    headings, text, uiText, pre, internalLinks: internal, externalLinks: external, images, scripts,
    adsenseLoader: !!document.querySelector('script[src*="adsbygoogle.js?client=ca-pub-6676281664229738"]'),
    gaId: (html.match(/gtag\/js\?id=(G-[A-Z0-9]+)/) || [])[1] || '',
    consentMode: /gtag\(\s*['"]consent['"]/.test(html),
    ads,
  };
}

async function capture() {
  const browser = await chromium.launch();
  const out = {};
  for (const [page] of [...PAGES, ...EXTRA]) {
    const rec = {};
    for (const width of [390, 1440]) {
      const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 } });
      await installAdBlock(ctx);
      const p = await ctx.newPage();
      await p.goto(`${BASE}/${page}`, { waitUntil: 'load', timeout: 30000 });
      await p.waitForTimeout(300);
      const d = await p.evaluate(extract);
      if (width === 1440) { Object.assign(rec, d); rec.ads1440 = d.ads; } else { rec.ads390 = d.ads; }
      delete rec.ads;
      await ctx.close();
    }
    out[page] = rec;
    process.stdout.write('.');
  }
  await browser.close();
  console.log('');
  return out;
}

function loadApprovals() {
  const f = path.join(ROOT, 'docs', 'APPROVALS.json');
  if (!fs.existsSync(f)) return [];
  const list = JSON.parse(fs.readFileSync(f, 'utf8'));
  return list.filter(a => a.approvedBy && a.date && a.page && a.field && typeof a.from === 'string' && typeof a.to === 'string');
}

function applyApprovals(page, field, baseVal, approvals, used) {
  let v = baseVal;
  for (const a of approvals) {
    if (a.page !== page || a.field !== field) continue;
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    const count = s.split(a.from).length - 1;
    if (count !== 1) { used.push({ ...a, status: `REJECTED: "from" occurs ${count} times in ${page}#${field} (must be exactly 1)` }); continue; }
    const next = s.split(a.from).join(a.to); // string split/join: no $-pattern surprises in the replacement
    v = typeof v === 'string' ? next : JSON.parse(next);
    used.push({ ...a, status: 'applied' });
  }
  return v;
}

function diffField(page, field, b, c, approvals, used, problems) {
  const bb = applyApprovals(page, field, b, approvals, used);
  const sb = typeof bb === 'string' ? bb : JSON.stringify(bb);
  const sc = typeof c === 'string' ? c : JSON.stringify(c);
  if (sb !== sc) {
    let i = 0; while (i < sb.length && i < sc.length && sb[i] === sc[i]) i++;
    problems.push({ page, field, at: i, baseline: sb.slice(Math.max(0, i - 60), i + 120), current: sc.slice(Math.max(0, i - 60), i + 120) });
  }
}

(async () => {
  if (cmd === 'snapshot') {
    if (!args.label || args.label === true) { console.error('ERROR: --label <name> is required (no default, by design).'); process.exit(2); }
    const f = path.join(BL, args.label + '.json');
    if (fs.existsSync(f) && !args.force) { console.error(`ERROR: baseline "${args.label}" exists. Use a new label or --force.`); process.exit(2); }
    const data = await capture();
    fs.writeFileSync(f, JSON.stringify({ label: args.label, date: new Date().toISOString(), pages: data }, null, 2));
    console.log(`baseline written: ${f} (${Object.keys(data).length} pages)`);
    return;
  }
  if (cmd === 'compare') {
    if (!args.base || args.base === true) { console.error('ERROR: --base <label> is required.'); process.exit(2); }
    const f = path.join(BL, args.base + '.json');
    if (!fs.existsSync(f)) { console.error(`ERROR: no baseline "${args.base}".`); process.exit(2); }
    const base = JSON.parse(fs.readFileSync(f, 'utf8')).pages;
    const cur = await capture();
    const approvals = loadApprovals();
    const used = [], problems = [], adProblems = [];
    const CONTENT_FIELDS = ['title', 'canonical', 'lang', 'meta', 'ld', 'headings', 'text', 'pre', 'internalLinks', 'externalLinks', 'images'];
    const AD_FIELDS = ['adsenseLoader', 'gaId', 'consentMode'];
    for (const page of Object.keys(base)) {
      if (!cur[page]) { problems.push({ page, field: 'PAGE', at: 0, baseline: 'present', current: 'MISSING' }); continue; }
      for (const fld of CONTENT_FIELDS) diffField(page, fld, base[page][fld], cur[page][fld], approvals, used, problems);
      for (const fld of AD_FIELDS) if (JSON.stringify(base[page][fld]) !== JSON.stringify(cur[page][fld])) adProblems.push({ page, field: fld, baseline: base[page][fld], current: cur[page][fld], rule: 'TRACKING_SNIPPET_CHANGED' });
      for (const w of ['ads390', 'ads1440']) for (const ad of (cur[page][w] || [])) {
        if (ad.aboveFold) adProblems.push({ page, field: w, rule: 'NO_AD_ABOVE_FOLD', ad });
        if (!ad.slot) adProblems.push({ page, field: w, rule: 'AD_UNIT_WITHOUT_SLOT_ID', ad });
      }
      const bc = (base[page].ads1440 || []).length, cc = (cur[page].ads1440 || []).length;
      if (bc !== cc) {
        const ok = approvals.some(a => a.page === page && a.field === 'adCount' && String(a.from) === String(bc) && String(a.to) === String(cc));
        if (!ok) adProblems.push({ page, field: 'adCount', baseline: bc, current: cc, rule: 'AD_COUNT_CHANGED_WITHOUT_APPROVAL' });
      }
    }
    for (const page of Object.keys(cur)) if (!base[page]) problems.push({ page, field: 'PAGE', at: 0, baseline: 'MISSING', current: 'present (new page: not allowed without approval)' });
    const uiReport = Object.fromEntries(Object.entries(cur).map(([p, r]) => [p, r.uiText || []]).filter(([, v]) => v.length));
    const rejected = used.filter(u => u.status !== 'applied');
    const report = { base: args.base, date: new Date().toISOString(), contentProblems: problems, adProblems, approvalsApplied: used.filter(u => u.status === 'applied').length, approvalsRejected: rejected, uiTextByPage: uiReport };
    fs.writeFileSync(path.join(__dirname, 'out', 'integrity-last.json'), JSON.stringify(report, null, 2));
    for (const p of problems) console.log(`CONTENT DIFF ${p.page} [${p.field}] @${p.at}\n  base: ...${p.baseline}...\n  curr: ...${p.current}...`);
    for (const p of adProblems) console.log(`AD/TRACKING PROBLEM ${JSON.stringify(p)}`);
    for (const r of rejected) console.log(`APPROVAL ${r.status}`);
    const uiAll = Array.from(new Set(Object.values(uiReport).flat()));
    if (uiAll.length) console.log(`UI CHROME TEXT (excluded from content check, audit it): ${JSON.stringify(uiAll).slice(0, 600)}`);
    const fail = problems.length + adProblems.length + rejected.length;
    console.log(fail ? `INTEGRITY: FAIL (${problems.length} content, ${adProblems.length} ad/tracking, ${rejected.length} rejected approvals)` : `INTEGRITY: PASS (${Object.keys(base).length} pages identical to baseline "${args.base}", ${report.approvalsApplied} approvals applied)`);
    process.exit(fail ? 1 : 0);
  }
  console.error('usage: node integrity.js snapshot --label <name> | compare --base <name>');
  process.exit(2);
})().catch(e => { console.error(e); process.exit(1); });

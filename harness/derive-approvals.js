// Derives gate approvals (docs/APPROVALS.json entries) for an owner-approved audit block by explaining
// EVERY difference between the frozen baseline fields and the current fields with one of the approved
// substitutions. Any difference that no approved substitution explains is reported and nothing is written.
//   node harness/derive-approvals.js --base baseline-2026-09-13 --current tmp-audit --by "<name>" --date YYYY-MM-DD [--write]
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : []).filter(Boolean));
const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline', args.base + '.json'), 'utf8')).pages;
const cur = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline', args.current + '.json'), 'utf8')).pages;
const md = fs.readFileSync(path.join(ROOT, 'docs', 'CONTENT_AUDIT.md'), 'utf8');
const audit = JSON.parse(md.slice(md.indexOf('Approval block')).match(/```json\s*([\s\S]*?)```/)[1]);
audit.push({ page: 'resources.html', field: 'text', from: 'by Ben Piper &amp; David Clinton', to: 'by Patrick Sard &amp; Yohan Wadia', note: 'audit items 32/33 byline' });
audit.push({ page: 'resources.html', field: 'text', from: 'Free Tier eligible', to: 'Pennies per month at low volume; covered by new-account credits' }); // same rendered pair as #13/#14

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&copy;': '©', '&nbsp;': ' ' };
const decode = s => s.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&[a-z]+;/g, e => ENT[e] ?? e);
const norm = s => s.replace(/\s+/g, ' ').trim();
const render = s => norm(decode(s.replace(/<[^>]+>/g, ' ')));
// Variants of an approved (from,to) as they appear in each gate field's string form.
function variants(a, field) {
  const v = [];
  if (field === 'text' || field === 'headings') { const f = render(a.from), t = render(a.to); if (f && f !== t) v.push([f, t]); }
  if (field === 'pre') { const f = JSON.stringify(decode(a.from)).slice(1, -1), t = JSON.stringify(decode(a.to)).slice(1, -1); if (f !== t) v.push([f, t]); }
  if (field === 'externalLinks' || field === 'internalLinks') { const f = JSON.stringify(a.from).slice(1, -1), t = JSON.stringify(a.to).slice(1, -1); if (f !== t) v.push([f, t]); }
  return v;
}
const FIELDS = ['title', 'canonical', 'lang', 'meta', 'ld', 'headings', 'text', 'pre', 'internalLinks', 'externalLinks', 'images'];
const str = v => typeof v === 'string' ? v : JSON.stringify(v);
const approvals = []; const unexplained = [];
for (const page of Object.keys(base)) {
  const items = audit.filter(a => a.page === page || a.page === '*');
  for (const field of FIELDS) {
    const B = str(base[page][field]), C = str(cur[page][field]);
    if (B === C) continue;
    if (field === 'externalLinks' || field === 'internalLinks') {
      // Sorted sets: explain removed/added members pairwise with approved href substitutions.
      const bs = base[page][field], cs = cur[page][field];
      const removed = bs.filter(x => !cs.includes(x)), added = cs.filter(x => !bs.includes(x));
      for (const r of removed) {
        const a = items.find(a => a.field === 'href' && a.from === r && cs.includes(a.to)); // the replacement may already exist on the page (set)
        if (!a) { unexplained.push({ page, field, at: 0, baseline: r, current: '(no approved replacement)' }); continue; }
        approvals.push({ page, field, from: JSON.stringify(r), to: JSON.stringify(a.to), source: a.source || 'CONTENT_AUDIT', approvedBy: args.by, date: args.date });
      }
      for (const x of added) if (!items.some(a => a.field === 'href' && a.to === x && removed.includes(a.from))) unexplained.push({ page, field, at: 0, baseline: '(nothing)', current: x });
      continue;
    }
    let b = 0, c = 0; let working = B; let guard = 0;
    while (working !== C && guard++ < 200) {
      let m = 0; while (m < working.length && m < C.length && working[m] === C[m]) m++;
      let hit = null;
      for (const a of items) for (const [f, t] of variants(a, field)) {
        for (let back = Math.min(m, f.length); back >= 0 && !hit; back--) {
          const s = m - back;
          if (working.startsWith(f, s) && C.startsWith(t, s)) hit = { f, t, s, a };
        }
        if (hit) break;
      }
      if (!hit) { unexplained.push({ page, field, at: m, baseline: working.slice(Math.max(0, m - 50), m + 80), current: C.slice(Math.max(0, m - 50), m + 80) }); break; }
      // grow context until `from` is unique in the ORIGINAL baseline string (gate rule) — the approval is
      // expressed against the baseline, and later substitutions on the same field may overlap contexts,
      // so uniqueness is also required after all earlier approvals are applied (checked by the gate itself).
      let l = hit.s, r = hit.s + hit.f.length;
      while (B.split(working.slice(l, r)).length - 1 !== 1 && (l > 0 || r < working.length)) { l = Math.max(0, l - 8); r = Math.min(working.length, r + 8); }
      const fromCtx = working.slice(l, r), toCtx = working.slice(l, hit.s) + hit.t + working.slice(hit.s + hit.f.length, r);
      approvals.push({ page, field, from: fromCtx, to: toCtx, source: hit.a.source || hit.a.note || 'CONTENT_AUDIT', approvedBy: args.by, date: args.date });
      working = working.slice(0, hit.s) + hit.t + working.slice(hit.s + hit.f.length);
    }
  }
}
console.log(`derived ${approvals.length} approvals; unexplained diffs: ${unexplained.length}`);
unexplained.slice(0, 12).forEach(u => console.log(`  ${u.page} [${u.field}] @${u.at}\n    base: ...${u.baseline}...\n    curr: ...${u.current}...`));
if (args.write && unexplained.length === 0) {
  const f = path.join(ROOT, 'docs', 'APPROVALS.json'); const existing = JSON.parse(fs.readFileSync(f, 'utf8'));
  fs.writeFileSync(f, JSON.stringify(existing.concat(approvals), null, 2) + '\n'); console.log('written to docs/APPROVALS.json');
}
process.exit(unexplained.length ? 1 : 0);

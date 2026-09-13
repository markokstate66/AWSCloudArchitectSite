// Lighthouse (mobile, ads/analytics blocked) for representative pages.
// usage: node lh.js --label <name> [--pages a.html,b.html] [--base http://127.0.0.1:4173] [--force]
const fs = require('fs');
const path = require('path');
const { REPRESENTATIVE } = require('./pages');
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : []).filter(Boolean));
if (!args.label || args.label === true) { console.error('ERROR: --label <name> is required.'); process.exit(2); }
const BASE = args.base || 'http://127.0.0.1:4173';
const pages = args.pages ? String(args.pages).split(',') : REPRESENTATIVE;
const OUT = path.join(__dirname, 'out', args.label, 'lighthouse');
if (fs.existsSync(OUT) && !args.force) { console.error(`ERROR: lighthouse results for label "${args.label}" already exist. Use a new label or --force.`); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const BLOCK = ['*googlesyndication.com*', '*doubleclick.net*', '*googleadservices.com*', '*google-analytics.com*', '*analytics.google.com*', '*googletagmanager.com*', '*googletagservices.com*', '*fundingchoicesmessages.google.com*', '*adtrafficquality.google*', '*gstatic.com*', '*google.com*'];
(async () => {
  const lighthouse = (await import('lighthouse')).default;
  const chromeLauncher = await import('chrome-launcher');
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
  const rows = [];
  try {
    for (const page of pages) {
      const url = `${BASE}/${page}`;
      const res = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], blockedUrlPatterns: BLOCK, formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }, throttlingMethod: 'simulate' });
      const lhr = res.lhr; const c = lhr.categories; const a = lhr.audits;
      const row = {
        page,
        perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
        lcp_s: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(2), cls: +a['cumulative-layout-shift'].numericValue.toFixed(3), tbt_ms: Math.round(a['total-blocking-time'].numericValue),
        fcp_s: +(a['first-contentful-paint'].numericValue / 1000).toFixed(2), si_s: +(a['speed-index'].numericValue / 1000).toFixed(2), bytes_kb: Math.round((a['total-byte-weight'].numericValue || 0) / 1024),
        failing: Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === 'binary').map(x => x.id).slice(0, 15),
      };
      rows.push(row);
      fs.writeFileSync(path.join(OUT, page.replace(/\.html$/, '') + '.json'), JSON.stringify({ categories: c, audits: Object.fromEntries(Object.entries(a).map(([k, v]) => [k, { score: v.score, displayValue: v.displayValue, numericValue: v.numericValue }])) }, null, 2));
      console.log(`${page}: perf=${row.perf} a11y=${row.a11y} bp=${row.bp} seo=${row.seo} LCP=${row.lcp_s}s CLS=${row.cls} TBT=${row.tbt_ms}ms ${row.bytes_kb}KB fail=[${row.failing.join(',')}]`);
    }
  } finally {
    fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify({ label: args.label, date: new Date().toISOString(), rows }, null, 2));
    try { await chrome.kill(); } catch (e) { /* Windows temp-dir cleanup EPERM is harmless */ }
  }
})().catch(e => { console.error(e); process.exit(1); });

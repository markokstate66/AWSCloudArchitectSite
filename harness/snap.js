// Screenshot + console/network/axe/CWV runner.
// usage: node snap.js --label <name> [--pages a.html,b.html] [--widths 390,768,1440] [--base http://127.0.0.1:4173] [--force]
// Writes harness/out/<label>/<page>@<width>.png and <page>@<width>.json, plus summary.json.
// Refuses to overwrite an existing label unless --force (so a baseline can never be silently replaced).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const { PAGES, EXTRA, WIDTHS } = require('./pages');
const { installAdBlock, PLACEHOLDER_JS } = require('./adblock');

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : []).filter(Boolean));
if (!args.label || args.label === true) { console.error('ERROR: --label <name> is required (no default, by design).'); process.exit(2); }
const BASE = args.base || 'http://127.0.0.1:4173';
const widths = args.widths ? String(args.widths).split(',').map(Number) : WIDTHS;
const pages = args.pages ? String(args.pages).split(',') : [...PAGES, ...EXTRA].map(p => p[0]);
const OUT = path.join(__dirname, 'out', args.label);
if (fs.existsSync(OUT) && !args.force) { console.error(`ERROR: label "${args.label}" already exists at ${OUT}. Use a new label or --force.`); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

const CWV_INIT = `
window.__cwv = { lcp: 0, cls: 0, shifts: [] };
try {
  new PerformanceObserver(l => { for (const e of l.getEntries()) window.__cwv.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => { for (const e of l.getEntries()) { if (!e.hadRecentInput) { window.__cwv.cls += e.value; window.__cwv.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), src: (e.sources||[]).map(s => s.node && (s.node.tagName + (s.node.className ? '.' + String(s.node.className).split(' ')[0] : ''))).join(',') }); } } }).observe({ type: 'layout-shift', buffered: true });
} catch (e) {}
`;

(async () => {
  const browser = await chromium.launch();
  const summary = [];
  for (const page of pages) {
    for (const width of widths) {
      const isMobile = width < 700;
      const context = await browser.newContext({ viewport: { width, height: isMobile ? 844 : 900 }, deviceScaleFactor: 1, isMobile, hasTouch: isMobile });
      const log = { page, width, url: `${BASE}/${page}`, consoleErrors: [], consoleWarnings: [], failedRequests: [], blocked: [], pageErrors: [] };
      await installAdBlock(context, log);
      await context.addInitScript(CWV_INIT);
      const p = await context.newPage();
      p.on('console', m => { if (m.type() === 'error') log.consoleErrors.push(m.text()); else if (m.type() === 'warning') log.consoleWarnings.push(m.text()); });
      p.on('pageerror', e => log.pageErrors.push(String(e)));
      p.on('requestfailed', r => { if (!log.blocked.includes(r.url())) log.failedRequests.push(r.url() + ' :: ' + (r.failure() && r.failure().errorText)); });
      p.on('response', r => { try { if (r.status() >= 400 && new URL(r.url()).hostname === '127.0.0.1') log.failedRequests.push(r.url() + ' :: HTTP ' + r.status()); } catch (e) {} });
      const t0 = Date.now();
      const resp = await p.goto(log.url, { waitUntil: 'load', timeout: 30000 });
      log.status = resp && resp.status();
      await p.waitForTimeout(600);
      log.placeholders = await p.evaluate(PLACEHOLDER_JS);
      // Scroll through the page to trigger lazy/IO-driven work, then back to top.
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 600) { await p.mouse.wheel(0, 600); await p.waitForTimeout(40); }
      await p.waitForTimeout(400);
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(300);
      const cwv = await p.evaluate(() => window.__cwv);
      log.lcp_ms = Math.round(cwv.lcp); log.cls = +cwv.cls.toFixed(4); log.shifts = cwv.shifts.slice(0, 10);
      log.scrollHeight = h; log.loadMs = Date.now() - t0;
      log.title = await p.title();
      // Horizontal overflow check (body must never scroll sideways).
      log.horizontalOverflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      log.transferBytes = await p.evaluate(() => performance.getEntriesByType('resource').concat(performance.getEntriesByType('navigation')).reduce((a, r) => a + (r.transferSize || 0), 0));
      log.jsBytes = await p.evaluate(() => performance.getEntriesByType('resource').filter(r => r.initiatorType === 'script').reduce((a, r) => a + (r.transferSize || 0), 0));
      try {
        const axe = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
        log.axe = axe.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, sample: v.nodes[0] && v.nodes[0].target.join(' ') }));
      } catch (e) { log.axe = [{ id: 'axe-failed', impact: 'critical', help: String(e) }]; }
      log.axeSeriousOrCritical = log.axe.filter(v => v.impact === 'serious' || v.impact === 'critical').length;
      const base = `${page.replace(/\.html$/, '')}@${width}`;
      await p.screenshot({ path: path.join(OUT, base + '.png'), fullPage: true });
      fs.writeFileSync(path.join(OUT, base + '.json'), JSON.stringify(log, null, 2));
      summary.push({ page, width, status: log.status, consoleErrors: log.consoleErrors.length, pageErrors: log.pageErrors.length, failedRequests: log.failedRequests.length, lcp_ms: log.lcp_ms, cls: log.cls, axeSC: log.axeSeriousOrCritical, axeAll: log.axe.length, hOverflow: log.horizontalOverflow, kb: Math.round(log.transferBytes / 1024), jsKb: Math.round(log.jsBytes / 1024), height: h });
      process.stdout.write(`${base}: status=${log.status} errs=${log.consoleErrors.length}/${log.pageErrors.length} fail=${log.failedRequests.length} lcp=${log.lcp_ms} cls=${log.cls} axeSC=${log.axeSeriousOrCritical} ovf=${log.horizontalOverflow} ${Math.round(log.transferBytes / 1024)}KB\n`);
      await context.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify({ label: args.label, date: new Date().toISOString(), base: BASE, rows: summary }, null, 2));
  await browser.close();
  console.log(`wrote ${summary.length} captures to ${OUT}`);
})().catch(e => { console.error(e); process.exit(1); });

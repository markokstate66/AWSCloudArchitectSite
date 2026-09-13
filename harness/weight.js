// Page-weight budget, measured the way production delivers it: gzip (Azure Static Web Apps
// compresses text/html, text/css and application/javascript). Deterministic, no browser.
//   node harness/weight.js [--ref f1ec399]   -> table per page: raw and gzip bytes now vs the ref commit
// Weight of a page = HTML + styles.css (if linked) + every same-origin <script src> + <img src> bytes.
// Budget rule (ARCHITECTURE.md): gzip weight now <= gzip weight at the ref commit, per page.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');
const { PAGES } = require('./pages');
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const REF = args.includes('--ref') ? args[args.indexOf('--ref') + 1] : 'f1ec399';
const gz = b => zlib.gzipSync(b, { level: 6 }).length;
const TEXT = /\.(html|css|js|svg|json|txt|xml)$/i;

function fileAt(rel, ref) {
  try {
    if (ref) return execSync(`git show ${ref}:${rel.replace(/\\/g, '/')}`, { cwd: ROOT, encoding: 'buffer', stdio: ['ignore', 'pipe', 'ignore'] });
    return fs.readFileSync(path.join(ROOT, rel));
  } catch (e) { return null; }
}
function assets(html) {
  const out = new Set();
  for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) out.add(m[1]);
  for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) if (!/^https?:/.test(m[1])) out.add(m[1]);
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) if (!/^https?:|^data:/.test(m[1])) out.add(m[1]);
  return [...out];
}
function weigh(page, ref) {
  const html = fileAt(page, ref); if (!html) return null;
  let raw = html.length, z = gz(html);
  const parts = { html: [raw, z] };
  for (const a of assets(html.toString('utf8'))) {
    const b = fileAt(a, ref); if (!b) { parts[a] = 'MISSING'; continue; }
    const az = TEXT.test(a) ? gz(b) : b.length; raw += b.length; z += az; parts[a] = [b.length, az];
  }
  return { raw, gz: z, parts };
}
const rows = []; let fail = 0;
for (const [page] of PAGES) {
  const now = weigh(page, null), ref = weigh(page, REF);
  const ok = now.gz <= ref.gz;
  if (!ok) fail++;
  rows.push({ page, refRaw: ref.raw, refGz: ref.gz, nowRaw: now.raw, nowGz: now.gz, delta: now.gz - ref.gz, ok, css: now.parts['styles.css'] });
  console.log(`${ok ? 'OK  ' : 'OVER'} ${page.padEnd(42)} gzip ${String(now.gz).padStart(7)} vs ${String(ref.gz).padStart(7)} (${now.gz - ref.gz >= 0 ? '+' : ''}${now.gz - ref.gz})   raw ${now.raw} vs ${ref.raw}`);
}
const css = fileAt('styles.css'), cssRef = fileAt('styles.css', REF);
console.log(`styles.css: raw ${css.length} (ref ${cssRef.length}), gzip ${gz(css)} (ref ${gz(cssRef)})`);
fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'out', 'weight-last.json'), JSON.stringify({ ref: REF, date: new Date().toISOString(), rows }, null, 2));
console.log(fail ? `WEIGHT: FAIL (${fail} pages over their gzip baseline)` : `WEIGHT: PASS (all ${rows.length} pages at or under gzip baseline @${REF})`);
process.exit(fail ? 1 : 0);

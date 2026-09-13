// Places manual ad units per docs/AD_PLAN.md ONLY when docs/AD_UNITS.json holds real slot ids.
//   node harness/apply-ads.js --check   report what would be placed / why not
//   node harness/apply-ads.js           apply (idempotent: existing .ad-well[data-position] blocks are replaced)
// Without slot ids this script places nothing: an empty reserved well in production would be a void.
// After placing units, every page's unit count needs an "adCount" approval in docs/APPROVALS.json.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const PUB = 'ca-pub-6676281664229738';
const unitsFile = path.join(ROOT, 'docs', 'AD_UNITS.json');
const units = fs.existsSync(unitsFile) ? JSON.parse(fs.readFileSync(unitsFile, 'utf8')) : {};

function well(position, slot, h) {
  return [
    `<div class="ad-well" data-position="${position}" style="--ad-h:${h}px">`,
    `  <span class="ad-well-label" data-ui>Advertisement</span>`,
    `  <div class="ad-well-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="${PUB}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>`,
    `</div>`,
    `<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>`,
  ].join('\n');
}
// Project pages have six .guide-section blocks: 1 Prerequisites, 2 Architecture, 3 Steps, 4 Tips,
// 5 Code Examples, 6 What You'll Learn. Wells go after 2 (mid-1), 4 (mid-2) and 6 (end, before the nav).
const PLAN = {
  'article-mid-1': { pages: p => /^project-/.test(p), after: 2 },
  'article-mid-2': { pages: p => /^project-/.test(p), after: 4 },
  'article-end':   { pages: p => /^project-/.test(p), after: 6 },
};
// Find the nth <div class="guide-section"> and its matching </div> by depth counting (indentation-agnostic).
function insertAfterNthSection(html, n, block) {
  const re = /<div class="guide-section"[^>]*>/g; let m, i = 0;
  while ((m = re.exec(html))) {
    i++; if (i !== n) continue;
    let depth = 0, pos = -1; const tag = /<\/?div\b[^>]*>/g; tag.lastIndex = m.index;
    let t; while ((t = tag.exec(html))) { depth += t[0].startsWith('</') ? -1 : 1; if (depth === 0) { pos = t.index + t[0].length; break; } }
    if (pos < 0) return null;
    const eol = html.indexOf('\n', pos); const cut = eol < 0 ? pos : eol + 1;
    const indent = (html.slice(html.lastIndexOf('\n', m.index) + 1, m.index).match(/^ */) || [''])[0];
    return html.slice(0, cut) + block.split('\n').map(l => indent + l).join('\n') + '\n' + html.slice(cut);
  }
  return null;
}
const STRIP = / *<div class="ad-well" data-position="[^"]+"[\s\S]*?<\/div>\n *<script>\(adsbygoogle=window\.adsbygoogle\|\|\[\]\)\.push\(\{\}\);<\/script>\n/g;
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !/^(admin|404)\.html$/.test(f));
let placed = 0; const skipped = [];
for (const page of pages) {
  let html = fs.readFileSync(path.join(ROOT, page), 'utf8').replace(STRIP, ''); // idempotent
  const before = html;
  for (const [pos, rule] of Object.entries(PLAN)) {
    if (!rule.pages(page)) continue;
    const slot = units[pos];
    if (!slot || !/^\d{6,}$/.test(String(slot))) { skipped.push(`${page}: ${pos} (no slot id in docs/AD_UNITS.json)`); continue; }
    const next = insertAfterNthSection(html, rule.after, well(pos, slot, 280));
    if (!next) { skipped.push(`${page}: ${pos} (anchor section not found)`); continue; }
    html = next; placed++;
  }
  if (!CHECK && html !== before) fs.writeFileSync(path.join(ROOT, page), html);
}
console.log(`${CHECK ? 'would place' : 'placed'} ${placed} units; skipped ${skipped.length}`);
for (const s of skipped.slice(0, 5)) console.log('  ' + s);
if (skipped.length > 5) console.log(`  ... ${skipped.length - 5} more`);

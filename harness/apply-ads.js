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
// listing-mid: after the first card grid on each listing page. home-mid: before #resources on index,
// wrapped in a .container because index sections are direct children of <main> (no gutter).
const PLAN = {
  'article-mid-1': { pages: p => /^project-/.test(p), after: 2 },
  'article-mid-2': { pages: p => /^project-/.test(p), after: 4 },
  'article-end':   { pages: p => /^project-/.test(p), after: 6 },
  'listing-mid':   { pages: p => /^(projects|resources|interview-prep)\.html$/.test(p), afterClose: { 'projects.html': 'project-grid', 'resources.html': 'books-grid', 'interview-prep.html': 'interview-grid' } },
  'home-mid':      { pages: p => p === 'index.html', beforeSection: 'resources' },
};
const NL = '\n';
function indentOf(html, idx) { return (html.slice(html.lastIndexOf(NL, idx) + 1, idx).match(/^ */) || [''])[0]; }
function closeOf(html, openIdx) { // index just after the matching </div> of the <div> at openIdx
  let depth = 0; const tag = /<\/?div\b[^>]*>/g; tag.lastIndex = openIdx; let t;
  while ((t = tag.exec(html))) { depth += t[0].startsWith('</') ? -1 : 1; if (depth === 0) return t.index + t[0].length; }
  return -1;
}
function insertAfter(html, openIdx, block, extraIndent) {
  const pos = closeOf(html, openIdx); if (pos < 0) return null;
  const eol = html.indexOf(NL, pos); const cut = eol < 0 ? pos : eol + 1;
  const ind = indentOf(html, openIdx) + (extraIndent || '');
  return html.slice(0, cut) + block.split(NL).map(l => ind + l).join(NL) + NL + html.slice(cut);
}
function insertAfterNthSection(html, n, block) {
  const re = /<div class="guide-section"[^>]*>/g; let m, i = 0;
  while ((m = re.exec(html))) { i++; if (i === n) return insertAfter(html, m.index, block); }
  return null;
}
function insertAfterFirstClass(html, cls, block) {
  const m = new RegExp('<div class="' + cls + '"[^>]*>').exec(html); if (!m) return null;
  return insertAfter(html, m.index, block);
}
function insertBeforeSection(html, id, block) {
  const m = new RegExp('<section[^>]*id="' + id + '"[^>]*>').exec(html); if (!m) return null;
  const lineStart = html.lastIndexOf(NL, m.index) + 1; const ind = indentOf(html, m.index);
  const wrapped = ['<div class="container">', ...block.split(NL).map(l => '  ' + l), '</div>'].map(l => ind + l).join(NL) + NL;
  return html.slice(0, lineStart) + wrapped + html.slice(lineStart);
}
// Strip previously placed wells (with or without the home-mid container wrapper) so the script is idempotent.
const STRIP = /(?: *<div class="container">\n)? *<div class="ad-well" data-position="[^"]+"[\s\S]*?<\/div>\n *<script>\(adsbygoogle=window\.adsbygoogle\|\|\[\]\)\.push\(\{\}\);<\/script>\n(?: *<\/div>\n)?/g;
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !/^(admin|404)\.html$/.test(f));
let placed = 0; const skipped = [];
for (const page of pages) {
  let html = fs.readFileSync(path.join(ROOT, page), 'utf8').replace(STRIP, '');
  const before = html;
  for (const [pos, rule] of Object.entries(PLAN)) {
    if (!rule.pages(page)) continue;
    const slot = units[pos];
    if (!slot || !/^\d{6,}$/.test(String(slot))) { skipped.push(`${page}: ${pos} (no slot id in docs/AD_UNITS.json)`); continue; }
    const blk = well(pos, slot, 280);
    const next = rule.after ? insertAfterNthSection(html, rule.after, blk) : rule.afterClose ? insertAfterFirstClass(html, rule.afterClose[page], blk) : insertBeforeSection(html, rule.beforeSection, blk);
    if (!next) { skipped.push(`${page}: ${pos} (anchor not found)`); continue; }
    html = next; placed++;
  }
  if (!CHECK && html !== before) fs.writeFileSync(path.join(ROOT, page), html);
}
console.log(`${CHECK ? 'would place' : 'placed'} ${placed} units; skipped ${skipped.length}`);
for (const s of skipped.slice(0, 5)) console.log('  ' + s);
if (skipped.length > 5) console.log(`  ... ${skipped.length - 5} more`);

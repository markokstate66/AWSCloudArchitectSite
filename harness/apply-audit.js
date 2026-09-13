// Applies the owner-approved corrections from docs/CONTENT_AUDIT.md's approval block to the page
// sources. Each entry's `from` must occur EXACTLY ONCE in its file (or, for page "*", exactly once in
// every file that contains it); anything else is reported and left untouched.
//   node harness/apply-audit.js [--check]
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const ONLY = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null; // restrict to one file (re-apply after a revert)
const md = fs.readFileSync(path.join(ROOT, 'docs', 'CONTENT_AUDIT.md'), 'utf8');
const block = md.slice(md.indexOf('Approval block'));
const list = JSON.parse(block.match(/```json\s*([\s\S]*?)```/)[1]);
// The audit table (items 32/33) requires the SAP-C02 byline to change with the title/link, but the
// approval block omitted it; the owner approved the audit as a whole, so it is added here explicitly.
list.push({ page: 'resources.html', field: 'text', from: 'Professional Exam Guide (SAP-C02)</h3>\n            <p class="book-author">by Ben Piper &amp; David Clinton</p>', to: 'Professional Exam Guide (SAP-C02)</h3>\n            <p class="book-author">by Patrick Sard &amp; Yohan Wadia</p>', source: 'CONTENT_AUDIT items 32/33', dependsOnPrevious: true });

// Source-form adjustments: the facelift changed the markup around four approved strings (key-facts
// <dt>/<dd>, an emoji wrapper span, the SAP byline indentation). The RENDERED substitution is identical
// to the approved one; only the surrounding source differs. #11 is one bucket name used four times.
const OVERRIDES = {
  11: { all: true },
  13: { from: '<dd>Free Tier eligible</dd>', to: '<dd>Pennies per month at low volume; covered by new-account credits</dd>' },
  14: { from: '<dd>Free Tier eligible</dd>', to: '<dd>Pennies per month at low volume; covered by new-account credits</dd>' },
  46: { from: '<span>&#128337;</span> 40+ hours', to: '<span>&#128337;</span> 97 hours' },
  56: { from: 'Professional Exam Guide (SAP-C02)</h3>\n              <p class="book-author">by Ben Piper & David Clinton</p>', to: 'Professional Exam Guide (SAP-C02)</h3>\n              <p class="book-author">by Patrick Sard & Yohan Wadia</p>' },
};
for (const [i, o] of Object.entries(OVERRIDES)) Object.assign(list[Number(i)], o);

const html = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const files = {}; const load = f => (files[f] = files[f] ?? fs.readFileSync(path.join(ROOT, f), 'utf8'));
const count = (s, needle) => s.split(needle).length - 1;
let applied = 0; const problems = [];
for (const [i, a] of list.entries()) {
  let targets = a.page === '*' ? html.filter(f => count(load(f), a.from) > 0) : [a.page];
  if (ONLY) targets = targets.filter(f => f === ONLY);
  if (!targets.length) continue;
  for (const f of targets) {
    if (!fs.existsSync(path.join(ROOT, f))) { problems.push(`#${i} ${f}: file missing`); continue; }
    const s = load(f); const n = count(s, a.from);
    if (n === 0 || (n !== 1 && !a.all)) { problems.push(`#${i} ${f}: "${a.from.slice(0, 60)}" occurs ${n} times (must be 1)`); continue; }
    files[f] = s.split(a.from).join(a.to); applied++;
  }
}
if (!CHECK && problems.length === 0) for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(ROOT, f), s);
console.log(`${CHECK ? 'would apply' : problems.length ? 'NOT applied (problems)' : 'applied'} ${applied} substitutions in ${Object.keys(files).length} files; problems ${problems.length}`);
problems.forEach(p => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);

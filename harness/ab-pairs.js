// Blind A/B judging pairs. usage: node ab-pairs.js --old <label> --new <label> [--out ab-<name>]
// For each representative page x width, copies the two full-page PNGs to out/<ab>/<pair>-1.png and
// <pair>-2.png in a random order; the mapping is written to out/<ab>/KEY.json (judges never open it).
// Judges write scores per pair id; node ab-pairs.js --score out/<ab>/scores.json --key out/<ab>/KEY.json tallies.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { REPRESENTATIVE, WIDTHS } = require('./pages');
const a = Object.fromEntries(process.argv.slice(2).map((x, i, arr) => x.startsWith('--') ? [x.slice(2), arr[i + 1]] : []).filter(Boolean));
if (a.score) {
  const key = JSON.parse(fs.readFileSync(a.key, 'utf8')); const scores = JSON.parse(fs.readFileSync(a.score, 'utf8'));
  let oldWins = 0, newWins = 0, ties = 0; const rows = [];
  for (const [pair, k] of Object.entries(key.pairs)) {
    const s = scores[pair]; if (!s) continue;
    const sOld = k['1'] === 'old' ? s['1'] : s['2'], sNew = k['1'] === 'new' ? s['1'] : s['2'];
    rows.push({ pair, page: k.page, width: k.width, old: sOld, new: sNew });
    if (sNew > sOld) newWins++; else if (sOld > sNew) oldWins++; else ties++;
  }
  console.table(rows); console.log(`new wins ${newWins}, old wins ${oldWins}, ties ${ties}`); process.exit(0);
}
if (!a.old || !a.new) { console.error('usage: --old <label> --new <label>'); process.exit(2); }
const out = path.join(__dirname, 'out', a.out || `ab-${a.new}`); fs.mkdirSync(out, { recursive: true });
const key = { old: a.old, new: a.new, pairs: {} };
let n = 0;
for (const page of REPRESENTATIVE) for (const w of WIDTHS) {
  const base = `${page.replace(/\.html$/, '')}@${w}.png`;
  const fo = path.join(__dirname, 'out', a.old, base), fn = path.join(__dirname, 'out', a.new, base);
  if (!fs.existsSync(fo) || !fs.existsSync(fn)) continue;
  const id = 'P' + crypto.randomBytes(3).toString('hex');
  const flip = crypto.randomInt(2) === 1;
  fs.copyFileSync(flip ? fn : fo, path.join(out, `${id}-1.png`)); fs.copyFileSync(flip ? fo : fn, path.join(out, `${id}-2.png`));
  key.pairs[id] = { page, width: w, '1': flip ? 'new' : 'old', '2': flip ? 'old' : 'new' }; n++;
}
fs.writeFileSync(path.join(out, 'KEY.json'), JSON.stringify(key, null, 2));
fs.writeFileSync(path.join(out, 'PAIRS.txt'), Object.keys(key.pairs).sort().join('\n') + '\n');
console.log(`${n} pairs in ${out}; ids in PAIRS.txt; KEY.json is for the tally only`);

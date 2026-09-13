// Adds a Consent Mode v2 default ahead of the GA4 config on every page that carries the gtag
// snippet. Region-scoped to the EEA, UK and Switzerland: defaults are "denied" there until the
// AdSense-served European regulations message (Privacy & messaging) reports the reader's choice;
// everywhere else consent mode stays at its granted defaults. Idempotent.
//   node harness/apply-consent.js [--check]
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const REGIONS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IS', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH'];
const BLOCK = [
  `    // Consent Mode v2: denied by default in the EEA/UK/CH until the AdSense-served consent message answers`,
  `    gtag('consent', 'default', {`,
  `      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',`,
  `      wait_for_update: 500, region: ${JSON.stringify(REGIONS)}`,
  `    });`,
  `    gtag('set', 'ads_data_redaction', true);`,
].join('\n') + '\n';
const START = /[ \t]*\/\/ Consent Mode v2:[\s\S]*?gtag\('set', 'ads_data_redaction', true\);\n/;
let changed = 0, skipped = 0;
for (const page of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const file = path.join(ROOT, page);
  const before = fs.readFileSync(file, 'utf8');
  if (!/gtag\('js', new Date\(\)\);/.test(before)) { skipped++; continue; }
  const stripped = before.replace(START, '');
  const after = stripped.replace(/([ \t]*)gtag\('js', new Date\(\)\);/, m => BLOCK + m);
  if (after !== before) { changed++; if (!CHECK) fs.writeFileSync(file, after); }
}
console.log(`${CHECK ? 'would update' : 'updated'} ${changed} pages; ${skipped} without a GA tag`);

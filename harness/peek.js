// Viewport-sized look at a page region. usage: node peek.js <page> <width> [scrollY] [out.png]
// Ads/analytics blocked; placeholders painted. Writes to harness/out/peek/ by default.
const fs = require('fs'); const path = require('path');
const { chromium } = require('playwright');
const { installAdBlock, PLACEHOLDER_JS } = require('./adblock');
const [page, w, y, out] = process.argv.slice(2);
const width = Number(w || 390), scrollY = Number(y || 0);
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 844 : 900 }, isMobile: width < 700, hasTouch: width < 700 });
  await installAdBlock(ctx);
  const p = await ctx.newPage();
  await p.goto(`${BASE}/${page}`, { waitUntil: 'load' });
  await p.waitForTimeout(400);
  await p.evaluate(PLACEHOLDER_JS);
  await p.evaluate(y => window.scrollTo(0, y), scrollY);
  await p.waitForTimeout(500);
  const file = out || path.join(__dirname, 'out', 'peek', `${page.replace(/\.html$/, '')}@${width}+${scrollY}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await p.screenshot({ path: file });
  console.log(file);
  await browser.close();
})();

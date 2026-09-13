// Fetches book covers from Open Library by ISBN and writes images/books/<isbn10>.jpg contained to
// 360 px tall (the card mount is 120x160 CSS px; 360 covers 2x/3x screens) using Chromium's canvas
// encoder (no new npm packages). Never touches Amazon.
//   node harness/fetch-covers.js docs/BOOKS_RESEARCH.json [--only isbn10,isbn10]
const fs = require('fs'); const path = require('path'); const https = require('https');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const list = JSON.parse(fs.readFileSync(path.resolve(process.argv[2]), 'utf8'));
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const books = list.slots.flatMap(s => s.candidates.map(c => ({ ...c, slotId: s.slotId }))).filter(b => !only || only.includes(b.isbn10));
const get = url => new Promise((res, rej) => https.get(url, { headers: { 'User-Agent': 'awscloudarchitect-covers/1.0 (owner site; contact via awscloudarchitect.com/contact.html)' } }, r => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return get(r.headers.location).then(res, rej);
  const chunks = []; r.on('data', d => chunks.push(d)); r.on('end', () => res({ status: r.statusCode, body: Buffer.concat(chunks), type: r.headers['content-type'] }));
}).on('error', rej));
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  await p.setContent('<html><body></body></html>');
  const out = [];
  for (const bk of books) {
    const tries = [bk.isbn13, bk.isbn10].filter(Boolean).map(i => `https://covers.openlibrary.org/b/isbn/${i}-L.jpg?default=false`).concat([`https://learning.oreilly.com/library/cover/${bk.isbn13}/400w/`]); // O'Reilly serves many Packt/O'Reilly covers publicly by ISBN
    let got = null;
    for (const u of tries) { try { const r = await get(u); if (r.status === 200 && r.body.length > 5000) { got = r; break; } } catch (e) {} }
    if (!got) { out.push({ isbn10: bk.isbn10, title: bk.title, status: 'NO COVER' }); continue; }
    const dataUrl = 'data:' + (got.type || 'image/jpeg') + ';base64,' + got.body.toString('base64');
    const enc = await p.evaluate(async ([src, h, q]) => {
      const img = new Image(); await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = src; });
      const scale = Math.min(1, h / img.naturalHeight); const w = Math.round(img.naturalWidth * scale), hh = Math.round(img.naturalHeight * scale);
      const c = document.createElement('canvas'); c.width = w; c.height = hh; const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, hh);
      return { w, hh, data: c.toDataURL('image/jpeg', q).split(',')[1] };
    }, [dataUrl, 360, 0.78]);
    const file = path.join(ROOT, 'images', 'books', `${bk.isbn10}.jpg`);
    fs.writeFileSync(file, Buffer.from(enc.data, 'base64'));
    out.push({ isbn10: bk.isbn10, title: bk.title, status: 'ok', size: fs.statSync(file).size, dims: `${enc.w}x${enc.hh}` });
  }
  await b.close();
  out.forEach(o => console.log(`${o.status.padEnd(9)} ${o.isbn10} ${o.title.slice(0, 50)}${o.size ? ' ' + o.size + 'B ' + o.dims : ''}`));
  fs.writeFileSync(path.join(__dirname, 'out', 'covers-last.json'), JSON.stringify(out, null, 2));
})();

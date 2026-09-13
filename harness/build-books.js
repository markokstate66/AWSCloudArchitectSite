// Builds the book section from docs/BOOKS_RESEARCH.json using only cover-verified books
// (images/books/<isbn10>.jpg exists): static fallback cards on resources.html (rank-1 per slot),
// seed-data.json (top 2 per slot = active variants) and pool-data.json (the rest = rotation pool).
//   node harness/build-books.js [--check]
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const research = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'BOOKS_RESEARCH.json'), 'utf8'));
const dims = f => { const b = fs.readFileSync(f); let i = 2; while (i < b.length) { if (b[i] !== 0xFF) break; const m = b[i + 1]; if (m >= 0xC0 && m <= 0xC3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + b.readUInt16BE(i + 2); } return null; };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const by = a => a.length <= 2 ? a.join(' & ') : a.slice(0, -1).join(', ') + ' & ' + a[a.length - 1];
const slots = research.slots.map(s => {
  const ok = s.candidates.filter(c => c.isbn10 && fs.existsSync(path.join(ROOT, 'images', 'books', c.isbn10 + '.jpg')) && (c.amazonStatus === undefined || String(c.amazonStatus) !== '404'));
  return { slotId: s.slotId, slotName: s.slotName, active: ok.slice(0, 2), pool: ok.slice(2) };
});
const short = [];
for (const s of slots) if (s.active.length < 2) short.push(`${s.slotId} has ${s.active.length} cover-verified book(s)`);
const rec = (s, c) => ({ title: c.title, author: by(c.authors), description: c.description, amazonUrl: c.amazonUrl, imageUrl: `/images/books/${c.isbn10}.jpg`, tags: c.tags });
// A) static cards
const cards = slots.map((s, i) => {
  const c = s.active[0]; const d = dims(path.join(ROOT, 'images', 'books', c.isbn10 + '.jpg'));
  const img = `<img src="images/books/${c.isbn10}.jpg" alt="${esc(c.title)} book cover" width="${d.w}" height="${d.h}"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>`;
  return [
    `          <!-- ${s.slotName} -->`,
    `          <div class="book-card">`,
    `            <div class="book-cover">`,
    `              ${img}`,
    `            </div>`,
    `            <div class="book-info">`,
    `              <h3>${esc(c.title)}</h3>`,
    `              <p class="book-author">by ${esc(by(c.authors))}</p>`,
    `              <p class="book-description">${esc(c.description)}</p>`,
    `              <div class="book-meta">`,
    ...c.tags.map(t => `                <span class="book-tag">${esc(t)}</span>`),
    `              </div>`,
    `              <a href="${c.amazonUrl}" target="_blank" rel="sponsored noopener" class="book-link">View on Amazon</a>`,
    `            </div>`,
    `          </div>`,
  ].join('\n');
}).join('\n');
const file = path.join(ROOT, 'resources.html'); const html = fs.readFileSync(file, 'utf8');
const open = html.indexOf('<div class="books-grid" id="ab-books-container">'); if (open < 0) throw new Error('books-grid not found');
let depth = 0, close = -1; const tag = /<\/?div\b[^>]*>/g; tag.lastIndex = open; let t;
while ((t = tag.exec(html))) { depth += t[0].startsWith('</') ? -1 : 1; if (depth === 0) { close = t.index; break; } }
const next = html.slice(0, open) + '<div class="books-grid" id="ab-books-container">\n' + cards + '\n        ' + html.slice(close);
// B) seed + pool
const seed = { clearExisting: true, products: slots.map(s => ({ slotId: s.slotId, slotName: s.slotName, variants: s.active.map(c => rec(s, c)) })) };
const pool = { clearExisting: true, products: slots.flatMap(s => s.pool.map(c => ({ slotId: s.slotId, ...rec(s, c) }))) };
console.log(`slots ${slots.length}; active variants ${seed.products.reduce((a, p) => a + p.variants.length, 0)}; pool ${pool.products.length}; cards ${slots.length}`);
short.forEach(x => console.log('  SHORT: ' + x));
if (!CHECK) {
  fs.writeFileSync(file, next);
  fs.writeFileSync(path.join(ROOT, 'seed-data.json'), JSON.stringify(seed, null, 2) + '\n');
  fs.writeFileSync(path.join(ROOT, 'pool-data.json'), JSON.stringify(pool, null, 2) + '\n');
  console.log('written: resources.html cards, seed-data.json, pool-data.json');
}

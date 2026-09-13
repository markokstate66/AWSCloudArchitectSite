// apply-article.js - applies the Wave 2 article template to the 11 project-*.html guides.
// Markup only, inside <main>, and only in the parts [article-template] owns: it never touches
// a <pre>, a .code-block or an .architecture-diagram, and it never changes visible content text.
//
//   node harness/apply-article.js          apply
//   node harness/apply-article.js --check  report what would change, write nothing
//
// What it does, all four steps exact and idempotent (every pattern matches this script's own
// output as well as the original markup):
//   1. a stable slug id on every <h2> in the guide, so the TOC can link to it;
//   2. .guide-meta div -> <dl>, .meta-item strong -> <dt> + <dd> (same rendered text, and the
//      one-line form is ~110 B/page smaller than the three-line original);
//   3. the two .guide-navigation links move off the shared .btn-* buttons onto .guide-nav-link
//      so the pagination footer can be two quiet cards (href and link text untouched);
//   4. an "On this page" rail as the FIRST child of .project-guide, built from that page's own
//      h2s. It is data-ui + <nav>, so integrity.js excludes its text from the content snapshot;
//      its hrefs are fragment-only, which the gate also ignores. DOM-first is what puts the chip
//      row ahead of the article in tab order below 64em; at 64em+ the explicit grid placement
//      still parks it in column 2, so no CSS `order` is needed anywhere;
//   5. a stable id (step-1 ...) on every .guide-step h3, with the step number turned into an
//      anchor to its own step so a step is deep-linkable. The number text is unchanged and the
//      href is fragment-only, so neither the text nor the link snapshot moves.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const slug = (t) => t.toLowerCase().replace(/['’]/g, '').replace(/&[a-z]+;|&#\d+;/g, ' ')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function rail(ind, toc) {
  const items = toc.map(([id, text]) => `<li><a href="#${id}">${text}</a></li>`).join('');
  return [
    `${ind}<aside class="guide-aside" data-ui>`,
    `${ind}  <nav aria-label="On this page">`,
    `${ind}    <p class="guide-aside-title">On this page</p>`,
    `${ind}    <ol>${items}</ol>`,
    `${ind}  </nav>`,
    `${ind}</aside>`,
  ].join('\n');
}

function transformMain(block) {
  // drop a previously applied rail first, so step 4 always inserts exactly one
  block = block.replace(/\n[ \t]*<aside class="guide-aside"[\s\S]*?<\/aside>/, '');

  // 1. h2 ids + the table of contents for this page
  const used = new Set(), toc = [];
  block = block.replace(/<h2(?: id="[^"]*")?>([\s\S]*?)<\/h2>/g, (m, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const base = slug(text) || 'section';
    let id = base, n = 1;
    while (used.has(id)) id = `${base}-${++n}`;
    used.add(id);
    toc.push([id, text]);
    return `<h2 id="${id}">${inner}</h2>`;
  });

  // 2. key facts as a definition list
  block = block.replace(/([ \t]*)<(?:div|dl) class="guide-meta">\n([\s\S]*?)\n\1<\/(?:div|dl)>/, (m, ind, inner) => {
    const items = [];
    const re = /<div class="meta-item">\s*(?:<strong>([^<]*)<\/strong>\s*([^<]*?)|<dt>([^<]*)<\/dt>\s*<dd>([^<]*)<\/dd>)\s*<\/div>/g;
    let k;
    while ((k = re.exec(inner))) {
      const label = k[1] !== undefined ? k[1] : k[3];
      const value = (k[2] !== undefined ? k[2] : k[4]).trim();
      items.push([label.trim(), value]);
    }
    if (!items.length) return m;
    return `${ind}<dl class="guide-meta">\n`
      + items.map(([l, v]) => `${ind}  <div class="meta-item"><dt>${l}</dt><dd>${v}</dd></div>`).join('\n')
      + `\n${ind}</dl>`;
  });

  // 3. pagination footer classes: off the shared .btn-* buttons, plus a direction class taken
  //    from the href so CSS can put an honest small-caps eyebrow over each frozen link text
  //    (projects.html is the listing, not a neighbour). href and link text untouched.
  block = block.replace(/<div class="guide-navigation">[\s\S]*?\n[ \t]*<\/div>/, (nav) => {
    let k = 0;
    return nav.replace(/<a href="([^"]+)" class="[^"]*">/g, (m, href) => {
      const dir = /^projects\.html/.test(href) ? 'index' : (k ? 'next' : 'prev');
      k++;
      return `<a href="${href}" class="guide-nav-link guide-nav-${dir}">`;
    });
  });

  // 4. the rail, as the first child of .project-guide
  block = block.replace(/([ \t]*)<div class="project-guide">\n/, (m, ind) =>
    `${ind}<div class="project-guide">\n${rail(ind + '  ', toc)}\n`);

  // 5. step h3 ids + the step number as an anchor to its own step
  let n = 0;
  block = block.replace(/<div class="step-number">(?:<a href="#step-\d+">)?([\s\S]*?)(?:<\/a>)?<\/div>([\s\S]*?)<h3(?: id="step-\d+")?>/g,
    (m, num, mid) => { const id = `step-${++n}`; return `<div class="step-number"><a href="#${id}">${num}</a></div>${mid}<h3 id="${id}">`; });
  return block;
}

const pages = fs.readdirSync(ROOT).filter(f => /^project-.*\.html$/.test(f)).sort();
const results = [];
for (const page of pages) {
  const file = path.join(ROOT, page);
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = /\r\n/.test(raw);
  const before = raw.replace(/\r\n/g, '\n');
  const s = before.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, (m) => transformMain(m));
  results.push([page, s === before ? 'unchanged' : 'updated', s.length - before.length]);
  if (!CHECK && s !== before) fs.writeFileSync(file, crlf ? s.replace(/\n/g, '\r\n') : s);
}
for (const [p, st, d] of results) {
  console.log(`${st === 'updated' ? (CHECK ? 'WOULD UPDATE' : 'updated') : st.padEnd(12)}  ${p}  ${d >= 0 ? '+' : ''}${d} B`);
}
console.log(`${results.filter(r => r[1] === 'updated').length}/${results.length} pages ${CHECK ? 'would change' : 'written'}`);

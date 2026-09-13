// apply-shell.js - applies the Wave 1 page shell to every public page so the chrome is
// byte-identical across the site. Exact block replacement, re-runnable (every pattern
// matches both the original markup and this script's own output).
//
//   node harness/apply-shell.js          apply
//   node harness/apply-shell.js --check  report what would change, write nothing
//
// It never touches visible content: it rewrites chrome markup, moves inline CSS into
// styles.css's place (a single normal <link>), adds the breadcrumb / page
// header band, and adds aria-level to the footer headings (heading-order fix that does
// not change any heading's text).
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const NAV = [
  ['Roadmap', '#roadmap', 'index.html#roadmap'],
  ['Certifications', '#certifications', 'index.html#certifications'],
  ['Interview Prep', 'interview-prep.html', 'interview-prep.html'],
  ['Projects', 'projects.html', 'projects.html'],
  ['Resources', 'resources.html', 'resources.html'],
  ['Tools', 'tools.html', 'tools.html'],
];

// page -> breadcrumb trail before the current page ([] = straight off Home)
const PAGES = {
  'index.html': { home: true },
  'projects.html': { trail: [] },
  'resources.html': { trail: [] },
  'tools.html': { trail: [] },
  'interview-prep.html': { trail: [] },
  'about.html': { trail: [] },
  'contact.html': { trail: [] },
  'privacy.html': { trail: [] },
};
for (const f of fs.readdirSync(ROOT)) {
  if (/^project-.*\.html$/.test(f)) PAGES[f] = { trail: [['Projects', 'projects.html']] };
}

const MARK = '<svg class="brand-mark" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 10.1a6.2 6.2 0 0 0-11.7-1.6 4.8 4.8 0 0 0 .6 9.5h10.6a4 4 0 0 0 .5-7.9Z"/></svg>';

function header(page, home) {
  const cur = NAV.find(n => n[2] === page);
  const links = NAV.map(([label, hrefHome, href]) => {
    const h = home ? hrefHome : href;
    const a = cur && cur[0] === label ? ' aria-current="page"' : '';
    return `<li><a href="${h}"${a}>${label}</a></li>`;
  }).join('');
  const mark = `${MARK}<span class="logo-text">AWS Cloud Architect Guide</span>`;
  const brand = home
    ? `            <span class="brand">${mark}</span>`
    : `            <a class="brand" href="index.html">${mark}</a>`;
  return [
    '    <header class="site-header">',
    '        <nav class="site-header-inner" aria-label="Main">',
    brand,
    `            <ul class="site-nav" id="site-nav">${links}</ul>`,
    '            <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>',
    '        </nav>',
    '    </header>',
    '',
  ].join('\n');
}

function breadcrumb(trail, title) {
  const crumbs = [`<li><a href="index.html">Home</a></li>`]
    .concat(trail.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`))
    .concat([`<li><span aria-current="page">${title}</span></li>`]).join('');
  return [
    '    <nav class="breadcrumbs" aria-label="Breadcrumb" data-ui>',
    `        <ol class="container">${crumbs}</ol>`,
    '    </nav>',
    '',
  ].join('\n');
}

// plain text of the page's <h1> (tags stripped, entities kept as authored)
function h1Text(src) {
  const m = src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

const results = [];
for (const page of Object.keys(PAGES).sort()) {
  const file = path.join(ROOT, page);
  if (!fs.existsSync(file)) { results.push([page, 'MISSING']); continue; }
  // normalise to LF for matching, write back with the repo's CRLF endings
  const raw = fs.readFileSync(file, 'utf8');
  const crlf = /\r\n/.test(raw);
  const before = raw.replace(/\r\n/g, '\n');
  let s = before;
  const home = !!PAGES[page].home;

  // 1. <html> carries no-js so the ad-well collapse rule can be scoped under .js
  s = s.replace(/<html lang="en"(?: class="no-js")?>/, '<html lang="en" class="no-js">');

  // 2. one normal stylesheet link: drop the inline "critical CSS" + preload/onload trick
  s = s.replace(/[ \t]*<!-- Critical CSS for above-fold content -->\n[ \t]*<style>\n[\s\S]*?<\/style>\n\n?[ \t]*<!-- Preload and async load full stylesheet -->\n[ \t]*<link rel="preload" href="styles\.css"[^>]*>\n[ \t]*<noscript><link rel="stylesheet" href="styles\.css"><\/noscript>\n/,
    '    <link rel="stylesheet" href="styles.css">\n');
  // contact.html inlined its form styles; they now live in styles.css [static-pages]
  s = s.replace(/\n[ \t]*<style>\n[ \t]*\.contact-form \{[\s\S]*?<\/style>\n/, '\n');

  // 3. shell: header (replaces the old fixed header in either form). The skip anchor is
  //    held back: integrity.js records any "#id" href as the link target "(self)", which
  //    18 of 20 baselines do not contain. See docs/rounds/wave1-builder.md.
  s = s.replace(/[ \t]*<a class="skip-link"[^>]*>[\s\S]*?<\/a>\n/, '');
  const hdr = /[ \t]*<header class="(?:header|site-header)">[\s\S]*?<\/header>\n\n?/;
  if (hdr.test(s)) s = s.replace(hdr, header(page, home));

  // 4. <main id="main">: named skip target, ready for the skip anchor
  s = s.replace(/<main(?: id="main")?>/, '<main id="main">');

  // 5. breadcrumbs under the header on every non-home page
  s = s.replace(/[ \t]*<nav class="breadcrumbs"[\s\S]*?<\/nav>\n\n?/, '');
  if (!home) s = s.replace(/(<\/header>\n)\n?/, '$1' + breadcrumb(PAGES[page].trail, h1Text(s)));

  // 6. hero -> editorial page header band (paper, not a navy gradient)
  const heroRe = /[ \t]*<section class="(?:hero|home-hero|page-header)"[^>]*>\n[ \t]*<div class="(?:hero-content|container)">\n([\s\S]*?)\n[ \t]*<\/div>\n([ \t]*<\/div>\n)?[ \t]*<\/section>/;
  const hm = s.match(heroRe);
  if (hm) {
    let inner = hm[1]
      .replace(/<span class="(?:page-eyebrow )?(project-level level-\w+)"[^>]*>/, '<span class="page-eyebrow $1">');
    const cls = home ? 'home-hero' : 'page-header';
    // function form: the hero text contains "$150K+", which a string replacement
    // would read as a capture-group reference.
    s = s.replace(heroRe, () => [
      `        <section class="${cls}">`,
      '            <div class="container">',
      inner,
      '            </div>',
      '        </section>',
    ].join('\n'));
  }

  // 7. footer: restyle hook + aria-level on its headings (heading-order; text untouched)
  s = s.replace(/<footer class="(?:footer|site-footer)">/, '<footer class="site-footer">');
  s = s.replace(/(<footer class="site-footer">[\s\S]*?<\/footer>)/, (block) =>
    block.replace(/<h4(?: aria-level="2")?>/g, '<h4 aria-level="2">'));

  // 8. tools.html: the tool-card headings follow an <h2>, so mark them level 3
  if (page === 'tools.html') {
    s = s.replace(/(<div class="tool-card">\s*<div class="tool-icon">[\s\S]*?<\/div>\s*)<h4(?: aria-level="3")?>/g, '$1<h4 aria-level="3">');
  }

  results.push([page, s === before ? 'unchanged' : 'updated']);
  if (!CHECK && s !== before) fs.writeFileSync(file, crlf ? s.replace(/\n/g, '\r\n') : s);
}
for (const [p, st] of results) console.log(`${st === 'updated' ? (CHECK ? 'WOULD UPDATE' : 'updated') : st.padEnd(9)}  ${p}`);
console.log(`${results.filter(r => r[1] === 'updated').length}/${results.length} pages ${CHECK ? 'would change' : 'written'}`);

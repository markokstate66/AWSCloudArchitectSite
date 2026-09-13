// Minimal static server for local verification. Mirrors the SWA config where it matters:
//   /            -> index.html
//   /foo.html    -> foo.html
//   missing file -> 404.html with a real 404 status (note: production SWA rewrites unknown
//                   routes to index.html with HTTP 200 — see docs/HUMAN_TODO.md)
//   /harness/*, /docs/*, /api/* are not served (production blocks /harness and /docs via
//   staticwebapp.config.json; /api is Azure Functions and is stubbed here).
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4173);
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff' };

// Defence in depth: every locally served HTML page gets a CSP meta that forbids third-party scripts,
// so even a throwaway script that forgets the Playwright ad-block route can never execute the
// AdSense/GA loaders (the <script> tags stay in the DOM for the integrity gate; they just do not run).
const LOCAL_CSP = `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-src 'none'">`;
function send(res, status, file) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(status, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  if (ext === '.html') {
    // Point the two third-party loaders at same-origin empty stubs: no network request, no CSP console
    // error, and the src still contains the substrings the integrity gate keys on.
    const html = fs.readFileSync(file, 'utf8').replace(/<head>/i, '<head>' + LOCAL_CSP)
      .replace('https://www.googletagmanager.com/gtag/js?id=', '/__stub/gtag/js?id=')
      .replace('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=', '/__stub/pagead/js/adsbygoogle.js?client=');
    return res.end(html);
  }
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath.startsWith('/__stub/')) { res.writeHead(200, { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store' }); return res.end('/* third-party loader stubbed by the local harness */'); }
  if (urlPath.startsWith('/api/')) {
    // Stub the Functions API so pages behave deterministically offline.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (urlPath === '/api/products' || urlPath === '/api/pool') return res.end('[]');
    return res.end('{"stub":true}');
  }
  if (/^\/(harness|docs|\.git|\.github|node_modules)(\/|$)/.test(urlPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('blocked');
  }
  if (urlPath === '/') urlPath = '/index.html';
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (!err && st.isFile()) return send(res, 200, file);
    return send(res, 404, path.join(ROOT, '404.html'));
  });
});
server.listen(PORT, '127.0.0.1', () => console.log(`serving ${ROOT} at http://127.0.0.1:${PORT}`));

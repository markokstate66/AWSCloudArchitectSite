// Route-layer ad/analytics blocking + labelled placeholders. Used by every Playwright run.
const { BLOCKED_HOST_RE } = require('./pages');
async function installAdBlock(context, log) {
  await context.route('**/*', (route) => {
    const url = route.request().url();
    let host = '';
    try { host = new URL(url).hostname; } catch (e) {}
    if (host && host !== '127.0.0.1' && host !== 'localhost') {
      if (log) log.blocked.push(url);
      // Serve an empty JS/204 so async loaders do not throw network errors.
      const isScript = route.request().resourceType() === 'script';
      return route.fulfill(isScript ? { status: 200, contentType: 'application/javascript', body: '/* blocked by harness */' } : { status: 204, body: '' });
    }
    return route.continue();
  });
}
// After load: paint every ad slot with a clearly labelled placeholder so screenshots show
// where a slot sits and how much height it reserves. Never fetches anything.
const PLACEHOLDER_JS = `(() => {
  const slots = document.querySelectorAll('ins.adsbygoogle, [data-ad-slot], .ad-slot');
  slots.forEach((el, i) => {
    el.setAttribute('data-harness-placeholder', '1');
    el.style.outline = '2px dashed #d97706';
    el.style.background = 'repeating-linear-gradient(45deg,#fff3e0,#fff3e0 10px,#ffe0b2 10px,#ffe0b2 20px)';
    el.style.display = el.style.display || 'block';
    if (!el.querySelector('.harness-ad-label')) {
      const l = document.createElement('div');
      l.className = 'harness-ad-label';
      l.textContent = 'AD PLACEHOLDER (harness) #' + (i + 1);
      l.style.cssText = 'font:600 12px/1.4 system-ui;color:#92400e;text-align:center;padding:4px';
      el.appendChild(l);
    }
  });
  return slots.length;
})()`;
module.exports = { installAdBlock, PLACEHOLDER_JS };

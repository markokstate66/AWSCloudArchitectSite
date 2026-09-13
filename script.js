/* Nav drawer (+ focus trap), FAQ, code copy, guide rail, ad-well collapse. No deps, deferred,
   defensive: a missing element never throws. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.className = (root.className || '').replace(/\bno-js\b/, '').trim();
  root.classList.add('js');

  /* --- nav drawer: closes on link, outside tap, Escape; Tab cycles the open header --- */
  var tog = d.querySelector('.nav-toggle'), nav = d.getElementById('site-nav');
  if (tog && nav) {
    var isOpen = () => tog.getAttribute('aria-expanded') === 'true';
    var open = on => {
      tog.setAttribute('aria-expanded', on ? 'true' : 'false');
      nav.classList.toggle('is-open', on);
      root.classList.toggle('nav-open', on);
    };
    tog.addEventListener('click', () => open(!isOpen()));
    d.addEventListener('click', e => {
      if (!isOpen() || !e.target.closest) return;
      if (e.target.closest('.site-nav a') || !e.target.closest('.site-header')) open(false);
    });
    d.addEventListener('keydown', e => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { open(false); tog.focus(); return; }
      if (e.key !== 'Tab') return;
      var f = [tog, ...nav.querySelectorAll('a')];
      var n = f.indexOf(d.activeElement) + (e.shiftKey ? -1 : 1);
      e.preventDefault();
      f[(n + f.length) % f.length].focus();
    });
  }

  /* --- FAQ: aria-expanded + the answer as a named region --- */
  var items = d.querySelectorAll('.faq-item');
  var setFaq = (item, on) => {
    var q = item.querySelector('.faq-question');
    if (q) q.setAttribute('aria-expanded', on ? 'true' : 'false');
    item.classList.toggle('is-open', on);
  };
  items.forEach((item, n) => {
    var q = item.querySelector('.faq-question'), a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.id = q.id || 'faq-q-' + n;
    a.id = a.id || 'faq-a-' + n;
    q.setAttribute('aria-expanded', 'false');
    q.setAttribute('aria-controls', a.id);
    a.setAttribute('role', 'region');
    a.setAttribute('aria-labelledby', q.id);
    q.addEventListener('click', () => {
      var was = q.getAttribute('aria-expanded') === 'true';
      items.forEach(x => setFaq(x, false));
      if (!was) setFaq(item, true);
    });
  });

  /* --- code blocks: copy button + keyboard-reachable scrollport --- */
  d.querySelectorAll('.code-block').forEach(box => {
    var head = box.querySelector('.code-header'), pre = box.querySelector('pre');
    if (pre && !pre.hasAttribute('tabindex')) pre.setAttribute('tabindex', '0');
    if (!head || !pre || head.querySelector('.code-copy')) return;
    var b = d.createElement('button');
    b.type = 'button';
    b.className = 'code-copy';
    b.setAttribute('data-ui', '');
    b.setAttribute('aria-label', 'Copy code');
    b.textContent = 'Copy';
    head.appendChild(b);
  });
  d.addEventListener('click', e => {
    var b = e.target && e.target.closest && e.target.closest('.code-copy');
    if (!b) return;
    var box = b.closest('.code-block'), pre = box && box.querySelector('pre');
    if (!pre || !navigator.clipboard) return;
    var say = (t, l) => { b.textContent = t; b.setAttribute('aria-label', l); };
    navigator.clipboard.writeText(pre.innerText).then(() => {
      say('Copied', 'Code copied to clipboard');
      b.classList.add('is-done');
      setTimeout(() => { say('Copy', 'Copy code'); b.classList.remove('is-done'); }, 1800);
    }, () => {});
  });

  /* --- guide rail: aria-current follows the h2 in view; >=64em only --- */
  var rl = [...d.querySelectorAll('.guide-aside a')].filter(a => (a.t = d.querySelector(a.hash))),
  o = new IntersectionObserver(() => { var k = rl[0]; rl.forEach(a => { if (a.t.getBoundingClientRect().top < 120) k = a }); rl.forEach(a => a.ariaCurrent = a == k ? 'location' : null) }, { rootMargin: '-120px 0px 99999px' });
  if (innerWidth > 1023) rl.forEach(a => o.observe(a.t));

  /* --- ad wells: collapse only on unfilled AND never seen --- */
  var io = new IntersectionObserver(es => es.forEach(n => { if (n.isIntersecting) { n.target.seen = 1; io.unobserve(n.target) } }));
  d.querySelectorAll('.ad-well').forEach(w => {
    var a = w.querySelector('ins.adsbygoogle, ins.adsbygoogle-demo');
    if (!a) return;
    io.observe(w);
    new MutationObserver(() => {
      if (!w.seen && a.dataset.adStatus === 'unfilled') w.classList.add('is-unfilled');
    }).observe(a, { attributes: true, attributeFilter: ['data-ad-status'] });
  });
})();

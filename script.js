/* Site behaviour: mobile nav drawer, FAQ accordion, code copy buttons.
   No dependencies, deferred, defensive: a missing element never throws.
   Scroll-in animations were removed (they hid content and cost INP). */
(function () {
  'use strict';
  var d = document, root = d.documentElement, i;
  root.className = (root.className || '').replace(/\bno-js\b/, '').trim();
  root.classList.add('js');

  /* --- mobile nav drawer: aria-expanded + html.nav-open (scrim + scroll lock in CSS).
         Closes on link click, on a tap outside the header (the scrim) and on Escape. --- */
  var tog = d.querySelector('.nav-toggle'), nav = d.getElementById('site-nav');
  if (tog && nav) {
    var isOpen = function () { return tog.getAttribute('aria-expanded') === 'true'; };
    var open = function (on) {
      tog.setAttribute('aria-expanded', on ? 'true' : 'false');
      nav.classList.toggle('is-open', on);
      root.classList.toggle('nav-open', on);
    };
    tog.addEventListener('click', function () { open(!isOpen()); });
    d.addEventListener('click', function (e) {
      if (!isOpen() || !e.target.closest) return;
      if (e.target.closest('.site-nav a') || !e.target.closest('.site-header')) open(false);
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { open(false); tog.focus(); }
    });
  }

  /* --- FAQ accordion: button + aria-expanded, answer is a named region --- */
  var items = d.querySelectorAll('.faq-item');
  var setFaq = function (item, on) {
    var q = item.querySelector('.faq-question');
    if (q) q.setAttribute('aria-expanded', on ? 'true' : 'false');
    item.classList.toggle('is-open', on);
  };
  for (i = 0; i < items.length; i++) (function (item, n) {
    var q = item.querySelector('.faq-question'), a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.id = q.id || 'faq-q-' + n;
    a.id = a.id || 'faq-a-' + n;
    q.setAttribute('aria-expanded', 'false');
    q.setAttribute('aria-controls', a.id);
    a.setAttribute('role', 'region');
    a.setAttribute('aria-labelledby', q.id);
    q.addEventListener('click', function () {
      var was = q.getAttribute('aria-expanded') === 'true';
      for (var j = 0; j < items.length; j++) setFaq(items[j], false);
      if (!was) setFaq(item, true);
    });
  })(items[i], i + 1);

  /* --- code blocks: copy button + keyboard-reachable scroll region --- */
  var blocks = d.querySelectorAll('.code-block');
  for (i = 0; i < blocks.length; i++) {
    var head = blocks[i].querySelector('.code-header'), pre = blocks[i].querySelector('pre');
    if (pre && !pre.hasAttribute('tabindex')) pre.setAttribute('tabindex', '0');
    if (!head || !pre || head.querySelector('.code-copy')) continue;
    var b = d.createElement('button');
    b.type = 'button';
    b.className = 'code-copy';
    b.setAttribute('data-ui', '');
    b.setAttribute('aria-label', 'Copy code');
    b.textContent = 'Copy';
    head.appendChild(b);
  }
  /* --- guide rail: aria-current follows the h2 in view; >=64em only --- */
var rl=[...d.querySelectorAll('.guide-aside a')].filter(a=>(a.t=d.querySelector(a.hash))),
o=new IntersectionObserver(()=>{var k=rl[0];rl.forEach(a=>{if(a.t.getBoundingClientRect().top<120)k=a});rl.forEach(a=>a.ariaCurrent=a==k?'location':null)},{rootMargin:'-120px 0px 99999px'});
if(innerWidth>1023)rl.forEach(a=>o.observe(a.t));

  d.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.code-copy');
    if (!b) return;
    var box = b.closest('.code-block'), pre = box && box.querySelector('pre');
    if (!pre || !navigator.clipboard) return;
    var say = function (t, l) { b.textContent = t; b.setAttribute('aria-label', l); };
    navigator.clipboard.writeText(pre.innerText).then(function () {
      say('Copied', 'Code copied to clipboard');
      b.classList.add('is-done');
      setTimeout(function () { say('Copy', 'Copy code'); b.classList.remove('is-done'); }, 1800);
    }, function () { /* clipboard denied: leave the label alone */ });
  });
})();

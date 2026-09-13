# Wave 1 builder — design-system + layout-shell (round 1)

Date: 2026-09-13 · Branch: `facelift` · Areas: **design-system**, **layout-shell**
Label for all harness output: `wave1-r1` · Integrity base: `baseline-2026-09-13`

---

## 1. What changed

### Files

| File | Change |
|------|--------|
| `styles.css` | **Rewritten** (35,333 B, was 35,518 B). Seven marked sections, mobile-first, min-width queries only, `prefers-reduced-motion` respected. All legacy CSS deleted: blog styles (`.blog-*`), `.ad-container` / `.ad-placeholder` / `.ad-banner` / `.ad-rectangle`, every gradient, every card drop-shadow, the pill-radius button family, the fixed-header offsets. |
| `script.js` | **Rewritten** (3,347 B, was 3,386 B), `defer`, no dependencies, wrapped so a missing element never throws. Scroll-in `IntersectionObserver` opacity animations, the scroll-handler header shadow and the JS smooth-scroll are **gone** (the last is now `scroll-behavior` + `scroll-padding-top` in CSS). |
| `harness/apply-shell.js` | **New.** Applies the shell to the 19 chrome-carrying pages by exact block replacement. Idempotent (`--check` reports `0/19 would change` after a run) and line-ending aware. |
| 19 × `*.html` | Chrome replaced by the script: header, nav, breadcrumbs, page-header band, footer hooks, stylesheet loading, `<main id="main">`, `<html class="no-js">`. |
| `404.html` | Hand-edited (it carries no shared chrome and must stay self-contained). Content wrapped in `<main id="main">`, inline CSS restyled onto the new tokens. |
| `harness/out/menu-shot.js`, `harness/out/interact-check.js`, `harness/out/faq-shot.js` | Throwaway Playwright checks for the drawer / FAQ / copy button (in `harness/out/`, which is git-ignored). |

### Design system (`/* ==== [design-system] ==== */`)

- **Tokens**: paper `#faf9f6` / alt band `#f4f2ec` / card `#fff`, hairlines `#e6e2da`–`#d8d2c6`, ink
  `#1a1d21` (15.1:1) / `#4a5159` (7.5:1) / `#596169` (6.0:1). One accent family: `#c2410c` (4.9:1)
  for links, `#9a3412` (6.9:1) for hover/headline accent/tag text, `#ff9900` **fill only** behind
  navy ink (7.7:1). Navy `#15202b` is used for exactly four things: header, footer, code blocks,
  diagram/inset surfaces. Semantic tints for the level and difficulty badges, all ≥ 6:1.
- **Type**: no webfonts. `--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, sans-serif`,
  `--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`.
  Body 17 px / 1.65 on mobile **and** desktop, prose measure 68 ch, scale `--fs--1 … --fs-6`
  (13 → 38 px mobile, 13 → 48 px from 48em), headings 680–750 weight with negative tracking.
- **Scales**: `--sp-1 … --sp-8`, `--radius: 8px` / `--radius-sm: 5px`, one shadow
  (`--shadow-drawer`, used only by the mobile nav drawer), `--z-header/--z-drawer/--z-skip`,
  `--focus: 2px solid var(--accent)` applied via a single `:focus-visible` rule with 2 px offset.
- **Primitives**: buttons (filled = orange fill + navy ink, quiet = hairline outline), pill tags,
  level/difficulty badges, the checkmark feature list (now a drawn CSS tick, not an emoji glyph),
  form fields.

### Layout shell (`/* ==== [layout-shell] ==== */`)

- **Sticky header**, 56 px mobile / 64 px desktop, navy, with an inline SVG cloud mark (24 px,
  `aria-hidden`) plus the unchanged wordmark. Nothing is hidden beneath it any more — the old
  `position: fixed` header plus 140–160 px of hero padding is gone.
- **Nav** is `<nav aria-label="Main">` wrapping the brand, `<ul class="site-nav" id="site-nav">` and
  the toggle. Same six links, same targets per page (`index.html` keeps `#roadmap` / `#certifications`,
  every other page keeps `index.html#…`). The current page's link carries `aria-current="page"`
  (orange underline). Drawer below 60em, inline row from 60em — the break is at **60em, not 48em**,
  because at 768 px the six labels wrapped to a second line and pushed the header out of shape.
- **Mobile menu button** with `aria-expanded` + `aria-controls="site-nav"`, animating to an ×.
  Closes on link click and on Escape (verified, see §5).
- **Breadcrumbs** on every non-home page: `<nav class="breadcrumbs" aria-label="Breadcrumb" data-ui>`
  with `Home › (Projects ›) <h1 text>`, the `h1` text read out of each page at build time by the
  script. Last crumb is a `<span aria-current="page">`. No breadcrumb JSON-LD was added.
- **Page header band** replaces the navy gradient hero everywhere. Home: paper band, `h1` at
  `--fs-6` capped at 40 ch, subtitle, the three stats as a quiet hairline-ruled inline row, one CTA.
  Other pages: compact title block, with the existing level badge as the eyebrow on project pages.
- **Footer**: same four columns, same text and links, restyled as a quiet navy band with a top
  hairline. Small text is now `#a9b6c2` on `#15202b` = **8.0:1** (the 50–70 % white was failing).
- **Layout grid**: `.container` (1200 px, 24/32 px gutters), `.section` / `.section-alt` bands with
  hairline rules, `.content-grid` with explicitly placed items at ≥ 64em.

### Article shell base for Wave 2

At ≥ 64em `.project-guide` becomes a grid, `grid-template-columns: minmax(0, 68ch) auto`, centred.
Every non-aside child is pinned to `grid-column: 1`; a future `.guide-aside` is pinned to
`grid-column: 2; grid-row: 1 / -1`. **Nothing relies on auto-placement**, so a sidebar placed first
in DOM can never claim row 1 and open a void. With no aside present the second track resolves to
0 and the article is simply centred (verified at 1440 — see §6).

### Ad presentation

`.ad-well` / `.ad-well-label` (`data-ui`) / `.ad-well-slot` defined in CSS only, height reserved via
`--ad-h` (280 px default). The collapse rule is
`.js .ad-well:has(> .ad-well-slot > ins[data-ad-status="unfilled"]) { display: none; }` —
scoped under `.js` (set on `<html>` by `script.js`, which also clears `no-js`), so with JS off a well
never collapses and CSS never fights the JS decision. **No `<ins class="adsbygoogle">` was added
anywhere**; the site still has zero manual units.

---

## 2. Design decisions and assumptions

1. **Card CTAs are quiet, not orange.** Three orange "View Guide" buttons per row read as a template.
   `.project-link` / `.book-link` / `.course-link` are hairline-outline buttons; the orange fill is
   reserved for page-level primary actions (hero CTA, calculator, contact submit, guide "Back to All
   Projects"). Partner pink is kept for Pluralsight links but as an outline at 7.5:1.
2. **No eyebrow on non-project page headers.** The brief allows "level badge **or** section name";
   a section name would be *new visible text* that would have to hide behind `data-ui`. The
   breadcrumb already carries that information, so pages without a badge get no eyebrow.
3. **The home logo stays unlinked.** `index.html`'s baseline has no `index.html` link target;
   linking the brand there would add one and fail the gate. Every other page keeps its existing
   `index.html` brand link.
4. **`.info-card` and the Pluralsight promo stay navy.** Both carry hard-coded inline white text in
   the frozen markup, so they have to remain dark surfaces. Their tags were re-tinted to 10.9:1.
5. **Uppercase is only used where the baseline stylesheet already used it** (`.cert-level`,
   `.stat-label`, `.code-label`, `.code-lang`, `.arch-group-label`, `.course-level`, `.ps-logo`).
   `innerText` applies `text-transform`, and the integrity gate compares rendered text — adding
   uppercase to the footer headings, field labels, meta labels or the level badges turned
   "Advanced" into "ADVANCED" in the snapshot and **failed the content gate**. Other eyebrows use
   weight + tracking + size + colour instead.
6. **The FAQ answer is collapsed with `max-height`, not `[hidden]`.** The brief asked for a `hidden`
   attribute; that is `display: none`, which removes the answers from `innerText`, which deletes
   them from the page-text snapshot and fails the content gate (the baseline text contains every
   FAQ answer, because the old CSS also used a `max-height` collapse). The accordion is otherwise
   fully correct: `<button>` with `aria-expanded` + `aria-controls`, answer is
   `role="region"` + `aria-labelledby` pointing at the question. No focusable content lives inside
   a collapsed answer, so nothing is keyboard-trapped. **Flagged for the panel** — if the panel
   prefers `[hidden]`, it needs a gate change or an approval, not a CSS change.
7. **`heading-order` was fixed with `aria-level`, not by re-tagging.** The gate records headings as
   `TAG:text`, so `h4 → h2` in the footer is a content diff on 16 pages. Instead the applier adds
   `aria-level="2"` to the four footer `<h4>`s (and `aria-level="3"` to the four `tools.html`
   `.tool-card` `<h4>`s, which also skipped a level). axe and Lighthouse read `aria-level`;
   the tag names, and therefore the gate snapshot, are untouched. Lighthouse `heading-order` now
   passes on every page.
8. **`scrollable-region-focusable`** (42 `<pre>` blocks, serious, 11 pages) is fixed by `script.js`
   setting `tabindex="0"` on each `.code-block pre` in the same pass that injects the copy button —
   no markup change in files owned by `code-and-diagrams`. Wave 2 may move it into the markup.
9. **Line endings.** The baseline working tree served `*.html`, `styles.css` and `script.js` with LF;
   a `git checkout` on this Windows box (`core.autocrlf=true`) rewrites them to CRLF and silently
   adds 350–550 B per file, which broke the per-page weight budget. All served files are normalised
   back to **LF**, which is also what the Linux CI checkout deploys. Re-running `git checkout -- '*.html'`
   will re-inflate them; run `node harness/apply-shell.js` and re-normalise if that happens.

---

## 3. Blocked: the skip link

**"Skip to content" is not shipped this round.** `harness/integrity.js` builds the per-page internal
link set as:

```js
(h.replace(/^https?:\/\/(www\.)?awscloudarchitect\.com/, '').replace(/#.*$/, '') || '(self)')
```

so **any** same-page `href="#…"` collapses to the pseudo-target `(self)`. Only `index.html` has
`(self)` in the frozen baseline (from `#roadmap`), so a skip link adds a new internal target on the
other **18** pages → `INTEGRITY: FAIL (18 content)`. Verified: with the skip link present the gate
failed exactly on `internalLinks` for those 18 pages; without it the gate passes.

Every alternative was checked and rejected: `href=""` / `href="#"` (does not work as a skip link),
`href="<self>.html#main"` (works, but 12 of 20 pages do not already self-link, so it still adds a
target), `javascript:` (blocked by the site CSP), injecting the anchor from JS (the gate captures
after `load`, so it sees it), `<noscript>` (invisible to real users).

What *did* ship: every page now has `<main id="main">`, so the skip target exists and
Lighthouse/axe `bypass` passes on the `<main>` landmark (a11y is 100 on all seven audited pages).
Adding the anchor is a one-line change in `harness/apply-shell.js` once the integrator decides
between:

- **(a)** a one-line gate fix — drop fragment-only hrefs from `internalLinks`, which is what
  ARCHITECTURE/the brief already say is allowed ("on-page `#anchors` to existing ids are fine"); or
- **(b)** an `internalLinks` approval per page in `docs/APPROVALS.json`.

I did not touch the gate, the baseline or `docs/APPROVALS.json`.

---

## 4. Harness numbers

### Lighthouse mobile — `harness/out/wave1-r1/lighthouse/summary.json`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight |
|------|------|------|----|-----|-----|-----|-----|--------|
| index.html | **100** (87) | **100** (92) | 100 (100) | 92 (92) | 1.53 s (1.53) | **0** (0.254) | 0 ms | 73 KB (77) |
| projects.html | 100 (100) | **100** (95) | 100 (100) | 100 (100) | 1.53 s (1.53) | 0 (0) | 0 ms | 67 KB (69) |
| resources.html | 99 (99) | **100** (95) | 100 (100) | 100 (100) | 2.10 s (2.10) | **0** (0.009) | 0 ms | 361 KB (339) |
| tools.html | **100** (95) | **100** (98) | 100 (100) | 92 (92) | 1.53 s (1.53) | **0** (0.141) | 0 ms | 60 KB (62) |
| interview-prep.html | **100** (98) | 100 (100) | 100 (100) | 100 (100) | 1.53 s (1.68) | **0** (0.090) | 0 ms | 80 KB (82) |
| about.html | 100 (100) | **100** (93) | 100 (100) | 100 (100) | 1.38 s (1.38) | 0 (0) | 0 ms | 49 KB (51) |
| project-multi-account-landing-zone.html | 100 (100) | **100** (92) | 100 (100) | 100 (100) | 1.53 s (1.53) | 0 (0) | 0 ms | 62 KB (62) |

(baseline in brackets, from `docs/INVENTORY.md` §5). `bf-cache` is the only remaining binary audit
failure on every page — the local server sends `Cache-Control: no-store`; INVENTORY says to ignore
it locally. `color-contrast` and `heading-order` no longer appear on any page.

**Budgets**: Perf ≥ 95 ✅ (min 99) · A11y 100 ✅ · BP 100 ✅ · SEO 100 ❌ on two pages (see §7) ·
LCP ≤ 1.8 s ✅ except `resources.html` at 2.10 s (unchanged from baseline; it is the eight book
JPEGs, 1.1 MB on disk — owned by `listing-pages`/images, not this area) · CLS ≤ 0.05 ✅ (0 everywhere) ·
TBT 0 ms.

### Playwright / axe — `harness/out/wave1-r1/summary.json` (20 public pages × 390/768/1440 = 60 runs)

| Check | Result |
|-------|--------|
| Console errors / page errors | **0 / 0** on all 60 runs (admin.html's single `/.auth/me` 404 is the known local-only one, same as baseline) |
| Failed requests | **0** |
| axe serious + critical | **0** (baseline: 146 `color-contrast` nodes over 16 pages, 42 `scrollable-region-focusable` nodes over 11 pages) |
| axe violations of **any** impact | **0** across all 60 runs (baseline had up to 3 per page: `color-contrast`, `heading-order`, `landmark-one-main`, `region`) |
| Horizontal overflow | none at 390 / 768 / 1440 |
| Lab CLS | **0** on every page at every width (baseline up to 0.16 on listing/static pages) |

### Page weight (transfer, 390 px) and JS

| Page | KB now | KB base | | Page | KB now | KB base |
|------|--------|---------|-|------|--------|---------|
| index.html | 72 | 76 | | project-static-website.html | 56 | 56 |
| projects.html | 66 | 69 | | project-serverless-contact-form.html | 58 | 58 |
| resources.html | 421 | 424 | | project-ec2-web-server.html | 57 | 57 |
| tools.html | 59 | 62 | | project-three-tier-web-app.html | 58 | 59 |
| interview-prep.html | 79 | 82 | | project-cicd-pipeline.html | 59 | 59 |
| about.html | 49 | 51 | | project-serverless-rest-api.html | 59 | 59 |
| contact.html | 47 | 49 | | project-infrastructure-as-code.html | 60 | 60 |
| privacy.html | 50 | 53 | | project-multi-region-active-active.html | 60 | 60 |
| 404.html | 3 | 3 | | project-kubernetes-eks.html | 60 | 60 |
| | | | | project-realtime-data-pipeline.html | 61 | 61 |
| | | | | project-multi-account-landing-zone.html | 62 | 62 |

Every page is at or below baseline. JS transfer 3,647 B (baseline 3,686 B) on every page;
9,386 B on `resources.html` (baseline 9,425 B) because of `abtest.js`.

⚠️ **Headroom warning for Wave 2**: the eleven project pages clear the byte budget by only
**110–122 bytes**. `styles.css` is 35,333 B against a 35,518 B baseline — 185 B of slack for the
four Wave 2 areas combined. Any net growth on a project page must be paid for elsewhere.

### Integrity

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

Zero ad/tracking problems, zero rejected approvals, `docs/APPROVALS.json` still empty.
UI-chrome text recorded by the gate (all of it inside `data-ui` or `<button>`): the 19 breadcrumb
trails and `"Copy"`. No content text was added anywhere.

---

## 5. Behaviour verification (`harness/out/interact-check.js`, `menu-shot.js`)

```
faq initial aria-expanded: false   aria-controls: faq-a-1
faq after click:           true    answer height: 276px
faq after Enter:           false                       (keyboard close works)
copy buttons: 3 | pre[tabindex=0]: 3 | label after click: "Copied"
clipboard starts: "{\r\n    \"Version\": \"2012-10-17\",\r\n    \"St"
label after 1.5 s: "Copy"
console errors: 0
index.html                              open: true true | after Escape: false false
project-multi-account-landing-zone.html open: true true | after Escape: false false
```

---

## 6. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|------|-----------|
| `index@390+0.png` | Paper hero, 56 px navy header with cloud mark, h1 with the accent phrase in `#9a3412`, hairline-ruled stats row, one orange CTA. No gradient, no shadow. |
| `index@390+900.png` | "Key skills" navy inset panel with re-tinted tags; drawn CSS check marks on the feature list. |
| `index@390+2400.png` | Roadmap reads as a real timeline: 1 px rail, outlined numbers, hairline cards. |
| `index@390+5200.png` | Caught a bug — cert-card list items showed both a native `•` and my `—` marker (fixed by resetting class-less `ul`s). |
| `index@390+7400.png` | FAQ list after the marker fix. |
| `index@768+0.png` | **Before the fix**: nav wrapped to two lines and truncated the wordmark. **After**: clean 64 px header with the hamburger. |
| `index@1024+0.png` | Inline nav fits with room to spare at 1024. |
| `index@1440+0.png` | One-line h1, 68 ch subtitle, stats row, `.info-card` top-aligned in the right column. Reads editorial, not template. |
| `index@1440+3400.png` | Resource link cards + salary cards; confirmed the double-bullet fix. |
| `index@1440+8200.png` | CTA band on paper (primary + quiet secondary) and the quiet navy footer with 8:1 small text. |
| `projects@390+400.png` / `projects@1440+300.png` | 1-up / 3-up card grid, level badges, quiet "View Guide". `aria-current` underlines "Projects" in the nav. |
| `resources@390+500.png` / `resources@1440+400.png` | Book cards, navy cover band, re-tinted tags at 6.5:1, quiet "View on Amazon". |
| `tools@390+300.png` / `tools@1440+900.png` | Calculator as a hairline card, uppercase-free field labels, orange primary action, navy result panel. |
| `interview-prep@390+400.png` / `interview-prep@1440+400.png` | Category cards with ruled headings; question items as left-ruled panels with difficulty badges. |
| `about@390+0.png` / `privacy@390+0.png` | Breadcrumb, compact title band, 68 ch prose with ruled `h2`s. |
| `contact@390+0.png` | Form card, hairline fields, real focus targets. |
| `404@390+0.png` | Paper 404 with navy numeral, ruled joke card, orange CTA; content now inside `<main>`. |
| `project-multi-account-landing-zone@390+{0,1200,3000}.png` | Breadcrumb → eyebrow → h1 → meta card; diagram stacks vertically and stays legible at 390; numbered steps. |
| `project-multi-account-landing-zone@1440+600.png` | Two-column grid active, article at 68 ch, **no void above the article** (aside track resolves to 0). |
| `project-static-website@1440+4200.png` | Code blocks: quiet header, file label, language chip, injected Copy button, `<pre>` focusable. |
| `menu-open-index@390.png`, `menu-open-project-multi-account-landing-zone@390.png` | Drawer open, bars morph to ×, one soft shadow. |
| `faq-open@390.png` | FAQ item open, `+` rotated to `×`, answer at 68 ch; also shows the 2 px accent focus ring on a keyboard-closed button. |

---

## 7. Needs a content approval (not done)

| Page | Issue | Proposal |
|------|-------|----------|
| `index.html` ×4, `tools.html` ×1 | Lighthouse SEO 92 — `link-text`: five links read **"Learn More"**. Text is frozen, so SEO cannot reach 100 in this area. | Either (a) approve per-link text, e.g. `Learn More` → `AWS Cloud Practitioner exam details`; or (b) approve adding a descriptive `aria-label` to each link (visible text unchanged, WCAG 2.5.3 satisfied because the label contains the visible text). (b) is invisible to the content gate and fixes the audit without touching copy — it needs a director's call, so I did not do it unilaterally. |
| all pages | Skip link — see §3. | Gate fix (a) or `internalLinks` approvals (b). |
| `resources.html` | LCP 2.10 s > 1.8 s budget, unchanged from baseline: 8 book-cover JPEGs, 1.1 MB on disk. | Not a content approval — an image job (resize + AVIF/WebP + `width`/`height`) for whoever owns `images/`. Out of Wave 1 scope. |

---

## 8. Handed to Wave 2

- **article-template**: the `.project-guide` grid is ready; drop a `.guide-aside` in as the *last*
  child of `.project-guide` and it lands in column 2, row 1 → -1, sticky under the header. Don't add
  `grid-auto-flow` or reorder — the explicit placement is what prevents the void.
- **code-and-diagrams**: `.code-block` anatomy, the `.code-copy` button (injected, `data-ui`) and the
  six syntax classes are all styled; line-height 1.65 in `<pre>` is deliberately loose and is yours
  to tune. The `tabindex="0"` on `<pre>` comes from `script.js` — keep it or move it into markup,
  but don't drop it (it was 42 serious axe nodes). `.code-label` **must keep `text-transform: uppercase`**
  (the baseline had it; removing it fails the content gate).
- **listing-pages**: every card family is on the one hairline-card shell; grids break at 40em and
  64em. The interview `.answer` panels still use the inline `style="display:none"` + `onclick` from
  the frozen markup — a keyboard-accessible disclosure there is your call, but note that the answers
  are `display: none` in the baseline snapshot, so they must **stay** `display: none` on load.
- **static-pages**: `.content-text` prose, `.contact-form` and `.form-status` are in the
  `[static-pages]` section; `404.html` is self-contained by design (2.5 KB, no second request) —
  keep it that way, adding `styles.css` to it would triple its weight.
- **all**: byte headroom is ~110 B per project page and ~185 B in `styles.css`. Check
  `node harness/snap.js` weights before handing over.
- **Ideas parked** (not written to `docs/IDEAS.md` — that file is outside this round's write scope):
  an "On this page" aside for project pages; `font-variant-caps: all-small-caps` as a gate-safe way
  to get small-caps eyebrows back (it is a font feature, so `innerText` is unaffected, unlike
  `text-transform`); responsive `srcset` for the book covers.

---

## 9. How to reproduce

```
node harness/serve.js                                   # already running on :4173
node harness/apply-shell.js --check                     # -> 0/19 pages would change
node harness/snap.js --label wave1-r1 --force
node harness/lh.js --label wave1-r1 --force
node harness/integrity.js compare --base baseline-2026-09-13
node harness/peek.js index.html 390 0
```

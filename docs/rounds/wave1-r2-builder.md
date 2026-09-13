# Wave 1 builder — design-system + layout-shell (round 2) + site-wide CSS consolidation

Date: 2026-09-13 · Branch: `facelift` · Areas: **design-system**, **layout-shell**
Plus **Part B**: integrator-delegated consolidation of the whole `styles.css`.
Label for all harness output: `wave1-r2` · Integrity base: `baseline-2026-09-13`

Files changed (committed by name): `styles.css`, `script.js`, `harness/apply-shell.js`,
and the 19 chrome-carrying `*.html` (two attribute lines each, written by `apply-shell.js`).
`404.html`, `docs/` (except this report), `harness/` (except `apply-shell.js`), `.github`,
`staticwebapp.config.json`, `ads.txt` and `images/` were not touched.

---

## 1. Assumptions I took (stated, not asked)

1. **Item 1 is solved by moving the pair to the container gutter, not by moving the header to the
   centred article.** The request's mechanism — "give `.page-header .container` the same grid as
   `.project-guide`" — is implemented exactly; but I set `justify-content: space-between` on that
   shared grid instead of keeping `center`. Reason: with the rail real, `center` puts the h1 **and**
   the article at x=284 while the breadcrumb, the brand and the footer stay at x=152, i.e. it trades
   one two-vertical page for another. `space-between` makes **one** left edge for the whole page
   (152) and hangs the rail on the right container edge, which is the Cloudflare/Stripe pattern the
   references name. Verified equal, see §3.1.
2. **The breadcrumb trail was mis-aligned and I fixed it inside item 1.** `.breadcrumbs ol` carried
   `margin: 0`, which beat `.container`'s `margin-inline: auto` (specificity 0-1-1 vs 0-1-0), so the
   trail sat at x=**32** at 1440 on all 18 non-home pages, not at 151 as the r1 critics recorded.
   `margin-block: 0` fixes it; it is now on the same 152 vertical as everything else.
3. **Footer links became full-width rows.** 44 px hit boxes cannot overlap unless the row pitch is
   also ≥ 44 px, so `li` margin was folded into link padding (`display:block; padding-block:.65rem`).
   The footer is ~140 px taller at 390. The alternative (negative margins) leaves neighbouring hit
   zones overlapping, which is the defect the reader reported.
4. **The ≤ 8,000 B gzip target is reachable only with almost all comments gone.** See §4: the floor
   with the seven markers kept verbatim, no minification and no feature removed is ~7.82 KB gzip.
   I kept **five** gate-critical one-line comments and deleted every other one. Landed at **7,995**.
5. `.guide-aside` chip focus order below 64em left alone; `harness/apply-article.js` not edited
   (but see §6.1 — its `<main>` regex now needs a one-character fix from its owner).

---

## 2. Part A — the twelve request items

| # | Item | What changed | Verified by |
|---|------|--------------|-------------|
| 1 | Page header ↔ article alignment ≥ 64em | `apply-shell.js` marks project pages `<main id="main" class="guide-page" tabindex="-1">`. `.guide-page .page-header .container` gets `grid-template-columns: minmax(0, var(--measure)) var(--rail); justify-content: space-between` with every child `grid-column: 1` (+ `justify-self:start` on the eyebrow so the badge does not stretch). `.project-guide` uses the identical track pair (new `--rail: 15.5rem` token replaces the `auto` track — same 248 px) and the same `space-between`. | `w1r2-mal-align-1440.png`, `w1r2-project-multi-account-landing-zone@1440+{0,600}.png`; **measured on all 11 project pages**: `.page-header h1`.left = `.guide-overview h2`.left = **152.00** (was 152 vs 284.42). Eyebrow, subtitle, breadcrumb, brand and footer are all 152 too. |
| 2 | Mobile drawer | (a) `apply-shell.js` emits `<button class="nav-toggle">` **before** `<ul id="site-nav">`. (b) `script.js` toggles `html.nav-open`; CSS adds `html.nav-open { overflow: hidden }` and a scrim `html.nav-open::before { position: fixed; inset: var(--header-h) 0 0; z-index: 90; background: rgba(21,32,43,.55) }` — z 90 sits **under** the header's own stacking context (z 100, which carries the panel) and over the page, so the close button is never covered. Panel gets `border-block` (clean bottom hairline), `max-height: calc(100vh - var(--header-h))` and `overflow-y:auto`. Outside tap (the scrim) closes it; Escape still closes and returns focus. | `w1r2-drawer-index@390.png`, `w1r2-drawer-project-multi-account-landing-zone@390.png`, `w1r2-drawer-index@768.png`. Measured with the drawer open at 390 and 768, on index and a project page: `html.overflow=hidden`, `nav-open=true`, scrim `fixed / 56px (64px) / rgba(21,32,43,.55)`, **Tab → "Roadmap" `[A in #site-nav]`** (was "Start Your Journey" in the body), **wheel scroll leaves scrollY at 0** (was 600), Escape → `aria-expanded=false`, focus back on `.nav-toggle`, `overflow` back to `visible`. |
| 3 | Tap targets | see the table in §3.2 — CSS only, negative margins keep the visual rhythm. | measured at 390 on index / project / about; **every shell control ≥ 44 px**. |
| 4 | Skip-link focus | `apply-shell.js` writes `<main id="main" tabindex="-1">` (project pages also `class="guide-page"`); CSS `main:focus { outline: none }`. | after Tab+Enter: `document.activeElement` is `MAIN#main`, `isMain=true`, `tabindex=-1`, `outline: none` on index, about and a project page (was `BODY`). |
| 5 | `.highlight` | the global `.highlight { color: var(--accent-strong) }` is gone; the accent now lives only on `.home-hero h1 .highlight`. | computed colour: index span `rgb(154,52,18)` (accent, kept); about / contact / projects / project-page spans `rgb(26,29,33)` = the h1 ink → **INHERITS**. `w1r2-about@390+0.png`, `w1r2-contact@390+0.png`, `w1r2-projects@1440+0.png`. |
| 6 | Section-heading rules | `.section > .container > h2` loses `display:inline-block` + `max-width:34ch`: the 2 px rule is now a **full-container hairline above every section heading**, identical at every width. `.section-subtitle`'s claw-back margin simplified to `-.75rem`. | index@1440 rule widths: **1136, 1136, 1136, 1136, 1136, 1136, 1136** (were 386/365/269/348/401/329/508). `w1r2-index@1440+{0,3400,8200}.png`, `w1r2-index@768+0.png`. |
| 7 | Colour discipline | see the component inventory in §3.3. Service/book chips → neutral; four cert-card hues deleted; Pluralsight chip → outline only; semantic tint kept **only** for level/difficulty. | `w1r2-projects@1440+0.png` (chips neutral, level badge green), `w1r2-index@1440+2400.png` vs `b4-index@1440+2400.png` (cert hues gone), `w1r2-resources@1440+400.png` (book tags neutral), `w1r2-interview-prep@1440+400.png` (difficulty tints kept). |
| 8 | Hero + CTA at 1440 | new `--band: 40rem`. `.home-hero h1`, `.home-hero .hero-subtitle`, `.hero-stats` and `.cta-section p` all cap at it. | index@1440: h1 `[152,792]`, subtitle `[152,792]`, stats `[152,792]`, CTA paragraph `[152,792]` — **one right edge** (were 1256 / 746 / 888 / 848). `w1r2-index@1440+0.png`, `w1r2-index@1440+8200.png`. |
| 9 | Measure outside `.project-guide` | `.roadmap` capped at `--band` (was 52rem). `.content-text`, `.faq-answer p`, `.section-subtitle` already capped and re-checked. | real `ch` probe at 1440: roadmap p **67.1ch**, content-text p 66.0ch, faq-answer p 68.1ch, section-subtitle 68.1ch, cta p 62.5ch, hero subtitle 62.5ch. Widest `main p` on index is now 696 px / 68.1ch (was 734 px / 89ch). |
| 10 | Focus ring on navy | `.site-header :focus-visible, .site-footer :focus-visible { outline-color: var(--on-navy) }`. Also fixed a ring-clipping bug I introduced: the drawer's `overflow-y:auto` was cropping the desktop ring's top/bottom, so `overflow: visible` is reset in the 60em block. | computed outline colour on a nav link and a footer link: `rgb(242,245,248)` (was `rgb(194,65,12)`, 3.18:1 on navy). `w1r2-focus-navlink@1440.png` (2× crop, full ring), `w1r2-focus-footerlink@1440.png`. |
| 11 | Ad well | `max-width: min(100%, 970px)` (was `var(--measure)` = 623 px at 1440); the `.js .ad-well:has(…unfilled) { display: none }` rule is **deleted** — nothing in CSS can collapse a well any more, so `.no-js` never-collapse is now structural rather than scoped. Label, `--ad-h: 280px` reservation and `.ad-well-slot` unchanged. | probe injecting one well into `main` at 1440: `{w: 970, h: 339, display: "block"}` (was `{w: 0, h: 0, display: "none"}` — the `:has()` rule fired on an unfilled `<ins>`). |
| 12 | Bytes | Part B, §4. | `node harness/weight.js`, §4.3. |

### Not changed, deliberately
- `.guide-aside` chip-row focus order below 64em (article-template's call, per the request).
- `harness/apply-article.js` (out of write scope) — but see §6.1.
- The "Learn More" SEO 92 on index/tools, `resources.html` LCP 2.10 s, the `.guide-navigation`
  orange button and 404.html — all explicitly parked by the request.

---

## 3. Measured detail

### 3.1 Alignment at 1440 (all 11 project pages, `getBoundingClientRect().left`)

```
before: page-header h1 152.00   guide-overview h2 284.42   breadcrumb a 32   -> DIFF
after : page-header h1 152.00   guide-overview h2 152.00   breadcrumb a 152  -> EQUAL (11/11)
        brand 152   footer h4 152   article right edge 775   rail 1040..1288
```

### 3.2 Tap targets at 390 — every shell control (w × h, px)

| Control | Before (r1 critic) | After | Notes |
|---|---|---|---|
| `.skip-link` (focused) | 146 × 44 | 146.2 × 44 | unchanged, already passing |
| `.brand` | 218.8 × **24.8** | 218.8 × **44.8** | `padding-block: 10px` + `margin: -10px auto -10px 0` |
| `.nav-toggle` | 40 × **36** | **44 × 44** | `width/height: 44px; padding: 0 10px` |
| breadcrumb `a` "Home" | 34.8 × **21.4** | 34.8 × **45.4** | `display:block; padding-block:12px; margin-block:-12px`; `.breadcrumbs li` switched to `align-items:center` so the `›` still sits mid-row |
| breadcrumb `a` "Projects" | 45.3 × **21.4** | 45.3 × **45.4** | |
| footer links (×10–11) | w × **20**, pitch **32.8** | 342 × **45.5**, pitch **45.5** | rows; zones touch but never overlap |
| `.cert-link` ×4 (index) | 91 × **28** | 80.6 × **44.8** | `padding-block:10px; margin-block:-10px` |
| drawer nav link | 342 × 52.8 | 342 × 52.8 | unchanged |
| desktop nav link @1440 | 90 × **25** | 64.8 × **46.3** | `padding: .65em 0` (mouse target, but it was the same missing-padding pattern) |

### 3.3 Every tag / badge / chip component and its treatment (item 7)

| Component | Where | Treatment now | Change |
|---|---|---|---|
| `.tag` | `.info-card` skills | neutral chip (surface / `--line` / `--ink-2`); the navy-panel override keeps `#ffd9a0` on `rgba(255,255,255,.07)` | unchanged |
| `.book-tag` | resources book cards | **neutral chip** | was accent-tint peach |
| `.project-services span` | project cards, projects.html | **neutral chip** | was accent-tint peach |
| `.roadmap-skills span` | home timeline | neutral chip | unchanged |
| `.project-level` (`.level-*`) | project cards + project page eyebrow | **semantic tint kept** (green / amber / rose, all ≥ 6:1) | unchanged — this is the one tinted family |
| `.question-difficulty` (`.difficulty-*`) | interview rows | **semantic tint kept** | unchanged |
| `.course-level` | Pluralsight courses | **outline only** (pink border + pink text, transparent fill) | background dropped |
| `.cert-card` top rule | home certification cards | **one neutral `--line-2` rule** | the four hues (`#2f8f63 / #3b6fb5 / #7a5bbf / --aws-orange`) are deleted |
| `.salary-card.featured` top rule | home salary cards | one accent rule (`--aws-orange`) | unchanged (listing-pages' single accent) |
| `.ps-logo` | Pluralsight panel | `#9d174d` wordmark + 3 px left rule | unchanged |
| `.code-lang` | code blocks | amber on navy | unchanged (code-and-diagrams) |
| `.arch-component` `--role` hues | diagrams | unchanged | code-and-diagrams owns them |

Result on `projects.html@1440`: one tinted family (level badges) instead of four, plus the
orange `aria-current` underline. On `index.html@1440+2400` the cert row is four identical
neutral cards.

### 3.4 Drawer behaviour (scripted, both widths, two pages)

```
open: aria-expanded=true  panel 56..398 (h 342 of vh 844)   html.overflow=hidden  html.nav-open=true
scrim: position fixed  top 56px (64px at 768)  rgba(21, 32, 43, 0.55)
Tab from the toggle -> "Roadmap" [A in #site-nav]          (was "Start Your Journey", in the body)
mouse wheel 600px  -> window.scrollY 0                     (was 600)
Escape             -> aria-expanded=false, focus .nav-toggle, html.overflow visible
```

`script.js` is **3,670 B** (limit 4,096; was 3,453). It gained `html.nav-open` toggling and an
outside-tap close; nothing was removed.

---

## 4. Part B — CSS consolidation

### 4.1 What I did (in this order)

1. **Declaration-level dedupe.** `.container` + `.site-header-inner` now share the 1200 px rail
   (and its 64em padding rule); one chip/badge shell for the seven chip selectors; one
   flex-wrap "chip row" primitive (`.skill-tags, .project-services, .book-meta, .roadmap-skills`);
   the accent note callout merged (`.tips-box, .salary-note`) into design-system, where
   ARCHITECTURE puts callouts; the two navy inset panels merged (`.info-card, .salary-result`);
   `.roadmap-number, .book-cover` share the centred `--paper-2` box; `.faq-icon,
   .question-item::after` share the rotating "+" affordance.
2. **The named seam**: `.contact-form` dropped from the `[listing-pages]` card selector — the
   `[static-pages]` rule is now its only declaration (static-pages' report §6.2).
3. **Inert declarations removed**: `color` on `.footer-section p` / `.footer-bottom p` (inherited
   from `.site-footer`), `letter-spacing: 0; text-transform: none` on `.checkbox-label` (verified in
   the browser that `.form-group > label` does **not** match it, so they defended against nothing).
4. **Comments**: the seven `==== [section] ====` markers are **byte-identical**; every other comment
   is deleted except five gate-critical one-liners (cert-level `text-transform`, FAQ `max-height`,
   interview inline `display:none`, the explicit guide-grid placement, the ad-well never-collapse).
5. **Formatting**: multi-line rule bodies collapsed to one rule per line (the sheet's existing
   dominant style; `:root` and the media-query blocks keep their structure), one blank line only
   where a section starts. **Not** minified: no joined lines, no stripped semicolons, no tightened
   `rgba(…)`/`repeat(…)` arguments, **no token value changed**.

**The comment/format pass is provably render-neutral**: with comments and whitespace normalised
away, the file before and after the pass is byte-identical (`identical after stripping
comments+whitespace: true`). Every rendering change in this round comes from Part A only, and every
Wave 2 surface was screenshot-compared before/after (`harness/out/peek/b4-*.png` vs `w1r2-*.png`):
cert cards, resource lists, salary cards + note, book cards, Pluralsight panel, course cards,
interview rows, calculator, contact form card, prose, key-facts strip, steps, tips callout,
pagination, rail, code block, architecture diagram. The only intended visual deltas are items 1 and
5–8 above.

### 4.2 Bytes per section (raw / gzip)

| section | at r1 HEAD | after this round | delta |
|---|---|---|---|
| design-system | 7,870 / 2,804 | **7,105 / 2,389** | −765 / −415 |
| layout-shell | 7,717 / 2,164 | **7,696 / 1,988** | −21 / −176 (and it absorbed all of Part A) |
| article-template | 5,765 / 1,656 | **5,018 / 1,304** | −747 / −352 |
| code-and-diagrams | 4,902 / 1,691 | **4,452 / 1,427** | −450 / −264 |
| listing-pages | 12,426 / 3,201 | **10,309 / 2,462** | −2,117 / −739 |
| static-pages | 3,178 / 1,050 | **2,661 / 768** | −517 / −282 |
| ad-presentation | 929 / 525 | **595 / 352** | −334 / −173 |
| **total `styles.css`** | **42,787 / 10,282** | **37,867 / 7,995** | **−4,920 / −2,287** |

Target ≤ 8,000 gzip: **met, 7,995**. Baseline reference is 35,518 / 6,078, so the sheet is
**+2,349 raw / +1,917 gzip** over the frozen baseline.

**Where the floor is, so the next round does not chase it**: gzip makes repetition nearly free, so
dedupe barely moves the number — the eight structural merges in §4.1(1) cut 672 raw B and **1 gzip
byte**. Only unique text counts, and in this sheet that is selectors and comments. With the seven
markers kept, zero other comments, and the current feature set, the file gzips to **~7,820**. Every
100 B of prose comment costs ~55 gzip B. So: 7,995 is ~175 B above the hard floor, and the only way
below ~7,820 is to delete features or shorten the section markers.

### 4.3 `node harness/weight.js` (gzip, ref `f1ec399`) — the remaining overage, per page

`WEIGHT: FAIL (19 pages over their gzip baseline)` — down from **+3,225 … +4,653** to
**+299 … +2,469**. Attribution is exact: `styles.css` **+1,917** and `script.js` **+310** are
charged to every page that links them; the rest is that page's own HTML.

| page type | pages | gzip now vs ref | of which CSS | of which JS | of which that page's HTML |
|---|---|---|---|---|---|
| home | index.html | **+1,033** | +1,917 | +310 | **−1,194** |
| listing | projects / resources / tools / interview-prep | **+1,304 … +1,389** (resources is *under*: −213,138, re-encoded covers) | +1,917 | +310 | −771 … −923 |
| static | about / contact / privacy | **+1,161 … +1,557** | +1,917 | +310 | −360 … −756 |
| project guide (×11) | project-*.html | **+2,451 … +2,469** | +1,917 | +310 | **+224 … +242** |
| 404.html | — | **+299** | n/a (no `styles.css` link) | n/a | +299 (static-pages' r1 rewrite) |

Per-page detail (gzip now / ref / delta):

```
OVER index.html                              15757 / 14724 (+1033)
OVER projects.html                           14106 / 12750 (+1356)
OK   resources.html                         159448 / 372586 (-213138)
OVER tools.html                              13992 / 12603 (+1389)
OVER interview-prep.html                     16447 / 15143 (+1304)
OVER about.html                              12494 / 11016 (+1478)
OVER contact.html                            11782 /  9915 (+1867)
OVER privacy.html                            12785 / 11314 (+1471)
OVER 404.html                                 1382 /  1083  (+299)
OVER project-static-website.html             13466 / 11000 (+2466)
OVER project-serverless-contact-form.html    14021 / 11561 (+2460)
OVER project-ec2-web-server.html             13658 / 11193 (+2465)
OVER project-three-tier-web-app.html         13825 / 11363 (+2462)
OVER project-cicd-pipeline.html              13863 / 11405 (+2458)
OVER project-serverless-rest-api.html        14134 / 11677 (+2457)
OVER project-infrastructure-as-code.html     14366 / 11901 (+2465)
OVER project-multi-region-active-active.html 14158 / 11689 (+2469)
OVER project-kubernetes-eks.html             14208 / 11747 (+2461)
OVER project-realtime-data-pipeline.html     14488 / 12033 (+2455)
OVER project-multi-account-landing-zone.html 14340 / 11889 (+2451)
styles.css: raw 37867 (ref 35518), gzip 7995 (ref 6078)
```

**What the owner is being asked to sign off** (nothing here can be removed without removing a
feature the briefs asked for):

- `styles.css` **+1,917 gzip**: skip link, breadcrumbs, the sticky-header shell, the page-header
  band, the drawer + scrim, the four Wave 2 component systems (article template + TOC rail, code
  block anatomy + copy button + syntax colours, the card/timeline/accordion families, the prose and
  form work) and the dormant `.ad-well` family for Wave 3.
- `script.js` **+310 gzip**: copy buttons, `tabindex` on `<pre>` (42 serious axe nodes), the FAQ
  disclosure, the drawer scroll-lock/scrim state and the interview-row keyboard disclosure.
- project-page HTML **+224…+242 gzip**: heading `id`s, the "On this page" rail, the `<dl>` key
  facts, the skip link, the breadcrumb trail, `tabindex="-1"` + `class="guide-page"` on `<main>`.
- 404.html **+299 gzip**: static-pages' r1 rewrite; it links no stylesheet, so none of the above.

Correcting the round brief once more: there is **no** ~3 KB/page re-indent headroom in gzip
(article-template's r1 report §5 measured it at −86 B), which is why 8 of the 20 pages are now
*below* their baseline HTML weight and still over on the total.

---

## 5. Gate results — all fresh, taken after the last edit

```
node harness/apply-shell.js   --check   -> 0/19 pages would change
node harness/apply-article.js --check   -> 0/11 pages would change
node harness/integrity.js compare --base baseline-2026-09-13
   -> INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
node harness/snap.js --label wave1-r2   -> 63 captures (20 public pages x 390/768/1440 + admin)
node harness/lh.js   --label wave1-r2   -> 7 pages
node harness/weight.js                  -> WEIGHT: FAIL (19 pages), see 4.3
```

### Playwright / axe — `harness/out/wave1-r2/summary.json`, 60 public runs

| Check | Result | Budget |
|---|---|---|
| Console errors / page errors | **0 / 0** | 0 |
| Failed requests | **0** | — |
| axe serious + critical | **0** | 0 |
| axe violations of any impact | **0** | — |
| Horizontal overflow @ 390/768/1440 | **none** | none |
| Lab CLS | **0** everywhere except `resources.html` 0.0019 @768 and 0.0008 @1440 (book covers) | ≤ 0.05 |

(`admin.html` still has its known local-only `/.auth/me` 404 and 0.0187 CLS @768 — out of scope,
same as baseline.)

### Lighthouse mobile — `harness/out/wave1-r2/lighthouse/`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|------|------|------|----|-----|-----|-----|-----|
| index.html | 100 | 100 | 100 | **92** (`link-text`) | 1.65 s | 0 | 0 ms |
| projects.html | 100 | 100 | 100 | 100 | 1.65 s | 0 | 0 ms |
| resources.html | 99 | 100 | 100 | 100 | **2.10 s** | 0 | 0 ms |
| tools.html | 100 | 100 | 100 | **92** (`link-text`) | 1.65 s | 0 | 0 ms |
| interview-prep.html | 100 | 100 | 100 | 100 | 1.53 s | 0 | 0 ms |
| about.html | 100 | 100 | 100 | 100 | 1.38 s | 0 | 2 ms |
| project-multi-account-landing-zone.html | 100 | 100 | 100 | 100 | 1.65 s | 0 | 0 ms |

Budgets: perf ≥ 95 ✅ (min 99) · a11y 100 ✅ · BP 100 ✅ · SEO 100 ✅ except the two
content-blocked pages (92, `link-text` on the five frozen "Learn More" links — HUMAN_TODO A5) ·
CLS ≤ 0.05 ✅ · LCP ≤ 1.8 s ✅ except `resources.html` 2.10 s (unchanged; listing-pages/images) ·
`bf-cache` is the only binary audit failure, caused by the local server's `Cache-Control: no-store`.

---

## 6. Screenshots I opened and looked at

All under `harness/out/peek/`. `b4-*` are the matching **before** shots taken at the start of the
round for the Part B render-neutrality comparison.

| File | What I saw |
|---|---|
| `w1r2-index@390+0.png` | Hero at 390, 44×44 toggle in the 56 px header, one orange CTA. |
| `w1r2-index@390+2400.png` | Roadmap timeline unchanged at 390 (the 40rem cap only bites ≥ 640 px). |
| `w1r2-index@390+5200.png` | Cert cards at 390 — neutral top rules, "Learn More" with a 44.8 px box. |
| `w1r2-index@390+8200.png` | Salary note callout (now shared with `.tips-box`) renders exactly as before; FAQ intact. |
| `w1r2-index@768+0.png` | 64 px header, hero with one right edge, full-container section rule. |
| `w1r2-index@1440+0.png` | **Item 8**: h1, subtitle and stats rule all end at 792; section rule spans the container. |
| `w1r2-index@1440+2400.png` vs `b4-index@1440+2400.png` | **Item 7**: the four cert hues are gone; card anatomy otherwise pixel-identical. |
| `w1r2-index@1440+3400.png` | Resource lists + salary cards unchanged; featured card keeps its single orange rule. |
| `w1r2-index@1440+8200.png` | **Item 6/8**: CTA band = one full rule + content at 792 (was 510/410/810); footer rows at 45.5 px pitch. |
| `w1r2-project-multi-account-landing-zone@390+0.png` | Project page at 390: single-colour h1, breadcrumb, key-facts rows. |
| `w1r2-mal-align-1440.png` / `…@1440+0.png` | **Item 1**: breadcrumb, eyebrow, h1, subtitle, "Project Overview" and the key-facts strip all on x=152; rail flush right at 1288. The eyebrow no longer stretches (caught and fixed — grid items stretch by default). |
| `w1r2-project-multi-account-landing-zone@1440+600.png` | Diagram and prerequisites untouched, now on the same left edge. |
| `w1r2-project-static-website@1440+4200.png` | Code block untouched (header, BASH chip, Copy), moved left with the article. |
| `w1r2-drawer-index@390.png` | **Item 2**: panel + dimmed page + × toggle; no hard cut, nothing scrolls behind it. |
| `w1r2-drawer-project-multi-account-landing-zone@390.png` | Same over an article page. |
| `w1r2-drawer-index@768.png` | Same at 768. |
| `w1r2-focus-navlink@1440.png` | **Item 10**: complete light ring around a header nav link (2× crop). Caught the drawer `overflow-y` clipping the ring here. |
| `w1r2-focus-footerlink@1440.png` | Light ring around a 226×46 footer link on navy. |
| `w1r2-about@390+0.png` / `w1r2-contact@390+0.png` | **Item 5**: "About Us" / "Contact Us" in one ink colour. Contact card unchanged after the `.contact-form` seam fix. |
| `w1r2-projects@1440+0.png` | Neutral service chips, green level badge, one left edge. |
| `w1r2-resources@1440+400.png` / `w1r2-resources@1440+2300.png` | Book cards + Pluralsight/course panels unchanged apart from the neutral tags and the outline course chip. |
| `w1r2-interview-prep@1440+400.png` | Difficulty tints kept; rows unchanged. |
| `w1r2-tools@1440+300.png` | Calculator card and navy result panel unchanged after the `.info-card, .salary-result` merge. |

---

## 7. For the integrator

1. **`harness/apply-article.js` needs a one-character fix, and it is not mine to make.** Its main
   matcher is `/<main id="main">[\s\S]*?<\/main>/`. `<main>` now carries `tabindex="-1"` (and
   `class="guide-page"` on project pages), so that regex no longer matches. `--check` still reports
   `0/11 would change` — because the applier is now a silent no-op, not because it agrees with the
   tree. Change it to `/<main\b[^>]*>[\s\S]*?<\/main>/` (`apply-shell.js` already uses that form)
   before anyone re-runs it. The article markup currently in the tree is correct and untouched.
2. **`--rail: 15.5rem` and `--band: 40rem` are new tokens** in `[design-system]`. `--rail` is the
   TOC column; `.guide-aside` and both grids read it, so the rail width is now changed in one place.
   `--band` is the shared right edge for the hero, the CTA band and the timeline.
3. **`.guide-page`** is a new class on `<main>` of the 11 project pages (from `apply-shell.js`). It
   is the only hook the title-band grid needs; nothing else uses it yet.
4. **Cross-section moves made during consolidation** (so nobody looks for these where they were):
   `.tips-box` (was `[article-template]`) and `.salary-note` (was `[listing-pages]`) are now one
   callout rule in `[design-system]`; `.salary-result`'s navy surface is on the `.info-card` rule in
   `[layout-shell]`; `.site-header-inner`'s 1200 px rail is on the `.container` rule in
   `[design-system]`; `.cert-link` is one rule in `[design-system]`. Each still has its
   component-specific declarations in its own section.
5. **Almost all CSS comments are gone** to hit the byte target. The five that survive are the ones
   whose loss could fail the content gate or reopen a fixed defect. The rest of that knowledge lives
   in the five round-1 builder reports and this one; if the owner would rather have the
   documentation back, it costs ~55 gzip B per 100 B of comment, i.e. the sheet goes back over
   8,000 at roughly 10 restored lines.
6. **Blocked / other owners, unchanged**: "Learn More" SEO 92 (HUMAN_TODO A5), `resources.html`
   LCP 2.10 s, `.guide-navigation`'s orange button, 404.html's shell-less design.
7. `docs/APPROVALS.json` untouched and still empty. No content text, heading tag, link target,
   image, meta or JSON-LD changed anywhere — `INTEGRITY: PASS` with 0 approvals.

---

## 8. How to reproduce

```
node harness/serve.js                                   # :4173
node harness/apply-shell.js --check                     # -> 0/19 pages would change
node harness/apply-article.js --check                   # -> 0/11 pages would change (see 7.1)
node harness/snap.js --label wave1-r2 --force
node harness/lh.js   --label wave1-r2 --force
node harness/integrity.js compare --base baseline-2026-09-13
node harness/weight.js
node harness/peek.js project-multi-account-landing-zone.html 1440 0
```

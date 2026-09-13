# Wave 1 · Round 2 · READER critic

```
Area: design-system + layout-shell   Round: 2   Critic: reader   Score: 8.6/10   Verdict: PASS
```

Persona: cloud engineer on a 390×844 phone, mid-task, wants one answer fast.
Scope scored: **shell + design-system behaviour only** — drawer, skip link, tap targets, sticky
header, single left edge, rendered measure, horizontal overflow, focus rings. Wave 2 surfaces
(article body, code blocks, diagrams, listing cards, prose) are re-checked but **not scored**, per
the round brief; Wave 2 round-2 builders were editing page bodies, `styles.css` and `script.js`
while I measured (see "Tree moved under me").

---

## Screenshots looked at

All taken by me with `node harness/peek.js` or my own Playwright scripts, all under
`harness/out/peek/`, all opened with the Read tool.

| File | What I saw |
|------|-----------|
| `rd3-index-390-0.png` | Home at rest: 56 px navy sticky header, 44×44 boxed hamburger, paper hero, hairline stats rule, one orange CTA. |
| `rd3-index-390-2400.png` | Roadmap timeline at 390: rail + outlined number now take 40 px of gutter, card prose still ~31 chars/line. |
| `rd3-index-1440-0.png` | Hero: h1, subtitle, stats rule and CTA all start at x=152 and the subtitle/stats end at 792 — one left edge, one right edge. |
| `rd3-project-multi-account-landing-zone-390-0.png` | Project page arrival at 390: header 56, breadcrumb, page-header band, then the new "ON THIS PAGE" chip row, then Project Overview. |
| `rd3-project-multi-account-landing-zone-1440-0.png` | **Item 1 fixed**: breadcrumb, "Advanced" badge, h1, subtitle, "Project Overview", key-facts strip and Prerequisites all on the same x=152 edge; TOC rail flush right. |
| `rd3-project-multi-account-landing-zone-1440-600.png` | Prerequisites/Architecture on the same edge; the rail has stuck under the header. 273 px of empty paper between article right edge and rail. |
| `rd3-drawer-index-390.png` | **Drawer**: navy panel, six divided links, × in a 44×44 box, page behind clearly dimmed by the scrim, clean bottom hairline. |
| `rd3-drawer-index-768.png` | Same at 768; panel full width, links left at x=24. |
| `rd3-drawer-focus-lost-390.png` | Drawer open, focus is on a "Learn More" link 4,231 px down the page — **nothing on screen carries a focus ring**. |
| `rd3-skiplink-focused-390.png` | First Tab: orange 146×44 "Skip to content" chip with a 2 px accent ring, fully in view. |
| `rd3-skiplink-activated-390.png` | After Enter: `<main>` is focused, no ring painted on the page body; the breadcrumb row is left half-clipped under the sticky header. |
| `rd3-focus-crumb-390.png` | Breadcrumb "Home" focused — tall orange ring whose **top edge disappears behind the navy header**. |
| `rd3-focus-navlink-1440.png` | Header nav link: complete light (`#f2f5f8`) 2 px ring on navy, uncropped. |
| `rd3-focus-footerlink-390.png` | Footer link: light ring on a full-width 342×45.5 row; rows evenly pitched, no crowding. |
| `rd3-onthispage-390.png` | The on-page nav at 390 is a horizontally scrolling chip row of 44 px chips directly under the page-header band. |

Instrumentation (mine, all under `harness/out/`): `rd3-measure.js` … `rd3-measure10.js`,
`rd3-toc-chips.js`, `rd3-shot-footer.js`, `rd3-shot-toc.js`; logs `rd3-measure*.log`.

---

## Gate results

```
console=0  pageErrors=0  failedRequests=0  axeSC=0  axeAll=0  (60 public runs, harness/out/wave1-r2/summary.json)
perf=99–100  a11y=100  bp=100  seo=100 except index/tools 92 (link-text, HUMAN_TODO A5)
cls=0 everywhere except resources.html 0.0019@768 / 0.0008@1440   LCP 1.38–1.65 s (resources 2.10 s)  TBT ≤ 2 ms
hOverflow: none in 60 harness runs — and none in my own 20-page re-check at 390 (twice)
integrity=PASS (21 pages identical to baseline-2026-09-13, 0 approvals) — re-run by me at 02:11
```

`admin.html` keeps its known local-only `/.auth/me` 404 and 0.0187 CLS@768; out of scope, same as
baseline.

**Gate-freshness note (unlike round 1, the label is honest).** `harness/out/wave1-r2/summary.json`
is `07:46:12Z` and the last Wave 1 edit (`styles.css`) was `01:39` local — the snap/lh run genuinely
postdates the Wave 1 work it describes. What it no longer describes is the *current* tree; see
below.

**Tree moved under me.** Wave 2 round-2 builders committed and kept editing during my session:
`styles.css` changed at 01:39 → 02:08 → **02:11:02, mid-run**, `script.js` gained a guide-rail
observer, and 11 project pages + `projects/tools/interview-prep` are modified in the working tree.
I therefore re-ran the whole shell battery at 02:10–02:11 and every shell number below is from that
second pass; the two project-page screenshots were re-taken at the same time. The integrator needs a
fresh `snap`/`lh` label after Wave 2 r2 lands — the `wave1-r2` tables are valid for Wave 1, not for
the merged tree. I did not re-run them.

---

## Round-1 issues, re-checked

| # (r1) | Issue | Status | Evidence |
|---|---|---|---|
| 1 | Drawer not operable forward by keyboard | **FIXED** | Toggle now precedes the list. From the toggle: Tab 1–6 = Roadmap, Certifications, Interview Prep, Projects, Resources, Tools, in order, `inNav=true`, all in the viewport (`rd3-measure.log` DRAWER, both pages, 390 **and** 768). Shift+Tab from the first link returns to the toggle. Escape closes and returns focus to `.nav-toggle` both when focus is on the toggle **and** when it is inside the panel (`isToggle: true` in all four cases). |
| 2 | Every shell tap target under 44 px | **FIXED except one** | `.nav-toggle` 44×44, `.brand` 218.8×44.8, footer links 342×45.5 at 45.5 pitch, `.cert-link` 80.6×44.8, skip link 146.2×44, desktop nav 44.3–46.3 tall. Zero overlapping hit zones anywhere (pairwise box test on footer/crumbs/certs/header: `overlaps: none` on all four pages). **Breadcrumb links still miss**: "Home" is 34.8 px wide (`Projects` 45.3) and the top 5 px of the 45.4 px box sits under the sticky header — see issue 2. |
| 3 | No on-page nav / no heading ids on the long project page | **FIXED (by article-template, not scored here)** | 13 of 18 `h2`/`h3` carry slugs; at 390 a 44 px-tall, horizontally scrolling chip row sits at docTop 417 — 0.5 screens in, not 11 (`rd3-onthispage-390.png`, `rd3-toc-chips.js`); at 1440 a sticky rail. This was the persona's worst complaint in r1 and it is gone. |
| 4 | Skip link did not move focus | **FIXED** | After Tab+Enter on index / project / about / interview-prep / tools: `activeElement === MAIN#main`, `tabindex="-1"`, `outline-style: none`, and the next Tab lands **inside** `<main>` every time (`rd3-measure.log` SKIP LINK). |
| 5 | Page-header and article on two left edges at 1440 | **FIXED** | `getBoundingClientRect().left` of breadcrumb, `.page-header h1` and the first article h2: **spread 0.00 on all 21 pages**, brand and footer on the same 152. (`rd3-measure.log` LEFT EDGE; `rd3-project-…-1440-0.png`.) |
| 6 | Measure runs to 89 ch outside `.project-guide` | **FIXED where it renders; partial at 390** | Longest **actually wrapped** `main p` line at 1440, measured from Range client rects across all 20 public pages: **67.9 ch** (index FAQ answer). `TOTAL wrapped main p over 68.5ch: 0`. Latent risk remains in three uncapped boxes (issue 3). The 390 half is partial: the timeline gutter went 75 → **40 px**, but card padding keeps roadmap prose at 252 px / **31.2 ch**, not the ~38 ch asked for. |
| 7 | Drawer did not lock the page behind it, no scrim | **FIXED, and properly** | Scrim: `html.nav-open::before`, `fixed`, top = header height (56/64), `rgba(21,32,43,.55)`, z 90 under the header's 100 — visible in `rd3-drawer-index-390.png`. Lock verified with **synthesized touch drags** (CDP `synthesizeScrollGesture`, touch source), not just computed styles: a −400 px finger drag on the scrim, on the panel itself and on the header bar leaves `window.scrollY` unchanged, at scrollY 0 **and** at scrollY 2000, on index and the project page (`rd3-measure7.log`, 24/24). Scroll position survives open→close unchanged. Tapping the scrim closes the drawer. |

---

## Ranked issues (worst first)

### 1. The drawer looks modal but does not hold focus — Tab 7 drops you onto an off-screen control on a page that cannot scroll — COMPONENT
- **Page/width**: every page, 390 and 768. Screenshot `harness/out/peek/rd3-drawer-focus-lost-390.png`.
- **What is wrong**: the drawer is now genuinely modal in appearance and in pointer behaviour —
  scrim, scroll lock, outside-tap-to-close. Focus did not follow. From the toggle, Tab 7 leaves the
  panel for the page underneath (`A.cta-button[Start Your Journey]` on index, breadcrumb `Home` on a
  project page), and Tab 8 lands on `A[Learn More]` at **top = 4,231 px** — `inViewport: false`,
  `scrollY: 0`, `aria-expanded: "true"`. Because the scroll lock is working, the browser **cannot**
  scroll that element into view, so the focus ring is painted 4,231 px off-screen and the screen
  shows no focus at all (`rd3-measure.log` §DRAWER tab7–9; `rd3-measure9.js` §A). The r1 defect was
  "forward Tab misses the menu"; this round's is "forward Tab exits the menu into a place you cannot
  see" — cheaper to hit and harder to recover from. It is also a WCAG 2.4.7 / 2.4.11 exposure that
  axe cannot see, which is why the axe count is still 0.
- **What fixed looks like**: contain Tab inside the open panel — cycle from the last link back to the
  toggle and from the toggle back to the last link (~8 lines in `script.js`, which already owns the
  open/close state), or `inert` on `#main` + `.site-footer` while `html.nav-open` is set. Escape →
  toggle already works and must stay. Verify: with the drawer open, Tab ×8 from the toggle keeps
  `document.activeElement.closest('#site-nav')` truthy.

### 2. Breadcrumb links are the last tap target under 44 px, and the sticky header eats the top 5 px of their hit box — COMPONENT
- **Page/width**: 19 chrome pages, 390. Screenshots `rd3-focus-crumb-390.png` (the ring's top edge is
  cut off by the navy bar), `rd3-project-multi-account-landing-zone-390-0.png`.
- **What is wrong**: `padding-block: 12px; margin-block: -12px` grew the crumb to 45.4 px tall, but
  (a) the width is untouched — **"Home" is 34.8 px wide**, "Projects" 45.3 — and (b) the grown box
  runs from y = 51.1 to 96.6 while the sticky header occupies 0–56, so 5 px of it is behind the
  header. `document.elementFromPoint` over a 5×9 grid of the box returns `NAV.site-header-inner`, not
  the link, for 5 of 45 samples: **hit rate 89 %, clear height 40.6 px** (`rd3-measure2.log` §C, same
  on project pages and about). "Home" is the back-out affordance on every non-home page and it is the
  smallest target in the shell.
- **What fixed looks like**: `min-width: 44px` (or `padding-inline` + `text-align:center`) on
  `.breadcrumbs a`, and push the crumb row down ~6 px (or cap `padding-block` at the space actually
  below the header) so no part of the hit box is under the sticky bar. Re-run the `elementFromPoint`
  grid: 100 % on every crumb. CSS only.

### 3. Three prose families still carry `max-width: none` — the measure token holds only by luck, and Wave 2 is already widening them — COMPONENT (design-system token; the boxes belong to Wave 2)
- **Page/width**: `project-*.html` (`.arch-note`), `tools.html` (`.salary-result p`),
  `resources.html` (`.ps-promo-content p`) at 1440. Measured, not eyeballed.
- **What is wrong**: no rendered line exceeds 67.9 ch today — because these paragraphs happen to fit
  on one line. Their **boxes** do not: `.arch-note` **116.2 ch / 814 px**, `.salary-result p`
  **120.9 ch / 978 px**, `.ps-promo-content p` 80.3 ch / 736 px, all `max-width: none`. Two hours
  earlier in this same session those same boxes measured 85.2 ch and 91 ch — Wave 2's round-2 edits
  widened them by ~30 ch while I was working. One extra clause of copy and the reference's 65–75 ch
  rule breaks with no CSS change and no gate to catch it.
- **What fixed looks like**: `max-width: var(--measure)` on those three (the token exists and is
  already applied to `.content-text`, `.faq-answer p`, `.section-subtitle`, `.roadmap`); or a
  blanket `main p { max-width: var(--measure) }` with the deliberate exceptions opting out. Verify
  with the box-width probe, not the rendered-line probe.

### 4. Roadmap card prose is 31 chars per line at 390 — PAGE (home timeline; listing-pages owns the card)
- **Page/width**: `index.html` at 390. Screenshot `rd3-index-390-2400.png`.
- **What is wrong**: the rail/number gutter did come down from ~75 px to **40 px** (item l=24,
  number 24→56, content l=64), but `.roadmap-content`'s own 25 px side padding puts the paragraph at
  **252 px / 31.2 ch** at 15 px. Three or four words a line over five stacked cards is choppy; r1
  asked for ~38 ch.
- **What fixed looks like**: trim the card's inner padding to ~16 px at < 48em, taking the paragraph
  to ~285 px / ~35 ch. Nothing else in the timeline needs to move.

### 5. The on-page rail's links are 29.2 px tall at 1440 — COMPONENT (article-template)
- **Page/width**: 11 project pages at 1440 (`rd3-project-…-1440-0.png`, `rd3-toc-chips.js`).
- **What is wrong**: the 390 chip row is a correct 44 px; the desktop rail links are 231 × **29.2**.
  Mouse-only, so low priority, but it is the same missing-`padding-block` pattern the shell just
  fixed everywhere else, and the shell's 44 px rule visibly stops at the rail's edge.
- **What fixed looks like**: `padding-block: .5rem` on `.guide-aside a` with a negative margin to
  keep the rail's rhythm.

---

## What is genuinely good (so the panel does not over-correct)

- **The drawer is now a real modal for a thumb.** Scrim, true scroll lock under synthesized finger
  drags on three different surfaces at two scroll positions, position preserved on close, tap-outside
  and Escape both close, forward Tab enters the menu in visual order, six 342×52.8 targets.
- **Sticky header unchanged and still exemplary**: 56 px = **6.6 %** of 844, `position: sticky`,
  `z-index: 100`, still 56 px after scrolling 1,500 px, `scroll-padding-top: 72px`.
- **One left edge, everywhere.** 0.00 px spread across breadcrumb / h1 / first article heading on
  **21/21** pages at 1440, and the brand and footer sit on the same 152.
- **Zero horizontal scroll, verified twice, 20/20 pages at 390** — including project pages whose
  `<li>` content is 480 px wider than the viewport and whose longest `<code>` line is 617 px over:
  the containers absorb it, the page never moves.
- **Focus rings are right on navy now**: `#f2f5f8` 2 px at 2 px offset inside header and footer,
  **15.07:1** against `#15202b`; accent ring `#c2410c` at **4.92:1** on paper in the body. The r1
  3.2:1 muddy ring is gone (`rd3-measure.log` §FOCUS RINGS, `rd3-focus-navlink-1440.png`,
  `rd3-focus-footerlink-390.png`).
- **Skip link does what it says**: `activeElement === MAIN#main` on every chrome page, no ring
  painted around the whole page, next Tab inside `<main>`.
- **Measure is honest where it renders**: longest wrapped line 67.9 ch at 1440; 33–37 ch on the phone.
- **`.nav-toggle` is properly labelled**: `aria-label="Menu"`, `aria-controls="site-nav"`,
  `aria-expanded` toggled — the icon-only button costs nothing to a screen reader.
- **Nothing shifts while reading**: CLS 0 on 19 of 20 public pages, 0.0019 worst.

---

## Nits

- **Do not chase the "430 px jump" — it is the test harness, not the site.** `page.click('.nav-toggle')`
  in Playwright scrolls the document ~430 px at 390 / ~458 px at 768 before clicking (its
  scroll-into-view against the sticky header), so a scripted open/close looks like it throws the
  reader half a screen. A real `touchscreen.tap`, an in-page `element.click()` and a hand-applied
  class all leave `scrollY` **exactly** where it was, at 0 and at 2000, on both pages
  (`rd3-measure6.log`). I spent four probes proving this; it cost me nothing to report and it will
  cost the next person an afternoon.
- Activating the skip link scrolls the page 21 px and leaves the breadcrumb row **half-clipped under
  the sticky header** (`rd3-skiplink-activated-390.png`). `<main>` itself lands cleanly at 71.7. Only
  cosmetic, but it is the first thing a keyboard user sees.
- At 1440 there are **273 px of empty paper** between the article's right edge (775) and the TOC rail
  (1040) — the rail reads as unrelated furniture rather than as this page's map
  (`rd3-project-…-1440-600.png`). Creative director's call, not mine.
- 768 still gets the hamburger (60em break) and the open panel is a 720 px-wide navy slab with six
  left-hugging labels (`rd3-drawer-index-768.png`). Defensible, still slightly odd.
- Breadcrumb type is 13 px `#4a5159`; footer 15 px `#a9b6c2` on `#15202b` (~8:1). Both fine.
- Home's wordmark is still deliberately not a link, so `index.html` has no back-to-top affordance in
  the shell.
- `404.html`'s first Tab stop is its "Return to Home Region" button, not a skip link — it has
  `#main[tabindex=-1]` but no skip link. Parked by design (CD #7); noting it so nobody re-discovers it.

---

## Still handed to Wave 2 (re-checked, not scored)

1. **`interview-prep.html`** — r1's worst reader defect (zero keyboard-reachable content) is gone:
   the first Tab after the skip link now lands on a `BUTTON` inside `<main>`.
2. **Copy buttons** are 44 px tall now and reachable in the tab order, but a code block at 390 is
   still taller than the viewport, so the header-mounted Copy can scroll out of reach.
   Owner: code-and-diagrams.
3. **Architecture diagrams still use emoji glyphs** as icons (`rd3-project-…-1440-600.png`).
   Owner: code-and-diagrams.
4. **`resources.html` LCP 2.10 s** — the only page over the 1.8 s budget. Owner: images.
5. **SEO 92 on index/tools** (`link-text` on the frozen "Learn More" links) — HUMAN_TODO A5.

---

## Why 8.6 and not higher, and why it is a pass

Every one of the four defects that sank round 1 for this persona is fixed and I verified each with my
own measurement rather than the builder's: forward Tab enters the menu (6/6 links, both widths, both
page types), the skip link actually focuses `<main>`, nine of ten shell controls clear 44 px with no
overlapping hit zones, and the whole page — chrome and article — hangs off a single 152 px edge on
21/21 pages at 1440. The scroll lock is the round's best work: it survives synthesized finger drags
on the scrim, the panel and the header bar, at rest and mid-article, with the scroll position intact
on close. Add 6.6 % header, 0 overflow on 20/20, CLS 0, 15:1 focus rings on navy and a 67.9 ch worst
measure, and this is a shell I would ship.

It is not a 9+ because the drawer's modality is only three-quarters implemented: the scrim and the
lock arrived without a focus boundary, and those two fixes combine into a new failure mode — one Tab
past the last menu item and the focus ring is thousands of pixels off a page that is deliberately
frozen. That is a real defect, not a nit, and it is ~8 lines of `script.js`. The breadcrumb is the
last 44 px miss and it is the back-out control on 19 pages. Both are cheap; neither is worth blocking
the area for.

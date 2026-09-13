# Whole-site polish — round 1 builder report (2026-09-13)

Branch `facelift`, one builder, all areas. Every number below was measured on the tree as committed,
after the last edit. Instrumentation (git-ignored, under `harness/out/`): `pol-probe.js`,
`pol-probe2.js`, `pol-bands.js`, `pol-cls.js`, `pol-buttons.js`, `pol-veil.js`, `pol-deadclass.js`,
`pol-comments.js`, `pol-comments2.js`, `pol-shots.js` and **`adwell-states.js`** (item 18).
Screenshots are `harness/out/peek/pol-*.png`; every one cited was opened and looked at.

## Gate results (fresh, after the last edit)

```
node harness/snap.js --label polish-r1   -> 63 captures, 60 public rows
   consoleErrors 0 · pageErrors 0 · failedRequests 0 · axeSC 0 · axeAll 0
   hOverflow 0/60 · maxCLS 0 (no non-zero row) · maxLCP(lab) 132 ms
   (admin.html keeps its known local /.auth/me 404: 1 per width, auth-gated, excluded)
node harness/lh.js --label polish-r1
   index   100/100/100/92(link-text, frozen)  LCP 1.65  CLS 0  TBT 0
   projects 100/100/100/100 1.65 · tools 100/100/100/92 1.65 · interview-prep 100/100/100/100 1.53
   about 100/100/100/100 1.50 · project-multi-account-landing-zone 100/100/100/100 1.65
   resources 99/100/100/100 LCP 2.10 s  (was 2.18; still the recorded D2 exception, > 1.8 s)
node harness/integrity.js compare --base baseline-2026-09-13
   INTEGRITY: PASS (21 pages identical to baseline, 0 approvals applied)
node harness/weight.js            -> WEIGHT: FAIL (19 pages) vs f1ec399 — wave-wide, unchanged in kind
node harness/weight.js --ref aa980cb -> WEIGHT: PASS (all 20 pages lighter than the pre-polish tree)
apply-shell --check 0/19 · apply-article --check 0/11 · apply-code --check 0/11 (43 blocks, 1132 spans)
apply-ads --check "would place 0 units; skipped 33 (no slot id in docs/AD_UNITS.json)"
```

Budgets: perf ≥ 95 ✅ · a11y/BP 100 ✅ · SEO 100 except index/tools 92 (frozen "Learn More") ✅ ·
CLS ≤ 0.05 → **0** ✅ · 0 console errors on public pages ✅ · 0 axe of any impact ✅ ·
styles.css **8,564 B gzip** ≤ 8,600 ✅ · script.js **4,495 B raw** ≤ 4,600 ✅.

## Numbers vs the pre-polish tree (`aa980cb`)

| Metric | Before | After |
|---|---|---|
| styles.css | 42,682 raw / 9,418 gzip | **40,377 raw / 8,564 gzip** (−2,305 / −854, −9.1 %) |
| script.js | 4,080 raw (no focus trap, no ad logic) | **4,495 raw** (+415, both behaviours added) |
| 404.html | 2,899 B | **2,865 B** |
| Page weight (gzip) | — | **−701…−726 B on every page**; 404 −11 |
| Lab CLS, public pages | 0.0012–0.0014 on 11 project pages @1440 | **0 on all 60 rows** |
| resources.html LCP | 2.18 s | 2.10 s (still over budget, D2) |
| Distinct content right edges at 1440 (index) | 7 | **2** (792 prose · 1288 container) |
| Chip/badge radii site-wide | 4 (3 / 5 / 8 / 50 %) | **1** (`--radius-sm`, 5 px) |
| Full-colour emoji on public pages | 8 | **0** |
| Second accent (`#9d174d`) | on 3 selectors | **0 occurrences in the sheet** |

## Per item

**1. resources.html second accent → ink/neutral. DONE.**
`#9d174d`/`#f3c6de` deleted from the sheet. `.ps-logo` → `--ink`; `.pluralsight-promo` → the shared
card shell (hairline + 8 px + white, no left rule); `.course-level` joined the neutral chip family
(white ground, `--ink-2`, `--line` hairline). Probe: a sweep of every element on resources.html for
those two hues returns `magentaElements: []`.
Evidence: `pol-01-res-courses-1440.png`, `pol-02-res-courses-390.png`.

**2. One emoji-as-icon treatment, one selector list. DONE.**
`.tool-icon, .arch-component-icon, .course-meta span span { filter: grayscale(1); opacity: .7 }` —
one declaration in `[design-system]`; the per-area copies in `[code-and-diagrams]` and
`[listing-pages]` were removed. The eight `.course-meta` emoji were wrapped in a bare nested `<span>`
(markup only — `textContent` unchanged, `INTEGRITY: PASS` proves it) so the opacity lands on the
glyph and **not** on the label text: measured `.course-meta > span` is still
`filter: none / opacity 1 / rgb(89,97,105)`, so no contrast was traded away. All 8 glyphs measure
`grayscale(1) / .7`; the other 49 icons were already there.
Evidence: `pol-01-res-courses-1440.png` (🕑/🎓 greyscale), `pol-inv-toolrows-1440.png`.

**3. One chip/badge radius. DONE.** `--radius-sm` everywhere: `.code-lang` 3 px → 5, `.guide-aside a`
8 px → 5, `.step-number`/`.roadmap-number` 50 % → 5, `.book-cover` 2 px → 5. Measured across
index/projects/interview-prep/tools/project pages: every chip, badge and numeral reports `5px`
(the desktop rail link is `0px` by design — at ≥64em it is a plain ruled link, not a chip; at 390
the same element measures 5 px, 44 px tall).
Evidence: `pol-03-chiprow-390.png`, `pol-03-projects-390.png`, probe `radii`.

**4. List markers, and the rule written down. DONE.**
One line in `[design-system]`: `/* markers: em-dash rows or the accent tick. Nothing else. */`.
Removed: the accent `::marker` override in `.tips-box`, and the accent `•` on `.salary-card li`
(now the same em-dash as `.cert-card li`). Marker colour unified to `--ink-3` (`li::marker`,
em-dash, privacy's em-dash — the reader's "1.43:1 marker doing no work" nit). `.guide-list` and
`.project-skills/.course-topics` bullets are now the same disc at the same 1.25em indent as a plain
`<ul>`, so there is one bullet style rather than three indents.
Rendered treatments now: **(a) em-dash rows** (`.cert-card`, `.salary-card`, `.prose-compact`),
**(b) accent tick** (`.feature-list` on home/about/projects), plus the plain disc for enumerations
and no marker on `.resource-list` (navigable rows, chevron affordance — its `›` also went
`--line-2` → `--ink-3` so it is actually visible).
Evidence: `pol-04-certs-1440.png`, `pol-04-privacy-390.png`, `pol-12-steps-390.png`, probe `markers`.

**5. One callout language. DONE.** `.tips-box`, `.salary-note`, `.prose > .note` share one
declaration: `max-width: var(--band); margin: 0; padding: var(--sp-4); border-left: 3px;
border-radius: 0 8px 8px 0`. The only difference is the tint, and the rule takes that tint's own line
colour — documented in one line: `/* one callout shape; tint = voice: accent tip, paper-2 fine print */`.
The tips box lost its extra 1 px box border; 404.html's `.joke` was brought to the same shape (3 px
rule, 1 rem padding, same radius). Measured: all four callouts `padding 16px`, `border-left 3px`,
`radius 0 8 8 0`, right edge 792 (= the prose edge, which also closes the CD's "note ends 106 px
short" finding).
Evidence: `pol-05-tips-1440.png`, `pol-05-note-1440.png`, `pol-05-salarynote-1440.png`, `pol-15-404-1440.png`.

**6. "Advanced" three ways. DONE (verified identical; no change needed beyond the radius token).**
Measured `.page-eyebrow.project-level` (project page), `.project-level` on a card (projects.html)
and `.question-difficulty` (interview-prep): all three are `13px / 700 / 5px / 2.6px 7.8px /
.39px letter-spacing / height 24.73px`, and the tint family (green/amber/rose) is shared.
Evidence: `pol-06-eyebrow-1440.png`, `pol-06-cards-1440.png`, `pol-06-difficulty-390.png`, probe
`advCard` / `advEyebrow` / `advDifficulty`.

**7. Category heading double rule. DONE.** The 2 px ink rule under `.resource-category h3` /
`.interview-category h3` is gone; those h3s joined the existing small-caps eyebrow family
(`--ink-3`, `--fs-s`, `.07em`, `font-variant-caps: all-small-caps`) with a 1 px `--line` hairline
under them. The 2 px ink rule now belongs to the section only — noted in the sheet in one line.
Measured: `fontSize 15px`, `borderBottomWidth 1px`, `all-small-caps`.
Evidence: `pol-07-interviewcats-390.png` (reads as a grouped list, not a competing heading),
`pol-07-interviewcats-1440.png`, `pol-07-resourcecats-1440.png`.

**8. Band rules. DONE.** Policy, written into the sheet: *two content widths only — the container
(grids) and `--band` (prose) — and each band's rule ends where that band's widest content ends.*
`.section-subtitle`, `.content-text`, `.faq-list`, `.faq-answer p`, `.calculator-container`,
`.ps-promo-content` and the callouts all moved onto `--band`; `.band` (a class on the three
prose-only sections of index.html: roadmap, FAQ, CTA) caps their h2 rule to the same 792.
Measured at 1440: index bands are `rule = widestContent` on 7/7 (1288,792,1288,1288,1288,792,792)
and the distinct content right edges on index / projects / resources / tools / interview-prep are
**[792, 1288]** — seven widths became two.
Evidence: `pol-08-faq-1440.png` (rule and rows both end at 792), `pol-08-cta-1440.png`,
`pol-08-roadmap-1440.png`, `pol-08-tools-1440.png`, probe `pol-bands.js`.

**9. Hero stats and footer at 390. DONE.** `.hero-stats` is a grid: at <48em three 1/1/1 rows with a
hairline between (measured tops 354 / 415 / 477, each 61 px, each full 342 px wide, no orphan) and
the CTA still ends at y=609 on the first screen; at ≥48em `grid-auto-flow: column` restores the
one-row desktop strip ending at 792. Footer at 390: single column (1 distinct left edge), section
gaps 24 / 23 / 24 px (were 32) and `h4` margin tightened, so no voids.
Evidence: `pol-09-hero-390.png`, `pol-09-hero-1440.png`, `pol-09-footer-390.png`.

**10. Drawer focus trap. DONE — 9 lines in `script.js`.** While open, Tab cycles toggle + the six
links; measured forward stops 1–9 from a fresh open: Roadmap, Certifications, Interview Prep,
Projects, Resources, Tools, **Menu (toggle)**, Roadmap, Certifications — all `inHeader: true`, all
`inViewport: true`. Shift+Tab runs the cycle backwards (Roadmap → Menu → Tools). Escape closes and
returns focus to `.nav-toggle` (`aria-expanded=false`, `activeElement.className = nav-toggle`).
The r2 reader's "Tab 7 lands 4,231 px off-screen on a page that cannot scroll" is gone.
Evidence: `pol-10-drawer-tab7-390.png`, probe `trap`.

**11. Breadcrumb hit boxes. DONE.** `.breadcrumbs { padding-top: 6px }` and
`.breadcrumbs a { min-width: 44px; text-align: center }`. Measured at 390 on projects / about /
project pages: every crumb is **≥ 44 × 45.4 px**, its box top is **57.1** (the sticky header ends at
56), and a 5 × 9 `elementFromPoint` grid over each box returns the link **45/45 = 100 %** (was 89 %).
Evidence: `pol-11-crumb-390.png` (the whole ring is below the navy bar), probe `crumbs`.

**12. Step self-anchors labelled. DONE via `apply-article.js`.** The anchor is now
`<a href="#step-N" aria-label="Step N">N</a>`; the applier's pattern matches its own output, so it
stayed idempotent (`--check` 0/11 straight after a full apply). Six links per page, accessible name
"Step 1" … "Step 6", 48 × 48 px hit box, `+120 B` per page, text and href untouched
(`INTEGRITY: PASS`).
Evidence: probe `stepAnchors`, `pol-12-steps-390.png`.

**13. Diagram node names at 320. DONE.** `.arch-pair .arch-component-name { overflow-wrap: normal;
hyphens: none; min-width: fit-content }`, and the pair stacks to 1-up via a container query on
`.architecture-diagram` (`container-type: inline-size`; `@container (max-width: 17rem)`).
**Threshold note:** the request said 22 rem; measured, the diagram's container is 246 px at 320 and
316 px at 390, so 22 rem (352 px) would also have stacked the pair at 390 and undone the r2 win
there. 17 rem (272 px) stacks at 320 only. Measured at 320: pair is one 246 px column, Region A
(y 1598) → `↔ Replication` centred (y 1732) → Region B (y 1776), **0 single-word names on more than
one line** ("DynamoDB" intact), diagram `scrollWidth − clientWidth = 0`, document overflow 0; 390
still shows the two regions side by side.
Right-hand code veil verified at 320 on the one block that does not overflow (`HPA.YAML`,
`project-kubernetes-eks.html`, `scrollWidth − clientWidth = 0`): **no veil on either edge**, while
its four siblings (over by 139/285/478/231 px) still show theirs.
Evidence: `pol-13-diagram-320.png`, `pol-13-diagram-390.png`, `pol-13-codeveil-320.png`.

**14. Contact status slot reserved. DONE.** `display: none` dropped; the empty `div` holds
`min-height: 4.75rem` with a transparent border and no ground, `role="status"` kept, and it is still
before the button in the DOM. Measured at 390: `document.scrollHeight` **1891 → 1891 → 1891** and
button top **930 → 930 → 930** across rest / success / error. Nothing moves when a state lands.
Evidence: `pol-14-contact-rest-390.png`, `pol-14-contact-success-390.png`, probe `contact`.

**15. 404 header strip. DONE.** `.strip` is now `--navy` with no border (the shell's band), keeping
the `--aws-orange` cloud at 1.5 rem = the shell's 24 px mark and the shell's 56/64 px heights. The
file stayed self-contained and got **smaller: 2,865 B** (the now-unused `--line` token went with it).
Evidence: `pol-15-404-1440.png`, `pol-15-404-390.png`.

**16. `.ad-well` left-aligned. DONE.** `.ad-well { margin: var(--sp-7) 0 }` (was `auto`), which also
fixes the listing/home case the M&S critic raised. Measured at 1440 with a well injected at the
AD_PLAN anchors: inside `.project-guide` the well is **152 → 992**, exactly the article column
(`.guide-section` 152 → 992), `margin-inline 0/0`, reserved height 339 px; after `.interview-grid`
it is **152 → 1122** on the 152 register instead of centred at 235 → 1205.
Evidence: `pol-16-adwell-guide-1440.png`, `pol-16-adwell-listing-1440.png`, probe `adWell`.

**17. Interview overlay seams. DONE.** `.question-toggle { inset: 1px 0 }`. Measured at 390 and 1440
over all 17 buttons, grouped by column so category breaks are not counted: every in-column gap is
exactly **3 px**, **0 overlaps**, and `elementFromPoint` at every row boundary returns
`question-item` or nothing — never a second toggle.
Evidence: `pol-17-interview-390.png`, probe `pol-probe2.js` `seams@390` / `seams@1440`.

**18. Ad-well collapse decision (Wave 3 JS). DONE — proof in `harness/out/adwell-states.js`.**
~390 B in `script.js`: one `IntersectionObserver` marks a well `seen` the first time it intersects
(then unobserves it); one `MutationObserver` per well watches `data-ad-status` on
`ins.adsbygoogle, ins.adsbygoogle-demo` and adds `.is-unfilled` **only** when the status becomes
`unfilled` **and** the well has never been seen. No status is never a signal; CSS still cannot
collapse anything outside `.js`. Four cases on `_showcase/index.html` at 390 (the well sits at
docY 1047 in an 844 px viewport, i.e. genuinely below the fold):

| case | status | ever seen | result |
|---|---|---|---|
| A unfilled, never in view | `unfilled` | false | `.is-unfilled`, `display: none` — **collapses** |
| B scrolled into view, then unfilled | `unfilled` | true | no class, `display: block`, 339 px — **stays** |
| C filled / no status at all | `filled` then removed | false | no class, 339 px — **stays** |
| D `script.js` never runs (`html.no-js`) | `unfilled` | n/a | no class, 339 px — **never collapses** |

A fifth run with JavaScript genuinely disabled paints the well at 342 × 339 px and keeps
`class="no-js"`. Script verdict line: `PASS - collapse only on unfilled AND never seen`.
Evidence: `pol-18-a-unfilled-neverseen-collapsed.png`, `pol-18-b-unfilled-after-seen-stays.png`,
`pol-18-c-filled-stays.png`, `pol-18-d-nojs-never-collapses.png`, `pol-18-d2-js-disabled.png`.

**19. Showcase demo unit. DONE (kept as-is, deliberately).** `_showcase/index.html` still carries
`<ins class="adsbygoogle-demo" aria-hidden="true">` with no client and no slot, so the AdSense loader
can never pick it up; the collapse guard accepts both `ins.adsbygoogle` and `ins.adsbygoogle-demo`,
which is what the case table above exercises. No change to the file was needed.

**20. Bytes. DONE.** styles.css **42,682 / 9,418 → 40,377 / 8,564 gzip** (budget ≤ 8,600). How:
prose comments stripped to the seven markers plus **twelve** one-line rule notes (the ones the gate or
a future builder needs: markers, callouts, chip radius, band widths, emoji, `.cert-level`
text-transform, FAQ max-height, the interview button + seam, the ad-well contract, `clip` vs
`hidden`, the 17 rem pair threshold, the reserved status slot); dead rules removed (`.btn-primary`,
`.btn-secondary`, `.book-placeholder` — all zero uses in 21 pages); duplicate declarations merged
(one card shell for all nine panels including `.contact-form`, one numeral-badge rule for
`.step-number` + `.roadmap-number`, one em-dash marker rule, `.cert-card ul` / `.salary-card ul`
margins split instead of overridden, `border-block` for the two ad-well rules, two
`.form-status.error` rules folded into one); `--measure` and `--shadow-drawer` (one use each)
inlined; `rgba()` → hex-alpha. **The seven section markers are all present**; their prose tails were
trimmed (`/* ==== [listing-pages] ==== */`) as part of this item — the marker and its area tag are
intact. The file is not minified: one rule per line, 2-space indentation inside media queries.

## Component inventory — one treatment each (measured at 1440 unless noted)

| Component | Treatment (one) | Where / proof |
|---|---|---|
| **Chips & badges** | `--radius-sm` 5 px, `.2em .6em`, `--fs--1`, 1 px hairline | `.tag`, `.book-tag`, `.project-services span`, `.roadmap-skills span`, `.course-level`, `.project-level`, `.question-difficulty`, `.page-eyebrow`, `.level-jump a`, `.guide-aside a` (390), `.code-lang` — all measure `5px` |
| **Level / difficulty tints** | one three-hue family (green `--ok`, amber `--warn`, rose `--danger`) | `level-*` and `difficulty-*` share it; "Advanced" is byte-identical in all three renderings (13 px / 700 / 5 px / 24.73 px) |
| **Numeral badges** | one rule: 2 rem, 5 px, `--paper-2`, `--line-2` hairline, 720 tabular | `.step-number`, `.roadmap-number` (were peach 50 % disc vs paper 50 % disc) |
| **Callouts** | one shape: 3 px left rule + tint + 1 rem padding + `0 8px 8px 0`; tint is the only variable | `.tips-box` / `.salary-note` (accent tint = tip), `.prose > .note` + 404 `.joke` (paper-2 = fine print) |
| **List markers** | two: em-dash rows (`--ink-3`) and the drawn accent tick; plus the plain disc for enumerations and no marker on navigable rows | `.cert-card`/`.salary-card`/`.prose-compact` vs `.feature-list`; `.guide-list`/`.project-skills`/`.course-topics` all disc at 1.25em; `.resource-list` uses the `›` affordance |
| **Buttons — primary** | filled `--aws-orange` on `#e08600`, 5 px, 650, h 47 | `.cta-button`, `.calc-button`, `.contact-form button` — one per page |
| **Buttons — secondary** | transparent, 1 px `--line-2`, ink, 5 px, h 47 | `.project-link`, `.book-link`, `.course-link` (joined this round), `.cta-secondary` |
| **Buttons — in-text action** | the link language: accent, 650, underlined, 44.8 px tall; `↗` only when it leaves the site | `.cert-link` and `.tool-link` now measure identically (were rust-underlined vs ink-plain) |
| **Buttons — on navy** | dark chip, 5 px, `--navy-line` hairline | `.code-copy` (44 × 44 on coarse pointers) |
| **Row links** | full-row target, ink, no underline, hairline rows, chevron or small-caps eyebrow as the cue | `.resource-list a`, `.guide-nav-link` |
| **Card shell** | one declaration: 1 px `--line`, 8 px, `--surface`; zero shadows, zero gradients | `.cert-card`, `.salary-card`, `.project-card`, `.book-card`, `.course-card`, `.calculator-container`, `.roadmap-content`, `.pluralsight-promo`, `.contact-form` |
| **Emoji-as-icons** | one declaration: `grayscale(1)`, `.7` | `.tool-icon`, `.arch-component-icon`, `.course-meta span span` — 57 icons, 0 in full colour |
| **Accents** | one: `--accent` / `--aws-orange` | `#9d174d` and `#f3c6de` no longer appear in the sheet |
| **Radii** | two: 8 px panels, 5 px everything small (focus ring keeps its own 2 px) | measured across five page types |

## Left / not taken

- **`resources.html` LCP 2.10 s** (budget 1.8) — improved by 0.08 s from the lighter CSS, still the
  recorded D2 exception; needs the human's answer on the covers, not a CSS pass.
- **`WEIGHT: FAIL (19 pages)` vs `f1ec399`** — every page is 701–726 B gzip lighter than before this
  round and styles.css is 854 B lighter, but the pre-facelift baseline is still 2.5 KB gzip below
  the current sheet. Wave-wide and recorded, not a listed pass criterion.
- **index/tools SEO 92** (four frozen "Learn More"), **`images/books/sap-c02.jpg`** showing the wrong
  book, the **affiliate disclosure**/`rel="sponsored"` on resources.html, a **second door on 404**
  and the **contact companion aside** — all still content-approval or human items (HUMAN_TODO A5/A6,
  B-list), untouched.
- **Chip-row veil at 390**: it now fades to the chip ground (`--surface`) from 0 %, which is a real
  fade rather than the old 35 % band, but over the paper gaps between chips it is still nearly
  invisible by construction — the mid-word cut and the `ON THIS PAGE` eyebrow carry the affordance.
- **Not in scope, not taken**: the sticky chip band below 64em and a step-level rail (reader
  article #2/#3), the `.guide-meta` desktop track sizing (CD article #1), the pagination eyebrow
  wording (CD article #2), and `tools.html`'s desktop action distance (CD listing #5).
- **Taken beyond the list, cheaply**, because they were one line each and the evidence was already
  on screen: the rail's `aria-current` geometry is now reserved on every link (colour + a
  pre-allocated 2 px border instead of a weight change), which removed **the last non-zero CLS on the
  public site** (0.0012–0.0014 → 0 on all 11 project pages at 1440); `.resource-list a::after` and the
  privacy em-dash went `--line-2` → `--ink-3` so the two faintest marks on the site are visible;
  `.roadmap-content p` 48ch → 58ch (CD listing #3, measured 51–61 cpl was under the 65–75 band).

# Whole-site polish — round 2 builder report (2026-09-13)

Branch `facelift`, one builder, all areas. Everything below was measured on the tree as committed,
after the last edit. Instrumentation (git-ignored, under `harness/out/`): `pol2-probe.js`,
`pol2-rows.js`, `pol2-blocks.js`, `pol2-course.js`, `pol2-footer.js`, `pol2-promo.js`,
`pol2-adwell.js`, `pol2-totop.js`, `pol2-tab.js`, `pol2-axe-states.js`, `pol2-final.js`,
`pol2-shots*.js`, plus the byte passes `pol2-css-trim*.js` / `pol2-fix*.js` and the markup pass
`pol2-html.js` (attributes + one `data-ui` eyebrow). Screenshots are `harness/out/peek/pol2-*.png`;
every file cited was opened and looked at. Probe output: `pol2-before.json` / `pol2-after.json`,
`pol2-rows-before.json` / `pol2-rows-after.json`.

## Gate results (fresh, after the last edit)

```
node harness/snap.js --label polish-r2 --force  -> 63 captures, 60 public rows
   consoleErrors 0 · pageErrors 0 · failedRequests 0 · axeSC 0 · axeAll 0
   hOverflow 0/60 · CLS 0 on every public row · maxLCP(lab) 128 ms
   (admin.html keeps its known local /.auth/me 404 — 1 per width — and its 0.0187 CLS at 768:
    auth-gated, unchanged from baseline, excluded)
node harness/lh.js --label polish-r2
   index    100/100/100/92 (link-text, frozen)  LCP 1.65  CLS 0  TBT 0
   projects 100/100/100/100 1.65 · tools 100/100/100/92 1.53 · interview-prep 100/100/100/100 1.65
   about 100/100/100/100 1.50 · project-multi-account-landing-zone 100/100/100/100 1.65
   resources 99/100/100/100  LCP 2.10 s   (recorded D2 exception, unchanged)
node harness/integrity.js compare --base baseline-2026-09-13
   INTEGRITY: PASS (21 pages identical to baseline, 0 approvals applied)
   uiText gained exactly two strings: "Partner" (item 7) and "↑" (reader item c)
node harness/weight.js                 -> WEIGHT: FAIL (19 pages) vs f1ec399 — wave-wide, unchanged in kind
node harness/weight.js --ref 806170a   -> +290 B gzip on 18 pages, +309 resources, +410 interview-prep, +38 on 404
node harness/weight.js --ref aa980cb   -> every page still lighter than the pre-polish tree except 404.html (+27)
apply-shell  --check 0/19 would change
apply-article --check 0/11 would change
apply-code   --check 0/11 would change (43 blocks, 1132 spans)
apply-ads    --check "would place 0 units; skipped 37 (no slot id in docs/AD_UNITS.json)"
```

Budgets: perf ≥ 95 ✅ · a11y/BP 100 ✅ · SEO 100 except index/tools 92 (frozen "Learn More") ✅ ·
CLS ≤ 0.05 → **0** ✅ · 0 console errors on public pages ✅ · 0 axe of any impact ✅ ·
styles.css **8,680 B gzip** (level 6, the way `weight.js` measures; 8,628 at level 9) ≤ 8,700 ✅ ·
script.js **4,876 B raw** ≤ 4,900 ✅ · the back-to-top control is **297 B** of script ≤ 300 ✅ ·
the seven `styles.css` section markers are all present ✅.

## Numbers vs round 1 (`806170a`)

| Metric | r1 | r2 |
|---|---|---|
| styles.css | 40,377 raw / 8,564 gzip | **41,216 / 8,680** (+839 / +116) |
| script.js | 4,495 raw | **4,876** (+381: back-to-top) |
| 404.html | 2,865 B | **2,993** (hairline + `--navy-line`) |
| Page weight (gzip) | — | **+290 B** on 18 pages, +309 resources, +410 interview-prep, +38 on 404 |
| Home hero at 1440 | one 640 px column, 648 px (45 %) of empty paper | **two columns, 640 + 432, content to 1288** |
| Article right edges at 1440 (11 project pages) | 760 / 776 / 991 / 992 | **776 only** |
| Page-header band at 1440 | h1 895, subtitle 767 (two edges, 7 pages) | **792 / 792** (7 pages), **776 / 776** (project pages) |
| Footer tracks at 1440 | 4 declared always (`1.6fr 1fr 1fr 1fr`) — empty 4th on about/privacy | **4×260 or 3×357, the row always full** |
| List-marker kinds | em-dash, tick, disc, chevron **+ `circle` ×98** | **the same four; 0 `circle`** |
| Chip skins | control and label differed by 1 grey step | **three declared skins, measured distinct** |
| Pluralsight promo at 390 | white card 342×299, inner 294×251, filled orange CTA, no label | **paper-2 band 342×339.5, inner 294×289.5, outline CTA, "Partner" eyebrow** |

---

## Must (CD whole-site)

**1. Home hero at 1440 — DONE.** At ≥64em `.home-hero .container` is a two-column grid,
`grid-template-columns: var(--band) minmax(0, 1fr)` → **640 px + 432 px, column-gap 64**.
Every item is placed explicitly and **nothing is auto-placed** — measured `gridArea` per child:
`h1 = 1/1`, `.hero-subtitle = 2/1`, `.cta-button = 3/1`, `.hero-stats = 1/2/4/3`; no child reports
`auto`. Boxes at 1440: h1 152→792, subtitle 152→792, CTA 152→343 on row 3, stats panel **856→1288**
— the same right edge as the navy Key Skills card one band below, which is the track the CD said was
unresolved. The stats are the same three `.stat` elements in the same DOM order, re-read as a ruled
vertical list (three rows of 69.3 px, `justify-content: space-between`, hairline per row, no double
rule at the foot). The hero is 86 px shorter (bottom 548 → 462).
Below 64em is untouched: the one-row strip rule is now scoped `48em–63.99em` (that range query
replaced four "undo" declarations at ≥64em and paid for itself in bytes), so 390 keeps the 1/1/1
rows from r1 and 768 keeps the inline strip. At 1024 (the breakpoint edge) the tracks are 640 + 256
and nothing wraps.
Evidence: `pol2-01-hero-1440.png`, `pol2-01-hero-1024.png`, `pol2-01-hero-390.png`, probe `hero`.

**2. One right edge in the article column — DONE.** `.guide-page { --band: 39rem }`, and every
article block now takes `var(--band)`; the two rules that made code and diagrams fill the track
(`.guide-section { max-width: none }` and the `:not(.code-block, .architecture-diagram)` cap) are
gone. Measured across **all 11 project pages**, the set of right edges of every visible block in
`.guide-overview`, `.guide-section`, `.guide-navigation` and an injected `.ad-well` is:
**[776] at 1440, [648] at 768, [366] at 390** (was `[760, 776, 991, 992]` at 1440). The rail is
unchanged at **1040→1288**. Code that is wider scrolls inside its own block: of 43 blocks,
**6 scroll at 1440** (max 372 px), 37 at 390; **0 of 11 diagrams scroll at any width** and document
overflow is 0 at all three widths. The ad well follows: injected at the AD_PLAN anchor it measures
**152→776 (624 px), `max-width: 624px`, `margin-inline: 0/0`** — exactly the article column (was
152→992).
Evidence: `pol2-02-code-1440.png`, `pol2-02-diagram-1440.png`, `pol2-02-code-390.png`, probes
`pol2-blocks.js`, `pol2-adwell.js`.

**3. Page-header band widths — DONE.** `34ch`/`60ch` → `var(--band)` on both, and the project
template's title track (`.guide-page .page-header .container`) moved from `68ch` to `var(--band)`.
Measured at 1440: on the seven listing/static pages the h1 is **152→792** and the subtitle
**152→792** (was 895 / 766.5) — one edge, equal to those pages' prose band (`about.html`'s
`.content-text.prose` right edge is 792). On the 11 project pages both are **152→776**, i.e. the
prose column exactly (was 775.2 / 766.5 — close but never equal).
Evidence: `pol2-03-header-1440.png`, `pol2-03-header-proj-1440.png`, probe `header`.

**4. One footer — DONE.** `grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr))` at ≥48em.
At 1440 the row is always full: index (4 sections) → **4 tracks of 260 px, 152→1288**, with the
unused 5th track collapsed to 0; about/privacy (3 sections) → **3 tracks of 357.3 px, 152→1288**
(before: both page kinds declared `1.6fr 1fr 1fr 1fr`, so about/privacy left a 226 px empty track
at the right). Empty space under each column's content inside the row: index
**[178, 0, 91, 137] px**, privacy/about **[178, 0, 137]** — column 1's void shrank because its
description now wraps to two lines in a 260/357 px track instead of one line in 361.7. At 768 the
grid fits three 218.7 px tracks, so the four-section pages wrap "Legal" onto a second row **under
column 1**, which fills that void rather than leaving it; 390 is a single column, unchanged.
The 3-vs-4 *link set* is still a content difference (HUMAN_TODO), not something CSS can fix.
Evidence: `pol2-04-footer-index-1440.png`, `pol2-04-footer-privacy-1440.png`,
`pol2-04-footer-768.png`, `pol2-04-footer-390.png`, probe `pol2-footer.js`.

**5. The fourth bullet — DONE.** One line in `[design-system]`: `ul ul, ol ul { list-style-type: disc }`.
Marker inventory on interview-prep.html, measured per `<li>` by computed `list-style-type` + depth:
`circle depth2 ×98` → **`disc depth2 ×98`**, and **no `circle` on any page at any width**. The
rendered set is unchanged otherwise — em-dash rows, the drawn accent tick, plain disc for
enumerations, and the `›` affordance on navigable rows.
Evidence: `pol2-05-answer-390.png` (an open answer, nested list), `pol2-05-markers-1440.png`,
probe `markers`.

**6. Control vs label, and where a level word lives — DONE.**

*(a) The rule, now written in the sheet and here:* **the tinted level pill is only for a card's or
page's own classification; a level word that appears as one item inside a metadata row takes that
row's treatment.** Reconciled per component:

| Component | Job | Treatment | Measured |
|---|---|---|---|
| `.project-level` (cards + `.page-eyebrow`) | the project's own level | **level pill** | tint + that tint's line, 13/700, r5, h 24.7 |
| `.question-difficulty` | the question's own level | **level pill** | identical, h 24.7 |
| `.book-tag` incl. "Advanced" | one tag in `.book-meta` | **neutral tag** | `--paper-2`, **no border**, 13/650, r5, h 22.7 |
| `.project-services span`, `.roadmap-skills span`, `.tag` | metadata tags | **neutral tag** | identical |
| `.course-level` ("Learning Path") | a category, not a level | **neutral tag** | identical; keeps `text-transform: uppercase` — see the note below |
| `.course-meta` "🎓 Intermediate" | one fact in an icon fact row | **the row's plain fact text** | 15 px `--ink-3`, greyscale glyph (r1) |
| `.info-card .tag` (on navy) | metadata on a dark ground | neutral tag, dark variant | `#ffffff1f` fill, no border, `#ffd9a0` |

So "Advanced" now renders **two** ways, each with a stated job (pill = classification, tag = one
item in a tag row) instead of three arbitrary ones. Assumption stated: I did **not** promote the
`.course-meta` level to a pill, because the integrator's rule ("a level word inside `.book-meta`
stays a neutral tag") only makes sense if row context decides the treatment — and a pill inside a
row of icon facts would then contradict the neutral tag two centimetres away.
**Gate note:** `.course-level`'s uppercase had to stay. Dropping it turned `LEARNING PATH` into
`Learning Path` in `innerText` and `integrity.js` failed it as a content diff — the same reason
`.cert-level` carries the note. Both now share one line and the note says why.

*(b) Controls look like controls.* Inert tags lost their border and took the `--paper-2` fill;
clickable chips kept the `--line-2` hairline on white, gained a `›` `::after` in `--ink-3` and
`text-decoration: underline` on hover. Measured side by side on projects.html at 1440:
`.level-jump a` = white / **1px #d8d2c6** / r5 / h 44 / `::after "›"`; `.project-services span` =
**#f4f2ec / 0px border** / r5 / h 22.7 / `::after none`; `.project-level` = `#e7f4ec` + `#bfe0cd` /
h 24.7. Three visibly different objects in one frame. The ≥64em rail link drops the chevron with
the rest of the chip skin (it is a ruled link there, with the `aria-current` border as its cue).
The two control-chip rules also merged into one shared skin, which paid for most of the chevron.
Evidence: `pol2-06-chips-1440.png` (chips, tags and pills in one screen), `pol2-06-chips-390.png`,
`pol2-06-books-1440.png`, `pol2-06-railchips-390.png`, `pol2-09-veil-768.png`, probe `chips`.

**7. The Pluralsight panel reads as a partner placement — DONE.** It left the card-shell selector
list and became an editorial band: **`--paper-2` ground, 1 px `--line` top and bottom rules, radius
0, no side borders**, a `data-ui` eyebrow **"Partner"** above the wordmark in the site's existing
small-caps eyebrow family (15 px, `all-small-caps`, `--ink-3`), and the CTA demoted to the shared
outline button (`transparent` / `1px #d8d2c6` / `--ink`), so resources.html no longer spends its
orange on a partner link. Shape, measured at 390: **panel 342 × 339.5, inner `.ps-promo-content`
294 × 289.5** — the panel fails the MPU test on width (342 ∉ 280–320) and both boxes fail it on
height (∉ 230–270), so neither is within 12 px of a 300×250. (M&S measured 292×249 on the *inner*
box; that is the one that moved from 294×251 to 294×289.5.) At 768/1440 the inner box is 640×235 —
also outside on width. Nearest neighbour at 390 is a `.course-card` 342×578 at 32 px. A text scan
for `advertis|sponsor|partner|affiliate` inside the panel now returns **true** (was false). Text
unchanged; "Partner" is `data-ui` and shows up in the gate's uiText audit list.
Evidence: `pol2-07-promo-390.png`, `pol2-07-promo-1440.png`, probe `pol2-promo.js`.

**8. 404 strip — DONE (small addition to r1's band).** The band was already the shell's: `--navy`,
56/64 px, the `☁` in `--aws-orange` at the container gutter. Added this round: a **hairline rule
under the band** (`1px solid var(--navy-line)`, the shell's own line token) and the glyph placed in
a **24 × 24 box** (`display: grid; place-items: center`) so it occupies exactly the shell's
`.brand-mark` geometry at exactly the shell's x (152 at 1440, 24 at 390). Compare
`pol2-08-404-1440.png` with `pol2-08-shell-1440.png`: same band height, same mark size, same
position. No text added (the wordmark stays a content/approval item; the CD accepted the glyph).
404.html is self-contained and grew 2,865 → 2,993 B.
Evidence: `pol2-08-404-1440.png`, `pol2-08-404-390.png`, `pol2-08-shell-1440.png`.

## Should (judges' nits)

**9. The chip-strip veil at 768 — DONE, and it is now a real fade.** The veil existed at 768 but
faded to `--surface` (white), i.e. to the chips' own ground, so it was invisible over the paper gaps
and barely visible over a chip. It now fades to the **page** ground and starts solid:
`linear-gradient(270deg, var(--paper) 40%, #faf9f600)`, 48 px wide (was 32). Measured at 768 the
strip overflows by **208 px** (586 px at 390) and the `::after` computes
`rgb(250,249,246) 40% → rgba(250,249,246,0)` at both widths — the clipped chip fades into the page
instead of being cut.
Evidence: `pol2-09-veil-768.png`, `pol2-06-railchips-390.png`, probe `veil`.

**10. "Key Skills" tag contrast — MEASURED, no change needed.** `.info-card .tag` text `#ffd9a0`
against its own chip ground computes **8.50 : 1** (the ground is `#ffffff1f` over `--navy` =
`rgb(49,59,69)`); against the panel itself it is 12.32 : 1. Before this round it was 10.05 : 1 on
`#ffffff12` — the fill went up one step because the chip lost its border with the rest of the
neutral-tag family, and it is still far above 4.5 : 1. The judge's "orange on dark-brown chips"
contrast failure does not reproduce in this system; axe reports 0 colour-contrast findings on
index.html at all three widths.
Evidence: `pol2-10-keyskills-1440.png`, `pol2-01-hero-1440.png` (the panel in frame), contrast
computed from the measured computed styles.

**11. The truncated `<select>` on tools.html — DONE.** Measured at 390 before: the selected label
"Udemy courses (~$15 each on sale)" needed **266.3 px** against **246.5 px** of usable width
(control 292, inner 264.5, less ~18 px for the native arrow) — short by **19.8 px**, the only one of
six that overflowed. `.form-group select { padding-inline: .6em; font-size: var(--fs-s) }` gives
inner 272 and a label of 234.9 px → **19.1 px of slack**, and every one of the six selects now fits
(worst remaining margin: 19.1 px).
Evidence: `pol2-11-select-390.png`, probe `selects`.

**12. Intra-card rules when a title or description wraps — DONE for the named cards.** Measured per
visual row (cards grouped by identical `top`), all card grids, 768 and 1440. The **only** rule
inside a project card is `.project-header`'s bottom hairline (verified: `.project-content`,
`.project-services`, `.project-skills` have 0-width borders; `.project-link` has its own). Its
spread across a row was **24.8 px at 768 and 24.7 px at 1440** — caused by the *description*
wrapping to 1 vs 2 lines, not the title. `.project-header p { min-height: 3.3em }` at ≥40em (two
lines, the same device as the existing `min-height: 2.4em` on the card titles) takes every flagged
row to **0.0 px**. Cert cards measured 0.0 before and after (the link is anchored by
`margin-top: auto` and every cert description wraps to the same number of lines).
Book cards 0.0.
Left, measured and deliberate: `.course-meta`'s rule on resources.html at 768 still differs by
**24.8 px** on one row — there one description runs to 4 lines while the others take 3, so the only
fix is to reserve 4 lines for every course description, which buys one aligned rule at 768 and
spends a blank line in three cards at every width. I tried it (3 lines), measured that it fixed
nothing at 768 and only added whitespace at 1440, and reverted it.
Evidence: `pol2-12-projectcards-768.png`, `pol2-12-projectcards-1440.png`, `pol2-12-certs-1440.png`,
`pol2-12-courses-1440.png`, probes `pol2-rows.js` (before/after) and `pol2-course.js`.

## Final reader critic's items (folded in mid-round)

**(a) contact.html status slot — DONE.** `.form-status` is now `min-height: 4.75rem;
max-height: 4.75rem; overflow-y: auto`, and the slot carries `tabindex="0"`. Measured at 390 across
four states — rest / the page's success string / the page's error string / a 5-line unbounded API
error — the slot is **76 px in all four**, `scrollHeight` 74 / 74 / 74 / **148**, and the Send button
stays at document top **929.6 px in all four** (it moved +49 px before). The `tabindex` is not
decoration: with `overflow-y: auto` and no focusable content, axe raised
**`scrollable-region-focusable` (serious)** in the 5-line state; with it, axe reports **0 violations**
in that state. The full string is still announced — the slot keeps `role="status"`.
Evidence: `pol2-r1-contact-longerror-390.png`, `pol2-r1-contact-rest-390.png`, probes
`pol2-final.js`, `pol2-axe-states.js`.

**(b) Disclosure widgets wired for the API — DONE (attributes only).** All **17/17**
`.question-toggle` buttons carry `aria-controls="answer-N"` and all **17/17** `.answer` divs carry
the matching `id`; `#salaryResult` on tools.html carries `role="status"`. Verified live: opening
question 6 gives `aria-controls="answer-6"`, `aria-expanded="true"`, and
`document.getElementById('answer-6')` resolves. axe with an answer open: **0 violations**; axe with
the salary result shown: **0 violations**. No text, heading, link or `<pre>` changed
(`INTEGRITY: PASS`).
Evidence: `pol2-05-answer-390.png`, probes `pol2-shots.js`, `pol2-axe-states.js`.

**(c) Back to top below the fold — DONE, 297 B of script.** `script.js` appends
`<button type="button" class="to-top" data-ui aria-label="Back to top">↑</button>` (written as
`↑` so the file stays ASCII) and toggles `.is-on` when `scrollY > innerHeight`. Measured on
project / interview-prep / tools at 390 and 1440: hidden at rest **and** at 0.9 viewports
(`display: none`); after one viewport **44 × 44 px, `border-radius: 50%`, 16 px from the right edge,
96 px above the viewport bottom** (so a bottom anchor ad never sits under it), and
`elementFromPoint` at its centre returns the button. Click **and** keyboard Enter both land at
`scrollY 0`, including in a context with `prefers-reduced-motion: reduce` — the animation decision is
CSS's (`html { scroll-behavior: smooth }` is already switched to `auto` in the reduced-motion block),
so no JS branch was needed. It is hidden while the drawer is open (`html.nav-open .to-top
{ display: none }`, measured `none` with the drawer open). Keyboard focus gives the site's own ring
(2 px `#c2410c`, offset 2) at tab stop 32 — it is the last stop in the document. It is `data-ui`, so
the gate excludes it from content and lists "↑" in the uiText audit.
Deviation worth flagging: this is the site's **only** 50 % radius (r1's inventory had settled on 8 px
panels / 5 px everything small). I followed the integrator's instruction literally; if the CD would
rather keep two radii, `var(--radius)` is a one-token change.
Evidence: `pol2-r3-totop-project-multi-account-landing-zone-390.png`,
`pol2-r3-totop-interview-prep-390.png`, `pol2-r3-totop-tools-1440.png`,
`pol2-r3-totop-drawer-390.png`, probes `pol2-totop.js`, `pol2-tab.js`.

**(d)** Nothing else from that report is buildable without a content approval — step→code
cross-references and the level-jump landing both need new text or moved blocks. Untouched.

## Bytes: how the budget was met

The twelve items plus three reader items cost about 3.0 KB raw before trimming, which would have put
styles.css at 9,440 B gzip against a 8,700 budget. It came back down to **8,680** without dropping a
single item:

- the partner CTA joined the existing outline-button selector lists instead of overriding them;
  the "Partner" eyebrow joined the existing small-caps eyebrow family (two whole rules saved);
- `.guide-aside a` and `.level-jump a` were two near-identical chip rules — now one shared control
  skin (~240 B);
- the one-row hero stats strip is scoped to `48em–63.99em`, so the ≥64em panel needs no undo
  declarations (the sheet's one range query; it is cheaper than the four declarations it replaced);
- `.btn` is only used by `404.html`, which carries its own copy of those rules — removed from the
  sheet, like `.btn-primary`/`.btn-secondary` in r1;
- `--z-drawer`, `--z-skip` and `--accent-tint-2` were single-use or unused and were inlined/removed,
  the way `--measure` was in r1;
- comments were cut back to the seven section markers plus **ten** notes (nine of one line) — the ones a gate
  or a future builder needs (markers, the three chip skins + the level-word rule, the two content
  widths, hero placement, uppercase-vs-`innerText`, `clip` not `hidden`, FAQ max-height, the
  question button, the reserved-and-capped status slot, the ad-well contract).
  The sheet is still one rule per line, not minified.

`.to-top` keeps a standalone `:hover` rule rather than joining the outline-button hover list: the
merge made the file 4 B *larger* gzipped (a long selector list compresses worse than a short repeated
rule), which is measured, not assumed.

## Left / not taken

- **`resources.html` LCP 2.10 s** (budget 1.8) — the recorded D2 exception, unchanged; it needs the
  human's answer on the book covers.
- **`WEIGHT: FAIL` vs `f1ec399`** — wave-wide and unchanged in kind. Against the pre-polish tree
  (`aa980cb`) every page is still lighter except 404.html (+27 B gzip, the hairline and its token).
  Against r1, +290 B gzip per page buys the hero layout, the article measure, the back-to-top
  control and the aria wiring.
- **`.course-meta`'s rule at 768** — measured at 24.8 px of misalignment on one row, fix tried and
  reverted (see item 12).
- **`.project-skills` block tops differ by ~31 px across a row** — measured, but that block carries
  no border, so nothing visible misaligns; noted so the next critic does not re-find it.
- **index/tools SEO 92** (four frozen "Learn More"), the **3-vs-4 footer link set**, the
  **pagination copy**, **`images/books/sap-c02.jpg`**, the **on-page affiliate disclosure** and
  `rel="sponsored"`, and a **wordmark on 404** — all content or approval items (HUMAN_TODO), all
  untouched.
- **Not in scope, not taken**: the sticky chip band below 64em (the back-to-top control is the half
  of reader item 1 that is buildable), the 264 px gutter between the article and the rail at 1440,
  the diagram's two undeclared hues, and the open drawer toggle's orange border.

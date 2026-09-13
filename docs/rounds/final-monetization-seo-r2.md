# FINAL whole-site gate — monetization & SEO critic, re-check after polish round 2

```
Area: WHOLE SITE (polish r2 re-check)   Round: final-r2   Critic: monetization & SEO
Score: 8.5/10   Verdict: PASS   (was 8.8 at HEAD f22dfdf)
```

Date 2026-09-13 · branch `facelift` · HEAD `cff105e` · tree clean before and after (my probes live in the
git-ignored `harness/out/`). **No live ad was loaded.** Every Playwright context ran through
`harness/adblock.js` (non-localhost hosts fulfilled 204 / empty-JS). Production was never opened,
nothing ad-like was clicked. Every "ad" below is the repo's own `.ad-well` markup with a **local
striped `<div>`** in the slot — no `<ins>`, no network. I wrote no site file and no `docs/` file
except this one.

Probes (git-ignored): `harness/out/msr2-totop.js`, `msr2-ads.js`, `msr2-overlap.js`,
`msr2-overlap2.js`, `msr2-seo.js`, `msr2-seams.js` → matching `*.json`.

---

## Screenshots looked at

- `harness/out/peek/msr2-overlap-390.png` — project page at 390, scrolled so `article-mid-1` is level
  with the control: the round white **↑ button sits ON the striped ad slot**, over its right edge,
  inside the "ADVERTISEMENT" reservation. This is the finding.
- `harness/out/peek/msr2-overlap-768-listing.png` — resources.html at 768, `listing-mid` after
  `.books-grid`: same picture, the ↑ circle is inside the slot's right edge.
- `harness/out/peek/msr2-totop-1440.png` — interview-prep at 1440 after 2,000 px: the control is a
  44 px white circle on the navy footer, 16 px from the right edge, 96 px above the viewport bottom,
  nothing else fixed in frame.
- `harness/out/peek/msr2-totop-well-390.png` / `msr2-totop-well-1440.png` — the injected
  `article-mid-1` well in place; at 1440 the well runs 152 → 776 and the control is 604 px clear of it.
- `harness/out/peek/msr2-partner-390.png` — the Partner band at 390: `--paper-2` ground, rules top and
  bottom, radius 0, "PARTNER" small-caps eyebrow above the wordmark, **outline** "Start Free Trial".
- `harness/out/peek/msr2-partner-1440.png` — the same band full-bleed to the container (152 → 1288),
  inner text column 640 px; reads as an editorial partner band, not a card and not a creative.

## Gate results, run by me on this tree

```
node harness/integrity.js compare --base baseline-2026-09-13
   INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
   uiText audit now carries "↑" and "Partner" — both data-ui, both excluded from content, both listed

node harness/weight.js
   styles.css: raw 41216 (ref 35518), gzip 8680 (ref 6078)
   WEIGHT: FAIL (19 pages over their gzip baseline)   [recorded exception D1, not scored]
```

`harness/out/polish-r2/summary.json`, re-aggregated by me (60 public rows, admin.html excluded):
`consoleErrors 0 · pageErrors 0 · failedRequests 0 · axeSC 0 · axeAll 0 · hOverflow 0/60 ·
max CLS 0 · max LCP (lab) 128 ms · all 60 status 200`.

`harness/out/polish-r2/lighthouse/summary.json`: index 100/100/100/**92** (`link-text`, frozen copy),
projects 100/100/100/100, tools 100/100/100/**92**, interview-prep 100/100/100/100,
about 100/100/100/100, project-multi-account-landing-zone 100/100/100/100,
resources **99**/100/100/100 LCP **2.10 s** (recorded D2). CLS 0 and TBT 0 on all seven.

Summary line: `console=0 axeSC=0 axeAll=0 perf=99–100 seo=100 (92 index/tools, frozen)
cls=0 lcp=1.50–2.10 integrity=PASS weight=FAIL(recorded)`.

---

## (1) The `.to-top` control — the site's first fixed element

`script.js:89` appends `<button class="to-top" data-ui aria-label="Back to top">↑</button>`;
`styles.css:133–136` positions it. Measured on 6 pages × 2 widths after `scrollTo(0, 2000)`
(`msr2-totop.json`), with `scroll-behavior` forced to `auto` for the scroll-dependent runs
(smooth scrolling silently truncated my first two attempts — worth knowing for the next probe).

| | 390 × 844 | 1440 × 900 |
|---|---|---|
| rect | **330, 704 → 374, 748** (44 × 44) | **1380, 760 → 1424, 804** (44 × 44) |
| gap to viewport **bottom** | **96.0 px** | **96.0 px** |
| gap to viewport right | 16.0 px | 16.0 px |
| at rest / at 0.9 vh | `display: none` | `display: none` |
| `position` / `z-index` | fixed / **100** (`--z-header`) | fixed / 100 |
| `elementFromPoint` at centre | `to-top is-on/BUTTON` | `to-top is-on/BUTTON` |

Identical on project / interview-prep / resources / index / tools at both widths. Absent from
404.html and admin.html (no `script.js`). It is the **only** `position: fixed` element on any of the
21 URLs (`msr2-seo.json`) — last round that count was zero, so this is the change.

- **≥ 96 px above the viewport bottom: YES, exactly 96.0 px at both widths.** A ~90 px bottom anchor
  clears it by 6 px.
- **Hides with the drawer: YES.** `html.nav-open .to-top { display: none }`; measured `grid` → click
  `.nav-toggle` → `html class="js nav-open"` → **`none`** at both widths.
- **Ad-shaped: NO.** 44 × 44, `border-radius: 50%`, white on a 1 px `#d8d2c6` hairline, a single ↑
  glyph, no commercial text. It is not within 12 px of any standard creative.
- **Near planned wells: NO at 1280/1440 — but it sits ON them below that.** See issue 1.

**Verdict on the bottom anchor question:** acceptable *vertically* — 96 px is enough air for a ~90 px
anchor, and the anchor's own z-index (2147483647) will paint over the button rather than the reverse,
so no z-fight. **Not acceptable horizontally at ≤ 1024**, where it overlaps the in-content well. It
does not have to move for the anchor; it has to stop covering the article/listing slots.

---

## (2) Partner band on resources.html (`msr2-ads.json`)

| | 390 | 768 | 1440 |
|---|---|---|---|
| panel | 342 × 339.5 | 720 × 285 | **1136 × 285** (152 → 1288) |
| inner `.ps-promo-content` | 294 × 289.5 | 640 × 235 | 640 × 235 |
| within 12 px of 300 × 250? | **no** (both axes) | **no** | **no** |

Ground `--paper-2` `rgb(244,242,236)`, `border-radius: 0`, borders `1px/0/1px/0` `rgb(230,226,218)` —
an editorial band with top and bottom rules and no side borders. Eyebrow: `data-ui`, text
**"Partner"**, 15 px, `font-variant: all-small-caps`, `--ink-3`. CTA: **outline**
(`background: rgba(0,0,0,0)`, `1px solid rgb(216,210,198)`, `--ink`), 159.5 × 47 — the site's orange
is no longer spent on a partner link. A text scan for `advertis|sponsor|partner|affiliate` inside the
panel returns **true** (was false). The band sits **296–298 px** clear of the `listing-mid` anchor at
both widths, so a reader never sees it adjacent to a real unit. Last round's issue 4 measurement
(292 × 249 inner, filled orange CTA, no label) is **fixed**.

**Still no affiliate disclosure — unchanged, human item.** `resources.html` source: 8 Amazon
`?tag=dreamscribe09-20` links + 5 Pluralsight links, **all `rel="noopener"` only**;
`rel="sponsored"` **0**, `rel="nofollow"` **0**; `affiliat*` appears **once**, in the footer line
*"Not affiliated with Amazon Web Services"* — the opposite meaning; `commission` 0, `disclosur*` 0.
"Partner" labels the box, which is a real improvement, but it is not an FTC disclosure and it does not
apply to the 8 Amazon links. **HUMAN_TODO A6 1–2 stands (risk R2).**

## (3) Injected wells in `.project-guide` (`msr2-ads.json`, all five AD_PLAN positions × 390/768/1440)

| position | 390 | 768 | **1440** | aboveFold | label |
|---|---|---|---|---|---|
| `article-mid-1/2/end` (project) | 24 → 366 | 24 → 648 | **152 → 776** (624 px, `max-width: 624px`) | false | block |
| `listing-mid` (projects / resources / interview-prep) | 24 → 366 | 24 → 744 | 152 → 1122 (970) | false | block |
| `home-mid` (index, in a `.container`) | 24 → 366 | 24 → 744 | 152 → 1122 | false | block |

**Confirmed: the article wells are 152 → 776 at 1440** (were 152 → 992), i.e. exactly the new article
measure; `margin-inline: 0px/0px`, `grid-column: 1`, height **339.4 px** end-to-end at `--ad-h: 280px`
(unchanged — Wave 3's CLS budget is still 339, not 280). `aboveFold = false` at **every** position and
width, document `scrollWidth − clientWidth = 0` everywhere.
`project-infrastructure-as-code.html` still lands `article-mid-1` after "Choose Your Tool".
Clearance to the nearest tap target is unchanged: 63 px (home-mid / "Learn More"), 66 px
(interview-prep / `question-toggle`), 73 px (resources / "View on Amazon"), 97–128 px below the
article wells. `node harness/apply-ads.js --check` → **"would place 0 units; skipped 37"**, and the
`PLAN` now covers **all five** positions including `listing-mid` and `home-mid` — last round's issue 2a
is closed.

## (4) Frozen commercial artefacts

- **Tracking lines, all 21 pages, content-identical to `git show f1ec399:<page>` after
  `String.trim()`: YES, 21/21.** Counts match old vs new line for line (11 lines on the 8
  listing/static loader pages, 8 on the 11 project pages, **0** on 404.html and admin.html, which is
  also what `f1ec399` has). The only difference remains the `<head>` re-indent (4 → 2 spaces) from
  `apply-shell.js`; same `ca-pub-6676281664229738`, same `G-VBQ33BLD4E`, same `crossorigin`.
- **`<ins class="adsbygoogle">`: 0** in the shipped HTML and **0** in the live DOM of all 21 URLs;
  **`.ad-well` shipped: 0**. The only `adsbygoogle` strings in the repo are the 19 loader `<script>`
  tags. `_showcase/index.html` keeps its inert `ins.adsbygoogle-demo` (no client, no slot, 404'd in
  production).
- **`ads.txt`, `robots.txt`, `sitemap.xml`: byte-identical to `f1ec399`** (`cmp` on the git blob).
- **`staticwebapp.config.json`: `globalHeaders` (the whole CSP), `navigationFallback`,
  `responseOverrides`, `mimeTypes` deep-identical**; `routes` 3 → 10, the seven additive
  `statusCode: 404` blocks from the earlier wave. No change this round.

## (5) SEO sweep (`msr2-seo.js`, live DOM, all 21 URLs at 1440)

- **21/21 status 200. Exactly one `<h1>` on every URL.**
- **No new heading skips.** My live sweep reports one `2→4` skip on 16 pages (`1→4` on contact) — all
  of them the footer's `<h4>` column headings. I compared the **full heading-level sequence** of every
  page against `git show f1ec399:<page>`: **0 diffs on 21/21**, so every skip is pre-existing and
  byte-frozen, not introduced by the facelift.
- **Duplicate ids: 0 on 21/21.** `aria-labelledby`/`aria-describedby` dangling references: **0**.
- **`aria-controls` targets: every one resolves.** interview-prep.html has **18** `aria-controls`
  (17 `.question-toggle` + the nav toggle) against **17** `.answer` divs — **18/18 resolve**;
  every other page has the 1 nav toggle, resolving. `role="status"` present on `#formStatus`
  (contact) and `#salaryResult` (tools).
- Images without `alt`: 0. Empty links: 0. JSON-LD type sets unchanged (index
  `WebSite+Organization+BreadcrumbList+FAQPage`; listings `CollectionPage+BreadcrumbList`; tools
  `WebApplication+…`; interview-prep `FAQPage+…`; about `AboutPage+…`; privacy `WebPage+…`;
  contact/404/admin and all 11 project pages: none). `noindex` on 404.html only.
- Auto-ads seam exposure re-measured (`msr2-seams.json`) — **unchanged from last round, not worse**:
  the `.guide-aside` chip-row seam ends at **429** (eks) / **470** (static-website) / **498**
  (landing-zone) at 390 (vh 844) and **609–637** at 1440 (vh 900); `guide-meta`/`guide-overview` end
  at 650–875. Still above the fold at every width, still unfenced.

---

## Ranked issues (worst first)

**1. The new `.to-top` control physically covers every planned ad slot at 390, 768 and 1024 — a
36 × 44 px bite out of the creative's right edge.** **COMPONENT (`styles.css:133` + `script.js`),
Wave-3 blocker, new this round.** Measured with the well injected at each AD_PLAN anchor and the page
scrolled so the slot is level with the control (`msr2-overlap.json`, `msr2-overlap2.json`):

| width | slot rect | button rect | overlap | % of slot | `elementFromPoint` at button centre |
|---|---|---|---|---|---|
| **390** | 24 → 366 | **330 → 374** | **36 × 44 = 1,584 px²** | **1.65 %** | `to-top is-on/BUTTON` |
| **768** | 24 → 744 | **708 → 752** | **36 × 44 = 1,584 px²** | 0.79 % | `to-top is-on/BUTTON` |
| **1024** | 32 → 992 | **964 → 1008** | **28 × 44 = 1,232 px²** | 0.46 % | `to-top is-on/BUTTON` |
| 1280 | 72 → 1042 | 1220 → 1264 | **0** | 0 % | — |
| 1440 | 152 → 1122 / 152 → 776 | 1380 → 1424 | **0** (258 px / 604 px clear) | 0 % | — |

Reproduced on all three article positions (`article-mid-1/2/end`) and all three `listing-mid` pages;
`msr2-overlap-390.png` and `msr2-overlap-768-listing.png` show it plainly. Two separate problems in
one: (a) a publisher element **obscuring** an ad unit, which AdSense policy does not allow; (b) a
44 px tap target sitting on top of a creative — a mis-aimed tap at the button's lower-left lands on
the ad, which is the textbook accidental-click pattern this critic exists to catch. It is inert today
(0 wells shipped) but it bites on the first unit id. Note the button is *below* Google's own anchor
z-index, so this is about the in-content wells, not the anchor.
**Fixed looks like:** the cheapest correct fix reuses the machinery already in `script.js` — the
well `IntersectionObserver` at `script.js:89–95` already knows when a `.ad-well` is on screen; drop
`.is-on` (or add `.is-clear`) while any well intersects the control's band. Failing that, dock the
control to the left gutter below 64em, or hold it until `scrollY` is past the last well. Moving it
down is not a fix (that eats the anchor's 96 px), and shrinking it below 44 px breaks the tap target.

**2. `docs/AD_PLAN.md` is still wrong in the same four places.** **PLAN (docs only), carried over
unchanged from last round's issue 1, still a Wave-3 blocker.** Re-read at `cff105e`: line 13 still
says `article-end` goes "after the *Next Steps*" section (no project page has one — the sixth is
"What You'll Learn"); line 21 still says the 1st/3rd/5th `.guide-section` boundaries (the shipped
matcher uses 2/4/6, which is what I measured); line 14 still says "after book **grid**" (the class is
`.books-grid` — a probe copying the plan gets `anchor not found`); line 26 still says the `.ad-well`
`width: 100%` fix is "NOT fixed in Wave 1 r2 … Owned by Wave 3" (it landed; I measure
342/720/624/970 and `margin-inline: 0`). Add a fifth now: the plan's article well is implicitly
full-column, but `article-*` is **624 px** at 1440 since r2, so the `--ad-h` guesses should be tuned
against a 624 px responsive unit, not a 970 px one. **Fixed looks like:** five one-line doc edits.

**3. The Auto-ads excluded-areas list is still written down nowhere, and the seam it was for is still
above the fold at every width.** **Process + COMPONENT (`[article-template]`), carried over unchanged
(last round's issues 2b and 3).** `grep -n excluded docs/HUMAN_TODO.md docs/AD_PLAN.md docs/IDEAS.md`
returns two hits, neither of them a list: HUMAN_TODO's generic "and any excluded pages/areas" prompt
and AD_PLAN's note about the `data-ui` label. The four selectors Wave 2 asked for
(`.guide-aside`, `.guide-overview`, `.code-block`/`.code-examples`, `.interview-grid`) are still
unrecorded, and my re-measurement (§5) shows the chip-row seam at 429–498 px at 390 — unchanged from
last round, so no further regression, but no fence either. `.to-top` should join that list.

**4. resources.html: 13 monetised links, `rel="noopener"` only, no on-page disclosure.**
**PAGE, human-blocked (HUMAN_TODO A6 1–2), pre-existing, NOT re-scored.** The "Partner" eyebrow
(§2) removes the *MPU-shaped undisclosed promo* half of last round's issue 4; the FTC/link-spam half
is untouched — `rel="sponsored"` and `rel="nofollow"` are still **0 in the whole repo**. Risk R2 stands.

**5. `WEIGHT: FAIL (19 pages)` and resources.html LCP 2.10 s.** **Recorded exceptions D1/D2, not
scored.** styles.css 41,216 raw / **8,680** gzip (r1: 40,377 / 8,564); per-page overage vs `f1ec399`
is +275 B (404) … +4,017 B (realtime-data-pipeline), worst on the project pages, which is where three
of the five positions live.

## Nits

1. **96 px of anchor clearance is exactly 96 px, with no margin.** The brief's bar is met, but a
   ~90 px adaptive anchor leaves the ↑ button **6 px** above the ad — visually adjacent to a creative
   on every scrolled mobile screen. `bottom: 120px` would cost nothing and buy real separation. It is
   also the one number a future `--ad-h` tuning pass (HUMAN_TODO B4) could invalidate silently;
   worth a comment in `styles.css` next to `bottom: 96px`.
2. **New ad-shaped box at 390 that was not in last round's inventory:** `div.roadmap-content` on
   index.html measures **302 × 258** — within 12 px of a 300 × 250 MPU — on a **white** ground with a
   **1 px border**, i.e. the first shape-match on the site that is also filled and framed. It is
   **not clickable** and carries no commercial text, so it does not read as a creative; recorded so
   nobody re-finds it. (`div.guide-step` 342 × 269–277 and `ul.question-list` 342 × 287 are
   unchanged and still transparent; `div.question-item` 720 × 95 ≈ 728 × 90 at 768 likewise;
   `div.arch-component` 316 × 52 is navy inside the diagram. 1440: only three transparent
   `div.salary-range` 313 × 53.)
3. `.to-top` is `data-ui` and `z-index: 100` — the same layer as the sticky header, below Google's
   anchor. Correct, and the "↑" shows up in the integrity uiText audit as it should.
4. "ADVERTISEMENT" is still centred while the site is left-aligned, and the 970 px wells still end at
   1122 on pages running to 1288 (both carried from last round, both deliberate).
5. The CSP is still untested against live fill — no `*.adtrafficquality.google` entry. Frozen from
   `f1ec399`, untestable here by design, launch-day checklist item.

## Regressions vs the 8.8 report

**One, and it is issue 1.** Everything else either held or improved:

| | last round | now |
|---|---|---|
| `position: fixed` elements site-wide | **0** | **1** (`.to-top`), overlapping planned slots at ≤ 1024 |
| Pluralsight promo at 390 | 292 × 249 inner ≈ MPU, filled orange CTA, unlabelled | 294 × 289.5, outline CTA, **"Partner"** eyebrow — no longer MPU-shaped |
| `apply-ads.js` `PLAN` coverage | 3 of 5 positions | **5 of 5** (37 units dry-run, 0 placed) |
| article well at 1440 | 152 → 992 | **152 → 776** (the article measure) |
| CLS on 60 public rows | 0 | 0 |
| SEO fields vs `f1ec399` | identical | identical (heading sequences re-proven 21/21) |
| AD_PLAN drift / excluded-areas list | open | **still open, unchanged** |

**Why 8.5 and not 8.8.** The frozen-artefact and SEO half of the mandate is still spotless — 21/21
URLs, one h1 each, zero new heading skips proven against `f1ec399`, zero duplicate ids, 18/18
`aria-controls` resolving, ads.txt/robots/sitemap/CSP byte-frozen, zero `<ins>`, zero wells, CLS 0 —
and the partner band and the five-position placement path are both genuine improvements. But polish
r2 introduced the site's first fixed element and put it directly on top of every planned ad slot at
the three widths where most of the traffic is. That is a defect squarely inside this critic's
mandate, it was not caught by any gate, and it costs about four lines to fix. It passes because
nothing is live and the fix is trivial; it does not deserve the previous score.

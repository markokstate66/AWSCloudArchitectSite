# Wave 2 · Round 1 · READER critic

Persona: cloud engineer on a 390 × 844 phone, mid-task, wants one answer fast. Four areas scored
separately. Shell items from `wave1-r1-reader.md` (drawer keyboard order, header/breadcrumb/footer
tap targets, skip-link focus, 1440 page-header alignment) are **noted but excluded from every score
below** — a concurrent round-2 shell builder owns them. See "Shell items still present" at the end.

Everything below is measured on the Wave-2-as-landed tree — clean at `6bb6164` — against
`http://127.0.0.1:4173`. **Timing note for the panel:** the concurrent round-2 shell builder's
writes landed at 01:24:12 (`apply-shell.js`), 01:24:41 (`script.js`), 01:24:50 (HTML) and 01:29:39
(`styles.css`). Every screenshot I cite is timestamped ≤ 01:24:32 and every measurement run ≤
01:25:39, i.e. all of it is against the tree *before* the shell round changed anything. Nothing
here scores the shell round's work, and nothing here is stale with respect to Wave 2.
Instrumentation I wrote and ran: `harness/out/rd2-article.js`,
`rd2-article2.js`, `rd2-code.js`, `rd2-code2.js`, `rd2-listing.js`, `rd2-tools.js`,
`rd2-static.js`, `rd2-contact.js`, `rd2-misc.js`. Every screenshot cited was opened with Read.

---

## Site-wide gate results (shared by all four areas)

```
console=0  pageErrors=0  failedRequests=0  axeSC=0  axeAll=0
perf=99-100  a11y=100  bp=100  seo=100 (92 on index.html, pre-existing `link-text`)
LCP 1.5-2.18 s  CLS 0 (resources.html 0.0008 @768 / 0.0011 @1440)  TBT 0-5 ms
hOverflow: none - I re-ran documentElement.scrollWidth <= clientWidth at 390 on all 20 public
           pages myself: 20/20 OK. Long code lines overflow their <pre> (up to 994 px inner on
           project-cicd-pipeline.html) and the page never moves.
integrity = INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
weight    = WEIGHT: FAIL (19 pages over their gzip baseline); styles.css raw 44,347 (ref 35,518),
            gzip 10,884 (ref 6,078). Wave-level, not attributable to one area. All four builders
            flagged it; it needs an integrator decision, not four independent shaves.
```

Sources: `harness/out/{article-r1,code-r1,listing-r1,static-r1}/summary.json` and
`.../lighthouse/summary.json`, plus my own 20-page overflow sweep.

---

```
Area: article-template   Round: 1   Critic: reader   Score: 7.8/10   Verdict: FAIL
```

**Screenshots looked at**

- `harness/out/peek/rd2-at-mal-390-0.png` — arrival at 390. Breadcrumb → Advanced badge → h1 →
  overview → key facts as three hairline definition rows. **The chip row is not on this screen.**
- `harness/out/peek/rd2-at-mal-390-600.png` — the chip row, showing exactly three chips
  (Project Overview / Prerequisites / Architecture) ending flush at the right gutter with **nothing
  peeking past them**, then the ruled Prerequisites h2.
- `harness/out/peek/rd2-at-mal-390-1700.png` — steps 1–3: 28 px number badge in a 40 px gutter,
  bullet list running the full 342 px measure. Titles on one line.
- `harness/out/peek/rd2-at-mal-390-3000.png` — step 5 "Set Up IAM Identity Center" rendered cleanly,
  five bullets, full measure.
- `harness/out/peek/rd2-at-mal-1440-600.png` — two-column article, sticky "On this page" rail in
  column 2 with all seven links, diagram inside the measure.

**Gate results**: console=0 axeSC=0 perf=100 a11y=100 cls=0 LCP=1.65 s integrity=PASS

**The stopwatch test — can I reach step 5 in < 10 s at 390? No, not via the chip row.**
Measured flow: the aside starts at docY **843** in an 844 px viewport, so at rest the on-page nav is
invisible. After one scroll it shows **3 of 7 chips**, with **0 partially visible** (4th chip starts
at x=367, the list's right edge is x=366) and no gradient, mask or scroll-snap affordance
(`olBackground: none, maskImage: none, scrollSnapType: none`). The chip a reader needs —
"Step-by-Step Instructions" — is chip 4, off-screen, in a horizontal row nothing signals is
scrollable. If they do find it: the anchor lands correctly, and step 5 is then **another 1,497 px
(1.54 viewports)** below with no way to jump further, because `anyH3Anchor: false` — all six step
h3s have `id=""`. Thumb-scrolling blind from the top is ~3,160 px and actually *faster* than using
the feature that was built for this.

**Ranked issues (worst first)**

1. **The chip row shows 3 of 7 chips at 390 and gives no sign the other 4 exist — COMPONENT.**
   `project-multi-account-landing-zone.html` (all 11 project pages), 390.
   `rd2-at-mal-390-600.png`. Measured: `fullyVisibleChips 3, partiallyVisibleChips 0, totalChips 7,
   olRight 366, firstHiddenChipLeft 367` — a one-pixel miss that turns a scrollable row into what
   looks like a complete set of three. The builder's report claims "the third chip clipped at the
   edge (the scroll affordance)"; that is true at 768 (`partiallyVisibleChips: 1`) and false at 390.
   *Fixed looks like*: a right-edge fade/mask on the `<ol>` **and** enough padding that chip 4 is
   visibly clipped at 390 — or, better, two rows of wrapped chips at 390 (7 chips × ~30 px = 68 px
   of height, over the builder's 48 px budget but it makes the feature work). Either way the row
   must also start above 844 px so it is on the first screen; today it is at 843 and effectively is
   not.
2. **Tab order is inverted: "On this page" is tab stops 18–24, after the whole article and after
   the pagination — COMPONENT.** All project pages, 390. Measured (`rd2-article2.js`, clean load):
   1 skip → 2 brand → 3 nav-toggle → 4–5 breadcrumb → **6–15 copy buttons and `<pre>`s** →
   16–17 pagination → **18–24 the seven rail chips** → 25+ footer. The brief for this area is
   "Tab order through chips → content"; it is content → pagination → chips. `.guide-navigation`
   (line 428) precedes `.guide-aside` (line 432) and CSS `order` moves the aside visually to the
   top. The builder flagged this himself (§2.1) and shipped it.
   *Fixed looks like*: move the `<aside>` to the **first** child of `.project-guide` in
   `harness/apply-article.js` and delete the three `order` declarations — Wave 1 §8 already
   confirmed the explicit grid placement makes a DOM-first aside safe at 1440. 0 bytes.
3. **No anchor on any step — you cannot deep-link or jump to step 5 — COMPONENT.** All project
   pages, any width. `anyH3Anchor: false`; `h3Ids: ["","","","","",""]`. `rd2-at-mal-390-1700.png`
   vs `rd2-at-mal-390-3000.png` is 1,300 px of scrolling between them.
   *Fixed looks like*: `apply-article.js` already slugs h2s; do the same for `.guide-step h3`
   (`#set-up-iam-identity-center`) and nest them one level under the "Step-by-Step Instructions"
   chip on the 1440 rail. `scroll-padding-top` already handles the landing. ~30 B/page.
4. **Chips are 29.9 px tall — the page's own primary navigation control is under 44 px — COMPONENT.**
   390, `rd2-at-mal-390-600.png`. Same at 768. The rail links at 1440 are 199 × 29.2 (mouse-only,
   low priority). *Fixed looks like*: `min-height: 44px` with the visual pill kept via padding, as
   `code-and-diagrams` already did for `.code-copy` under `@media (pointer: coarse)`.
5. **The 1440 rail has no "you are here" — PAGE/COMPONENT.** `rd2-at-mal-1440-600.png`, scrolled to
   3000 and 7000 the rail is pinned at `top: 88` and all seven links stay identical
   (`rgb(74,81,89)`, 8.04:1). The `:target` rule only recolours the clicked **h2's** top border
   (verified `rgb(194,65,12)` on the target, `rgb(216,210,198)` on the rest) and clears the moment
   you scroll. On a 12.65-screen page the rail is a menu, not a map.
   *Fixed looks like*: the CSS-only `:target` treatment extended to `.guide-aside a:target-within`
   equivalent, or accept a ~15-line IntersectionObserver in `script.js`.
6. **Key-facts `dt` column is a fixed 116 px of 342 (34 %), squeezing the values — COMPONENT.**
   390, `rd2-at-mal-390-0.png`. "AWS Services:" gets a 116 px label and a **214 px / 3-line** value.
   *Fixed looks like*: below 40em stack `dt` above `dd` (label on its own 13 px line, value on the
   full 342 px) instead of a two-column 7.25 rem grid.

**What is right here (verified, so the panel does not over-correct)**

- **Anchor landing is exact.** All seven chips, re-measured after the smooth scroll fully settles:
  `top: 72, clearance: 16` at 390 and `80` at 1440 — every single one, including
  `#what-youll-learn` at scrollY 9210. (My first pass measured mid-animation and got garbage;
  the builder's number is correct.)
- **Steps no longer eat the measure.** Badge 28 × 28 at x=24, h3 at x=64, list at x=24 spanning the
  full 342 px. Step 5's title is one line (Wave 1: every title wrapped to two).
- **Key facts read as a spec sheet, not a card.** `dt` 13 px @ **5.97:1**, `dd` 15 px @ 16.06:1.
- **Pagination is usable**: 342 × 58.8 px cards, correct `← Previous Project` / `Next Project →`
  on middle pages (verified on `project-serverless-rest-api.html`), 16.91:1.
- **The 1440 rail is sticky and legible**: `position: sticky, top: 88px, grid-column: 2`, 248 px
  wide, unchanged at scrollY 3000 and 7000, 13 px @ 8.04:1.
- 0 console errors, 0 axe of any impact, CLS 0, no horizontal scroll anywhere.

**Why 7.8 and not 8.5**: the typography, anchors, step anatomy, key facts, pagination and desktop
rail are all publication-grade. But the one interaction this area exists for — reaching a specific
step on a phone — is defeated by an invisible chip row (1), has no destination to reach (3), and is
reached last by keyboard (2). All three are cheap: a fade, a DOM move, and a slug.

---

```
Area: code-and-diagrams   Round: 1   Critic: reader   Score: 8.2/10   Verdict: FAIL
```

**Screenshots looked at**

- `harness/out/peek/rd2-cd-mal-diag-390.png` — landing-zone diagram, **whole thing in one 390 screen**
  (429 px): Management Account → IAM Identity Center | SCPs → Security OU | Workloads OU → Sandbox OU.
  Emoji greyed to a quiet gutter glyph, arrows centred.
- `harness/out/peek/rd2-cd-eks-diag-390.png` — EKS, 386 px, Internet ↓ ALB Ingress ↓ EKS Cluster
  (Pods | Node Group), then ECR | Secrets Mgr. Clean sequence, legible without zoom.
- `harness/out/peek/rd2-cd-mrgn-diag-390.png` — multi-region: "Replication" rendered as a tall node
  **beside Region A only**, with Region B on its own row below. The group label wraps as
  "REGION A (US-EAST-" / "1)".
- `harness/out/peek/rd2-cd-sra-code-390.png` — the code-block header: small-caps file label, amber
  language chip, 54 × 44 Copy. Stripe-grade anatomy.
- `harness/out/peek/rd2-cd-cicd-cli-390.png` — the CLI block at 390: 14 px mono, lines truncated
  mid-token at the right edge ("--environment type=LINUX_CONTAINER,imag"), page not moved.

**Gate results**: console=0 axeSC=0 perf=100 a11y=100 cls=0 LCP=1.65 s integrity=PASS

**Ranked issues (worst first)**

1. **Copy is still not reachable on tall blocks — the Wave 1 hand-off was not fixed — COMPONENT.**
   9 of 11 project pages, 390. `rd2-cd-sra-code-390.png` shows the header; scroll into the block and
   it is gone. `.code-header` is `position: static` and `pre` is `max-height: none`. Usable viewport
   = 844 − 56 = 788 px. Measured scroll distance over which Copy is off-screen above:

   | page | tallest block | blocks > viewport | Copy off-screen for |
   |---|---:|---:|---:|
   | `project-serverless-rest-api.html` | 1,581 px | 1 | **793 px** |
   | `project-infrastructure-as-code.html` | 1,413 px | 3 | 625 px |
   | `project-kubernetes-eks.html` | 1,385 px | 2 | 597 px |
   | `project-serverless-contact-form.html` | 1,245 px | 2 | 457 px |
   | `project-multi-region-active-active.html` | 1,161 px | 2 | 373 px |
   | `project-multi-account-landing-zone.html` | 1,049 px | 3 | 261 px |
   | `project-realtime-data-pipeline.html` | 1,021 px | 2 | 233 px |
   | `project-cicd-pipeline.html` | 880 px | 2 | 92 px |
   | `project-three-tier-web-app.html` | 824 px | 2 | 36 px |

   The protocol question is "copy a CLI block with **one tap**". On the blocks a reader actually
   wants — the 1,581 px REST-API policy and the 1,413 px IaC template — it is scroll-up-then-tap.
   *Fixed looks like*: `position: sticky; top: <header>; z-index: 1` on `.code-header` (it is already
   opaque `--code-head`, so it needs no new surface), **or** `max-height: 60vh` on `pre` with its own
   vertical scroll so the header never leaves the screen. ~50 B either way.
2. **The multi-region diagram draws a relationship that is not true — PAGE.**
   `project-multi-region-active-active.html`, 390, `rd2-cd-mrgn-diag-390.png`. "Replication" is a
   full-height node to the right of the Region A group; Region B sits below as a separate full-width
   row. Read top-to-bottom that says "Region A replicates" then "here is a Region B", not "A ↔ B".
   The builder flagged this as a deliberate trade-off (§3.3) to keep the landing-zone OU row 2-up.
   *Fixed looks like*: let `.arch-row` go 1-up **only when a child is an `.arch-group`** (a
   `:has(.arch-group)` row query or a `flex-basis: 100%` on groups below 40em), so the three
   regions stack A → Replication → B. Costs ~130 px of height on one diagram; buys a correct one.
3. **The right-edge scroll veil is too quiet at 390 — COMPONENT.** `rd2-cd-cicd-cli-390.png`. The
   mechanism is real and correct (I confirmed the two-layer background and that the block that
   overflows is the only one showing it), but against `#11181f` the ramp to `#e6edf340` is barely
   perceptible on a phone, and the truncation itself ("…,imag", "arn:aws:iam::1234567") is the only
   cue that there is a further 654 px of CLI to the right.
   *Fixed looks like*: widen the veil from 1.6 rem to ~2.5 rem and/or raise its end alpha; the
   mechanism does not change.
4. **Diagram detail text is 12 px — COMPONENT, nit-plus.** Every node's second line
   ("Organizations + Control Tower", "Anycast IP"). Contrast is fine (**7.07:1** composited) but
   12 px is at the floor for the persona. 13 px would cost ~8 px of diagram height per row.
5. **2-up nodes wrap their names — COMPONENT.** Narrowest nodes are 128–154 px, so "IAM Identity
   Center" and "Log Archive" take two lines (`rd2-cd-mal-diag-390.png`) and
   `REGION A (US-EAST-1)` breaks after the hyphen. Cosmetic, but it is the thing that makes the
   2-up rows look cramped.

**What is right here — this is the best-executed work in Wave 2**

- **Every diagram fits one phone screen.** Measured `.architecture-diagram` `offsetHeight` at 390 on
  all 11 project pages: **374 / 374 / 374 / 386 / 429 / 431 / 438 / 459 / 459 / 492 / 504 px**
  (0.44–0.60 of an 844 px viewport). Wave 1 measured 706–896. `scrollWidth − clientWidth = 0` on
  every one — no diagram scrolls, at any width.
- **Contrast clears the ≥ 7:1 reference bar everywhere, measured against the *composited*
  background** (naive `getComputedStyle` reads give false 2.07:1 numbers on the `#ffffff08` lifts):
  code 14 px **15.13:1**, node name 14 px **13.35:1**, node detail 12 px **7.07:1**, group label
  12 px **7.36:1**, diagram note 13 px **7.98:1**, `.code-label` **7.79:1**, `.code-lang`
  **7.70:1**, `.code-copy` **6.75:1**.
- **The stray arrow is gone.** The four `.arch-arrow-down` elements that are direct children of
  `.architecture-diagram` now measure `centerOffset: 0, textAlign: center` on all four pages
  (`project-three-tier-web-app`, `-infrastructure-as-code`, `-multi-region-active-active`,
  `-multi-account-landing-zone`). Confirmed by eye in `rd2-cd-mal-diag-390.png`.
- **One tap copies.** Tapped `.code-copy` at 390 with touch: label → "Copied",
  `aria-label` → "Code copied to clipboard", class → `code-copy is-done`, **746 chars on the
  clipboard**, reverts after 1.8 s. Button is **53.9 × 44** under `pointer: coarse`.
- **Blocks scroll inside themselves.** `project-cicd-pipeline.html` Terminal Commands:
  `scrollWidth 994 / clientWidth 340` = 654 px of inner scroll, page `scrollWidth == clientWidth`.
  True on 20/20 pages.
- **Focus rings are real, under actual Tab** (not `.focus()`, which does not trigger
  `:focus-visible`): both `<pre>` and `.code-copy` give `rgb(255,153,0) solid 2px` at `-2px` offset.
  All `pre` carry `tabindex="0"`.
- Code type 14 px / 21.7 px (1.55) in `ui-monospace` — up from Wave 1's 13 px / 1.65.

**Why 8.2 and not 8.5**: the diagram redesign is a genuine 9+ — heights halved, labels intact,
contrast past the bar, stray arrow fixed, nothing scrolls. It is dragged down by one named
requirement that demonstrably fails on 9 of 11 pages (1) and one diagram that misstates its own
architecture (2). Issue 1 is ~50 bytes.

---

```
Area: listing-pages   Round: 1   Critic: reader   Score: 8.2/10   Verdict: FAIL
```

**Screenshots looked at**

- `harness/out/peek/rd2-lp-projects-390-400.png` — project cards at 390: level badge → 24 px title →
  one-liner → service chips → "What you'll learn" → 134 × 47 View Guide. Clean, consistent.
- `harness/out/peek/rd2-lp-res-390-400.png` — book cards: cover on quiet paper with a hairline,
  contained, then title / author / blurb / tags / 177.8 × 47 "View on Amazon". The second cover is
  visibly **The Kubernetes Book** under `sap-c02.jpg`.
- `harness/out/peek/rd2-lp-ip-390-400.png` — interview rows as ruled disclosures with a `+` at the
  right, difficulty chips inline, "Click to reveal answer" hint.
- `harness/out/peek/rd2-lp-tools-390-600.png` — calculator card: four labelled 48 px selects and a
  292 × 47 orange "Calculate Salary". One primary action on the screen.
- `harness/out/peek/rd2-lp-index-roadmap-390.png` — roadmap timeline at 390: rail + outlined number
  discs, card prose running ~29 chars per line.
- `harness/out/peek/rd2-lp-index-cert-390.png` — cert card with small-caps eyebrow, ruled spec list,
  and an 80.6 × 24.8 underlined "Learn More"; below it the ruled resource link rows with chevrons.

**Gate results**: console=0 (all 5 pages) axeSC=0 perf=100/99 a11y=100 cls=0 (resources 0.0011 max)
LCP index 1.65 s / resources 2.18 s integrity=PASS

**Ranked issues (worst first)**

1. **Cert "Learn More" links are 80.6 × 24.8 px — four of them, and they are the cert cards' only
   action — COMPONENT.** `index.html`, 390, `rd2-lp-index-cert-390.png`. This is the
   `[listing-pages]` cert-card component, not shell chrome, so it is in scope this wave. It is also
   the same four links Lighthouse scores as `link-text` (index SEO 92).
   *Fixed looks like*: `display: inline-block; padding-block: .6em` with a compensating negative
   margin — ≥ 44 px of hit area, same visual rhythm, 0 HTML bytes. Renaming them
   ("AWS Certified Solutions Architect – Associate details") also closes the SEO 92, but that needs
   a content approval.
2. **Cert-cost calculator checkboxes: 14.7 × 14.7 px input, 292 × 28 px label hit box on three of
   six — COMPONENT.** `tools.html`, 390. Measured: `cert-ccp`, `cert-security`, `cert-database` all
   have a wrapping-label hit height of **28 px**; the other three reach 56.1 px only because their
   labels happen to wrap to two lines. The calculator's whole interaction is ticking these.
   *Fixed looks like*: `min-height: 44px; align-items: center` on the wrapping `<label>` and a
   `1.15em` box on the input.
3. **`projects.html` has no way in — COMPONENT/PAGE.** 390, `rd2-lp-projects-390-400.png`.
   11 cards, **8,996 px = 10.66 screens**, every card **506–588 px**, no filter, no level grouping,
   no jump list (`anyFilterOrJumpNav: false`). "Serverless REST API" is card 6 at docY **3,503 =
   screen 4.2**. The protocol asks for "in seconds from the top"; it is four flicks past five cards
   that are all the same shape and height. The card design itself is good — there is just too much
   of it before the thing you want.
   *Fixed looks like*: group the 11 cards under the three level headings that already exist as data
   (Beginner / Intermediate / Advanced) with a short chip row of those three at the top, **or** a
   compact one-line-per-project index above the cards. Either is CSS + a small markup pass.
4. **Roadmap card prose is 244 px wide at 390 (~29 chars/line) — COMPONENT.** `index.html`,
   `rd2-lp-index-roadmap-390.png`. The rail + number disc still take **73 px** of the 342 px column
   (`roadmapTextLeft: 97`, container left 24) even though the number itself is only 32 px. This is
   exactly the mirror problem `wave1-r1-reader.md` issue 6 raised and it is unchanged.
   *Fixed looks like*: cut the gutter to ~48 px (rail at 24, disc overlapping it) → ~38 chars.
5. **`images/books/sap-c02.jpg` is a photograph of *The Kubernetes Book* while its `alt` says
   SAP-C02 — PAGE, needs a human.** `resources.html`, 390, `rd2-lp-res-390-400.png`. The builder
   flagged it and correctly did not touch frozen `src`/`alt`. On the page that monetises, a cover
   that visibly is not the book being sold is a trust hit. Needs a new image plus an `images`
   approval.
6. **Nit: the interview `+` affordance is small and far from the text it controls.**
   `rd2-lp-ip-390-400.png`. The whole 126–158 px row is the target, so it works; it just does not
   look like it does at a glance.

**What is right here — including the single biggest fix in Wave 2**

- **`interview-prep.html` went from zero keyboard-reachable content to fully operable.** Wave 1
  measured `main a[href], main button, main [tabindex], main input, main select` → **0 elements**.
  Now: **17** rows, `allFocusable: true` (`tabindex="0"` on every one, `missingTabindex: 0`),
  `role="button"` on every one, `aria-expanded` on every one. I tabbed to the first row (5 tabs from
  load) and drove it: focus ring `rgb(194,65,12) solid 2px`; **Enter** → `aria-expanded=true`,
  answer `display: block`; **Space** → back to `false`/`none`; **Space again** → open again; and
  `scrollY` stayed **0** through all of it, so `preventDefault` holds. This was the worst reader
  defect on the site and it is gone.
- **index FAQ works by keyboard**: `<button>`, `aria-expanded` flips false→true→false on Enter then
  Space, answer height 0 → 276 → 0, 2 px accent ring, no scroll jump, rows 85.2 px tall.
- **The tools calculator completes by keyboard and the answer is on screen.** Five stops
  (`#experience` → `#location` → `#certifications` → `#company` → Calculate), every select
  48.1 px with a real `<label for>`, button 47 px. Enter → result `display: block`,
  "Estimated Annual Salary $162,000 / Range: $143,000 – $186,000", panel at **top 505 / bottom 734**
  in an 844 px viewport: **fully visible with no scrolling** (110 px of slack).
- **No CLS risk from the book covers.** All eight `<img>` carry explicit `width`/`height`, a
  computed `aspect-ratio`, `object-fit: contain`; the first is `fetchpriority="high"` and not lazy,
  the other seven are lazy; after a full scroll all eight report their declared natural sizes
  (286×360 … 240×360). 357 KB → 143 KB. Lab CLS 0 at 390.
- **Card actions all clear 44 px**: View Guide 134.2 × 47, View on Amazon 177.8 × 47, tool-card
  actions 124–135 × 47, resource link rows 73.5 px.
- 0 console errors across all five pages, 0 axe violations of any impact, no horizontal scroll.

**Why 8.2 and not 8.5**: four of the five things the brief asked me to test are clean, and one of
them (interview-prep) is a complete rescue. It is held under the bar by two components whose only
control is under 44 px (1, 2) — on the two pages a phone reader is most likely to poke at — and by
a projects page with no findability affordance (3).

---

```
Area: static-pages   Round: 1   Critic: reader   Score: 8.3/10   Verdict: FAIL
```

**Screenshots looked at**

- `harness/out/peek/rd2-sp-about-390-500.png` — "What We Offer" as hairline definition rows with the
  drawn accent tick hanging in the gutter and each term on its own line. Editorial, not templated.
- `harness/out/peek/rd2-sp-about-1440-300.png` — same at 1440: 623 px column, ruled h2s, the list
  reads as a table of terms.
- `harness/out/peek/rd2-sp-privacy-390-900.png` — four sections in one phone screen; the "wall of
  twelve h2s" is gone. Also shows the accent ✓ applied to "Display relevant advertisements".
- `harness/out/peek/rd2-sp-contact-success-390.png` — form filled, focused textarea with an orange
  border, **"Send Message" sitting on the bottom edge of the viewport and the success message
  entirely below it, off-screen.**
- `harness/out/peek/rd2-sp-404-390.png` — paper page, orange cloud, big quiet 404, two-line h1,
  joke as a quiet note, one 232 × 47 orange CTA. Fits one screen.

**Gate results**: console=0 axeSC=0 perf=100 a11y=100 bp=100 seo=100 cls=0 LCP=1.5 s integrity=PASS

**Ranked issues (worst first)**

1. **The contact form's confirmation lands below the fold and shifts the page — PAGE + COMPONENT.**
   `contact.html`, 390. `rd2-sp-contact-success-390.png`. `#formStatus` sits **after** the submit
   button in the markup (`contact.html:77`), is `display: none` with `min-height: 0px` (height 0),
   and `contact.html`'s inline script never scrolls to it. I filled the form, scrolled the button
   into view, then set the success state exactly as the script does. Measured: button bottom
   **y = 844** (the viewport edge), status appears at **top 868 / bottom 944** —
   `fullyVisible: false` — and `document.scrollHeight` **grows by 99 px**. A phone user taps Send
   and sees nothing happen; `role="status"` covers screen readers only. The states themselves are
   well made (success 6.18:1 on a green tint, error 6.24:1 on a red tint, drawn CSS tick and ×,
   both `currentColor`) — they are just not where the reader is looking.
   *Fixed looks like*: reserve the slot (`min-height` on `.form-status` so nothing shifts) **and**
   move it **above** the submit button, which is both the fix and cheaper than a `scrollIntoView`
   the builder is not allowed to add. The div's markup position is inside `<main>` but the text is
   script-generated, so moving the empty div is gate-safe.
2. **`.note` blocks run 83 characters per line at 1440 — COMPONENT.** `about.html` and
   `privacy.html`, 1440, `rd2-sp-about-1440-300.png` (the Disclaimer/Affiliate blocks are further
   down the same column). Measured: widest `main p` = **623 px at 15 px = 83 CPL**. Because the note
   is set 15 px in the same 623 px column as 17–19 px body, it is the *longest* line on the page.
   REFERENCES #1 sets 65–75 ch. At 390 it is a comfortable 46 CPL.
   *Fixed looks like*: `max-width: 62ch` on `.prose > .note` (its own em-based cap, so it shrinks
   with its own font size). ~25 B.
3. **`404.html` gives a lost reader exactly one door — PAGE.** 390 and 1440, `rd2-sp-404-390.png`.
   `linkCount: 1` ("Return to Home Region"). No header, no nav, no link to Projects/Resources —
   which is the point of the self-contained 2.8 KB page, but it means the most common 404 (a stale
   deep link to a project guide) sends the reader all the way back to the home page.
   *Fixed looks like*: three more text links (Projects · Resources · Interview Prep) under the CTA.
   ~180 B on a 2,827 B page with a 3 KB budget — it fits.
4. **Field-level validation is native-browser-only — COMPONENT.** All four fields are `required`,
   the form has no `novalidate` (`invalidCount: 4`), so an empty submit produces a browser bubble
   in the browser's own styling while the carefully drawn `.form-status` sits unused. Not wrong,
   just inconsistent with the rest of the form's craft.
5. **Nit: the accent ✓ is applied to every `.feature-list` row regardless of meaning.**
   `rd2-sp-privacy-390-900.png` — a checkmark against "Display relevant advertisements" and
   "Click patterns and scroll behavior" reads as a benefit on what is a list of data collected
   about the reader. Consider a neutral marker (a hairline dash) for `.prose-compact` lists.
6. **Nit: form labels are 13 px.** Contrast is fine (8.04:1) but 13 px is at the floor for a phone
   form; 14 px would cost nothing.

**What is right here**

- **The prose rewrite works.** about: 19 px lead / 28.5 px, list rows 17 px / 28.05 px with 12 px
  padding and hairline rules, **40 CPL at 390 / 73 CPL at 1440**, body 7.18:1 and list 7.64:1.
  about is 4.0 screens at 390, privacy 5.39 — both scan by heading. `strong { display: block }`
  gives every term its own line and the gate still passes.
- **CLS is genuinely fixed**: 0 at every width on all four pages, against a baseline of **0.160** on
  about @768 and **0.100** on privacy @768.
- **Contact form fields all clear 44 px**: inputs **47.9**, textarea **152**, submit **47** (292 px
  full width at 390, 208 px auto at 1440). Every field has a real `<label for>` at 8.04:1.
  Focus gives the global `rgb(194,65,12) solid 2px` ring at 2 px offset **plus** an accent border on
  the field itself — visible in `rd2-sp-contact-success-390.png`.
- **404 is usable**: one screen at both widths (`fitsOneScreen: true`), a 232 × 47 CTA at 7.7:1,
  still `noindex`, still self-contained, no horizontal scroll.
- 0 console errors on all four pages at both widths, 0 axe, perf/a11y/bp/seo all 100.

**Why 8.3 and not 8.5**: the prose and the 404 are publication-grade and the CLS fix is real. The
one thing on these pages a reader *does* rather than reads — send a message — gives no visible
confirmation on a phone. That is one markup move and one `min-height` away from a pass.

---

## Shell items still present (noted, excluded from all four scores above)

Re-measured at 390 on `project-multi-account-landing-zone.html` while doing the Wave 2 work; the
round-2 shell builder owns all of these:

- `.nav-toggle` **40 × 36**, `.brand` **219 × 25**, breadcrumb `Home` **35 × 21** / `Projects`
  **45 × 21**, footer links **20 px tall** — all under 44.
- At 1440 the page-header band still starts at **x = 152** while the article starts at **x = 284**
  (`pageHeaderLeft: 120, h1Left: 152, articleLeft: 284`).
- Skip-link focus target and drawer DOM order: not re-tested this round.

## For the integrator

- **`WEIGHT: FAIL (19 pages)`** is real and wave-wide: `styles.css` is **44,347 raw / 10,884 gzip**
  against **35,518 / 6,078**. All four builders independently reached the same conclusion — it needs
  a wave-level decision (minify on deploy, or re-baseline for the facelift), not four more shaves.
  `INTEGRITY: PASS` and every Lighthouse/axe budget is met.
- The four cheapest fixes that would move three areas over the line, in order:
  1. `position: sticky` on `.code-header` (code-and-diagrams issue 1) — ~50 B.
  2. Move `<aside class="guide-aside">` to the first child in `apply-article.js` + delete three
     `order` rules (article-template issue 2) — 0 B.
  3. Move `<div id="formStatus">` above the submit button + `min-height` (static-pages issue 1) — ~30 B.
  4. A right-edge fade on the chip `<ol>` (article-template issue 1) — ~60 B.

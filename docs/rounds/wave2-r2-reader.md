# Wave 2 · Round 2 · READER critic

Persona: cloud engineer on a 390 × 844 phone, mid-task, wants one answer fast. Four areas scored
separately. Tree frozen at `59ad633` (`git status` clean at the start and end of this pass).
Everything below is measured against `http://127.0.0.1:4173` on that tree.

Instrumentation I wrote and ran (all git-ignored, under `harness/out/`): `rd4-article.js`,
`rd4-code.js`, `rd4-listing.js`, `rd4-static.js`, `rd4-extra.js`, `rd4-rail.js`, `rd4-copy.js`,
`rd4-diagtext.js`, `rd4-diagtext2.js`. Every screenshot cited below was opened with Read. I did not
re-run `snap`/`lh`; the shared numbers come from the fresh `harness/out/merged-r2/` snapshot
(63 rows = 21 pages × 390/768/1440, written 08:38–08:39) plus my own 390/320 sweeps.

---

## Site-wide gate results (shared by all four areas)

```
console=0  pageErrors=0  failedRequests=0   on all 20 public pages at 390/768/1440
           (the only console error in merged-r2 is admin.html's /.auth/me 404 from the local
            server stub — auth-gated page, excluded from public budgets, 1 per width)
axeSC=0  axeAll=0        on all 63 rows
hOverflow: none in merged-r2 at 390/768/1440, and my own sweep of the 20 public pages
           (scrolled to the bottom of each) at 390 and 320: 0/20 over at 390, 0/20 over at 320
CLS: 0 on every public row except the 11 project pages @1440 (0.0012–0.0014, the rail's
     aria-current weight change one frame after load). admin.html 0.0187 @768 (excluded).
Lighthouse mobile (harness/out/merged-r2/lighthouse/summary.json):
     index 100/100/100/92 (link-text)  LCP 1.65  CLS 0  TBT 0
     projects 100/100/100/100 1.65 · tools 100/100/100/92 1.65 · interview-prep 100/100/100/100 1.65
     about 100/100/100/100 1.50 · project-multi-account-landing-zone 100/100/100/100 1.65
     resources 99/100/100/100 **LCP 2.18 s** — the one budget miss (≤ 1.8 s)
integrity = INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals)
weight    = WEIGHT: FAIL (19 pages); styles.css raw 42,682 / gzip 9,418 (ref 35,518 / 6,078)
            — wave-wide, unchanged in kind from r1, integrator item
```

`INTEGRITY: PASS` is also the proof that the new build-time highlighter did not move a byte of code
text: the gate hashes `pre` text and all 21 pages are identical.

---

```
Area: article-template   Round: 2   Critic: reader   Score: 8.6/10   Verdict: PASS
```

**Screenshots looked at**

- `harness/out/peek/rd4-at-mal-390-0.png` — arrival at 390: breadcrumb → badge → h1 → subtitle →
  **`ON THIS PAGE` eyebrow and the chip row on the first screen**, "Architecture" running off the
  right edge, then the overview and the key-facts rows with all three values aligned at x=129.
- `harness/out/peek/rd4-at-chiprow-390.png` — 3× close-up of the chip row at 390: three 44 px chips,
  the third clipped with its right border gone and the last glyph under the 32 px paper fade.
- `harness/out/peek/rd4-at-chiprow-768.png` — same at 768: six chips, "Code Examples" cut under the
  veil and a 4 px sliver of chip 7 past it.
- `harness/out/peek/rd4-at-mal-390-chiprow-swiped.png` — after one 200 px horizontal swipe:
  "Step-by-Step Instructions" fully in view; the left-hand chip is hard-clipped (no left veil).
- `harness/out/peek/rd4-at-mal-390-after-chiptap.png` — where the chip tap lands: the ruled
  "Step-by-Step Instructions" h2 at y=72, steps 1–2 in full below it.
- `harness/out/peek/rd4-at-mal-390-step5.png` — step 5 "Set Up IAM Identity Center" reached, five
  bullets on the full 342 px measure, step 6 and the Tips band below.
- `harness/out/peek/rd4-at-mal-1440-3000.png` — 1440 at scrollY 3000: one left edge at 152, the
  840 px code track, and the rail marking **Code Examples** with the accent bar.

**Gate results**: console=0 axeSC=0 perf=100 a11y=100 bp=100 seo=100 cls=0 (0.0013 @1440)
LCP=1.65 s integrity=PASS

**The stopwatch test — reaching step 5 at 390 from a cold load.** Measured, not estimated:
the aside now starts at docY **348–417** on all 11 project pages (r1: 843), so the nav is on the
first screen. The chip a reader needs is chip 4 and is off-screen at rest (`x=375`, list right edge
366), so the flow is **1 horizontal swipe (200 px) → 1 tap → 2 downward flicks**. The tap jumps
scrollY 0 → 1,799 and puts the h2 at top 72; step 5 is then **1,497 px (1.77 viewports)** further
down and I reached it at scrollY 3,199 with the heading at top 97. Four gestures, ~1,400 px of
manual scrolling past four scannable step titles — comfortably inside 10 s, and roughly 1,800 px
cheaper than thumb-scrolling from the top (step 5 sits at docY 3,296). **Step anchors are present**:
`step-1 … step-6` on 11/11 pages, and `…#step-5` from cold lands the heading at top 72.

**Everything r1 flagged was actually fixed** (verified, not taken on trust): chips **44.0 px** tall
on 11/11 pages; **1 partially-visible chip at both 390 and 768**; the `ON THIS PAGE` label is
rendered; tab order from a clean load is `skip → brand → nav-toggle → breadcrumb ×2 → **the seven
chips (stops 6–12)** → content`; key-facts `dt` is **93 px** (was a fixed 116) with `dd` at 129 on
all three rows; the 1440 rail marker is exact — at scrollY 0/1000/2000/3000/4000/5000/6000/7000/
8000/9000 there is **always exactly one** `aria-current` and it matches the heading at the 120 px
reading line every time.

**Ranked issues (worst first)**

1. **Six unlabelled tab stops named "1"…"6" now sit between the chips and the article — COMPONENT.**
   All 11 project pages, any width. `rd4-at-mal-390-after-chiptap.png` (the numbered discs).
   `apply-article.js` wraps each step number in `<a href="#step-N">N</a>` with no `aria-label`, so a
   keyboard reader's stops 13–18 are six links whose entire accessible name is a digit and whose
   destination is themselves. Measured tab order stops 13–16: `A[1] A[2] A[3] A[4]`. Nothing in the
   UI says the number is a link, so a 44 × 44 tap target that appears to do nothing is also sitting
   on every step.
   *Fixed looks like*: `aria-label="Link to step N"` on the anchor (≈ 25 B/page, `apply-article.js`),
   or drop the anchor entirely and keep the `h3` ids — deep links already work without it.
2. **The chip row still cannot reach a step; step 5 is 1,497 px past the only chip that points at
   it — COMPONENT.** 390, `rd4-at-mal-390-after-chiptap.png` → `rd4-at-mal-390-step5.png`.
   The ids exist but nothing links to them, so the last 1.8 viewports of the journey are blind. This
   is the r2 request's own deliberate scope call (item 4, "keep the rail to h2s"), so it is a
   knowingly-accepted gap rather than a miss — but it is still the difference between "find the step
   fast" and "find the section fast".
   *Fixed looks like*: a second, compact `Steps 1–6` strip inside the Step-by-Step section (six
   ~44 px numeral chips, `data-ui`, ~120 B), or nest the six step links under the Step-by-Step rail
   item at ≥ 64em only.
3. **Below 64em the chip row is one-shot: it is not sticky and there is no back-to-top, so after the
   first screen there is no on-page nav for the remaining ~12 screens — COMPONENT.** 390,
   `rd4-at-mal-390-step5.png` (nothing but content in frame). `styles.css:237–244` gives the aside
   `position: static` under 64em; `position: sticky` only appears at `:249–257`. Document height at
   390 is **10,998 px = 13.0 screens**. Having read step 5, getting to "Code Examples" means either
   ~3,300 px of upward flicking or ~1,700 px down with no map.
   *Fixed looks like*: make the 44 px chip band sticky under the 56 px header below 64em (the
   header+band would take 100 px = 11.8 % of the viewport, still well inside budget), or a small
   back-to-top control once scrollY > 2 viewports.
4. **Only 3 of 7 chips are visible at 390 and the affordance is a missing border — COMPONENT.**
   `rd4-at-chiprow-390.png`. The 32 px `--paper → transparent` veil starts its ramp at 35 %, so over
   a white chip on paper it is nearly invisible; what actually reads is that the third chip has no
   right border and its final glyph is cut. It works, but it is the quietest possible version of the
   cue, and a reader who does not try the swipe never learns four more sections exist.
   *Fixed looks like*: start the ramp at 0 % (a real fade), or clip the partial chip deeper so half a
   word is missing rather than one letter.
5. **Nit: no left veil when the row is scrolled.** `rd4-at-mal-390-chiprow-swiped.png` — the
   left-hand chip is hard-cut at the container edge with no fade, the mirror of the treatment the
   code blocks now get on both edges.
6. **Nit: the 1440 rail links are 29 px tall** (`min-height: 0` at ≥ 64em). Mouse-only, low priority,
   unchanged from r1.

**Why 8.6**: every r1 defect is measurably gone — the nav is on the first screen, the chips are
44 px, the tab order is nav-first, the key facts breathe, the desktop rail tracks the section you
are reading, and the stopwatch run now finishes in four gestures. It is held off a 9 by three things
a reader feels: six dead tab stops the round introduced (1), a last leg the nav still cannot help
with (2), and a nav that disappears for twelve screens (3).

---

```
Area: code-and-diagrams   Round: 2   Critic: reader   Score: 8.8/10   Verdict: PASS
```

**Screenshots looked at**

- `harness/out/peek/rd4-cd-sra-copy-600.png` — **600 px inside the 1,581 px `LAMBDA_FUNCTION.PY`
  block on `project-serverless-rest-api.html` at 390**: the header is pinned at viewport y=56 with
  `PYTHON` and `Copy` on it, Python keywords blue, strings green, calls yellow.
- `harness/out/peek/rd4-cd-sra-copied-390.png` — the same view after one touch tap: the button reads
  **Copied** in green.
- `harness/out/peek/rd4-cd-mal-syntax-390.png` — `DENY-REGIONS-SCP.JSON` at 390: keys light blue,
  values green, filename leading in ink, `JSON` demoted to an outline chip, right veil on.
- `harness/out/peek/rd4-cd-cicd-veil-390.png` — the bash block on `project-cicd-pipeline.html`:
  comments grey italic, `aws` blue, `--flags` muted, and a clearly visible 32 px right veil.
- `harness/out/peek/rd4-cd-cicd-veil-scrolled-390.png` — the same block scrolled to `scrollLeft 200`:
  the left veil has appeared and the right one is still there. Page did not move.
- `harness/out/peek/rd4-cd-mal-diag-390.png` — landing-zone diagram, whole thing in one screen,
  1-up, no node name wrapping, three hues, 13 px detail lines.
- `harness/out/peek/rd4-cd-mrgn-390.png` — **multi-region fixed**: Region A and Region B side by
  side, `↔ Replication` centred beneath the pair.
- `harness/out/peek/rd4-cd-mrgn-320.png` — the same shape holds at 320; "DynamoDB" breaks as
  "Dyna / moDB" inside its node.

**Gate results**: console=0 axeSC=0 perf=100 a11y=100 bp=100 seo=100 cls=0.0013 @1440
LCP=1.65 s integrity=PASS

**The four named checks, measured**

- **Copy at 600 px into the 1,581 px block**: `.code-header` is `position: sticky` inside a block
  that is now `overflow: clip`; at scrollY 4,700 the header sits at **y=56** and Copy at **y=64,
  53.9 × 44, fully on screen**. One real touch tap there put **1,739 characters** of clean Python on
  the clipboard, flipped the label to "Copied" and `aria-label` to "Code copied to clipboard", and
  reverted after 1.8 s. r1's worst case (793 px of Copy-less scrolling) is gone.
- **Syntax highlighting exists and is readable.** 43 blocks across 11 pages, **0 flat blocks**.
  Measured against the composited `--code-bg` `#11181f`: comment `#9aa7b0` **7.26:1**, keyword
  `#8ab4f8` **8.49:1**, string `#a5d6a7` **10.88:1**, number **11.06:1**, variable **11.94:1**,
  function **12.61:1**, plain code **15.13:1** — every class clears 7:1, let alone 4.5:1, all at
  14 px / 21.7 px.
- **Diagram heights at 390**: 379 / 379 / 379 / 415 / 465 / 465 / 496 / 500 / 505 / 511 / 548 px
  (0.45–0.65 of the viewport). **At 320**: 400 / 400 / 400 / 450 / 465 / 487 / 496 / 505 / 521 /
  532 / **569** px. `scrollWidth − clientWidth = 0` on every diagram at both widths, and no page
  overflows at either.
- **The multi-region pair holds at 320**: measured children — Region A `[x 37, y 1592, w 119]`,
  Region B `[x 164, y 1592, w 119]` (same row), Replication `[x 72, y 1778, w 176]` centred beneath.
  Same shape at 390. r1's "arrow pointing at nothing" is fixed.

Also verified: `pre` blocks still scroll inside themselves (409–601 px of content in a 340 px box on
the landing-zone page, page `scrollWidth == clientWidth`), all carry `tabindex="0"`, and diagram
text contrast is unchanged-or-better — node name 14 px **13.35:1**, detail **13 px 7.07:1** (was
12 px), group label 12 px **7.34:1**, note 13 px **7.98:1**, `.code-label` **14.72:1**,
`.code-lang` **7.79:1**, `.code-copy` **6.75:1**.

**Ranked issues (worst first)**

1. **At 320 node names break mid-word — COMPONENT.** `project-multi-region-active-active.html` and
   any 2-up group at 320, `rd4-cd-mrgn-320.png`. The name box inside a paired region is **42 px**
   wide, so `overflow-wrap: break-word` splits "DynamoDB" into "Dyna / moDB" and "App Stack" into
   two lines. A broken service name in an architecture diagram is the one place a reader cannot
   guess the missing half. 390 is clean; this is a 320-only defect introduced by pinning the pair to
   two columns at *every* width (builder §0.5).
   *Fixed looks like*: below ~360 px let the paired regions stack (or drop the 1.5 rem icon gutter
   inside paired nodes so the name box gets ~90 px) and keep `break-word` as the last resort, not
   the first.
2. **The right veil sits over the text you are reading, not just over the overflow — COMPONENT.**
   All 390 code blocks that overflow, `rd4-cd-cicd-veil-390.png`. At `rgba(230,237,243,.44)` across
   32 px the ramp is short enough that the last token on every line is washed out
   (`location=https://g…`, `image=aws/codebuild/amazonlinu…`) even before you scroll. r1 asked for a
   louder veil and got one; it is now slightly louder than it needs to be at the inner edge.
   *Fixed looks like*: keep the 32 px width and the end alpha but move the ramp's start to 0 %
   (currently it reads as a band rather than a fade), so the wash is concentrated in the outer
   ~12 px.
3. **Nit: `.code-lang` is 11 px and `.arch-group-label` is 12 px.** Both clear 7:1 but sit below the
   13 px floor the rest of this wave adopted (`rd4-cd-mal-syntax-390.png`, `rd4-cd-mal-diag-390.png`).
4. **Note only, no action: diagrams are ~10 % taller than r1** (548 vs 504 px worst case at 390,
   569 at 320) because everything is 1-up. That is the right trade — nothing wraps at 390 any more —
   and every diagram still fits one phone screen.

**Why 8.8**: this is the strongest area in the wave. The one requirement that demonstrably failed in
r1 (Copy on tall blocks) is fixed on the worst page and verified by real touch; the diagram that
misstated its own architecture now reads correctly and survives 320; and the highlighter is real,
contrast-safe, and byte-identical to the source per `INTEGRITY: PASS`. It is not a 9.5 because of a
mid-word break at 320 (1) and a veil that costs readability at rest (2).

---

```
Area: listing-pages   Round: 2   Critic: reader   Score: 8.7/10   Verdict: PASS
```

**Screenshots looked at**

- `harness/out/peek/rd4-lp-ip-390-open.png` — `interview-prep.html`, row 2 open by **keyboard**:
  the accent focus ring wraps the whole row, `×` in the left gutter beside the first word,
  "Click to hide answer", the S3 answer below.
- `harness/out/peek/rd4-lp-tools-calc-390.png` — the salary calculator driven to the end by Tab +
  Enter: focus ring on "Calculate Salary" and the result panel **fully on screen** beneath it.
- `harness/out/peek/rd4-lp-tools-checkboxes-390.png` — the certification-cost checkboxes: 20 px
  boxes, labels vertically centred, rows a thumb can hit.
- `harness/out/peek/rd4-lp-tools-rows-390.png` — the four tools as ruled rows with greyscale icons
  and a quiet `↗` link each; no card soup, no four identical buttons.
- `harness/out/peek/rd4-lp-projects-390-0.png` — `projects.html`: the three level-jump chips sit on
  the first screen directly under the page header, above "Beginner Projects".
- `harness/out/peek/rd4-lp-index-cert-390.png` — cert cards: hairline only (no coloured bars),
  small-caps eyebrow, em-dash spec list, underlined "Learn More".
- `harness/out/peek/rd4-lp-index-roadmap-390.png` — roadmap at 390: rail + small numeral disc in a
  narrow gutter, card text running ~35–40 characters per line.
- `harness/out/peek/rd4-lp-res-390-400.png` — `resources.html` book cards on the 120 × 160 mount;
  card 2 is still visibly *The Kubernetes Book*.

**Gate results**: console=0 axeSC=0 perf 100 (resources 99) a11y=100 bp=100 seo 100
(index/tools 92, frozen "Learn More") cls=0 LCP index 1.65 s / resources 2.18 s integrity=PASS

**Every named check passed, measured**

- **Interview rows**: **17** elements, all `BUTTON`, all `type="button"`, all
  `aria-expanded="false"` at load, all 17 named via `aria-labelledby` (row 1 resolves to *"Explain
  the difference between EC2, Lambda, and Fargate…"*), all 17 answers `display: none` at load. Rows
  are 342 × **158.1** px (shortest 126.7). Driven from scrollY 600: **Enter → expanded=true,
  answer display:block, scrollY 600**; **Space → false / none, scrollY 600**. Reached by real Tab in
  5 stops with a `rgb(194,65,12) solid 2px` ring at 2 px offset.
- **tools.html calculator by keyboard**: 9 Tab stops from a cold load to "Calculate Salary"
  (4 selects at 48.1 px each, button 292 × 47); Enter → result `display:block`, **top 505 / bottom
  734 in an 844 px viewport — fully visible with no scrolling**, reading "Estimated Annual Salary
  $162,000 / Range: $143,000 – $186,000".
- **Checkbox rows**: inputs **20 × 20** ×6, label rows **44 / 56.1 / 56.1 / 44 / 56.1 / 44** — the
  three 28 px rows from r1 are gone.
- **Cert "Learn More"**: **80.6 × 44.8** on all four cards at both 390 and 1440.
- **Roadmap cpl**: first-line characters measured by range geometry — **390: 35 / 40 / 34 / 37 / 38 /
  38** in a 302 px card (r1: 244 px, ~29); **1440: 56 / 59 / 56 / 58 / 51 / 61**, inside the 65–75
  reference band at the top end and never over it.
- **projects.html has a way in**: three `.level-jump` links, 83.5/109/88.7 × **44**, all on the
  first screen at docY 336; tapping "Advanced" jumps 4,635 px and puts "Advanced Projects" at top
  97, clear of the 56 px header. The page is 9,204 px, so that is one tap instead of five flicks.
- Tool-row links 45.8 px; no horizontal scroll on any of the five pages at 390 or 320.

**Ranked issues (worst first)**

1. **`images/books/sap-c02.jpg` is still a photograph of *The Kubernetes Book* under an alt that
   says "…Solutions Architect Professional Study Guide SAP-C02 book cover" — PAGE, HUMAN_TODO.**
   `resources.html`, 390, `rd4-lp-res-390-400.png` (card 2, `resources.html:135`). On the page that
   monetises, the cover visibly not being the book is the single biggest trust hit left in this
   area. Correctly untouched by the builder (frozen `src`/`alt`); it needs an image plus an
   approval, not a CSS pass.
2. **`resources.html` LCP 2.18 s misses the 1.8 s budget — gate item, integrator.** 390,
   `merged-r2/lighthouse/summary.json`. Perf is still 99, but on a phone the h1 is the LCP element
   and this is the slowest page on the site. Named as blocked in the r2 request; recording it
   because the area cannot formally clear the gate while it stands.
3. **Nit: four identical "Learn More" links on `index.html`** (`rd4-lp-index-cert-390.png`) — the
   `link-text` audit that keeps index and tools at SEO 92. Text frozen; needs approval A5.
4. **Nit: the three level-jump chips carry no label and read like the level badges on the cards.**
   `rd4-lp-projects-390-0.png` — outlined "Beginner" in the nav versus tinted "Beginner" on a card.
   A small-caps eyebrow (as the article chips now have) would separate them; the three words are
   already in `uiText`, so the eyebrow would be new text and needs a content approval — note only.

**Why 8.7**: all seven reader-owned r1 items are fixed and measured, `interview-prep.html` is now a
proper native-button disclosure list, tools reads as a list rather than a template, and
`projects.html` finally has a way in. What is left is one wrong photograph and one slow page, and
neither is a builder change.

---

```
Area: static-pages   Round: 2   Critic: reader   Score: 8.7/10   Verdict: PASS
```

**Screenshots looked at**

- `harness/out/peek/rd4-sp-contact-success-390.png` — the form filled, the green success box with
  its drawn tick **above** the Send Message button, both fully on screen.
- `harness/out/peek/rd4-sp-contact-edge-390.png` — the worst case: the button had been flush with
  the bottom edge, so the status shows with its second line clipped at the viewport edge.
- `harness/out/peek/rd4-sp-privacy-390.png` — "How We Use Your Information" as hairline rows led by
  a quiet em-dash; "Display relevant advertisements" no longer reads as a benefit.
- `harness/out/peek/rd4-sp-404-390.png` — the 404: paper header strip with the cloud mark, big quiet
  numeral, two-line h1, the joke as a note, one 233 × 47 CTA, all on one screen.

**Gate results**: console=0 axeSC=0 perf=100 a11y=100 bp=100 seo=100 cls=0 LCP=1.50 s (about)
integrity=PASS

**The r1 blocker is fixed, measured.** `#formStatus` is now **before** the submit button in the DOM,
`display: none` at rest, `min-height: 76 px`. With the form filled and the button in a normal
post-tap position: **status 427 → 503, button 527 → 574 in an 844 px viewport, fully visible, above
the button** — and success and error produce **byte-identical geometry**, so the button cannot move
between the two states. r1 measured the status at 868 → 944, i.e. entirely off-screen. Also
verified: labels are **14 px** ×4, inputs 47.9 / textarea 152 / submit 47 px, `.note` at 1440 is
518 px wide at 15 px = **65–70 characters** (r1: 83), privacy's 17 `.prose .feature-list` rows carry
`content: "—"` while `about.html` keeps the drawn accent tick, and the 404 fits one screen at 390
and 1440 with `noindex` intact, zero overflow and its content flush left (x=24 / x=152).

**Ranked issues (worst first)**

1. **Showing the status grows the page by 92 px, so the Send button drops out from under the reader's
   finger at the moment of the tap — PAGE + COMPONENT.** `contact.html`, 390,
   `rd4-sp-contact-success-390.png`. Measured `document.scrollHeight` 1,841 → **1,933** on both the
   success and the error state. It does not register in lab CLS (post-interaction) and the message
   is now where the reader is looking, which is the important half — but a primary button that jumps
   92 px down the instant it is pressed is a double-tap hazard on a slow connection.
   *Fixed looks like*: exactly the builder's own option 1 (§4.2) — drop `display: none`, let the
   empty `div` hold its `min-height` with no border or ground. Nothing ever moves, the gate still
   passes (the div is empty), and it costs ~76 px of blank paper above the button at rest.
2. **In the worst position the confirmation is clipped — PAGE.** 390,
   `rd4-sp-contact-edge-390.png`. With the button flush to the bottom edge before the tap, the
   status lands at 789 → 865: **55 of 76 px on screen**, tick and first line readable, second line
   cut. Structural while the slot is unreserved — closed by the same fix as (1).
3. **`404.html` still gives a lost reader exactly one door — PAGE, approval-blocked.** 390 and 1440,
   `rd4-sp-404-390.png`. `linkCount: 1` ("Return to Home Region"). The commonest 404 here is a stale
   deep link to a project guide and it still routes the reader to the home page. Correctly not taken
   this round (the r2 request forbids a second door without a content approval); ~180 B and three
   approved strings whenever the panel wants it.
4. **Nit: the privacy list marker is a 1.43:1 em-dash.** `rd4-sp-privacy-390.png` —
   `rgb(216,210,198)` on paper. Neutral was the ask and neutral is right, but at this value the
   marker is doing no work; the hairline row rules carry the whole list. `--line-2`-to-`--ink-3`
   would still read as neutral and would actually be visible.
5. **Nit: field validation is still native-browser-only** (all four fields `required`, no
   `novalidate`), so an empty submit produces a browser bubble while the well-drawn `.form-status`
   sits unused. Unchanged from r1, consistent with the frozen inline script.

**Why 8.7**: the one thing a reader *does* on these pages now visibly confirms itself, the prose
measure is inside the reference band at 1440, privacy reads as a disclosure rather than a feature
list, and the 404 matches the site's geometry. It stops short of 9 because the confirmation still
arrives by pushing the button it was meant to reassure you about.

---

## For the integrator

1. **Two gate items block a formal Wave-2 pass regardless of these four scores**: `resources.html`
   **LCP 2.18 s** (> 1.8 s) and the wave-wide **`WEIGHT: FAIL (19 pages)`** (styles.css 42,682 raw /
   9,418 gzip vs 35,518 / 6,078). Both are recorded as integrator-owned in the r2 request; neither
   is attributable to a Wave-2 builder.
2. **`INTEGRITY: PASS`** (21 pages identical, 0 approvals applied) — including after the new
   build-time highlighter, which is the proof that 1,132 inserted spans moved no code text.
3. Cheapest remaining reader wins, in order: `aria-label` on the six step-number anchors
   (article 1, ~25 B/page); reserve the empty `#formStatus` slot (static 1, ~20 B); let paired
   diagram nodes stack below ~360 px (code 1); a sticky chip band below 64em (article 3).
4. Still human-blocked and still real: `images/books/sap-c02.jpg`, the four "Learn More" strings
   (index/tools SEO 92), and a second door on `404.html`.

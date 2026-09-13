# FINAL WHOLE-SITE GATE · READER critic

```
Area: whole site   Round: final   Critic: reader   Score: 8.6/10   Verdict: PASS
```

Persona: cloud engineer on a 390 × 844 phone, mid-task, wants one answer fast. Tree frozen at
`f22dfdf` (`git status` clean at the start and the end of this pass). Everything below was measured
by me against `http://127.0.0.1:4173` on that tree. I did **not** re-run `snap`/`lh`; the shared
numbers come from `harness/out/polish-r1/summary.json` (09:45:37Z) and its `lighthouse/summary.json`
(09:46:39Z), and I ran `node harness/integrity.js compare --base baseline-2026-09-13` once.

Instrumentation I wrote and ran (git-ignored, under `harness/out/`): `fin-rd-t1.js`, `fin-rd-t2.js`,
`fin-rd-t3.js`, `fin-rd-verify.js`, `fin-rd-verify2.js`, `fin-rd-veil.js`, `fin-rd-veil2.js`,
`fin-rd-extra.js`, `fin-rd-colors.js`, `fin-rd-grouplabel.js`, `fin-rd-contact-shots.js`,
`fin-rd-chiplabel.js`, `fin-rd-chiplabel2.js`, plus seven method probes `fin-rd-diag*.js`.

---

## Method note the next person needs (a harness defect, not a site defect)

**CDP `Input.synthesizeScrollGesture` scrolls nothing in this build.** `fin-rd-diag.js`: six
`gestureSourceType: 'touch'` gestures of −500 px on an *unlocked* `projects.html` leave
`scrollY` at **0/0/0/0/0/0**, while `window.scrollTo(0, 9999)` immediately reaches 8342.
`page.mouse.wheel` is also inert under `isMobile`. That API is what wave1-r2 used to "prove" the
drawer scroll lock with synthesized finger drags — **that proof is void**; it could not have moved
the page either way. I re-proved the lock below with `Input.dispatchTouchEvent` drags, which do
scroll (≈495 px per 500 px of travel, `fin-rd-diag2.js`).

Second artifact: after a drag gesture, Chromium's touch emulation suppresses the synthetic click on
the *next* `touchscreen.tap` — `fin-rd-diag6.js` shows `touchend: 1, click: 0` and no navigation,
while the identical tap after a programmatic scroll navigates. So in the timed runs a "tap" is an
`elementFromPoint` hit test at the control's centre (proving a thumb landing there hits the control)
followed by a click at that point; every decisive tap was **also** verified by a real touch tap on a
freshly loaded page. Gesture accounting: a **flick** is one real finger drag of ≤ 500 px with no
momentum added, so a real momentum flick goes further and my counts are an **upper bound**.

---

## Screenshots looked at (every one opened with Read)

- `harness/out/peek/fin-rd-t1-01-index-arrive.png` — home at 390 at rest: 56 px navy header, hero,
  the hero stats as three full-width 1/1/1 hairline rows, one orange CTA at y 562. Exactly **one**
  link is reachable on this screen: "Start Your Journey → #roadmap".
- `harness/out/peek/fin-rd-t1-05-card-in-view.png` — projects.html after 5 gestures: the last
  project card's 134 × 47 "View Guide", then the accent-tick tips list.
- `harness/out/peek/fin-rd-t1-07-chiprow-swiped.png` — the guide's chip row after one 200 px swipe:
  "Step-by-Step Instructions" now fully in view, the left-hand chip hard-cut at the container edge
  with no fade.
- `harness/out/peek/fin-rd-t1-09-step5.png` — step 5 "Set Up IAM Identity Center" parked at
  viewportY 155: numeral badge, 19 px heading, five bullets on the full 342 px measure, **no code
  block and no link to one**.
- `harness/out/peek/fin-rd-t1-10-scp-block.png` — `DENY-REGIONS-SCP.JSON` at 390, sticky header
  pinned with `JSON` chip and `Copy`, keys blue / strings green, right veil on.
- `harness/out/peek/fin-rd-t1-11-copied.png` — the same after one tap: the button reads **Copied**
  in green.
- `harness/out/peek/fin-rd-t2-07-diagram-top.png` — the Serverless REST API diagram, whole thing in
  one screen at 390, five 1-up nodes, greyscale icons, arrows, caption.
- `harness/out/peek/fin-rd-t3-a2-third-open.png` — interview-prep third question opened **by
  keyboard**: the accent ring wraps the whole row, `×` in the gutter, "Click to hide answer", the
  RDS/Aurora/DynamoDB answer below.
- `harness/out/peek/fin-rd-t3-b2-result.png` — the salary calculator driven to the end by Tab +
  ArrowDown + Enter: focus ring on "Calculate Salary", the result panel below it reading
  `$290,000 / Range: $255,000 – $334,000`, only the disclaimer's second line under the fold.
- `harness/out/peek/fin-rd-drawer-tab-cycle-390.png` — drawer open, scrim over the dimmed page,
  focus ring on "Roadmap", × in the 44 px toggle.
- `harness/out/peek/fin-rd-crumb-focus-390.png` — the breadcrumb "Home" ring **entirely** below the
  navy bar; the chip row's third chip clipped at the container edge.
- `harness/out/peek/fin-rd-contact-success-scrolled-390.png` — the green success box with its drawn
  tick **above** an unmoved Send Message button.
- `harness/out/peek/fin-rd-diagram-320-multi-region-active-active.png` — at 320 the region pair
  stacks 1-up: Region A → ↔ Replication → Region B, "DynamoDB" intact on one line.
- `harness/out/peek/fin-rd-veil-none-390.png` — `HPA.YAML`, the one block at 390 that does not
  overflow: **no veil on either edge**.
- `harness/out/peek/fin-rd-chiprow-swiped-390.png` — close crop of the swiped chip row.

---

## Gate results

```
console=0  pageErrors=0  failedRequests=0   axeSC=0  axeAll=0   (60 public rows, polish-r1)
hOverflow  0/60 in polish-r1; and 0/20 in my own sweep of all 20 public pages scrolled to the
           bottom at 390 AND at 320
cls        0 on every public row (maxCLS 0); lab LCP max 132 ms
lighthouse index 100/100/100/92 LCP 1.65 · projects 100/100/100/100 1.65 · tools 100/100/100/92 1.65
           interview-prep 100/100/100/100 1.53 · about 100/100/100/100 1.50
           project-multi-account-landing-zone 100/100/100/100 1.65
           resources 99/100/100/100 **LCP 2.10 s** (the recorded D2 exception, > 1.8 s)
integrity  INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals) — run
           by me on the frozen tree
admin.html keeps its known local /.auth/me 404 (1 per width) and 0.0187 CLS@768 — auth-gated,
           excluded, same as baseline
console errors across all three of my timed tasks and the whole verification battery: 0
```

---

## Task 1 — index.html → "Set Up IAM Identity Center" → copy its SCP JSON

**Result: completed. 6 taps + 12 flicks/swipes = 18 gestures. Clipboard = 746 chars, starts with
`{`, `JSON.parse` succeeds, contains no `<span>` markup.** (`fin-rd-t1.js`, screenshots
`fin-rd-t1-01/05/07/09/10/11`.)

| leg | gestures | measured |
|---|---|---|
| index.html → projects.html | tap 1 hamburger (44 × 44), tap 2 "Projects" (342 × 52.8) | the drawer is the **only** route; the first screen of index.html contains exactly one link and it is an in-page anchor |
| find the card | tap 3 "Advanced" chip (88.7 × 44) → scrollY 4,691; then **4 flicks + 1 part-flick = 5** | the jump lands at the head of the Advanced section; the landing-zone card is the **11th and last** card at docY 6,601, still 2,300 px below |
| open the guide | tap 4 "View Guide" (134.2 × 47), `elementFromPoint` = `A.project-link` | lands at scrollY 0 of a 10,918 px page |
| reach the step | 1 horizontal swipe (chip 4 starts at x = 375, list ends at 366) + tap 5 the chip → h2 at viewportY 72; then **3 flicks** | step 5 is 1,511 px past where the chip drops you |
| copy the JSON | **3 flicks** + tap 6 Copy (53.9 × 44 on the sticky `.code-header`) | label → "Copied", `aria-label` → "Code copied to clipboard" |

Real-touch control: on a fresh page with no preceding drag, a genuine `touchscreen.tap` on the same
Copy button also puts 746 chars starting with `{` on the clipboard.

**What the stopwatch exposes.** Step 5 contains **no code block and no link to one** — its only
anchor is its own `#step-5` self-link. The JSON that implements it lives in a separate "Code
Examples" section, and neither `deny-regions-scp.json` nor `admin-permission-set.json` is named from
the step. I reached the SCP block in 3 more flicks only because it happens to sit 1,262 px below
step 5; the reader has no way to know that, and the on-page nav is 4,000 px behind them by then.

## Task 2 — projects.html → Serverless REST API → read the diagram without zoom

**Result: completed in 3 taps + 4 flicks = 7 gestures, and the diagram is readable at rest.**
(`fin-rd-t2.js`, screenshot `fin-rd-t2-07-diagram-top.png`.)

- **Diagram height 465 px** (55 % of the viewport), width 342, `scrollWidth − clientWidth = 0`,
  page overflow 0. Parked from its own top it runs **143 → 609** — the whole thing, caption
  included, in one screen with no second screen and no pinch.
- **Smallest text: 13 px** (`.arch-component-detail` "Web/Mobile", "REST API"…) at **7.07:1**;
  `.arch-note` 13 px at 7.98:1; node names 14 px / 650 at **13.35:1**; arrows 18 px at 7.7:1.
  Nothing in the diagram is under 13 px and nothing is under 7:1.
- **Zero wrapping**: all five node names on one line (`Client App`, `Cognito`, `API Gateway`,
  `Lambda`, `DynamoDB`), and the same holds at 320.
- Route in: the "Intermediate" level-jump chip (109 × 44) then 4 flicks to card 6 of 11, then the
  "Architecture" chip — which is the **third** chip and is clipped at the container edge at rest
  (x 269 → 367 against a list right edge of 366), so it is tappable but its right border is gone.

## Task 3 — keyboard only: third interview question, then the salary calculator

**Result: both completed with the keyboard alone.** (`fin-rd-t3.js`, screenshots
`fin-rd-t3-a2-third-open.png`, `fin-rd-t3-b2-result.png`.)

*interview-prep.html* — the third question is Tab stop **7** (skip link → brand → Menu → breadcrumb
"Home" → q1 → q2 → q3), ring `solid 2px rgb(194,65,12)` at 2 px offset around the whole 342 × 156.1
row. **Enter** → `aria-expanded="true"`, the answer paints at 537 → 924, focus stays on the button
and **scrollY does not move** (538 → 538). Enter again closes; **Space** opens. 17 buttons, all
native `<button type="button">`, all `aria-expanded`.

*tools.html* — 9 Tab stops from a cold load to "Calculate Salary" (four 292 × 48.1 selects, each
driven by ArrowDown; button 292 × 47). **Enter** → the result paints at **678 → 907** with
`scrollY` unchanged (443 → 443). The headline *"ESTIMATED ANNUAL SALARY $290,000"* and
*"Range: $255,000 – $334,000"* are **both fully on screen**; only the second line of the `*Estimates
based on…` disclaimer is below the fold.

---

## Re-verification of the polish-r1 claims

| claim | verdict | measured |
|---|---|---|
| Drawer focus trap | **HOLDS** | Tab × 10 from the toggle: Roadmap, Certifications, Interview Prep, Projects, Resources, Tools, **Menu**, Roadmap, Certifications, Interview Prep — **10/10 inside `.site-header`, 10/10 in the viewport**. Shift+Tab × 9 runs the cycle backwards (Certifications → Roadmap → Menu → Tools → …). Escape from the toggle and Escape from three levels inside the panel both close it and return focus to `.nav-toggle`. |
| Drawer scroll lock | **HOLDS (re-proved properly)** | a real 400 px `dispatchTouchEvent` finger drag with the panel open leaves `scrollY` at 0. |
| Breadcrumb 44 px + top edge | **HOLDS** | projects / about / contact / project page at 390: every crumb **≥ 44 × 45.4**, box top **57.1** vs a header bottom of **56.0**, `elementFromPoint` **45/45 = 100 %** over a 5 × 9 grid, **5/5** on the top row and **5/5** on the literal `top + 1 px` row. |
| Contact status never moves the button | **HOLDS for every string contact.html sets** | button docTop **930 → 930 → 930 → 930** and `document.scrollHeight` **1891** across rest / "Thank you! Your message has been sent successfully." / "Something went wrong. Please try again." / "Failed to send message. Please try again later."; `#formStatus` keeps `role="status"` and `min-height: 76px`. See issue 4 for the one string that does move it. |
| Step anchors have aria-labels | **HOLDS** | **11/11** project pages × 6 anchors = 66 links, every one `aria-label="Step N"`, `href="#step-N"`, hit box **48 × 48**. |
| Node names do not break mid-word at 320 | **HOLDS** | multi-region at 320: 7 node names, **0** single-word names on more than one line; the pair stacks 1-up (Region A → Replication → Region B), diagram 532 px, `scrollWidth − clientWidth = 0`, page overflow 0. Same at landing-zone (6 names, 569 px) and serverless-rest-api (5 names, 465 px). |
| No horizontal overflow at 320/390, 20 public pages | **HOLDS** | each page loaded, ad placeholders painted, scrolled to the bottom, then `documentElement`/`body` `scrollWidth − clientWidth` read: **0 of 20 at 320, 0 of 20 at 390**. |
| Code veil absent when a block does not overflow | **HOLDS** | judged on rendered pixels (the veil is a `scroll`-attached gradient masked by a `local` patch, so computed styles cannot answer it). 43 blocks per width. **@390: 6 blocks with zero overflow, 0 of them show a veil** (`deploy.sh`, `rds.yaml`, `buildspec.yml`, `appspec.yml`, `after_install.sh`, `hpa.yaml` — flat 0-delta profile across the whole right 40 px). **@320: 1 such block, no veil.** Blocks that *do* overflow show it: 37/37 at 390 and 42/42 at 320 once the tip-clipping in issue 6 is accounted for. |

Also re-checked and good: the FAQ works by keyboard (6 native buttons, `aria-controls`,
`role="region"`, Enter opens with `scrollY` unchanged); the sticky header is still **56 px = 6.6 %**
of the viewport; code text is 14 px / 21.7 px; `.arch-group-label` is **7.34:1**, verified from the
rendered pixel histogram, not from `getComputedStyle` (a naïve ancestor walk reports 2.07:1 because
`.arch-group` is `rgba(255,255,255,.03)` — I flagged it, then disproved it).

---

## Ranked issues (worst first)

### 1. On pages up to 12.9 screens long the on-page nav is one-shot: after the first screen there is no map and no way back — COMPONENT
- **Page/width**: all 11 project pages at 390 (worst: `project-multi-account-landing-zone.html`,
  10,918 px = **12.9 screens**). Screenshots `fin-rd-t1-09-step5.png` (nothing but body copy in
  frame), `fin-rd-t1-10-scp-block.png`.
- **What is wrong**: `.guide-aside` is `position: static` below 64em and sits at docY 423, so it is
  gone from screen 2 onward. At scrollY 6,000 (screen 8 of 13) the only sticky thing in the viewport
  is a `.code-header`; there is no back-to-top (the one `[href="#main"]` match is the skip link).
  In task 1 this cost me **12 of my 18 gestures** — 3 blind flicks to step 5 and 3 more to the code
  — and it is why the last leg of the journey has no navigational help at all.
- **What fixed looks like**: make the 44 px chip band sticky under the 56 px header below 64em
  (header + band = 100 px = 11.8 % of the viewport, still inside budget), or a back-to-top control
  once `scrollY > 2` viewports. Unchanged from wave2-r2 reader article #3; it is the single largest
  remaining reader cost on the site.

### 2. A step and the code that implements it are not connected in either direction — COMPONENT
- **Page/width**: all 11 project pages, every width. Screenshots `fin-rd-t1-09-step5.png` (step 5)
  and `fin-rd-t1-10-scp-block.png` (the JSON, in a different section).
- **What is wrong**: measured on the landing-zone page, `#step-5` "Set Up IAM Identity Center"
  contains 5 bullets, **0 code blocks**, and exactly one anchor — its own `#step-5` self-link. The
  five code blocks live under a separate "Code Examples" h2 at docY 4,578–8,301 under headings
  ("Service Control Policy – Deny Region", "IAM Identity Center Permission Set") that never name the
  step they belong to. The reader who has just read step 5 has to guess that
  `admin-permission-set.json` is theirs, and scroll blind to find it.
- **What fixed looks like**: one link per step to its block (`<a href="#code-admin-permission-set">`
  ≈ 60 B/step via `apply-article.js`), or move each block under the step it implements. Attribute
  and anchor-only changes are gate-safe; moving blocks is not (content order), so the link is the
  cheap half.

### 3. `projects.html` is 11 one-column cards and the level-jump chip only reaches the section head — PAGE
- **Page/width**: `projects.html` at 390 (9,186 px). Screenshot `fin-rd-t1-05-card-in-view.png`.
- **What is wrong**: the "Advanced" chip jumps to scrollY 4,691, but the card I wanted is the 11th
  and last at docY 6,601 — **5 more gestures**, one-third of the whole journey, spent scrolling past
  two cards to reach the third. The three chips are the page's only index and they resolve to
  sections, not to projects.
- **What fixed looks like**: since the three level sections hold 4/4/3 cards, a second line of
  project-name chips under the level row would resolve the whole page in one tap (new text →
  content approval), or collapse the card to a ruled row at < 48em so eleven cards fit in ~4 screens
  instead of 9.

### 4. The one contact-form string the page does not control can still move the Send button — PAGE
- **Page/width**: `contact.html` at 390. Screenshot `fin-rd-contact-success-scrolled-390.png`
  (the good case: status 210, button 310, identical at rest, success and error).
- **What is wrong**: the reserved slot is `min-height: 76px` = 3 lines. All four strings
  `contact.html` hard-codes fit it and move the button **0 px** — the polish claim is true. But
  `formStatus.textContent = data.error || …` takes an **unbounded string from the API**. A
  5-line server error ("Your message could not be delivered because the recipient mailbox is
  temporarily unavailable.") measures 125 px and pushes the button **+49 px** with
  `scrollHeight` 1891 → 1940, i.e. exactly the double-tap hazard the reservation was meant to close,
  on the one path nobody tested.
- **What fixed looks like**: clamp the rendered error to the slot — either drop `data.error` in
  favour of the fixed string, or `#formStatus { max-height: 4.75rem; overflow: hidden }` (~25 B).
  CSS-only, gate-safe.

### 5. Two disclosure widgets are wired for the eye but not for the API — COMPONENT
- **Page/width**: `interview-prep.html` (17 buttons) and `tools.html` (the result panel), 390.
  Screenshots `fin-rd-t3-a2-third-open.png`, `fin-rd-t3-b2-result.png`.
- **What is wrong**: (a) **0 of 17** `.question-toggle` buttons carry `aria-controls` and **0 of 17**
  answer divs carry `role`/`id` — `aria-expanded` flips but nothing says *what* expanded, so a
  screen-reader user gets "collapsed/expanded" with no region to move to. index.html's FAQ does this
  correctly (`aria-controls` on 6/6, `role="region"` on the panels), so the site contradicts itself.
  (b) `#salaryResult` has `role=null`, `aria-live=null`, `tabindex=null`, and focus stays on the
  button: pressing Enter produces **no announcement at all**, and the next Tab stop is a checkbox
  1,234 px away. axe cannot see either of these, which is why the count is still 0.
- **What fixed looks like**: `aria-controls` + an `id`/`role="region"` on the answers (attributes,
  `apply-*`-safe, ~40 B/question), and `role="status"` on `#salaryResult` (~20 B) so the number is
  read out the way the contact form's status already is.

### 6. Nit — a block that overflows by less than the 32 px veil shows a fade with its tip cut off
- `project-serverless-contact-form.html` / `lambda-ses-policy.json` at 390, overflow **23 px**.
  Right-edge delta profile across the outer 40 px: `… 94 99 103 109 114 | 0 0 0 0 0 0 0 0 0` — the
  fade ramps correctly and then stops dead 9 px short of the edge, because the `local` mask patch
  has scrolled into view. Same shape on `infrastructure-as-code` / Terminal Commands (30 px over).
  Cosmetic; the affordance still reads.

### 7. Nit — `.code-lang` is 11 px, the only type on the public site below 13 px
  7.79:1, on all 11 project pages (`fin-rd-t1-10-scp-block.png`, the `JSON` chip). Unchanged from
  wave2-r2 reader code #3. The only other sub-13 px candidate, `.arch-group-label`, is 12 px at
  **7.34:1** (verified from pixels).

### 8. Nit — the chip row still has no left fade
  `fin-rd-chiprow-swiped-390.png`: after a swipe the left-hand chip is hard-cut at the container
  edge with no gradient, while the code blocks now fade on both edges. The right-hand cue is a
  missing border plus a clipped word. Measured: the `ON THIS PAGE` label correctly stays at x = 24
  while the list scrolls (`olScrollLeft` 0 → 191), so the label is not the problem — the edges are.

### 9. Nit — `index.html`'s first screen offers one link, and it is an in-page anchor
  `fin-rd-t1-01-index-arrive.png`. Every route into the site from the home screen is behind the
  hamburger. Defensible for a roadmap page; noting it because it is the first two gestures of every
  journey I timed.

### 10. Note, no action — `.arch-note`, `.salary-result p` and `.ps-promo-content p` still carry `max-width: none`
  At 1440 `.arch-note`'s **box** is 814 px (~125 ch) though its longest rendered line is 245 px, and
  `.ps-promo-content p` is 640 px / 75 ch. Nothing renders over the band today. This is wave1-r2
  reader #3 unchanged: a latent measure risk with no gate to catch it, not a defect a reader can
  currently see.

---

## Why 8.6, and why it is a pass

All three timed tasks finished, on a phone, with no zoom and no mouse. The clipboard check is the
strongest single result: one tap on a 53.9 × 44 button mounted on a sticky header inside an 817 px
code block put **746 characters of valid, markup-free JSON starting with `{`** on the clipboard, and
it works under a real finger tap as well as a synthetic one. The diagram task is close to ideal —
465 px, one screen, nothing under 13 px, nothing under 7:1, nothing wrapped, at 390 **and** at 320.
The keyboard task works end to end on two different widget families with a visible 2 px ring and,
critically, **zero page movement** at the moment of activation in both.

Every item on my remaining list from wave 1 and wave 2 is now measurably fixed and I verified each
with my own instrumentation rather than the builder's: the drawer holds focus for ten stops in both
directions and restores it on Escape; the breadcrumb is 100 % hittable including its literal top
pixel row; 66 step anchors are labelled; "DynamoDB" survives 320; 20 of 20 pages have zero
horizontal overflow at 320 *and* 390; the veil rule is exactly right on 43 blocks per width; and the
contact button does not move for any string the page itself sets. CLS is 0, axe is 0, console is 0,
and `INTEGRITY: PASS` on the frozen tree.

It is not a 9+ because of two things a reader feels on every long page and one a screen-reader user
feels on two of them: the on-page nav vanishes after the first screen of a 13-screen document and
nothing replaces it (issue 1 — 12 of my 18 gestures in task 1 were blind scrolling), a step and the
code that implements it are never linked in either direction (issue 2), and the two busiest
interactive widgets announce nothing (issue 5). None of those is broken; all of them are the
difference between "I found it" and "it helped me find it". 8.6.

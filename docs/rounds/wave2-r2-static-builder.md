# static-pages builder — Wave 2, round 2

Date: 2026-09-13 · Branch: `facelift` · Area: **static-pages**
Label for all harness output: `w2r2s` · Integrity base: `baseline-2026-09-13`
Files committed by name: `styles.css` (the `[static-pages]` section only), `contact.html`,
`404.html`, this report. Nothing else was edited.

Round-1 verdicts this round answers: creative director 8.2 FAIL · reader 8.3 FAIL ·
monetization & SEO 8.7 PASS. Six items in `docs/rounds/wave2-r2-request.md` → all six done.

---

## 1. The six items

| # | Item | Done | How | Screenshot |
|---|------|------|-----|------------|
| 1 | Check marks as privacy list markers (CD #1, reader #5) | ✅ | `.prose-compact .feature-list li::before` overrides the drawn accent tick with the **grey em-dash already used by `.cert-card li::before`** (`content: "\2014"`, `color: var(--line-2)`, borders/transform reset, `padding-left` 1.7em → 1.4em). About keeps the tick; privacy carries the neutral marker on all 32 `li`. | `w2r2s-privacy@390+900.png`, `w2r2s-privacy@1440+600.png`, `w2r2s-privacy@1440+0.png`, `w2r2s-privacy@390+0.png` vs `w2r2s-about@390+700.png` / `w2r2s-about@1440+0.png` (tick intact) |
| 2 | Contact status above the submit button (reader #1) — PAGE + COMPONENT | ✅ | `contact.html`: the `<div class="form-status" id="formStatus" role="status">` element moved **one line up**, before `<button type="submit">`. Element, id, class, `role` unchanged; no other markup, no script touched. CSS: `min-height: 4.75rem` reserves a two-line slot so success and error occupy exactly the same box, and `margin: 0 0 var(--sp-4)` replaces the old `margin-top` now that it sits above the button. `display: none` at baseline is unchanged — the slot only exists once a state class is present. | `w2r2s-contact-success@390.png`, `w2r2s-contact-error@390.png` (and the worst-case pair `w2r2s-contact-{success,error}-edge@390.png`) |
| 3 | `.note` measure (reader #2) | ✅ | `max-width: 64ch` on `.prose > .note` — an em-based cap on its own 15 px type, so it shrinks with the note rather than with the column. No media query needed: at 390 the column is already narrower than 64 ch. **59.8 cpl at 1440** (was 83). | `w2r2s-about@1440+0.png` (column), measured by script |
| 4 | contact.html at 1440 (CD #3) | ✅ | Verified rather than rebuilt, as the request directs: the 40 rem card is left-aligned on the prose edge, **`.contact-form`.left = `.page-header h1`.left = `.hero-subtitle`.left = 152.00 px at 1440**, card width 640 px. Card padding goes `--sp-5` → `--sp-6` at ≥ 48em so the desktop card is generous rather than merely wide. No aside was added — see §4.1. | `w2r2s-contact@1440+0.png`, `w2r2s-contact@390+0.png`, `w2r2s-contact@390+500.png` |
| 5 | 404.html (CD #2, reader #3) | ✅ | Rebuilt around the shell's geometry while staying self-contained: a **paper header strip** (`--paper-2`, 1 px `--line` bottom rule, 56/64 px tall — the shell's own band heights) carrying the cloud mark at the shell's 24 px in `--aws-orange`, and the page block moved off centre onto **the site's container gutter** (`max-width: 1200px` + 1.5/2 rem padding), so the numeral, h1, copy and CTA all flush left at **x = 152 at 1440**, exactly like every other page. The dead space above the cloud is gone. Copy, link and `noindex` untouched; no `styles.css` request. | `w2r2s-404@390+0.png`, `w2r2s-404@1440+0.png` |
| 6 | Nit: labels 13 → 14 px | ✅ | `.contact-form label { font-size: .875rem }` (scoped to the contact card so the calculator's `.form-group` labels keep the design-system size). Measured 14 px on all four labels. | `w2r2s-contact@390+0.png` |

### The cloud mark on 404: glyph, not the SVG — deliberate

The brief allowed reusing `apply-shell.js`'s `MARK` SVG inline. I did **not**, because the page's
existing cloud is the character `&#9729;` and that character is part of the gated page text —
`baseline-2026-09-13` records 404.html's text as `"☁ 404 This resource has been terminated …"`.
Replacing it with an `aria-hidden` SVG would delete `☁` from the `text` field and fail integrity;
keeping both would print two clouds. So the existing glyph **is** the mark: moved into the strip,
sized to the shell's 24 px, coloured `--aws-orange`. No text was added, removed or reordered.

---

## 2. Numbers (all fresh, after the last edit)

### Scripted checks — `harness/out/w2r2s-measure.js`, `harness/out/w2r2s-status.js`

```
.note @1440   about.html   4 notes, each 484 px / 15 px / 59.8 cpl      budget <= 70   PASS
.note @1440   privacy.html 1 note,        484 px / 15 px / 59.8 cpl      budget <= 70   PASS
contact @1440 h1.left 152.00  subtitle.left 152.00  .contact-form.left 152.00 (640 px)  EQUAL
about   @1440 h1.left 152.00  .prose.left 152.00                                        EQUAL
contact labels  14px / 14px / 14px / 14px                                budget >= 14   PASS
#formStatus     before the button in DOM = true      display at baseline = none
console/page errors across all probe runs: 0
```

### `.form-status` at 390 (class + text set by script, never submitted)

| Scroll position | State | status box | button | status fully visible | above button |
|---|---|---|---|---|---|
| button 110 px above the viewport edge (a normal post-tap view) | success | 683 → 759 (76 px) | 783 → 830 | **yes** | yes |
| same | error | **683 → 759 (76 px)** | **783 → 830** | **yes** | yes |
| button flush with the viewport bottom edge (worst case) | success | 789 → 865 (76 px) | 889 → 936 | no (55 of 76 px on screen: icon + both lines, second line clipped) | yes |
| same | error | 789 → 865 (76 px) | 889 → 936 | no (same) | yes |

Success and error produce **byte-identical geometry** — that is what the `min-height` buys: the
button cannot move between the two states. Round 1 measured the status at top 868 / bottom 944 on a
844 px viewport, i.e. **entirely off-screen**; it is now inside the viewport in every position
tested, and fully visible in the normal one. See §4.2 for the residual worst case.

### Playwright / axe — `harness/out/w2r2s/` (4 pages × 390/768/1440)

| Check | Result | Budget |
|-------|--------|--------|
| Console errors / page errors | **0 / 0** on all 12 runs | 0 |
| Failed requests | **0** | — |
| axe serious + critical | **0** (axe all: 0) | 0 |
| Lab CLS | **0** at every width on all four pages | ≤ 0.05 |
| Horizontal overflow | none at 390 / 768 / 1440 | none |
| LCP (lab, snap) | 36–76 ms | — |

### Lighthouse mobile — `harness/out/w2r2s/lighthouse/`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|------|------|------|----|-----|-----|-----|-----|
| contact.html | **100** | **100** | **100** | **100** | 1.38 s | 0 | 0 ms |

`bf-cache` is the only binary failure, caused by the local server's `Cache-Control: no-store`;
INVENTORY says to ignore it locally.

### Integrity

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

`docs/APPROVALS.json` untouched and still empty. No text, heading, link, image, metadata or
JSON-LD changed on any of the four pages. Moving `#formStatus` one line up is invisible to the
gate (the div is empty; its text is script-generated) and `404.html`'s text field is unchanged
including the `☁`.

### Weight — recorded, not clean, and only one line of it is mine

```
styles.css: raw 40183 (ref 35518), gzip 8594 (ref 6078)
OVER about.html    gzip 13093 vs 11016 (+2077)   raw 53432 vs 51381
OVER contact.html  gzip 12379 vs  9915 (+2464)   raw 51476 vs 49375
OVER privacy.html  gzip 13384 vs 11314 (+2070)   raw 54688 vs 52988
OVER 404.html      gzip  1331 vs  1083  (+248)   raw  2899 vs  2920
WEIGHT: FAIL (19 pages over their gzip baseline)
```

- about / contact / privacy are over **entirely on the shared `styles.css`**, which four Wave-2
  builders are writing concurrently; my own section is **3,158 B raw** (budget ≤ 3.2 KB), up
  **+497 B** from round 1's 2,661 B. This round's net addition to the sheet is those 497 B.
- **404.html is the one page whose bytes are 100 % mine, and it is now under its raw baseline:
  2,899 B vs 2,920 B** (and under the 3 KB brief budget), *with* the new header strip. Its gzip is
  +248 B because the strip and the container geometry are new rules that do not compress against
  anything else on the page. I trimmed it three times to land there (comment block to one line,
  dropped `tabular-nums` and a redundant `letter-spacing`).
- The wave-wide `WEIGHT: FAIL` is unchanged from round 1 and still needs the integrator decision
  recorded there (compressed-transfer budget, or a committed minified sheet).

---

## 3. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|------|-----------|
| `w2r2s-privacy@390+0.png` | Title band, compact h2/h3 rhythm, and the first two collection rows carrying the **grey em-dash**, not the rust tick. |
| `w2r2s-privacy@390+900.png` | "How We Use Your Information": four hairline rows, each led by a quiet dash. "Display relevant advertisements" no longer reads as a benefit. |
| `w2r2s-privacy@1440+0.png` | Same at desktop: 152 px left edge, hairline rows to the measure, dashes throughout. The CD's worst screen is fixed. |
| `w2r2s-privacy@1440+600.png` | Both list blocks and the "Third-Party Services" heading in one frame — twelve sections still scan as rhythm. |
| `w2r2s-about@390+700.png` | About's "What We Offer" **still has the rust tick** and the term on its own line — the neutralisation did not leak. |
| `w2r2s-about@1440+0.png` | 68 ch column at 152, ruled h2s, unruled first heading, tick list. |
| `w2r2s-contact@390+0.png` | Form card, four labelled fields at 14 px, ≥ 44 px targets, the orange submit starting at the fold. |
| `w2r2s-contact@390+500.png` | Bottom of the card: nothing between the textarea and the button at baseline — the status slot is not reserved when empty, so no mystery gap. |
| `w2r2s-contact@1440+0.png` | 40 rem card flush with the h1 at 152, roomier `--sp-6` padding, one orange action. |
| `w2r2s-contact-success@390.png` | Green tint, drawn tick, **above** the button, both fully on screen. |
| `w2r2s-contact-error@390.png` | Red tint, drawn ×, identical box and identical button position — the two states are interchangeable. |
| `w2r2s-contact-success-edge@390.png` | The worst case: button previously flush with the viewport edge. Tick and both message lines are on screen (second line clipped by 21 px); the button has moved below the fold. |
| `w2r2s-404@390+0.png` | Paper strip with the cloud, then 404 / h1 / message / note / CTA all on the gutter, one screen, no dead band at the top. |
| `w2r2s-404@1440+0.png` | Same, **flush left at 152** like every other page instead of centred at 432. |

Drivers (both in the git-ignored `harness/out/`): `w2r2s-measure.js` (note cpl, left edges, label
size, DOM order) and `w2r2s-status.js` (the four status probes + screenshots). Neither submits the
form or touches the network; both assert 0 console errors.

---

## 4. Decisions, assumptions, and what is left

### 4.1 No companion aside on contact.html at 1440 (CD #3 is answered, not fully satisfied)

The request's item 4 is explicit — "nothing new in text — use the existing subtitle and generous
margins; the form at 40rem left-aligned with the prose edge" — so that is what I built, and the
left edges are measured equal. The CD's preferred fix (a ruled aside carrying the "not affiliated
with AWS" line, an FAQ link and the privacy link) would move copy onto a page that does not have
it, which is a content change and needs an entry in `docs/APPROVALS.json`. **If the panel wants the
aside, approve the three strings and it is ~15 lines of CSS and ~10 of markup.** Until then the
right half of contact.html at 1440 is deliberately empty paper.

### 4.2 The status is visible, but not *fully* visible in the extreme case — and that is structural

With `display: none` at baseline (which the brief requires until a state class lands), the status
box cannot occupy space before it has content, so showing it necessarily adds **92 px** (76 px box
+ 16 px margin) above the button. If the reader has the button flush with the bottom edge of a
844 px viewport, the status therefore lands at 789 → 865 and its last line is clipped by 21 px.
Two ways to close that, both needing a decision above my scope:

1. **Reserve the slot at baseline** — drop `display: none` and let the empty div hold
   `min-height: 4.75rem` with no border or background. Nothing moves, ever; CLS stays 0; no text is
   added; the gate would pass (the div is empty). The cost is ~76 px of blank paper inside the card
   above the button at rest. The brief told me to keep `display: none`, so I did.
2. `scrollIntoView` in the inline script — the script is frozen.

The message cannot be made to fit one line at 390 (50 characters at 15 px in a 294 px card column
is two lines however the padding is arranged), so no amount of box trimming fixes the extreme case.

### 4.3 404.html keeps exactly one door (reader #3 not taken)

The request says "No second door without a content approval", so the single "Return to Home Region"
link stands. Adding *Projects · Resources · Interview Prep* would add three new strings and three
new internal links — two gated fields. It costs ~180 B and fits the budget the moment someone
approves the words.

### 4.4 CD #2's other half still needs the panel

The CD asked for either a wordmark-bearing bar **or** an accepted-decision entry in
`docs/STATUS.json`. I built the bar, but the wordmark text "AWS Cloud Architect Guide" is not on
the page and I may not add it, so the strip carries the mark alone. The page now matches the site's
band height, ground and left edge; whether that closes the finding is the panel's call, and
`docs/STATUS.json` is the integrator's file.

### 4.5 Smaller calls

- **Marker choice.** I reused `.cert-card li::before`'s grey em-dash rather than inventing a sixth
  marker, which also answers the CD's cross-area "five list-marker treatments" note — privacy's
  rows now share a vocabulary with the cert cards instead of adding to the pile.
- **Label size is scoped to `.contact-form`**, not raised on `.form-group > label`, because that
  selector also dresses `tools.html`'s calculator, which belongs to listing-pages.
- **`min-height: 4.75rem`** = two 15 px lines at 1.65 plus the 12 px padding pair and the border.
  A three-line API error would still grow the box; nothing shorter than three lines can.
- **`.contact-form` is still declared twice** (`[listing-pages]` line ~429 and mine); the r1 seam
  note stands — dropping `.contact-form` from the listing-pages selector reclaims ~15 B.
- **404 duplicates ten design tokens inline**, now named in a one-line comment in the file, as the
  monetization critic asked. The strip, the numeral and the note also mirror `[layout-shell]` /
  `[static-pages]` values; they need a manual sync if those move.

### 4.6 Out of my hands

- `staticwebapp.config.json` still rewrites unknown URLs to `index.html` with HTTP 200, so this
  404 page is never served (M&S #1, `docs/HUMAN_TODO.md`). Not a gated file; not my area.
- `WEIGHT: FAIL` wave-wide (§2).

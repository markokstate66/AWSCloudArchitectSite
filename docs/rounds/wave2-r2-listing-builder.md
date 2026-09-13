# listing-pages builder — Wave 2, round 2

Date: 2026-09-13 · Branch: `facelift` · Area: **listing-pages**
Harness label: `w2r2l` · Integrity base: `baseline-2026-09-13`
Files: `styles.css` (`[listing-pages]` section only), `projects.html`, `tools.html`,
`interview-prep.html`. **`index.html` and `resources.html` were not edited at all** — everything
those two pages needed (cert cards, salary cards, roadmap, book covers) was CSS.

---

## 1. The ten request items

| # | Item | Done | How | Screenshot |
|---|------|------|-----|-----------|
| 1 | tools.html untouched template — PAGE | **yes** | `.tools-grid` is no longer a grid of cards: it is a **ruled list**. `.tool-card` → `display: grid` row (`1.5rem` icon gutter / title + one-line description / quiet link), `border-top` per row + `border-bottom` on the list, no card border, no radius, no fill. The four emoji get the same treatment code-and-diagrams used: `filter: grayscale(1); opacity: .7`, 17 px (was 28 px full colour). The four generic hairline buttons are gone: `class="project-link"` → `class="tool-link"` (markup, 4 links; **text frozen and unchanged**) = ink link, 650 weight, `↗` pseudo-glyph for "external", accent on hover, 45.8 px hit box. From 48em the link moves to a third column so each row reads title → description → action on one line. Calculator was already first and stays first. | `w2r2l-tools-1440-1850.png`, `w2r2l-tools-768-1400.png`, `w2r2l-tools-390-1400.png` |
| 2 | Roadmap prose measure | **yes** | Number gutter `2rem` → `1.5rem` (disc stays 2 rem and overhangs into the 1 rem gap, still centred on the rail at `left: 1rem`), so the card is **302 px at 390** (was 244 px of text in a 269 px card) and the text starts at x=89 (was 97). `.roadmap-content p { max-width: 48ch }`. **60ch was not enough**: measured at 60ch the real first line was 73–78 characters, because `ch` is the width of `0` and the body font's average glyph is ~19 % narrower. At 48ch the six items measure **51/56/56/58/59/61 characters on the first line** — under the 65 the round asked for, inside the 65–75 reference band. | `w2r2l-index-1440-1400.png`, `w2r2l-index-390-2400.png` |
| 3 | Cert cards | **yes** | The 3 px top rule is deleted outright — the card's own 1 px `--line` border is the hairline, so the card is eyebrow → title → description → ruled spec list → link and nothing else. (The four hues were already gone in shell r2; verified computed `1px rgb(230,226,218)` on all four.) "Learn More" measured **80.6 × 44.8** at 390 (shell r2's `.cert-link` padding — verified, not redone). Also fixed the CD's stagger nit: the spec rule now follows the description instead of being pushed down by `margin-top: auto`, and `.cert-card .cert-link` takes the slack. At 1440 all four rules are at y=3161 and all four links at y=3323 — **one baseline, measured, for both**. | `w2r2l-index-1440-2400.png`, `w2r2l-index-390-4200.png` |
| 4 | Salary "featured" card | **yes** | `.salary-card { border-top: 3px solid transparent }` and `.salary-card.featured { border-top-color: var(--aws-orange) }` both deleted. Three identical panels; computed top border on the middle card is now `1px rgb(230,226,218)`, same as its neighbours. I took CD #5's first option (drop the treatment: the three cards are a progression, not a choice) rather than "middle marked by the eyebrow" — **a salary card has no eyebrow, and inventing one is new content**. | `w2r2l-index-1440-3400.png`, `w2r2l-index-390-6500.png` |
| 5 | Book-card cover plate | **yes** | The plate is now a **fixed 7.5 × 10 rem (120 × 160 px, exactly 3:4) mount**: `--paper-2` ground, 1 px `--line` hairline, 2 px radius, `object-fit: contain`, margin `--sp-5` from the card edges, at every width. The full-width 342 px grey slab at 390 and the full-height grey column at 1440 are both gone. The `<img>` keeps its explicit `width`/`height` attributes (CLS 0 on all three widths) and the jacket's own border was dropped so the mount is the only hairline. At ≥40em the card grid is `auto minmax(0,1fr)` (was a fixed `8.5rem` column with a divider rule). | `w2r2l-res-390-400.png`, `w2r2l-res-768-400.png`, `w2r2l-res-1440-400.png` |
| 6 | Calculator checkboxes | **yes** | Scoped overrides in my section (the base rules live in `[design-system]`, which is not mine): `.calculator-container input[type="checkbox"] { width: 20px; height: 20px; margin: 0 }` and `.calculator-container .checkbox-label { min-height: 44px; align-items: center }`. Measured at 390: inputs **20 × 20** ×6, label rows **44 / 56.1 / 56.1 / 44 / 56.1 / 44** — the three 28 px rows the reader found are gone. | `w2r2l-tools-390-1400.png` |
| 7 | projects.html "no way in" at 390 | **yes** | `<nav class="level-jump" data-ui aria-label="Jump to a project level">` with three fragment links, first child of the first section container (i.e. directly under the page-header band — I stayed out of the shell's band markup), plus `id="beginner|intermediate|advanced"` on the three existing `<h2>`s. Links are 44 px tall (83.5/109/88.7 × **44**). Clicking "Intermediate" lands the h2 at y=72, clear of the sticky header (`scroll-padding-top` holds). `data-ui` + `nav` means the three words are excluded from the content snapshot and recorded in `uiText` — integrity reports them there. | `w2r2l-projects-390-0.png`, `w2r2l-projects-1440-300.png` |
| 8 | Interview rows → real `<button>`s | **yes** | See §2.1 — 17 real `<button type="button">`, answers still `display: none` on load, question text byte-identical and **outside** the button. | `w2r2l-ip-390-400.png`, `w2r2l-ip-390-open.png`, `w2r2l-ip-1440-400.png` |
| 9 | Ad room | **verified, nothing to build** | No well markup exists yet (Wave 3), so this is a measurement. Injecting a real `.ad-well`: on index at 390 a well **inside a section `.container` is [24 → 366] = 342 px**; as a direct child of `<main>` it is **[0 → 390] = 390 px, full-bleed** — M&S #2 confirmed and the fix is the AD_PLAN anchor, not CSS (I cannot edit `docs/`). At 1440 both read 970 px (shell r2's `.ad-well { max-width: min(100%, 970px) }` centres it), so the gutter problem is phone-only. On interview-prep a well placed **after `.interview-grid`** (not inside it) is **342 px at 390** with 48 px clear above. | probe output in §3 |
| 10 | Nits: `+` affordance, category rhythm | **yes** | The `+` moved from the right edge (`right: var(--sp-2)`, ~300 px from the words it controls at 390) into a 1.75 rem **left gutter beside the first word**; the row's text indents to match and the answer indents with it. Category rhythm: the 4th→5th seam measured 0 px because the page has two separate `.interview-grid` blocks — `.interview-grid + .interview-grid { margin-top: var(--sp-7) }` makes every category seam 24/24/24/**48**/24 instead of …/**0**/… | `w2r2l-ip-390-400.png` |

Blocked / other owners, unchanged by design: resources LCP (2.1 s this round), the affiliate
disclosure and `rel="sponsored"` (HUMAN_TODO), `sap-c02.jpg` (still visibly *The Kubernetes Book*),
the "Learn More" link text (HUMAN_TODO A5, index SEO 92).

---

## 2. Decisions and assumptions

### 2.1 The interview row is a real `<button>` — and the question text is still outside it

`integrity.js` strips `nav, button, [data-ui], .ad-well` before reading `innerText`, and the
question text *and* the "Click to reveal answer" hint are both in the frozen baseline text. So a
`<button>` wrapping the question is a content diff (that is why r1 used `div[role="button"]` and why
M&S #6 called it "acceptable-with-a-reason"). Both can be had at once:

```html
<div class="question-item">
  <button type="button" class="question-toggle" aria-expanded="false"
          aria-labelledby="q1" onclick="toggleAnswer(this)"></button>
  <strong id="q1">Explain the difference between EC2, Lambda, and Fargate…<span class="question-difficulty …">Easy</span></strong>
  <span class="question-hint">Click to reveal answer</span>
</div>
<div class="answer" style="display: none">…</div>
```

- The button is **empty** and `position: absolute; inset: 0` over the row, so the whole 342 × 158 px
  (390) / 544 × 127 px (1440) row is the target, exactly as before.
- Its accessible name comes from `aria-labelledby` → the question `<strong>` (an attribute, not
  innerText, so the gate never sees it move). Measured name of row 1: *"Explain the difference
  between EC2, Lambda, and Fargate. When would you use each? Easy"*.
- The `.answer` div **moved out of `.question-item`** to be its sibling inside the `<li>`, so the
  overlay never covers an open answer: answer text stays selectable and clicking inside an answer
  does not collapse it. It keeps the frozen inline `style="display: none"` verbatim and all 17 are
  `display: none` at load.
- Enter and Space are now **native**, so the delegated `keydown` handler with `preventDefault` is
  deleted. Measured at scrollY 400: Enter → `display: block`, `aria-expanded=true`, hint flips to
  "Click to hide answer", **scrollY stays 400**; Space → closed, **scrollY 400**; a raw mouse click
  over the question text → opens (the button intercepts, which is the point).
- **Cost**: the row's text is no longer selectable with a mouse drag (the transparent button is on
  top). That is the standard whole-row-disclosure trade and I took it; the answer body, which is the
  part worth copying, is unaffected.
- I edited `interview-prep.html`'s **page-local inline script** again (it is outside `<main>`, so I
  flag it as r1 did — it is not `script.js`, not shared chrome, and no other area owns it).
  `toggleAnswer()` is still a global function; it now takes the button and reads
  `item.nextElementSibling` for the answer. The script lost 8 lines net.

### 2.2 Other calls

1. **48ch, not 60ch, on the roadmap paragraph** — the round asked for 60ch, the round's *gate* asked
   for ≤ 65 characters per line, and those two disagree by ~10 characters (§1 item 2). I served the
   gate. The card still runs to the `--band` right edge, so only the paragraph is capped; the h3 and
   the chip row keep the full card width, which is the same pattern `.faq-answer p` already uses.
2. **The salary "featured" marking is gone entirely**, not moved to an eyebrow — adding an eyebrow
   would be adding content to a frozen page (§1 item 4).
3. **The tool links are text links, not buttons.** Four identical hairline buttons for four
   different destination types was half of CD #1; a quiet ink link + `↗` says "this leaves the site"
   without four filled shapes. Hit area is still 45.8 px.
4. **`.tool-card` is out of the shared card-shell rules** (`border/radius/background` and the
   flex-column padding rule) but **stays in the body-copy rule**, so the description keeps
   `--ink-2 / --fs-s` and only the row chrome changed.
5. **`.cert-level` and `.course-level` still use `text-transform: uppercase`** — unchanged from r1
   and still load-bearing: the baseline text records "FOUNDATIONAL"/"LEARNING PATH", so
   `font-variant-caps` alone is a content diff. Every *new* small-caps label I wrote is
   `font-variant-caps: all-small-caps` on text that is already in the snapshot in that form.
6. **Wave 1 r2 shell work was verified, not redone**: one left edge, `.ad-well { max-width: min(100%,970px) }`
   (970 px measured at 1440), `.cert-link` 44.8 px, neutral chips/badges, the single tinted family
   (level/difficulty). Nothing of mine re-colours a tag or re-introduces a second left edge.
7. `index.html` and `resources.html` markup untouched for the second round running; `abtest.js`
   compatibility held — `createBookCard` emits `.book-card > .book-cover > img` with **no**
   `width`/`height` attributes, and the new mount is fixed-size with `object-fit: contain`, so
   AB-rendered covers land in the same box with no CLS.

---

## 3. Numbers (all fresh, after the last edit)

### Harness — `harness/out/w2r2l/` (5 pages × 390/768/1440)

| Check | Result | Budget |
|---|---|---|
| Console errors / page errors / failed requests | **0 / 0 / 0** on all 15 runs | 0 |
| axe serious + critical | **0** | 0 |
| Horizontal overflow @ 390/768/1440 | **none** | none |
| Lab CLS | **0 on every page and width** (resources included, was 0.0008–0.0011) | ≤ 0.05 |

### Lighthouse mobile — `harness/out/w2r2l/lighthouse/`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight |
|---|---|---|---|---|---|---|---|---|
| index.html | **100** | **100** | **100** | 92 (`link-text`, frozen "Learn More") | 1.53 s | 0 | 0 ms | 73 KB |
| resources.html | **99** | **100** | **100** | **100** | 2.10 s | 0 | 0 ms | 194 KB |

`bf-cache` is the only other failing audit, caused by the local server's `Cache-Control: no-store`.

### Scripted measurements — `harness/out/w2r2l-probe.js` (throwaway, git-ignored)

```
cert-link rects @390        [80.6,44.8] x4
roadmap card width @390     302        (>= 300)      text left 89 (was 97)
roadmap first-line chars @1440  56 59 56 58 51 61    (<= 65; 60ch gave 73..78)
cert rule tops @1440        3161 3161 3161 3161      cert link tops 3323 x4
cert card top border        1px rgb(230,226,218)     salary .featured 1px rgb(230,226,218)
checkbox inputs @390        20x20 x6                 label rows 44/56.1/56.1/44/56.1/44
tool-link rects             87.5/87.4/96.1/86.4 x 45.8   icon grayscale(1) 17px opacity .7
level-jump rects            Beginner 83.5x44  Intermediate 109x44  Advanced 88.7x44
  click Intermediate ->     h2#intermediate top 72 (clear of the 56px header)
interview @390              17 BUTTON type=button  allLabelled=true  aria-expanded=false x17
                            first row 342x158.1   shortest row 127
interview @1440             17 BUTTON  first row 544x126.7  shortest 95
answers at load             display:none x17 (both widths)
Enter -> block/true, hint "Click to hide answer", scrollY 400 -> 400
Space -> none/false,  scrollY 400          mouse click over the question text -> block/true
focus ring on the row       rgb(194,65,12)
interview grid seam         48px (was 0)
ad-well probe index @390    inside .container [24,366] 342px   direct child of main [0,390] 390px
ad-well probe index @1440   both 970px
ad-well after .interview-grid @390   [24,366] 342px
calculator still works      Calculate -> $162,000 ; tick Cloud Practitioner -> $640
console errors on every probed page/width: 0
```

### Integrity

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

New `uiText` entry, as intended: `"Beginner Intermediate Advanced"` (the projects jump nav).
`node harness/apply-shell.js --check` → 0/19 pages would change.

### Weight (`node harness/weight.js`, gzip, ref `f1ec399`)

`WEIGHT: FAIL (19 pages)` — wave-wide and not mine: **my HTML is flat**. Against the previous commit
(`f12fce5`):

| file | gzip Δ | raw Δ | what it bought |
|---|---:|---:|---|
| index.html | **0** | 0 | not edited |
| resources.html | **0** | 0 | not edited |
| tools.html | **−3** | −12 | the four `project-link` → `tool-link` renames |
| projects.html | **+63** | +277 | the level jump nav + three `id`s |
| interview-prep.html | **+123** | +1,522 | 17 real buttons, `id`s, `aria-labelledby`, minus the deleted keydown handler |

`styles.css` at the time of the run: 41,457 raw / **8,914 gzip** (ref 35,518 / 6,078). Measured by
deleting my section and re-gzipping, `[listing-pages]` accounts for **12,128 raw / 2,137 gzip** of
that — the section grew **+1,819 raw** this round (10,309 → 12,128, budget 12,500) and the rest of
the sheet's movement this round is the other three areas writing concurrently. The +1,819 is: the
tool-row family (~700 B), the interview button family (~350 B), the level-jump nav (~330 B), the
cover mount and cert/salary simplifications (net ~−40 B), the checkbox overrides (~140 B) and three
comments (~340 B, deletable if the integrator needs the bytes).

---

## 4. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|---|---|
| `w2r2l-tools-1440-1850.png` | **The worst screen of r1, fixed**: four ruled rows, greyscale icons, one quiet `↗` link each, right-aligned on the container edge. No cards, no emoji colour, no four hairline buttons. |
| `w2r2l-tools-768-1400.png` | The same list at 768 — the link is already in its own column; rows read title → line → action. |
| `w2r2l-tools-390-1400.png` | Certification-cost checkboxes: 20 px boxes, 44 px rows, labels vertically centred against the box. |
| `w2r2l-tools-390-600.png` / `w2r2l-tools-390-0.png` / `w2r2l-tools-1440-0.png` | Calculator untouched and still the page's one orange action; two-field grid from 48em; page header and first card. |
| `w2r2l-index-390-2400.png` | Roadmap at 390: rail + disc in a 1.5 rem gutter, 302 px card, ~35 chars/line. |
| `w2r2l-index-1440-1400.png` | Roadmap at 1440: paragraph capped, h3 and chip row still full-width; the timeline still ends on the `--band` edge. |
| `w2r2l-index-390-4200.png` | Cert cards at 390 — hairline only, small-caps eyebrow, `—` spec list, underlined Learn More. |
| `w2r2l-index-1440-2400.png` | Cert row: eyebrows, titles, **spec rules and links all on one baseline** (the r1 stagger nit). |
| `w2r2l-index-1440-3400.png` | Three ruled resource columns + the salary row: three equal panels, no orange tier rule. |
| `w2r2l-index-390-6500.png` / `w2r2l-index-1440-5000.png` | Salary band head at 390; FAQ + CTA band at 1440 unchanged. |
| `w2r2l-projects-390-0.png` | The jump list as the first thing under the page header at 390 — three 44 px chips above the first section rule. |
| `w2r2l-projects-1440-300.png` | Same at 1440, then the 3-up beginner row (unchanged, still the strongest component). |
| `w2r2l-projects-390-400.png` | 1-up project card at 390 unchanged by this round. |
| `w2r2l-res-390-400.png` | Book card at 390: 120 × 160 mount at the top-left, jacket contained, hairline, no grey slab. |
| `w2r2l-res-768-400.png` | 1-up horizontal book cards at 768 — mount and title start together. |
| `w2r2l-res-1440-400.png` | 2-up at 1440: six mounts identical in size; the SAP-C02 card still shows *The Kubernetes Book* (HUMAN_TODO). |
| `w2r2l-ip-390-400.png` | Interview rows closed at 390: `+` in the left gutter beside the first word, difficulty chip inline, hint under. |
| `w2r2l-ip-390-open.png` | Row 1 open: `×`, "Click to hide answer", answer indented to the question, focus ring around the whole row (it is a real button). |
| `w2r2l-ip-1440-400.png` | Two ruled columns at 1440; the `+` gutter holds at column width. |

---

## 5. For the integrator

1. **`docs/AD_PLAN.md` needs two anchor edits I cannot make** (docs are out of my write scope), both
   now measured: `home-mid` must be placed **inside a section's `.container`** on index.html (342 px
   at 390 vs 390 px full-bleed as a child of `<main>`), and `listing-mid` on interview-prep must be
   **after the `.interview-grid`**, never inside it (342 px vs the 123 px M&S measured).
2. **Shared-file interleaving, again.** `styles.css` in the working tree also carries the
   article-template builder's in-flight hunks (lines ~183–253) while I was editing; every hunk *I*
   am committing is between the `[listing-pages]` and `[static-pages]` markers, and I touched no
   other section. `harness/apply-article.js`, `404.html`, `contact.html` and the eleven project
   pages in the same commit's tree are other builders' work, not mine.
3. **`interview-prep.html`'s inline script changed** (outside `<main>`; see §2.1). If the shell owner
   would rather host the 9-line `toggleAnswer` in `script.js`, the `onclick` attributes can be
   dropped for one delegated `click` listener on `.question-toggle` and nothing else changes.
4. **HUMAN_TODOs unchanged**: `images/books/sap-c02.jpg` is the wrong book, resources.html has no
   affiliate disclosure and no `rel="sponsored"`, and the four "Learn More" links keep index at
   SEO 92. None is a builder change.
5. **`resources.html` LCP 2.10 s** (h1 is the LCP element) is still shell/script-shaped, not image
   -shaped — unchanged from r1's finding and from wave1-r2's measurement.
6. New selectors in my section that the other areas may want to know about: `.tool-link`,
   `.question-toggle`, `.question-hint`, `.level-jump`, `.interview-grid + .interview-grid`.
   `.question-item::after` and `.tool-card .project-link` no longer exist.

---

## 6. How to reproduce

```
node harness/serve.js                                            # :4173
node harness/peek.js tools.html 1440 1850                        # any page/width/scrollY
node harness/out/w2r2l-probe.js                                  # every number in §3
node harness/snap.js  --label w2r2l --pages index.html,projects.html,resources.html,interview-prep.html,tools.html
node harness/lh.js    --label w2r2l --pages index.html,resources.html
node harness/integrity.js compare --base baseline-2026-09-13     # -> INTEGRITY: PASS
node harness/apply-shell.js --check                              # -> 0/19 pages would change
node harness/weight.js
```

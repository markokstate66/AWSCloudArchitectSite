# listing-pages builder — round 1

Date: 2026-09-13 · Branch: `facelift` · Area: **listing-pages**
Harness label: `listing-r1` · Integrity base: `baseline-2026-09-13`
Files: `styles.css` (`[listing-pages]` section only), `projects.html`, `resources.html`,
`interview-prep.html`, `tools.html`, `images/books/*.jpg`. **`index.html` was not edited at all** —
everything the home page needed was CSS.

---

## 1. What changed

### Home (`index.html`, CSS only)

| Component | Before | Now |
|-----------|--------|-----|
| Roadmap | rail at a hard-coded `left: 15px`, numbers on `--paper` inside a `--paper-2` band | real timeline: 2rem number gutter, rail centred on it (`left: 1rem; margin-left: -.5px`), disc on the band colour, tabular numerals, card body with the skill chips below a hairline |
| Cert cards | ragged: title, body, list and "Learn More" landed at four different heights per row | one anatomy — small-caps eyebrow → title (`min-height: 2.4em` from 40em) → description → spec list pinned with `margin-top: auto` above a hairline → quiet link. Titles, list rules and actions now align across the row (see `lp-index-1440-2400.png`) |
| Resource lists | every item a bordered mini-card | ruled link rows: title + one-line description + a `›` that goes accent on hover. Three ruled columns at 1440 |
| Salary | role title at h3 size, range smaller, "featured" card outlined in ink | three quiet panels; the **range is the display figure** (`--fs-4`, tabular), role title drops to `--fs-1`, benefits list pinned to the bottom above a hairline. Featured = 3px orange top rule only; every card carries a transparent 3px top border so the three tops still align |
| FAQ | fine | kept (ruled accordion, `max-height` collapse — see §5) |
| CTA band | `--paper-2`, i.e. the same colour as the FAQ band directly above it — the two read as one band | `--paper` between hairlines, so the closing band separates from the FAQ |

### Projects

3-up ≥ 64em / 2-up ≥ 40em / 1-up below (unchanged breakpoints, verified at 390/768/1440).
Header = level badge → title → one-liner on `--surface-2`; body = "AWS Services Used" chips →
"What You'll Learn" list → quiet **View Guide** pinned to the bottom. Both `h4`s are now small-caps
eyebrows. Inline styles removed (`margin-top: 60px` → `.section-break`, `gap: 30px`, the hard-coded
`rgba(255,255,255,.8)` inside the tips `.info-card`).

### Resources

- **Book cards**: cover on a quiet `--paper-2` surface (was navy) with a hairline around the jacket;
  `object-fit: contain`; explicit `width`/`height` on all eight `<img>`. Stacked cover-on-top below
  40em, **horizontal (cover | text) from 40em**, 1-up until 64em, 2-up at 64em. At 768 the 2-up
  horizontal card was 3 words per line and the button wrapped — that is why books are 1-up there.
- **Pluralsight promo**: was a navy block; now a quiet paper panel with a pink left rule, pink
  wordmark and the one orange CTA. Pink survives only in the wordmark and the `Learning Path` chip.
- **Course cards**: level chip → title (aligned via `min-height`) → description → ruled meta row →
  topics → quiet action. The pink outline button is gone (four identical pink buttons in a row read
  as a template); the links now carry `class="project-link course-link"` so they use the shared
  quiet-button style and two CSS rules could be deleted.

### Interview prep

Categories are ruled sections (the card border/padding is gone), questions are disclosure rows with
a `+` that rotates to `×` via `[aria-expanded="true"]`, 2-up only at ≥ 64em (was 40em — two columns
of question rows at 768 was cramped). **The rows are now keyboard operable**: `role="button"`,
`tabindex="0"`, `aria-expanded`, and the page's inline script rewritten as delegated `click` +
`keydown` (Enter/Space, `preventDefault`) that also flips `aria-expanded`. The answers keep the
frozen inline `style="display: none"` and are still `display:none` on load (§5). 27 blocks of inline
styling inside the answers (`margin-left: 20px`, `margin-top: 10px`, `border-top: 1px solid #ddd`)
were deleted and replaced by `.answer` rules — that alone is −1.3 KB of HTML.

### Tools

Calculator is one form card with a ruled title and, **from 48em, a two-field-per-row grid** (the
single column left half the 1200 container empty). Result panel is left-aligned with a small-caps
label and a `--fs-6` tabular figure. The footnotes' inline `opacity: .7` (which put 8:1 text below
AA) is gone; they are `--fs--1` at 8:1. Tool cards 4-up/2-up/1-up with the action pinned to the
bottom (inline `margin-top: 15px` removed).

### Images (`images/books/*.jpg`, same filenames, same alt)

Re-encoded in place, contained to **360 px tall** (2 × the 190 px mobile cover box / 1.9 × the 176 px
desktop one) at quality **0.75**, using a throwaway Chromium-canvas script (`harness/out/reencode.js`,
git-ignored, no new npm package).

| File | Before | After | | File | Before | After |
|------|-------:|------:|-|------|-------:|------:|
| saa-c03.jpg | 31,295 | 16,976 | | cloud-native.jpg | 44,791 | 17,311 |
| sap-c02.jpg | 30,047 | 12,662 | | terraform.jpg | 54,301 | 21,016 |
| ddia.jpg | 58,161 | 21,934 | | aws-security.jpg | 24,318 | 14,463 |
| phoenix-project.jpg | 53,518 | 18,398 | | devops-handbook.jpg | 61,431 | 20,508 |
| | | | | **total** | **357,862** | **143,268** |

−60 %, under the 150 KB target. The first cover (in the 412 px viewport) dropped `loading="lazy"`
and took `fetchpriority="high"`; the other seven stay lazy.

---

## 2. Decisions and assumptions

1. **Small caps are a font feature, not `text-transform`.** All eyebrows use
   `font-variant-caps: all-small-caps` at `--fs-s`, which `innerText` (and therefore the content
   gate) does not see. `.cert-level` and `.course-level` **keep `text-transform: uppercase`** because
   the baseline snapshot records "FOUNDATIONAL"/"LEARNING PATH"; `all-small-caps` renders those
   already-uppercase letters as small caps, so the look is right and the text is unchanged. The
   brief's "font-variant-caps, not text-transform" for cert cards could not be taken literally —
   dropping `text-transform` there turns "FOUNDATIONAL" into "Foundational" and fails the gate.
2. **The interview answer stays `display: none` until activated**, exactly as the baseline snapshot
   has it, so no answer text enters the page-text check. I did **not** wrap the question in a
   `<button>`: the gate strips `button` from both the text and heading snapshots, and the question
   text *and* the "Click to reveal answer" hint are part of the frozen content text. `role="button"`
   on the existing `<div>` keeps the text where the gate expects it and still gives the row a name,
   a role, a tab stop and `aria-expanded`.
3. **I edited the page-specific inline script at the bottom of `interview-prep.html`.** It is not
   `script.js`, not shared chrome and no other area owns it, but it *is* outside `<main>` — flagging
   it so the integrator knows. Behaviour is identical for mouse users; `toggleAnswer()` is still a
   global function with the same signature.
4. **Quiet actions everywhere.** Orange fill is left for exactly two things on my pages: the
   calculator submit and the Pluralsight trial CTA. Cert links stay text links, project/book/course
   links are hairline outlines.
5. **Book covers are 1-up until 64em** (see above) and the cover column is top-aligned from 40em so
   the jacket and the title start together.
6. **`.contact-form` and `.calculator-container` still share my card-shell rule** (inherited from
   Wave 1). That is a seam with static-pages — if they want their own shell, take `.contact-form`
   out of my selector list and I will not fight it.
7. **`index.html` markup untouched** — no class, no wrapper, no inline style needed. The home page
   redesign is entirely in the stylesheet.

---

## 3. Numbers

### Harness — `harness/out/listing-r1/summary.json` (5 pages × 390/768/1440)

| Check | Result |
|-------|--------|
| Console errors / page errors / failed requests | **0 / 0 / 0** on all 15 runs |
| axe serious + critical | **0** (axe violations of any impact: 0) |
| Horizontal overflow | none at 390 / 768 / 1440 |
| Lab CLS | 0 everywhere except resources.html 0.0008 (768) / 0.0011 (1440) — budget 0.05 |

### Lighthouse mobile — `harness/out/listing-r1/lighthouse/summary.json`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight |
|------|------|------|----|-----|-----|-----|-----|--------|
| index.html | **100** | **100** | 100 | 92 | 1.65 s | 0 | 2 ms | 74 KB |
| resources.html | 99 | **100** | 100 | **100** | 2.18 s | 0 | 0 ms | **195 KB** (baseline 339) |

SEO 92 on index is the pre-existing `link-text` ("Learn More" ×4) flagged in wave1-builder §7 — it
needs a content approval, not a CSS change.

### Page weight (`node harness/weight.js`, gzip, ref `f1ec399`)

| Page | gzip now | gzip ref | Δ | raw now | raw ref |
|------|---------:|---------:|--:|--------:|--------:|
| index.html | 17,949 | 14,724 | +3,225 | 74,950 | 76,908 |
| projects.html | 16,300 | 12,750 | +3,550 | 68,979 | 69,439 |
| **resources.html** | **161,642** | 372,586 | **−210,944** | 216,998 | 430,120 |
| tools.html | 16,186 | 12,603 | +3,583 | 64,274 | 62,146 |
| interview-prep.html | 18,647 | 15,143 | +3,504 | 78,617 | 82,637 |

**The overage is the shared stylesheet, not these pages.** My HTML is flat-to-negative
(gzip Δ vs the Wave 1 commit `33ee55b`: index 0, projects −56, tools −46, interview-prep +22,
resources +55), and resources.html is 211 KB lighter. `styles.css` is 42,787 raw / 10,282 gzip
against a 35,518 / 6,078 baseline; measured by swapping my section back to its Wave 1 text, **my
area accounts for +1,881 raw / +673 gzip of that**, i.e. ~16 % of the +4,204 gzip the sheet has
gained since the baseline (Wave 1 itself added +2,182). Every page in the repo is over on gzip, so
this is a cross-area reconciliation for the integrator (see §6 for what I can give back).

My section is **12,426 B** against the ~9 KB the brief asked for. I took it from 10,545 B (Wave 1)
up to 13,128 B and then back down by merging the body-copy rules onto the card bodies, cutting all
multi-line comments to two lines, deleting the `.course-link` pair in favour of a markup class, and
dropping four now-redundant declarations. Going below ~11.5 KB means dropping design, not fat — §6
lists what would go, in the order I would drop it.

### Integrity

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

No text, heading, link, image `src`/`alt`, JSON-LD or meta change on any page.

### Behaviour (`harness/out/lp-interact.js`, throwaway)

```
interview row: display none -> aria-expanded false          (load state matches the baseline)
click:         display block  aria true   hint "Click to hide answer"
Enter:         display block  aria true
Space:         display none   aria false  (page did not scroll - preventDefault holds)
index FAQ:     aria false -> true, answer height 276px
tools:         #salaryResult display:none at load -> block after Calculate ($162,000)
               checkbox change recalculates ($640)
```

---

## 4. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|------|-----------|
| `before-index-1440-2400.png` | The "before": cert row with four different body/link heights — the reason for the `min-height` + `margin-top:auto` anatomy. |
| `before-res-1440-400.png` | The "before": navy cover bands, 2-up vertical book cards. |
| `lp-index-390-2400.png` | Roadmap at 390: rail, numbered discs, hairline cards, chips under a rule. |
| `lp-index-390-4200.png` | Cert cards at 390 — small-caps eyebrow renders correctly, `—` spec list, ruled bottom block. |
| `lp-index-390-5200.png` | Resource link rows with chevrons; the section band change. |
| `lp-index-390-7400.png` | Salary cards: range as the display figure, orange top rule on the featured one. |
| `lp-index-390-8100.png` | Salary note + FAQ accordion head. |
| `lp-index-390-900.png` | "What is" section (unchanged markup) sits correctly under the new rhythm. |
| `lp-index-1440-2400.png` | **Cert row aligned**: eyebrows, titles, list rules and "Learn More" all on one baseline. |
| `lp-index-1440-3400.png` | Three ruled resource columns + salary row at 1440. |
| `lp-index-1440-faqopen.png` | FAQ open state at 1440, `+` → `×`, answer at 68ch. |
| `lp-index-1440-cta.png` | CTA band on `--paper` now reads as its own band above the footer. |
| `lp-projects-390-400.png` / `lp-projects-768-400.png` / `lp-projects-1440-300.png` | 1-up / 2-up / 3-up project cards, badge → title → chips → list → quiet action, bottoms aligned. |
| `lp-res-390-400.png` / `lp-res-390-1600.png` | Stacked book cards at 390, cover on paper-2 with a hairline; covers still crisp at q 0.75. |
| `lp-res-768-500.png` | Caught the bug: 2-up horizontal book cards at 768 were 3 words per line with a wrapped button → books are now 1-up until 64em (shot re-taken after the fix). |
| `lp-res-1440-400.png` | 2-up horizontal book cards, cover top-aligned with the title. |
| `lp-res-1440-1600.png` / `lp-res-1440-2300.png` | Pluralsight panel as a quiet paper partner panel; course cards with aligned headers and quiet actions. |
| `lp-ip-390-400.png` / `lp-ip-390-open.png` / `lp-ip-1440-400.png` | Interview rows closed and open at 390, two ruled columns at 1440. |
| `lp-tools-390-300.png` / `lp-tools-390-1400.png` / `lp-tools-1440-300.png` / `lp-tools-768-600.png` | Calculator card 1-up on a phone, two fields per row from 48em, navy display panel with the small-caps label. |

---

## 5. Gate-driven constraints I had to respect (evidence, not opinion)

- `integrity.js` strips `nav, button, [data-ui], .ad-well` before reading `innerText`. The interview
  question text and the "Click to reveal answer" hint **are** in the baseline text, so neither may
  move inside a `<button>`. The FAQ questions are *not* in the baseline text (they were already
  buttons), which is why that component could stay as it is.
- The baseline text contains every FAQ **answer** (`max-height` collapse) and **no** interview
  answer (`display: none`). Both states are preserved exactly.
- `.cert-level` / `.course-level` uppercase is in the baseline text; removing `text-transform` there
  is a content diff.
- `::before`/`::after` content (the `—`, `•`, `›`, `+` glyphs) is invisible to `innerText`, so
  decorative glyphs are safe; visible characters in markup are not.

---

## 6. For the integrator

1. **Shared-file interleaving already happened.** `fe8d019`, `79ab105` and `ab11afe` (static-pages
   and article-template) each committed `styles.css` while my edits were in the working tree, so
   roughly the first three quarters of my section is already inside their commits. Everything in my
   commit is the remainder. Nothing of theirs is in my diff — every hunk I am committing is between
   the `[listing-pages]` and `[static-pages]` markers.
2. **The gzip weight gate fails for 19 pages and it is the stylesheet.** Baseline sheet 6,078 gzip →
   10,282 now. If bytes have to come back out of my section, drop them in this order (raw / rough
   gzip): the 48em calculator two-column grid (208 / ~70), the resource-list chevron and its hover
   (240 / ~80), `min-height` row alignment (78 / ~25), `.question-item:hover > strong` (62 / ~20),
   the book-card horizontal layout at 40em (330 / ~110). That is ~920 raw / ~300 gzip and it costs
   real design; I would rather the four areas each give up something similar than gut one.
3. **`resources.html` LCP is not image-bound.** With **all eight covers blocked** Lighthouse still
   reports **1.95 s** (`harness/out/noimg3/`), against 2.18 s with them and 2.10 s at baseline, and
   index.html with the identical shell is 1.65 s. The covers are worth ~0.2 s; the remaining ~0.15 s
   over budget is shell/script-shaped. `<script src="abtest.js">` at the end of `resources.html` is
   the only structural difference and it is **not** deferred — I tested `defer` (no change, so I
   reverted it), but the page's LCP element is the `<h1>`, so this needs whoever owns the shell to
   look, not more image work.
4. **Content bug for the human, not for me**: `images/books/sap-c02.jpg` is a photograph of *The
   Kubernetes Book*, not the SAP-C02 study guide, while its `alt` says SAP-C02. `src` and `alt` are
   frozen, so I re-encoded it as-is. It needs a new image plus an `images` approval.
5. `index.html` SEO 92 (`link-text`, four "Learn More" links) is unchanged and still needs the
   approval proposed in `wave1-builder.md` §7.
6. `.section-break` (`margin-top: var(--sp-8)`) is a new utility in my section, used by the three
   mid-section `<h2>`s on `projects.html`/`tools.html` that used to carry `style="margin-top: 60px"`.
7. `harness/out/reencode.js` is the image script (git-ignored). Re-running it on already-encoded
   files would re-compress them — it is not idempotent, so treat the current JPEGs as the source.

---

## 7. How to reproduce

```
node harness/serve.js                                            # :4173
node harness/peek.js resources.html 768 500                      # any page/width/scrollY
node harness/snap.js  --label listing-r1 --pages index.html,projects.html,resources.html,interview-prep.html,tools.html
node harness/lh.js    --label listing-r1 --pages index.html,resources.html
node harness/integrity.js compare --base baseline-2026-09-13     # -> INTEGRITY: PASS
node harness/weight.js
```

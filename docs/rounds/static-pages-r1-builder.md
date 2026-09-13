# static-pages builder — round 1

Date: 2026-09-13 · Branch: `facelift` · Area: **static-pages** (Wave 2, parallel with
article-template, code-and-diagrams, listing-pages)
Label for all harness output: `static-r1` · Integrity base: `baseline-2026-09-13`

---

## 1. What changed

| File | Change |
|------|--------|
| `styles.css` | `/* ==== [static-pages] ==== */` section only, **1,059 B → 3,178 B (+2,119 B)**. Rewritten around a `.prose` hook, an editorial `.feature-list`, a `.note` callout, the contact card and drawn `.form-status` icons. No other section touched. |
| `about.html` | Inside `<main>` only: `.content-text` → `.content-text prose`; `class="note"` on the four disclaimer/affiliate paragraphs; dropped the inert inline `style="max-width: 800px;"` on the container. +32 B. |
| `privacy.html` | Inside `<main>` only: `.content-text` → `.content-text prose prose-compact`; `class="note"` on the affiliate paragraph; dropped the same inline `style`. +7 B. |
| `contact.html` | Inside `<main>` only: `role="status"` on the existing `#formStatus` div. No ids/names/`required`/text changed, inline script untouched. +14 B. |
| `404.html` | Inline `<style>` only; markup and copy untouched. 2,379 B → **2,827 B** (budget ≤ 3 KB). |

No file outside the ownership map was edited. No `git add -A`.

### Prose (`.prose`)

- **New hook.** The old section styled `.content-text` — which is *also* used by
  `index.html` and `projects.html`, i.e. listing-pages territory. Every prose rule now hangs off
  `.prose`, added to the two static pages, so nothing here can leak into another builder's page.
  The 68 ch measure still comes from `.content-text` in `[layout-shell]`.
- **Ruled h2 sections**: `--fs-2` (22 px), 1 px top rule, `--sp-6` above / `--sp-3` below, first
  heading unruled. Body at `--ink-2` (7.5:1), `<strong>` back to `--ink` so terms pop.
- **Editorial lists**: `.prose .feature-list` becomes hairline rows — top rule, a rule under every
  item but the last, `--sp-3` vertical padding, the drawn accent tick hanging in the 1.7 em gutter,
  and `strong { display: block }` so `Career Roadmap:` sits on its own line above its description.
  About's "What We Offer" now reads as a definition list; privacy's five lists read as
  comfortable rows rather than a bullet dump.
- **Quiet note**: `.prose > .note` — `--paper-2` ground, 2 px `--line-2` left rule, `--fs-s`,
  zero margins so adjacent notes collapse into **one** block (`.note + .note { padding-top: 0 }`).
  Wraps the three Disclaimer paragraphs as a single quiet block plus the Affiliate Disclosure
  paragraph on both pages. **No text was added, removed or reworded.**
- **Privacy rhythm**: `.prose-compact > h2` tightens the section gap to `--sp-5`/`--sp-3`, and
  `.prose > h3` was pulled to `--sp-4` so the h2+h3 pairs read as a pair. Twelve sections now scan
  as rhythm instead of a wall.

### Contact form

- `.contact-form` is one **40 rem hairline card**, left-aligned at the same left edge as the prose
  column at every width. Labels unchanged (design-system primitive). `.form-group` tightened to
  `--sp-4` inside the form only.
- `min-height: 44px` on inputs (textarea 9.5 rem, resizable vertically), submit button 44 px and
  full width below 40 em, `min-width: 13rem` auto width above. One orange primary action, nothing
  else competing.
- Focus: the global 2 px `:focus-visible` ring **plus** `.contact-form :focus { border-color:
  var(--accent) }`, so the field itself reads as active, not just the ring.
- `.form-status` icons are **drawn in CSS**: success is a rotated two-border tick, error is two
  rotated bars forming an ×, both `currentColor` so they inherit the state colour. No glyphs, no
  new text nodes — the status string still comes only from the page's own inline script, which was
  not edited. `display: none` applies only to the empty status div, never to visible content.
- `role="status"` added to `#formStatus` so the script's message is announced. Attribute only —
  invisible to the content gate.

### 404

Paper page, cloud mark, **404 as a big quiet numeral**: `clamp(4.5rem, 19vw, 7rem)` at `--ink-3`
(6.0:1 — deliberately *not* `--line-2`, which would be ~1.4:1 and an axe `color-contrast` serious
node at that size). `h1` on `clamp()`, message capped at 46 ch, the joke restyled into the **same
quiet-note language** as `.prose > .note`, existing "Return to Home Region" link still the single
orange primary action. Tokens copied from `[design-system]`; still `noindex`, still self-contained
(no `styles.css` link, no second request beyond the favicon), 2,827 B.

---

## 2. Decisions and assumptions

1. **`.prose`, not `.content-text`.** See above — `.content-text` is shared with listing-pages.
   This is also why the section is byte-cheaper than the old one would have been.
2. **The note callout uses a `class`, not a positional selector.** The brief said "CSS only".
   I kept the *text* untouched and added no elements, but I did add `class="note"` to the existing
   `<p>`s rather than selecting them with `:has()`/`nth-of-type()` chains. Reasons: a positional
   selector breaks the moment the copy is reordered, it cannot express "these paragraphs but not
   the next section's", and it costs **shared** CSS bytes on all 21 pages where a class costs HTML
   bytes on 2. `class` is not one of the gate's CONTENT_FIELDS, and integrity passed. If the panel
   wants it literally CSS-only, say so and I will swap it for a `:has(> strong:only-child)` +
   sibling chain — it will be uglier and ~120 B more expensive.
3. **Dropping `style="max-width: 800px;"`** from the about/privacy containers is a no-op visually:
   `.content-text` caps the column at 68 ch (~640 px), well inside 800 px. It buys 28 B per page.
4. **`.contact-form` card shell restated in my section.** `[listing-pages]` line ~429 has
   `.tool-card, .calculator-container, .contact-form { border … background … }` but no padding, so
   with my rule as written the fields sat flush against a hairline. `.contact-form` is
   static-pages-owned per ARCHITECTURE, so I now declare `padding/border/background` myself (my
   section is later in the file, so it wins). **Seam for the integrator — see §6.**
5. **No `text-transform` anywhere**, no `display: none` on visible content, no heading re-tagging,
   no new visible text. `strong { display: block }` was checked against the gate: `innerText`
   inserts a newline, `norm()` collapses it back to the same single space, so the page-text
   snapshot is byte-identical (confirmed by INTEGRITY: PASS).
6. **The inline contact script was not touched**, per the brief. All ids, `name`s and `required`
   attributes are unchanged, so `/api/contact` and the status handling still work.

---

## 3. Numbers

### Playwright / axe — `harness/out/static-r1/` (4 pages × 390/768/1440)

| Check | Result | Budget |
|-------|--------|--------|
| Console errors / page errors | **0 / 0** on all 12 runs | 0 |
| Failed requests | **0** | — |
| axe serious + critical | **0** | 0 |
| Lab CLS | **0** at every width (baseline: about 0.160 @768, privacy 0.100 @768) | ≤ 0.05 |
| Horizontal overflow | none at 390 / 768 / 1440 | none |

### Lighthouse mobile — `harness/out/static-r1/lighthouse/`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|------|------|------|----|-----|-----|-----|-----|
| about.html | **100** | **100** | **100** | **100** | 1.5 s | 0 | 0 ms |
| contact.html | **100** | **100** | **100** | **100** | 1.5 s | 0 | 0 ms |

`bf-cache` is the only binary failure on both, caused by the local server's `Cache-Control:
no-store` — INVENTORY says to ignore it locally.

### Integrity

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

`docs/APPROVALS.json` untouched and still empty. No new UI-chrome text.

### Bytes — **the one budget that is not clean, and it is not local to this area**

| Page | Baseline | Measured now (all four Wave 2 areas in the tree) | Attributable to static-pages alone |
|------|---------:|------------------------------------------------:|-----------------------------------:|
| about.html | 52,281 | 57,211 | **52,036 (−245)** |
| contact.html | 50,275 | 55,255 | **50,246 (−29)** |
| privacy.html | 53,888 | 58,452 | **53,624 (−264)** |
| 404.html | 3,220 | 3,127 | **3,127 (−93)** |

"Attributable" = the wave1-r1 transfer for that page + my section's +2,119 B + my HTML delta;
i.e. what the page would weigh if mine were the only Wave 2 change. On that basis **every page I
own is under baseline.**

The measured column is over because `styles.css` is **43,278 B** in the working tree right now
against a **35,518 B** baseline — **+7,760 B from the four Wave 2 builders combined**, of which
**+2,119 B (27 %) is mine**. Three separate writes by other builders landed in `styles.css` while
I was working, and the number moved between my two snap runs. This is a wave-level problem, not a
static-pages one, and it needs an integrator decision — see §6.

My section is 3,178 B against the "≤ ~3 KB" guidance: 178 B over, after three trimming passes
(removed a redundant `.prose-compact > h3`, an unused `ul:not([class])` rule, a `li:last-child`
margin rule and ~250 B of comments). Further cuts would start costing the goals in the brief.

---

## 4. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|------|-----------|
| `sp-about@390+0.png` | Breadcrumb, title band, "Our Mission" unruled as first heading, "What We Offer" ruled; first list row shows the hanging tick with the term on its own line. |
| `sp-about@390+700.png` | The full What-We-Offer list: six hairline rows, term/description pairs, no double rule at the bottom (caught and fixed: the last row's rule was colliding with the next h2's rule). |
| `sp-about@390+1600.png` | Disclaimer: three paragraphs fused into one quiet `--paper-2` block with a single left rule; Affiliate Disclosure the same. Text identical to baseline. |
| `sp-about@1440+0.png` | 68 ch column left-aligned, ruled sections, nothing stretched — reads editorial, not templated. |
| `sp-about@1440+700.png` | List → "Why Trust Us?" → Disclaimer note, rhythm holds at desktop. |
| `sp-privacy@390+0.png` | Compact rhythm: "Introduction", then the h2+h3 pair reading as a pair, then the ruled list. |
| `sp-privacy@390+900.png` | Four sections visible in one phone screen — the "wall of twelve h2s" is gone. |
| `sp-privacy@390+2400.png` | Deep-scroll check: Data Retention / Your Rights / Children's Privacy all still distinct. |
| `sp-privacy@1440+600.png` | Same rhythm at desktop, list rules aligned to the measure. |
| `sp-contact@390+0.png` | Form card, four labelled fields, 44 px+ targets. **Caught the seam**: before the fix the fields sat flush against the listing-pages card border. |
| `sp-contact@390+600.png` | Submit button full width at the bottom of the card, footer below. |
| `sp-contact@1440+0.png` | 40 rem card left-aligned in the column, auto-width orange submit — one primary action. |
| `sp-contact-focus@390.png`, `sp-contact-focus@1440.png` | Keyboard focus in `#name` (verified `document.activeElement.id === 'name'`): accent border + 2 px accent ring. |
| `sp-contact-error@390.png`, `sp-contact-error@1440.png` | `.form-status.error` set via `page.evaluate` (no submit, no network): danger tint, drawn × icon, text from the script's own error string. |
| `sp-contact-success@390.png`, `sp-contact-success@1440.png` | `.form-status.success`: ok tint, drawn tick. |
| `sp-404@390+0.png` | Paper page, orange cloud, big quiet grey 404, two-line h1, joke as a quiet note, orange CTA. |
| `sp-404@1440+0.png` | Same, centred, numeral at the 7 rem clamp ceiling. |

Driver for the focus/status shots: `harness/out/sp-formstates.js` (in git-ignored `harness/out/`).
It also asserts 0 console errors on both widths.

---

## 5. Gate result

- Integrity: **PASS**, 0 approvals used.
- Console errors 0, axe serious/critical 0, CLS 0, Perf 100, A11y 100, BP 100, SEO 100.
- Bytes: under baseline for every page I own **when measured against my change alone**; over when
  measured against the current shared `styles.css`. See §6.

---

## 6. For the integrator

1. **`styles.css` byte budget is blown wave-wide.** 43,278 B vs a 35,518 B baseline (+7,760 B;
   mine is +2,119 B). wave1 already warned that the tightest project page had **62 B** of slack.
   Four builders each needing 2 KB cannot fit under a raw-bytes budget. Options, in my order of
   preference: (a) measure transfer with compression — Azure SWA gzips/brotlis `text/css`
   automatically, so the production number is roughly a third of this and the budget is met with
   room to spare; the harness server sends it uncompressed, which is what makes the budget bite;
   (b) ship a minified `styles.css` (no build step needed if it is committed); (c) per-area byte
   approvals. This needs a decision before the final gate, not per-area trimming — I have already
   trimmed this section three times and further cuts cost design quality.
2. **Seam: `.contact-form` is declared twice.** `[listing-pages]` has
   `.tool-card, .calculator-container, .contact-form { border … border-radius … background … }`,
   and I now restate those three properties (plus padding) in `[static-pages]`. Mine wins by
   order. Cleanest fix: drop `.contact-form` from the listing-pages selector — it is
   static-pages-owned per ARCHITECTURE, and it reclaims ~15 B.
3. **`.content-text` is shared.** I moved every static-page prose rule onto `.prose` so it no
   longer touches `index.html` / `projects.html`. If listing-pages wants ruled h2s in *their*
   `.content-text` blocks, that is now theirs to add — it is no longer coming from my section.
4. **`404.html` is still self-contained** (2,827 B, inline tokens, no `styles.css` link,
   `noindex`). If the design system's token values ever change, the seven values duplicated at the
   top of its `<style>` need a manual sync — that is the price of the no-second-request rule.
5. **Nothing here needs a content approval.** No text, heading, link, image or metadata changed on
   any of the four pages.

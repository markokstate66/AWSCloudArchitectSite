# article-template builder — round 1

Date: 2026-09-13 · Branch: `facelift` · Area: **article-template** (Wave 2)
Label for all harness output: `article-r1` · Integrity base: `baseline-2026-09-13`

---

## 1. What changed

| File | Change |
|------|--------|
| `styles.css` `/* ==== [article-template] ==== */` | Rewritten in place with the Edit tool, inside the section markers only. **5,765 B** (was 3,344 B, +2,421 B). No other section touched. |
| `harness/apply-article.js` | **New.** Applies the article markup to all 11 `project-*.html` by exact block replacement. Idempotent (`--check` → `0/11 would change` after a run), line-ending aware, never touches a `<pre>`, `.code-block` or `.architecture-diagram`. |
| 11 × `project-*.html` | `<h2>` ids, `.guide-meta` → `<dl>`, pagination link classes, `.guide-aside` rail. **+633 B/page** (+645 on `project-infrastructure-as-code.html`, whose third h2 slug is longer). |

### Markup (all four steps applied by `apply-article.js`, all inside `<main>`)

1. **Stable `id` on every guide `<h2>`**, slugified from its own text and de-duplicated per page
   (`project-overview`, `prerequisites`, `architecture` / `choose-your-tool`,
   `step-by-step-instructions`, `tips`, `code-examples`, `what-youll-learn`). Tag and text frozen;
   only the attribute is new. `html { scroll-padding-top }` from Wave 1 already offsets the sticky
   header — verified: clicking a rail link lands the h2 at 72 px (390) / 80 px (1440).
2. **Key facts as a definition list.** `<div class="guide-meta">` → `<dl class="guide-meta">`, and
   each `<div class="meta-item"><strong>Difficulty:</strong> Beginner</div>` (3 lines) →
   `<div class="meta-item"><dt>Difficulty:</dt><dd>Beginner</dd></div>` (1 line). `dt`/`dd` are both
   block-level, so the rendered text is character-for-character what the baseline snapshot holds —
   and the one-line form is **~110 B/page smaller** than the original.
3. **Pagination footer.** The two `.guide-navigation` links move off the shared `.btn-secondary` /
   `.btn-primary` buttons onto `.guide-nav-link`, so they can be two quiet cards instead of one
   outline button and one orange button. `href` and link text untouched.
4. **"On this page" rail** as the LAST child of `.project-guide`, exactly the shape the brief
   specified, generated from that page's own h2s:
   `<aside class="guide-aside" data-ui><nav aria-label="On this page"><p class="guide-aside-title">On this page</p><ol>…</ol></nav></aside>`.

### CSS

- **Key facts** (`.guide-meta`): the card (border + radius + white fill) is gone. Below 48em it is a
  hairline-ruled two-column definition list (label 7.25rem / value, baseline-aligned); from 48em it
  is a three-column strip with vertical hairlines, top and bottom rules — the same hairline-strip
  language Wave 1 used for the home `.hero-stats`.
- **Sections** (`.guide-section`): no surface, no nesting. 68 ch measure, `h2` with a `--line-2` top
  rule, one rhythm (`--sp-6` between sections, `--sp-4` under an `h2`). `.guide-section > h2:target`
  turns its rule accent-orange — the CSS-only "you are here" the brief asked for, no observer.
- **Steps** (`.guide-step`): `display: contents` on `.step-content` promotes the `h3` and the list
  into the step's own grid. At 390 the number badge (1.75 rem, accent-tint, hairline ring) sits in
  the gutter beside the `h3` and **the list spans both tracks**, so the body keeps the full 342 px
  measure instead of losing 48 px to the gutter. From 48em the badge is 2 rem and the body indents
  under the title. The digit stays real text in `.step-number` (it is in the content snapshot).
- **Tips** (`.tips-box`): note callout — 3 px accent left rule, accent tint, hairline. The injected
  `::before` glyph is gone; the list is a plain `disc` list with accent `::marker`s.
- **Pagination** (`.guide-navigation`): 1-up below 40em, two equal cards above it, top rule,
  second card right-aligned.
- **Rail** (`.guide-aside`): below 64em a one-line scrollable chip row placed directly under the key
  facts; from 64em the sticky column-2 rail (15.5 rem, left hairline, `top: header + 24px`), with
  the "On this page" title shown only there. The Wave 1 explicit grid placement
  (`grid-column: 2; grid-row: 1 / -1`, every other child pinned to column 1) is unchanged — no
  auto-placement anywhere, so the void Wave 1 warned about cannot open.

---

## 2. Decisions and assumptions

1. **The rail is `order`-ed, not re-parented.** The brief requires the aside to be the *last* child
   of `.project-guide` and to render under the key facts below 64em. `.project-guide` is therefore a
   column flexbox below 64em with `order: 0` on `.guide-overview`, `1` on `.guide-aside`, `2` on
   everything else. **Trade-off, flagged:** DOM/visual order then diverge below 64em — a keyboard
   user reaches the seven rail links *after* the article, not before it (WCAG 2.4.3 smell, no axe
   rule covers it). It is supplementary navigation that duplicates headings, and the skip link plus
   the breadcrumb already cover bypass, so I shipped it. If the panel prefers strict focus order,
   the fix is to move the aside to the *first* child in `apply-article.js` — Wave 1 §8 confirms the
   explicit grid placement makes a DOM-first aside safe — and drop the three `order` declarations.
2. **Chip row, not a `<details>` drawer.** The brief allowed either. `<details>` cannot be built
   from the markup the brief specified (`<aside><nav><p>…<ol>`), and forcing it open again at 64em
   needs a `display` override on UA shadow behaviour. The chip row is seven plain links: natively
   keyboard-operable, no JS, no `display:none` on anything focusable. **Measured: the block is
   32 px tall + 16 px margin = 48 px of push**, exactly the budget.
3. **"On this page" is hidden below 64em.** Keeping the visible title would have cost another ~20 px
   and blown the 48 px budget, or eaten 85 px of the 342 px row. `nav[aria-label="On this page"]`
   still names the region for AT, and the chips are self-describing. It is `data-ui` text, so
   `display: none` on it cannot affect the content gate.
4. **No `role="navigation"` on `.guide-navigation`.** It was tempting (it is pagination), but the
   gate excludes `nav` *tags* only — while `role=navigation` would be gate-safe, it adds 45 B/page
   and a `landmark-unique` surface for no reading benefit. The two cards carry their own direction
   words ("← Previous Project", "Next Project →").
5. **`<dl>` with `<div>` wrappers** is valid HTML and passes axe `definition-list` / `dlitem`
   (a `div` is an allowed direct child of `dl`). Verified: 0 axe violations of any impact.
6. **Nothing uppercase, nothing hidden, no heading re-tagged.** `.meta-item dt` and
   `.guide-aside-title` use weight + tracking + size + colour, never `text-transform` (Wave 1 §2.5).
   The only `display: none` in the section is on `.guide-aside-title`, which is inside `data-ui`.
7. **No `.code-block` / `.architecture-diagram` markup or CSS was touched** (code-and-diagrams owns
   them), and no shell markup was touched (layout-shell/integrator own it).

---

## 3. Numbers vs baseline

### Playwright / axe — `harness/out/article-r1/` (3 pages × 390/768/1440)

| Check | Result | Budget |
|-------|--------|--------|
| Console errors / page errors | **0 / 0** (9 runs) | 0 |
| Failed requests | **0** | — |
| axe serious + critical | **0** | 0 |
| axe violations of *any* impact | **0** | — |
| Horizontal overflow at 390 / 768 / 1440 | **none** | none |
| Lab CLS | **0** on every page at every width | ≤ 0.05 |

### Lighthouse mobile — `harness/out/article-r1/lighthouse/`

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|------|------|------|----|-----|-----|-----|-----|
| project-multi-account-landing-zone.html | **100** | **100** | **100** | **100** | 1.65 s | **0** | 5 ms |

`bf-cache` is the only binary audit failure (local server sends `Cache-Control: no-store`;
INVENTORY says ignore it locally). Same as Wave 1.

### Integrity

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

New UI-chrome text recorded by the gate (and therefore auditable): one string per project page,
`"On this page Project Overview Prerequisites Architecture Step-by-Step Instructions Tips Code
Examples What You'll Learn"`. No content text added, no heading changed, no link target added
(every rail href is fragment-only, which the gate ignores).

### Bytes — this is the one budget that is not met, and it is a shared-file seam

| | bytes |
|---|---|
| `[article-template]` CSS section | 3,344 → **5,765** (+2,421) |
| project page HTML, my change | **+633 B/page** (+645 on infrastructure-as-code) |
| project page HTML vs baseline (incl. the integrator's re-indent) | **−2,315 … −2,971 B/page** |

**Area-only position** (HTML delta + my CSS delta + the +67 B `script.js` already on the branch),
i.e. what these pages would weigh if article-template were the only Wave 2 area shipped:

| page | vs baseline | | page | vs baseline |
|---|---|-|---|---|
| multi-account-landing-zone | **−467** | | serverless-rest-api | **−94** |
| realtime-data-pipeline | **−410** | | cicd-pipeline | **−81** |
| kubernetes-eks | **−396** | | serverless-contact-form | **+104** |
| multi-region-active-active | **−345** | | ec2-web-server | **+113** |
| infrastructure-as-code | **−175** | | static-website | **+189** |
| three-tier-web-app | **−135** | | | |

8 of 11 pages under baseline; the three shortest are +104…+189 B (≤ 0.33 %).

**Measured right now**, with the other three Wave 2 builders' concurrent `styles.css` work in the
tree, the pages are **+3,794 … +4,947 raw B over baseline** (multi-account 67,441 vs 63,647;
static-website 62,751 vs 57,804; kubernetes-eks 66,134 vs 61,772). The whole raw overage is
`styles.css`: **42,732 B against a 35,518 B baseline (+7,214)**, of which **+2,421 is mine** and
**+4,793 is the other sections**, still moving as I write.

### Bytes, gzip — the budget as production actually delivers it

The integrator landed `harness/weight.js` mid-round (gzip, the way Azure SWA serves text). That is
the real budget, and it changes the picture, so I re-measured against it:

```
node harness/weight.js   ->   WEIGHT: FAIL (19 pages over their gzip baseline)
OVER project-static-website.html             gzip 15625 vs 11000 (+4625)
OVER project-multi-account-landing-zone.html gzip 16497 vs 11889 (+4608)
styles.css: gzip 10254 (ref 6078)
```

Attribution, measured by swapping my section back out of the current `styles.css` and re-gzipping,
and by gzipping each page's HTML before and after `apply-article.js`:

| | gzip bytes |
|---|---|
| my `[article-template]` CSS section | **+521 B**, charged to **every page on the site** |
| my project-page HTML (the rail, the ids, minus the `<dl>` compaction) | **+138–140 B/page** |
| **my total footprint on a project page** | **+659 B** (≈ 14 % of that page's +4,6xx overage) |
| the other three Wave 2 areas' CSS, so far | **+3,726 B/page** |

**Correction to the round brief:** the "~3 KB/page headroom from the re-indent" does not exist in
gzip. `project-static-website.html` HTML was 3,893 gzip B at the baseline commit and 3,979 gzip B
*before* I touched it — the re-indent removed 2.9 KB of indentation, which gzip was already encoding
for almost nothing, while the Wave 1 shell markup added real tokens. Net headroom going into
Wave 2 was **−86 B**, not +3 KB. See §5.

---

## 4. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|------|-----------|
| `at-mal@390+0.png` | Breadcrumb → badge → h1 → overview → the key facts as three hairline definition rows (Difficulty / AWS Services / Cost). No card, reads like a spec sheet. |
| `at-mal@390+500.png` | The chip row sitting directly under the last key-fact rule, three chips visible with the third clipped at the edge (the scroll affordance), then the ruled `Prerequisites` h2. |
| `at-mal@390+2500.png` | Steps 4 and 5: number badge in the gutter beside the `h3`, bullet list running the **full** 342 px measure underneath. This is the "number must not eat measure" requirement, confirmed. |
| `at-mal@390+4000.png` | Tips callout — accent left rule, tint, accent bullet markers, no emoji — and the `Code Examples` h2 with an untouched code block below it. |
| `at-mal@390+pagination.png` | The two pagination cards ("← Previous Project" / "Back to All Projects") stacked above the footer. |
| `at-mal@390+end.png` | End of page: nothing stray after the pagination (the rail is `order`-ed away from the end). |
| `at-mal@1440+0.png` | Two-column article: 68 ch body centred, three-column key-facts strip with vertical hairlines, rail in column 2 with "On this page" + seven links. **No void above the article.** |
| `at-mal@1440+600.png` / `at-mal@1440+600b.png` | Rail stuck at header + 24 px while the body scrolls (before/after darkening its hairline to `--line-2`). Diagram and prerequisites untouched. |
| `at-mal@1440+2000.png` | Desktop steps: badge in the gutter, body indented under the title, hairline between steps. |
| `at-sw@390+0.png` / `at-sw@390+600.png` | Shortest page at 390: same key-facts strip, chip row, ruled sections, diagram legible. |
| `at-sw@768+0.png` | 768: three-column key-facts strip, six of seven chips fit on one line with the seventh clipped. |

### Behaviour checks (Playwright, scripted, not eyeballed)

```
aside block height (px): 32   chips 7   ol scrollWidth/clientWidth 828/342
last chip after focus(): {"left":239,"right":366,"inView":true}     -> keyboard scroll-into-view works
click .guide-aside a[href="#tips"] @390  -> h2#tips top = 72px  (header 56 + 16)
click .guide-aside a[href="#tips"] @1440 -> h2#tips top = 80px  (header 64 + 16)
:target #tips -> H2, border-top-color rgb(194, 65, 12)            -> CSS-only current-section rule
console errors: 0
node harness/apply-article.js --check -> 0/11 pages would change  (idempotent)
```

---

## 5. Needs the integrator / a decision

1. **`styles.css` is over-subscribed and the per-page byte budget cannot hold — `weight.js` says
   `WEIGHT: FAIL (19 pages)`, including the seven pages my area never touches.** The shared sheet is
   +4,176 gzip B over its reference on every page; my section is **+521 gzip B** of that, the other
   three Wave 2 areas are +3,726 (and still moving), and my project-page HTML adds +139. There is no
   pre-existing headroom to spend: the re-indent looked like ~3 KB/page but is worth **−86 gzip B**
   (see §3). So *any* Wave 2 area that adds CSS puts every page over, and no amount of trimming
   inside one area fixes it. Options, none of which are mine to take: (a) minify `styles.css` on
   deploy — it is hand-written, comment-heavy and 42.7 KB raw, and a conservative minify should
   recover most of the 4.2 KB gzip growth; (b) re-baseline the weight budget for the facelift,
   since Wave 2 deliberately adds four component systems; (c) ask each area to cut. I trimmed my
   section from 6,451 B to 5,765 B raw for this reason and stopped where further cuts would have
   removed the documentation.
2. **Focus order below 64em** — see §2.1. One-line change in `apply-article.js` if the panel wants
   the rail first in the DOM instead.
3. Nothing needs a content approval. `docs/APPROVALS.json` is untouched and still empty.

---

## 6. How to reproduce

```
node harness/serve.js                                   # running on :4173
node harness/apply-article.js --check                   # -> 0/11 pages would change
node harness/snap.js --label article-r1 --force --pages project-multi-account-landing-zone.html,project-static-website.html,project-kubernetes-eks.html
node harness/lh.js   --label article-r1 --force --pages project-multi-account-landing-zone.html
node harness/integrity.js compare --base baseline-2026-09-13
node harness/weight.js
node harness/peek.js project-multi-account-landing-zone.html 390 2500
```

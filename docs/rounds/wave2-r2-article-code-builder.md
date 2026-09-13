# Wave 2 · Round 2 builder — article-template + code-and-diagrams

Date: 2026-09-13 · Branch: `facelift` · Label for all harness output: **`w2r2a`**
Integrity base: `baseline-2026-09-13` · Both areas live on the same 11 `project-*.html`, so one
builder took them to avoid write races.

Files changed (committed by name): `styles.css` (sections `[article-template]` and
`[code-and-diagrams]` only), `script.js`, `harness/apply-article.js`, **new**
`harness/apply-code.js`, and the 11 `project-*.html`. Nothing else — no other styles.css section,
no other page, no `docs/` except this report, no `.github`, no `staticwebapp.config.json`, no
`images/`.

---

## 0. Assumptions I took (stated, not asked)

1. **`harness/apply-article.js` was a silent no-op and I fixed it first.** Its matcher was
   `/<main id="main">/`; the shell r2 writes `<main id="main" class="guide-page" tabindex="-1">`,
   so `--check` printed `0/11` because nothing matched. Now `/<main\b[^>]*>/`. Every number below
   is from the applier actually running.
2. **`var(--measure)` (68ch) cannot be the cap once `.guide-section` is uncapped.** `ch` resolves
   against the *child's* font size, so an `h2` at 26px got a 884 px cap and ruled wider than the
   body. Every measure cap inside `.project-guide` is now **`39rem` (624 px ≈ 68ch at the 17px
   body size)**, which is what restores one rule width per viewport. `--measure` is untouched.
3. **Code item 4: I reduced the six node hues to three and did *not* add the `::before` role
   prefix.** The prefix would have asserted a role per node, and the existing classes are only
   approximate (`primary` is on Global Accelerator, ALB Ingress *and* the Management Account) — a
   visible "COMPUTE ·" on those would be wrong in a way a colour is not. Documented in §3.4.
4. **Code item 6 "16 px veil": I used 2 rem (32 px) per edge, not 16 px.** The reader's r1 evidence
   is that the existing 1.6 rem (25.6 px) veil was too quiet; 16 px would have been narrower still.
   The change that matters is the alpha (`#e6edf340` → `#e6edf370`) plus the mirrored left edge.
5. **The multi-region pair is 2 columns at *every* width** (request wording), so 1440 changes too:
   Region A | Region B side by side with the `↔ Replication` marker centred on the row beneath,
   spanning both columns. One layout at 320/390/768/1440 instead of two.
6. **`.code-inline` deleted.** Styled, `grep -c code-inline *.html` = 0, flagged by both the CD and
   M&S as untested dead surface. −190 raw B; it paid for part of the highlighter.
7. **`.code-block` margin 24 → 32 px** (M&S code #1: an Auto ad in the pre-code seam landed 33 px
   above the 44 px Copy target; now 41 px). Zero bytes.
8. **`.arch-note` lost `text-align: center`** (CD code nit): with diagrams now 1-up at 390 a centred
   caption under left-aligned content read as a stray.

---

## 1. article-template — request items

| # | Item | Done | How | Evidence |
|---|---|---|---|---|
| 1 | Register at ≥64em + widen the figure track | **yes** | Shell r2's `space-between` pair replaced by `grid-template-columns: minmax(0, 1fr) var(--rail); column-gap: var(--sp-7)`. `.guide-section` loses its cap at 64em; `.guide-section > :not(.code-block, .architecture-diagram)` caps text at 39rem, so figures take the whole article column. | **All 11 pages at 1440**: `.page-header h1`.left = `.guide-overview h2`.left = **152**, `.guide-section`.left = 152. Prose/rules right edge **776** (one width, every element). `.architecture-diagram` / `.code-block` = **840 px wide, right edge 992**; rail `nav` left edge **1040** — the figures never reach it. `w2r2a-mal@1440+0.png`, `w2r2a-mal@1440+600.png`, `w2r2a-eks-code@1440.png` |
| 2 | Chip row at 390 | **yes** | Right-edge veil (`.guide-aside nav::after`, 32 px `--paper`→transparent, `content: none` at 64em); `.guide-aside-title` visible at every width as a small-caps eyebrow (`font-variant-caps`, **no `text-transform`** — inside `data-ui` either way); chips `min-height: 44px` via padding, radius `999px` → `var(--radius)` (CD nit: nothing else on the site is a full pill). | **11/11 pages, 390 and 768: `partiallyVisibleChips = 1`, chip height 44 px, title visible, veil 32 px.** The row now sits at docY **348–417** (was 843), i.e. on the first screen. `w2r2a-mal@390+0.png`, `w2r2a-mal@768+400.png` |
| 3 | Focus order | **yes** | `apply-article.js` step 4 now inserts the rail as the **first** child of `.project-guide`; the three `order` declarations are deleted. Desktop placement is still the explicit `grid-column: 2; grid-row: 1 / -1`. | Tab order at 390: 1 skip · 2 brand · 3 nav-toggle · 4–5 breadcrumb · **6–12 the seven rail chips** · then content. (r1: chips were 18–24.) |
| 4 | Step anchors | **yes** | `apply-article.js` step 5: `<h3 id="step-1">` … `step-6`, and the step number becomes `<a href="#step-N">` covering a 44 px circle (`position: absolute; inset: -9px`). Rail still lists h2s only. | `stepIds = step-1…step-6` on **11/11 pages at both widths**; `#step-5` lands with `scroll-padding-top` already in place. `w2r2a-mal@390+1900.png` |
| 5 | Current-section indicator | **yes** | **331 B** self-contained snippet in `script.js` (budget 350). `IntersectionObserver` with `rootMargin: '-120px 0px 99999px'` — the bottom-expanded root means *every* heading crossing the 120 px reading line fires an event, so a jump (chip click, restore, flick) can never strand it; the callback recomputes the current link from geometry. Sets `aria-current="location"`. Gated on `innerWidth > 1023` (64em is always 1024 CSS px). Styled with the accent rule: 2 px accent left bar on the rail hairline + `--accent-strong` + 700. | 1440, jumps `0→400→700→1000→1600→3000→3600→5200→8300` and back: Project Overview → Project Overview → Prerequisites → Architecture → Step-by-Step → Tips → Code Examples → Code Examples → What You'll Learn → … → Project Overview. Wheel scroll identical. **Exactly one `[aria-current]` at all times; 0 at 390.** 0 console errors. |
| 6 | Pagination | **yes** | Card shell gone (no border/background/radius): ruled two-up, a hairline between the cells at 390, two cells with the last right-aligned at ≥40em. Direction cue is an **eyebrow in `::before`** (`PREVIOUS` / `NEXT` / `ALL PROJECTS`), so it is pseudo-content and not in innerText. The class comes from the **href** in `apply-article.js` (`projects.html` → `guide-nav-index`), never from position — so page 1's "← Back to Projects" is labelled `ALL PROJECTS`, not "Previous". | `w2r2a-mal@390+9750.png`. `INTEGRITY: PASS` confirms the pseudo-content is invisible to the gate. |
| 7 | Key-facts dt column | **yes** | `.guide-meta` is the grid (`fit-content(30%) minmax(0,1fr)`) and `.meta-item` is `subgrid`, so the dt shrinks to content **and** all three rows still share one column (a per-row `fit-content` was ragged — caught in the first screenshot pass). ≥48em unchanged (`grid-column: auto` added so the 3-up strip is not spanned). | 390: `dd` left edges **129, 129, 129** (was a fixed 116 px label eating 34 % of 342). 1440: 152, 377, 585 — the 3-up strip is unchanged. `w2r2a-mal@390+0.png` |
| 8 | Ad-well width (verify) | **verified, better than asked** | Shell r2's `width: 100%` plus my 1fr column. | A real `.ad-well` injected at all three AD_PLAN positions: **342 px at 390, 840 px at 1440** (r1: 123 px at both), reserved height 339 px. So M&S r1 #1 *and* #2 are both resolved — the desktop article well is no longer capped at 623 px, which puts 728×90 in reach. `#architecture` is still absent on `project-infrastructure-as-code.html` (`grep -c` = 0) — **note only**, AD_PLAN anchors on section order. |

---

## 2. code-and-diagrams — request items

| # | Item | Done | How | Evidence |
|---|---|---|---|---|
| 1 | Syntax highlighting | **yes** | New `harness/apply-code.js`, build-time, idempotent, `--check`. **43 blocks, 1,132 spans, 8 grammars.** Design in §3. | `w2r2a-mal@390+4560.png` (JSON), `w2r2a-mal@390+8890.png` (YAML), `w2r2a-sra-tall@390.png` (Python), `w2r2a-eks-code@1440.png` (YAML at 1440). `INTEGRITY: PASS` — the `pre` field is byte-identical on all 21 pages. |
| 2 | Multi-region topology — PAGE | **yes** | The one `.arch-row` holding the two regions carries `arch-pair`: a **non-wrapping 2-column grid at every width**, with the third child (`↔ Replication`) explicitly at `grid-area: 2 / 1 / 3 / 3; justify-self: center` so the marker always sits between/under the two regions and never wraps out of the pair. | Measured children at **320**: A `[37,1592,w119]`, B `[164,1592,w119]` — same row; Replication `[72,1761,w176]` centred beneath. Same shape at 390/768/1440. `w2r2a-mrgn-diag@320.png`, `w2r2a-mrgn-diag@390.png`, `w2r2a-mrgn-diag@1440.png`. Diagram `scrollWidth − clientWidth = 0` at all four widths. |
| 3 | Copy reachability on tall blocks | **yes** | `.code-header { position: sticky; top: var(--header-h); z-index: 1 }` **plus `.code-block { overflow: hidden → clip }`** — `hidden` makes the block a scrollport, which silently kills sticky; `clip` does not, and still clips the radius. | Scrolled **600 px into the tallest block** on four pages at 390: header pinned at viewport y=**56**, Copy at y=64, 54×44, fully on screen. `serverless-rest-api` 1,581 px · `infrastructure-as-code` 1,413 px · `kubernetes-eks` 1,385 px · `landing-zone` 1,049 px. `w2r2a-sra-tall@390.png`, `w2r2a-mal@390+8890.png` |
| 4 | Node hues | **yes (three roles, no prefix)** | Six `--role` values → three: **runs-or-routes** `#7ad3a4` (user + primary + compute), **stores** `#7fb0f0` (storage + database), **guards** `#f08b8b` (security). The two indistinguishable hues (`#f58ab8`/`#f08b8b`) are gone and **the brand accent no longer doubles as a node role** — inside a diagram it now means "flow" only. Class names in the markup are untouched. See §0.3 for why no `::before` legend. | `w2r2a-mal@390+1200.png`, `w2r2a-mal@1440+600.png` |
| 5 | Code header hierarchy | **yes** | `.code-label` leads: `--on-navy` (ink), 13 px mono, weight 650 (uppercase **kept**, per the gate rule). `.code-lang` demoted to a quiet outline chip: orange tint dropped, `1px solid var(--navy-line)`, `--on-navy-2` — **7.77 : 1** on `--code-head`. Copy is last in the bar (appended by `script.js`) and is now the loudest control. | `w2r2a-eks-code@1440.png`, `w2r2a-mal@390+4560.png` |
| 6 | Scroll veil, both edges | **yes** | Four background layers on `pre`: two opaque `local` patches (right + left) over two fixed veils (right + left), **2 rem** wide, alpha `40`→`70`. The `local` patches ride the content, so each veil only appears on an edge that really has more to show, and both vanish when the block does not overflow. | `w2r2a-mal@390+4560.png` (right veil present, left covered at `scrollLeft: 0`), `w2r2a-eks-code@1440.png` (no overflow → no veil at all). |
| 7 | Detail 12→13 px, node name wrapping | **yes** | `.arch-component-detail` `.75rem` → `var(--fs--1)` (13 px). `.arch-row > :not(.arch-arrow) { min-width: min(100%, 11rem) }` as specified, plus `overflow-wrap: break-word` on `.arch-component-name` (at 320 "DynamoDB" was crossing its node border). | 390 heights: 379–548 px (r1: 374–504); worst case **569 px at 320**, still 0.67 of an 844 px viewport, so every diagram still fits one phone screen. `scrollWidth − clientWidth = 0` on all 11 pages at 320/390/768/1440; no page overflow anywhere. |

---

## 3. The highlighter — design

`harness/apply-code.js` · apply / `--check` · idempotent · no runtime cost (nothing ships but the
spans, and the six classes were already in `[code-and-diagrams]`, so **styles.css gained 0 bytes**
for this item).

### 3.1 The two hard invariants and how they are enforced

1. **`pre.textContent` byte-identical.** Only `<span …>` / `</span>` are inserted; no source
   character is added, removed, reordered or re-cased. Every block is self-checked before writing:
   `strip(output) !== plainInput` throws `TEXT DRIFT … refusing to write`. Confirmed twice —
   offline (strip the spans from the written file, compare to a pre-change copy: **identical**) and
   by the gate (`pre` is `p.textContent`, and `INTEGRITY: PASS`).
2. **Entities are atomic.** The tokenizer never sees raw entity text: `atomize()` builds a working
   string in which each `&lt; &gt; &amp; &quot; &#NN;` is **one opaque `` placeholder**, with
   a source-offset map. A token therefore cannot begin or end inside an entity. (Only one block in
   the repo contains entities — the nginx heredoc in `project-ec2-web-server.html`; its
   `&lt;!DOCTYPE html&gt;` lines come through untouched.)

**Idempotency**: every previously written span is stripped (to a fixed point) before re-tokenizing,
so a second run is a no-op — `--check` reports `0/11 pages would change`.

### 3.2 The scanner

Single left-to-right pass, first match wins, so a `#` inside a string or a keyword inside a comment
can never be re-tokenized. Ordering: block comment → `//` comment → `#` comment → YAML key →
string → `$var` / `${var}` → `--flag` → bare run.

The "bare run" is the conservative part. A run is `[A-Za-z0-9_$\-.:/@*]+` started only at a
word character, and it is classified **as a whole**: `^\d+(\.\d+)?$` → number, exact keyword match →
keyword, otherwise plain. That is what keeps `us-east-1`, `t3.micro`, `0.0.0.0/0`,
`arn:aws:iam::123456789:role/X` and `aws-cdk-lib/aws-ec2` completely unhighlighted instead of
colouring the digits inside them. Dotted member access is split into segments **only** for
Python/JS/TS (where `this.vpc` and `json.dumps(` matter); for YAML/nginx/HCL the run stays whole,
so `index.html` does not light up the nginx `index` directive.

Strings never span a line (except Python triple quotes); an unterminated quote is left plain and
scanning continues on the same line, so a stray apostrophe can never swallow a block.

### 3.3 Token classes per language

| `.code-lang` | blocks | comment | string | number | keyword | variable | function |
|---|---:|---|---|---|---|---|---|
| BASH | 14 | `#` at line start or after whitespace | `'…'` `"…"` | bare integers/decimals only | `aws if then else elif fi for while do done case esac export echo return function` | `--long-flags`, `$VAR`, `${VAR}` | — |
| YAML | 13 | `#` | `'…'` `"…"` | ✓ | `true false null yes no` | **keys** (line head, after an optional `- `) | — |
| JSON | 8 | — | values | ✓ | `true false null` | **keys** (a string followed by `:`) | — |
| PYTHON | 4 | `#` | `'…'` `"…"` `'''…'''` `"""…"""` | ✓ | `def return import from if elif else for in while try except finally with as lambda class pass raise not and or is None True False` | — | `name(` |
| JAVASCRIPT / TYPESCRIPT | 2 | `//` `/* */` | `'…'` `"…"` `` `…` `` | ✓ | `const let var function return await async import export from as new class extends if else for of while try catch finally throw typeof instanceof this default interface type public readonly` | — | `name(` |
| HCL / TERRAFORM | 1 | `#` `//` `/* */` | `"…"` | ✓ | `resource variable output provider module data locals terraform backend true false null` | `${…}` | — |
| NGINX | 1 | `#` | `'…'` `"…"` | ✓ | `server location listen server_name root index include upstream http events return try_files error_page add_header proxy_pass proxy_set_header gzip gzip_types ssl_certificate ssl_certificate_key rewrite` | `$var` | — |

Two deviations from the request, both deliberate: **`--flags` get `.variable`, not `.keyword`** (a
bash line is mostly flags; all-blue was a wall, and the muted `#bcd6f0` separates the flag from the
`aws` verb); and an unknown `.code-lang` is **skipped whole** rather than guessed (none occur —
all 43 blocks matched a grammar, `skipped` was empty).

Colours are the six rules that were already in the sheet, all measured on `--code-bg #11181f`:
comment `#9aa7b0` **7.25 : 1**, keyword `#8ab4f8`, string `#a5d6a7`, function `#f0d78c`,
variable `#bcd6f0`, number `#d6c3f5` — the lowest is the comment at 7.25 : 1, well over 4.5 : 1.

### 3.4 Why no diagram legend

CD code #3 asked for "two or three roles … with a one-line legend". Three roles: done. The legend
is **not** done, because the only forms available were new visible content (blocked) or a
`::before` role prefix on every detail line — and the existing role classes are approximate enough
(`primary` covers Global Accelerator, ALB Ingress and the Management Account) that a printed role
word would state something false. A wrong label is worse than an undecoded colour. If the panel
wants the legend, it needs a content approval for one line per diagram.

---

## 4. Weight

Measured against **HEAD (`2016ed4`)**, i.e. only my changes; the other two Wave-2 r2 builders had
already landed.

| Artefact | raw | gzip |
|---|---|---|
| `styles.css` `[article-template]` | 6,292 → 6,550 (**+258**) | 1,694 → 1,808 (**+114**) |
| `styles.css` `[code-and-diagrams]` | 5,187 → 5,161 (**−26**) | 1,745 → 1,748 (**+3**) |
| `styles.css` whole file | 42,450 → 42,682 (+232) | 9,301 → **9,418** (**+117**) |
| `script.js` | 3,670 → **4,080** (limit 4,300) | 1,339 → 1,576 (**+237**) |
| project HTML, per page | +1,429 … +4,554 | **+119 … +313** (avg +219) |

**Highlighter budget (≤ 700 B gzip/page): met with room.** Measured in isolation before the other
markup landed: **+75 … +264 B gzip per page, average +171** (static-website 75, ec2 109,
three-tier 121, cicd 140, multi-region 159, landing-zone 174, contact-form 192, rest-api 205,
eks 211, iac 234, realtime 264). The remaining ~+48 B/page of HTML is the rail move, the six step
anchors and the pagination classes.

Total cost of this round on a project page: **+473 … +667 B gzip** (HTML + CSS + JS).
`node harness/weight.js` still prints `WEIGHT: FAIL (19 pages)` — the wave-wide overage that the
CD's r1 report records as under consolidation and explicitly does not score. Project pages are now
+4,305 … +4,488 vs the `f1ec399` reference.

---

## 5. Gate results — all fresh, after the last edit

```
node harness/snap.js --label w2r2a --force --pages <4 project pages>   -> 12 captures
node harness/lh.js   --label w2r2a --force --pages project-multi-account-landing-zone.html
node harness/integrity.js compare --base baseline-2026-09-13
node harness/weight.js
node harness/apply-shell.js   --check   -> 0/19 pages would change
node harness/apply-article.js --check   -> 0/11 pages would change
node harness/apply-code.js    --check   -> 0/11 pages would change
```

| Check | Result | Budget |
|---|---|---|
| Console errors / page errors | **0 / 0** (12 runs) | 0 |
| Failed requests | **0** | — |
| axe serious + critical | **0** | 0 |
| Horizontal overflow @ 390/768/1440 | **none** | none |
| Lab CLS | 0 at 390/768; **0.0013–0.0014** at 1440 (the rail's `aria-current` weight change, one frame after load) | ≤ 0.05 |
| Lighthouse mobile, `project-multi-account-landing-zone.html` | **perf 100 · a11y 100 · BP 100 · SEO 100** · LCP 1.65 s · CLS 0 · TBT 0 ms | 95 / 100 / 100 / 100 |
| Integrity | **`INTEGRITY: PASS` (21 pages identical, 0 approvals applied)** | PASS |
| Weight | `WEIGHT: FAIL (19 pages)` — wave-wide, §4 | — |

`bf-cache` is the only binary Lighthouse failure; INVENTORY says ignore it locally.

---

## 6. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|---|---|
| `w2r2a-mal@390+0.png` | Arrival at 390. `ON THIS PAGE` eyebrow, three 44 px chips with **"Architecture" cut mid-word** under the fade — the row is on the first screen now. Key facts with the dt shrunk and all three values on one aligned column. |
| `w2r2a-mal@390+400.png` | The chip row leaving the top, then the overview and the three definition rows; `Difficulty / AWS Services / Cost` values all start at x=129. |
| `w2r2a-mal@390+1200.png` | Landing-zone diagram fully 1-up: no node name wraps, three hues only (green runs / blue stores / rose guards), 13 px detail lines, left-aligned note. |
| `w2r2a-mal@390+1900.png` | Steps 1–3: the number is centred in its circle again (the 44 px anchor is absolutely positioned, not alignment-clamped). |
| `w2r2a-mal@390+4560.png` | `DENY-REGIONS-SCP.JSON`: keys blue, strings green; filename leads in ink, `JSON` demoted to an outline chip, Copy the loudest control; right veil on, left covered. |
| `w2r2a-mal@390+8890.png` | 600 px inside the 1,049 px YAML block — the sticky header and Copy are still on screen; comment italic grey, numbers purple. |
| `w2r2a-mal@390+9750.png` | Pagination as a ruled two-up with `PREVIOUS` / `ALL PROJECTS` eyebrows. No cards, no empty boxes. |
| `w2r2a-mal@768+400.png` | 768: one chip clipped at the right edge; every rule 24→648. |
| `w2r2a-mal@1440+0.png` | One left edge at 152 for breadcrumb, badge, h1, subtitle, overview, key facts and prerequisites; rail at 1040 with `Project Overview` carrying the accent bar. |
| `w2r2a-mal@1440+600.png` | The diagram at **840 px**, breaking the 624 px measure, ending at 992 — 48 px clear of the rail. |
| `w2r2a-mal@1440+3430.png` | First code block at 840 px on the same left edge. |
| `w2r2a-mrgn-diag@390.png` | **The r1 defect is gone**: Region A and Region B side by side, `↔ Replication` centred beneath them. |
| `w2r2a-mrgn-diag@320.png` | Same shape at 320 — labels wrap, nodes shrink, nothing leaves the pair and nothing overflows a node. |
| `w2r2a-mrgn-diag@1440.png` | The same one layout at desktop; left-aligned note. |
| `w2r2a-sra-tall@390.png` | 600 px into the 1,581 px `LAMBDA_FUNCTION.PY` block: Copy visible, Python keywords/strings/functions/numbers all distinct. |
| `w2r2a-eks-code@1440.png` | `DEPLOYMENT.YAML` at 1440 in the 840 px track, no overflow and therefore no veil; rail marks `Code Examples`. |

Scripted probes: `harness/out/w2r2a-measure.js` (git-ignored) — register/figure widths on all 11
pages at 1440, chip geometry on all 11 at 390 and 768, tab order, `aria-current` under both jumps
and wheel scroll, sticky-header/Copy geometry, diagram heights and pair geometry at
320/390/768/1440, and an injected `.ad-well` at the three AD_PLAN positions.

---

## 7. For the integrator / next round

1. **`harness/apply-code.js` is new and must run before any content edit to a `<pre>`.** It is
   idempotent and self-checking; if it ever throws `TEXT DRIFT`, nothing is written.
2. **`harness/apply-article.js` now emits the rail first and step ids/anchors.** Its `<main>`
   matcher is fixed; `--check` is truthful again.
3. **`39rem` replaces `var(--measure)` inside `.project-guide`** for the reason in §0.2. If the body
   font size ever changes, that constant moves with it.
4. **`.code-block` is `overflow: clip`.** Do not put it back to `hidden` — that silently breaks the
   sticky code header (and the Copy fix with it).
5. **The desktop article column is now 840 px, not 623.** `.ad-well` at the three AD_PLAN positions
   measures 342 / 840; the M&S r1 cap finding is resolved. A 728×90 now fits; 970×250 does not.
6. Still open and not mine: `#architecture` missing on `project-infrastructure-as-code.html`
   (AD_PLAN anchors on section order), the wave-wide `WEIGHT: FAIL`, `resources.html` LCP, the
   "Learn More" SEO 92, and a diagram legend (needs a content approval — §3.4).

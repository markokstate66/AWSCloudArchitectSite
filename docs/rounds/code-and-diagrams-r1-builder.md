# code-and-diagrams builder — round 1

Date: 2026-09-13 · Branch: `facelift` · Area: **code-and-diagrams**
Harness label: `code-r1` · Integrity base: `baseline-2026-09-13` · Peek prefix: `cd2-*`

---

## 1. What changed

| File | Change |
|------|--------|
| `styles.css` | Only the `/* ==== [code-and-diagrams] ==== */` section. 4,069 B → **4,902 B** (+833 B raw, **+327 B gzip**). No other section touched. |
| `script.js` | Only the copy-button click handler: the label change now also swaps `aria-label` (`Copy code` → `Code copied to clipboard` → back), and the reset delay is 1,500 → 1,800 ms. +106 B raw / **+39 B gzip**. |
| project pages | **No markup changed.** `harness/apply-code.js` was not needed and does not exist. Everything is CSS. |

`.code-label` keeps `text-transform: uppercase`, `.code-lang` keeps it, `.arch-group-label` keeps it
(see §3.1). No `display: none`, no new visible text, no character inside any `<pre>` touched.

### Code blocks

- **Header**: `.code-header` unchanged in structure (file label · language chip · injected Copy).
  The Copy button is now a filled-quiet control (`#ffffff0d` on the `--code-head` band,
  `--radius-sm`) instead of a transparent 26 px chip, and `@media (pointer: coarse)` gives it
  `min-width/min-height: 44px`. Measured: **54 × 44 at 390 (touch), 54 × 33 at 1440** — chunky
  where fingers are, compact where a mouse is.
- **Type**: `.code-block code` is `.875rem/1.55` (**14 px / 21.7 px measured**) everywhere,
  replacing 13 px / 1.65. Wave 1 flagged 1.65 as deliberately loose and mine to tune; 1.55 at 14 px
  is the Stripe Docs register and cost no extra block height at 390 (blocks grew ~16 px each from
  the bigger glyphs, not from leading).
- **Horizontal scroll stays inside the block**: `overflow-x: auto` plus
  `overscroll-behavior-x: contain` (so a swipe at the end of a line does not chain to the page or
  the browser back-gesture). Verified `documentElement.scrollWidth - clientWidth === 0` on **all 11
  project pages at 390 / 768 / 1440** (33 measurements).
- **Scroll affordance, CSS-only, two background layers** (§3.2 explains the mechanism):
  a light veil at the right edge that is present only while there is more code to the right.
- `tab-size: 2` is set. **It is currently a no-op**: I checked all 43 `<pre>` blocks in the
  baseline snapshot and **none contains a tab character** — every sample is space-indented. Kept
  for correctness if a tabbed sample is ever added.
- `pre` keeps `tabindex="0"` from `script.js` (the 42 serious `scrollable-region-focusable` nodes).
  Focus ring on both `pre` and the Copy button measured as `rgb(255, 153, 0) solid 2px`.
- Syntax colours unchanged — they were already **7.3 : 1 – 12.6 : 1** on `--code-bg` (measured;
  the brief asked for ≥ 4.5). Code text `#e6edf3` on `#11181f` = **15.1 : 1** (brief: ≥ 7).

### `.code-inline`

`color: var(--accent-strong)` (orange-brown) → `var(--ink)` on the `--paper-2` tint = **15.1 : 1**,
`font-size: .875em` → `.92em`. **Nothing on the site uses this class yet** (`grep -c code-inline
*.html` = 0 matches), so it cannot be screenshotted; it is ready for article-template if inline
code lands in prose.

### Architecture diagrams

Complete redesign of the layout model, no markup change:

- `.arch-component` is now a **two-column grid** (`auto minmax(0,1fr)`) — the emoji icon spans both
  rows on the left, name on top, detail underneath, left-aligned. It was a centred three-line
  stack. `align-items: center` + `align-content: center` keep the icon/name/detail block tight and
  vertically centred even when flex stretches the node to a taller sibling's height.
- **Emoji icons are content** (they are in the frozen text snapshot) so they stay, but at
  `font-size: 1rem` (was 1.25rem) with `filter: grayscale(1); opacity: .7`. They read as a quiet
  glyph in the node's gutter instead of the loudest thing in the diagram. `innerText` unaffected.
- `.arch-row` is **always a wrapping row** with `flex: 1 1 7.5rem` on non-arrow children, tuned so
  **two nodes fit at 390** inside a group (measured budget: 290 px of row width inside a group at
  390; 120 + 8 + 120 = 248, or 120 + arrow + 120 = 274 when a row carries an arrow).
- `.arch-flow` is a **sequence**: column below 40em with `.arch-flow > .arch-arrow` rotated 90°
  (so `→` renders as ↓ and the one `←` on `project-ec2-web-server` renders as ↑ — correct for a
  top-to-bottom column), row from 40em with the rotation removed. **The glyph text is never
  swapped**, only transformed. Arrows inside `.arch-row` are never rotated, because that row is a
  row at every width.
- **The stray left-aligned ↓** (a `.arch-arrow-down` that is a direct child of
  `.architecture-diagram`, outside any flex container — visible in the 1440 before-shot) is fixed
  by `text-align: center` on the arrow rule plus `align-self: center` for the flex case.
- `.arch-group` is a **bordered region**: solid hairline (was dashed) + a `#ffffff08` lift, with the
  label left-aligned at `.75rem/700` and `font-variant-caps: all-small-caps` (§3.1).
- Role colours unchanged in value but moved to a `--role` custom property
  (`border-left: 3px solid var(--role, var(--on-navy-2))`), which is both shorter and lets a node
  tint anything else later. All six are non-text borders well above the 3 : 1 non-text threshold on
  `--navy-2`.
- `overflow-x: auto` is kept on `.architecture-diagram` **as a safety net only**. Measured
  `scrollWidth - clientWidth === 0` on all 11 pages × 390 / 768 / 1440, so no diagram actually
  scrolls and no scroll affordance is needed there.

---

## 2. Diagram heights at 390 (`document.querySelector('.architecture-diagram').offsetHeight`)

| Page | Before | After | Change |
|------|-------:|------:|-------:|
| `project-multi-account-landing-zone.html` | 896 | **429** | −52 % |
| `project-three-tier-web-app.html` | 800 | **431** | −46 % |
| `project-kubernetes-eks.html` | 826 | **386** | −53 % |
| `project-cicd-pipeline.html` | 706 | **459** | −35 % |

All four now fit in one 390 × 844 viewport with the header. The other seven after-values at 390:
ec2-web-server 374, infrastructure-as-code 438, multi-region-active-active 504,
realtime-data-pipeline 492, serverless-contact-form 374, serverless-rest-api 459,
static-website 374. At 1440 the same diagrams are 178–332 px.

(The "2,000–3,000 px towers" in the brief were the pre-Wave-1 state; Wave 1's stacking rules had
already brought them to 706–896 at 390. The numbers above are measured against the current tree.)

---

## 3. Decisions and assumptions

### 3.1 `.arch-group-label` keeps `text-transform: uppercase` — a deliberate deviation

The brief says to use `font-variant-caps` **instead of** `text-transform` for the group label.
That is right for a label that is lowercase in the baseline, but `.arch-group-label` already had
`text-transform: uppercase` in the baseline stylesheet, so the frozen text snapshot contains
`"… ↓ SECURITY OU 🛡 Log Archive WORKLOADS OU …"` (verified in
`harness/baseline/baseline-2026-09-13.json`). **Removing** the transform would turn that back into
`Security OU` and fail the content gate on three pages — the same trap in the other direction.

Resolution: keep `text-transform: uppercase` **and add** `font-variant-caps: all-small-caps`. The
transform still produces the uppercase string the gate expects; the font feature renders those
capitals as small caps, which is the typographic result the brief wanted. `innerText` is unaffected
by font features. `INTEGRITY: PASS` confirms it.

### 3.2 The scroll affordance is two background layers, not a pseudo-element

An `::after` fade would always be visible, including on the ~half of the blocks that do not
overflow. Instead:

```css
background: linear-gradient(#11181f,#11181f) right/1.6rem 100% no-repeat local,
  linear-gradient(270deg,#e6edf340,transparent) right/1.6rem 100% no-repeat;
```

Layer 1 is a solid `--code-bg` block attached `local`, so it is pinned to the **right edge of the
scrollable content**; layer 2 is the light veil attached `scroll`, pinned to the **right edge of
the box**. When there is nothing to scroll (or you are scrolled to the end) layer 1 sits exactly
over layer 2 and hides it. Background layers paint behind text, so the opaque cover can never
obscure code.

I got this wrong on the first attempt (a *gradient* cover only reached full opacity over the right
42 %, so a band of veil leaked through at all times) and caught it by sampling the rendered pixel
row rather than by eye. Measured middle-row pixels of the right-hand 40 px of a `<pre>` at 390:

| State | Right-edge pixels |
|-------|-------------------|
| block with no overflow | `17,24,31` flat all the way to the border |
| overflowing, `scrollLeft = 0` | ramps `17,24,31` → `68,75,82` over the last ~26 px |
| overflowing, scrolled to the end | `17,24,31` flat again |

### 3.3 Other calls

1. **No markup changes, so no `harness/apply-code.js`.** Every goal was reachable in CSS; the brief
   preferred that, and it keeps me out of the way of article-template's `apply-article.js`, which
   is rewriting `<main>` on the same eleven files this wave.
2. **One code font size at every width** (14 px). A desktop bump to 15 px cost ~55 B for a change
   nobody asked for; Stripe Docs runs 13–14 px at every width.
3. **`.arch-row` groups stay 2-up at 390 rather than 1-up.** On `project-multi-region-active-active`
   that row is `[Region A group][Replication node][Region B group]`, so at 390 it wraps as
   `A + Replication` then `B`, which pairs the wrong things. Forcing groups full-width at 390 fixes
   that one page but costs ~130 px of height on the landing-zone OU row, which is the diagram the
   brief singles out. I kept 2-up; the multi-region result is still readable (504 px, was a
   full-height tower) and the full-height orange rule on "Replication" reads acceptably as a
   connector between the regions. Flagged for the panel, not fixed.
4. **`.code-copy` grows on `pointer: coarse`, not on a width query.** A 44 px button on a 1440
   desktop header is oversized; the touch target rule is about input modality, not viewport.
5. **`aria-label` is now synced with the button text.** With the old code a screen-reader user
   heard "Copy code" before and after copying — the only feedback was visual.

---

## 4. Verification

Server: `http://127.0.0.1:4173`. All numbers below are from runs made after the final edit.

### `node harness/snap.js --label code-r1 --pages <4 pages>` (4 pages × 390/768/1440)

| Check | Result |
|-------|--------|
| Console errors / page errors / failed requests | **0 / 0 / 0** on all 12 runs |
| axe serious + critical | **0** |
| axe violations of any impact | **0** |
| Horizontal page overflow | **none** at 390 / 768 / 1440 |
| Lab CLS | **0** on every run |
| LCP | 100–128 ms |

Separately, an 11-page × 3-width probe: `documentElement.scrollWidth − clientWidth = 0` and
`.architecture-diagram` inner overflow `= 0` on **every** project page at **every** width, 0 console
errors.

### `node harness/lh.js --label code-r1 --pages project-kubernetes-eks.html`

```
perf=100 a11y=100 bp=100 seo=100 LCP=1.65s CLS=0 TBT=0ms 65KB fail=[bf-cache]
```

`bf-cache` is the known local-server-only failure (`Cache-Control: no-store`), same as Wave 1.
Budgets: perf ≥ 95 ✅ · a11y 100 ✅ · CLS ≤ 0.05 ✅ (0).

### `node harness/integrity.js compare --base baseline-2026-09-13`

```
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

### Behaviour (Playwright, 390, touch)

```
copy buttons: 5 | pre[tabindex=0]: 5
after click   label: "Copied" | aria-label: "Code copied to clipboard" | class: code-copy is-done
clipboard head: "apiVersion: eksctl.io/v1alpha5\r\nkind: Cl"
after 1.8 s   label: "Copy"   | aria-label: "Copy code"
Tab -> .code-copy  outline: rgb(255, 153, 0) solid 2px
Tab -> PRE         outline: rgb(255, 153, 0) solid 2px
pointer:coarse=true  copy button 54x44   |  pointer:coarse=false  copy button 54x33
code font: 14px / 21.7px  (.code-label text-transform still "uppercase")
console errors: 0
```

---

## 5. Screenshots I opened and looked at

All under `harness/out/peek/`.

| File | What I saw |
|------|-----------|
| `cd2-before-maz-diag@390.png` | Before: 896 px tower, big colour emoji, every node a centred 3-line card, groups one per row. |
| `cd2-before-maz-diag@1440.png` | Before: the stray ↓ hanging at the far left of the diagram, Sandbox OU stretched full width on its own row. |
| `cd2-before-3tier-diag@390.png` | Before: 800 px, every node stacked including the two peer databases. |
| `cd2-before-eks-diag@390.png` | Before: 826 px, Pods and Node Group stacked inside the EKS Cluster group. |
| `cd2-before-eks-ingress@390.png` | Before: 13 px code at 1.65, no edge affordance, 26 px Copy chip. |
| `cd2-maz-diag@390.png` | After: whole diagram in one screen. IAM Identity Center + SCPs side by side; Security/Workloads OU side by side, Sandbox below; ↓ arrows centred. |
| `cd2-maz-diag@1440.png` | After: three OU regions across one row, stray ↓ centred, 304 px tall. |
| `cd2-3tier-diag@390.png` | After: "EC2 ASG → RDS" on one line with ElastiCache beneath; public-subnet flow stacked with a rotated ↓. (First pass put the → alone at line end — caught here and fixed by dropping the row basis 8.5rem → 7.5rem.) |
| `cd2-3tier-diag@1440.png` | After: two labelled subnet regions, horizontal arrows, 281 px. |
| `cd2-eks-diag@390.png` | After: Internet ↓ ALB Ingress ↓ EKS Cluster (Pods | Node Group 2-up), then ECR | Secrets Mgr 2-up. 386 px. |
| `cd2-eks-diag@1440.png` | Caught a bug: with the node stretched to a taller sibling, icon and name drifted apart vertically. Re-shot after adding `align-content: center` — icon/name/detail now one tight block. |
| `cd2-mrgn-diag@390.png` | The multi-region compromise in §3.3: Region A + Replication on one line, Region B below. |
| `cd2-cicd-cli@390.png` | The longest CLI block (126-char line, 654 px of inner scroll) at 390: veil on the right edge, no page overflow. |
| `cd2-cicd-cli-scrolled@390.png` | Same block after `pre.scrollLeft = 300`: the tail of the CodeBuild `--environment` line is readable, the page has not moved. |
| `cd2-veil-noflow.png` / `cd2-veil-overflow.png` / `cd2-veil-scrolled-end.png` | Element-level shots used with the pixel sampling in §3.2. |
| `cd2-eks-ingress@390.png` / `cd2-eks-ingress-scrolled@390.png` | The 408 px-overflow ingress YAML at 14 px/1.55, and the same block scrolled 300 px with the veil still showing. |
| `cd2-eks-prefocus@390.png` | Keyboard focus on `<pre>`: 2 px orange ring inset around the whole block. |
| `cd2-eks-copied@390.png` | Copy pressed: "Copied" in green on a green hairline, legible against the navy header band. |
| `cd2-maz-terminal@390.png` | Landing-zone Terminal Commands block at 390. |

---

## 6. For the integrator

1. **`styles.css` was already committed by someone else mid-flight.** `fe8d019`
   (`static-pages: …`) committed the whole working-tree `styles.css`, which swept in my section
   while I was still iterating on it. My commit therefore carries only `script.js` and this report
   plus the last two CSS tweaks — everything in the `[code-and-diagrams]` markers in HEAD is mine
   and final. Worth a rule for the rest of the wave: `git add styles.css` takes every other
   builder's uncommitted work with it.
2. **`node harness/weight.js` says `WEIGHT: FAIL (19 pages over their gzip baseline)`** — this is a
   wave-wide problem, not an area problem. `styles.css` is **43,098 B raw / 10,325 B gzip** against
   a 35,518 / 6,078 reference; project pages are **~4,620 B gzip over**. My section is
   **+833 B raw / +327 B gzip** of that, i.e. **~7 %**; `script.js` adds **+39 B gzip**. I trimmed
   hard to get there (single code font size, one-edge scroll veil instead of two, `--role` custom
   property instead of six `border-left-color` rules, comments cut to three lines) and I do not
   think there is another 100 gzip bytes in this section that is not a feature the brief asked for.
   The budget needs a wave-level decision, not four independent shaves.
3. **Do not re-add `text-transform` guidance for `.arch-group-label` without reading §3.1** — it
   must stay, and the small-caps look comes from `font-variant-caps` layered on top.
4. **`.code-inline` is styled but unused.** If article-template starts emitting inline code in
   prose, it will pick up the new quiet tint automatically.
5. `tab-size: 2` is inert today (no tabs in any `<pre>`) — see §1.
6. Nothing here depends on `harness/apply-code.js`; no such file was created.

## 7. How to reproduce

```
node harness/serve.js                                   # :4173
node harness/snap.js --label code-r1 --force --pages project-multi-account-landing-zone.html,project-three-tier-web-app.html,project-kubernetes-eks.html,project-cicd-pipeline.html
node harness/lh.js --label code-r1 --force --pages project-kubernetes-eks.html
node harness/integrity.js compare --base baseline-2026-09-13
node harness/weight.js
node harness/peek.js project-multi-account-landing-zone.html 390 1200
```

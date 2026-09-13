# Wave 2 · Round 1 · Creative director

Four areas, scored separately against `docs/REFERENCES.md` (Stripe Docs, Cloudflare Developer
Docs, Smashing Magazine) only.

| Area | Score | Verdict |
|------|-------|---------|
| article-template | **7.8** / 10 | **FAIL** |
| code-and-diagrams | **7.4** / 10 | **FAIL** |
| listing-pages | **7.9** / 10 | **FAIL** |
| static-pages | **8.2** / 10 | **FAIL** |

Excluded from all four scores, per the round brief: header, mobile drawer, footer, the
page-header band, and tag/badge hues — a round-2 shell builder is fixing those concurrently.
Also excluded: `WEIGHT: FAIL`, which is wave-wide and under consolidation (recorded below, not
scored).

---

## Evidence discipline — read this before the findings

**The working tree moved during this review.** Every screenshot I cite was taken between
**01:14:38 and 01:18:03**; `node harness/integrity.js compare` and `node harness/weight.js` ran
just before that. At **01:23:59–01:24:50** the round-2 shell builder wrote `styles.css`
(42,787 → 44,347 B) and all 21 HTML pages. So:

- Everything below is scored against **HEAD = `6bb6164`**, i.e. the four Wave-2 builders' r1
  output. That is the correct thing to score.
- A few of my findings are **already fixed in the uncommitted shell-r2 tree**. I say so inline
  (marked *[already addressed in the in-flight shell-r2 tree]*) so the panel does not
  double-charge a builder for something that is being repaired as I write.
- Any probe I ran after 01:24 is *not* cited as r1 evidence.

---

## Gate results (all measured at HEAD, before the shell-r2 writes)

```
console=0  pageErrors=0  failedRequests=0   (48 runs across article-r1/code-r1/listing-r1/static-r1)
axeSC=0    axeAll=0      hOverflow=none at 390/768/1440 on every page in all four labels
cls=0 everywhere except resources.html 0.0008 (768) / 0.0011 (1440)   budget 0.05
lighthouse: project-multi-account-landing-zone 100/100/100/100  lcp 1.65  tbt 5ms
            project-kubernetes-eks             100/100/100/100  lcp 1.65  tbt 0ms
            about / contact                    100/100/100/100  lcp 1.50  tbt 0ms
            index.html                         100/100/100/ 92  lcp 1.65  tbt 2ms   FAIL (link-text)
            resources.html                      99/100/100/100  lcp 2.18            FAIL (> 1.8 s)
integrity=PASS - INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
weight  =FAIL - WEIGHT: FAIL (19 pages over their gzip baseline)
                styles.css: raw 42787 (ref 35518), gzip 10282 (ref 6078)
                worst: project-multi-account-landing-zone gzip 16525 vs 11889 (+4636)
```

`bf-cache` fails on every page; INVENTORY says ignore it locally. The only budget failures that
belong to a Wave-2 area rather than to the wave are **index.html SEO 92** and
**resources.html LCP 2.18 s**, both on listing-pages.

---
---

# Area: article-template   Round: 1   Critic: creative director   Score: 7.8/10   Verdict: FAIL

### Worst screen

`harness/out/peek/cd2-crit-at-mal@1440+8200.png` — the end of
`project-multi-account-landing-zone.html` at 1440. Three left edges stacked in one frame: the
footer and header at x=152, the article column at x=284, the rail at x=957. The footer runs the
full 1200 px container while the article sits in a 623 px column with 132 px of empty container
to its left and 284 px of empty page to its right. The page reads as a docs page that lost its
sidebar.

### Screenshots looked at

| File (all `harness/out/peek/`) | What is seen |
|---|---|
| `cd2-crit-at-mal@390+0.png` | Key facts as three hairline definition rows under the overview — no card, reads as a spec sheet. Clean. |
| `cd2-crit-at-mal@390+430.png` | The chip row: exactly three pills, the third ending 7 px short of the container edge, then the ruled `Prerequisites` h2. |
| `cd2-crit-at-mal@390+790.png` | Prereq list + the ruled `Architecture` h2 + the top of the diagram. |
| `cd2-crit-at-mal@390+1700.png` | Steps 1–2: peach number badge in the gutter beside the h3, bullet list spanning the **full** 342 px measure. |
| `cd2-crit-at-mal@390+3100.png` | Steps 5–6 and the hairline between steps; `Tips` h2 below. |
| `cd2-crit-at-mal@390+3790.png` | Tips callout — peach tint, 3 px rust left rule, rust bullet markers, no emoji — then the first code block. |
| `cd2-crit-at-mal@390+9200.png` | `What You'll Learn` + the two pagination cards stacked. |
| `cd2-crit-at-mal@390+9680.png` | The pagination cards immediately above the footer. |
| `cd2-crit-at-mal@1440+0.png` | Two-column article; key facts as a three-column hairline strip; rail in column 2 with a left hairline. h1 at 152, body at 284. |
| `cd2-crit-at-mal@1440+1380.png` | Rail stuck at header+24 px while steps 1–4 scroll past. All seven rail links identical — nothing marks the section on screen. |
| `cd2-crit-at-mal@1440+2960.png` | Tips callout and the first code block at desktop, both confined to the 623 px measure. |
| `cd2-crit-at-mal@1440+8200.png` | **Worst screen** (above). |
| `cd2-crit-at-mal@768+0.png` | 768: three-column key-facts strip (rules 24→647) and a chip row whose grey overlay bar runs 24→744. Seventh chip correctly clipped here. |
| `cd2-crit-at-sw@390+0.png` | Shortest page: same strip, `Free Tier eligible` on one line, chip row below. |
| `cd2-crit-at-sw@390+400.png` | Chip row again showing three of seven, flush to the edge. |
| `cd2-crit-at-sw@390+3250.png` | Tips callout and the `bucket-policy.json` code block. |
| `cd2-crit-at-sw@1440+0.png` | Same 132 px misalignment on the short page; rail hairline visible at x≈940. |
| `cd2-crit-at-sw@390+5550.png` | Short-page pagination: `← Back to Projects` / `Next Project →`, both arrows present. |

Measurements: `harness/out/cd2c-measure.js`, `cd2c-rules.js`, `cd2c-probe2.js`, `cd2c-sb.js`
(all in the git-ignored `harness/out/`).

### Ranked issues (worst first)

**1. The article is still 132 px out of register with its own headline at desktop — COMPONENT**
Page/width: all 11 `project-*.html` at ≥ 64em.
Screenshot: `cd2-crit-at-mal@1440+8200.png`, `cd2-crit-at-mal@1440+0.png`, `cd2-crit-at-sw@1440+0.png`

Measured at 1440: wordmark and h1 left = **152**; `.guide-overview` / `.guide-section` /
`.guide-meta` / `.guide-navigation` left = **284**, right = 908; `.guide-aside` 908→1156;
`.project-guide` box 152→1288; footer 152→1288. The cause is one declaration —
`@media (min-width: 64em) { .project-guide { … justify-content: center } }` — which centres the
`623 + 249` two-track block inside a 1136 px container and therefore leaves **132 px dead on the
left and 132 px dead on the right**, plus the 152 px viewport gutter. The same holds at 1280
(72→204) and 1024 (32→76), so it is not a wide-screen edge case.

Wave 1 ranked this #1 at 256 px. Round 1 halved it by filling column 2 with a real rail, but did
not fix it. Cloudflare Developer Docs keeps breadcrumb, h1 and first paragraph on one vertical;
that single edge is what makes a docs page read as built.

*What "fixed" looks like:* the article's left edge equals the page header's at every width —
`justify-content: start` (or `space-between`, matching the header band the shell builder is now
giving `.guide-page .page-header`), so the body starts at 152 and the rail ends near 1288. The
measure is already exactly `--measure` (623 px = 68 ch at 17 px), so nothing about the reading
column has to change.
*[already addressed in the in-flight shell-r2 tree — both edges now measure 152. Verify jointly;
the header and the guide must use the same `justify-content` or they will drift apart again.]*

**2. The "On this page" chip row shows 3 of 7 sections at 390 with no affordance and no label — COMPONENT**
Page/width: all 11 project pages at 390 (the primary target width).
Screenshot: `cd2-crit-at-mal@390+430.png`, `cd2-crit-at-sw@390+400.png`

Measured: `ol.scrollWidth 828 / clientWidth 342` — **486 px, four of seven links, are off-screen**.
The third chip's right edge is at **359** against a container edge of **366**, so the row ends on
7 px of paper and reads as a complete set of three. There is no fade, no veil, no partial sliver,
and no scrollbar (overlay scrollbars take zero layout height; `offsetHeight === clientHeight ===
32`). The "On this page" title is `display: none` below 64em. A reader therefore meets three
unlabelled white pills that look exactly like the tag chips used elsewhere on the site, with no
reason to swipe and no statement that they are page navigation.

This is the headline feature of the round failing on the device it was designed for. It also sits
on the same page as a code block that *does* carry a right-edge scroll veil — so the site already
has the vocabulary and does not use it here.

*What "fixed" looks like:* the same right-edge veil the code blocks use, applied to the chip row,
plus a visible label. If the 48 px budget cannot carry an "On this page" line, put the words in as
a small-caps lead-in on the same row, or drop the pills for a single `Jump to ▾` disclosure.
Either way, seven sections must be reachable without a blind swipe.

**3. The rail has no current-section indicator — COMPONENT**
Page/width: all 11 project pages at ≥ 64em.
Screenshot: `cd2-crit-at-mal@1440+1380.png`

`.guide-section > h2:target { border-top-color: var(--accent) }` is the only "you are here"
signal, and `:target` fires only after a click on a rail link — never while scrolling. In the
screenshot the viewport is filled with *Step-by-Step Instructions* and all seven rail entries are
identical weight and colour. Both frozen references highlight the active entry; it is the reason a
rail earns its 249 px. Without it the rail is a static link list that happens to be sticky.

*What "fixed" looks like:* an active state on the rail entry for the section in view. This is the
one place in the area where a few lines of JS (an `IntersectionObserver`, ~200 B) buy a real
reading affordance — or, JS-free, accept that the rail is a jump list and stop calling it "on this
page".

**4. The pagination is two empty white boxes — COMPONENT**
Page/width: all 11 project pages, all widths.
Screenshot: `cd2-crit-at-mal@390+9200.png`, `cd2-crit-at-mal@1440+8200.png`, `cd2-crit-at-sw@390+5550.png`

`.guide-nav-link` is `background: var(--surface); border: 1px solid var(--line); border-radius:
8px; padding: 16px` — i.e. the same shell as every card on the site, containing one short line of
generic text. On the landing-zone page one card carries an arrow ("← Previous Project") and the
other does not ("Back to All Projects"), so the pair is visually asymmetric for no reason a reader
can see. Cloudflare's equivalent is a ruled two-up with a small-caps *Previous* / *Next* label
above the destination's title; here the destination is never named (link text is frozen, so the
title cannot be added — but the label/rule treatment can be).

*What "fixed" looks like:* drop the card shell. A top rule, two cells, a small-caps direction label
above the frozen link text, the second cell right-aligned. Same bytes, no empty boxes.

**5. Diagrams and code are trapped in the 623 px text measure while 284 px of page sits empty — COMPONENT**
Page/width: all 11 project pages at 1440.
Screenshot: `cd2-crit-at-mal@1440+2960.png`, `cd2-crit-cd-mal-diag@1440.png`

Every child of `.project-guide` is capped at `--measure`, including `.architecture-diagram` and
`.code-block`. That is right for prose and wrong for a figure: the landing-zone diagram is forced
to 623 px wide and 304 px tall while the page has 284 px of unused width to its right, and the
longest CLI lines have to scroll inside a 623 px box on a 1440 px screen. Cloudflare lets diagrams
and wide samples break the measure.

*What "fixed" looks like:* a full-bleed escape for `.architecture-diagram` (and optionally wide
code) from 64em up — one grid item spanning tracks 1–2, or a negative-margin utility. This becomes
free once issue 1 is fixed and the two tracks reach the container edges.

**6. At 768 the chip row's overlay scrollbar is a 720 px bar under a 623 px rhythm — PAGE**
Screenshot: `cd2-crit-at-mal@768+0.png`

Every rule inside the article at 768 runs 24→647 (`.guide-meta`, every `h2` border-top, the
diagram). The chip row is the one element allowed the full 24→744 width, and because it overflows,
Chromium paints a grey overlay scrollbar across all 720 px of it. The result is one bar that is
97 px wider than every other horizontal line on the page. (At 390 the same bar is invisible, which
is what produces issue 2.)

### Nits

- The `Tips` section is an h2 whose entire content is one callout — heading and box say the same
  thing twice (`cd2-crit-at-mal@390+3790.png`). A callout with its own label and no h2 would read
  better; the h2 text is frozen, so this is a rail/heading decision for the panel.
- Key facts at 1440 give "Difficulty: Advanced" a third of the strip for one word while "AWS
  Services" wraps to four lines (`cd2-crit-at-mal@1440+0.png`). `repeat(3, 1fr)` → content-sized
  tracks would settle it.
- The step badge is a 28/32 px peach circle and the roadmap badge on index is a 32 px paper-2
  circle — two numbered-badge treatments across the site for the same idea.
- Chip radius is `999px` (a full pill) below 64em; nothing else on the site is a full pill. See the
  cross-area reconciliation at the end.

### What is genuinely good

The key-facts strip, the section rhythm and the step list are the three best decisions of the wave.
Wave 1's issue #4 (section rules at seven different lengths) is **fixed inside the article**:
measured, every `h2` border-top is 24→366 at 390, 24→647 at 768, 284→908 at 1440 — one width per
viewport, no exceptions. The `display: contents` trick that keeps the step body at the full 342 px
measure at 390 is exactly right and visible in `cd2-crit-at-mal@390+1700.png`. The tips callout
lost its injected glyph. Zero axe nodes, CLS 0, Lighthouse 100/100/100/100, integrity PASS.

---
---

# Area: code-and-diagrams   Round: 1   Critic: creative director   Score: 7.4/10   Verdict: FAIL

### Worst screen

`harness/out/peek/cd2-crit-cd-mrgn-diag@390.png` — `project-multi-region-active-active.html` at
390. The diagram **asserts the wrong architecture**. "Region A (us-east-1)" and a full-height
"↔ Replication" node sit side by side; "Region B (eu-west-1)" has wrapped onto the row below,
*outside* the pair. The bidirectional arrow therefore points from Region A at empty space, and
Region B reads as an unconnected third thing. The group label also breaks mid-token —
`REGION A (US-EAST-` / `1)`. At 1440 the same diagram is correct
(`cd2-crit-cd-mrgn-diag@1440.png`), which makes this a phone-only inversion of the page's meaning.
An unreadable diagram is a nuisance; a diagram that is readable and wrong is worse.

### Screenshots looked at

| File (all `harness/out/peek/`) | What is seen |
|---|---|
| `cd2-crit-cd-mrgn-diag@390.png` | **Worst screen** (above). |
| `cd2-crit-cd-mrgn-diag2@390.png` | The tail of that diagram and the first steps; confirms nothing reconnects Region B. |
| `cd2-crit-cd-mrgn-diag@1440.png` | The same diagram correct at 1440: A | Replication | B across one row. |
| `cd2-crit-cd-mal-diag@390.png` | Landing zone in one 390 screen: Management → (IAM Identity Center | SCPs) → Security/Workloads OUs 2-up, Sandbox full width. Legible without zoom. |
| `cd2-crit-cd-mal-diag@1440.png` | Same, 304 px tall, three OU regions across one row. Six different stripe hues in one panel. |
| `cd2-crit-cd-eks-diag@390.png` | Internet ↓ ALB ↓ EKS Cluster (Pods | Node Group) then ECR | Secrets Mgr. Compact and clear. |
| `cd2-crit-cd-3tier-diag@390.png` | Public/private subnet groups; EC2 ASG → RDS on one line, ElastiCache below. Good. |
| `cd2-crit-cd-3tier-diag@1440.png` | Two labelled subnet regions, horizontal arrows. Good. |
| `cd2-crit-cd-eks-code1@390.png` | `cluster-config.yaml` at 14 px/1.55 — **entirely one colour**. Faint veil at the right edge. |
| `cd2-crit-cd-eks-code1-scrolled@390.png` | Same block at `pre.scrollLeft = 300`: the long `enableTypes` line is now readable and the page did not move — but the clipped glyphs on the left run flush into the border with no return affordance. |
| `cd2-crit-cd-eks-code1-copied@390.png` | After a scripted click on `.code-copy` the label still reads "Copy" — I could not reproduce the copied state; not scored (behaviour is the reader critic's). |
| `cd2-crit-cd-mal-code1@390.png` | `DENY-REGIONS-SCP.JSON` — 33 lines of JSON, zero syntax colour; the orange `JSON` chip is the loudest thing on screen. |
| `cd2-crit-cd-mal-code1-scrolled@1440.png` | The same block at 1440 does not overflow, and the veil is correctly absent. The two-layer mechanism works. |

### Ranked issues (worst first)

**1. There is no syntax highlighting anywhere on the site — COMPONENT**
Page/width: all 43 code blocks on all 11 project pages, all widths.
Screenshot: `cd2-crit-cd-mal-code1@390.png`, `cd2-crit-cd-eks-code1@390.png`,
`cd2-crit-at-mal@1440+2960.png`

Counted at HEAD: **43 `<pre>` blocks, 43 `.code-block` wrappers, and 0 occurrences of
`class="comment"`, `"keyword"`, `"string"`, `"function"`, `"variable"` or `"number"` in any `.html`
file in the repo.** All six syntax rules in the `[code-and-diagrams]` section are dead CSS. Every
JSON, YAML, HCL, Bash and Python sample on the site renders as a flat wall of `#e6edf3`.

The builder report states "Syntax colours unchanged — they were already 7.3 : 1 – 12.6 : 1 on
`--code-bg` (measured)". Those ratios were measured on rules that never match an element. This is
the one claim in the four reports that my own check contradicts outright.

Stripe Docs is the *named* reference for code-block anatomy, and highlighting is not an
embellishment there — it is how a reader finds the key in a 30-line policy document. `<span>`s
inside `<pre>` do not change `innerText`, so the content gate is untouched, and ARCHITECTURE
explicitly gives this area "markup inside those blocks on any page". It was reachable and was not
done.

*What "fixed" looks like:* the six existing classes actually applied — at minimum strings, comments
and numbers on the JSON/YAML samples, which is where a reader's eye needs the anchor. A one-off
scripted markup pass over 43 blocks, not a runtime highlighter (no new dependency, no JS cost).

**2. The multi-region diagram inverts its own topology at 390 — PAGE (one page, but a correctness bug)**
Page/width: `project-multi-region-active-active.html` at 390.
Screenshot: `cd2-crit-cd-mrgn-diag@390.png` vs `cd2-crit-cd-mrgn-diag@1440.png`

Detailed above. The builder flagged the 2-up compromise in §3.3 and chose it to protect the
landing-zone diagram's height — but the report frames the cost as "still readable", and it is not:
the reading is wrong. The label also breaks mid-token because `flex: 1 1 7.5rem` gives the group
~120 px at 390 while "REGION A (US-EAST-1)" needs more.

*What "fixed" looks like:* force any `.arch-row` that contains an `.arch-arrow` to stack below
40em — which is already the rule for `.arch-flow`. The landing-zone OU row has no arrow and would
keep its 2-up, so the compromise costs nothing on the diagram the brief singles out.

**3. Six node hues, no legend, and two of them are indistinguishable — COMPONENT**
Page/width: every project page, every width.
Screenshot: `cd2-crit-cd-mal-diag@1440.png`, `cd2-crit-cd-mal-diag@390.png`,
`cd2-crit-cd-3tier-diag@1440.png`

The roles *are* semantic (`user #7ad3a4`, `primary var(--aws-orange)`, `storage #7fb0f0`,
`database #b49af5`, `compute #f58ab8`, `security #f08b8b`), which is better than Wave 1 assumed.
Three problems remain:

- **No legend anywhere.** A reader sees six colours and is told nothing. An encoding that cannot be
  decoded is decoration with extra steps — which is what Wave 1 handoff #2 asked to fix.
- **`compute #f58ab8` and `security #f08b8b` differ only in the blue channel (184 vs 139).** On a
  3 px stripe they are the same colour. In `cd2-crit-cd-mal-diag@1440.png`, "IAM Identity Center"
  (security) and "SCPs" sit adjacent and read as one hue; so do "Log Archive" and "Production".
- **The brand accent is doing three unrelated jobs inside one panel:** the `primary` node role,
  every arrow, and (just outside the panel) the code-block language chip. When orange means "load
  balancer", "flow" and "JSON" on the same screen it stops meaning anything.

*What "fixed" looks like:* two or three roles, not six — e.g. entry / compute / data — with a
one-line legend under the diagram; or neutral stripes throughout, letting the group boxes and
arrows carry the structure. The references carry one accent in a diagram, not seven.

**4. The code header's hierarchy is inverted — COMPONENT**
Page/width: all 43 blocks, all widths.
Screenshot: `cd2-crit-cd-mal-code1@390.png`, `cd2-crit-cd-eks-code1@390.png`,
`cd2-crit-at-mal@1440+2960.png`

`.code-lang` is `background: rgba(255,153,0,.16); color: #ffc46b` — a filled orange chip. It is the
brightest element in the article, and it is **redundant on all 43 blocks**: the filename directly
to its left already ends in the same token (`CLUSTER-CONFIG.YAML` + `YAML`,
`DENY-REGIONS-SCP.JSON` + `JSON`). Meanwhile `.code-copy` — the only *action* in the block — is
grey text on `#ffffff0d`, the quietest thing in the bar. Stripe's language label is quiet; the copy
affordance is what the eye finds.

`.code-label` also uppercases the filename with `text-transform`, so the real artefact name
(`cluster-config.yaml`) is never shown as written.

*What "fixed" looks like:* drop the tint from `.code-lang` (quiet `--on-navy-2` mono, or delete it
entirely where the filename carries the extension — 43 of 43 cases), and let the accent live on the
Copy control instead. Lowercase the filename.

**5. A scrolled block gives no way back — COMPONENT**
Page/width: any overflowing block, worst at 390.
Screenshot: `cd2-crit-cd-eks-code1-scrolled@390.png`

The two-layer right-edge veil is well built, and I verified it disappears correctly when there is
nothing to scroll (`cd2-crit-cd-mal-code1-scrolled@1440.png` — no overflow at 623 px, no veil). But
it is one-edged by choice, so once scrolled the left ends of every line clip flush against the block
border (`ion: eksctl.io/v1alpha5`) with nothing to say the content continues that way. On a phone,
where the block is the whole screen, that is where a reader gets stranded.

*What "fixed" looks like:* mirror the same two-layer trick on the left edge — the same three
declarations with `left/` instead of `right/` and `90deg` instead of `270deg`, roughly 60 gzip B.

### Nits

- **45 emoji still act as diagram icons** across the 11 project pages (counted at HEAD:
  landing-zone 6, multi-region 6, realtime 5, cicd/ec2/iac/eks/rest-api 4 each, static-website and
  three-tier 3, contact-form 2). Greyscaling them at `opacity: .7` was the right call given they are
  in the frozen text snapshot, and it removes most of the tell. What remains is that they carry no
  information: `&#128220;` (scroll) is used for both "SCPs" and "Log Archive", and the same monitor
  glyph appears on three unrelated nodes. Nothing to fix under the content freeze — recording the
  count because the protocol asks for it.
- `tab-size: 2` is inert (no `<pre>` in the baseline contains a tab) — the builder says so; agreed,
  keep it.
- `.code-inline` is styled and used zero times. Fine to keep, but it is untested surface area.
- The `.arch-note` line ("Account Factory automates new account provisioning") is centred while
  everything else in the panel is left-aligned.

### What is genuinely good

The diagram rebuild is the single largest legibility win of the wave and it is real: measured
heights at 390 fell 896→429 (landing zone), 826→386 (EKS), 800→431 (three-tier). All four target
diagrams now fit one phone screen with the header, components keep their labels, flows stack with
visible direction, and the stray left-flushed `↓` is gone. `scrollWidth − clientWidth === 0` on
every project page at every width. The 14 px / 1.55 code type is the Stripe register and is a clear
improvement on 13 px / 1.65. The scroll-veil mechanism is the most carefully engineered thing in the
wave, and the builder caught his own error by sampling rendered pixels rather than by eye — that is
the right instinct and it should be said.

---
---

# Area: listing-pages   Round: 1   Critic: creative director   Score: 7.9/10   Verdict: FAIL

### Worst screen

`harness/out/peek/cd2-crit-lp-tools@1440+1850.png` — the "More Career Resources" band on
`tools.html`. Four identical white hairline cards in a row, each led by a **full-colour emoji**
(📊 blue/green bars, 📐 purple ruler, 📋 orange clipboard, 🎯 red target), each ending in a
different generic hairline button ("Open Tool", "Download", "Learn More", "Start Prep"). This is
card soup plus emoji-as-icons — two of the template tells the protocol names — in one frame, and it
is the part of listing-pages that round 1 did not touch. The same band at 390
(`cd2-crit-lp-tools@390+2450.png`) is the same problem stacked. These are the most saturated colours
anywhere on the site, and they sit on the page that also carries the site's only calculator.

### Screenshots looked at

| File (all `harness/out/peek/`) | What is seen |
|---|---|
| `cd2-crit-lp-tools@1440+1850.png` | **Worst screen** (above). |
| `cd2-crit-lp-tools@390+2450.png` | The same four cards stacked at 390, full-colour emoji leading each. |
| `cd2-crit-lp-tools@390+480.png` | Calculator: ruled title, sentence-case labels, hairline selects ≥ 44 px, one orange submit. Clean. |
| `cd2-crit-lp-index@390+1760.png` | Roadmap as a real timeline: rail at x≈40, outlined number discs, hairline card, skill chips under a rule. |
| `cd2-crit-lp-index@1440+1210.png` | Same at 1440 — and the body copy runs ~100 characters per line. |
| `cd2-crit-lp-index@390+3900.png` | Cert cards at 390; pixel-sampled top borders are `#3b6fb5` and `#7a5bbf`. |
| `cd2-crit-lp-index@1440+2650.png` | Cert row: eyebrows, titles and "Learn More" aligned across four cards; the ruled spec blocks sit at two different heights. |
| `cd2-crit-lp-index@390+5600.png` | Resource **rows** — title + one-line description + faint `›`. Wave-1 card soup gone. |
| `cd2-crit-lp-index@390+7250.png` | Salary cards: range as the display figure, rust bullet markers, orange 3 px top rule on the "featured" one. |
| `cd2-crit-lp-index@1440+4010.png` | Salary row + the peach "Note:" callout + the FAQ head. |
| `cd2-crit-lp-index-faqopen@1440.png` | FAQ open: `+` → `×` in rust, answer at the measure, rows ruled. Correct. |
| `cd2-crit-lp-index@390+9180.png` | CTA band on `--paper` separating cleanly from the FAQ band above; one orange + one quiet button. |
| `cd2-crit-lp-projects@1440+430.png` | 3-up project cards: badge → title → one-liner on a tinted header → service chips → learn list → quiet "View Guide", bottoms aligned. Best component on the site. |
| `cd2-crit-lp-projects@390+450.png` | The same card 1-up at 390. |
| `cd2-crit-lp-res@390+450.png` | Book card at 390: the cover plate is a full-width 342 px grey slab with a 104 px jacket floating in it. |
| `cd2-crit-lp-res@1440+400.png` | 2-up horizontal book cards; the tall grey cover column is mostly empty. The SAP-C02 card shows *The Kubernetes Book*. |
| `cd2-crit-lp-res@1440+1980.png` | Pluralsight panel as a quiet paper panel with a pink rule and one orange CTA; course cards with pink `LEARNING PATH` chips and emoji meta. |
| `cd2-crit-lp-ip@390+520.png` | Interview rows closed: ruled, `+` affordance, difficulty badge inline in the question text. |
| `cd2-crit-lp-ip-open@390.png` | Two rows open: `×`, "Click to hide answer", structured answer with bold terms. Good. |

### Ranked issues (worst first)

**1. tools.html is untouched template: four emoji-led cards and four generic buttons — PAGE**
Page/width: `tools.html` at 390 and 1440.
Screenshot: `cd2-crit-lp-tools@1440+1850.png`, `cd2-crit-lp-tools@390+2450.png`

Detailed above. Counted at HEAD: **12 full-colour emoji on listing pages** — 4 on `tools.html`
(`📊 📐 📋 🎯`) and 8 on `resources.html` (`🕑` ×4, `🎓` ×4 in the course meta row). The
code-and-diagrams builder greyscaled theirs to `grayscale(1) opacity(.7)` under the same content
freeze; listing-pages left theirs at full saturation. The same problem, in the same wave, treated
two different ways.

The card bodies are also empty: title, one sentence, a button. `.tool-card` has no meta and no
differentiation, and the four buttons ("Open Tool" / "Download" / "Learn More" / "Start Prep") use
one hairline treatment for four different destination types (two are external AWS links).

*What "fixed" looks like:* the same `filter: grayscale(1); opacity: .7` rule
`.arch-component-icon` already uses — one shared declaration, ~40 B — plus the anatomy the resource
lists already prove works: turn the four tool cards into ruled rows with a title, a one-line
description and an external-link marker, exactly like `cd2-crit-lp-index@390+5600.png`. That
deletes four cards, four buttons and four emoji in one move.

**2. Roadmap body copy runs ~100 characters per line at 1440 — COMPONENT**
Page/width: `index.html` at 1440 (and any width ≥ 1100).
Screenshot: `cd2-crit-lp-index@1440+1210.png`

`.roadmap { max-width: 52rem }` (832 px) minus the 2 rem number gutter, the gap and the card's
`--sp-5` padding leaves ≈ 720 px of text set at `--fs-s` = **15 px**. Counted directly off the
render: *"Start with cloud computing basics, networking concepts, and Linux administration.
Understand how the"* = **100 characters on one line**; item 3's first line is ~110. The reference
band is 65–75; the sheet's own `--measure` is 68 ch.

Wave 1 raised this as issue #8 (734 px / 80 ch) and asked for `max-width: var(--measure)`. The new
timeline reduced the *pixel* width slightly and reduced the *font size* more, so the
characters-per-line got **worse**, not better. It is the longest measure on the site and it is on
the home page's primary content.

*What "fixed" looks like:* `.roadmap-content p { max-width: var(--measure) }`, or set the card body
at `--fs-0` so 720 px lands near 75 ch. One declaration either way.

**3. Book-card cover plate is an unstyled image well — COMPONENT**
Page/width: `resources.html` at 390 and 1440.
Screenshot: `cd2-crit-lp-res@390+450.png`, `cd2-crit-lp-res@1440+400.png`

At 390 the `--paper-2` plate spans the full 342 px card width and ~170 px tall with a 104 px jacket
centred in it — roughly 120 px of empty grey on either side. At 1440 the plate becomes a 136 px
column running the card's full height, so on the taller cards (*The Phoenix Project*) a 138 px
jacket floats at the top of a ~315 px grey rectangle. `--paper-2` against `--surface` is a 6-unit
difference, so the plate reads less as a designed mount than as a background that failed to load.
Wave 1's navy cover band was wrong for a different reason; this replaced it with nothing.

*What "fixed" looks like:* size the plate to the jacket (`width: fit-content`, or a fixed
120 × 176 mount with `align-self: start` and no stretch), give the jacket a real hairline, and put a
single hairline "shelf" rule under it. Smashing's book cards mount the cover; they do not surround
it with ground.

**4. Four coloured cert-card top bars — COMPONENT**
Page/width: `index.html`, all widths.
Screenshot: `cd2-crit-lp-index@390+3900.png` (pixel-sampled: y=420 → `rgb(59,111,181)` = `#3b6fb5`;
y=822 → `rgb(122,91,191)` = `#7a5bbf`)

At HEAD, `styles.css` lines 429–433 — **inside the `[listing-pages]` section** — carry
`.cert-card.foundational #2f8f63`, `.associate #3b6fb5`, `.professional #7a5bbf`,
`.specialty var(--aws-orange)`. Four hues that are not the accent, encoding a level that the
small-caps eyebrow directly above them already states in words. Wave 1 ranked this as issue #5 and
handed it to this area; the section was rewritten around it and the hues were kept.
*[already addressed in the in-flight shell-r2 tree — all four now compute to `--line-2`.]*

**5. The "featured" salary card is a SaaS pricing table — COMPONENT**
Page/width: `index.html`, all widths.
Screenshot: `cd2-crit-lp-index@390+7250.png`, `cd2-crit-lp-index@1440+4010.png`

Wave-1 handoff #4 was taken halfway: the heavier border is gone, the orange 3 px top rule stayed,
and the transparent 3 px top border on the other two so the tops still align is a nice detail. But
the convention is still "this is the recommended tier", applied to a **salary band**, where
recommending one is meaningless. Nothing on the page says why "Cloud Architect" is special.

*What "fixed" looks like:* drop the featured treatment entirely (the three cards are a progression,
not a choice), or move the emphasis onto something true — which would need a content approval.

**6. index.html SEO 92 — "Learn More" ×4 — PAGE + needs an approval**
Lighthouse `link-text`, `harness/out/listing-r1/lighthouse/summary.json`.
Screenshot: `cd2-crit-lp-index@1440+2650.png` (four identical "Learn More" links in one row)

Unchanged since Wave 1 and it holds the area below the budget gate on its own. This is also a design
problem, not only an SEO one: four identical link texts in one row is the clearest signal on the
page that the cards were generated rather than written. The Wave-1 builder's option (b) — a
descriptive `aria-label` containing the visible text — is invisible to the content gate and WCAG
2.5.3-safe. **It has my yes as director; it needs the panel's.**

**7. resources.html LCP 2.18 s > 1.8 s — PAGE**
Images went 358 KB → 143 KB and the page 339 KB → 195 KB, which is excellent work, but the builder's
own no-image test (1.95 s with all eight covers blocked) shows the remainder is shell/script-shaped.
Recording it because it blocks the gate; the fix is not in this area.

### Nits

- **Cert-card rules stagger.** In `cd2-crit-lp-index@1440+2650.png` card 1's spec-list rule sits
  ~25 px below the other three, because its three list items are all one line while the others wrap.
  The bottoms align (`margin-top: auto` works); the rules do not. The builder report's "list rules …
  all on one baseline" is overstated.
- **`resources.html` shows *The Kubernetes Book* as the SAP-C02 study guide**
  (`cd2-crit-lp-res@1440+400.png`). `src` and `alt` are frozen; this needs a new image plus an
  `images` approval. Real, visible, and the kind of thing a reader notices immediately.
- The interview difficulty badge sits **inline inside the question sentence**, so it reads as part
  of the question ("…When would you use each? `Easy`") and drops to its own line when the question
  wraps differently (`cd2-crit-lp-ip@390+520.png`). A right-aligned or meta-row position would fix
  it.
- The `›` on resource rows is very light, and it carries the affordance for the whole component.
- `.faq-list { max-width: 52rem }` gives the FAQ a fourth right edge at 1440 (832) against the card
  grids (1200) and the CTA copy (~68 ch). Each is individually defensible; together the page has no
  single right edge.
- Pink `LEARNING PATH` / `COURSE` chips on `resources.html` — flagged once, **not scored**, since
  tag hues belong to the concurrent shell builder this round.

### What is genuinely good

This area did the most work and most of it landed. Wave-1 handoff #3 — "card soup on index at 1440,
11 identical white hairline cards" — is **fixed**, and the replacement (ruled link rows,
`cd2-crit-lp-index@390+5600.png`) is better than what I asked for. The cert row's alignment
(`cd2-crit-lp-index@1440+2650.png`) is a visible, measurable improvement on the "before" the builder
kept. `projects.html` cards and the interview disclosure rows are the two strongest components on
the site. The calculator's two-field grid, the CTA band separating from the FAQ band, the
`opacity: .7` footnote contrast fix, 27 blocks of inline styling deleted, `resources.html` down
211 KB gzip, and keyboard-operable question rows are all real. The FAQ open state at 68 ch is
correct.

---
---

# Area: static-pages   Round: 1   Critic: creative director   Score: 8.2/10   Verdict: FAIL

### Worst screen

`harness/out/peek/cd2-crit-sp-priv@1440+0.png` — `privacy.html`. Four ruled rows, each led by a
**rust check mark**, enumerating *"IP address and approximate geographic location"*, *"Browser type
and version"*, *"Operating system"*, *"Pages visited and time spent on pages"*. At
`cd2-crit-sp-priv@390+900.png` the same tick sits beside *"Display relevant advertisements"* and
*"Click patterns and scroll behavior"*. A ✓ in the brand accent means *yes / included / good*.
Applied to a data-collection disclosure it reads as a feature list of benefits, which is the
opposite of what a privacy page is for — and it puts the site's loudest, most affirmative accent
glyph, ~20 times, on the one page that should be its quietest. Everything else about the page is
right, which is what makes this the worst screen: a single wrong glyph repeated down a well-built
page.

### Screenshots looked at

| File (all `harness/out/peek/`) | What is seen |
|---|---|
| `cd2-crit-sp-priv@1440+0.png` | **Worst screen** (above). Also: compact h2/h3 rhythm, 68 ch column flush left at 152. |
| `cd2-crit-sp-priv@390+900.png` | "How We Use Your Information" — rust ticks beside "Display relevant advertisements". Four sections legible in one phone screen. |
| `cd2-crit-sp-about@1440+0.png` | About at 1440: ruled h2s, unruled first heading, hairline definition rows, term on its own line. The best-composed page in Wave 2. |
| `cd2-crit-sp-about@390+700.png` | The full "What We Offer" list at 390 — six hairline rows, hanging rust tick, no double rule at the bottom. |
| `cd2-crit-sp-about@390+1780.png` | Disclaimer: three paragraphs fused into one quiet `--paper-2` block with a single grey left rule; Affiliate Disclosure the same. Exactly right. |
| `cd2-crit-sp-contact@390+0.png` | Form card, four labelled fields, ≥ 44 px targets, hairline borders. |
| `cd2-crit-sp-contact@1440+0.png` | 40 rem card left-aligned at 152, one orange submit, nothing competing. |
| `cd2-crit-sp-contact@1440+440.png` | Bottom of the form and the footer; 650 px of empty page to the right. |
| `cd2-crit-sp-404@390+0.png` | Paper page, orange cloud, quiet grey numeral, joke as a ruled note, one orange CTA — and no header, no nav, no footer. |
| `cd2-crit-sp-404@1440+0.png` | Same, block centred at x=432 while every other page on the site flushes left at 152. |

### Ranked issues (worst first)

**1. Accent check marks used as list markers on a privacy disclosure — PAGE (the glyph itself is a design-system primitive)**
Page/width: `privacy.html` at 390 and 1440.
Screenshot: `cd2-crit-sp-priv@1440+0.png`, `cd2-crit-sp-priv@390+900.png`

`privacy.html` carries 32 `<li>`. `.prose .feature-list` turns them into prominent ruled rows with
the marker hanging in a 1.7 em gutter; the marker itself (`.feature-list li::before`, HEAD
`styles.css:101`) is a drawn tick in `var(--accent)`. The component was built for about.html's
"What We Offer", where an affirmative tick is correct. It was then applied unchanged to a page
enumerating what the site collects about you and what it does with it.

The glyph primitive belongs to design-system, but the decision to hang `.prose` — and therefore
`.prose .feature-list` — on `privacy.html` is this area's, and neutralising it is two lines inside
`[static-pages]`.

*What "fixed" looks like:* `.prose-compact .feature-list li::before` becomes a neutral marker — a
`--line-2` dash or dot, or no marker at all and just the hairline row, which is what Cloudflare's
and Stripe's legal pages do. Keep the tick on about.html, where it means something.

**2. 404.html is still a different website — PAGE**
Page/width: `404.html` at 390 and 1440.
Screenshot: `cd2-crit-sp-404@390+0.png`, `cd2-crit-sp-404@1440+0.png`

The typography is much better than Wave 1: left-aligned, a quiet `--ink-3` numeral instead of an
orange blob, the joke restyled into the same quiet-note language as the prose notes, one orange CTA.
But the structural complaint from Wave 1 issue #7 is untouched — no header, no wordmark, no nav, no
footer, and exactly one way out of the page. At 1440 the block is horizontally centred at x=432
while every other page on the site flushes left at 152, and there is ~230 px of dead space above the
cloud and ~215 px below the button in a 900 px viewport. The orange cloud mark appears with no
wordmark beside it, so the brand's only appearance on the page is an unlabelled glyph.

The engineering case (2.8 KB, self-contained, no second request, never actually served by SWA) is
sound, and I ranked this 7th in Wave 1 for exactly that reason. But my Wave 1 note asked for one of
two things — inline a minimal navy bar and a three-link footer, *or* have the panel record the
shell-less 404 as an accepted decision in `docs/STATUS.json`. Neither happened; the builder restated
the reasoning. It is still the only page on the site a reader can reach and not get back from.

*What "fixed" looks like:* either ~300 B of inline markup — navy bar, cloud mark, wordmark linked to
`/`, plus a one-line footer with three links — inside the existing 3 KB budget, or an explicit
`"404-shell-less": accepted` entry in STATUS.json so it stops reading as an oversight.

**3. contact.html is a form and nothing else at 1440 — PAGE**
Page/width: `contact.html` at 1440.
Screenshot: `cd2-crit-sp-contact@1440+0.png`, `cd2-crit-sp-contact@1440+440.png`

The whole page is 1346 px tall: a 640 px form card at x=152 and 650 px of empty paper to its right,
then the footer. The form itself is the cleanest on the site and I would not change it. The
composition around it is the gap — no response-time note, no alternative route, nothing in the right
half. The copy is frozen, so this is a layout call, not a content one.

*What "fixed" looks like:* a ruled aside in the empty column carrying what the site already says
elsewhere (the "Not affiliated with AWS" line, a link to the FAQ, the privacy link) — Smashing's
contact page does exactly this. Failing that, centre the single column so the emptiness is
symmetrical rather than all on one side.

### Nits

- The rust tick is the **fifth** list-marker treatment site-wide (see the reconciliation below).
  Even where it is correct — about.html — it is one more marker in an already crowded set.
- `.prose > .note` (paper-2 + 2 px `--line-2` left rule) and `.tips-box` (accent tint + 3 px accent
  left rule) are two callout languages with no stated rule distinguishing them. They live on
  different pages so a reader rarely meets both, and "fine print" vs "tip" is a defensible split —
  but it should be written down, not inferred.
- about.html's `<strong>` term on its own line above its description is a genuinely nice call and it
  survives the content gate untouched; worth keeping when the section is next trimmed.
- `--ink-3` at 6.0 : 1 for the 404 numeral rather than `--line-2` at ~1.4 : 1 was the right call, and
  the reasoning in the builder report is correct.

### What is genuinely good

`about.html` at both widths is the best-composed page in Wave 2 and close to the bar: one 68 ch
column flush left at the same 152 px as the header and footer, ruled h2 sections, an unruled first
heading, hairline definition rows, and three disclaimer paragraphs fused into one quiet block
without a word of copy changing. `privacy.html`'s twelve sections now scan as rhythm rather than a
wall. The contact form is the cleanest form on the site — one card, one primary action, a field
border that goes accent on focus in addition to the ring, and CSS-drawn status icons rather than
glyphs. CLS on about@768 went 0.160 → **0** and privacy@768 0.100 → **0**; that is the largest single
measured quality win in the wave. Every page in this area is under its own baseline weight,
Perf/A11y/BP/SEO are 100/100/100/100, and nothing needed an approval.

---
---

## Cross-area component reconciliation

Reconciled per rendered component, not per CSS class, from the screenshots above.

**Card shell — one system. Good.** `.roadmap-content`, `.cert-card`, `.salary-card`,
`.project-card`, `.book-card`, `.course-card`, `.tool-card`, `.calculator-container`,
`.contact-form` and `.guide-nav-link` all share `--surface` + 1 px `--line` + `--radius: 8px`, and a
sweep of every element in `main` on index.html found **zero `box-shadow`**. No uniform drop shadows,
no decorative gradients anywhere in the wave. That is the single biggest thing the site has going for
it and nothing here should put it back.

**Chip-shaped things — four different radii. Not one system.**

| Component | Radius | Where |
|---|---|---|
| `.code-lang` | 3 px | code headers (43×) |
| `.tag` / `.project-services span` / `.roadmap-skills span` / `.project-level` / `.course-level` / `.question-difficulty` | 5 px | listing pages |
| `.step-number`, `.roadmap-number` | 50 % | article, home |
| `.guide-aside a` below 64em | **999 px** | 11 project pages |

The TOC chips are the only full pills on the site and the code language chip the only 3 px radius;
both should join the 5 px family. *(Hue differences between the tinted chips are excluded this
round.)*

**List markers — five treatments. Wave 1 said "pick two"; it is now five.**
grey dot (`.guide-list`, project-card learn lists, course topics) · rust dot (`.salary-card li`,
`.tips-box li::marker`) · grey em-dash (`.cert-card li::before`) · rust drawn tick
(`.prose .feature-list`, `.feature-list`) · chevron `›` (`.resource-list`). This spans three of the
four areas, so no single builder can fix it — it needs one decision applied across the sheet.
Suggested: neutral dot for enumerations, chevron for navigable rows, nothing else.

**Callouts — two languages, no stated rule.** accent-tint + 3 px accent left rule (`.tips-box`, the
index salary note) vs `--paper-2` + 2 px grey left rule (`.prose > .note`, the 404 joke). Defensible
as tip vs fine print; write the rule down.

**Actions — four treatments, three of them justified.** filled orange (exactly one per page — this
discipline held everywhere I looked, including the Pluralsight panel) · quiet hairline outline
(`.project-link`, `.book-link`, `.course-link`, `.tool-card` links, `.btn-secondary`) · rust
underlined text link (`.cert-link`) · **a white card acting as a button (`.guide-nav-link`)**. The
fourth is the odd one; see article-template issue 4.

**Template tells counted at HEAD.** Emoji-as-icons: **57 on public pages** — 45 as diagram node
icons (greyscaled, content-frozen), 8 in `resources.html` course meta and 4 on `tools.html`, both of
those at full colour and both fixable with one shared rule. Decorative gradients: **0**. Uniform drop
shadows: **0** (the only shadow token in the sheet is `--shadow-drawer`). Card soup: one surviving
instance, `tools.html`.

---

## Summary for the panel

No area passes. Two of the four (static-pages 8.2, listing-pages 7.9) are close and fail on a small
number of nameable things; two (article-template 7.8, code-and-diagrams 7.4) fail on the headline
feature each was commissioned to build — an on-page nav that shows 3 of 7 sections on a phone, and
code blocks that ship six syntax-colour rules and zero highlighted tokens.

Three Wave-1 handoffs were taken well and should be protected: card soup on the home page became
ruled rows, the diagrams became legible at 390, and the section-rule treatment inside articles became
one width per viewport. Three were not taken: the desktop article void (halved, not fixed — now being
repaired by shell-r2), the diagram colour legend, and the roadmap measure (which got worse in
characters per line).

Independently of my scores, no area can pass the protocol gate this round: `WEIGHT: FAIL` (19 pages,
wave-wide, under consolidation), `index.html` SEO 92, and `resources.html` LCP 2.18 s.
`INTEGRITY: PASS` with zero approvals burned across four parallel builders is a genuinely good
result and should be said out loud.

One process note: `styles.css` and all 21 pages were rewritten by a fifth agent while I was
reviewing. All my evidence is timestamped to HEAD and the overlaps are marked inline, but the panel
should not accept a Wave-2 round-2 report that cannot say which tree it looked at.

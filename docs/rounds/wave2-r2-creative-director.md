# Wave 2 · Round 2 · Creative director

Tree scored: branch `facelift`, **HEAD `59ad633`**, working tree clean, frozen for the round
(`git status` clean at start and at the end of my measurement pass). Every number and every
screenshot below is from that tree. Scored against `docs/REFERENCES.md` (Stripe Docs, Cloudflare
Developer Docs, Smashing Magazine) only.

| Area | R1 | R2 | Verdict |
|------|----|----|---------|
| article-template | 7.8 | **8.7** / 10 | **PASS** |
| code-and-diagrams | 7.4 | **8.6** / 10 | **PASS** |
| listing-pages | 7.9 | **8.4** / 10 | **FAIL** |
| static-pages | 8.2 | **8.6** / 10 | **PASS** |

Header, drawer, footer, page-header band and tag/badge hues were Wave-1's; where shell r2 fixed
something I verified it and say so, I do not re-score it. `WEIGHT: FAIL` is wave-wide and is not a
listed pass criterion — recorded, not scored.

## Evidence

My own shots, all in `harness/out/peek/`, named `cd4-*.png`, taken from the frozen tree; drivers
`harness/out/cd4-shots.js`, `cd4-probe2.js`, `cd4-probe3.js` (git-ignored) and
`harness/out/cd4-inventory.json`. Whole-site snapshot: `harness/out/merged-r2/summary.json`
(63 runs, 21 pages × 390/768/1440, written 08:38Z) and `merged-r2/lighthouse/summary.json`
(7 pages, 08:39Z). I re-ran neither snap nor lh.

```
node harness/integrity.js compare --base baseline-2026-09-13
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

Site-wide from `merged-r2/summary.json`: `consoleErrors=3 pageErrors=0 failedRequests=3 axeSC=0
axeAll=0 hOverflow=none maxCLS=0.0187`. **All three console errors and all three failed requests
are on `admin.html`** (one per width) — not a public page and not in any of the four areas. Every
page in all four areas is 0/0/0. `maxCLS` is also `admin.html@768`; the highest in any scored area
is 0.0014.

Appliers, run on the frozen tree: `apply-shell.js --check` 0/19 · `apply-article.js --check` 0/11 ·
`apply-code.js --check` 0/11 (`43 code blocks, 1132 spans`). `node harness/weight.js` →
`WEIGHT: FAIL (19 pages over their gzip baseline)`, `styles.css` raw 42,682 / gzip 9,418.

---
---

# Area: article-template   Round: 2   Critic: creative director   Score: 8.7/10   Verdict: PASS

### Best screen

`cd4-mal@1440+0.png` — breadcrumb, `Advanced` badge, h1, subtitle, `Project Overview`, the
key-facts strip and `Prerequisites` all start on **one left edge at x=152**, with the rail at
1040 and `Project Overview` carrying the accent bar. This is the screen the area was commissioned
to produce and it now reads as a docs page, not a themed one.

### Screenshots looked at

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `cd4-mal@390+0.png` | Arrival at 390: `ON THIS PAGE` small-caps eyebrow, three 44 px chips with "Architecture" cut mid-word at the edge, then the overview and the dt-shrunk key facts (all three values start at x=129). |
| `cd4-mal@390+400.png` | Chip row leaving the top; `Difficulty / AWS Services / Cost` on one aligned column; prerequisites on grey dots. |
| `cd4-mal@390-chiprow.png` | The chip row isolated under the header — eyebrow present, third chip clipped, the 32 px veil fading the chip's *text* but not its white ground. |
| `cd4-mal@390-diagram.png` | Landing-zone diagram 1-up, 415 px tall, two hues only, 13 px detail lines, left-aligned note. |
| `cd4-mal@390-json.png` | `DENY-REGIONS-SCP.JSON` highlighted (keys blue, strings green), filename leading, `JSON` demoted to an outline chip, Copy the loudest control, right veil on. |
| `cd4-mal@390-yaml.png` | `ACCOUNT-BASELINE.YAML` — italic grey comments, green strings, blue booleans; keys dimmer than their values. |
| `cd4-mal@390-pagination.png` | Pagination: no cards. Two ruled rows, `PREVIOUS` / `ALL PROJECTS` eyebrows over the frozen link text. |
| `cd4-mal@768+380.png` | 768: six chips with "Code Examples" clipped; every rule 24→648 while the chip row runs 24→744. |
| `cd4-mal@1440+0.png` | **Best screen** (above). |
| `cd4-mal@1440+600.png` | Diagram at 840 px, right edge 992, 48 px clear of the rail at 1040. |
| `cd4-mal@1440-code.png` | First code block at 840 px on the 152 edge; rail marks `Code Examples`. |
| `cd4-mal@1440+3000.png` | Tips callout filling the viewport with the rail marking `Tips` — accent bar + `--accent-strong` + 700. |

Measured at 1440 (`cd4-shots.js`): `.brand` 152 · `.page-header h1` 152→775 · `.guide-overview h2`
152→992 · `.guide-section` 152→992 · `.guide-meta` 152→776 · `.architecture-diagram` 152→992 ·
`.code-block` 152→992 (all five blocks) · `.guide-aside nav` 1040→1288 · `.project-guide`
152→1288 · footer content 152. Chip row at 390: `scrollWidth 846 / clientWidth 342`,
**7 chips at exactly 44 px, radius 8px, `partiallyVisibleChips = 1`**, eyebrow visible
(`font-variant-caps: all-small-caps`), veil `32px`. Rail at scrollY 3000: **exactly one**
`aria-current="location"`, on `Tips`. `id="step-N"` present (7 matches on the landing-zone page).

Gate results: console=0 axeSC=0 perf=100 a11y=100 bp=100 seo=100 lcp=1.65 s tbt=0 ms cls=0 @390/768,
**0.0012–0.0014 @1440 on all 11 project pages** integrity=PASS

### Round-1 issues re-checked

| R1 # | Issue | Status | Evidence |
|---|---|---|---|
| 1 | 132 px register loss at ≥64em | **fixed** | `cd4-mal@1440+0.png`; brand/h1/overview/section all 152 |
| 2 | Chip row 3 of 7, no label, no affordance, 29.9 px | **fixed** | `cd4-mal@390+0.png`; eyebrow + 44 px + 1 partial chip + veil |
| 3 | No current-section indicator | **fixed** | `cd4-mal@1440+3000.png`; one `aria-current`, accent bar |
| 4 | Pagination = two empty white boxes | **fixed** | `cd4-mal@390-pagination.png`; ruled two-up, eyebrows |
| 5 | Diagram/code trapped in the 623 px measure | **fixed** | `cd4-mal@1440+600.png`; 840 px, 48 px clear of the rail |
| 6 | 768 chip row's 720 px overlay bar | **partial** | `cd4-mal@768+380.png`; the grey scrollbar is gone, the 96 px width mismatch is not |
| nit | Key facts `repeat(3, 1fr)` uneven | **not fixed** | `cd4-mal@1440+0.png`, `cd4-mal@768+380.png` |
| nit | Chip radius 999px, alone on the site | **partial** | 999px → **8px**, not the site's 5 px chip family |
| nit | Tips h2 + callout say the same thing | **not fixed** (frozen text) | `cd4-mal@1440+3000.png` |

### Ranked issues (worst first)

**1. The key-facts strip still gives one word a third of the page — COMPONENT**
Page/width: all 11 project pages at 768 and 1440.
Screenshot: `cd4-mal@1440+0.png`, `cd4-mal@768+380.png`
`.guide-meta` is `repeat(3, 1fr)`, so "Difficulty: Advanced" holds 208 px for one word while "AWS
Services" wraps to three lines and "Cost" to two in the same 208 px. The strip is the first thing
below the h2 on every project page and it is the only element in the article that does not read as
measured. The r2 request fixed the *phone* dt (item 7, done well — `dd` left edges 129/129/129)
and left the desktop strip alone.
*Fixed looks like:* content-sized tracks — `grid-template-columns: repeat(3, auto)` with the gap
carrying the rhythm, or `fit-content` per track — so the three cells are as wide as their content
and the rules fall where the text stops.

**2. The pagination eyebrow repeats the frozen link text word for word — COMPONENT**
Page/width: all 11 project pages, all widths.
Screenshot: `cd4-mal@390-pagination.png`
The card shell is gone and the ruled two-up is right. But the new `::before` eyebrow reads
`PREVIOUS` directly above `← Previous Project`, and `ALL PROJECTS` directly above `Back to All
Projects`. Cloudflare's pattern works because the eyebrow says the *direction* and the link says
the *destination*; here both say the direction, twice, in two type sizes. The destination is never
named, so the reader learns nothing from the second line.
*Fixed looks like:* drop the eyebrow and let the ruled row plus the frozen arrow carry direction,
or keep the eyebrow only where it adds something the link text does not (e.g. nothing on the
`guide-nav-index` cell, whose link text already says "All Projects").

**3. The chip-row veil is invisible against the chips it is veiling — COMPONENT**
Page/width: all 11 project pages at 390 and 768.
Screenshot: `cd4-mal@390-chiprow.png`, `cd4-mal@390+400.png`
`.guide-aside nav::after` paints `linear-gradient(270deg, var(--paper) 35%, …)` — `--paper` is
`#faf9f6` and the chips are `--surface` `#fff`, a 2 % difference, so over a chip the veil changes
nothing but the text. The affordance is carried almost entirely by the mid-word cut, which does
work; the veil the request asked for ("like the code veil") does not, because the code veil is a
light wash on a near-black ground and this one is white on white.
*Fixed looks like:* fade to the chip ground rather than the page ground (`--surface`), or drop the
veil and keep the cut plus the eyebrow, which are doing the work already.

**4. Two chip radii for two on-page-nav components introduced this round — COMPONENT (cross-area)**
Page/width: `project-*.html` vs `projects.html` at 390.
Screenshot: `cd4-mal@390+0.png` (TOC chips, measured `border-radius: 8px`) vs
`cd4-projects@390+0.png` (level-jump chips, measured `5px`)
R1 asked the 999 px TOC pills to join the 5 px chip family. They went to 8 px (the *card* radius)
while listing-pages' new jump chips went to 5 px. Two 44 px white nav chips on two pages of the
same site now differ only by 3 px of radius, which is the kind of difference that reads as
carelessness rather than as a distinction.
*Fixed looks like:* one value. 5 px, which is what `.tag`, `.project-level`, `.course-level`,
`.question-difficulty`, `.book-tag` and `.level-jump a` already use.

**5. The rail's `aria-current` costs a measurable layout shift — COMPONENT**
Page/width: all 11 project pages at 1440.
Evidence: `merged-r2/summary.json` — `cls 0.0012–0.0014` at 1440 on 11 of 11 project pages, 0 in
round 1 on the same pages.
Well inside the 0.05 budget, so it is not a gate failure, and the observer itself is good work.
But it is a self-inflicted shift: the `font-weight: 700` and the `margin-left: -24px` on
`a[aria-current]` reflow the rail one frame after load.
*Fixed looks like:* reserve the bar (a transparent 2 px left border on every rail link, accent only
when current) and get the emphasis from colour rather than weight — or keep the weight and set the
link's width so the 700 face does not change the box.

### Nits

- `Tips` is an h2 whose entire content is one callout — heading and box say the same thing twice
  (`cd4-mal@1440+3000.png`). Text frozen; a panel decision.
- At 768 the chip row runs 24→744 while every rule in the article runs 24→648
  (`cd4-mal@768+380.png`). It now reads as a deliberate bleed rather than as a stray bar, but it is
  still the one element on the page with its own right edge.
- The `↓` under the `IAM Identity Center | SCPs` row at 1440 lands in the gutter between the
  Security and Workloads OU boxes (`cd4-mal@1440+600.png`) — it feeds both, but it points at the
  seam.
- Step number circles (`.step-number`, 50 %, peach) and roadmap number circles
  (`.roadmap-number`, 50 %, `--paper-2`) are now both 50 % discs — closer than r1, still two fills
  for one idea.

### What is genuinely good

Five of the six ranked r1 findings are fixed, verified, and fixed the way a designer would fix
them rather than the way a checklist would. The register fix is exact (152 on eight elements I
measured), the figure breakout stops 48 px short of the rail instead of colliding with it, the
chip row puts the on-page nav on the *first* phone screen (docY 446, was 843) with a real eyebrow
and a chip cut mid-word, the rail's current state is correct under both jumps and wheel scroll with
exactly one `aria-current` at all times, and the pagination lost its card shell without losing the
frozen text. Zero console errors, zero axe serious/critical, Lighthouse 100/100/100/100 on the
landing-zone page, `INTEGRITY: PASS`.

---
---

# Area: code-and-diagrams   Round: 2   Critic: creative director   Score: 8.6/10   Verdict: PASS

### Worst screen

`cd4-mrgn@320-diagram.png` — `project-multi-region-active-active.html` at 320. The topology is now
**correct** (Region A and Region B side by side, `↔ Replication` centred beneath the pair), which
was r1's worst screen and is the single biggest correctness win of the round. What is left is
typographic: `overflow-wrap: break-word` splits the node name **"DynamoDB" into "Dyna / moDB"** in
both regions, and the group label breaks as `REGION A (US- / EAST-1)`. A diagram whose job is to
name AWS services is naming one of them wrong.

### Screenshots looked at

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `cd4-mrgn@390-diagram.png` | **The r1 defect is gone**: Region A \| Region B on one row, `↔ Replication` centred beneath, 415 px tall, `scrollWidth − clientWidth = 0`. |
| `cd4-mrgn@320-diagram.png` | **Worst screen** (above). Same correct topology, "Dyna/moDB" and "US-/EAST-1". |
| `cd4-mal@390-diagram.png` | Landing zone 1-up at 390: green "runs", rose "guards", no blue on this page; 13 px detail lines; the note is left-aligned now. |
| `cd4-mal@1440+600.png` | Same diagram at 840 px — three hues at most, the accent reserved for arrows. |
| `cd4-mal@390-json.png` | JSON highlighted: keys `#bcd6f0`, strings `#a5d6a7`; header = filename (ink, 13 px mono, 650) → outline `JSON` chip (11 px, `#a9b6c2`, 1 px `#2e3d4e`, 7.7 : 1) → `Copy` (filled, loudest). |
| `cd4-mal@390-yaml.png` | YAML: italic grey comments, green strings, purple numbers, blue booleans — and keys *dimmer* than their values. |
| `cd4-mal@390-code-scrolled.png` | `pre.scrollLeft = 69` (max): the **left veil appears** over the clipped `rsion"` / `atement"` and the right veil is gone. The mirrored mechanism works. |
| `cd4-eks@1440-code.png` | `CLUSTER-CONFIG.YAML` in the 838 px track: the long `enableTypes` line now fits, no overflow, therefore no veil. 33 spans (`variable 22, string 4, number 4, keyword 3`). |
| `cd4-sra@390-midtall.png` | 600 px into the 1,581 px `LAMBDA_FUNCTION.PY` block: **code header pinned at viewport y=56, Copy at y=64, 54 × 44, fully visible.** Python keywords/strings/functions/numbers all distinct. |
| `cd4-mal@1440-code.png` | The 840 px track at desktop; JSON occupying ~half of it. |

Measured: code `font-size: 14px / line-height: 21.7px` (1.55). Syntax colours on `--code-bg`
`#11181f`: comment `#9aa7b0`, keyword `#8ab4f8`, string `#a5d6a7`, variable `#bcd6f0`, number
`#d6c3f5` — all ≥ 7 : 1, which is the `REFERENCES.md` dark-theme bar, not just 4.5 : 1.
`apply-code.js --check` → `43 code blocks, 1132 spans`, `0/11 pages would change`, and
`INTEGRITY: PASS` confirms `pre` text is byte-identical.

Gate results: console=0 axeSC=0 perf=100 a11y=100 bp=100 seo=100 lcp=1.65 s tbt=0 ms cls=0 @390/768,
0.0013 @1440 integrity=PASS

### Round-1 issues re-checked

| R1 # | Issue | Status | Evidence |
|---|---|---|---|
| 1 | No syntax highlighting anywhere (43 blocks, 0 spans) | **fixed** | `cd4-mal@390-json.png`, `cd4-mal@390-yaml.png`, `cd4-sra@390-midtall.png`, `cd4-eks@1440-code.png`; 1,132 spans |
| 2 | Multi-region topology inverted at 390 | **fixed** | `cd4-mrgn@390-diagram.png`, `cd4-mrgn@320-diagram.png` |
| 3 | Six node hues, two indistinguishable, no legend | **partial** | three hues (`cd4-mal@390-diagram.png`); the accent no longer doubles as a role; **no legend** |
| 4 | Code header hierarchy inverted | **partial** | `cd4-mal@390-json.png`; label leads, chip demoted, Copy loudest — but the chip is still redundant on 43/43 and the filename is still uppercased |
| 5 | A scrolled block gives no way back | **fixed** | `cd4-mal@390-code-scrolled.png` |
| — (reader) | Copy unreachable on tall blocks | **fixed** | `cd4-sra@390-midtall.png` |
| nit | `.arch-note` centred | **fixed** | `cd4-mal@390-diagram.png` |
| nit | `.code-inline` styled and unused | **fixed** (deleted) | builder §0.6 |

### Ranked issues (worst first)

**1. Node names and group labels break mid-word at narrow widths — COMPONENT**
Page/width: `project-multi-region-active-active.html` at 320 (and any 2-up `.arch-pair` below ~360).
Screenshot: `cd4-mrgn@320-diagram.png`
`overflow-wrap: break-word` on `.arch-component-name` traded an overflow for a broken product name:
`Dyna / moDB`. The group label breaks the same way — `REGION A (US- / EAST-1)` — which is the exact
defect r1 recorded ("the label also breaks mid-token") carried forward into the new layout. Both
frozen references let diagrams *reflow*; neither lets them hyphenate a service name.
*Fixed looks like:* stack the pair below ~360 px (the landing-zone OU row has no arrow and is
unaffected, so the height the 2-up was protecting is not at risk at 320), or keep the pair and give
`.arch-component-name` `overflow-wrap: normal` with a smaller type step so "DynamoDB" fits whole.
Either way no node name may hyphenate.

**2. Three node hues and still no legend — COMPONENT**
Page/width: all 11 project pages, all widths.
Screenshot: `cd4-mal@390-diagram.png`, `cd4-mal@1440+600.png`, `cd4-mrgn@390-diagram.png`
The reduction is real and it fixed the worse half of the r1 finding: `#f58ab8`/`#f08b8b` are gone,
and the brand accent is now *only* flow. But a reader still meets a green stripe, a rose stripe and
a blue stripe with nothing anywhere on the page saying what they encode. On the landing-zone page
two hues carry six nodes; on multi-region, three. The builder's reason for not printing role words
(§3.4 — the existing classes are approximate, so a printed label would assert something false) is
correct and I accept it. That makes this a panel item, not a builder failure.
*Fixed looks like:* one approved line of content per diagram (`compute · data · security`) as a
legend row, **or** an explicit decision recorded in `docs/STATUS.json` that the stripes are
decorative and the names carry the meaning — at which point the stripes should probably all go
neutral, because a decorative three-colour code still invites decoding.

**3. The language chip is redundant on 43 of 43 blocks and the filename is never shown as written — COMPONENT**
Page/width: all 43 blocks, all widths.
Screenshot: `cd4-mal@390-json.png`, `cd4-eks@1440-code.png`, `cd4-mal@1440-code.png`
The chip is now quiet (11 px, `#a9b6c2`, outline, 7.7 : 1) and Copy is now the loudest control —
that half is done and done well. The other half of r1 #4 was not: `CLUSTER-CONFIG.YAML` still
carries a `YAML` chip beside it, and `text-transform: uppercase` means the real artefact name
(`cluster-config.yaml`) is never shown. The uppercase is genuinely load-bearing under the content
gate (Chromium applies `text-transform` to `innerText`), so that half is blocked; the redundancy is
not.
*Fixed looks like:* delete `.code-lang` on blocks whose `.code-label` already ends in the same
token — which is all 43 — and keep it only if a block ever ships without a filename. The header
then reads filename → Copy, which is the Stripe anatomy exactly.

**4. YAML keys are quieter than their values — COMPONENT**
Page/width: the 13 YAML blocks, all widths.
Screenshot: `cd4-mal@390-yaml.png`, `cd4-eks@1440-code.png`
YAML keys are tokenised as `.variable` `#bcd6f0`, which is *dimmer* than the block's plain text
`#e6edf3`. So in `region: us-east-1` the structural anchor recedes and the datum advances — the
opposite of the JSON blocks on the same page, where keys are the coloured anchor. The eye lands on
the values and has to work back to find the key it wants.
*Fixed looks like:* give YAML keys the same treatment JSON keys get (`.variable` is fine if the
plain text is the quiet one, or promote keys to `.keyword`), so that across 21 blocks of two
formats "the name of the thing" has one colour.

**5. A fixed 840 px track wraps 400 px of code in a half-empty slab at 1440 — COMPONENT**
Page/width: all 11 project pages at ≥64em.
Screenshot: `cd4-mal@1440-code.png`
The measure breakout (article-template item 1) is right for diagrams and right for the long Bash and
YAML lines. It is applied unconditionally, so `deny-regions-scp.json` — whose longest line is
~400 px — sits in an 840 px near-black rectangle with half of it empty. The block is the largest
dark shape on the page and half of it is holding nothing.
*Fixed looks like:* `width: fit-content; max-width: 100%` on `.code-block` at ≥64em (or on the
`pre`), so a block is as wide as it needs and no wider, and only the ones that overflow take the
full column.

### Nits

- `.code-lang` is 3 px radius and `.code-copy` is 5 px — two radii inside one 61 px header bar.
  R1 asked the 3 px chip to join the 5 px family; it did not.
- The sticky code header pins directly under the navy site header
  (`cd4-sra@390-midtall.png`); two dark bars stack with only a 1-value tone difference between
  `--navy #15202b` and `--code-head #18222c`.
- 45 greyscaled diagram emoji still carry no information — `📜` is both "SCPs" and "Log Archive".
  Content-frozen; recorded because the protocol asks. See the inventory below.
- The left veil after scrolling is correct but very quiet at 390 (`cd4-mal@390-code-scrolled.png`);
  it is doing less work than the right one because there is less clipped text to fade.

### What is genuinely good

The item r1 said "was reachable and was not done" is now done properly: a build-time tokenizer with
an entity-atomising scanner, a text-drift assertion, idempotency, `--check`, eight grammars,
1,132 spans across 43 blocks, colours at ≥ 7 : 1, and `INTEGRITY: PASS` proving `pre.textContent`
is byte-identical. The Python block at `cd4-sra@390-midtall.png` is the best-looking thing on the
site. The sticky-header fix (`overflow: hidden` → `clip`, because `hidden` makes the block a
scrollport and silently kills `sticky`) is the kind of diagnosis that does not happen by accident.
The multi-region topology is correct at 320, 390, 768 and 1440 with `scrollWidth − clientWidth = 0`
everywhere.

---
---

# Area: listing-pages   Round: 2   Critic: creative director   Score: 8.4/10   Verdict: FAIL

### Worst screen

`cd4-res@1440-courses.png` — `resources.html`. Three things in one frame that no other page on the
site does: a **magenta `#9d174d`** eyebrow ("pluralsight"), a magenta 3 px left rule on the promo
panel, and magenta-outlined `LEARNING PATH` chips on the course cards below it — plus **full-colour
`🕑` and `🎓` emoji** in every course meta row. Four pages away, `tools.html` shows the same builder
greyscaling four emoji with one declaration in the same round. This is the one screen in Wave 2
where the site has two accents and a template tell at the same time.

### Screenshots looked at

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `cd4-tools@1440+1850.png` | **The r1 worst screen, fixed**: four ruled rows — greyscale icon, title, one-line description, quiet ink link + `↗`. No cards, no four hairline buttons. |
| `cd4-tools@390+0.png` | Tools at 390: page header, ruled section head, calculator card first. |
| `cd4-tools@390+1400.png` | Calculator checkboxes: 20 × 20 inputs, 44 px rows, orange ticks; the box centres between the two lines of a wrapping label. |
| `cd4-tools@768+1300.png` | The same rows at 768 with the action already in its own column. |
| `cd4-index@390+2400.png` | Roadmap at 390: 1.5 rem gutter, 302 px card, 34–40 characters per line. |
| `cd4-index@1440+2400.png` | Roadmap at 1440 (paragraph capped at 388 px while the rule and chips run the full 600 px card) and the cert row: hairline only, no coloured bars. |
| `cd4-index@390+4200.png` | Cert cards at 390 — small-caps eyebrow, em-dash spec list, rust underlined "Learn More" at 80.6 × 44.8. |
| `cd4-index@1440+3400.png` | Three ruled resource columns; the `›` affordance is still barely visible. |
| `cd4-index@1440-salary.png` | Three **equal** salary panels, no orange tier rule — and the FAQ rows below ending at ~988 under a section rule that runs to 1288. |
| `cd4-index@390-salary.png` | The same three panels stacked at 390. |
| `cd4-projects@390+0.png` | The level-jump nav as the first thing under the page header: three 44 px chips (83.5/109/88.7 × 44, radius 5 px). |
| `cd4-res@390+400.png` | Book card at 390: a 120 × 160 mount with a hairline, jacket contained. The grey slab is gone. |
| `cd4-res@1440+400.png` | 2-up book cards, six identical mounts; SAP-C02 still shows *The Kubernetes Book* (HUMAN_TODO). |
| `cd4-res@1440-courses.png` | **Worst screen** (above). |
| `cd4-res@390-courses.png` | The same magenta chips and colour emoji at 390. |
| `cd4-ip@390-open.png` | Interview row open: real `<button>`, `×` in a left gutter beside the first word, "Click to hide answer", answer indented to the question. |

Measured (`cd4-shots.js`, `cd4-probe2.js`): tool rows 342 × 145 @390 / 1136 × 85 @1440, no
background, no radius, `border-top 1px #e6e2da`, icons `grayscale(1) opacity .7` at 17 px, links
87.5–96.1 × **45.8**. Roadmap card **302 px** @390; first-line characters @1440 **56/59/56/58/51/61**.
Cert cards `border-top: 1px rgb(230,226,218)` ×4, spec rules all at y=3161, links all at y=3323,
80.6 × 44.8. `.salary-card.featured` top border `1px rgb(230,226,218)` — identical to its
neighbours. Book mounts 120 × 160 with `object-fit: contain` at both widths. Checkboxes 20 × 20 ×6,
label rows 44/56.1/56.1/44/56.1/44. Interview: **17 `BUTTON`**, 16 closed / 1 open after a click,
answer `display: block`, hint text flipped.

Gate results: console=0 axeSC=0 cls=0 (index/projects/tools/interview-prep/resources, all widths)
perf=100 (99 on resources) a11y=100 bp=100 seo=**92 on index and tools** (`link-text`, frozen)
/100 elsewhere · **resources LCP 2.18 s** (budget 1.8) integrity=PASS

### Round-1 issues re-checked

| R1 # | Issue | Status | Evidence |
|---|---|---|---|
| 1a | tools.html four emoji cards + four generic buttons | **fixed** | `cd4-tools@1440+1850.png` |
| 1b | 12 full-colour emoji on listing pages (4 tools + 8 resources) | **half fixed** | tools greyscaled; **8 still at full colour on resources.html** (`cd4-res@1440-courses.png`) |
| 2 | Roadmap ~100 cpl at 1440 | **fixed** (overshot) | 51–61 cpl (`cd4-index@1440+2400.png`) |
| 3 | Book-cover plate an unstyled image well | **fixed** | `cd4-res@390+400.png`, `cd4-res@1440+400.png` |
| 4 | Four coloured cert top bars | **fixed** | `cd4-index@390+4200.png`; all four `1px #e6e2da` |
| 5 | "Featured" salary card = pricing table | **fixed** | `cd4-index@1440-salary.png` |
| 6 | index SEO 92, four "Learn More" | **not fixed** (HUMAN_TODO A5) | `merged-r2/lighthouse/summary.json` |
| 7 | resources LCP 2.18 s | **not fixed** (other owner) | `merged-r2/lighthouse/summary.json`, unchanged from r1 |
| nit | Cert spec rules stagger | **fixed** | measured, all four at y=3161 |
| nit | `sap-c02.jpg` is the wrong book | **not fixed** (HUMAN_TODO) | `cd4-res@1440+400.png` |
| nit | Difficulty badge inline in the question sentence | **not fixed** | `cd4-ip@390-open.png` |
| nit | `›` on resource rows nearly invisible | **not fixed** | `cd4-index@1440+3400.png` |
| nit | `.faq-list` 52 rem = a fourth right edge | **not fixed** | `cd4-index@1440-salary.png` |
| nit | Pink `LEARNING PATH` / `COURSE` chips (deferred to shell in r1) | **not fixed; now scoreable** | `cd4-res@1440-courses.png`, `styles.css:381–386` |

### Ranked issues (worst first)

**1. A second accent — `#9d174d` magenta — on resources.html — PAGE + COMPONENT**
Page/width: `resources.html` at 390 and 1440.
Screenshot: `cd4-res@1440-courses.png`, `cd4-res@390-courses.png`
`styles.css` lines **381–386, inside the `[listing-pages]` section**: `.pluralsight-promo`
`border-left: 3px solid #9d174d`, `.ps-logo { color: #9d174d }`, `.course-level { border-color:
#f3c6de; color: #9d174d }`. The site's accent is `--accent #c2410c` / `--aws-orange #ff9900`;
every other tinted chip on the site belongs to one three-hue level family (green/amber/rose) that
shell r2 reconciled. This is a fourth hue, saturated, and it is on **chips**, not only on the
partner panel — so it reads as a site accent rather than as a partner's brand. R1 raised it and
deferred it to the concurrent shell builder; shell r2 has landed and it survived inside this
area's own section, which makes it this area's now.
*Fixed looks like:* the magenta stays only where it is a partner's mark — the `.ps-logo`
wordmark — and `.pluralsight-promo`'s rule and every `.course-level` chip move to the site's
neutral/level vocabulary. One accent, as the brief and all three references have.

**2. Eight full-colour emoji left on resources.html after the same builder greyscaled four on tools.html — PAGE**
Page/width: `resources.html` at 390 and 1440.
Screenshot: `cd4-res@1440-courses.png`, `cd4-res@390-courses.png`
Counted from `cd4-inventory.json`: `🕑 🎓 🕑 🎓 🕑 🎓 🕑 🎓` in `.course-meta`, all `filter: none,
opacity: 1`. `.course-meta` is styled at `styles.css:389` — in this area's own section, four lines
before `.tool-icon`'s `filter: grayscale(1); opacity: .7` at line 422. R1 named both halves of this
in one sentence and asked for "one shared declaration, ~40 B". One half shipped. Full-colour emoji
is the template tell the CD brief names by name, and it is now the only place on 20 public pages
where one survives.
*Fixed looks like:* `.course-meta span { filter: grayscale(1); opacity: .7 }` — one declaration,
no markup change, no approval, identical to the rule already in the file.

**3. The roadmap paragraph is now too narrow and stops short of its own card — COMPONENT**
Page/width: `index.html` at 1440 (and ≥ ~1100).
Screenshot: `cd4-index@1440+2400.png`, `cd4-index@390+2400.png`
`.roadmap-content p { max-width: 48ch }` = 388 px inside a 600 px card at 15 px, giving
**51–61 characters** per line. R1's finding was ~100 cpl and the reference band is 65–75; the fix
went past the band in the other direction. The visible cost is composition, not reading: the
paragraph ends 212 px short of the hairline rule and the skill-chip row directly beneath it, so
each of the six cards has a ragged notch on its right side. At 390 the same cap plus the card
leaves 34–40 cpl, the narrowest measure on the site.
*Fixed looks like:* land inside 65–75 — measured, not nominal (the builder is right that `ch` runs
~19 % wide against this font). ~58ch at the current size, or keep 48ch and pull the rule and chip
row in to the same edge so the card has one right edge instead of two.

**4. The FAQ block still gives index.html a fourth right edge — COMPONENT**
Page/width: `index.html` at 1440.
Screenshot: `cd4-index@1440-salary.png`
The `Frequently Asked Questions` section rule runs 152→1288; the question rows beneath it stop at
~988 (`.faq-list { max-width: 52rem }`). One rule and the rows it introduces disagree by 300 px in
the same frame. Carried from r1 unchanged.
*Fixed looks like:* the section rule matches the content it rules — cap the heading block to the
same 52 rem, or let the rows run to the container and cap only the answer paragraphs (which is
what `.faq-answer p` already does).

**5. At 1440 a tool row's action sits ~1,000 px from the thing it acts on — PAGE**
Page/width: `tools.html` at 1440.
Screenshot: `cd4-tools@1440+1850.png`
The row is 1,136 px wide with the title at x=200 and `Open Tool ↗` right-aligned at ~1,200. The
rows are otherwise the best thing on the page, but at desktop the eye has to cross the full
container to get from "AWS Pricing Calculator" to its link, and four such links stack in a column
that belongs to no other element.
*Fixed looks like:* cap the row's content at the reading measure so the action lands ~68 ch from
the title, or make the whole row the link and demote the text link to an `↗` marker.

### Nits

- The checkbox on a two-line calculator label centres between the two lines rather than aligning to
  the first (`cd4-tools@390+1400.png`).
- The interview difficulty chip is still inside the question sentence
  (`cd4-ip@390-open.png`) — "…When would you use each? `Easy`".
- The `›` on the index resource rows carries the whole component's affordance and is still the
  faintest mark on the page (`cd4-index@1440+3400.png`).
- Book mounts are `--paper-2` ground; portrait jackets like *The Phoenix Project* leave visible
  side bars (`cd4-res@1440+400.png`). This is what a mount is for and it reads correctly — noting
  it only so the next round does not "fix" it.
- `sap-c02.jpg` is still *The Kubernetes Book*; `resources.html` still has no affiliate disclosure
  and no `rel="sponsored"`; index/tools SEO 92 on four frozen "Learn More". All HUMAN_TODO, none
  chargeable to this builder, all still true.

### What is genuinely good

`tools.html` went from the worst screen in Wave 2 to a page I would ship: four ruled rows, one
greyscale icon gutter, a real one-line description, a quiet ink action with an external marker, and
the calculator still holding the page's single orange button. The cert row is now hairline-only with
its spec rules and links on one measured baseline. The salary cards are three equal panels. The book
mounts are 120 × 160 with a hairline and `contain`. The projects level-jump is exactly the affordance
the phone page was missing, at 44 px, with `data-ui` keeping the gate clean. Seventeen real
`<button>`s with the question text kept outside them and `aria-labelledby` doing the naming is a
genuinely clever reading of the content freeze. CLS is **0 on every listing page at every width**,
including `resources.html`, which was the only non-zero page in r1.

This area fails on two cheap, nameable things — one CSS declaration for the emoji and one colour
decision for the magenta — not on its structure.

---
---

# Area: static-pages   Round: 2   Critic: creative director   Score: 8.6/10   Verdict: PASS

### Worst screen

`cd4-404@1440+0.png` — `404.html`. The register complaint is fixed (numeral, h1, copy, note and CTA
all flush left at **152**, the dead band above the cloud gone). What replaced it does not read as
this site: a **`--paper-2` light-grey strip** where every other page carries a navy `#15202b` band,
holding a lone 16 px orange cloud with no wordmark; then the content; then **260 px of empty paper
and no footer**, with one way out. The site's brand appears on this page exactly once, as an
unlabelled glyph on a grey toolbar.

### Screenshots looked at

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `cd4-privacy@1440+0.png` | **The r1 worst screen, fixed**: one 68 ch column at 152, ruled h2s, and every list row led by a quiet grey em-dash instead of a rust tick. |
| `cd4-privacy@390+900.png` | "How We Use Your Information" at 390 — "Display relevant advertisements" no longer reads as a benefit. |
| `cd4-contact@390+0.png` | Form card, four 14 px labels, ≥ 44 px fields, one orange submit. |
| `cd4-contact@390-success.png` | Success state set via Playwright: green tint, drawn tick, **above** the button at 500→576 with the button at 600→647 — both fully inside the 844 px viewport. |
| `cd4-404@390+0.png` | 404 at 390: grey strip + cloud, numeral, h1, copy, note, one CTA; page ends at 549 px in an 844 px viewport. |
| `cd4-404@1440+0.png` | **Worst screen** (above). |

Measured: `.feature-list li::before` on privacy = `content: "—"`, `color: rgb(216,210,198)`,
`border-width: 0`, on **17 rows** in the first block (32 across the page); about.html keeps the drawn
tick. `privacy.html` @1440: `.page-header h1`.left = `.prose`.left = `.prose h2`.left = **152**;
`.note` 518 px at 15 px = 59.8 cpl. `contact.html`: status `aboveBtn = true`, `fullyVisible = true`,
label `font-size: 14px`. `404.html`: `body > header.strip` = 0,0,1440×64; h1 left **152** at 1440
and **24** at 390; `document.body.scrollHeight` 637 in a 900 px viewport (549 in 844 at 390); one
`<a>`, `href="index.html"`.

Gate results: console=0 axeSC=0 cls=0 (about/contact/privacy/404, all three widths) perf=100
a11y=100 bp=100 seo=100 lcp=1.5 s (about) integrity=PASS.
`contact.html` Lighthouse 100/100/100/100 · LCP 1.38 s is from the builder's `w2r2s` run —
`merged-r2/lighthouse/` covers 7 pages and does not include contact or 404.

### Round-1 issues re-checked

| R1 # | Issue | Status | Evidence |
|---|---|---|---|
| 1 | Accent check marks as privacy list markers | **fixed** | `cd4-privacy@1440+0.png`, `cd4-privacy@390+900.png`; `content: "—"`, `--line-2` |
| 2 | 404.html is a different website | **partial** | `cd4-404@1440+0.png`; register fixed, shell match not |
| 3 | contact.html is a form and nothing else at 1440 | **not fixed, by instruction** | request item 4 told the builder to verify, not rebuild; left edges measured equal at 152 |
| — (reader) | Status message off-screen after submit | **fixed** | `cd4-contact@390-success.png` |
| — (reader) | `.note` 83 cpl | **fixed** | 59.8 cpl measured |
| nit | Labels 13 → 14 px | **fixed** | measured 14 px ×4 |
| nit | Two callout languages with no stated rule | **not fixed** | inventory below |

### Ranked issues (worst first)

**1. The 404 header strip is the wrong colour and the page still has no footer and one door — PAGE**
Page/width: `404.html` at 390 and 1440.
Screenshot: `cd4-404@1440+0.png`, `cd4-404@390+0.png`
The builder is right that the wordmark text is not on the page and may not be added without an
approval, and right that the `☁` glyph is gated text. Neither of those blocks the *colour*: every
other page in the site opens with a navy `#15202b` band, and this one opens with a `--paper-2`
light-grey strip. So the one half of "match the shell visually" that needed no approval — the
band's ground — was not taken, and what shipped reads as an empty toolbar rather than as the site's
header. Below the fold the page is 637 px in a 900 px viewport with no footer rule and a single
link, so it is still the only page on the site a reader can reach and not get back from except by
one door.
*Fixed looks like:* the strip on `--navy` with the existing orange cloud at the shell's 24 px and
the shell's 56/64 px height — pure colour, zero content, zero approvals — so the page opens the way
every other page opens. The footer/second-door half stays where the builder put it: blocked on a
content approval, and it should be granted or recorded as declined in `docs/STATUS.json` rather
than carried a third round.

**2. contact.html at 1440 is still a form and 650 px of empty paper — PAGE**
Page/width: `contact.html` at 1440.
Screenshot: (r1 `cd2-crit-sp-contact@1440+0.png`; unchanged geometry re-measured this round —
`.contact-form`.left = h1.left = 152, card 640 px)
I am not charging the builder for this: the r2 request explicitly said "nothing new in text — use
the existing subtitle and generous margins", and that is exactly what was built, with the left
edges measured equal and the desktop padding raised to `--sp-6`. But the screen is unchanged from
r1 and it still reads as a page that stopped halfway. The builder has costed the fix (three
approved strings, ~15 lines of CSS, ~10 of markup).
*Fixed looks like:* a panel decision either way — approve the three strings for a ruled companion
aside (the "not affiliated with AWS" line, the FAQ link, the privacy link, all of which the site
already says elsewhere), or record that the single left-aligned column is the accepted composition
so it stops being raised.

**3. The `.note` introduces a second measure inside the same column — COMPONENT**
Page/width: `about.html` and `privacy.html` at 1440.
Screenshot: `cd4-privacy@1440+0.png`
`.prose > .note` is capped at 64ch on its own 15 px type = **518 px**, inside a `.prose` column that
runs 624 px. The fix was the right call for reading (83 → 59.8 cpl) and the em-based cap is the
right mechanism, but the visible result is a quiet block that ends 106 px short of every paragraph
above and below it, with its left rule the only thing tying it to the column.
*Fixed looks like:* cap the note to the column (`max-width: 100%`) and get the shorter measure from
its own padding, so the note's right edge sits on the prose edge and the inset reads as deliberate.

### Nits

- The four collection rows on `privacy.html` each get a full hairline rule, which is generous for a
  two-word item ("Operating system") — a 4-item list reads as a 4-row table
  (`cd4-privacy@1440+0.png`). It is consistent and calm; noting it as a taste call, not a defect.
- Two callout languages still have no written rule: accent tint + 3 px accent left rule
  (`.tips-box`, `.salary-note`, both `border-radius: 0 8px 8px 0`) vs `--paper-2` + 2 px grey left
  rule (`.note`, the 404 joke, `border-radius: 0`). Defensible as tip vs fine print; still
  undocumented after two rounds.
- `.contact-form` is still declared in two sections of the sheet (`[listing-pages]` and
  `[static-pages]`) — the r1 seam note, unchanged.
- `404.html` duplicates ten design tokens inline; now named in a one-line comment in the file, which
  is the right minimum.

### What is genuinely good

The r1 worst screen is gone and gone cleanly: `privacy.html` reads as a legal page now, the marker
reuses `.cert-card li::before`'s em-dash instead of inventing a sixth marker, and `about.html` kept
its tick where the tick means something — the neutralisation did not leak, which I checked. The
contact status is above the button with a reserved `min-height` so success and error produce
byte-identical geometry, which is the reason the button cannot move between the two states. The 404
register fix is real and measurable. CLS is 0 on all four pages at all three widths, Lighthouse is
100/100/100/100, and the area needed no approvals. `about.html` is still the best-composed page on
the site.

---
---

## Component inventory (rendered components, not CSS classes)

Swept `main` on 19 public pages at 1440 — `harness/out/cd4-inventory.json`, driver
`harness/out/cd4-probe2.js`.

### Chip-shaped things — four radii, so not one system

| Component | Radius | Height | Fill | Where |
|---|---|---|---|---|
| `.code-lang` | **3 px** | 21.8 | transparent + 1 px `#2e3d4e` | 43 code headers |
| `.tag`, `.project-level`, `.course-level`, `.question-difficulty`, `.book-tag`, `.level-jump a` | **5 px** | 24.7 (44 for level-jump) | white / three level tints / magenta outline | listing pages |
| `.guide-aside a` below 64em | **8 px** | 44 | `--surface` | 11 project pages |
| `.step-number`, `.roadmap-number` | **50 %** | 28–32 | peach / `--paper-2` | article, home |

Verdict: **not one system, and one step further from it than r1 in one respect.** R1 asked the
999 px TOC pills and the 3 px `.code-lang` both to join the 5 px family. The pills moved to 8 px
(the card radius) and the code chip did not move at all, so the site still has four radii and now
has two 44 px white nav chips (article TOC at 8 px, projects level-jump at 5 px) that differ only
by 3 px. Tinted hues *are* reconciled: `level-beginner/intermediate/advanced` and
`difficulty-easy/medium/hard` share one green/amber/rose family across two components — that is
shell r2's win and it held. The exception is `#9d174d` on `.course-level` (listing issue 1).

### List markers — five treatments, unchanged in count

grey `::marker` dot (`.guide-list`, `.question-list`, project-card learn lists, course topics) ·
grey em-dash `—` (`.cert-card li`, **and now `privacy.html`'s `.feature-list`**) · rust bullet `•`
(`.tips-box li`, `.salary-card li`) · drawn rust tick (`about.html`'s `.feature-list`) · chevron `›`
(`.resource-list`). Privacy moved from the tick into the em-dash vocabulary rather than adding a
sixth, which is the right instinct, but the site-wide count is still five and it spans three areas,
so no single builder can close it. Suggested, unchanged from r1: neutral dot for enumerations,
chevron for navigable rows, nothing else.

### Actions — five treatments; the worst one is gone

filled orange (`.btn`, `.calc-button`, `.cta-button`, `#ff9900` on `#e08600`, 5 px — **exactly one
per page everywhere I looked**) · quiet hairline outline 5 px (`.project-link`, `.book-link`,
`.course-link`, `.cta-secondary`) · rust underlined text (`.cert-link`, ×4 on index) · **plain ink
text + `↗` (`.tool-link`, new this round)** · dark chip (`.code-copy`, 5 px). The white-card-as-a-
button (`.guide-nav-link`) is gone — it is now an unstyled ruled link, which is the r1 ask. Net: one
treatment removed, one added.

### Callouts — two languages, still no stated rule

accent tint `#fdf0e6` + 3 px `#c2410c` left rule + `0 8px 8px 0` (`.tips-box`, `.salary-note`) vs
`--paper-2` + 2 px `--line-2` left rule + square (`.note`, `.prose > .note`, the 404 joke). Plus
`.arch-note`, which has no chrome at all. Defensible as tip / fine print / caption — write it down.

### Card shell — still one system

`--surface` + 1 px `--line` + 8 px radius on `.cert-card`, `.salary-card`, `.project-card`,
`.book-card`, `.course-card`, `.calculator-container`, `.contact-form`, `.roadmap-content`. **Zero
`box-shadow`** anywhere in `main` and **zero decorative gradients** across all 19 pages. `.tool-card`
and `.guide-nav-link` correctly left the shell this round. This remains the strongest thing the site
has and nothing in Wave 2 r2 put it back.

### Template tells

- **Emoji-as-icons: 57 on public pages. 8 at full colour — all of them on `resources.html`**
  (`🕑` ×4, `🎓` ×4 in `.course-meta`). The other 49 are greyscaled at `grayscale(1) opacity .7`:
  45 diagram node icons via `.arch-component-icon` (`styles.css:294`) and 4 tool icons via
  `.tool-icon` (`styles.css:422`). R1's count was 12 at full colour; 4 were fixed, 8 were not.
  (Accent-orange `→ ↓ ← ↔` flow glyphs inside diagrams are text marks, not icons, and are excluded
  from the count.)
- **Decorative gradients: 0.** Uniform drop shadows: **0**. Card soup: **0** — `tools.html` was the
  last instance and it is gone.
- Second accent: **1** — `#9d174d` on `resources.html` (listing issue 1).

---

## Summary for the panel

Three of four areas pass. The two areas that failed r1 on the headline feature they were
commissioned to build — an on-page nav that showed 3 of 7 sections on a phone, and 43 code blocks
carrying six syntax rules and zero highlighted tokens — both shipped that feature properly and both
pass. `article-template` fixed five of six ranked findings with measured evidence I could reproduce;
`code-and-diagrams` shipped a build-time tokenizer that survives the content gate byte-for-byte and
fixed a diagram that was asserting the wrong architecture.

`listing-pages` is the one FAIL, at **8.4**, and it fails on two cheap things rather than on its
structure: one CSS declaration would greyscale the eight full-colour emoji left on `resources.html`
(the same builder wrote that exact declaration four lines away for `tools.html` in the same round),
and one colour decision would remove `#9d174d` from the `LEARNING PATH` chips and leave it only on
the partner wordmark where it belongs. Everything else in the area moved, and `tools.html` went from
the worst screen in Wave 2 to one I would ship.

Three cross-area items no single builder can close, for the integrator:
1. **Chip radius** — four values (3 / 5 / 8 / 50 %). Pick 5 px for every chip-shaped thing; the
   article TOC chips and `.code-lang` are the two that need to move.
2. **List markers** — five treatments across three areas. One decision, applied across the sheet.
3. **Callout rule** — two languages, no written distinction, two rounds running.

Still outside every builder's scope and still true: `WEIGHT: FAIL (19 pages)`, `resources.html`
LCP 2.18 s, index/tools SEO 92 on four frozen "Learn More", `sap-c02.jpg` showing the wrong book,
the missing affiliate disclosure, the 404 second door and the contact companion aside (both need a
content approval or a recorded decline), and a diagram legend (same). `admin.html` carries the only
3 console errors and the only 3 failed requests in the whole 63-run snapshot — outside Wave 2, but
someone should own it.

`INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)` after
four parallel builders and two rounds is still the most impressive line in this project.

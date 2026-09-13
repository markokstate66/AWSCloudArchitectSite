# FINAL whole-site gate · Creative director

Tree scored: branch `facelift`, **HEAD `f22dfdf`**, `git status` clean at the start and at the end of
my pass. Scored against `docs/REFERENCES.md` only (Stripe Docs, Cloudflare Developer Docs, Smashing
Magazine). I re-ran neither `snap.js` nor `lh.js`; numbers come from `harness/out/polish-r1/summary.json`
(63 rows, 2026-09-13T09:45Z) and `harness/out/polish-r1/lighthouse/summary.json` (7 pages, 09:46Z).
I ran `node harness/integrity.js compare --base baseline-2026-09-13` once, myself.

My own shots: **60 PNGs**, `harness/out/peek/fin-cd-*.png`, drivers `harness/out/fin-cd-shots.js`,
`fin-cd-shots2.js` and probes `fin-cd-probe.js` … `fin-cd-probe7.js` (all git-ignored under
`harness/out/`). Every file cited below was opened and looked at.

```
node harness/integrity.js compare --base baseline-2026-09-13
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

---
---

# Area: listing-pages   Round: final   Critic: creative director   Score: 8.6/10   Verdict: PASS

(Wave 2 r2: 8.4 FAIL on two items. Both are fixed and I verified both myself.)

### Screenshots looked at

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `fin-cd-resources-1440-courses.png` | The r2 **worst screen, de-magentaed**: `pluralsight` eyebrow in ink, promo panel on the plain card shell, `LEARNING PATH` chips white/hairline, `🕑`/`🎓` grey. Also: the promo is now visually identical to the two course cards beside it and holds the page's only orange button. |
| `fin-cd-resources-390-courses.png` | Same at 390 — no magenta, greyscale glyphs, promo indistinguishable from the card under it. |
| `fin-cd-resources-1440-books.png` | Eight book cards, neutral tags, 120×160 mounts; SAP-C02 still shows *The Kubernetes Book*; "Advanced" here is a **neutral** tag. |
| `fin-cd-index-1440-2400.png` | Cert row: four hairline-only cards, small-caps eyebrow, em-dash spec rows on one baseline, rust underlined "Learn More". |
| `fin-cd-index-1440-resourcecols.png` | Three ruled resource columns — **the double rule is gone**; `FREE RESOURCES` is a small-caps eyebrow over a 1 px hairline, only the section h2 carries the 2 px ink rule. `›` now visible. |
| `fin-cd-index-1440-salary.png` | Three equal salary panels, no tier rule; the Note callout at the prose edge. |
| `fin-cd-index-1440-faq.png` | FAQ rule **and** rows both end at 792 — the r2 "fourth right edge" is closed. |
| `fin-cd-index-390-2400.png` | Roadmap at 390: square numeral badges on the rail, one bullet style, neutral chips. |
| `fin-cd-projects-1440-0.png` | Level-jump chips, then three project cards with tinted headers, green level pills, neutral service tags. |
| `fin-cd-projects-390-0.png` / `fin-cd-projects-390-900.png` | Same stacked at 390, single left edge. |
| `fin-cd-tools-1440-rows.png` | Four ruled tool rows, greyscale icon gutter — and the action ~1,000 px from its title. |
| `fin-cd-tools-390-0.png` / `fin-cd-tools-390-1400.png` | Tools at 390: page header, calculator card, 44 px checkbox rows. |
| `fin-cd-ip-1440-700.png` / `fin-cd-ip-390-900.png` | Interview rows: category eyebrow + hairline (no competing h3 rule), difficulty pill still inside the question sentence. |

### Gate results

```
console=0 (public; 3 rows on admin.html = the known local /.auth/me 404, auth-gated, as at baseline)
pageErrors=0  failedRequests=0 (public)  axeSC=0  axeAll=0  hOverflow=0/60
cls=0 on every public row (max 0.0187 is admin.html@768 only)
perf=100 (resources 99)  a11y=100  bp=100  seo=100 except index/tools 92 (link-text, frozen)
lcp=1.50–1.65 s except resources.html 2.10 s (recorded D2 exception)  tbt=0 ms
integrity=PASS
```

### The two FAIL items — verified

**1. Second accent `#9d174d` on resources.html — FIXED.** I swept every element in `header`, `main`
and `footer` on 11 pages at 390 and 1440 for `rgb(154,23,68)` and `rgb(243,198,222)` in `color`,
`background-color`, all four border colours and `fill`. **0 occurrences on every page at both
widths.** Visually confirmed: `.ps-logo` is ink, the promo's left rule is gone, `LEARNING PATH` is
white / `--line` / ink. `fin-cd-resources-1440-courses.png`, `fin-cd-resources-390-courses.png`.

**2. Emoji treatment — FIXED.** Counting leaf elements whose own text is emoji: resources **8**,
tools **4**, project pages 5–6, index/projects/interview-prep/about/contact/privacy **0**. Every one
of them computes `filter: grayscale(1); opacity: 0.7`. **Not greyscaled site-wide: 1** — the `☁` on
`404.html` (`.cloud-icon`, `filter: none`, `opacity: 1`, `rgb(255,153,0)`), which is a brand mark,
not an icon; see whole-site tell 1. `fin-cd-resources-1440-courses.png`, `fin-cd-404-1440-0.png`.

### Component inventory — verified, and where the claim does not hold

| Component | Claim | What I measure | Verdict |
|---|---|---|---|
| Chip/badge **radius** | one token, 5 px | Every chip-shaped element on 11 pages at 390 and 1440 reports `5px`. The only `0px` hits are `.cert-level` (×4, no ground, no border — a text eyebrow, not a chip) and the ≥64em rail links (ruled links by design). | **HOLDS** |
| **Callouts** | one shape, tint is the only variable | `.tips-box`, `.salary-note`, `.prose > .note`, 404 `.joke`: all `padding 16px`, `border-left 3px`, `border-radius 0 8px 8px 0`, right edge = the prose edge (366 @390, 792 @1440). Tints: accent `#fdf0e6` / paper-2 `#f4f2ec`. `.arch-note` has no chrome — it is a caption. | **HOLDS** |
| **Card shell** | one declaration | `#fff` + `1px #e6e2da` + `8px` on cert/salary/project/book/course/calculator/roadmap/promo/contact-form. **0 box-shadows in `main`** on any page (the one shadow on the site is the drawer panel's elevation at <64em). **0 decorative gradients** — the 5 on each project page are the code-block scroll veils. | **HOLDS** (two variants: plain, and header-tinted `#fbfaf7` on `.project-header` ×11 / `.course-header` ×4 — consistent, so one system with a variant) |
| **List markers** | two treatments + a plain disc | Rendered: em-dash `—` `#596169`, drawn accent tick, `disc`, chevron `›`, none-on-navigable-rows — **plus `circle` on 98 list items on interview-prep.html**, which is the browser default leaking at list depth 2 (`circle depth2 UL` ×98, measured). | **PARTLY** — a fourth, unintended bullet |
| **Buttons** | one treatment per job | filled orange (exactly one per page), outline hairline 5 px, accent-underlined in-text action (`.cert-link` and `.tool-link` now identical), navy chip (`.code-copy`), row link. | **HOLDS** |
| **Level / "Advanced"** | one pill everywhere | The three *pills* are byte-identical (13 px / 700 / 5 px / `#fbeaea`+`#a4262c` / h 25) across projects cards, the project-page eyebrow and interview difficulty — the request's item 6 as written. But the **word "Advanced" still renders three visual ways**: rose pill (projects, project pages), **neutral white tag** on a resources book card (13 px / 650 / `#fff` / `#4a5159` / h 25), and **grey meta text beside a greyscale 🎓** on a course card. | **DOES NOT HOLD** — see issue 2 |

### Ranked issues (worst first)

**1. The Pluralsight panel is now an unlabelled advertisement wearing the editorial card — PAGE + COMPONENT**
Page/width: `resources.html` at 1440 and 390.
Screenshots: `fin-cd-resources-1440-courses.png`, `fin-cd-resources-390-courses.png`, and
`fin-cd-privacy-1440-note.png` for where the disclosure actually lives.
Removing `#9d174d` was right, but it removed the only signal that this panel is a partner placement.
Measured, the promo is now `#fff` / `1px #e6e2da` / `8px` — **byte-identical to the `.course-card`
shell beside it** — it carries `Start Free Trial` as `.cta-button` (`#ff9900`, the page's single
primary button), and a text scan for `advertis|sponsor|partner|affiliate` inside the panel returns
**false**. The affiliate disclosure exists, but on `privacy.html`, four clicks away
(`fin-cd-privacy-1440-note.png`). Smashing Magazine is in the reference list precisely because it
keeps commercial units legible as commercial; this reads as the site's own recommendation.
*Fixed looks like:* the partner panel keeps a quiet identity of its own — a small-caps `PARTNER` or
`SPONSORED` eyebrow in `--ink-3` above the wordmark, and its action demoted to the secondary
outline button so the orange stays with the site's own CTAs. No colour needed; two lines.

**2. "Advanced" is still three things on one screen — COMPONENT**
Page/width: `resources.html` at 1440 (both renderings are in one frame), `projects.html` at 1440.
Screenshots: `fin-cd-resources-1440-books.png`, `fin-cd-resources-1440-courses.png`,
`fin-cd-projects-1440-0.png`
Measured: rose pill `13/700 r5 bg#fbeaea c#a4262c h25`; neutral book tag `13/650 r5 bg#fff c#4a5159
bd#e6e2da h25`; course level as 15 px grey text after a greyscale mortarboard. Polish item 6 asked
only that the three *pills* match, and they do — but the finding from W1 #5 and W2 #2 was about the
word, and a reader on `resources.html` meets two of the three treatments without scrolling.
*Fixed looks like:* one level component, used wherever a level is stated — the rose/amber/green
family on the course meta and the book tag too — and the book's "SAA-C03"/"SAP-C02" exam codes stay
in the neutral tag family, where they belong.

**3. A clickable chip and a static tag are the same object — COMPONENT**
Page/width: `projects.html` at 1440 and 390; `project-*.html` at 390.
Screenshots: `fin-cd-projects-1440-0.png`, `fin-cd-projects-390-0.png`, `fin-cd-proj-390-0.png`
Measured side by side: `.level-jump a` (a link, `cursor: pointer`) = `13 px / 650 / 5 px / #fff /
1px #d8d2c6 / h 44`; `.project-services span` (inert metadata) = `13 px / 650 / 5 px / #fff /
1px #e6e2da / h 25`; the 390 TOC chip = `13/650/5px/#fff/1px #d8d2c6/h 44`. The only difference
between "you can tap this" and "this is a label" is 19 px of height and one step of border grey.
Unifying the radius (item 3) was right; it just went one step too far and took the affordance with
it. Neither reference makes this mistake — Cloudflare's on-page nav chips are ruled links, its
metadata is plain text.
*Fixed looks like:* one of the two families loses the box. Metadata tags keep the 5 px hairline
chip; interactive chips take a different skin — a ground fill, an underline, or a 1 px `--ink-3`
border with the ink text — so the page shows at a glance what is a control.

**4. At 1440 a tool row's action is ~1,000 px from its title — PAGE (unchanged from W2 r2 #5, not taken)**
Page/width: `tools.html` at 1440. Screenshot: `fin-cd-tools-1440-rows.png`
The row runs the full 1,136 px container: "AWS Pricing Calculator" at x≈200, `Open Tool ↗` ending at
x≈1,288, with a one-line description stopping at x≈625. Four such links stack in a column that
belongs to no other element on the page.
*Fixed looks like:* cap the row's text block at the reading measure so the action lands ~68 ch from
the title, or make the whole row the link and leave `↗` as the only mark on the right.

**5. The difficulty pill sits inside the question sentence — PAGE**
Page/width: `interview-prep.html` at 1440 and 390.
Screenshots: `fin-cd-ip-1440-700.png`, `fin-cd-ip-390-900.png`
"Explain the difference between RDS, Aurora, and DynamoDB. `Medium`" — the pill inherits the
sentence's flow, so on 9 of 17 rows it lands alone on a second line and the question's right edge
goes ragged. The `+` affordance, the question and the badge are three different reading jobs on one
line. Carried from W2 r2 unchanged (the badge is inside the frozen text run, so this needs an
approval, not a CSS pass).
*Fixed looks like:* the badge on its own line under the question with the hint text, or right-aligned
on the row baseline. Either way it stops entering the sentence.

### Nits
- The third resource column (`PRACTICE & LABS`, 4 rows) stops a row short of the other two, leaving a
  ragged bottom edge under a set of rules that otherwise align (`fin-cd-index-1440-resourcecols.png`).
- The roadmap measure is fixed and I re-measured it: **64–71 characters** per line at 1440 (was 51–61),
  inside the 65–75 band bar one paragraph at 64 (`fin-cd-index-390-2400.png`).
- `sap-c02.jpg` is still *The Kubernetes Book* (`fin-cd-resources-1440-books.png`); index/tools SEO 92
  on four frozen "Learn More". Both HUMAN_TODO, neither chargeable here.
- `resources.html` LCP 2.10 s against a 1.8 s budget — the recorded D2 exception, unchanged in kind.

**Score: 8.6/10. Verdict: PASS.** Both blocking items are closed and I verified both with my own
measurements, not the builder's: zero magenta on any page at either width, zero full-colour emoji on
any listing page. The double heading rule is gone, the FAQ edge is closed, the roadmap measure landed
in the band, and `tools.html` and the cert row are pages I would ship. It does not reach 9 because
one fix created a new problem of similar weight (the partner panel lost its identity and kept the
orange button), the word "Advanced" is still three things on one screen, and the chip system can no
longer tell a control from a label.

---
---

# Area: whole site   Round: final   Critic: creative director   Score: 8.4/10   Verdict: FAIL

Scored against the references across every page type at 390 and 1440. 60 shots; the ones I cite are
named inline.

### Screenshots looked at (beyond the listing table above)

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `fin-cd-index-390-0.png` | Hero at 390: 56 px navy bar, 44 px toggle, **hero stats now 1/1/1 with hairlines, no orphan**, one orange CTA above the fold. |
| `fin-cd-index-1440-0.png` | **Worst screen.** Hero: h1/subtitle/stats/CTA all stop at 792; the right 648 px (45 % of the viewport) is empty paper. One band below, the navy Key Skills card fills exactly that track. |
| `fin-cd-index-390-5200.png` / `fin-cd-index-390-8200.png` | Resource columns and FAQ at 390 — one rule per heading, no competing device. |
| `fin-cd-index-1440-5200.png` / `fin-cd-index-1440-8200.png` | CTA band: rule **and** content both end at 792 (fixed) — and the same empty right half. Footer: 4 columns, ~170 px void under column 1. |
| `fin-cd-index-1440-footer.png` / `fin-cd-index-390-footer.png` | The void at 1440; at 390 the footer is a clean single column with no voids (fixed). |
| `fin-cd-proj-1440-0.png` | The best screen on the site: breadcrumb, eyebrow, h1, subtitle, prose, key-facts `<dl>` all on x=152, rail 1040→1288. Within sight of Cloudflare. |
| `fin-cd-proj-390-0.png` | Same at 390 with the horizontal TOC chip rail; third chip cut at the right edge under a faint veil. |
| `fin-cd-proj-1440-diagram.png` / `fin-cd-proj-390-diagram.png` | Navy diagram panel; at 390 it stacks 1-up with every node name intact and direction arrows visible. No zoom needed. |
| `fin-cd-proj-1440-code.png` | **The article column's second right edge**: an 840 px navy slab whose longest line ends at 550, under a 624 px text column. |
| `fin-cd-proj-390-code.png` | Same block at 390: label + `JSON` + `Copy`, scrolls inside itself, veil on the right edge. Correct. |
| `fin-cd-proj-1440-pagination.png` / `fin-cd-proj-390-pagination.png` | "PREVIOUS / ← Previous Project" and "ALL PROJECTS / Back to All Projects" — no destination name, no Next. |
| `fin-cd-proj-1440-tips.png` / `fin-cd-proj-1440-400.png` | Tips callout and prose at the 776 edge; article separators 1 px and measure-wide. |
| `fin-cd-about-1440-0.png` / `fin-cd-about-390-0.png` / `fin-cd-about-1440-features.png` | About: one-ink h1, ruled offer list with the accent tick. Best-composed page on the site — and 496 px of empty paper to its right at 1440. |
| `fin-cd-privacy-1440-0.png` / `fin-cd-privacy-390-0.png` / `fin-cd-privacy-1440-note.png` | Privacy reads as a legal page; em-dash rows; the affiliate disclosure lives here. **3-column footer.** |
| `fin-cd-contact-1440-0.png` / `fin-cd-contact-390-0.png` | Form card on the card shell, labels above fields, one orange submit; right half empty at 1440. |
| `fin-cd-404-1440-0.png` / `fin-cd-404-390-0.png` | 404: the navy strip matches the shell and the joke uses the site's fine-print callout — but the strip carries a bare orange cloud and **no wordmark**, and the numeral is grey. |
| `fin-cd-drawer-index-390.png` / `fin-cd-drawer-proj-390.png` | Drawer: scrim, navy panel, ruled rows, × toggle, page dimmed and locked. Correct — with an orange box still around the open toggle. |
| `fin-cd-drawer-index-768.png` | A 768 tablet still gets the phone drawer: 768 px of navy over the page. |

### Gate results

```
console=0 public · pageErrors=0 · failedRequests=0 public · axeSC=0 · axeAll=0 · hOverflow=0/60
cls=0 on every public row · perf=99–100 · a11y=100 · bp=100 · seo=100 except index/tools 92 (frozen)
lcp 1.50–1.65 s except resources.html 2.10 s · tbt=0 ms · integrity=PASS
```

### The single worst screen, site-wide

**`harness/out/peek/fin-cd-index-1440-0.png` — the home hero at 1440.** It is the first screen of the
site and 45 % of it is empty by decision. Everything inside the left 640 px is right: the type scale,
the hairline stats strip, one orange CTA, negative tracking on a 48 px h1. But nothing is opposite it,
there is no rail, no image, no card — and one band lower the *same page* proves it knows how to fill
that track with the navy "Key Skills Required" panel at 804→1288. A reader arriving at 1440 sees a
document that was laid out for a phone and then stretched. Stripe Docs, Cloudflare Developer Docs and
Smashing Magazine all use the full width on their widest breakpoint; this is the one screen where the
site most clearly reads as themed rather than designed.

### Ranked issues (worst first)

**1. At ≥64em the right half of the frame is unresolved on 14 of 21 pages — COMPONENT (layout shell)**
Pages/widths: `index.html` hero and CTA band, the page-header band on all 7 listing/static pages,
`about.html`, `privacy.html`, `contact.html`, `404.html` — all at 1440.
Screenshots: `fin-cd-index-1440-0.png`, `fin-cd-index-1440-8200.png`, `fin-cd-about-1440-0.png`,
`fin-cd-contact-1440-0.png`, `fin-cd-404-1440-0.png`, `fin-cd-projects-1440-0.png`
Measured at 1440: container 152→1288 (1136). Content in these bands stops at **792** (hero, CTA, FAQ,
prose pages) or at **895 / 767** (page-header h1 / subtitle — a third and fourth edge that the polish
round's own written policy of "two widths only" does not cover, and identical on all seven pages).
So between 400 and 520 px of every such band is empty, and on `404.html` the whole 1440×900 viewport
holds one 422 px column. The polish round fixed the *rules* — every band's rule now ends where its
content ends, which I verified on all 8 index bands (7/7 h2 rules == widest content) — but the
composition question underneath it was never answered. W1 r2 named this and called it "the next
move"; it is still the next move.
*Fixed looks like:* a decision, applied once in the shell, for what lives in the right track at
≥64em — the stats as a ruled panel opposite the hero, the Key Skills card promoted into the hero, a
page-level "on this page" / related rail on the static pages (the project template already has one at
1040→1288 and it works), or the band centred as a unit. Also fold the page-header's `34ch`/`60ch`
into the two declared widths so the band has one right edge instead of two.

**2. The article column has two right edges: prose at 776, code and diagrams at 992 — COMPONENT**
Pages/widths: all 11 `project-*.html` at 1440.
Screenshots: `fin-cd-proj-1440-code.png`, `fin-cd-proj-1440-diagram.png`, `fin-cd-proj-1440-0.png`
Measured: `h2`, `p`, `.guide-list`, `.tips-box`, `.guide-meta` and `.guide-navigation` all run
152→**776** (624 px, 68 ch). `.code-block`, `pre` and `.architecture-diagram` run 152→**992**
(840 px) because they fill `.guide-section`'s box rather than the measure. The code inside does not
need it: across **43 blocks on 11 pages the average text width is 469 px; only 5 exceed 624 px and
only 2 exceed 776 px.** On the screenshot the JSON's longest line ends at 550, leaving 441 px of
empty navy, and because the block is the darkest object on the page it is also the loudest thing
disagreeing with the column. Stripe keeps code on the measure; nothing here earns the extra 216 px.
Same geometry means an injected `.ad-well` (M&S item 16, "152 → 992 = the article column") will also
be 216 px wider than the article it sits in.
*Fixed looks like:* the code block and the diagram take the same 624 px as the prose, and the five
blocks that genuinely overrun keep their existing inner scroll and veil — which already work at 390.
If a wider code column is wanted, it should be a deliberate, consistent bleed applied to *all* full-
width elements including the ad well, not the accidental width of a wrapper.

**3. The footer is the most-repeated component on the site and it is neither balanced nor identical — COMPONENT**
Pages/widths: every page at 1440.
Screenshots: `fin-cd-index-1440-8200.png`, `fin-cd-tools-1440-rows.png`, `fin-cd-privacy-1440-note.png`
Two separate faults in one component. (a) Column 1 (wordmark + two lines) is ~90 px tall while
columns 2–4 run to ~290 px, so a ~170 px void sits at the bottom-left of 19 pages, directly under the
strongest thing in the footer — unchanged since W1 r1. (b) The footer is **not the same footer**:
`about.html` and `privacy.html` render **3 `.footer-section` columns** while the other 19 render 4
(counted in the markup and visible in `fin-cd-privacy-1440-note.png`, where "Legal" has slid into
column 3 and "Official AWS Links" is absent). A shell component that differs by page is the opposite
of what `apply-shell.js` exists to guarantee.
*Fixed looks like:* one footer on every page, and a column ratio that reflects the content — a wider
first column, or the description set under the wordmark so the four blocks end near the same
baseline. The link-set difference is content and needs an approval, so it belongs in HUMAN_TODO,
but it should be recorded as a defect, not a page variation.

**4. Article pagination tells the reader nothing — PAGE (blocked by the content freeze)**
Pages/widths: all 11 `project-*.html` at 1440 and 390.
Screenshots: `fin-cd-proj-1440-pagination.png`, `fin-cd-proj-390-pagination.png`
The component's craft is right — small-caps eyebrow, ink link, arrow, hairline above. The content is
not: "← Previous Project" and "Back to All Projects", with **no Next link at all**. Both references
put the destination's *title* in this slot, which is the entire reason the component exists;
"Previous Project" is placeholder copy that survived into production. On the last page of a sequence
a reader has no way forward.
*Fixed looks like:* the previous/next link carries the actual project name, and a Next link exists
wherever a next project does. This is frozen text, so it is an approval, not a builder task —
HUMAN_TODO.

**5. 404 wears the shell's band but not the shell's identity — PAGE**
Page/width: `404.html` at 1440 and 390.
Screenshots: `fin-cd-404-1440-0.png`, `fin-cd-404-390-0.png`, against `fin-cd-index-1440-0.png`
The navy strip, the 56/64 px heights and the orange cloud are now the shell's (a real fix, and the
joke callout correctly joined the fine-print callout family). But the strip contains **only** a cloud
— no "AWS Cloud Architect Guide" wordmark, no link home in the bar — where every other page in the
site puts the name next to the mark. The cloud is also a text `☁` here and an inline `<svg>`
everywhere else, so it renders at a different weight. And the numeral "404" is mid-grey, the only
display type on the site that is not ink; it reads as disabled.
*Fixed looks like:* the wordmark beside the cloud, linked home, as an SVG copy of the shell's mark
(it is a self-contained file, so inline it), and "404" in `--ink-3` as an eyebrow above the headline
rather than as grey display type.

**6. Chips lost the line between a control and a label — COMPONENT** (see listing issue 3; it is
site-wide because the same collision exists between the project-page TOC chips at 390 and the service
tags). `fin-cd-proj-390-0.png`, `fin-cd-projects-1440-0.png`

**7. Two undeclared semantic hues inside the architecture diagrams — COMPONENT**
Pages/widths: all 11 `project-*.html` at 390 and 1440. Screenshots: `fin-cd-proj-1440-diagram.png`,
`fin-cd-proj-390-diagram.png`
Measured on the diagram subtree: left-bar colours are `#7ad3a4` (green, ×3), `#f08b8b` (rose, ×3)
and `#2e3d4e` (the navy hairline, ×12). Green and rose are the dark-ground cousins of the level
triad's `--ok`/`--danger`, but there is no amber, no legend and no repetition of the meaning
anywhere else on the page, so a reader cannot tell whether "Log Archive is rose" means *security* or
*danger*. The diagram is otherwise the strongest piece of work on the site.
*Fixed looks like:* either the bars all take the navy hairline (the grouping is already carried by
the OU boxes and their small-caps labels), or the hue is stated once — a one-line key under the
diagram, in the same voice as "Account Factory automates new account provisioning".

### Template tells I can still find: **nine**

The four the brief names by name are essentially gone: **decorative gradients 0** (the five per
project page are code-scroll veils), **card soup 0**, **uniform drop shadows 0** (`main` carries no
`box-shadow` on any page; the one on the site is the drawer's elevation), **second accent 0**. What
is left:

1. **One full-colour emoji standing in for the logo** — `☁` on `404.html` at `filter:none/opacity:1`,
   where every other page draws the same mark as an SVG (`fin-cd-404-1440-0.png` vs `fin-cd-index-1440-0.png`).
2. **Placeholder pagination copy** — "Previous Project" / "Back to All Projects", no Next
   (`fin-cd-proj-1440-pagination.png`).
3. **"Learn More" ×4** as the cert-card action, still costing SEO 92 on index and tools
   (`fin-cd-index-1440-2400.png`).
4. **The empty right half at ≥64em** — the tell that a layout was themed for one breakpoint
   (`fin-cd-index-1440-0.png`, `fin-cd-about-1440-0.png`, `fin-cd-contact-1440-0.png`, `fin-cd-404-1440-0.png`).
5. **Browser-default bullets showing through** — `list-style: circle` on 98 list items at depth 2 on
   `interview-prep.html`, a marker nobody chose (`fin-cd-ip-390-900.png`).
6. **Controls and labels wearing the same chip** (`fin-cd-projects-1440-0.png`).
7. **An affiliate placement dressed as editorial**, with the disclosure on another page
   (`fin-cd-resources-1440-courses.png`, `fin-cd-privacy-1440-note.png`).
8. **A 768 px tablet served the phone drawer** — the nav still breaks at 60em
   (`fin-cd-drawer-index-768.png`). Parked for Wave 3; still a tell.
9. **A shared component that is not shared** — 3-column footer on about/privacy, 4 elsewhere
   (`fin-cd-privacy-1440-note.png` vs `fin-cd-index-1440-8200.png`).

### Nits

- The open drawer toggle still takes a 2 px `--aws-orange` border, which on navy next to a light
  `#f2f5f8` focus ring reads as focus, not as state (`fin-cd-drawer-index-390.png`). W1 r2 nit,
  unchanged.
- The 390 TOC chip rail cuts its third chip under a veil that fades to the chip's own ground, so over
  the paper gaps it is nearly invisible; the mid-word cut carries the affordance
  (`fin-cd-proj-390-0.png`). Known and recorded.
- 264 px of gutter between the article's right edge (776) and the rail (1040) on project pages at
  1440 — narrower than the 313 px at W1 r2, still wider than either reference (`fin-cd-proj-1440-0.png`).
- Index alternates 792 / 1288 / 792 / 1288 / 1288 / 1288 / 792 / 792 down the page. The rule is legible
  and I am not ranking it, but the eye does register the whiplash between the FAQ and the salary grid
  (`fin-cd-index-1440-salary.png`).
- `resources.html` LCP 2.10 s (budget 1.8) — recorded D2 exception. `WEIGHT: FAIL (19 pages)` against
  the pre-facelift tree — wave-wide, not a listed pass criterion. Neither is scored here.

### What is genuinely good, so the next round does not refactor it away

- **Type and measure are reference-grade and unchanged across 21 pages**: 19 px / 1.5–1.65 body at
  `#4a5159`, h1 38–48 px / 750 with negative tracking, prose 64–71 characters per line everywhere I
  measured, no webfonts, **CLS 0 on all 60 public rows at all three widths**.
- **The colour system is one system.** One accent family, one three-hue level triad, zero second
  accents, zero gradients, zero shadows in content, one card shell, one chip radius, one callout
  shape with two tints. That is the whole of the discipline the brief asked for, and it held.
- **The project page at 1440 and the diagram at 390 are the two best things here.** One vertical at
  x=152, a real rail, a code block with a label, a language chip and a copy button, and an
  architecture diagram that reflows to one column with every node name intact and the direction
  arrows still readable. That is the Cloudflare reference, met.
- **The shell behaves.** Drawer with scrim, scroll lock, DOM-order tab entry, a working focus trap,
  Escape with focus return; breadcrumbs clear of the sticky header at 44 px; hero stats 1/1/1 and a
  single-column footer at 390; light focus rings on navy.
- **Zero approvals burned, `INTEGRITY: PASS`, 0 axe findings of any impact across 60 runs, 0 console
  errors on public pages** — and the stylesheet got smaller while all of the above landed.

**Score: 8.4/10. Verdict: FAIL** (threshold 8.5).

The site is a long way past "generic template" and well past "good theme": at 390 it is, page for page,
publication-grade, and the project template at 1440 is close to the bar. It does not clear 8.5 because
two things that are not nits are still open, both of them cross-area and both cheap in code: **45 % of
the frame at ≥64em is unresolved on 14 of 21 pages**, including the home page's first screen, and the
**article column contradicts itself with a 624 px text measure and an 840 px code/diagram slab on all
11 project pages**. Everything else on my list is a nit or an approval. Fix those two and I would score
this 8.8 without re-litigating anything else.

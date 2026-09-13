# FINAL whole-site RE-SCORE (after polish round 2) · Creative director

Tree scored: branch `facelift`, **HEAD `cff105e`**, `git status` clean at the start and at the end of
this pass. Scored against `docs/REFERENCES.md` only (Stripe Docs, Cloudflare Developer Docs,
Smashing Magazine). I re-ran neither `snap.js` nor `lh.js`; numbers come from
`harness/out/polish-r2/summary.json` (63 rows, 2026-09-13T11:01Z) and
`harness/out/polish-r2/lighthouse/summary.json` (7 pages, 10:57Z). I ran
`node harness/integrity.js compare --base baseline-2026-09-13` once, myself, and `weight.js` once.

My own shots: **35 PNGs**, `harness/out/peek/fin2-cd-*.png` (git-ignored), drivers and probes in my
scratchpad (`fin2-shots*.js`, `fin2-p1…p8.js`). Every file cited below was opened and looked at.
Every number below is my own measurement, not the builder's — where the builder's number and mine
agree I say so, and where they differ I say which one is right.

```
node harness/integrity.js compare --base baseline-2026-09-13
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
uiText audit gained exactly two strings this round: "Partner", "↑"
```

---

# Area: whole site   Round: final r2   Critic: creative director   Score: 8.6/10   Verdict: PASS

(Whole-site final r1: **8.4 FAIL**. Threshold 8.5.)

### Screenshots looked at

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `fin2-cd-index-1440-hero.png` | **The r1 worst screen, resolved.** Two columns: h1/subtitle/CTA 152→792, the three stats as a ruled vertical list 856→1288. The navy Key Skills panel one band below (804→1288) is in the same frame — same right edge, different left edge. |
| `fin2-cd-index-390-hero.png` | 390 hero unchanged: 56 px bar, 1/1/1 ruled stats, one orange CTA above the fold. |
| `fin2-cd-proj-1440-0.png` | Project page at 1440: breadcrumb, rose level pill, h1 and subtitle now both at 152→**776** (the prose column), key-facts `<dl>`, rail 1040→1288. |
| `fin2-cd-proj-1440-code.png` | **The second right edge is gone.** The JSON slab ends at 776, level with the `h2` above it. The back-to-top circle is in frame at bottom right. |
| `fin2-cd-proj-390-0.png` | 390: TOC chips now carry a hairline **and** a `›`; third chip clipped under the veil. |
| `fin2-cd-proj-390-totop.png` | The back-to-top control after 2.5 viewports: a 44 px white circle, hairline, grey ↑ — sitting **on top of** the last line of a step list. |
| `fin2-cd-index-1440-footer.png` | Index footer: 4 tracks of 260 px filling 152→1288 — and three different column bottoms (voids 178 / 0 / 91 / 137 px). Above it, the CTA band ends at 792 in a 1136 px container. |
| `fin2-cd-about-1440-footer.png` | About footer: **3 tracks of 357 px**, the row full, no dead fourth track — and the same 178 px void under column 1. Also where the affiliate disclosure actually lives. |
| `fin2-cd-about-1440-0.png` | About at 1440: everything stops at 792; 648 px (45 %) of empty paper to its right. Unchanged from r1. |
| `fin2-cd-404-1440-0.png` / `fin2-cd-404-390-0.png` | 404: navy band with the shell's hairline and a 24 px mark box — but a bare `☁`, no wordmark, grey "404", and at 1440 a 576 px column in a 1440×900 frame. |
| `fin2-cd-resources-1440-promo.png` / `fin2-cd-resources-390-promo.png` | **The partner band.** `PARTNER` small-caps eyebrow, paper-2 ground with top/bottom hairlines, radius 0, no card shell, outline `Start Free Trial`. Nothing on the page is orange. |
| `fin2-cd-resources-1440-books.png` | Book cards: "Advanced" and "SAP-C02" now read as the same kind of metadata — flat paper-2 tags, no border. |
| `fin2-cd-projects-1440-chips.png` | **Three chip skins in one frame**: tall ruled `Beginner ›` controls, green `Beginner` pill, flat `S3` tags. |
| `fin2-cd-ip-390-nested.png` | interview-prep, answer open: depth-2 bullets are **filled discs**, identical to depth 1. Difficulty pill still inside the question sentence. |
| `fin2-cd-ip-390-answer.png` | A second open answer; `Medium` pill lands inside the question run. |
| `fin2-cd-tools-1440-0.png` | tools at 1440: page header 792, section rule 1288, calculator card 640 — three edges in one screen. |
| `fin2-cd-tools-1440-rows.png` | Tool rows: title at x=200, description ends ≈625, `Open Tool ↗` at 1200→1288. Unchanged. |
| `fin2-cd-drawer-768.png` | A 768 tablet still gets the phone drawer: 768 px of navy, six rows, 1 px orange border on the open toggle. |

### Gate results

```
console=0 public (admin.html 1/width = the known local /.auth/me 404, auth-gated, as at baseline)
pageErrors=0 · failedRequests=0 public · axeSC=0 · axeAll=0 across all 63 rows · hOverflow=0/63
cls=0 on every public row (max 0.0187 is admin.html@768 only)
perf=100 (resources 99) · a11y=100 · bp=100 · seo=100 except index/tools 92 (link-text, frozen)
lcp 1.50–1.65 s except resources.html 2.10 s (recorded D2 exception) · tbt=0 ms
integrity=PASS · styles.css 8,680 B gzip (budget 8,700)
weight.js: WEIGHT: FAIL (19 pages over gzip baseline vs the pre-facelift tree) — wave-wide, recorded
```

---

## My r1 list, item by item — what I measured myself

**r1 #1 — the right half of the frame at ≥64em: PARTIAL (the worst screen is fixed; the pattern is not).**
The hero is a real fix and a good one. Measured at 1440: `.home-hero .container` is
`display:grid`, `640px 432px`, gap 64, every child explicitly placed (`h1 1/1`, `.hero-subtitle 2/1`,
`.cta-button 3/1`, `.hero-stats 1/2/4/3`; no child reports `auto`). h1/subtitle 152→792, CTA
152→343, **stats 856→1288**, three ruled rows of 69.3 px, hero 86 px shorter. The stats right edge is
**1288 — exactly the Key Skills panel's right edge**, so the right track is now declared on the
first screen (`fin2-cd-index-1440-hero.png`). 390 and 768 are untouched.
But the rest of the list is unchanged: at 1440 **about, contact and privacy still stop at 792**
(measured widest content in `main`) and **404 stops at 728**; the index CTA band is 792 in a 1136 px
container; the tools calculator card is 640 under a 1136 px section rule; and the seven page-header
bands are 792 under sections whose content runs to 1288. I asked for "a decision, applied once in
the shell, for what lives in the right track at ≥64em". What shipped is a decision for one band on
one page. See ranked issue 1.

**r1 #2 — two right edges in the article column: FIXED, completely.**
I measured every visible block in `.guide-overview`, `.guide-section`, `.guide-content` and
`.guide-navigation` on **all 11 project pages**. The set of right edges is a single value:
**`{776}` at 1440** (306 elements: 77 h2, 43 h3, 43 `.code-block`, 11 `.architecture-diagram`,
66 `.guide-step`, 22 `.guide-list`, 11 `.tips-box`, 11 `.guide-meta`, 11 `.guide-navigation`, 11 p)
and **`{366}` at 390**. Was `{760, 776, 991, 992}`. The rail is unchanged at **1040→1288**.
Code that overruns scrolls inside itself: 6 of 43 blocks scroll at 1440 (max 372 px), 37 at 390;
**0 of 11 diagrams scroll at any width**; document horizontal overflow 0 at both widths.
I injected the AD_PLAN well markup myself into `.project-guide`: it lands at **152→776, 624 px,
`max-width:624px`, margins 0** at 1440 and 24→366 at 390 — the article column exactly
(`fin2-cd-proj-1440-code.png`, `fin2-cd-proj-1440-0.png`).

**r1 #3 — the footer: HALF FIXED.**
(a) The row now fills on both page kinds: `repeat(auto-fit, minmax(12rem,1fr))` gives index/tools/
project pages **4 × 260 px = 152→1288** and about/privacy **3 × 357.3 px = 152→1288**. The dead
fourth track on about/privacy is gone. (b) **The void under column 1 is not fixed.** Measured empty
space under each column's content inside the row at 1440: index/tools/projects **[178, 0, 91, 137] px**,
about/privacy **[178, 0, 137] px** — the 178 px void under the wordmark is unchanged from r1, and
there are now two or three different column bottoms instead of one
(`fin2-cd-index-1440-footer.png`, `fin2-cd-about-1440-footer.png`). At 768 the four-section pages
wrap "Legal" under column 1, which does fill that void — so the defect is 1440-only.
The 3-vs-4 **link set** is still a content difference (HUMAN_TODO), correctly untouched.

**r1 #4 — pagination copy: NOT TAKEN (approval, correctly).** Unchanged, still a tell.

**r1 #5 — 404 identity: PARTIAL.** Measured: band 56/64 px, `--navy`, and now a **1 px
`rgb(46,61,78)` (`--navy-line`) bottom rule**, the glyph in a 24 × 24 box at the shell's gutter
(x=152 at 1440, 24 at 390) — the geometry claim holds. But visually the bar still reads as a
stripped header, not the site's header: no wordmark (approval, accepted), and the `☁` is still a
text glyph at `filter:none / opacity:1 / rgb(255,153,0)` where every other page draws an SVG. The
numeral "404" is still `rgb(89,97,105)` at 96 px — the only display type on the site that is not
ink, a CSS-only item I named in r1 and that was not taken (`fin2-cd-404-1440-0.png`,
`fin2-cd-404-390-0.png`).

**r1 #6 — controls vs labels: FIXED.** Measured side by side on `projects.html` at 1440, and the
three skins are unambiguous in one frame (`fin2-cd-projects-1440-chips.png`):

| Object | Ground | Border | Height | `::after` | Cursor |
|---|---|---|---|---|---|
| `.level-jump a` (control) | `#fff` | 1 px `#d8d2c6` | **44** | `"›"` | pointer |
| `.project-services span` (label) | `#f4f2ec` | **0** | 22.7 | none | auto |
| `.project-level` (classification) | `#e7f4ec` + `#bfe0cd` | 1 px, tinted | 24.7 | none | auto |

The ≥64em rail link drops the chevron and becomes a ruled link, which is right. A reader can now
tell at a glance what is tappable.

**r1 #7 — undeclared hues in the diagrams: NOT TAKEN.** Out of scope for this round; still open, still a nit.

**Listing r2 #1 — the Pluralsight panel: FIXED, and it is the round's best piece of craft.**
Measured: outer `.pluralsight-promo` = `--paper-2` ground, **1 px `--line` top and bottom only, no
side borders, radius 0** — it left the card-shell family entirely. `PARTNER` eyebrow, 15 px,
`font-variant-caps: all-small-caps`, `--ink-3`, 1.05 px tracking, in the site's existing eyebrow
family. CTA is the shared outline button (`transparent` / 1 px `#d8d2c6` / `--ink`). A text scan for
`advertis|sponsor|partner|affiliate` inside the panel now returns **true**. Shape at 390: panel
342 × 339.5, inner 294 × 289.5 — **neither is inside the 280–320 × 230–270 MPU window**; at 1440 the
inner box is 640 × 235, outside on width. And I counted the orange: **`resources.html` now has zero
filled-orange buttons in `main`** — the accent went back to the site's own CTAs
(`fin2-cd-resources-1440-promo.png`, `fin2-cd-resources-390-promo.png`).

**Listing r2 #2 — "Advanced" three ways: MOSTLY FIXED, downgraded to a nit.** The word still renders
three ways site-wide (rose pill on projects/project pages; flat paper-2 tag in `.book-meta`;
15 px grey text after a greyscale 🎓 in `.course-meta`), but there is now a stated rule behind it —
pill = the thing's own classification, tag = one item in a tag row, plain text = one fact in an icon
fact row — and on any single screen a reader meets at most two, both in the quiet family. On the
book card "Advanced" and "SAP-C02" now look like the same kind of metadata, which is the correct
reading (`fin2-cd-resources-1440-books.png`). I accept the rule; see nits.

**Listing r2 #4 — tool rows: NOT TAKEN.** Re-measured at 1440: title at x=200, description ends
≈625, `Open Tool ↗` runs 1200→1288 — ~575 px of nothing between the two halves of one row, four
times (`fin2-cd-tools-1440-rows.png`). Not in the r2 request; still open.

**Listing r2 #5 — the difficulty pill inside the question sentence: NOT TAKEN** (frozen text /
approval). Confirmed still inside the run, wrapping to its own line
(`fin2-cd-ip-390-nested.png`, `fin2-cd-ip-390-answer.png`).

**Request item 5 — the fourth bullet: FIXED.** Marker inventory by computed `list-style-type` and
nesting depth across **all 20 public pages** at 1440: `none@d1 508`, `disc@d1 534`, `disc@d2 98`.
**Zero `circle` anywhere.** With every interview-prep answer opened at 390, the visible set is the
same (`disc@d2 ×98`). Verified visually — depth-2 bullets are filled discs identical to depth 1
(`fin2-cd-ip-390-nested.png`).

**Request item 9 — the chip-strip veil at 768: FIXED.** `.guide-aside nav::after` computes
`linear-gradient(270deg, rgb(250,249,246) 40%, rgba(250,249,246,0))`, 48 px, at **both** 390 and 768
(and correctly `content:none` at 1440, where the strip does not overflow). Strip overflow 586 px at
390, 208 px at 768.

**Request item 10 — Key Skills tag contrast: NO ISSUE, and I computed it myself.** `.info-card .tag`
is `#ffd9a0` on `rgba(255,255,255,0.12)` over the panel's `rgb(21,32,43)`, i.e. an effective
`rgb(49,59,68)`. Contrast = **8.53 : 1**. The judge's "orange on dark brown" failure does not
reproduce; axe reports 0 colour-contrast findings on index at all three widths.

**Request item 11 — the truncated `<select>`: FIXED for the default state, one option still overruns.**
At 390 all six selects are 292 px with 272 px inner. Measuring each select's **longest** option in
its own computed font: five have 31–130 px of slack; `#studyMaterials` needs 271 px against 254 px
usable for *"A Cloud Guru subscription (~$30/month)"* — **−17 px**. The *selected* label
("Udemy courses…") now fits, which is what the builder measured and what the judge saw, so the
screenshot is clean; choose the last option and it clips again. Nit, not a ranked issue.

**Request item 12 — intra-card rules: FIXED, and the one exception was disclosed honestly.**
I measured the spread of each card's rule bottom across every visual row myself: projects 1440 and
768, index cert cards 1440/768, resources books 1440/768 — **0 px on every row**. The single
misalignment left on the site is `.course-meta` on resources at 768, **25 px on one row**, which the
builder reported and explained. That matches my measurement exactly.

**Reader item (c) — the back-to-top control.** Measured on a project page at 390 and 1440: hidden at
rest (`display:none`), after one viewport it is **44 × 44, `border-radius: 50%`, white ground, 1 px
`#d8d2c6`, no shadow, 16 px from the right edge, 96 px above the viewport bottom**. It is quiet and
it works. **Is the 50 % radius a tell? Yes — a small one.** Two reasons, both measured: (i) it is the
site's only circle — on the same page I count **40 elements at 5 px and 6 at 8 px, and nothing else
at 50 %**, so the one radius token that has held across 21 pages is broken by a single control;
(ii) a floating circular button pinned to the bottom-right corner is the most recognisable piece of
stock theme furniture there is, and neither Stripe, Cloudflare nor Smashing ships one. It is not
worth a round on its own — `var(--radius)` is a one-token change — but it is the one new tell this
round added, and at 390 it also sits **on top of** the last line of a step list rather than clearing
the measure (`fin2-cd-proj-390-totop.png`).

---

### The single worst screen, site-wide

**`harness/out/peek/fin2-cd-404-1440-0.png` — 404 at 1440.** The home hero has vacated the position
and nothing on the site is now badly composed, so the worst screen is a small one: a 1440 × 900
frame holding a 576 px column in the top-left corner, under a navy bar containing one orange cloud
glyph and nothing else, led by a display numeral in mid-grey that reads as disabled. Two of the
three things wrong with it are content approvals; the grey numeral is not.

### Ranked issues (worst first)

**1. The right track at ≥64em is decided for the hero and nowhere else — COMPONENT (layout shell)**
Pages/widths: `about.html`, `contact.html`, `privacy.html`, `404.html` (whole page); `index.html`
CTA band; the page-header band on all 7 listing/static pages; the `tools.html` calculator card — all
at 1440.
Screenshots: `fin2-cd-about-1440-0.png`, `fin2-cd-index-1440-footer.png` (CTA band in frame),
`fin2-cd-tools-1440-0.png`, `fin2-cd-404-1440-0.png`
Measured at 1440: container 152→1288 (1136 px). Widest content in `main`: about/contact/privacy
**792**, 404 **728**. The index CTA band is 792. The seven page-header bands are 792 — now one edge
each, which was the r1 ask and is properly done — but they sit above sections whose own content runs
to 1288, so the page still steps 792 → 1288 → 792 down its length. On `tools.html` a single screen
shows three edges: header 792, section rule 1288, calculator card 640. This is much better than r1
(the first screen of the site is now composed, and every rule ends where its content ends), but the
underlying question — what occupies the right track on a prose page at ≥64em — is still unanswered,
and all three references answer it.
*Fixed looks like:* the same move that just worked on the hero, applied once in the shell to the
static-page template: a right track at ≥64em carrying whatever the page has (an "on this page" list,
a related-links rail like the project template's 1040→1288 one, a contents/contact block), or the
band centred as a unit so the whitespace is symmetrical rather than all on one side. One decision,
one place, four pages and two bands inherit it.

**2. The footer's columns fill the row but not the block — COMPONENT**
Pages/widths: every page at 1440. Screenshots: `fin2-cd-index-1440-footer.png`,
`fin2-cd-about-1440-footer.png`
The track fix is real and I verified it (4 × 260 or 3 × 357, always 152→1288, no dead track). What
the reader sees is unchanged: measured voids under each column's content are **[178, 0, 91, 137]**
at 1440 on the 4-column pages and **[178, 0, 137]** on about/privacy. The 178 px hole sits directly
under the wordmark — the strongest thing in the footer — on all 21 pages, and the footer now has
three different bottom edges instead of two. This has been open since W1 r1 and is the most-repeated
component on the site.
*Fixed looks like:* the ratio reflects the content — a wider first column with the description set
beside or under the wordmark so the blocks end near one baseline; or the link columns are given a
shared minimum height so the row bottoms agree; or the wordmark block moves to its own ruled row
above the link columns. Any of the three ends the void.

**3. 404 does not read as this site's 404 — PAGE (one CSS item, two approvals)**
Page/width: `404.html` at 1440 and 390. Screenshots: `fin2-cd-404-1440-0.png`, `fin2-cd-404-390-0.png`
The band now carries the shell's hairline and the mark's 24 px box at the shell's gutter — measured,
and correct. It still reads wrong because the bar is otherwise empty (no wordmark — approval), the
mark is a text `☁` at `filter:none` where every other page draws an SVG (approval), and the numeral
"404" is `rgb(89,97,105)` display type at 96 px, the only non-ink display type on the site, which
reads as disabled rather than as a label. The third of those is pure CSS and was named in r1.
*Fixed looks like:* "404" as an `--ink-3` small-caps eyebrow above the headline (or in ink at the
headline's weight), so the page leads with "This resource has been terminated" instead of with grey
furniture; wordmark and SVG mark when the approval lands.

**4. At 1440 a tool row's action is ~575 px from its description — PAGE (carried, not taken)**
Page/width: `tools.html` at 1440. Screenshot: `fin2-cd-tools-1440-rows.png`
Measured: row 1136 px, title x=200, description ends ≈625, `Open Tool ↗` 1200→1288. Four such rows.
*Fixed looks like:* cap the row's text block at the reading measure so the action lands ~68 ch from
the title, or make the whole row the link with `↗` as the only mark on the right.

**5. The back-to-top control is the site's only circle, and at 390 it overlaps the measure — COMPONENT**
Pages/widths: every page with `.to-top`, at 390 and 1440. Screenshots: `fin2-cd-proj-390-totop.png`,
`fin2-cd-proj-1440-code.png`
`border-radius: 50%` against 40 elements at 5 px and 6 at 8 px on the same page; positioned
`right:16 / bottom:96` so at 390 it sits over the tail of body text rather than clear of it.
*Fixed looks like:* `var(--radius)` (the 8 px panel radius) so the control joins the system, and
either a wider right offset at <64em or an inline placement at the end of long sections.

**6. The difficulty pill still sits inside the question sentence — PAGE (approval)**
`interview-prep.html`, 390 and 1440. `fin2-cd-ip-390-nested.png`, `fin2-cd-ip-390-answer.png`.
Unchanged from r1; the badge is inside the frozen text run so this needs an approval, not CSS.

**7. Article pagination still tells the reader nothing — PAGE (approval)**
All 11 project pages. "Previous Project" / "Back to All Projects", no destination name, no Next.
HUMAN_TODO, correctly untouched this round.

**8. Two undeclared semantic hues inside the architecture diagrams — COMPONENT (not taken)**
All 11 project pages. Green `#7ad3a4` and rose `#f08b8b` left bars with no legend and no repetition
of the meaning elsewhere. Explicitly out of scope for r2; still open.

### Template tells I can still find: **six** (was nine)

Closed this round: browser-default bullets (0 `circle` site-wide), controls and labels wearing the
same chip (three measured skins), an affiliate placement dressed as editorial (labelled `PARTNER`,
ruled band, outline CTA, no orange). The footer is no longer "a shared component that is not
shared" — the CSS is genuinely shared and both variants fill their row; what remains is a content
difference in the link set, which is a HUMAN_TODO, not a tell.

1. **One full-colour emoji standing in for the logo** — `☁` on `404.html` at `filter:none /
   opacity:1 / rgb(255,153,0)`, where every other page draws the mark as SVG
   (`fin2-cd-404-1440-0.png`).
2. **Placeholder pagination copy** — "Previous Project" / "Back to All Projects", no Next.
3. **"Learn More" ×4** as the cert-card action, still costing SEO 92 on index and tools.
4. **An unresolved right track at ≥64em** — now on about/contact/privacy/404, the index CTA band and
   the seven page-header bands, rather than on the site's first screen
   (`fin2-cd-about-1440-0.png`, `fin2-cd-404-1440-0.png`).
5. **A 768 px tablet served the phone drawer** — 768 px of navy over the page; the nav still breaks
   at 60em (`fin2-cd-drawer-768.png`). Parked for Wave 3.
6. **A circular floating button** — the site's only 50 % radius, stock theme furniture, new this
   round (`fin2-cd-proj-390-totop.png`).

### Nits

- The hero stats column starts at **856** while the Key Skills panel one band below starts at
  **804.4** — the two objects in the new right track share a right edge but miss each other's left
  edge by 51.6 px, and they are in the same frame (`fin2-cd-index-1440-hero.png`). One track
  definition would fix both.
- `#studyMaterials` on `tools.html` at 390: the selected label now fits, but the option
  *"A Cloud Guru subscription (~$30/month)"* needs 271 px against 254 px usable — **−17 px** — so it
  still clips if chosen. The other five selects have 31–130 px of slack.
- `.course-meta`'s rule on `resources.html` at 768 is 25 px out on one row (measured; the builder
  disclosed it and the fix costs a blank line in three cards — I agree with leaving it).
- "Advanced" still renders three ways site-wide (pill / tag / plain meta text). The rule behind it is
  now stated and defensible; I am recording it rather than ranking it.
- The open drawer toggle's border is now **1 px** `--aws-orange` (was 2 px) — still orange next to a
  light focus ring, so it still reads as focus rather than state (`fin2-cd-drawer-768.png`).
- The 390 TOC chip veil now fades to the page ground at both 390 and 768 and is a real fade — but
  over a white chip it is still nearly invisible, so the mid-word cut carries the affordance
  (`fin2-cd-proj-390-0.png`).
- 264 px of gutter between the article's right edge (776) and the rail (1040) on project pages at
  1440 — unchanged, still wider than either reference (`fin2-cd-proj-1440-code.png`).
- A correction to my own r1 inventory: filled orange is **not** "exactly one per page" — `index.html`
  carries two (`Start Your Journey` in the hero, `View the Roadmap` in the CTA band), and projects,
  resources, interview-prep, about, privacy and all 11 project pages carry **zero**. The discipline
  is real, the count was wrong.
- `sap-c02.jpg` is still *The Kubernetes Book*; index/tools SEO 92 on four frozen "Learn More";
  `resources.html` LCP 2.10 s against a 1.8 s budget (recorded D2 exception); `WEIGHT: FAIL
  (19 pages)` against the pre-facelift tree. All HUMAN_TODO or recorded, none chargeable here.

### What is good and must not be refactored away

- **The article template at 1440 is now finished work.** One right edge at 776 across 306 measured
  elements on 11 pages, a rail at 1040→1288, code that scrolls inside itself when it must, diagrams
  that never scroll at any width, and an ad well that inherits the same 624 px. That is the
  Cloudflare reference, met.
- **The hero fix is the right kind of fix**: no new markup, explicit grid placement, the same three
  `.stat` elements re-read as a ruled list, the panel landing on a track the page already had, and
  the hero 86 px shorter for it.
- **The partner band is a genuine act of design judgement** — it stopped being a card, took a label,
  gave back the orange, and is now measurably outside the MPU window at every width.
- **The chip system tells a control from a label** in three measurable skins, and the bullet set is
  down to one intended family with zero browser defaults leaking.
- **The invariants held while all of that landed**: 0 axe findings of any impact across 63 rows,
  CLS 0 on every public row, 0 console errors on public pages, perf 99–100, a11y/BP 100,
  `INTEGRITY: PASS` with 0 approvals burned, and styles.css inside its 8,700 B budget at 8,680.

**Score: 8.6/10. Verdict: PASS** (threshold 8.5).

Both r1 blockers were charged at the same weight. The article column is **fully** closed, verified on
all 11 pages by my own measurement. The frame question is closed **where it mattered most** — the
site's first screen, which was my named worst screen, is now composed and reads as designed — but not
as the one shell-level decision I asked for, so about, contact, privacy, 404 and the CTA/header bands
still leave 45 % of the frame empty at 1440. Against that, five secondary items I had ranked or noted
are closed cleanly and verifiably, and one new small tell was introduced. That is more than enough
movement to clear the bar and not nearly enough to reach the 8.8 I forecast. The next 0.2 is issue 1
applied once in the shell; the 0.2 after that is the footer.

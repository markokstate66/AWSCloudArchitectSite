# Wave 1 · Round 2 · Creative director

Area: design-system + layout-shell   Round: 2   Critic: creative director   Score: **8.6/10**   Verdict: **PASS**

Scored against `docs/REFERENCES.md` only (Stripe Docs, Cloudflare Developer Docs, Smashing Magazine),
and only on the shell and the design-system primitives: header, drawer, breadcrumbs, page-header band,
footer, tokens/type/colour, chips/badges/buttons, section rhythm, focus rings, home hero + CTA band,
measure caps. Wave 2 bodies (article prose, code blocks, diagrams, listing cards, static prose) are
excluded from the score; where one is visible in a shot I say so.

**What I scored: commit `f12fce5` (wave1-r2), clean tree.** All `cd3-*` captures were taken at
01:55:36–01:57:20 local. The Wave 2 round-2 builders began writing at 01:58:02 and by 02:02 had
`404.html`, `contact.html`, `interview-prep.html`, `projects.html`, `tools.html` **and `styles.css`**
modified in the working tree. Nothing I cite comes from that tree. Two extra shots
(`cd3-resources@1440+2300.png`, `cd3-index@1440+6600.png`) were taken after 01:58 and are therefore
served from a throwaway `git archive HEAD` extraction on port 4199, not from the live working copy.

---

## Screenshots looked at

Captured with `harness/out/cd3-shots.js` / `cd3-probe.js` (batched `peek.js`), opened one by one.

| File (`harness/out/peek/`) | What is seen |
|---|---|
| `cd3-index@390+0.png` | Hero at 390: 56 px navy bar, 44×44 toggle, rust accent phrase, hairline stats row still wrapping 2+1, one orange CTA, full-container 2 px rule above the next h2. |
| `cd3-index@390+2400.png` | Roadmap timeline: 1 px rail, outlined numbers, neutral chips. |
| `cd3-index@390+5200.png` | **The double rule.** A 2 px ink rule *above* "Best AWS Learning Resources" (h2) and a second 2 px ink rule *below* "Free Resources" (h3), 130 px apart. |
| `cd3-index@390+8200.png` | Peach "Note:" callout with rust bar; FAQ list with `+`; rule above the FAQ h2. |
| `cd3-index@768+0.png` | 64 px header; hero with one right edge (24→664); full-container rule. Best breakpoint on the site. |
| `cd3-index@768+1200.png` | Info-card / feature list at 768, single column, no overflow. |
| `cd3-index@1440+0.png` | Hero: h1, subtitle and stats rule all stop at 792; right 648 px of the band empty. Section rule 152→1288 with the navy Key Skills card filling the right. |
| `cd3-index@1440+2400.png` | Cert row: four identical neutral cards, 3 px `--line-2` top rule, eyebrow + em-dash meta + rust "Learn More". The four hues are gone. |
| `cd3-index@1440+3400.png` | Ruled 3-column resource lists (Wave 2 — the r1 card soup is gone); h3 rules sit *below* their headings while the salary h2 rule sits *above*. Salary featured card still has an orange top bar. |
| `cd3-index@1440+8200.png` / `cd3-index@1440+6600.png` | CTA band: rule 152→1288, heading text ends ~700, paragraph ends 792 — ~500 px of rule over nothing. Footer: 4 columns, ~200 px void under column 1. |
| `cd3-project-multi-account-landing-zone@1440+0.png` | **The fix.** Breadcrumb, "Advanced" badge, h1, subtitle, "Project Overview", prose and the key-facts `<dl>` all on x=152; rail 1088→1288. |
| `cd3-project-multi-account-landing-zone@1440+600.png` | Same left edge continued; article separators are 1 px and measure-wide; diagram is a navy panel (Wave 2). |
| `cd3-project-multi-account-landing-zone@390+0.png` | Project page at 390: single-ink h1, ruled key-facts; the rose "Advanced" pill is the first colour on the page. |
| `cd3-drawer-index@390.png` | **Modal drawer.** Navy panel, page dimmed by a scrim, clean bottom hairline, × toggle, light focus ring on the first link. |
| `cd3-drawer-project-multi-account-landing-zone@390.png` | Same over an article page; nothing cut mid-line any more. |
| `cd3-drawer-index@768.png` | Same at 768. |
| `cd3-focus-navlink@1440.png` | 2 px `#f2f5f8` ring, 2 px offset, complete, around a header nav link on navy. |
| `cd3-focus-footerlink@1440.png` | Same light ring around a 226×46 footer link on navy. |
| `cd3-about@390+0.png` / `cd3-contact@390+0.png` | "About Us" / "Contact Us" in **one** ink colour. |
| `cd3-projects@1440+0.png` | Neutral service chips, one green level badge, single left edge, orange `aria-current` underline. |
| `cd3-resources@1440+400.png` | Book cards: neutral tags ("Best Seller", "SAA-C03", **"Advanced"**), outline "View on Amazon". |
| `cd3-resources@1440+2300.png` | Course cards: **pink outline uppercase chips** ("LEARNING PATH", "COURSE") in the same card family as the neutral book tags; level shown as grey text beside a glyph. |
| `cd3-interview-prep@1440+400.png` | Difficulty pills green/amber/rose — the same triad as project levels. h3 category rules sit *below* their headings. |

Measurements behind every number: `harness/out/cd3-probe.js`, `harness/out/cd3-probe2.js`
(git-ignored `harness/out/`).

---

## Gate results

```
console=0 (60 public runs; 3 on admin.html = the known local-only /.auth/me 404, same as baseline)
pageErrors=0  failedRequests=0 (public)  axeSC=0  axeAll=0  hOverflow=0 (390/768/1440)
perf=99-100   a11y=100   bp=100   SEO=100 except index.html and tools.html 92 (link-text)
lcp=1.38-1.65 s except resources.html 2.10 s   cls: max 0.0019 public (0 everywhere but resources)
tbt=0-2 ms
integrity=PASS - INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals)
```

Sources: `harness/out/wave1-r2/summary.json` (63 rows, label `wave1-r2`, 2026-09-13T07:46Z),
`harness/out/wave1-r2/lighthouse/summary.json`, and `node harness/integrity.js compare --base
baseline-2026-09-13` re-run by me just now.

Unchanged from r1, and still not mine to fix: **the area cannot PASS the overall gate** on budgets
alone — SEO 92 on `index.html` / `tools.html` (the five frozen "Learn More" links, HUMAN_TODO A5) and
`resources.html` LCP 2.10 s. Both are explicitly parked by the round brief. My score is a score, not
a gate clearance.

---

## Re-check of my round-1 issues

| # | Round-1 issue | Status | Evidence |
|---|---|---|---|
| 1 | Project article centred under a left-flushed page header | **FIXED** | All 11 `project-*.html` at 1440: `.page-header h1` = `.guide-overview h2` = `.breadcrumbs a` = `.brand` = **152.0**; `.site-footer .container` box 120→1320 with its content (h4, bottom line) at **152**; article right edge 775, rail 1088→1288. Was 152 vs 284 with the breadcrumb at 32. `cd3-project-multi-account-landing-zone@1440+0.png` |
| 2 | Partial-height dropdown over live, scrollable content | **FIXED** | Open at 390 and 768, on index and a project page: scrim `position:fixed`, `rgba(21,32,43,.55)`, top = header height, z 90 under the header's z 100 / panel z 120; `html{overflow:hidden}`; wheel 600 px leaves `scrollY = 0` (was 600); Tab from the toggle lands on "Roadmap" *inside* `#site-nav` (was "Start Your Journey" in the body); outside tap closes and restores overflow. `cd3-drawer-index@390.png`, `cd3-drawer-index@768.png`, `cd3-drawer-project-multi-account-landing-zone@390.png` |
| 3 | h1 accent producing "About **Us**" | **FIXED** | Computed `h1 span` colour: index `rgb(154,52,18)` (kept, the phrase is the subject); about / contact / projects / resources / tools / interview-prep / privacy / project page all `rgb(26,29,33)` = the h1 ink. `cd3-about@390+0.png`, `cd3-contact@390+0.png` |
| 4 | Seven section-rule lengths on one page | **PARTIALLY** | The seven `.section > .container > h2` rules on index@1440 are now **1136, 1136, 1136, 1136, 1136, 1136, 1136**. But `styles.css:310` still gives `.resource-category h3, .interview-category h3` the *same* 2 px `--ink` rule on the *opposite* side, so index, resources and interview-prep show two contradictory versions of one device on one screen. See ranked issue 1. |
| 5 | Seven hues beside the accent | **PARTIALLY** | Real progress: service chips, book tags and book meta are neutral (white / `--line` / `--ink-2`); the four cert-card hues are deleted; one semantic triad (`--ok` / `--warn` / `--danger` + tints) now serves *both* project levels and interview difficulty. Remaining: the pink `.course-level` chip, and the same word "Advanced" rendered three ways. See ranked issue 2. |
| 6 | Hero and CTA with three right edges | **PARTIALLY** | Hero h1 / subtitle / stats all `152..792` (were 1256 / 746 / 888); CTA paragraph 792. Two edges left, not four. But the rule above the CTA heading still runs to 1288 and the band's right 45 % is empty. See ranked issues 3 and 4. |
| 7 | 404.html is a different website | **NOT FIXED — parked** | The round brief parked it (`docs/IDEAS.md`); a Wave 2 builder is rewriting the file right now. Not counted against this score. |
| 8 | Roadmap body copy at 80 ch | **FIXED** | Widest `main p` on index@1440 is now **696 px / 68.0 ch** (was 734 px / 80 ch). No prose block on the page exceeds 68 ch. |

Round-1 nits: focus ring on navy **FIXED** (computed `rgb(242,245,248)` 2 px solid, 2 px offset on
both a nav link and a footer link, against `rgb(21,32,43)` — `cd3-focus-navlink@1440.png`,
`cd3-focus-footerlink@1440.png`). Hero stats 2+1 wrap, footer column voids, three list-marker
treatments and the 60em nav break are all **unchanged**; see Nits.

---

## Ranked issues (worst first)

### 1. One 2 px ink rule, applied above h2 and below h3, 130 px apart — COMPONENT
**Pages/widths:** index.html (390 and 1440), resources.html, interview-prep.html.
**Screenshots:** `harness/out/peek/cd3-index@390+5200.png` (both rules in one viewport),
`harness/out/peek/cd3-index@1440+3400.png`, `harness/out/peek/cd3-interview-prep@1440+400.png`

`styles.css:152` — `.section > .container > h2 { padding-top: .75rem; border-top: 2px solid
var(--ink) }`. `styles.css:310` — `.resource-category h3, .interview-category h3 { padding-bottom:
.75rem; border-bottom: 2px solid var(--ink) }`. Identical weight, identical colour, opposite side,
one level of heading apart. On `cd3-index@390+5200.png` the reader gets: rule → "Best AWS Learning
Resources" → subtitle → "Free Resources" → rule → list. The second rule looks like it closes the h2
group rather than opening the h3 one, and the hierarchy inverts.

This is round-1 issue 4 in a new form. The length is now one decision; the *direction* is two.

**Fixed looks like:** one 2 px ink rule, one side, one heading level. The column header is a
different component and should take a different, lighter device — a 1 px `--line` rule, or nothing
but the eyebrow treatment the cert cards already use. A two-line CSS change.

### 2. "Advanced" is three different components, and a fifth hue survives — COMPONENT (chip/badge primitives)
**Pages/widths:** projects.html and all 11 project pages, resources.html — all widths.
**Screenshots:** `harness/out/peek/cd3-projects@1440+0.png`,
`harness/out/peek/cd3-project-multi-account-landing-zone@390+0.png`,
`harness/out/peek/cd3-resources@1440+400.png`, `harness/out/peek/cd3-resources@1440+2300.png`

Reconciled per component, across the four pages I inventoried by computed style:

| Component | Where | Treatment |
|---|---|---|
| `.project-services span`, `.book-tag`, `.book-meta span`, `.roadmap-skills span` | project cards, books, timeline | **neutral chip** — `#fff` / `--line` / `--ink-2`, 13 px. One system. Good. |
| `.tag` / `.skill-tags span` | navy insets only | amber `#ffd9a0` on `rgba(255,255,255,.07)` — the navy-surface variant of the same chip. Fine. |
| `.project-level`, `.question-difficulty` | project cards, project page eyebrow, interview rows | **tinted pill**, one triad: `--ok` `#e7f4ec`/`#14663f`, `--warn` `#fdf1dc`/`#8a4b00`, `--danger` `#fbeaea`/`#a4262c`. One system, used consistently in two places. Good. |
| `.course-level` | Pluralsight / course cards | **pink outline chip**, `#9d174d` text and `#f3c6de` hairline, uppercase — a fifth hue and a second chip treatment inside the same card family as the neutral book tags. |
| `.ps-logo` | Pluralsight panel | same pink wordmark + 3 px rule. |
| `.cert-card` top rule | cert cards | 3 px `--line-2` — a thicker copy of the card's own 1 px border; signals nothing. |
| `.salary-card.featured` top rule | salary cards | one `--aws-orange` rule (listing-pages; being removed in their r2, uncommitted). |

Two things a reader actually meets:

- The word **"Advanced"** is a rose `--danger` pill on `projects.html` and on 11 project pages
  (`cd3-project-multi-account-landing-zone@390+0.png` — it is the *first* colour on the page), a
  **neutral chip** on a resources book card (`cd3-resources@1440+400.png`), and **plain grey text
  beside a glyph** on a course card (`cd3-resources@1440+2300.png`). Three treatments, one word.
- The badge that reads "LEARNING PATH" / "COURSE" is a *type* label wearing the level-badge shape in
  a hue that belongs to neither system (`cd3-resources@1440+2300.png`).

Contrast is fine everywhere (axe 0). This is discipline, not accessibility — but `--danger` meaning
"hard" is also a token-semantics smell: the strongest alarm colour in the palette is the first thing
on every project page.

**Fixed looks like:** one level/difficulty badge component used on every page that states a level
(including the course cards); one *type* eyebrow component, neutral, for "Learning path" / "Course"
(the cert cards' `FOUNDATIONAL / ASSOCIATE` eyebrow is already exactly that and costs no colour);
`--danger` reserved for errors, with the top difficulty step taking the third step of a warm scale.
Then Pluralsight pink survives only on the `.ps-logo` wordmark, where a brand mark belongs.

### 3. The section rule overruns its own content by 300–500 px in every band with no right-hand column — COMPONENT
**Page/width:** index.html at 1440 (CTA band, FAQ band); the page-header band on all 18 non-home pages.
**Screenshots:** `harness/out/peek/cd3-index@1440+8200.png`, `harness/out/peek/cd3-index@1440+6600.png`

The rule is now a constant 1136 px. The content under it is not. Measured at 1440:

```
container content           152..1288  (1136)   <- every section h2 rule
home hero h1/sub/stats      152..792   (640, --band)
CTA paragraph               152..792   (640)      rule overhang ~500 px
.faq-list                   152..984   (832, 52rem)   rule overhang ~304 px
.section-subtitle           152..848   (696, 68ch)
.page-header h1             152..895   (743, 34ch)   band has no rule at all
.page-header .hero-subtitle 152..918   (766, 60ch)
project article             152..775   (623, 68ch)   rail 1088..1288
```

Seven content widths under one rule width. In the bands where a grid fills the container (certs,
salary, resource lists, the Key Skills card in the intro band) the rule is earned and reads well —
`cd3-index@1440+0.png` and `cd3-index@1440+2400.png` are good screens. In the CTA band it is a
500 px line over empty paper (`cd3-index@1440+8200.png`), and in the FAQ band it is 300 px over
empty paper. The references don't do this: Cloudflare's hairline spans the content column it belongs
to, and Stripe uses space instead of a rule.

**Fixed looks like:** two widths, not seven — a measure and the container — with the rule following
whichever the band actually uses, or no rule in bands whose content is measure-width. `--band`
(40rem), `--measure` (68ch) and the ad-hoc `52rem` on `.faq-list` and `34ch`/`60ch` on the
page-header should collapse to two tokens.

### 4. The 1440 home hero and CTA band are a left column in an empty frame — PAGE (index.html)
**Page/width:** index.html at 1440 and above.
**Screenshots:** `harness/out/peek/cd3-index@1440+0.png`, `harness/out/peek/cd3-index@1440+8200.png`

The r1 defect (four right edges) is genuinely gone; what is left is that the decision taken was
"cap everything at 640 px" with nothing on the other side. The hero band is 484 px tall with
648 px — 45 % of the viewport — empty to the right of the stats rule, and the CTA band repeats it.
One band lower the site proves it knows how to fill that space: the navy "Key Skills Required" card
sits at 804→1288 and makes `cd3-index@1440+0.png`'s *second* band the strongest composition on the
page.

This is a real step up from r1 and I am not ranking it as a failure of the fix — it is the next
move, and it is the difference between "correct" and "designed".

**Fixed looks like:** something deliberate in the hero's right track at ≥ 64em — the three stats as
a ruled panel on the right rather than a wrapped row on the left, or the Key Skills card promoted
into the hero — and the CTA band either centred as a unit or given the same two-track treatment.

### 5. Footer columns are top-aligned with a ~200 px void under column 1 — COMPONENT
**Page/width:** every page at 1440.
**Screenshot:** `harness/out/peek/cd3-index@1440+8200.png`

Unchanged from my r1 nit, promoted because the rest of the shell has caught up with it. Column 1
(wordmark + two lines) is ~90 px tall; columns 2–4 run to ~290 px. The result is a large empty block
at the bottom-left of every page, directly under the strongest thing in the footer.

**Fixed looks like:** a column ratio that reflects the content (a wider first column, or the
description moved under the wordmark inline), or the four columns given equal visual weight by
moving one link group into column 1.

---

## Nits

- **Hero stats still wrap 2+1 at 390** — "$150K+ / 32%" then an orphaned "#1"
  (`cd3-index@390+0.png`). Unchanged from r1; still reads unintentional.
- **`.nav-toggle[aria-expanded="true"]` takes an `--aws-orange` border** (`styles.css:107`). On navy,
  next to a light `#f2f5f8` focus ring, a 2 px orange box around a control reads as a focus
  indicator rather than an open state (`cd3-drawer-index@390.png`). Use the panel's own hairline or a
  fill, not a second ring language.
- **Two accents doing overlapping jobs**: `--accent` `#c2410c` (links, hover, feature check marks,
  the `+` affordance, the home h1 phrase) and `--aws-orange` `#ff9900` (primary buttons,
  `aria-current` underline, the open-toggle border, the featured salary rule). They read as one warm
  family, but two hues split the same "this is the accent" job.
- **Three list-marker treatments** survive: rust check marks on the feature list
  (`cd3-index@1440+0.png`), grey dots on prerequisites
  (`cd3-project-multi-account-landing-zone@1440+600.png`), em-dashes on cert-card meta
  (`cd3-index@1440+2400.png`). Pick two.
- **313 px gutter between the article and the rail** on project pages at 1440 (article ends 775, rail
  starts 1088 — `cd3-project-multi-account-landing-zone@1440+0.png`). It no longer reads as a lost
  sidebar, but it is a wide canyon; a 68ch article plus a 15.5rem rail inside a 1136 container leaves
  more air than either reference does.
- **Page-header h1 (34ch) and subtitle (60ch) have different caps**, so their right edges disagree by
  page (`cd3-projects@1440+0.png`). Folds into ranked issue 3.
- **`.section-subtitle` still claws back the h2 margin with `-.75rem`** — simpler than r1, but the
  h2→subtitle gap is still not expressible in the spacing scale.
- **The nav still breaks to the hamburger at 60em**, so a 768 px tablet gets the phone drawer
  (`cd3-index@768+0.png`). Parked for Wave 3 by the brief; noting it so it is not forgotten.
- **`.cert-card`'s 3 px `--line-2` top rule** is a thicker version of its own border and signals
  nothing (`cd3-index@1440+2400.png`). The uncommitted Wave 2 r2 work already deletes it.

---

## What is genuinely good (so it does not get refactored away)

- **The single left edge on project pages is the biggest win of the round.** 11 of 21 pages went from
  a 256 px register error to breadcrumb, eyebrow, h1, subtitle, body and footer all on x=152, with a
  real rail hanging on the right container edge. `cd3-project-multi-account-landing-zone@1440+0.png`
  is now within sight of Cloudflare Developer Docs, which is exactly what that reference is for.
- **The drawer is correct**, not merely improved: scrim, scroll lock, DOM-order tab entry, outside-tap
  close, Escape with focus return, clean bottom hairline, at both 390 and 768, on both a home page and
  an article page. Verified by script, not by eye alone.
- **Focus rings are light on dark surfaces.** `#f2f5f8` at 2 px / 2 px offset on `#15202b` replaces a
  3.18:1 rust ring. It is the clearest indicator on the site now.
- **The colour system is a system.** One neutral chip, one semantic triad shared by two different
  page families, four decorative hues deleted. Issue 2 is about the last 20 %, not the first 80 %.
- **Type and measure remain reference-grade**: 17 px / 1.65, no prose block over 68 ch anywhere on
  index, negative tracking on headings, no webfonts, CLS 0 on every public page at every width.
- **Integrity PASS with zero approvals burned**, 0 axe violations of any impact across 60 runs, 0
  console errors on public pages, and the sheet went *down* 4,920 raw bytes while doing all of it.

---

**Score: 8.6/10 — publication-grade with nits.** The four things that held r1 to 7.6 are three fixed
outright and one fixed on its own terms; what is left is second-order and every item on the list is a
one-to-three-line CSS change. The shell now reads as designed rather than themed: a project page at
1440 has one vertical, the mobile menu is a state instead of an artefact, and no h1 says "About
**Us**" any more. It does not reach 9+ because the site still contains two contradictory versions of
its own heading rule, three treatments of the word "Advanced", seven content widths under one rule
width, and a home hero whose right 45 % is empty by decision rather than by composition.
**Verdict: PASS** on my axis. The *area* still cannot clear the overall gate until SEO 92 on
index/tools and `resources.html` LCP 2.10 s are resolved by their owners.

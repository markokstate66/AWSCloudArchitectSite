# Wave 2 round 2 — monetization & SEO critic (+ Wave 1 ad-well re-verification)

Date: 2026-09-13 · Branch `facelift` · Site tree as of `59ad633` · Five scores below.

**No live ad was loaded at any point.** Every capture ran through the harness route blocker
(`harness/pages.js` `BLOCKED_HOST_RE`, fulfilled 204 / empty-JS). Production was never opened.
Every well in these screenshots is the repo's own `.ad-well` markup with a **local striped
placeholder div** — no `<ins>`, no network, nothing clickable. I wrote no site file and no `docs/`
file except this report. Probes are in `harness/out/ms4-*.js` (git-ignored); raw numbers in
`harness/out/ms4-wells.json`, `ms4-seo.json`, `ms4-probe2.json`.

**Tree movement (stated, not a complaint this time).** HEAD moved from `59ad633` to `dc2e726`
while I worked. `git diff --stat 59ad633..HEAD` = `docs/HUMAN_TODO.md`, `docs/IDEAS.md`,
`harness/ab-pairs.js` — **no HTML, no `styles.css`, no `script.js`**. Every measurement below
therefore still describes the frozen site tree. Working tree clean throughout.

---

## Shared evidence

### Gates, run on this tree

```
node harness/integrity.js compare --base baseline-2026-09-13
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)

node harness/weight.js
styles.css: raw 42682 (ref 35518), gzip 9418 (ref 6078)
WEIGHT: FAIL (19 pages over their gzip baseline)
  project pages   +4,245 … +4,428 gzip      static +2,070 … +3,525
  listings        +2,693 … +3,087           404.html +248
  only OK: resources.html  gzip 161,108 vs 372,586  (−211,478)

node harness/apply-shell.js  --check -> 0/19 pages would change
node harness/apply-article.js --check -> 0/11
node harness/apply-code.js    --check -> 0/11  (43 code blocks, 1132 spans)
node harness/apply-ads.js     --check -> would place 0 units; skipped 33  (inert: no docs/AD_UNITS.json)
```

Weight is **recorded, not scored** (integrator sign-off item D1). `INTEGRITY` last line:
`INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)`.

### `harness/out/merged-r2/summary.json` (fresh: written 02:38:51, after the last site edit at 02:28:35)

```
63 rows; 60 public.  consoleErrors=0  pageErrors=0  failedRequests=0
axe serious+critical=0   axe any impact=0   hOverflow=0/60
max CLS on a public page = 0.0014 (the 11 project pages @1440 only; 0 everywhere else)
max LCP (lab, snap) = 132 ms
admin.html carries its 3 known local /.auth/me errors (out of scope)
```

`harness/out/merged-r2/lighthouse/summary.json`:

| page | perf | a11y | BP | SEO | LCP | CLS | TBT | failing audits |
|---|---|---|---|---|---|---|---|---|
| index | 100 | 100 | 100 | **92** | 1.65 | 0 | 0 | `link-text`, bf-cache |
| projects | 100 | 100 | 100 | 100 | 1.65 | 0 | 0 | bf-cache |
| tools | 100 | 100 | 100 | **92** | 1.65 | 0 | 0 | `link-text`, bf-cache |
| interview-prep | 100 | 100 | 100 | 100 | 1.65 | 0 | 0 | bf-cache |
| about | 100 | 100 | 100 | 100 | 1.50 | 0 | 0 | bf-cache |
| project-multi-account-landing-zone | 100 | 100 | 100 | 100 | 1.65 | 0 | 0 | bf-cache |
| resources | 99 | 100 | 100 | 100 | **2.18** | 0 | 0 | bf-cache |

`link-text` = the five frozen "Learn More" links (HUMAN_TODO A5). resources LCP 2.18 s against a
1.8 s budget is now a **recorded exception with experiment evidence** (HUMAN_TODO D2, added in
`de957ed`): covers removed → 1.8 s, re-encoded → 2.1 s, so it is request count, not bytes.

### Tracking / frozen artefacts — verified independently of the gate

- Per-page string diff of every line matching
  `googlesyndication|googletagmanager|gtag(|adsbygoogle|dataLayer|fundingchoices|ca-pub-`
  against `git show f1ec399:<page>`: **identical on all 21 pages, 0 diffs**.
- `<ins class="adsbygoogle">` in the repo HTML: **0**. In the live DOM of all 20 public pages: **0**.
  `.ad-well` instances shipped: **0** (Wave 3 scaffolding, as planned).
- `git diff f1ec399 -- ads.txt robots.txt sitemap.xml` → **empty**.
- `staticwebapp.config.json`: `globalHeaders` (the CSP), `mimeTypes`, `navigationFallback`,
  `responseOverrides`, `platform`, `trailingSlash` all **byte-identical to f1ec399**; only the
  `/docs/*`, `/harness/*`, `/_showcase/*`, `/README.md`, `/prompt.txt` blocking routes were added.
- Live DOM: AdSense loader + GA `G-VBQ33BLD4E` on the same 19 pages as baseline, neither on
  404.html; `consentMode` false on all 21 (no CMP introduced).
- `.js .ad-well.is-unfilled { display: none }` is the only rule in the sheet that can hide a well,
  and **nothing sets `is-unfilled`** (`grep -rn is-unfilled` = that one CSS line). `:has(` count in
  `styles.css` = 0. A well cannot collapse today, so the wrapper cannot produce a post-paint shift.

### SEO sweep — all 20 public pages, live DOM at 390 and 1440 (`harness/out/ms4-seo.js`)

Compared field-by-field against `harness/baseline/baseline-2026-09-13.json`. **PROBLEMS: none.**

- **Exactly one `<h1>` on every page**, every one inside `<main>`.
- **Heading skips (aria-level applied): 0 inside `<main>` and 0 document-wide, on all 20 pages** —
  including tools.html, whose baseline H2→H4 is neutralised by `aria-level`. Nothing introduced.
- **Duplicate element ids: 0 on all 20 pages.** Project `h2` ids 7/7 unique; the new `h3` step ids
  `step-1 … step-6` are unique on **11/11** pages; the step-number anchors are fragment-only
  (`#step-N`) and therefore invisible to the gate's internal-link set.
- `title`, `meta[description]`, `link[rel=canonical]`, `meta[robots]`: **identical to baseline on
  all 20**. `robots = index, follow` on 19; **`noindex` on 404.html only**. No leak.
- **Internal link set identical on all 20**; external link set identical on all 20.
- **JSON-LD parses everywhere it exists and the type sets are unchanged**: index
  WebSite+Organization+BreadcrumbList+FAQPage · projects/resources CollectionPage+BreadcrumbList ·
  tools WebApplication+BreadcrumbList · interview-prep FAQPage+BreadcrumbList · about
  AboutPage+BreadcrumbList · privacy WebPage+BreadcrumbList · contact, 404 and **the 11 project
  pages: none**. Nothing added by this round — the article rail carries **0** JSON-LD blocks.
- Images: `src|alt` set identical to baseline on all 20; 0 missing `width`/`height`, 0 missing `alt`.
- The article rail: `aside.guide-aside` `data-ui=true`, **7 links, all fragment-only**, 0 JSON-LD
  inside, its strings land in `uiText` not in the content snapshot (confirmed in the integrity run).

### Independent proof that the syntax highlighter added no text and no links

Not just the gate: I stripped `</?span[^>]*>` out of every `<pre>` in the 11 project pages and
compared the **source bytes** to `git show f1ec399:<page>`:

```
TOTAL 43 pre blocks, 0 differences vs f1ec399
```

Entities (`&lt;!DOCTYPE html&gt;` in the nginx heredoc) survive intact. Live DOM: **1,132 spans
across 43 blocks, 0 `<a>` inside any `.code-block`**, 1 button each (Copy).

---

## Wave 1 ad-well — RE-VERIFICATION

```
Area: design-system + layout-shell (Wave 1, ad-well items)   Round: 2 (re-verified)
Critic: monetization & SEO   Score: 8.7/10   Verdict: PASS
```

Shipped CSS now reads (`styles.css:486–494`):

```css
.ad-well { --ad-h: 280px; box-sizing: border-box; width: 100%; max-width: min(100%, 970px); margin: var(--sp-7) auto; padding: var(--sp-3) 0; border-block: 1px solid var(--line); }
.project-guide > .ad-well { grid-column: 1; }
.ad-well-label { display: block; margin: 0 0 var(--sp-3); … text-align: center; }
```

(landed in `93426da`; `git log -S` confirms `width: 100%` first appears there.)

**Measured, with a real `.ad-well` injected by Playwright at every AD_PLAN position**
(`harness/out/ms4-wells.js` → `ms4-wells.json`), 390 / 1024 / 1440:

| position | parent (display) | well width 390 / 1024 / 1440 | label | gap label→slot | slot | clear above / below |
|---|---|---|---|---|---|---|
| `article-mid-1` (after §Architecture) | `.project-guide` (flex→grid) | **342 / 664 / 840** | `block`, centred | **12 px** | 280 px | 80 / 48 |
| `article-mid-2` (after §Tips) | `.project-guide` | **342 / 664 / 840** | `block`, centred | 12 px | 280 px | 80 / 48 |
| `article-end` (after the last §) | `.project-guide` | **342 / 664 / 840** | `block`, centred | 12 px | 280 px | 80 / 72 |
| `listing-mid` after `.interview-grid` | `.container` (block) | **342 / 960 / 970** | `block`, centred | 12 px | 280 px | 48 / 48 |
| `listing-mid` projects | `.container` | **342 / 960 / 970** | `block`, centred | 12 px | 280 px | 48 / 36 |
| `home-mid` inside a `.container` | `.container` | **342 / 960 / 970** | `block`, centred | 12 px | 280 px | 48 / — |
| `home-mid` as a child of `<main>` (the wrong way) | `main` (block) | **390 / 970 / 970** | centred but **full-bleed** | 12 px | 280 px | 48 / 48 |

`grid-column` computes to `1` for every well inside `.project-guide`; `aboveFold=false` at every
position and width; reserved height **339 px** total for `--ad-h: 280px`; page overflow 0 everywhere.

| Wave 1 r2 issue | Status | Evidence |
|---|---|---|
| 1. well renders 122.6 px inside `.project-guide` at every width | **FIXED** | 342 / 664 / 840 measured on 11/11 pages. `ms4-project-article-mid-1@390.png`, `@1440.png` |
| 2. `.ad-well-label` inline → dead `text-align`/`margin` | **FIXED** | computed `display: block`, `labelCentredInWell: true`, gap to slot **12 px** (was 4). Visible in every shot. |
| 3. desktop article inventory capped at 623 px | **FIXED** (by article-template's 1fr column) | **840 px** at 1280 and 1440, right edge 992, 48 px clear of the rail at 1040. 728×90 now fits; 970×250 still does not. |
| 4. 970 px well centred (235→1205) against a page that runs 152→1288 | **NOT FIXED, unchanged** | `ms4-home-home-mid@1440.png`, `ms4-interview-listing-mid@1440.png` |
| 5. the gate cannot see an `.ad-well` | **FIXED, with two proven holes** | see the tamper runs below |
| 6. `WEIGHT: FAIL` | unchanged, sign-off item, not scored | §Gates |
| 7. project pages: visible breadcrumb, no BreadcrumbList | unchanged, human `ld` approval | ld=[] on all 11 |
| 8. SEO 92 on index/tools | unchanged, content-blocked (A5) | Lighthouse table |

### The gate DOES bite for wells — proven by a real gated tamper, with no site file edited

The brief assumed this could only be verified by reading `integrity.js`. It can be done properly:
`integrity.js` takes `--base_url`, so I served the **frozen tree byte-for-byte** from a throwaway
server (`harness/out/ms4-tamper-serve.js`, git-ignored) that injects one well variant into
`project-multi-account-landing-zone.html` **in the response only**. No file on disk changed
(`git status` clean before and after). The injected `<ins>` is inert — the loader is fulfilled
empty by the route blocker, so nothing was fetched and no ad was rendered.

**Case A — a bare well (no `<ins>`), no `data-position`, forced above the fold:**

```
AD/TRACKING PROBLEM {... "field":"ads390",  "rule":"NO_AD_ABOVE_FOLD",         "ad":{"kind":"well","position":"","top":168,"height":339,"aboveFold":true}}
AD/TRACKING PROBLEM {... "field":"ads390",  "rule":"AD_WELL_WITHOUT_POSITION", "ad":{...}}
AD/TRACKING PROBLEM {... "field":"ads1440", "rule":"NO_AD_ABOVE_FOLD",         "ad":{...}}
AD/TRACKING PROBLEM {... "field":"ads1440", "rule":"AD_WELL_WITHOUT_POSITION", "ad":{...}}
INTEGRITY: FAIL (0 content, 4 ad/tracking, 0 rejected approvals)
```

Both new rules fire, at both widths, and **0 content diffs** — confirming a well is correctly
invisible to the text/heading snapshot. My r2 issue #5 is genuinely closed for the Auto-ads-only
shape. **Case OFF** (pass-through control) reproduces `INTEGRITY: PASS`.

**Case B — the AD_PLAN wrapper contract (well + label + `<ins>`), `data-position` missing:**

```
AD/TRACKING PROBLEM {... "rule":"NO_AD_ABOVE_FOLD",       "ad":{"kind":"unit","slot":"","top":214,...}}
AD/TRACKING PROBLEM {... "rule":"AD_UNIT_WITHOUT_SLOT_ID","ad":{"kind":"unit",...}}
AD/TRACKING PROBLEM {... "rule":"AD_COUNT_CHANGED_WITHOUT_APPROVAL","baseline":0,"current":1}
INTEGRITY: FAIL (0 content, 5 ad/tracking, 0 rejected approvals)
```

Note what is **absent**: `AD_WELL_WITHOUT_POSITION`. `integrity.js:50` drops the *well* record
whenever the well contains its own `<ins>` (`if (isWell && ins && ins.closest('.ad-well') === el)
return null`), so the position requirement applies **only** to wells that have no unit — i.e. never
to the contract markup `harness/apply-ads.js` actually emits.

**Case C — contract well with `data-position` and a valid slot id, positioned so the well's top is
above the fold and the `<ins>`'s top is not:**

```
measured:  390  vh 844  wellTop 802  label 815→836  insTop 848   wellAboveFold=true  insAboveFold=false
          1440  vh 900  wellTop 858  label 871→892  insTop 904   wellAboveFold=true  insAboveFold=false
gate:      AD/TRACKING PROBLEM {... "rule":"AD_COUNT_CHANGED_WITHOUT_APPROVAL","baseline":0,"current":1}
           INTEGRITY: FAIL (0 content, 1 ad/tracking, 0 rejected approvals)
```

**No `NO_AD_ABOVE_FOLD`.** The "ADVERTISEMENT" label and the well's top hairline are fully above the
fold at *both* widths and the fold rule does not see it, because for a contract-shaped well the rule
is evaluated on the `<ins>`'s top, ~46 px lower. The only thing raised is `adCount`, which a
legitimate Wave 3 `adCount` approval clears. The miss is **bounded** (a grossly above-fold well
still fires, since the `<ins>` goes above the fold too) but it is real: 46 px of ad chrome can sit
above the fold with a green gate.

### Ranked Wave 1 issues that remain (worst first)

1. **The well-fold rule measures the `<ins>`, not the well, and the position rule never applies to
   the markup the repo actually emits.** **COMPONENT (`harness/integrity.js:50`), process.**
   Proven by tamper cases B and C above (no screenshot needed — the gate output *is* the evidence).
   **Fixed looks like:** do not `return null` for a well that contains an `<ins>`; emit **both**
   records (well + unit) and keep `AD_COUNT_CHANGED_WITHOUT_APPROVAL` filtering on
   `kind !== 'well'` as it already does. Then the fold rule uses the well's own top and
   `AD_WELL_WITHOUT_POSITION` applies to every well. ~1 line. Harness owner, before Wave 3.
2. **A 970 px well is still centred in the 1200 px container at 1440 and breaks the single left
   edge this wave built.** **COMPONENT**, cosmetic + adjacency. index, projects, resources,
   interview-prep @1440 — `ms4-home-home-mid@1440.png`, `ms4-interview-listing-mid@1440.png`.
   The well runs **235 → 1205**; every other block on those pages runs **152 → 1288**. Its two
   hairlines make the inset explicit and it is the only element on the page that starts elsewhere.
   Unchanged since my last round. **Fixed looks like:** left-align the desktop well
   (`margin-inline: 0 auto` at ≥ 64em) so its left hairline lands on 152 and 970 stays available for
   a billboard; or drop the cap to container width. Either, but decide.
3. **A well outside a `.container` still goes full-bleed at 390** (`ms4-homeBare-home-mid@390.png`,
   0 → 390 px). Better than last round — the label is centred now instead of clipped at x=0 — but
   the component still does not defend itself and relies entirely on AD_PLAN's placement note.
   **Fixed looks like:** a `padding-inline` fallback, or accept the plan as the contract and say so.
4. `WEIGHT: FAIL` — recorded, not scored (D1). The 11 project pages that carry three of the five
   positions are the most over, at **+4,245 … +4,428 gzip**.

**Why 8.7 and not higher:** the two one-line defects that failed this area last round are fixed and
I can see them fixed at three widths; the 623 px desktop cap is gone; and the gate now provably
fails a badly placed well. What holds it back is that the rule added to close my #5 has two holes I
could demonstrate on a real gate run, and the 970-centred misalignment is untouched.

---

```
Area: article-template   Round: 2   Critic: monetization & SEO   Score: 8.6/10   Verdict: PASS
```

Screenshots looked at:
- `harness/out/peek/ms4-project-article-mid-1@1440.png` — the `article-mid-1` well at 1440:
  **840 px wide, flush on the x=152 left edge**, hairlines spanning the full article column,
  "ADVERTISEMENT" centred over a 280 px reservation, ending at 992 with 48 px of clear paper to the
  rail at 1040. The rail marks the current section with the accent bar. This is the shot that closes
  both of my r1 article findings.
- `harness/out/peek/ms4-project-article-mid-1@390.png` — same position at 390: 342 px, on the 24 px
  gutter, label centred, nothing tappable in frame.
- `harness/out/peek/ms4-project-article-end@390.png` — the end-of-article well above the **new**
  pagination: no cards, no boxes, two ruled rows with `PREVIOUS` / `ALL PROJECTS` eyebrows and plain
  ink links. Nothing orange, nothing filled, 97 px of separation.
- `harness/out/peek/ms4-chips@390.png` — the chip row with a visible `ON THIS PAGE` eyebrow and
  "Architecture" cut mid-word under the fade. My r1 nit #7 (an unlabelled pill row is the shape
  AdSense's related-search unit uses) is gone: it is captioned now.

Gate results: `console=0` (60 public runs) · `axeSC=0` · `axeAll=0` · `hOverflow=0/60` ·
`perf=100` · `a11y=100` · `bp=100` · `seo=100` · `cls=0.0013` (project pages @1440 only) ·
`lcp=1.65 s` · `integrity=PASS` · `weight=FAIL (recorded, not scored)`.

**Clear space at AD_PLAN's three stated positions** — well injected after `.guide-section`
#2 (Architecture), #4 (Tips) and #6 (the last), measured at 390 and 1440:

| position | width 390 / 1440 | clear above | clear below | nearest tappable above | nearest tappable below |
|---|---|---|---|---|---|
| `article-mid-1` | 342 / 840 | **80 px** | **48 px** | 1429 / 821 px | **127 / 128 px** (the step-1 number anchor) |
| `article-mid-2` | 342 / 840 | **80 px** | **48 px** | 866 / 643 px | **191 / 192 px** (Copy) |
| `article-end` | 342 / 840 | **80 px** | **72 px** | 1511 / 1400 px (Copy) | **97 px** (quiet `guide-nav-link`) |

So: ≥ 48 px of clear space at all three positions at both widths, nothing tappable within 48 px of
any of them, and `aboveFold=false` everywhere. Pagination is quiet (no border, no fill, no radius —
ruled rows). Rail: `data-ui`, 7 fragment-only links, 0 JSON-LD, step ids unique, no JSON-LD added
anywhere on the 11 pages.

**Sticky rail vs a side rail** — `aside.guide-aside` is `sticky; top: 88px`, 248 px wide:
clearance from its right edge to the viewport edge is **32 px @1024 · 72 px @1280 · 152 px @1440**
(left gutter mirrors it). A Google side rail wants ~160 px per side. **Side rails must stay OFF** —
this is a hard constraint, not a preference, and it is unchanged from Wave 1.

Ranked issues (worst first):

1. **AD_PLAN's own section arithmetic — and `harness/apply-ads.js`, which implements it — do not
   produce AD_PLAN's stated positions, and `article-end` has no anchor at all.** **PLAN + COMPONENT
   (`harness/apply-ads.js`), Wave 3 blocker.** All 11 project pages.
   The DOM is `.guide-overview` (h2 "Project Overview") followed by **6** `.guide-section`s:
   `prerequisites, architecture, step-by-step-instructions, tips, code-examples, what-youll-learn`
   (`grep -c 'class="guide-section"'` = 6 on 11/11 pages). So "after Architecture" is
   `.guide-section` **#2**, "after Tips" is **#4**, and there is **no "Next Steps" section** — the
   last is "What You'll Learn" (#6). AD_PLAN's corrections block says "1st/3rd/5th"; the round
   brief says "3rd/5th/7th"; `apply-ads.js` hard-codes `after: 3 / 5 / 7`. Those land mid-1 *after
   Step-by-Step* and mid-2 *after Code Examples*, and **#7 does not exist**, so `article-end` would
   silently never place on any page.
   Worse, the anchor matcher cannot count sections at all: `/<div class="guide-section"[\s\S]*?\n
   {6}<\/div>\n/g` requires a `</div>` indented **6** spaces, but `.guide-section` closes at **10**.
   Run against the real files it returns **exactly 1 match per page**, each 10.6–18.1 KB long
   (it swallows the whole guide to the `.container` close). `insertAfterNthSection(html, 3|5|7)`
   therefore returns `null` every time: **all 33 planned article placements would be skipped**,
   reported only as a `skipped` line, never as a failure. Today this is masked — `--check` prints
   `would place 0 units; skipped 33 (no slot id in docs/AD_UNITS.json)` — so the anchor bug only
   surfaces the moment `docs/AD_UNITS.json` is filled.
   **Fixed looks like:** anchor on the parsed DOM, not a hand-rolled regex (`.project-guide >
   .guide-section` index), and write the real numbers into AD_PLAN: `article-mid-1` after
   `.guide-section` **#2**, `article-mid-2` after **#4**, `article-end` after **#6** (before
   `.guide-navigation`) — all three measured above and all three clean. Also drop the "after
   Next Steps" wording: no project page has that section.
2. **Two Auto-ads-attractive seams sit above the fold on desktop, and one of them is new this
   round.** **COMPONENT (`[article-template]`), needs an excluded-areas entry, not markup.**
   11 project pages, measured on `project-multi-account-landing-zone`:

   | injection point | 390 (vh 844) | 1024/1440 (vh 900) | above fold? |
   |---|---|---|---|
   | after `aside.guide-aside` (the rail / chip row) — **new** | 564 | **445** | **yes at every width** |
   | after `dl.guide-meta` | 917 | **745** | mobile no (was 867 in r1), desktop **yes** |
   | after `.guide-overview` | 941 | **769** | desktop **yes** |
   | after the 1st `.guide-section` | 1253 | 1025 | no |

   Moving the rail to first in DOM (request item 3, correct for focus order) created a brand-new
   "end of a block, before the article" seam **445 px down a 900 px desktop viewport** — the most
   attractive shape Auto ads looks for, and squarely above the fold. The old `guide-meta` seam
   improved at 390 (917 vs 844) but is unchanged on desktop.
   **Fixed looks like:** HUMAN_TODO B1 records `.guide-aside` **and** `.guide-overview` on the
   AdSense excluded-areas list, and `article-mid-1` ships explicitly so Auto ads has no reason to
   hunt that high. Nothing to change in markup.
3. **`#architecture` is still absent on `project-infrastructure-as-code.html`** (`grep -c` = 0; its
   `.guide-section` #2 h2 is "Choose Your Tool" → `#choose-your-tool`). **PAGE, note only** — with
   issue 1's section-index anchoring this stops mattering, and I verified the well renders
   identically there (342 / 664 / 840, `ms4-iac-article-mid-1@*.png` in the same probe run).
4. **New non-zero CLS, well inside budget.** `cls = 0.0012–0.0014` on all 11 project pages **at 1440
   only** (0 at 390/768) — the rail's `aria-current` weight change one frame after load. Budget is
   0.05, so this is a nit, but it is the first non-zero CLS the project pages have had and it is
   worth knowing before Auto ads adds its own shifts on top.
5. **Desktop inventory is 840 px, so 970×250 is still out of reach** on the 11 highest-intent pages
   (728×90 now fits, which it did not last round). Not a defect — a fact for the AdSense unit
   sizing decision in B4. `.ad-well`'s `max-width: min(100%, 970px)` can never bind inside
   `.project-guide`; it is only reachable in a `.container`.

Nits:
- Reserved height end-to-end is **339 px** for `--ad-h: 280px` (12 pad + 21 label + 12 gap + 280
  slot + 12 pad + 2 rules). Wave 3's CLS budget should use 339, not 280.
- The nearest tappable thing below `article-mid-1` is now the **step-1 number anchor** (a 44 px
  circular link) at 127 px. New this round, comfortably clear, recorded so a future spacing change
  is checked against it.
- Nothing is `position: fixed` and nothing is sticky-to-bottom on any project page at any width —
  a bottom anchor ad still has clear air. The only sticky elements are `header.site-header` (z 100),
  `aside.guide-aside` (≥64em) and the five `.code-header`s (z 1).

---

```
Area: code-and-diagrams   Round: 2   Critic: monetization & SEO   Score: 8.9/10   Verdict: PASS
```

Screenshots looked at:
- `harness/out/peek/ms4-code-sticky@390.png` — 550 px into the 1,581 px `LAMBDA_FUNCTION.PY` block
  on project-serverless-rest-api at 390: the sticky code header pinned under the site header,
  filename leading in mono ink, a quiet outlined `PYTHON` chip, `Copy` last and loudest, and
  coloured Python tokens below. The header is visibly part of the navy panel that continues past the
  bottom of the screen — it does not read as a detached creative.
- `harness/out/peek/ms4-project-article-mid-1@1440.png` / `@390.png` — a well sitting in the same
  column as the diagrams and code; nothing in the area competes with it visually.

Gate results: `console=0` · `axeSC=0` · `axeAll=0` · `hOverflow=0` · `perf=100` · `a11y=100` ·
`bp=100` · `seo=100` · `cls=0.0013 @1440` · `lcp=1.65 s` · `integrity=PASS` · `weight=FAIL (recorded)`.

**The highlighter is gate-clean, verified two ways** (§Shared evidence): 43 `<pre>` blocks
byte-identical to `f1ec399` after stripping spans, and `INTEGRITY: PASS` (the `pre` field is exact
`textContent`). **1,132 spans, 0 `<a>` inside any `.code-block`, 1 `<button>` (Copy) per block.**
No text was added, so no keyword, no anchor and no heading moved: this area cannot have touched SEO,
and the gate agrees.

**Policy sweep, standard creative footprints (±12 px) across every element in `<main>`**, 2 project
pages × 390/1024/1280/1440:

- **1024 / 1280 / 1440: zero matches on both pages** (r1 found the same).
- 390: the only matches are transparent `li` 322×56 and `div.arch-component` 316×52 (≈320×50) inside
  the framed navy diagram, plus `.guide-section` / `.guide-list` / `.guide-step` boxes whose
  *height* lands near 280 with `background: rgba(0,0,0,0)` and no border. None is confusable.
- **The sticky code header is not an ad shape**: 340×61 at 390, 662×50 at 1024, **838×50** at
  1280/1440 — no standard size matches at any width. It carries a filename, a language chip and
  Copy on the same navy ground as the code, and `overflow: clip` on `.code-block` confines the
  sticky to its own panel, so it can never float free over a neighbouring ad.

Ranked issues (worst first):

1. **The pre-code seam is now 41 px from the 44 px Copy target — improved from 33, still under the
   48 px comfort line.** **COMPONENT (`.code-block`), Auto-ads-only exposure.** All 11 project
   pages, both widths — `ms4-code-sticky@390.png`. `.code-block { margin-block: 32px }` (was 24)
   and `.code-copy` sits 9 px below the block's top edge, 54×44 at 390 / 54×33 at 1440, so an ad
   taking that seam ends **41 px** above the tap target. The three *planned* wells are never this
   close — the nearest measured is 191 px (`article-mid-2` → first Copy).
   **Fixed looks like:** `.code-examples` / `.code-block` on the AdSense excluded-areas list in
   HUMAN_TODO B1 (0 bytes), or one more step of block margin. The builder already took this from
   33 → 41; the remaining 7 px is not worth CSS.
2. **`Code Examples` is a long run of 32 px seams.** **COMPONENT, informational.** The last
   ~4,700 px of the longest pages is five code blocks of 701–1,049 px separated by 32 px and an
   `h3`. Auto ads has few comfortable seams in the second half of the highest-intent pages, which
   pushes fill toward the `article-mid-2` / `article-end` wells. That is the right outcome; record
   it before reading the first AdSense report so the distribution is not a surprise.
3. **Five sticky elements per page is a new z-order surface.** **COMPONENT, informational.**
   `.code-header` is `position: sticky; top: var(--header-h); z-index: 1`. Nothing Google injects
   sits below z 100, so there is no conflict today; but if the sticky top offset is ever changed to
   account for an anchor unit, it must be changed in two places (header and code header).

Nits:
- `.code-inline` (styled, used 0 times) is gone — my r1 issue #3 is closed; dead surface removed
  while the wave is over its byte budget.
- Diagram `scrollWidth − clientWidth = 0` at 320/390/768/1440 on all 11 pages, so no diagram can
  trap a horizontal swipe next to an ad.
- `text-transform: uppercase` on `.code-label` / `.arch-group-label` remains *visible* uppercase
  text, not a hidden-text trick; nothing in the area hides text, off-screens it or sets `font-size: 0`.

---

```
Area: listing-pages   Round: 2   Critic: monetization & SEO   Score: 8.6/10   Verdict: PASS
```

Screenshots looked at:
- `harness/out/peek/ms4-interview-listing-mid@1440.png` — **`listing-mid` after `.interview-grid`,
  the AD_PLAN correction, working**: a 970 px labelled well with 48 px of clear paper above and
  below, between two ruled question columns. Also shows issue 2 below: the well runs 235→1205 while
  the question columns run 151→1288.
- `harness/out/peek/ms4-home-home-mid@1440.png` — `home-mid` inside a section `.container`: 970 px,
  280 px reservation, 48 px above. Four orange underlined "Learn More" links sit 63 px above it.
- `harness/out/peek/ms4-homeBare-home-mid@390.png` — the same well as a direct child of `<main>`:
  full-bleed 0→390, hairlines running off both screen edges. The label is centred now rather than
  clipped, but the AD_PLAN `.container` correction is still load-bearing.
- `harness/out/peek/ms4-tools@390.png` — tools.html: the salary form, one orange "Calculate Salary",
  nothing ad-shaped. Correctly on the no-ads list.

Gate results: `console=0` · `axeSC=0` · `axeAll=0` · `hOverflow=0` · `perf` index 100 / projects 100
/ interview-prep 100 / resources **99** · `a11y=100` · `bp=100` · `seo` projects/interview-prep/
resources 100, **index 92**, **tools 92** (`link-text`, frozen copy) · **`cls = 0` on every listing
page at every width** (was 0.0008–0.0011 on resources) · `lcp` resources **2.18 s** (budget 1.8;
recorded exception D2) · `integrity=PASS` · `weight=FAIL (recorded)`.

**Ad room, measured (390 / 1024 / 1440):**

| position | parent | width | clear above / below | nearest tappable above / below |
|---|---|---|---|---|
| `listing-mid` after `.interview-grid` | `.container` | **342 / 960 / 970** | 48 / 48 | 65 / 100 px (`button.question-toggle`) |
| `listing-mid` after the *last* `.interview-grid` | `.container` | 342 / 960 / 970 | 48 / — | 65 / 287 px |
| `listing-mid` projects, between level groups | `.container` | 342 / 960 / 970 | 48 / 36 | 181 / 597 px |
| `home-mid` inside a `.container` | `.container` | **342 / 960 / 970** | 48 / — | 63 / 348 px |
| `home-mid` as a child of `<main>` | `main` | **390** / 970 / 970 | 48 / 48 | 111 / 300 px |

Both r1 blockers are resolved as placement facts: interview-prep's `listing-mid` is 342/970 (was
123 px) when anchored **after** the grid, and `home-mid` is 342 px on a phone when it sits **inside**
a `.container`. `aboveFold=false` at every position and width.

**Interview disclosure rows — now 17 real `<button type="button">`**: all 17 labelled
(`aria-labelledby` → the question `<strong>`), `aria-expanded=false` at load, **17/17 answers
`display: none` at load with 439–695 chars of text present in the DOM** at both widths, exactly as
at baseline. SEO unaffected; the FAQPage JSON-LD is untouched; the question text stays outside the
button so the content gate never sees it. My r1 issue #6 is properly closed.

**projects.html level-jump nav**: `<nav class="level-jump" data-ui>`, three fragment-only links
(`#beginner #intermediate #advanced`), 83.5/109/88.7 × **44 px**. `data-ui` + `nav` keeps the three
words out of the content snapshot (they appear in the integrity run's `uiText` as
`"Beginner Intermediate Advanced"`, as intended). **Internal link set unchanged** (gate).

**resources.html book covers**: 120×160 mounts, **ratio exactly 0.750**, `--paper-2` ground,
1 px hairline; images render 118×158 with `object-fit: contain`; explicit `width`/`height`
attributes retained and **matching `naturalWidth × naturalHeight` exactly on 8/8** (286×360, 292×360,
274×360, 240×360, 287×360, 274×360, 271×360, 240×360). First cover eager + `fetchpriority="high"`,
the other seven `lazy`. **Lab CLS is now 0 at 390/768/1440** (was 0.0008). The one image-shaped CLS
risk on the site is gone.

Ranked issues (worst first):

1. **resources.html LCP 2.18 s against a 1.8 s budget.** **PAGE, recorded exception (HUMAN_TODO
   D2), not a builder defect.** `merged-r2/lighthouse/summary.json`. The `<h1>` is the LCP element;
   the documented experiments show it is the eight cover *requests* the preload scanner starts, not
   bytes (covers removed → 1.8 s; re-encoded to 101 KB → 2.1 s). It is the one budget the wave does
   not meet, on the page that carries all 13 affiliate links — i.e. the page where slow first paint
   costs the most real money. **Fixed looks like:** the human answers D2 — accept the lab number, or
   approve an `images` change so the covers are inserted after first paint.
2. **17 invisible full-row `<button>`s tile the question list with 1 px seams, so any Auto ad
   injected *inside* `.interview-grid` would land between two full-width invisible tap targets.**
   **COMPONENT, needs an excluded-areas entry.** interview-prep.html, both widths. Measured:
   `position: absolute; inset: 0`, `background: rgba(0,0,0,0)`, 342×158 at 390 / 544×127 at 1440,
   and the **gaps between consecutive buttons within a category are 1 px** (94–118 px only at
   category boundaries). The planned `listing-mid` is safely *after* the grid (65 / 100 px clear),
   so this is an Auto-ads-only exposure — but "large invisible clickable region immediately
   adjacent to an ad" is precisely the pattern AdSense's accidental-click policy is aimed at.
   **Fixed looks like:** `.interview-grid` on the excluded-areas list in HUMAN_TODO B1. No markup
   change; the buttons themselves are correct and are an accessibility improvement.
3. **`home-mid` / `listing-mid` are centred at 235→1205 on a 1440 page whose every other block runs
   152→1288.** **COMPONENT** — see Wave 1 issue 2; same defect, listed here because four of the five
   AD_PLAN positions that can reach 970 px are on these pages.
   `ms4-home-home-mid@1440.png`, `ms4-interview-listing-mid@1440.png`.
4. **resources.html still carries 13 affiliate links with no on-page disclosure and no
   `rel="sponsored"`.** **PAGE, human-blocked — recorded in HUMAN_TODO A6 items 1–2, NOT re-scored
   here.** Re-verified unchanged: 8 Amazon `?tag=dreamscribe09-20` links + 5 Pluralsight links, all
   `rel="noopener"` only; the words "affiliate"/"commission"/"disclosure" appear **0 times** in
   `<main>` (about.html has 4/1/1, privacy.html 2/1/1). Both remain launch-blockers for a monetised
   page in my view, but they are the owner's call and they are correctly on the list.
5. **`home-mid` full-bleed at 390 if placed as a child of `<main>`.** **COMPONENT**, mitigated by
   the AD_PLAN correction — `ms4-homeBare-home-mid@390.png`. Improved (label centred, not clipped),
   still undefended by the component.
6. **index.html and tools.html SEO 92.** **PAGE (content), blocked.** `link-text` on the five frozen
   "Learn More" links is the only failing SEO audit on either page. Unchanged, HUMAN_TODO A5.

Nits:
- `images/books/sap-c02.jpg` is still a photo of *The Kubernetes Book* under an SAP-C02 alt
  (HUMAN_TODO A6 item 3). Recorded, not re-scored.
- `decoding` is still absent on all eight covers; `decoding="async"` is a free hint.
- tools.html is correctly excluded: the whole page is form controls, and the one filled button
  ("Calculate Salary") is the page's only CTA.
- Interview category rhythm is fixed: the 4th→5th seam is 48 px (was 0), so Auto ads has a real
  seam between categories rather than none.

---

```
Area: static-pages   Round: 2   Critic: monetization & SEO   Score: 8.8/10   Verdict: PASS
```

Screenshots looked at:
- `harness/out/peek/ms4-404@390.png` — the rebuilt 404: paper strip with the orange cloud mark,
  large quiet numeral, two-line h1, the joke as a quiet note, one orange "Return to Home Region".
  No AdSense loader, no GA, nothing ad-shaped, nothing that could be mistaken for a creative.
- `harness/out/peek/ms4-contact@390.png` — the contact card: four labelled fields, one orange
  "Send Message", and **no mystery gap above the button at rest** (the status slot is
  `display: none` until a state lands). Nothing ad-adjacent by construction.

Gate results: `console=0` · `axeSC=0` · `axeAll=0` · `hOverflow=0` · `perf=100` · `a11y=100` ·
`bp=100` · `seo=100` (about, contact) · **`cls=0` on all four pages at all three widths** ·
`lcp=1.50 s` (about) · `integrity=PASS` · `weight=FAIL (recorded; 404.html +248 gzip, −21 raw)`.

**No ad surface here and none introduced:** `ins.adsbygoogle` = 0 and `.ad-well` = 0 on all four
pages; 404.html carries neither the AdSense loader nor GA, exactly as at baseline, and is the only
page on the site with `meta[robots] = noindex`.

**Contact status semantics — correct, with one caveat:**

```
#formStatus:  before the submit button in DOM = true   role="status"   aria-live=(absent, implicit polite)
              display: none at rest   min-height: 76px   CLS 0 at 390/768/1440
```

The element, its `id`, its `class` and `role="status"` are unchanged; only its DOM position moved,
which is invisible to the gate (the div is empty; its text is script-generated). I re-derived the
inline form script independently: **whitespace-only differences from `git show f1ec399:contact.html`
— normalised byte-identical**, so `/api/contact`, the field names and the disabled-button behaviour
are untouched. `min-height` makes success and error occupy the same box, so the submit button
cannot move between states.

**Gate text — the thing most worth protecting here — is intact.** `INTEGRITY: PASS` covers the
`text` field for all four pages, and independently: privacy.html still runs
`Introduction → Information We Collect → How We Use Your Information → Third-Party Services →
Cookies → Data Retention → Your Rights → Children's Privacy → Changes to This Policy → Contact Us →
Affiliate Disclosure`, with 3 "AdSense" mentions and the full affiliate disclosure in place;
about.html carries 4 "affiliate" / 1 "commission" / 1 "disclosure". Nothing an AdSense policy review
needs was styled away by the marker change.

Ranked issues (worst first):

1. **404.html is still never served in production, so this area's best work is invisible and the
   site still emits soft-404s at scale.** **PAGE/config, pre-existing, recorded as HUMAN_TODO A2 —
   not caused by this area and not re-scored.** Re-verified byte-identical to `f1ec399`:
   `responseOverrides["404"] = { "rewrite": "/index.html", "statusCode": 200 }` and
   `navigationFallback.rewrite = "/index.html"`. Every unknown URL returns HTTP 200 with a full copy
   of the home page **carrying the AdSense loader**. The page in `ms4-404@390.png` is unreachable.
   Still the single highest-value SEO fix available in the whole project, and it costs two JSON
   values in a file that is not gated.
2. **`role="status"` on an element that is `display: none` until the moment its text is set.**
   **COMPONENT (`.form-status`), a11y-adjacent nit.** A live region that is not in the accessibility
   tree when its content changes is announced unreliably by several screen readers; revealing and
   populating it in the same frame is exactly that case. The builder documents the trade in §4.2 and
   the brief told them to keep `display: none`, so this is a recorded decision, not a slip.
   **Fixed looks like:** the builder's own option 1 — keep the empty div in flow with
   `min-height` and no border/background — which also removes the last 92 px of movement when a
   status appears. Costs ~76 px of blank paper at rest; CLS stays 0 either way.
3. **404.html duplicates ten design tokens inline.** **COMPONENT, informational**, now carrying a
   one-line comment naming the source of truth, as I asked last round. The values will drift the
   first time `[design-system]` moves.

Nits:
- 404.html is still the only public page without a skip link (`a[href="#main"]` absent). It is
  `noindex` and — today — unserved.
- contact.html should stay on the no-ads list permanently: the whole page is a form, which is the
  same reason AD_PLAN excludes tools.html.
- about.html and privacy.html are over baseline **entirely** on the shared `styles.css`; 404.html is
  the one page whose bytes are wholly its own and it is **under** its raw baseline (2,899 vs 2,920).

---

## Summary

| Area | Score | Verdict | The one thing that decides it |
|---|---|---|---|
| Wave 1 ad-well (re-verified) | **8.7** | **PASS** | width, label and the 623 px cap all fixed and seen at three widths; the new gate rule bites, but I proved two holes in it |
| article-template | **8.6** | **PASS** | all three positions render 342/840 with ≥48 px clear and nothing tappable inside 48 px; the plan/script that will place them cannot find its anchors |
| code-and-diagrams | **8.9** | **PASS** | 1,132 spans, 0 links, 43 `<pre>` byte-identical to `f1ec399`; the Copy seam went 33 → 41 px |
| listing-pages | **8.6** | **PASS** | both r1 collapses resolved, covers CLS 0, 17 real buttons; resources LCP 2.18 s is the wave's one missed budget |
| static-pages | **8.8** | **PASS** | nothing regressed, gate text intact, status placement CLS-neutral; its 404 page is still unserved for reasons outside the area |

**Do these before Wave 3 writes a single `<ins>` (all cheap, all mine to flag and none mine to fix):**

1. `harness/integrity.js:50` — emit both the well and the unit record instead of dropping the well.
   One line; without it the fold rule measures the wrong box and `AD_WELL_WITHOUT_POSITION` never
   applies to the markup `apply-ads.js` emits. Proven with a real gate run (cases B and C).
2. `harness/apply-ads.js` — replace the `.guide-section` regex with a DOM index, and fix the
   ordinals to **#2 / #4 / #6**. As committed it would place **0 of 33** article units and say so
   only in a `skipped` line.
3. `docs/AD_PLAN.md` — the corrections block still says the `.ad-well` width fix was "NOT fixed in
   Wave 1 r2 … owned by Wave 3". **It is fixed** (landed in `93426da`, measured 342/664/840/970).
   Correct that line, fix the section ordinals, and delete "after Next Steps" (no page has one).
4. HUMAN_TODO B1 — record **bottom anchor ON** (0 fixed / sticky-bottom elements measured on every
   page at every width), **top anchor OFF** (it would stack on the 56/64 px sticky header),
   **side rails OFF** (32 / 72 / 152 px of clearance to the sticky TOC at 1024 / 1280 / 1440), and
   an excluded-areas list of **`.guide-aside`, `.guide-overview`, `.code-block` / `.code-examples`,
   `.interview-grid`**.
5. Unchanged and still the human's: the soft-404 config (A2), the resources.html affiliate
   disclosure and `rel="sponsored"` (A6 1–2), the wrong `sap-c02.jpg` (A6 3), the "Learn More" copy
   (A5), the gzip overage (D1) and the resources LCP exception (D2).

**On the record for the wave:** every frozen artefact is provably frozen by two independent methods
— ads.txt, robots.txt, sitemap.xml and the entire CSP byte-identical to `f1ec399`; the AdSense
loader and GA line string-identical on all 21 pages; zero manual `<ins>`; no CMP; 43 `<pre>` blocks
byte-identical after a build-time tokenizer rewrote 1,132 spans inside them. Every SEO field on all
20 public pages matches baseline, one `h1` per page, zero heading skips, zero duplicate ids,
`noindex` on 404.html alone, JSON-LD parsing and unchanged everywhere, and the internal link set
untouched despite three new fragment-link families (rail, step anchors, level jump) — all correctly
`data-ui` or fragment-only. CLS is 0 sitewide except 0.0013 on the project pages at 1440. And the
component this whole monetization footing rests on finally renders the way its own CSS intends,
at 342 px on a phone and 840–970 px on a desktop, with a label that says "advertisement" where a
reader will see it.

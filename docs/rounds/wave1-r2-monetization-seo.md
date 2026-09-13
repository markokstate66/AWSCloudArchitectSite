Area: design-system + layout-shell (Wave 1)   Round: 2   Critic: monetization & SEO   Score: 8.3/10   Verdict: FAIL

Scope note: shell + design-system only. No live ad was ever loaded; every capture went through the
harness route blocker (`harness/pages.js` `BLOCKED_HOST_RE`, fulfilled 204/empty-JS) and every well in
these screenshots is the harness placeholder, injected into the live DOM at runtime by my own probe.
I wrote no site file. Probes live in `harness/out/ms3-probe.js`, `ms3-probe2.js`, `ms3-probe3.js`,
`ms3-probe4.js`, `ms3-seo.js` (gitignored), raw numbers in `harness/out/ms3-results.json`,
`ms3-results2.json`, `ms3-seo.json`.

Moving-tree note up front: the working tree was clean when I started and had 18 modified files by the
time I finished (Wave 2 round-2 builders). I re-verified afterwards that **`styles.css` lines 1–286
(`[design-system]` + `[layout-shell]`) and the whole `[ad-presentation]` block are byte-identical to
the committed Wave 1 r2 state**, so every measurement below still describes the area I am scoring.
Tracking/integrity were re-run against the moved tree and are still clean.

## Screenshots looked at

- `harness/out/peek/ms3-project-1440.png` — **the worst screen.** A well injected after the 1st
  `.guide-section` of project-multi-account-landing-zone renders as a narrow 177 px strip floating in
  the 623 px article column, its own top/bottom hairlines only as wide as the strip, label hanging off
  its left edge. This is the `article-mid-1` position from AD_PLAN.
- `harness/out/peek/ms3-project-1024.png` — identical defect at 1024; strip at x=255..432 in a
  623 px column, TOC rail intact on the right.
- `harness/out/peek/ms3-project-390.png` — identical defect at 390: a 177 px strip centred in a
  342 px column.
- `harness/out/peek/ms3-project-fixedwidth-1440.png` — **what fixed looks like.** Same injection with
  one extra declaration (`width: 100%`): 623 px well, flush on the x=152 left edge, hairlines spanning
  the article, 280 px reservation visible. One line of CSS separates this from the shot above.
- `harness/out/peek/ms3-home-1440.png` — `home-mid` inside a `.container`: a correct 970 px well with
  a 280 px reservation, 48 px of air above and below. Four orange underlined "Learn More" links sit
  directly above it.
- `harness/out/peek/ms3-home-390.png` — same well at 390: 342 px, aligned to the 24 px gutter, clean.
- `harness/out/peek/ms3-homeBare-390.png` — the same well placed as a direct child of `<main>`
  (i.e. ignoring AD_PLAN's container correction): full-bleed 390 px with the "ADVERTISEMENT" label
  clipped at x=0. Confirms the correction is still load-bearing for Wave 3.
- `harness/out/peek/ms3-interview-1440.png` — `listing-mid` after `.interview-grid`: 970 px, correct,
  but visibly inset (235..1205) against question columns that run 151..1288.
- `harness/out/peek/ms3-label-1440.png` — label geometry: "ADVERTISEMENT" sits hard left inside a
  970 px well, 4 px above the slot, not centred and not 12 px clear.
- `harness/out/peek/ms3-prefooter-390.png` — **round-1 issue #1 is fixed**: "← Previous Project" and
  "Back to All Projects" are both quiet white hairline cards now, no orange fill anywhere above the
  navy footer; 48 px of clear paper to the footer band.

## Gate results

`console=0` (60 public runs; the 3 in `summary.json` are admin.html's known local `/.auth/me` 404) ·
`axeSC=0` · `axeAll=0` · `hOverflow=0/63` · `perf=99–100` · `a11y=100` · `bp=100` ·
`cls=0` on every public page/width except resources.html 0.0019@768 / 0.0008@1440 (book covers) ·
`lcp≤1.65 s` except resources.html 2.10 s · `integrity=PASS` (21 pages identical to
baseline-2026-09-13, 0 approvals) — re-run twice, including against the moved tree ·
`weight=FAIL (19 pages over gzip baseline)`.

Every number in the builder's §5 and §4.3 reproduced on my machine, exactly.

### Tracking plumbing — verified independently of the gate

- Per-page string diff of every line matching `googlesyndication|googletagmanager|gtag(|adsbygoogle|
  dataLayer|fundingchoices` against `git show f1ec399:<page>`: **identical on all 21 pages**
  (0 diffs). Re-run on the moved tree: still 0 diffs.
- `<ins class="adsbygoogle">` count across the whole repo and across all 20 public pages in the live
  DOM: **0**.
- `git diff f1ec399 -- ads.txt robots.txt sitemap.xml` → **empty**.
- `staticwebapp.config.json`: `globalHeaders` (the CSP), `mimeTypes`, `navigationFallback` and
  `responseOverrides` are **all byte-identical to f1ec399**; only the 404-blocking `routes` differ.
- Live DOM: AdSense loader + GA `googletagmanager` on the same 19 pages as baseline, neither on
  404.html; `consentMode` still false (no CMP introduced).

### SEO — verified per page (live DOM at 390, all 20 public pages)

- **Exactly one `<h1>` on every page.** Heading-order disorder (with `aria-level` applied): **0 on
  every page**.
- **`noindex` only on 404.html**; the other 19 are `index, follow`. No leak.
- **Breadcrumbs**: present on all 18 non-home/non-404 pages, every one `<nav class="breadcrumbs"
  data-ui>` with exactly one `aria-current="page"`, and **zero JSON-LD inside any breadcrumb nav** —
  structured data stayed frozen, as required.
- **JSON-LD type sets unchanged**: index WebSite+Organization+BreadcrumbList+FAQPage; projects/
  resources CollectionPage+BreadcrumbList; tools WebApplication+BreadcrumbList; interview-prep
  FAQPage+BreadcrumbList; about AboutPage+BreadcrumbList; privacy WebPage+BreadcrumbList; contact,
  404 and the 11 project pages none. Nothing added, nothing lost, nothing failing to parse.
- Titles / canonicals / descriptions / robots vs the frozen baseline: covered by
  `INTEGRITY: PASS`, which compares exactly those fields.
- **Lighthouse SEO** (`harness/out/wave1-r2/lighthouse/summary.json`): 100 on projects, resources,
  interview-prep, about and project-multi-account-landing-zone; **92 on index.html and tools.html**.
  I walked every audit in `categories.seo.auditRefs` of `index.json` and `tools.json`: the only audit
  scoring below 1 on either page is **`link-text`** ("4 links found" / "1 link found" = the five
  frozen "Learn More" links). Confirmed again: it is the sole cause, and it is content-blocked
  (HUMAN_TODO A5).

### Bytes — the sign-off item, and whether the builder's §4.3 attribution is true

It is true, to the byte, with one mis-stated range. I re-derived the deltas per asset class
(weight.js gzips each asset separately, so attribution is exactly additive):

| page type | measured total | of which styles.css | script.js | that page's own HTML |
|---|---|---|---|---|
| index.html | +1,033 | +1,917 | +310 | **−1,194** |
| listing (projects/tools/interview-prep) | +1,304 … +1,389 | +1,917 | +310 | −838 … −923 |
| resources.html | **−213,138** | +1,917 | +310 | −771, images **−214,594** |
| static (about/contact/privacy) | **+1,471 … +1,867** | +1,917 | +310 | −360 … −756 |
| project guide ×11 | +2,451 … +2,469 | +1,917 | +310 | +224 … +242 |
| 404.html | +299 | n/a | n/a | +299 |

Every figure in the builder's per-page block and every "of which" column matches mine. The **one
error** is the static-page summary row: §4.3 states "+1,161 … +1,557" where the true range is
**+1,471 … +1,867** (contact.html is +1,867, not ≤ +1,557) — their own per-page detail lists +1,867
correctly, so it is a summary slip, not a measurement error. Everything else is exact:
`styles.css` +1,917 gzip, `script.js` +310 gzip, charged to the 19 pages that link them.

Stale-numbers complaint from round 1 is resolved: styles.css mtime 01:39:37, snap 01:46:12,
Lighthouse 01:47:25 — the snap was taken **after** the last edit, and `wc -c` / gzip reproduce
37,867 / 7,995 exactly as reported.

Moving-tree footnote for the byte owner: as of the end of my round the Wave 2 r2 builders have taken
styles.css to **40,183 raw / 8,593 gzip** (+598 over the 7,995 that Wave 1 landed) and the project
pages to +3,259 … +3,355. That is their round, not this one, but the 8,000 gzip target is already
gone and the sign-off should be written against a settled tree.

## Round-1 issues, re-checked one by one

| r1 # | Issue | Status now | Evidence |
|---|---|---|---|
| 1 | Orange `btn-primary` in the end-of-article ad slot | **FIXED** (by article-template, not this builder) | both `.guide-navigation` links are now `.guide-nav-link`: `background rgb(255,255,255)`, `color rgb(26,29,33)`, `1px rgb(230,226,218)` border, 342×59 at 390 / 306×59 at 1440; 48/64 px of paper to the footer. `ms3-prefooter-390.png` |
| 2 | `.ad-well` capped at 623 px on desktop | **HALF FIXED** | `max-width: min(100%, 970px)` landed and really gives 970 px in a `.container` (`ms3-home-1440.png`, `ms3-interview-1440.png`), but it never bites inside `.project-guide`, where the track is `minmax(0, var(--measure))` = 623 px. See issue 3 below. |
| 3 | `:has()` collapse rule would reintroduce CLS | **FIXED, properly** | `grep ':has(' styles.css` → no match. I grepped every `display:none` in the sheet: none can match `.ad-well` or its children. There is no `.js`/`.no-js` rule left at all, so "`.no-js` never collapses" is now structural, not scoped. With `javaScriptEnabled:false` the page still carries `class="no-js"`, and nothing in CSS acts on it. |
| 4 | `.ad-well` family dormant and unproven | **PARTLY CLOSED** | Still 0 `.ad-well` instances on all 20 pages and nothing in the repo emits the markup — but it is no longer unproven: the builder probed it, and I have now rendered it at 3 anchors × 3 widths and found two real defects that only rendering could find (issues 1 and 2 below). Wave 3 still owes a `_showcase/` page. |
| 5 | styles.css over baseline / recorded weights stale | **STALENESS FIXED, OVERAGE NOT** | snap taken after the last edit and all numbers reproduce; `WEIGHT: FAIL (19 pages)` stands, attribution verified above. Integrator has ruled this a sign-off item, so it does not move my score. |
| 6 | Lighthouse SEO 92 on index/tools | **UNCHANGED, content-blocked** | `link-text` is still the only failing SEO audit on either page. |
| 7 | 11 project pages: visible breadcrumb, no BreadcrumbList | **UNCHANGED** | confirmed in the live DOM: `bc=nav/dataUi:true/ldInside:0`, `ld=[]` on all 11. Human `ld` approval, not a builder change. |

## Ranked issues (worst first)

1. **`.ad-well` renders 122.6 px wide inside `.project-guide` — at 390, 1024 *and* 1440.**
   **COMPONENT** (`[ad-presentation]`, styles.css:464). project-*.html (11 pages), all widths —
   `harness/out/peek/ms3-project-390.png`, `ms3-project-1024.png`, `ms3-project-1440.png`.
   Measured, well width, no placeholder painted: **122.6 px at 390, 122.6 at 1024, 122.6 at 1440**
   (176.7 px in the screenshots, because the harness placeholder's own label text widens it). Cause,
   confirmed by A/B in the browser: `.ad-well { margin: var(--sp-7) auto }`. Auto **inline** margins
   defeat stretch alignment in both flex and grid parents, so the well is sized to fit-content and
   centred — at 390 Chrome hands it `margin-left/right: 109.672px` each. `.project-guide` is
   `display:flex` below 64em and `display:grid` above, so the well never fills its track at any width.
   `max-width: min(100%, 970px)` cannot help: the box never reaches its max-width.
   This is the exact defect AD_PLAN §Corrections records as "`.ad-well` needs `width: 100%` inside
   grid/flex parents (rendered 123 px wide in round 1); **fixed in Wave 1 r2**". It is not fixed, and
   the 122.6 px I measure is the same 123 px. The builder's item-11 evidence (`{w: 970}`) came from
   injecting into `<main>` — a plain block parent — which is the one context where the bug cannot
   appear. Three of AD_PLAN's five positions (`article-mid-1`, `article-mid-2`, `article-end`) live
   inside `.project-guide`, i.e. **33 of the ~37 planned placements, on the 11 longest, highest-intent
   pages**. A 123×280 portrait slot serves no standard display size at all; Wave 3 would ship dead
   inventory on the site's best pages.
   **Fixed looks like:** `harness/out/peek/ms3-project-fixedwidth-1440.png` — add `width: 100%` to
   `.ad-well` (one declaration, ~14 raw B). I A/B'd both candidate fixes: `width:100%` and
   `margin-inline: 0` each give 342 / 623.2 / 623.2 px. `width: 100%` is the right one because it
   keeps the `margin: … auto` centring working in plain block parents. Also correct AD_PLAN's
   "fixed in Wave 1 r2" line, which is currently false.

2. **The ad label does not render as designed: `.ad-well-label` is an inline `<span>`, so
   `text-align: center` and `margin: 0 0 var(--sp-3)` are both inert.**
   **COMPONENT** (`[ad-presentation]`, styles.css:465). All widths, every position —
   `harness/out/peek/ms3-label-1440.png`, `ms3-interview-1440.png`, `ms3-home-390.png`.
   Measured at 1440 in a 970 px well: label `display: inline`, box 122.6×17 px sitting at the well's
   left edge (235) not centred in it (`labelCentredInWell: false`), and the gap to the slot is
   **4 px** (the span's line box) instead of the 12 px the declaration asks for. Vertical margins do
   not apply to non-replaced inline boxes and `text-align` on an inline box does nothing to itself, so
   both declarations in the shipped rule are dead code. The label is the one thing that makes a well
   "visibly an ad", and the AD_PLAN wrapper contract hard-codes `<span class="ad-well-label">`, so
   this will be wrong on every well Wave 3 ships.
   **Fixed looks like:** `display: block` on `.ad-well-label` (then both existing declarations start
   working and the label sits centred, 12 px clear of the slot) — or change the contract markup in
   AD_PLAN to a `<div>`. Either way the label should be centred over the reservation, as the rule
   already intends. Costs ~16 raw B, or 0 if the two now-dead declarations are traded for it.

3. **Even once issue 1 is fixed, desktop article inventory is capped at 623 px — r1 issue #2 is only
   half-resolved.** **COMPONENT + PLAN decision.** project-*.html at 1024/1280/1440 —
   `harness/out/peek/ms3-project-fixedwidth-1440.png` (the well is 623.2 px, not 970).
   `.project-guide` at ≥64em is `grid-template-columns: minmax(0, var(--measure)) var(--rail)` and
   every non-aside child is pinned to `grid-column: 1`, so `--measure` (68ch = 623.2 px) is the hard
   ceiling. `min(100%, 970px)` only ever materialises for `home-mid` and `listing-mid` inside a
   `.container`. 623 px clears 300×250 / 336×280 / responsive, but not 728×90 and not 970×250, on the
   pages that carry three of the five positions.
   **Fixed looks like:** a human decision recorded in AD_PLAN, not a silent cap. Either (a) accept
   the editorial column and note that article wells are a 300/336-tier position — then delete the
   970 from the rule, because it is misleading everywhere it can never apply; or (b) let the article
   well break out: `.project-guide > .ad-well { grid-column: 1 / -1; max-width: min(100%, 970px) }`
   at ≥64em, which gives 970 px at 1440 while the prose stays at 68ch. I would take (b) for
   `article-mid-*` and leave `article-end` in-column.

4. **At 1440 a 970 px well is centred in the 1200 px container and breaks the single left edge this
   round just built.** **COMPONENT**, cosmetic + adjacency. index.html, interview-prep.html,
   projects.html, resources.html at 1440 — `harness/out/peek/ms3-interview-1440.png`,
   `ms3-home-1440.png`. The well runs **235 → 1205** while every other block on the page runs
   **152 → 1288** (the builder's headline item-1 achievement). The ad is the only element on the page
   that starts somewhere else, and its hairlines make the misalignment explicit. It also reads
   slightly "pasted in", which is the wrong signal next to editorial content.
   **Fixed looks like:** decide which edge wins. Either drop the desktop cap to the container width
   (the well fills 1136 px and aligns), or keep 970 and left-align it (`margin-inline: 0 auto` at
   ≥64em) so its left hairline lands on 152 with the h2s above it. Left-aligning is my preference:
   970 stays available for a billboard and the page keeps one edge.

5. **The ad gate cannot see an `.ad-well`, so nothing enforces AD_PLAN's own placement rules.**
   **COMPONENT (harness/integrity.js), process.** `integrity.js:49` builds its `ads` record from
   `q('ins.adsbygoogle')`, and `NO_AD_ABOVE_FOLD` / `AD_UNIT_WITHOUT_SLOT_ID` / `AD_COUNT_CHANGED_
   WITHOUT_APPROVAL` all key off that array. In an Auto-ads-only world the committed markup is a
   `.ad-well` **without** an `<ins>` (Auto ads injects its own at runtime, and the harness blocks it),
   so a well shipped above the fold, or duplicated, or dropped outside a `.container`, passes the gate
   silently. Today that is harmless — there are 0 wells — but Wave 3 is exactly when it stops being
   harmless, and the gate is currently the only thing standing between a bad placement and production.
   **Fixed looks like:** extend the `ads` extractor to `ins.adsbygoogle, .ad-well[data-position]`,
   recording `position`, `top`, `aboveFold` and the parent chain, and add a rule that a well whose
   nearest positioned ancestor is not a `.container` fails. Harness owner, before the first well ships.

6. **`WEIGHT: FAIL` — 19 pages over their gzip baseline (+299 … +2,469 at the Wave 1 r2 commit).**
   **Sign-off item, not scored**, per the round brief. Attribution verified above: it matches the
   builder's §4.3 to the byte except the static-page summary range. The shell's own share is
   +1,917 gzip of CSS and +310 of JS on 19 pages; nothing in it is removable without removing a
   feature the briefs asked for. Note for the owner: the pages that carry the most ad inventory (the
   11 project guides) are also the most over, at +2,451 … +2,469 — and they are the pages where an
   extra ~2.7 KB of gzip on a 4G phone is competing directly with time-to-first-ad-request.

7. **11 project pages still render a breadcrumb trail with no BreadcrumbList markup.**
   **COMPONENT (`.breadcrumbs` applier), blocked on a human `ld` approval.** Unchanged from r1 and
   correctly so — structured data is frozen. Still the site's 11 longest, most link-worthy pages
   being the only ones with a visible trail and no machine-readable equivalent.

8. **Lighthouse SEO 92 on index.html and tools.html.** **PAGE (content), blocked.** `link-text` on
   the five frozen "Learn More" links is the only failing SEO audit on either page (audit-by-audit
   check above). Not a Wave 1 regression; the area cannot meet the ARCHITECTURE SEO budget until
   HUMAN_TODO A5 is answered.

## Nits

- **Bottom anchor has clean air; keep the top anchor off.** I enumerated every `position:fixed` and
  `position:sticky` element on index, a project page and interview-prep at 390/1024/1280/1440: the
  only hits are `header.site-header` (`sticky; top:0; z-index:100`; 56 px mobile / 64 px desktop) and
  `aside.guide-aside` (`sticky; top:88px`, ≥64em only). **Nothing is anchored to the bottom on any
  page at any width**, so a bottom anchor ad has an unobstructed strip. A *top* anchor would stack
  above the sticky header (Google's anchor z-index is far above 100) and eat ~120 px of an 844 px
  phone viewport. Recommendation for HUMAN_TODO B1 unchanged: **bottom anchor ON, top anchor OFF**.
- **Side rails must stay OFF — recorded clearances.** `.guide-aside` is sticky at `top: 88px` and
  248 px wide; clearance from its right edge to the viewport edge is **32 px at 1024, 72 px at 1280,
  152 px at 1440** (the left gutter mirrors it exactly: article left edge at 32 / 72 / 152). These are
  the numbers AD_PLAN already records, and they are correct. A Google side rail wants roughly 160 px
  of margin per side; at 1440 there is 152 px and at 1024 there is 32 px, so a rail would overlay the
  sticky TOC on every project page. Keep rails off.
- **The drawer scrim sits at `z-index: 90`, below anything Google injects.** `html.nav-open::before`
  is `position: fixed; inset: var(--header-h) 0 0; z-index: 90` below 60em. A bottom anchor (z-index
  ~2147483647) would float on top of the dimmed page while the menu is open. Cosmetic, and the scrim
  is dismissed by an outside tap, but worth knowing before B1 is recorded.
- **A well outside a `.container` goes full-bleed and clips its own label** —
  `ms3-homeBare-390.png` shows the 390 px edge-to-edge case with "ADVERTISEMENT" cut at x=0. AD_PLAN's
  `home-mid` correction already says "inside a `.container`", so this is a placement instruction, not
  a defect — but the component does not defend itself. If Wave 3 would rather not depend on the
  placement doc, give `.ad-well` its own `padding-inline` fallback.
- **`class="no-js"` is still on 19 pages with zero `.no-js` rules in the sheet.** `script.js` still
  swaps it for `.js` at line 7–8, so the hook exists for the Wave 3 collapse script, but today it is
  ~133 B of dead attribute. Keep it deliberately or drop it; the byte budget is under pressure.
- **The `home-mid` seam puts four orange underlined "Learn More" links ~85 px above the well**
  (`ms3-home-1440.png`). Links, not filled buttons, so nothing like the r1 issue #1 severity, and the
  48 px well margin plus the card padding keeps real separation — but it is the same family of
  adjacency and it is worth one look with real fill before B1 is finalised.
- **Section rhythm is still genuinely ad-ready, measured.** Every injected well got **48 px above and
  48 px below** in `.container` parents and **80/48** inside `.project-guide`; every anchor I tested
  lands well below the fold (`aboveFold: false` at all three widths: absolute tops 1,025–1,251 px on a
  project page at 1024/1440, 3,275 px on index@1440, 1,648 px on interview-prep@1440, against 844/900
  px viewports).
- **The reservation works.** `.ad-well-slot` computes `min-height: 280px` and renders 280 px at every
  width and every anchor, with the well at 334 px total. With no CSS able to collapse it any more,
  a well cannot produce a post-paint shift — the CLS-0 result this area earned is safe from the ad
  wrapper. (Note the 334 px, not 339: 5 px of that difference is the dead label margin from issue 2.)
- **Pre-existing CSP gap, unchanged and not this round's problem:** `script-src`/`connect-src`/
  `frame-src` still omit `https://ep2.adtrafficquality.google` and `https://www.google.com`, which
  current AdSense uses for anti-abuse calls. Byte-identical to baseline, so out of scope, but it may
  be quietly costing fill and deserves a HUMAN_TODO line.
- **Auto ads is unaffected by all of this today.** Auto ads injects its own containers wherever it
  chooses; `.ad-well` is dormant Wave 3 scaffolding. Nothing user-facing is broken right now — issues
  1–4 are about what Wave 3 would ship if it trusted the current CSS and AD_PLAN's "fixed" line.
- **Process, again:** the tree moved under me exactly as it did in round 1. Clean at the start, 18
  modified files at the end. I re-ran integrity and the tracking diff against the moved tree (both
  still clean) and confirmed lines 1–286 and `[ad-presentation]` are untouched, so this score stands —
  but a gauntlet round whose tree is being edited by other builders while it is being judged is a
  measurement hazard, and the byte sign-off in particular should be taken against a frozen tree.

## What earns the 8.3, and what keeps it under 8.5

Everything the monetization brief asks to be left alone is provably untouched, by two independent
methods: ads.txt, robots.txt, sitemap.xml and the CSP byte-identical to f1ec399; the AdSense loader
and GA snippet string-identical on all 21 pages; zero manual `<ins>`; no CMP. Every SEO field is
unchanged (`INTEGRITY: PASS`), one h1 per page, heading order clean, `noindex` only on 404,
breadcrumbs correctly `data-ui` with the frozen structured data untouched, and SEO 100 everywhere
except the two pages blocked on a content approval, where `link-text` is confirmed as the only
failing audit. CLS is still flat 0. Three of my five round-1 issues are properly closed, including
the two that mattered most for click quality and CLS: the orange CTA is gone from the end-of-article
slot, and the `:has()` collapse rule is deleted outright rather than patched — "`.no-js` never
collapses" is now a structural fact, which is a better answer than the one I asked for. The stale
weight numbers are gone; every figure the builder reported reproduces exactly.

It is not a pass because the one component this area actually owns still does not work where it
matters. `.ad-well` was request item 11, and half of item 11 landed: the 970 px cap is real in a
`.container`, but inside `.project-guide` the well renders 123 px wide at every single width — the
same 123 px the Wave 2 critic reported, on the 11 pages that carry three of the five planned
positions — while AD_PLAN states in writing that this was fixed in this round, and the builder's own
verification probe used the one parent type where the bug cannot reproduce. Alongside that, the
label's centring and spacing are dead declarations, so the "visibly an ad" affordance renders wrong
on every well; the desktop cap the round was meant to lift is still 623 px in articles; and the gate
that is supposed to police placement cannot see a well at all. Two of those are one-line fixes, which
is precisely why a round should not close with a false "fixed" in the plan document.

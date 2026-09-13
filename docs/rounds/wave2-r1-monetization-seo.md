# Wave 2 round 1 — monetization & SEO critic

Date: 2026-09-13 · Branch `facelift` @ `6bb6164` · Four areas scored separately.

**No live ad was loaded at any point.** Every capture went through the harness route blocker
(`harness/pages.js` `BLOCKED_HOST_RE`, fulfilled 204/empty-JS). The production site was never opened.
Where I needed to see an ad in place I inserted the repo's own `.ad-well` wrapper with a **local
striped placeholder div** — no `<ins>`, no network, nothing clickable.

---

## Shared evidence (applies to all four areas)

### Gates run once, on this tree

```
node harness/integrity.js compare --base baseline-2026-09-13
INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)

node harness/weight.js
styles.css: raw 42787 (ref 35518), gzip 10282 (ref 6078)
WEIGHT: FAIL (19 pages over their gzip baseline)
  worst: project-static-website.html gzip 15653 vs 11000 (+4653)
         project-ec2-web-server.html gzip 15846 vs 11193 (+4653)
         contact.html               gzip 13976 vs  9915 (+4061)
  only OK: resources.html gzip 161642 vs 372586 (-210944)
```

Weight is recorded, **not scored** — consolidation is in flight and it is one shared stylesheet, not
four area problems. On the harness's *uncompressed* transfer, 5 of 60 public rows are 1 KB over
baseline (`project-static-website` and `project-serverless-rest-api`, 57 vs 56 / 60 vs 59 KB).

`node harness/snap.js --label ms2-r1 --force` (21 pages × 390/768/1440, 63 runs):

```
public rows 60: consoleErrors=0  pageErrors=0  failedRequests=0
axe serious+critical=0  axe any impact=0  hOverflow=0/60
max CLS on a public page = 0.0008 (resources@768/@1440)   max LCP = 140 ms
admin.html carries the 3 known local /.auth/me console errors (out of scope)
0 of 60 public rows above the baseline transfer number
```

### Ad / tracking plumbing — byte-frozen, verified independently of the gate

- `grep 'ins class="adsbygoogle"' *.html` → **0 matches on all 21 pages**. `.ad-well` instances: **0**.
- For every one of the **21 HTML files**, the set of `googlesyndication` / `googletagmanager` /
  `gtag(` / `adsbygoogle` / `G-VBQ33BLD4E` lines is **string-identical to `git show f1ec399:<page>`**
  (9 lines on the 9 listing/static pages, 7 on the 11 project pages, 0 on 404.html and admin.html).
- `git diff f1ec399 -- ads.txt robots.txt sitemap.xml` → **empty**.
- `staticwebapp.config.json`: `globalHeaders` (the CSP with the ad/analytics hosts) is
  **deep-equal to f1ec399**; only `routes` differs (the new 404-blocking routes, which now include
  `/_showcase/*` — useful for Wave 3).
- Live DOM, 20 public pages at 390: AdSense loader on 19 (absent only on 404.html), `G-VBQ33BLD4E`
  on the same 19, `consentMode` still false (no CMP added), `ins.adsbygoogle` = 0 everywhere.

### SEO sweep — all 20 public pages, live DOM at 390

Script: one Playwright pass, output in the scratchpad (`ms2-seo.json`). Compared field-by-field
against `harness/baseline/baseline-2026-09-13.json`.

- **Exactly one `<h1>`** on every page; every `h1` is inside `<main>`.
- `title`, `meta[description]`, `link[rel=canonical]`, `meta[robots]`: **identical to baseline on all
  20 pages**. `robots = index, follow` on 19; `noindex` on **404.html only**. No noindex leak.
- **Internal link set (fragment-stripped, the way `integrity.js` records it): identical on all 20.**
  The only raw-href additions since baseline are `#main` (skip link) and the seven rail fragments,
  all fragment-only and all ignored by the gate.
- **Heading skips inside `<main>`: exactly one, `tools.html` H2 "More Career Resources" → H4 "AWS
  Pricing Calculator"** — and the identical skip is in the baseline snapshot, so **nothing was
  introduced**. The other skips the baseline records (about/contact/privacy/index/11 project pages)
  are the footer `h4`s, outside `main`, and `aria-level` already neutralises them for AT.
- **`h2` ids: 7 per project page, all non-empty, all unique; zero duplicate element ids on any of
  the 20 pages.** Two distinct slug sets across the 11 project pages (10 pages share one, see
  article-template issue 3).
- **JSON-LD parses on every page that has it**, and the type sets are unchanged:
  index WebSite+Organization+BreadcrumbList+FAQPage · projects/resources CollectionPage+BreadcrumbList ·
  tools WebApplication+BreadcrumbList · interview-prep FAQPage+BreadcrumbList · about AboutPage+BreadcrumbList ·
  privacy WebPage+BreadcrumbList · contact, 404, 11 project pages = none. Nothing added or lost.
- **Images: 0 of all `<img>` on all 20 pages are missing `width`/`height`; 0 are missing `alt`.**
- Lighthouse SEO (mobile): **100** on projects, resources, interview-prep, about, contact,
  project-multi-account-landing-zone, project-kubernetes-eks. **92 on index.html and tools.html** —
  `link-text` only, the five frozen "Learn More" links, visible in `ms2-well-home-mid@390.png`.
  Known, content-blocked, unchanged since baseline.

### SITE-LEVEL SEO DEFECT found this round (pre-existing, not a Wave 2 regression, ranks above everything below)

`staticwebapp.config.json` → `responseOverrides["404"] = { "rewrite": "/index.html", "statusCode": 200 }`
and `navigationFallback.rewrite = "/index.html"`. **Every unknown URL on the production site returns
HTTP 200 with a full copy of the home page.** That is a soft-404 generator: Search Console will file
these under "Soft 404", every typo/legacy/scraped URL becomes a duplicate of `index.html`, **and the
AdSense loader runs on each of those duplicates**. It also means the `404.html` the static-pages
builder just redesigned is **never served in production** — it is dead code. Byte-identical to
`f1ec399`, so the gate cannot see it and no area caused it.
**Fixed looks like:** `"404": { "rewrite": "/404.html", "statusCode": 404 }` and
`navigationFallback.rewrite: "/404.html"`. `staticwebapp.config.json` is not one of the 21 gated
pages, so this costs no content approval. This should not ship to a live AdSense account as it is.

---

```
Area: article-template   Round: 1   Critic: monetization & SEO   Score: 8.2/10   Verdict: FAIL
```

Screenshots looked at:
- `harness/out/peek/ms2-well-mid1@390.png` — **the finding.** The repo's own `.ad-well` inserted at
  the planned `article-mid-1` position on a 390 px phone renders as a **123 px-wide column** centred
  in the 342 px measure; even its hairline rules are only 123 px long.
- `harness/out/peek/ms2-well-mid1@1440.png` — same well at 1440: still 123 px, floating in the
  623 px article column, with the sticky "On this page" rail at the right and ~265 px of empty grid
  gutter between them.
- `harness/out/peek/ms2-project-mid1@390.png` — the untouched seam: diagram panel ends, 32 px, hairline,
  "Step-by-Step Instructions". No button within ~900 px.
- `harness/out/peek/ms2-project-mid2@390.png` — the `article-mid-2` seam: Tips callout (accent left
  rule, tint) → 32 px → "Code Examples" h2 → first code block. Nearest tappable thing is the Copy
  button 183 px below the well.
- `harness/out/peek/ms2-project-end@390.png` — **Wave 1 issue 1 is fixed**: the orange filled "Back to
  All Projects" is gone; both pagination links are quiet white hairline cards above the navy footer.
- `harness/out/peek/ms2-project-end@1440.png` — same at 1440, two equal white cards, no orange.
- `harness/out/peek/ms2-project-chips@390.png` — key-facts definition rows → 24 px → the seven-chip
  scrollable TOC row → 16 px → "Prerequisites". No visible "On this page" label at 390.
- `harness/out/peek/ms2-project-rail@1440.png` — the sticky rail: hairline left rule, plain text
  links, right edge at x=1288 in a 1440 viewport.
- `harness/out/peek/ms2-project-bottom@390.png` — end of page, navy footer, nothing fixed or sticky at
  the bottom: a bottom anchor ad has clear air.

Gate results: `console=0` (60 public runs) · `axeSC=0` · `axeAll=0` · `perf=100` · `a11y=100` ·
`bp=100` · `seo=100` · `cls=0` · `lcp=1.65 s` (project-multi-account-landing-zone, `article-r1`) ·
`hOverflow=0` · `integrity=PASS` · `weight=FAIL (wave-wide, not scored)`.

**Measured clear space at the three planned positions**, taken with a real `.ad-well` inserted, at
390 / 1024 / 1280 / 1440 (identical at all four):

| position | clear above | clear below | nearest tappable above | nearest tappable below |
|---|---|---|---|---|
| `article-mid-1` | **80 px** | **48 px** | 926 px | 2788 px |
| `article-mid-2` | **80 px** | **48 px** | 3531 px | 183 px (Copy) |
| `article-end` | **80 px** | **72 px** | 1503 px (Copy) | **97 px** (quiet "← Previous Project" card) |

So the brief's question — ≥ 48 px on both sides — is **yes at every position and every width**, and
nothing button-like is within 48 px of any of them. (`.project-guide` is flex below 64em and grid
above it, so the well's 48 px margins do **not** collapse against the section's 32 px; you get 80.)

Ranked issues (worst first):

1. **The `.ad-well` renders 123 px wide at all three planned article positions, on every project page,
   at every width.** — **COMPONENT** (one declaration in `styles.css` `[ad-presentation]`, triggered by
   `[article-template]`'s layout). `project-*.html` × 11, 390/1024/1280/1440 —
   `ms2-well-mid1@390.png`, `ms2-well-mid1@1440.png`.
   `.ad-well { margin: var(--sp-7) auto; max-width: min(100%, 970px) }` (styles.css:619) has **no
   `width`**. `.project-guide` is `display: flex; flex-direction: column` below 64em and
   `display: grid` above it (styles.css:268, 344). In a flex/grid item, `auto` inline margins
   suppress stretch and the item **shrinks to fit its content** — 123 px, the width of the word
   "ADVERTISEMENT". All three AD_PLAN article positions are direct children of `.project-guide`, so
   all three collapse. Measured `wellW = 123` in 12 of 12 (position × width) combinations; the same
   well inserted *inside* a `.guide-section` or `.guide-overview` (plain block flow) correctly
   renders 342 / 623 px. A 123 × 280 box matches no AdSense size; responsive fill would serve a
   near-worthless unit or nothing at all, i.e. **~zero in-article revenue on the site's 11
   highest-intent pages** while the layout still spends 334 px of height on it.
   **Fixed looks like:** `.ad-well { width: 100% }` added alongside the existing `max-width`
   (auto margins then resolve to 0 in flex/grid and still centre in block flow), then re-shoot
   `article-mid-1` at 390 and 1440 and confirm 342 px / 623 px before any `<ins>` ships in Wave 3.
   This is *not* one of the Wave 1 `.ad-well` items — those are fixed on this tree (`max-width` is
   now `min(100%, 970px)`, measured 970 px on projects.html at 1440, and the `:has(...unfilled)`
   collapse rule is gone).

2. **Desktop article inventory is structurally capped at 623 px, and the fix above will not lift it.**
   — **COMPONENT** (`[article-template]` grid). 11 project pages, ≥ 64em — `ms2-well-mid1@1440.png`.
   `.project-guide > :not(.guide-aside) { grid-column: 1 }` and column 1 is `minmax(0, var(--measure))`
   = **623 px**. So even a correctly-sized well can never exceed 623 px on a project page: 728×90 and
   970×250 are unreachable on the longest, highest-CPM pages, while the same well on projects.html
   measures 970 px. The shot also shows ~265 px of empty grid gutter sitting beside the ad.
   **Fixed looks like:** give the two mid positions `grid-column: 1 / -1` (or a `.ad-well--wide`
   variant) so a desktop billboard can run full container width under the article column, with the
   68 ch prose measure untouched. If the panel prefers the ad to respect the measure, say so
   explicitly and record that project pages are a 336×280-tier surface.

3. **`article-mid-1`'s DOM anchor does not exist on `project-infrastructure-as-code.html`.** — PAGE
   (affects the Wave 3 placement script, not the markup). `grep -c 'id="architecture"'` on that page
   = **0**; its third `<h2>` is "Choose Your Tool" → `id="choose-your-tool"` (the other 10 project
   pages all carry `#architecture`). A placement script keyed on `#architecture` would silently drop
   1 of 11 mid-1 units and no gate would notice.
   **Fixed looks like:** AD_PLAN and the Wave 3 script anchor on **the third `.guide-section`**, not
   on a slug — or list both slugs explicitly. One line in the plan, before Wave 3 starts.

4. **Auto ads can inject between the key facts and the chip row, and on desktop that lands above the
   fold.** — COMPONENT (`[article-template]` `.guide-overview`) — `ms2-project-chips@390.png`.
   Inserting a well after the `<dl class="guide-meta">` (a normal, attractive Auto-ads insertion
   point: end of a block, before a nav element) renders **full width** — so it does not break the
   flow — but at **y = 867 in an 844 px viewport at 390** (23 px of clearance under the fold) and at
   **y = 745 in a 900 px viewport at 1024 / 1280 / 1440**, which is `aboveFold = true` by
   `integrity.js`'s own definition (`top < innerHeight`, line 49). It also wedges an ad between the
   spec sheet and its own table of contents.
   **Fixed looks like:** `.guide-overview` goes on the AdSense **excluded areas** list when the owner
   records HUMAN_TODO B1, and `article-mid-1` ships explicitly so Auto ads has no reason to hunt for
   that seam. Nothing to change in markup.

5. **Auto-ads side rails would collide with the sticky "On this page" rail at every desktop width.**
   — COMPONENT (`[article-template]` `.guide-aside`) — `ms2-project-rail@1440.png`.
   Measured rail right edge / clear space to the viewport right edge: **1024 → 992 px, only 32 px
   clear** · **1280 → 1208 px, 72 px** · **1440 → 1288 px, 152 px**. A Google right side rail is
   120–160 px docked to the viewport edge at a z-index far above the rail's `z-index: auto`, so it
   would overlay the rail's links at 1024/1280 and sit flush against them at 1440. AD_PLAN already
   says side rails off — this makes it a **hard constraint rather than a preference**.
   **Fixed looks like:** HUMAN_TODO B1 records "side rails OFF" with this measurement as the reason,
   and it is re-checked if the rail width or the container ever changes.

6. **The pagination cards are quiet but still card-shaped, 97 px from the end-of-article well.** —
   COMPONENT (`.guide-navigation`), **Wave 1 issue 1 is resolved** — `ms2-project-end@390.png`,
   `ms2-project-end@1440.png`. Both links are now `.guide-nav-link`: `background #ffffff`,
   `1px solid #e6e2da`, `border-radius 8px`, `padding 16px`, full-width at 390 / two equal 306 px
   cards at 1440. No orange fill anywhere near the footer. The residual: they are two rounded,
   bordered, padded rectangles immediately under the article-end ad. At 97 px of separation this is
   acceptable; I would not spend anything on it.

7. **The chip row is an unlabelled pill row directly under a spec table.** — COMPONENT
   (`.guide-aside` below 64em) — `ms2-project-chips@390.png`. `.guide-aside-title` is
   `display: none` below 64em (inside `data-ui`, so gate-invisible and correctly excluded), leaving
   seven rounded outline pills with no visible caption — which is also the shape AdSense's own
   "related search" units use. Only a confusability nit, not a policy problem, and the `nav` carries
   `aria-label="On this page"` for AT.

**Rail audit (all clean):** `data-ui` = true · 7 links, **all fragment-only** (`#project-overview` …
`#what-youll-learn`) · **no JSON-LD inside the aside** · the seven rail strings land in the gate's
`uiText` bucket, not the content text · `ol` is `overflow-x: auto` with `scrollWidth 828 / clientWidth 342`
at 390 and no page overflow · heading ids stable (slugs derive from frozen `<h2>` text, which the gate
freezes) and unique.

Nits:
- `.ad-well-label` computes to **`display: inline`**, so its `margin-bottom: 12px` and
  `text-align: center` (styles.css:622) are both inert: the label renders flush left with a **4 px**
  gap to the slot instead of 12 px. Two dead declarations; add `display: block` or drop them.
- Reserved height measured end-to-end: **334 px** (12 pad + 17 label + 4 + 280 slot + 12 pad + 2 rules)
  for `--ad-h: 280px`. Worth recording so the Wave 3 CLS budget uses 334, not 280.
- The article's own section rhythm is 32 px between `.guide-section`s — thinner than the 96 px
  top-level seams Wave 1 measured. Fine for the planned wells (which bring their own 48), thin for
  Auto ads.

---

```
Area: code-and-diagrams   Round: 1   Critic: monetization & SEO   Score: 8.8/10   Verdict: PASS
```

Screenshots looked at:
- `harness/out/peek/ms2-project-mid2@390.png` — Tips callout → "Code Examples" → a code block: dark
  navy panel, monospace, `DENY-REGIONS-SCP.JSON` file label, amber `JSON` chip, quiet "Copy" control
  in the header band. Unmistakably code, not a creative.
- `harness/out/peek/ms2-project-mid1@390.png` — architecture diagram panel (navy, framed, captioned)
  ending 32 px above the next h2. The diagram reads as one figure, not as a stack of banner-shaped boxes.
- `harness/out/peek/ms2-project-bottom@390.png` — end of a project page: nothing fixed or sticky at
  the bottom, so a bottom anchor unit has clear air.
- `harness/out/peek/ms2-well-mid1@1440.png` — a well sitting directly above the "Step-by-Step" block
  at 1440 with the diagram above it; no code or diagram element competes with it visually.

Gate results: `console=0` · `axeSC=0` · `axeAll=0` · `perf=100` · `a11y=100` · `bp=100` · `seo=100` ·
`cls=0` · `lcp=1.65 s` (project-kubernetes-eks, `code-r1`) · `hOverflow=0` · `integrity=PASS` ·
`weight=FAIL (wave-wide, not scored)`.

**Policy sweep, 4 project pages × 390/1440.** I scanned every element in `<main>` for the standard
creative footprints (300×250, 336×280, 728×90, 320×50, 970×250, 160×600, ±12 px):

- **At 1440: zero matches on all four pages.**
- At 390 the matches are `div.arch-component` 316 × 51 (≈ 320×50 mobile banner), `li` 322 × 56, and
  one `ul.guide-list` / `div.guide-section` whose *height* happens to land near 280. I judge none of
  these confusable: the arch-components sit inside a framed navy diagram with sibling nodes, arrows
  and a caption; the `li`s and `ul`s have no border, no background and no radius — they are plain
  bullet text. No element in the area carries a creative's signature (isolated bordered box, its own
  background, a lone image, an unrelated brand).
- **0 `position: fixed` elements and 0 sticky elements with `bottom` set** on all four pages at both
  widths → a bottom anchor ad has the whole footer seam to itself.
- The `text-transform: uppercase` retained on `.code-label` / `.arch-group-label` is *visible*
  uppercase text with `font-variant-caps` layered on it, not a hidden-text trick. Nothing in the
  section hides text, off-screens it, or sets `font-size: 0`.
- No markup changed on any project page, so this area cannot have moved a title, heading, link, alt
  or JSON-LD — and `INTEGRITY: PASS` confirms it.

Ranked issues (worst first):

1. **An Auto ad injected before a code block lands ~33 px above the 44 px "Copy" tap target.** —
   COMPONENT (`.code-block` margins) — `ms2-project-mid2@390.png`. Measured on 4 pages × 2 widths:
   every `.code-block` has `margin: 24px 0`, and its `.code-copy` sits **9 px** below the block's top
   edge, 54 × 44 at 390 (touch) / 54 × 33 at 1440. So the gap between an ad that takes the pre-code
   seam and the first tappable thing after it is **24 + 9 = 33 px**, under the 48 px comfort line and
   in exactly the "scroll, ad ends, thumb lands" zone. The three *planned* wells are never this
   close — the nearest measured is **183 px** (`article-mid-2` → first Copy) — so this is an
   Auto-ads-only exposure.
   **Fixed looks like:** `.code-block { margin-block: var(--sp-6) }` (24 → 32 px, ~0 bytes) which
   takes the gap to 41 px, and/or `.code-examples`/`.code-block` on the AdSense excluded-areas list.
   Nothing about the Copy button itself needs to change — it is quiet (`#ffffff0d` on the navy band),
   correctly sized, and visually part of the code block rather than floating on paper.

2. **`Code Examples` is a long run of 24 px seams.** — COMPONENT, informational.
   On `project-multi-account-landing-zone` the last 4,700 px of the page is five code blocks at
   656–1,049 px each separated by 24 px and an `h3`. Auto ads has few comfortable seams in the
   second half of the longest pages, which pushes fill toward the `article-mid-2` / `article-end`
   wells. That is the right outcome, but worth knowing before reading the first AdSense report.

3. **`.code-inline` is styled and unused.** — COMPONENT. `grep -c code-inline *.html` = 0. Dead CSS
   on all 21 pages while the wave is over its gzip budget; either article-template starts emitting
   it or it comes out. (The builder flags the same thing in §6.4.)

Nits:
- Diagrams: `scrollWidth − clientWidth = 0` on all four pages at 390 and 1440, so the
  `overflow-x: auto` safety net never fires and no diagram can trap a horizontal swipe next to an ad.
- Diagram heights at 390 are 386–459 px — each fits in one phone screen, which means the pre-diagram
  and post-diagram seams are both real, usable injection points rather than being buried mid-tower.
- `tab-size: 2` is inert (no `<pre>` in the baseline contains a tab). Harmless.

---

```
Area: listing-pages   Round: 1   Critic: monetization & SEO   Score: 8.3/10   Verdict: FAIL
```

Screenshots looked at:
- `harness/out/peek/ms2-well-projects@390.png` — **the good case.** `listing-mid` on projects.html:
  a full 342 px well, hairline rules top and bottom, "ADVERTISEMENT" label, 48 px above to a quiet
  outline "View Guide", 64 px below to the "Intermediate Projects" rule.
- `harness/out/peek/ms2-projects-groupseam@390.png` — the same seam untouched: card ends in a quiet
  hairline "View Guide", 48 px, 2 px section rule, h2 with 64 px above it.
- `harness/out/peek/ms2-resources-aftergrid@390.png` — after the book grid: "View on Amazon" outline
  button, band change, "Pluralsight Learning Paths" h2, then the Pluralsight panel with the page's
  single orange "Start Free Trial".
- `harness/out/peek/ms2-well-interview-cat3@390.png` — **the finding.** `listing-mid` on
  interview-prep placed where AD_PLAN says ("after the 3rd category") renders **123 px wide** because
  that position is a child of `.interview-grid`.
- `harness/out/peek/ms2-well-home-mid@390.png` — **the second finding.** `home-mid` on index.html
  renders **full-bleed, x = 0 to 390**: the label and both hairline rules run off both screen edges,
  the only element on the site with no page gutter.

Gate results: `console=0` · `axeSC=0` · `axeAll=0` · `hOverflow=0` ·
`perf` index 100 / projects 100 / interview-prep 100 / resources 99 · `a11y=100` · `bp=100` ·
`seo` projects 100, interview-prep 100, resources 100, **index 92**, **tools 92** (both `link-text`,
frozen "Learn More" copy) · `cls` 0 except resources 0.0008 · `lcp` resources 2.18 s (baseline 2.10) ·
`integrity=PASS` · `weight=FAIL (wave-wide, not scored)`.

**Measured placement, with a real `.ad-well` inserted (390 / 1440):**

| position | parent | rendered width | clear above / below | nearest filled CTA |
|---|---|---|---|---|
| projects, between level groups | `div.container` (block) | **342 / 970** | 48 / 64 | none (View Guide is transparent + hairline) |
| resources, after the book grid | `div.container` (block) | **342 / 970** | 48 / — | orange "Start Free Trial" **522 / 442 px** below |
| interview-prep, after 3rd category | `div.interview-grid` (**grid**) | **123 / 123** | 72 / 96 | none |
| interview-prep, after the whole grid | `div.container` (block) | **342 / 970** | 48 / 48 | none |
| index, `home-mid` between sections | `main` (block, **no container**) | **390 / 970** | 48 / 48 | none within 111 px |

Ranked issues (worst first):

1. **`listing-mid` on interview-prep, as AD_PLAN specifies it, collapses to 123 px.** — COMPONENT
   (same `.ad-well` `margin:auto` × grid-parent mechanism as article-template issue 1) —
   `ms2-well-interview-cat3@390.png`. "After the 3rd category" makes the well a child of
   `.interview-grid` (`display: grid`, 2-up at ≥ 64em), so it becomes a grid item, shrinks to its
   label, and at 1440 it would sit in a 544 px category slot beside a real category — an ad in a
   content card's seat, which is the exact confusion the brief is trying to avoid.
   **Fixed looks like:** the `.ad-well { width: 100% }` fix, **and** AD_PLAN re-worded to
   "after the `.interview-grid` container" — measured there it is 342 / 970 px with 48 px clear on
   both sides and no CTA nearby. Two one-line changes, both before Wave 3.

2. **`home-mid` renders full-bleed on a phone.** — COMPONENT (`.ad-well` needs a gutter when it is a
   direct child of `main`) — `ms2-well-home-mid@390.png`. index.html's `<section>`s are children of
   `<main>`, and `main` has no horizontal padding — only the inner `.container` does. A well placed
   *between* sections therefore runs **0 → 390 px**, with the "ADVERTISEMENT" label jammed against
   the left screen edge and the hairline rules bleeding off both sides. Every other element on the
   site keeps a 24 px gutter. It is also the widest thing on the page, which reads as more
   aggressive than it is.
   **Fixed looks like:** place `home-mid` inside the adjacent section's `.container` (the seam still
   has 96 px of section padding at 390 / 128 px at 1440 to sit in), or give `.ad-well` a
   `padding-inline: var(--sp-5)` fallback for the no-container case. Prefer the first.

3. **resources.html carries 13 affiliate links and no affiliate disclosure.** — PAGE, needs a human
   approval. `ms2-resources-aftergrid@390.png`. The page has 8 Amazon Associates links
   (`?tag=dreamscribe09-20`) and 5 Pluralsight links. The words "affiliate", "commission" and
   "disclosure" appear **zero times** in `<main>`; the only match anywhere on the page is the
   footer's "Not affiliated with Amazon Web Services", which is a *disassociation* notice, not an
   earnings disclosure. The real disclosure lives on about.html and privacy.html only.
   **This is not a Wave 2 regression** — the baseline text snapshot for resources.html has exactly
   the same single "affiliat" hit, and `externalLinks` is unchanged, so `INTEGRITY: PASS` is correct.
   But it is the site's commercial page, FTC 16 CFR 255 wants the disclosure clear and conspicuous
   *near* the links, and the facelift is the moment to fix it.
   **Fixed looks like:** one `.note` paragraph under the "Recommended AWS Books" h2 reusing the exact
   privacy.html wording, plus a `{"page":"resources.html","field":"text",...}` entry in
   `docs/APPROVALS.json`. A human decision, not a builder change.

4. **All 13 affiliate/partner outbound links carry only `rel="noopener"` — no `rel="sponsored"`.** —
   PAGE, pre-existing (identical at `f1ec399`). Google's link-spam guidance asks for
   `rel="sponsored"` (or at minimum `nofollow`) on affiliate links; without it the eight Amazon links
   pass ranking signals to a monetised destination, which is the textbook "unnatural outbound links"
   manual-action pattern — on the one page that also carries the AdSense loader.
   `rel` is **not** one of the gate's captured fields, so it is technically fixable without an
   approval, but it edits a frozen page and should get one anyway.
   **Fixed looks like:** `rel="sponsored noopener"` on the 8 Amazon links and the 5 Pluralsight
   links; no visible change, no text change, no link-set change.

5. **The Pluralsight panel is correctly *not* ad-shaped, but it is an unlabelled paid placement.** —
   PAGE — `ms2-resources-aftergrid@390.png`. Good: it sits under its own `<h2>Pluralsight Learning
   Paths`, carries the brand wordmark, a pink brand rule, three lines of body copy and a single CTA —
   nobody will mistake it for an AdSense creative, and nobody will mistake an AdSense creative for
   it. Its `#ff9900` "Start Free Trial" is the page's only filled button and is **522 px (390) /
   442 px (1440)** from where `listing-mid` sits, so there is no ad-adjacency problem. The gap is
   purely disclosure (issue 3 covers it).

6. **Interview disclosure rows are still `div[role="button"]`, not real `<button>`s.** — COMPONENT.
   Measured: `tag=DIV, role=button, tabindex=0, aria-expanded=false`, transparent background,
   342 × 158 at 390 / 544 × 127 at 1440; delegated `click` + Enter/Space. The builder's reason is
   sound and evidence-backed (`integrity.js` line 41 strips `button` from both the text and heading
   snapshots, and the question text plus "Click to reveal answer" are in the frozen baseline text —
   wrapping them in a `<button>` is a content diff). Keyboard-operable, named, axe 0. I score this
   **acceptable-with-a-reason, not a defect**: a real `<button>` would be better for AT and for
   AdSense's clickable-element heuristics, but it cannot be had without a content approval.
   **If the panel wants it:** an `{"page":"interview-prep.html","field":"text"}` approval, then the
   `<div role=button>` becomes a `<button type="button">`.
   SEO is unaffected either way: **17 of 17 answers are `display: none` and fully present in the DOM**
   (597–678 chars each), exactly as at baseline.

7. **interview-prep's category rhythm is the thinnest on the site.** — COMPONENT. Category-to-category
   gaps at 390: 24 / 24 / 24 / **0** / 24 px (the 4th→5th seam is zero). Auto ads has essentially no
   room between categories; once issue 1 is fixed the explicit well brings its own 48 px, so this is
   informational rather than blocking.

**resources.html images — clean, and the biggest real-money win in the wave:**

| check | result |
|---|---|
| explicit `width`/`height` | **8 / 8**, and every pair matches `naturalWidth × naturalHeight` exactly (286×360, 292×360, 274×360, 240×360, 287×360, 274×360, 271×360, 240×360) → the aspect-ratio box is exact, not approximate |
| `loading` | first cover **eager** (`loading` absent) + `fetchpriority="high"`; the other seven `lazy` — correct, only the first is in the 412 px viewport |
| `object-fit` | `contain` on all eight, so a wrong-ratio replacement cannot crop |
| total bytes | **143,268 B** (was 357,862) — −60 %, under the 150 KB target |
| lab CLS | 0 at 390, 0.0008 at 768/1440 (budget 0.05) |
| page weight | 195 KB, vs 361 KB in `wave1-r1` and 339 KB at baseline |

That kills the pre-launch CLS risk on the one page that had image-shaped CLS, which matters more to
real viewable-impression revenue than any placement decision in this report.

Nits:
- Card CTAs are genuinely quiet everywhere: "View Guide" and "View on Amazon" are
  `background: rgba(0,0,0,0)` with a `1px solid #d8d2c6` hairline, 134 × 47 / 47 px tall. The only
  filled controls on the whole area are the Pluralsight CTA and tools.html's "Calculate Salary".
- `decoding` is absent on all eight covers; `decoding="async"` is a free ~0-byte hint.
- Covers are 2.3–2.8× the rendered CSS box (286 px intrinsic vs 125 px rendered at 390). Right for a
  3× phone, slightly generous at 1440 where they render 103 px wide. Not worth another re-encode.
- `images/books/sap-c02.jpg` is still a photo of *The Kubernetes Book* under an SAP-C02 `alt` (the
  builder flagged it in §6.4). Content bug, needs an `images` approval, not a code change.
- tools.html has no ad planned and the measurement shows why: a well placed in its container lands at
  **y = 283, above the fold**, right beside the calculator's form controls.

---

```
Area: static-pages   Round: 1   Critic: monetization & SEO   Score: 8.7/10   Verdict: PASS
```

Screenshots looked at:
- `harness/out/peek/ms2-404@390.png` — 404 page: paper ground, orange cloud mark, big quiet grey
  numeral, two-line h1, the joke restyled as a quiet note, one orange "Return to Home Region".
  No AdSense loader, no GA, nothing ad-shaped.
- `harness/out/peek/ms2-privacy-affiliate@390.png` — privacy.html's closing "Affiliate Disclosure"
  section: the full disclosure text intact inside the new quiet `--paper-2` note block with its left
  rule, directly above the footer.
- `harness/out/peek/ms2-contact@390.png` — contact form card: four labelled fields, one orange
  "Send Message" (292 × 47), nothing else competing.
- `harness/out/peek/ms2-project-bottom@390.png` — shared footer at 390 (same component on these
  pages): nothing fixed or sticky at the bottom.

Gate results: `console=0` · `axeSC=0` · `axeAll=0` · `perf=100` · `a11y=100` · `bp=100` ·
`seo=100` (about, contact) · `cls=0` (baseline had about 0.160 @768 and privacy 0.100 @768) ·
`lcp=1.5 s` · `hOverflow=0` · `integrity=PASS` · `weight=FAIL (wave-wide, not scored)`.

**No ads are planned here and none exist:** `ins.adsbygoogle` = 0 and `.ad-well` = 0 on all four
pages; 404.html carries neither the AdSense loader nor GA, exactly as at baseline.

**Gate text — the thing that most needed protecting — is intact, checked two ways:**

- `INTEGRITY: PASS` covers `text` for all four pages, so not a character moved. The builder's
  `strong { display: block }` on `.feature-list` really is gate-neutral (`innerText` inserts a
  newline, `norm()` collapses it).
- Independently, I read the rendered `.note` blocks back out of the live DOM. about.html has **4**:
  the AWS-disassociation notice, the trademark/educational-purpose notice, the accuracy notice, and
  the full affiliate disclosure ("…we may earn a small commission if you make a purchase through
  these links…"). privacy.html has **1**, the affiliate disclosure, verbatim.
- privacy.html's AdSense-relevant structure is complete and in order:
  `Third-Party Services → Google Analytics → Google AdSense → Cookies → Data Retention → Your Rights
  → Children's Privacy → Changes to This Policy → Contact Us → Affiliate Disclosure`,
  with 7 "cookies", 2 "Google AdSense", 2 "Google Analytics", 2 "opt out". Nothing an AdSense policy
  review needs was styled away.

**404.html:** `meta[robots] = noindex` — the **only** page on the site with it, unchanged from
baseline. Single orange CTA, 2,827 B, self-contained (no `styles.css` request).

**contact.html:** one filled control, `#ff9900` "Send Message" at 292 × 47 (390) / 208 × 47 (1440).
Since no unit is planned on contact.html there is no ad-adjacent-button problem by construction, and
the page should stay on the no-ads list — the whole page *is* a form, which is precisely the
situation AD_PLAN excludes tools.html for.

Ranked issues (worst first):

1. **404.html is never served in production, so this area's best work is invisible and the site emits
   soft-404s at scale.** — PAGE/config, **pre-existing, not caused by this area**. See the site-level
   block above: `responseOverrides["404"] = { rewrite: "/index.html", statusCode: 200 }`.
   The redesigned, `noindex`, 2.8 KB 404 page in `ms2-404@390.png` is unreachable; every unknown URL
   gets a 200 + the home page + the AdSense loader instead.
   **Fixed looks like:** `"404": { "rewrite": "/404.html", "statusCode": 404 }` and
   `navigationFallback.rewrite: "/404.html"` in `staticwebapp.config.json`. Not a gated file; no
   content approval needed. This is the single highest-value SEO fix available in the whole wave and
   it costs two JSON values.

2. **The affiliate disclosure lives here but the affiliate links live on resources.html.** — PAGE,
   cross-area (see listing-pages issue 3). about.html and privacy.html both carry the full
   disclosure; the page with 13 affiliate links carries none. Nothing for this area to change — noted
   so the two reports reconcile.

3. **404.html duplicates seven design tokens inline.** — COMPONENT, informational (the builder flags
   it in §6.4). The no-second-request rule is right for a 404, but the values will drift the first
   time `[design-system]` moves. Worth a one-line comment in the file naming the source of truth.

Nits:
- 404.html is still the only public page without a skip link (Wave 1 nit, unchanged, and it is
  `noindex` and — today — unserved).
- `role="status"` on `#formStatus` is attribute-only and gate-invisible; correct.
- The contact form's inline script and all field `name`s/`id`s/`required` attributes are untouched,
  so `/api/contact` is unaffected.
- about.html and privacy.html raw transfer measured **under** baseline in the `ms2-r1` snap;
  their gzip overage is entirely the shared `styles.css`.

---

## Summary

| Area | Score | Verdict | The one thing that decides it |
|---|---|---|---|
| article-template | **8.2** | FAIL | `.ad-well` renders 123 px at all three planned positions on all 11 project pages |
| code-and-diagrams | **8.8** | PASS | Nothing ad-shaped, nothing fixed at the bottom, no markup touched; only a 33 px Copy-button seam |
| listing-pages | **8.3** | FAIL | interview-prep's `listing-mid` collapses to 123 px; `home-mid` is full-bleed at 390 |
| static-pages | **8.7** | PASS | Gate text intact, 404 `noindex`, no ad surface; its 404 page is unserved for reasons outside the area |

**Cross-area, do these first (all cheap, all before Wave 3 writes the placement script):**

1. `staticwebapp.config.json`: stop returning 200 + index.html for unknown URLs. Two JSON values, no
   approval, kills a site-wide soft-404 and stops the AdSense loader running on infinite duplicates.
2. `.ad-well { width: 100% }`. One declaration; un-breaks four of the five AD_PLAN positions.
3. AD_PLAN corrections: `article-mid-1` anchors on the third `.guide-section` (not `#architecture`,
   which `project-infrastructure-as-code.html` does not have); `listing-mid` on interview-prep
   anchors after `.interview-grid`, not after the third category; `home-mid` goes **inside** a
   section's `.container`, not between sections.
4. Human/content: an affiliate disclosure on resources.html and `rel="sponsored"` on its 13 affiliate
   links — both need a `docs/APPROVALS.json` entry, both are launch-blockers for a monetised site.
5. HUMAN_TODO B1: record **top anchor OFF** (Wave 1: it would stack on the 56/64 px sticky header),
   **bottom anchor ON** (0 fixed/sticky-bottom elements measured on every page), **side rails OFF**
   (32 / 72 / 152 px of clearance to the sticky TOC rail at 1024 / 1280 / 1440), and add
   `.guide-overview` plus the `.code-block` seams to the excluded-areas list.

## Process flag — the tree moved during the round (again)

Every number and every screenshot in this report was taken against **`6bb6164` with a clean working
tree** (`git status` was clean when I started). While I was writing it up, the concurrent round-2
shell builder landed an uncommitted change touching **all 21 HTML pages, `styles.css`
(−296 lines net), `script.js` and `harness/apply-shell.js`** — e.g. `index.html` now moves
`.nav-toggle` before `.site-nav` and adds `tabindex="-1"` to `<main>`. My `integrity`, `weight`,
`snap --label ms2-r1` and `lh` runs all predate it, so they describe `6bb6164`, not the tree on disk
now. Same flag Wave 1 raised; it needs an integrator rule, not a critic.

I re-verified the one finding that would have been invalidated by that change:

```
RE-CHECK on the current working tree:
  @390  .ad-well width = 123px  (.project-guide display: flex)
  @1440 .ad-well width = 123px  (.project-guide display: grid)
```

The round-2 `[ad-presentation]` rewrite **did** land the Wave 1 fixes — `max-width` is now
`min(100%, 970px)` and the `:has(...unfilled) { display: none }` collapse rule is gone, both correct
— but it kept `margin: var(--sp-7) auto` and still declares **no `width`**, so article-template
issue 1 and listing-pages issue 1 are live on the in-flight tree too. Not re-scored, just confirmed
still open.

**What the wave got right and I want on the record:** every frozen artefact is provably frozen
(ads.txt, robots.txt, sitemap.xml, the CSP, the loader and GA lines on all 21 pages, zero manual
`<ins>`, no CMP); every SEO field on all 20 public pages is identical to baseline and the internal
link set has not moved; CLS is ~0 sitewide where the baseline had 0.254/0.160/0.141/0.100 shifts;
resources.html dropped 211 KB gzip and its covers now reserve exact space; and the orange
end-of-article button that Wave 1 ranked as its worst monetization problem is gone. The two failing
areas fail on placement mechanics that total about three lines of CSS and three lines of plan — not
on design.

# FINAL whole-site gate — monetization & SEO critic

```
Area: WHOLE SITE (final gate)   Round: final   Critic: monetization & SEO
Score: 8.8/10   Verdict: PASS
```

Date 2026-09-13 · branch `facelift` · HEAD `f22dfdf` · working tree clean before and after
(`git status` = clean; my probes live in the git-ignored `harness/out/`).

**No live ad was loaded at any point.** Every Playwright context in this report ran through
`harness/adblock.js`, which fulfils every non-localhost host 204 / empty-JS
(`harness/pages.js:BLOCKED_HOST_RE` covers googlesyndication, doubleclick, googleadservices,
googletagmanager, google-analytics, googletagservices, fundingchoices, adtrafficquality,
amazon-adsystem). Production was never opened. Nothing ad-like was clicked. Every "ad" in every
screenshot here is the repo's **own** `.ad-well` markup with a **local striped `<div>`** in the slot
— no `<ins>`, no network, nothing clickable. I wrote no site file and no `docs/` file except this one.

Probes (git-ignored): `harness/out/fin-crawl.js` → `fin-crawl.json`, `harness/out/fin-ads.js` →
`fin-ads.json`, `harness/out/fin-seams.js` → `fin-seams.json`, plus re-runs of the builder's
`harness/out/adwell-states.js` and the previous round's `harness/out/ms4-tamper-serve.js`.

---

## Screenshots looked at

- `harness/out/peek/fin-project-article-mid-1@1440.png` — `article-mid-1` on
  project-multi-account-landing-zone at 1440: the well's left hairline lands on **x=152**, flush with
  the diagram panel above and the `Step-by-Step Instructions` heading below; right edge **992**;
  "ADVERTISEMENT" centred over a 280 px striped reservation; 48 px of clear paper to the rail at 1040.
- `harness/out/peek/fin-project-article-mid-1@390.png` — same position at 390: 342 px on the 24 px
  gutter, hairline above, label, reservation, hairline, then the Step 1 numeral. Nothing tappable in frame.
- `harness/out/peek/fin-home-home-mid@1440.png` — `home-mid` inside the certification-path
  `.container`: the well runs **152 → 1122** while the four cert cards above run **152 → 1288**.
  Left register fixed (the previous round's 235 → 1205 is gone); the right hairline is 166 px short.
  Four orange underlined "Learn More" links sit 63 px above it.
- `harness/out/peek/fin-interview-listing-mid@1440.png` — `listing-mid` after the first
  `.interview-grid`: 970 px, 48 px clear above and below, between two ruled question columns.
- `harness/out/peek/fin-resources-listing-mid@1440.png` — `listing-mid` after `.books-grid`: 970 px,
  48 px clear; the nearest thing above is a bordered **"View on Amazon"** button, 73 px up.
- `harness/out/peek/fin-ms-pspromo-390.png` — resources.html at 390: the Pluralsight promo is a white
  card, **292 × 249 px** (≈ the 300×250 MPU), with a filled orange **"Start Free Trial"** button in the
  site's own CTA orange. It is the most ad-confusable publisher box on the site (issue 4).
- `harness/out/peek/fin-ms-eks-fold-390.png` — project-kubernetes-eks at 390, first screen:
  breadcrumb → level chip → h1 → dek → **chip row ending at y=429** → "Project Overview". That block
  seam is 415 px above the 844 px fold (issue 3).
- `harness/out/peek/pol-18-b-unfilled-after-seen-stays.png`,
  `pol-18-c-filled-stays.png`, `pol-18-d-nojs-never-collapses.png` — the three "stays" cases of the
  collapse proof, re-run by me: identical frames, 339 px reservation painted, label reading
  ADVERTISEMENT, well visible in all three.
- `harness/out/peek/pol-18-a-unfilled-neverseen-collapsed.png` — the collapse case. **Caveat, stated
  honestly:** this PNG frames the *top* of the showcase page, so the collapsed well is not in shot
  (it lived at docY 1047 and is gone). The collapse itself is carried by the state numbers below,
  not by this image. See nit 1.

---

## Gate results, run by me on this tree

```
node harness/integrity.js compare --base baseline-2026-09-13
   INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)

node harness/weight.js
   styles.css: raw 40377 (ref 35518), gzip 8564 (ref 6078)
   WEIGHT: FAIL (19 pages over their gzip baseline)   [recorded, not scored — HUMAN_TODO D1]
   project pages +3,547 … +3,727 gzip · listings +1,979 … +2,364 · static +2,408 … +2,802 ·
   404.html +237 · only OK: resources.html −212,196
```

`harness/out/polish-r1/summary.json` (63 rows, 60 public), re-aggregated by me:

```
consoleErrors 0 · pageErrors 0 · failedRequests 0 · axeSC 0 · axeAll 0 · hOverflow 0/60
max CLS on any public row = 0      (was 0.0013 on the 11 project pages @1440 last round)
max LCP (lab, snap) = 132 ms · every row status 200
admin.html keeps its 3 known local /.auth/me errors (auth-gated, excluded)
```

`harness/out/polish-r1/lighthouse/summary.json`:

| page | perf | a11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| index | 100 | 100 | 100 | **92** (`link-text`) | 1.65 | 0 | 0 |
| projects | 100 | 100 | 100 | 100 | 1.65 | 0 | 0 |
| tools | 100 | 100 | 100 | **92** (`link-text`) | 1.65 | 0 | 0 |
| interview-prep | 100 | 100 | 100 | 100 | 1.53 | 0 | 0 |
| about | 100 | 100 | 100 | 100 | 1.50 | 0 | 0 |
| project-multi-account-landing-zone | 100 | 100 | 100 | 100 | 1.65 | 0 | 0 |
| resources | **99** | 100 | 100 | 100 | **2.10** | 0 | 0 |

Summary line: `console=0 axeSC=0 axeAll=0 perf=99–100 seo=100 (92 index/tools, frozen copy)
cls=0 lcp=1.50–2.10 integrity=PASS weight=FAIL(recorded)`.

---

## (1) FULL-URL CRAWL — the final gate

**Corpus.** Every `<loc>` in `sitemap.xml` (19 URLs: `/` plus 18 `*.html`) **plus** `404.html` and
`admin.html` = **21 URLs**, which is the whole HTML surface of the repo. Each was fetched from
`http://127.0.0.1:4173` (verified byte-for-byte the frozen tree: `md5sum` of the served
`index.html` and `styles.css` equals the on-disk files).

**Method.** `harness/out/fin-crawl.js`. The `f1ec399` tree is served from a second throwaway server
on :4199 that streams `git show f1ec399:<path>` and writes nothing. Both sides are rendered in
Playwright at 1440×900 with the ad blocker installed and extracted by **the same function**, so this
is live-DOM vs live-DOM, not source-regex vs source-regex. JSON-LD is parsed, object keys sorted
recursively, re-stringified, then compared. Internal links are fragment-stripped and set-compared.
`<pre>` is compared as `textContent`, which is exactly "after stripping spans". The AdSense/GA lines
are compared as **raw source lines** from the two files.

**Result: 21/21 URLs status 200; every SEO field identical to `f1ec399` on every URL.** The only
difference found anywhere in the corpus is leading indentation on the tracking lines (below).

| URL (served path) | status | title | meta desc | canonical | robots | JSON-LD | one h1 | internal set | external | img src\|alt | `<pre>` | loader+GA |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` (index.html) | 200 | = | = | = | = | = (4) | = 1 | = (6) | = (22) | = (0) | = (0) | = after trim |
| `/interview-prep.html` | 200 | = | = | = | = | = (2) | = 1 | = (7) | = (3) | = (0) | = (0) | = after trim |
| `/projects.html` | 200 | = | = | = | = | = (2) | = 1 | = (18) | = (3) | = (0) | = (0) | = after trim |
| `/resources.html` | 200 | = | = | = | = | = (2) | = 1 | = (7) | = (16) | = (8) | = (0) | = after trim |
| `/tools.html` | 200 | = | = | = | = | = (2) | = 1 | = (7) | = (7) | = (0) | = (0) | = after trim |
| `/about.html` | 200 | = | = | = | = | = (2) | = 1 | = (8) | = (0) | = (0) | = (0) | = after trim |
| `/privacy.html` | 200 | = | = | = | = | = (2) | = 1 | = (8) | = (2) | = (0) | = (0) | = after trim |
| `/contact.html` | 200 | = | = | = | = | = (0) | = 1 | = (7) | = (3) | = (0) | = (0) | = after trim |
| `/project-static-website.html` | 200 | = | = | = | = | = (0) | = 1 | = (8) | = (3) | = (0) | = (3) | = after trim |
| `/project-serverless-contact-form.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (3) | = after trim |
| `/project-ec2-web-server.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (3) | = after trim |
| `/project-three-tier-web-app.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (3) | = after trim |
| `/project-cicd-pipeline.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (4) | = after trim |
| `/project-serverless-rest-api.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (4) | = after trim |
| `/project-infrastructure-as-code.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (4) | = after trim |
| `/project-multi-region-active-active.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (4) | = after trim |
| `/project-kubernetes-eks.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (5) | = after trim |
| `/project-realtime-data-pipeline.html` | 200 | = | = | = | = | = (0) | = 1 | = (9) | = (3) | = (0) | = (5) | = after trim |
| `/project-multi-account-landing-zone.html` | 200 | = | = | = | = | = (0) | = 1 | = (8) | = (3) | = (0) | = (5) | = after trim |
| `/404.html` (the file) | **200** | = | = | = (none) | = `noindex` | = (0) | = 1 | = (1) | = (0) | = (0) | = (0) | = (none, 0 lines) |
| `/admin.html` | 200 | = | = | = (none) | = (none) | = (0) | = 1 | = (1) | = (0) | = (0) | = (0) | = (none, 0 lines) |

`=` means byte-identical to `git show f1ec399:<page>` after the normalisation named in the column
header; the number in brackets is the count on that page. Totals: **43 `<pre>` blocks across the 11
project pages, all identical** after span-stripping; **0 `ins.adsbygoogle`** and **0 `.ad-well`** in
the live DOM of all 21 URLs; **one `<h1>` on every URL**, text identical on every URL.

**Missing-route behaviour (local).** `GET /this-route-does-not-exist-xyz` → **HTTP 404**, body
`404.html` (`<h1>This resource has been terminated</h1>`). The file itself at `/404.html` returns
**200**, which is what the brief expects. Production does *not* do this — see risk R1.

**The one diff, stated precisely.** The AdSense loader and GA block are **not byte-identical to
`f1ec399`: their leading indentation changed from 4 spaces to 2** (`apply-shell.js` re-indented the
`<head>`). After `String.trim()` on each line the **ten** tracking lines on the 19 loader pages are
**identical in content, attribute order and line order**:

```
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VBQ33BLD4E"></script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VBQ33BLD4E');
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6676281664229738" crossorigin="anonymous"></script>
```

The previous round reported these "identical on all 21 pages, 0 diffs"; that was true of the trimmed
comparison it ran, and I am recording the untrimmed truth so nobody is surprised by a whitespace
diff later. Functionally frozen: same `ca-pub-6676281664229738`, same `G-VBQ33BLD4E`, same
`crossorigin`, loader present on the same **19** pages and absent from 404.html and admin.html,
exactly as at baseline. `consentMode` false on all 21 (no CMP introduced, none removed).

**Other crawl facts worth having on the record**

- Canonicals are self-referential and match the sitemap `<loc>` **exactly** on all 19 sitemap URLs
  (`https://www.awscloudarchitect.com/…`, www, no trailing-slash mismatch); `og:url` agrees with the
  canonical on all 19. 404.html and admin.html carry no canonical — correct for a `noindex` page and
  a `Disallow`ed one.
- `noindex` appears on **404.html only**. No leak. admin.html has *no* robots meta but is
  `Disallow: /admin.html` in robots.txt, `allowedRoles: ["admin"]` in `staticwebapp.config.json`,
  excluded from `navigationFallback`, and linked from **no** public page. Unchanged from `f1ec399`.
- JSON-LD type sets: index `WebSite + Organization + BreadcrumbList + FAQPage`; projects/resources
  `CollectionPage + BreadcrumbList`; tools `WebApplication + BreadcrumbList`; interview-prep
  `FAQPage + BreadcrumbList`; about `AboutPage + BreadcrumbList`; privacy `WebPage + BreadcrumbList`;
  contact, 404, admin and **all 11 project pages: none**. Every block parses. Nothing added, nothing
  lost (the article rail and the step anchors carry 0 JSON-LD).
- `ads.txt`, `robots.txt`, `sitemap.xml` are **byte-identical** to `f1ec399` (`cmp` on the git blob).
- `staticwebapp.config.json`: `globalHeaders` (the whole CSP), `navigationFallback`,
  `responseOverrides`, `mimeTypes` **deep-identical** to `f1ec399`. `routes` differs only by **seven
  added `statusCode: 404` blocks** for `/README.md`, `/ARCHITECTURE.md`, `/AB-TESTING-*`,
  `/prompt.txt`, `/_showcase/*`, `/docs/*`, `/harness/*` — additive, and the three original rules
  (`/index.html` rewrite, `/admin.html` role, `/api/stats` role) survive unchanged and in order.
- `_showcase/index.html` is `noindex`, absent from `sitemap.xml`, and 404'd by route in production.

---

## (2) Ad readiness

### 2a. The four collapse states — re-run by me

`node harness/out/adwell-states.js` on the frozen tree, 390×844, `_showcase/index.html`, well at
docY 1047 (i.e. genuinely below an 844 px fold). My run reproduces the builder's table exactly:

| case | `data-ad-status` | ever seen | `is-unfilled` | computed `display` | height |
|---|---|---|---|---|---|
| **A** unfilled, never in view | `unfilled` | false | **true** | **none** | **0** |
| **B** scrolled into view, then unfilled | `unfilled` | **true** | false | block | 339 |
| **C** filled, then status removed | `filled` → absent | false | false | block | **339 both times** |
| **D** `script.js` never runs (`html.no-js`) | `unfilled` | n/a | false | block | 339 |
| **D2** JS genuinely disabled | n/a | n/a | n/a | painted | 342 × 339.4 at x=24, y=1047 |

Script verdict line: `PASS - collapse only on unfilled AND never seen`. **All four states pass.**

The mechanism is right, not just the outcome: `script.js:89–95` marks a well `seen` on first
intersection (then unobserves), and a per-well `MutationObserver` adds `.is-unfilled` only when
`data-adStatus === 'unfilled'` **and** `!w.seen`. "No status yet" is never a signal (case C), which
is the correct behaviour under a CMP that delays fill. CSS can hide a well only via
`styles.css:489 .js .ad-well.is-unfilled { display: none }` — scoped under `.js`, so case D can never
collapse; `:has(` count in the sheet is **0**. A well the reader has seen or scrolled past is never
collapsed, which is the policy-relevant half.

### 2b. Well geometry and the 152 register

`harness/out/fin-ads.js`, injecting the repo's own `.ad-well` (label + local striped div, **no
`<ins>`**) at the AD_PLAN anchors. `--ad-h: 280px` reserves **339.4 px** end-to-end everywhere
(12 pad + 21 label + 12 gap + 280 slot + 12 pad + 2 hairlines) — Wave 3's CLS budget must use 339.

| position | page | 390 | 1024 | 1280 | **1440 (left → right)** | left-aligned to the column? |
|---|---|---|---|---|---|---|
| `article-mid-1` | project (11) | 342 | 664 | 840 | **152 → 992** | **yes** (`.guide-section` is 152 → 992) |
| `article-mid-2` | project (11) | 342 | 664 | 840 | **152 → 992** | **yes** |
| `article-end` | project (11) | 342 | 664 | 840 | **152 → 992** | **yes** |
| `listing-mid` | projects | 342 | 960 | 970 | **152 → 1122** | left yes; right 166 px short of 1288 |
| `listing-mid` | interview-prep | 342 | 960 | 970 | **152 → 1122** | same |
| `listing-mid` | resources | 342 | 960 | 970 | **152 → 1122** | same |
| `home-mid` | index | 342 | 960 | 970 | **152 → 1122** | same |

`margin-inline` computes `0px / 0px` at every position and width; `grid-column: 1` on every well
inside `.project-guide`; `.ad-well-label` computes `display: block`, centred, **12 px** above the
slot; page `scrollWidth − clientWidth = 0` at every measurement. **`aboveFold = false` at every
position and every width.** The previous round's issue #2/#3 ("970 centred at 235 → 1205 on a page
that runs 152 → 1288") is **fixed on the left edge** — every well now starts on the page's single
152 register — and survives only as a ragged right hairline (nit 2).

### 2c. Clearances at the five AD_PLAN positions

| position | clear above / below | nearest tappable above | nearest tappable below |
|---|---|---|---|
| `article-mid-1` | **80 / 48** | 821 px (390: 1429) | **127 px** — the Step 1 numeral anchor |
| `article-mid-2` | **80 / 48** | 641 px (390: 808) | **191 px** — a code Copy button |
| `article-end` | **80 / 72** | 1400 px (390: 1511) | **97 px** — a quiet `guide-nav-link` |
| `listing-mid` projects | **48 / 36** | 182 px | 617 px |
| `listing-mid` interview-prep | **48 / 48** | **66 px** — `button.question-toggle` | **84 px** — `button.question-toggle` |
| `listing-mid` resources | **48 / —** | **73 px** — a "View on Amazon" affiliate button | 470 px |
| `home-mid` index | **48 / —** | **63 px** — an orange underlined "Learn More" | 333 px |

Every position clears 36 px or more of paper and keeps ≥ 63 px from the nearest tap target; nothing
is within the 48 px comfort line. The three tightest neighbours are all *publisher* affordances that
read commercial — `question-toggle` (invisible full-row button), "View on Amazon" (outlined button),
"Learn More" (orange underlined) — which is why the excluded-areas list in issue 2 matters.

### 2d. Nothing fixed at the bottom; side rails must stay off

Swept **all 20 public pages × 390/1024/1280/1440 (80 runs), each scrolled to the document bottom**
before measuring:

- **`position: fixed` occurrences: NONE**, on any page, at any width.
- **Bottom-anchored (`top: auto` with `bottom` set): NONE.** A bottom anchor unit has clear air.
- The only sticky elements site-wide are `header.site-header` (`top: 0`, `z-index: 100`),
  `aside.guide-aside` (`top: 88px`, `z-index: auto`, ≥ 64em only) and the `.code-header`s
  (`top: 56px` at 390 / `64px` at desktop, `z-index: 1`). Nothing Google injects sits below z 100.
- **Side rails: clearance from the sticky "On this page" rail's right edge to the viewport edge is
  32 px @1024 · 72 px @1280 · 152 px @1440** (rail 248 px wide, left gutter mirrors it). A Google
  side rail wants ~160 px per side. **Side rails must stay OFF.** This is a hard constraint and it is
  unchanged from Wave 1 and Wave 2. Recorded in HUMAN_TODO B4 ("side rails off"); good.

### 2e. Frozen artefacts and inventory

- `ins.adsbygoogle` in the repo HTML: **0**. In the live DOM of all 21 URLs: **0**. `.ad-well`
  instances shipped: **0** (Wave 3 scaffolding, as planned). `_showcase` carries an inert
  `ins.adsbygoogle-demo` with no client and no slot — the loader can never pick it up, and it is
  404'd in production.
- `ads.txt` / `robots.txt` / `sitemap.xml` / the CSP: **byte-identical**, proven above.
- **The gate now bites where it did not.** I re-ran the previous round's two proven holes through a
  real gated tamper (`harness/out/ms4-tamper-serve.js`, response-only injection, **no site file
  written**, `git status` clean before and after, injected `<ins>` inert):

  ```
  CASE=OFF  INTEGRITY: PASS                                   (control)
  CASE=B    NO_AD_ABOVE_FOLD @390 + @1440   (kind:"well", hasIns:true, top 168)
            AD_UNIT_WITHOUT_SLOT_ID @390 + @1440
            AD_WELL_WITHOUT_POSITION @390 + @1440             <-- WAS ABSENT last round
            AD_COUNT_CHANGED_WITHOUT_APPROVAL
            INTEGRITY: FAIL (0 content, 7 ad/tracking, 0 rejected approvals)
  CASE=C    NO_AD_ABOVE_FOLD @390 (well top 802, vh 844) + @1440 (well top 858, vh 900)
            AD_COUNT_CHANGED_WITHOUT_APPROVAL                 <-- fold rule WAS SILENT last round
            INTEGRITY: FAIL (0 content, 3 ad/tracking, 0 rejected approvals)
  ```

  `harness/integrity.js` now emits a record for **every** `.ad-well` measured at the **well's own
  top** (where the label is), plus one per `<ins>` outside a well. Both of my predecessor's
  Wave-3 blockers (#1 in their list) are **closed**, and I proved it on a real gate run rather than
  by reading the source. 0 content diffs in every tamper case, confirming a well stays invisible to
  the text/heading snapshot.
- **`harness/apply-ads.js` is fixed too, and I dry-ran the shipped matcher read-only** (extracted
  `insertAfterNthSection` from the shipped file and ran it against the real page bytes; nothing was
  written). On **11/11** project pages it finds 6 `.guide-section`s and lands:
  `article-mid-1` after **"Architecture"**, before "Step-by-Step Instructions";
  `article-mid-2` after **"Tips"**, before "Code Examples";
  `article-end` after **"What You'll Learn"**, end of guide.
  On `project-infrastructure-as-code.html` `article-mid-1` correctly lands after **"Choose Your
  Tool"** (that page's section #2) — the missing-`#architecture` problem is structurally gone. The
  depth-counting matcher replaced the broken 6-space-indent regex, and the ordinals are 2/4/6.
  `node harness/apply-ads.js --check` → `would place 0 units; skipped 33 (no slot id in
  docs/AD_UNITS.json)` — inert until HUMAN_TODO B4, as intended.

---

## Ranked issues (worst first)

**1. `docs/AD_PLAN.md` — the contract Wave 3 will implement — is wrong in four places, and one of
them names a selector that does not exist.** **PLAN (docs only), Wave 3 blocker, cheap.**
The code was fixed and the plan was not, so the two now contradict each other:

| AD_PLAN says | The tree says |
|---|---|
| line 13: `article-end` goes "after the *Next Steps*" section | **No project page has a "Next Steps" section.** The last of six is "What You'll Learn". |
| line 21: anchor on the "**1st/3rd/5th** `.guide-section` boundaries" | `apply-ads.js` correctly uses **2/4/6**, which is what I measured landing after Architecture / Tips / What You'll Learn. |
| line 14: `listing-mid` on resources "after book grid" | The class is **`books-grid`**, not `book-grid`. Any implementer (or probe) copying the plan's wording gets `anchor not found` — mine did, on the first run, at all four widths. |
| line 26: the `.ad-well` `width: 100%` fix is "**NOT fixed in Wave 1 r2** … Owned by Wave 3" | It landed in `93426da`; I measure 342 / 664 / 840 / 970 and `margin-inline: 0`. |

**Fixed looks like:** four one-line edits to `docs/AD_PLAN.md` — ordinals **#2 / #4 / #6**, delete
"after Next Steps", `.books-grid`, and mark the width/left-align items DONE with the measurements in
§2b. No code changes. Nothing else in this report is blocked on it, but the next builder will read
this file and not this one.

**2. Two of the five planned revenue positions have no placement path, and the Auto-ads
excluded-areas list is still recorded nowhere.** **COMPONENT (`harness/apply-ads.js`) + process.**
`apply-ads.js`'s `PLAN` object contains **only** `article-mid-1/2` and `article-end`, all gated on
`/^project-/`. `listing-mid` and `home-mid` — the two positions that can actually reach 970 px, on
index / projects / resources / interview-prep — cannot be placed by the tool at all. HUMAN_TODO B4
asks the owner to create **five** unit ids; two of them would have nowhere to go.
Separately, the previous round's recommendation #4 asked for `.guide-aside`, `.guide-overview`,
`.code-block`/`.code-examples` and `.interview-grid` on the AdSense excluded-areas list. I grepped
`docs/HUMAN_TODO.md`, `docs/AD_PLAN.md` and `docs/IDEAS.md`: the word "excluded" appears only in
B1's generic "and any excluded pages/areas" prompt and in AD_PLAN's note about the `data-ui` label.
**The list itself is not written down anywhere.** B4 does correctly record anchor on / vignette off /
side rails off, so half the recommendation landed.
**Fixed looks like:** add `listing-mid` (`.books-grid`, `.interview-grid`, projects' level group) and
`home-mid` (inside the certification-path `.container`) to `apply-ads.js`'s `PLAN` with DOM
anchoring, and paste the four-selector excluded-areas list into HUMAN_TODO B1. Neither is mine to fix.

**3. The rail/chip-row seam is above the fold at *every* width now, including 390 — and it got worse
this round.** **COMPONENT (`[article-template]`), Auto-ads exposure, needs an excluded-areas entry,
not markup.** 11 project pages. `harness/out/fin-seams.js`, `fin-ms-eks-fold-390.png`.

| seam (end of block, start of next) | 390 (vh 844) | 1024 / 1440 (vh 900) | above fold? |
|---|---|---|---|
| after `aside.guide-aside` (the chip row) | **429** (eks) · **498** (landing-zone) | **637** | **yes at every width** |
| after `dl.guide-meta` | 875 / 861 | **703** | mobile no · desktop **yes** |
| after `.guide-overview` | 875 / 861 | **703** | mobile no · desktop **yes** |
| after `.guide-section` #1 | 1253 | 951 | no |

Last round the rail seam measured 564 at 390 and was described as mobile-safe. This round's tighter
header/chip rhythm pulled it to **429–498**, so the most attractive shape Auto ads looks for — the
end of a short block, immediately before the article body — is now above the fold on a phone as well
as on desktop, on the 11 highest-intent pages. Nothing here is a defect in the design; it is an
*unfenced* seam. **Fixed looks like:** issue 2's excluded-areas entry plus shipping `article-mid-1`
explicitly, so Auto ads has no reason to hunt that high. Zero bytes.

**4. resources.html carries 13 affiliate links, an ad-shaped affiliate promo, no disclosure on the
page, and no `rel="sponsored"` anywhere on the site.** **PAGE, human-blocked (HUMAN_TODO A6 1–2),
pre-existing, NOT re-scored — but it is the largest commercial risk on the site after R1.**
Re-verified on this tree: 8 Amazon `?tag=dreamscribe09-20` links + 5 Pluralsight links, **all
`rel="noopener"` only**. `rel="sponsored"` and `rel="nofollow"` appear **0 times in the whole repo**
(the one "sponsored" hit is prose in about.html's *"not … sponsored by Amazon"* note). The words
affiliate / commission / disclosure appear in resources.html exactly **once**, in the footer, and it
is the *disclaimer* "Not affiliated with Amazon Web Services" — the opposite meaning. about.html has
4/1/1 and privacy.html 2/1/1, but neither is the page a reader is on when they click.
New this round, and the reason I am re-raising it rather than just pointing at A6: the Pluralsight
promo at 390 measures **292 × 249 px — within 12 px of the 300 × 250 MPU** — is clickable, and its
CTA "Start Free Trial" is a filled button in the site's own `--aws-orange`
(`fin-ms-pspromo-390.png`). It is the only box on the site that matches a standard creative
footprint *and* is commercial *and* is undisclosed. Put an AdSense unit 48 px from it and a reader
genuinely cannot tell which is the ad. **Fixed looks like:** the owner's call on A6 — a visible
disclosure line above the book grid and `rel="sponsored noopener"` on all 13 links. Content-approval
work, correctly on the list.

**5. `WEIGHT: FAIL (19 pages)` and resources.html LCP 2.10 s.** **Recorded sign-off items D1 / D2,
not scored.** The gzip overage is +237 … +3,727 B per page against the `f1ec399` reference (project
pages worst, which is where three of the five positions live); the polish round made every page
701–726 B *lighter* than the pre-polish tree, so the direction is right and the baseline is simply
still lower. resources.html is the one page that misses a budget (2.10 s vs 1.8 s) and it is the page
carrying all 13 affiliate links — i.e. the page where a slow first paint costs the most real money.
Both are documented with experiment evidence; neither is a builder defect.

---

## Nits

1. **The item-18 proof's own screenshot does not show what it claims.**
   `pol-18-a-unfilled-neverseen-collapsed.png` is a 390-wide *viewport* capture of the top of the
   showcase page; the collapsed well was at docY 1047 and is simply not in frame, so the image is
   indistinguishable from "a page with no well at all". The collapse is fully proven by the state
   JSON (`isUnfilled: true`, `display: none`, `height: 0`) which I reproduced, and the three "stays"
   cases *are* visible in their PNGs. A `fullPage: true` on case A would have closed this properly.
   Recorded, not scored against the behaviour, which is correct.
2. **The 970 px wells left-align at 152 but end at 1122 while the page runs to 1288.** Half of the
   previous round's issue #2 — the left register (the part that broke the wave's single edge) is
   fixed; the two hairlines are now 166 px short on the right at 1440
   (`fin-home-home-mid@1440.png`). Deliberate (970 is the widest billboard) and much less visible
   than a centred inset, but it is still the only block on those pages with its own right edge.
3. **"ADVERTISEMENT" is centred while the whole site is left-aligned.** Visible in every well shot.
   It is legible, above the slot and unambiguous, which is what policy needs; it just is not in the
   site's voice. Left-aligning it would also put the label on the 152 register.
4. **The CSP has never been tested against real fill and may be narrower than Auto ads needs.**
   Frozen and identical to `f1ec399`, so not a regression and not scored. But `script-src` /
   `connect-src` / `frame-src` list pagead2, googletagservices, googletagmanager, fundingchoices,
   doubleclick and tpc only — there is no entry for `*.adtrafficquality.google`, which current
   AdSense creatives contact. I cannot test this (the harness blocks every ad host by design) and I
   am not going to guess at a number; it belongs on the launch-day checklist as "open the console on
   one page of each type after Auto ads goes live and look for CSP violations".
5. **The 11 project pages show a visible breadcrumb trail and carry zero JSON-LD**, including no
   `BreadcrumbList` — unchanged from baseline, needs an `ld` approval, and it is the cheapest
   rich-result win left on the highest-intent pages.
6. Ad-shaped publisher boxes at 390 (±12 px of a standard creative): all transparent, unbordered and
   non-commercial except the Pluralsight promo in issue 4 — `div.guide-step` 342×277 ≈ 336×280 is now
   `clickable` because of the new step-number anchors, and `ul.question-list` 342×287 ≈ 336×280 is
   clickable via the full-row toggles. Both are transparent with no fill and no border, so neither
   reads as a creative. At 1024/1280/1440: **zero matches** on every page.
7. `images/books/sap-c02.jpg` is still a photo of *The Kubernetes Book* under an SAP-C02 alt
   (A6 item 3), and the eight covers still lack `decoding="async"`. Recorded, not re-scored.
8. tools.html and contact.html are correctly on the no-ads list — both pages are form controls end
   to end, and I measured **zero** ad-shaped boxes on tools at either width.

---

## (3) Whole-site score and remaining risks

```
WHOLE-SITE SCORE: 8.8 / 10   (8.5 passes)   Verdict: PASS
```

**Why 8.8.** The mandate is "no SEO regression, frozen commercial artefacts, ad wells that are
visibly ads and never hurt the reader", and on the evidence the facelift delivers all three: a
21-of-21 full-URL crawl in which **every** title, description, canonical, robots directive, JSON-LD
block, h1, internal link set, external link set, image `src|alt` and `<pre>` body is identical to
`f1ec399`, verified live-DOM against live-DOM; ads.txt / robots.txt / sitemap.xml / CSP byte-frozen;
zero `<ins>` and zero wells shipped; CLS now **0** on all 60 public rows, so the pre-ad floor is
genuinely zero before Auto ads adds its own shifts; collapse logic that refuses to hide anything the
reader has seen, proven in four states plus JS-off; and — the thing that moves this above the
previous 8.6–8.9 band — the two gate holes my predecessor demonstrated are now **closed on a real
gate run**, and the `apply-ads.js` anchor bug that would have silently skipped 33 of 33 article
placements is fixed and dry-run clean on 11/11 pages.

**Why not higher.** `docs/AD_PLAN.md`, which is the contract the next wave implements, is wrong in
four places including a selector that does not exist; two of its five revenue positions have no
placement path in the tooling at all; the excluded-areas list that Wave 2 asked for is still written
down nowhere; and the one Auto-ads exposure that needed that list is measurably *worse* at 390 than
it was last round. None of that is shipped-code risk today — every one of them bites the moment
`docs/AD_UNITS.json` is filled.

### Remaining risks

| # | Risk | Pre-existing? | Owner |
|---|---|---|---|
| **R1** | **Soft-404 at scale.** `responseOverrides["404"] = { rewrite: "/index.html", statusCode: 200 }` plus `navigationFallback` mean every unknown production URL returns **HTTP 200 with a full copy of the home page carrying the AdSense loader**. Locally the harness returns a real 404 and the rebuilt 404.html; in production that page is **unreachable**. Still the single highest-value SEO fix available, and it costs two JSON values in a file the gate does not cover. | **Yes — pre-existing, byte-identical to `f1ec399`, HUMAN_TODO A2.** Not caused or worsened by the facelift. | Human |
| **R2** | **No affiliate disclosure on resources.html and no `rel="sponsored"` anywhere** — 13 monetised links, `rel="noopener"` only, disclosure lives on about/privacy instead of the page the reader is on; plus an undisclosed 292×249 affiliate promo in MPU shape. FTC and Google link-spam exposure. | **Yes — pre-existing, HUMAN_TODO A6 1–2.** The MPU-shaped promo measurement is new evidence, the promo itself is not. | Human |
| **R3** | **No CMP, no Consent Mode v2.** `consentMode` false on all 21 pages; no Funding Choices / `googlefc` script; the CSP already allow-lists `fundingchoicesmessages.google.com`, which suggests one was intended. EEA/UK/CH traffic requires a certified CMP for personalised ads. | **Yes — pre-existing, HUMAN_TODO B2.** Nothing added or removed this wave. | Human |
| **R4** | **AD_PLAN doc drift + two unimplementable positions + no excluded-areas list** (issues 1 and 2). Bites the moment unit ids land. | **No — introduced by the wave** (the code moved, the plan did not). | Agent, before Wave 3 |
| **R5** | **CSP untested against live fill** (nit 4) — `*.adtrafficquality.google` is not allow-listed. Cannot be tested here by design. | **Yes — frozen from `f1ec399`.** | Human, launch day |
| **R6** | `WEIGHT: FAIL (19 pages)` (D1) and resources.html LCP **2.10 s** vs a 1.8 s budget (D2), on the page carrying every affiliate link. | **No — wave-introduced, both recorded with evidence and signed off as exceptions.** | Human |
| **R7** | index.html / tools.html Lighthouse **SEO 92** — the frozen "Learn More" link text; and 11 project pages with a visible breadcrumb and **zero** JSON-LD. | **Yes — pre-existing, A5 and an unrequested `ld` approval.** | Human |

**On the record for the final gate:** 21 URLs crawled, 21 status 200, **zero SEO regressions of any
kind**; 43 `<pre>` blocks byte-identical after a build-time tokenizer rewrote 1,132 spans inside
them; the AdSense loader and GA snippet functionally frozen on the same 19 pages as baseline and
absent from the same two; `noindex` on 404.html alone; ads.txt, robots.txt, sitemap.xml and the
entire CSP byte-identical to `f1ec399`; zero `ins.adsbygoogle` and zero `.ad-well` anywhere in the
shipped tree; nothing `position: fixed` and nothing bottom-anchored on any of 20 pages at any of four
widths, so a bottom anchor unit has clear air; 32 / 72 / 152 px of clearance to the sticky rail, so
side rails must stay off; and a `.ad-well` that now starts on the page's single 152 px register,
reserves 339 px before fill, says "advertisement" where a reader will see it, and cannot collapse
anything the reader has already seen.

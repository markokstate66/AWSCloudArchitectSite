# WORKLOG — awscloudarchitect.com facelift and monetization (2026-09-12 → 2026-09-13)

Chronological record of what was done, by whom (agent roles vs the owner), with the evidence
that backs each claim. Commits are on `main` (the working branch `facelift` was fast-forwarded
into it at launch). Detailed per-round reports live in `docs/rounds/` (35 files); the
current state is in `docs/STATUS.json`; owner actions in `docs/HUMAN_TODO.md`.

Starting point: commit `f1ec399` (Jan 2026), identical to the live site. End state: `170f120`,
129 files changed (+27,681 / −10,067 lines), 56 commits, all deployed.

---

## 1. Phase 0 — checks before any visual work (Sat 12 Sep, evening)

**Backend.** Every live `/api/*` route probed: no 500s (pool/products 200, contact 400 on empty
body, tracking 400, admin routes 401/302). The contact form's front end surfaces server errors
rather than reporting false success. `api/package.json` `main` is a valid v4 glob — the
sister-site failure mode did not apply.

**Deploy race (found).** Two workflow files fired on every push, one with `api_location: "api"`,
one without, using different secrets. GitHub run history showed both succeeding; the API was live
only because the API workflow happened to finish last. Fix: the no-API workflow deleted, its
html-validate job folded into the remaining one (`c3d0de6`). Later confirmed with the Azure CLI
that only one Static Web App exists for the site, so this really was last-write-wins (`b2b4df0`).

**Content truth.** A research agent checked 78 factual claims against AWS/vendor sources: 44 OK,
13 WRONG, 18 STALE, 3 UNVERIFIED; 52 external links checked (1 hard 404, 3 brand redirects).
Nothing changed on any page at this stage; every proposed fix was written as an exact
substitution in `docs/CONTENT_AUDIT.md` for approval.

**Secrets.** Repo scanned for credentials: none. `.gitignore` net added for secret-shaped files
(the repo is published wholesale by `app_location: "/"`).

## 2. Inventory and verification harness (Sat evening)

- `docs/INVENTORY.md`: stack, deploy path, page types, URL/canonical/JSON-LD map, ad/analytics
  configuration (Auto ads only, zero manual units, no consent), Lighthouse + axe baseline.
- `harness/`: local server; `snap.js` (screenshots + console/failed requests/axe/CWV at 390/768/
  1440); `lh.js` (Lighthouse mobile, ads blocked); `integrity.js` (content gate); `peek.js`
  (viewport looks). All ad/analytics hosts blocked at the Playwright route layer; every tool
  refuses to overwrite an existing label (`--force` required) so the baseline can never be
  replaced by accident. Baseline label: **`baseline-2026-09-13`**.
- Gate proven before trusting it: a one-character price change and an injected above-the-fold
  ad unit both failed; an ambiguous approval (`from` occurring 54 times) was rejected; after
  revert the gate returned to PASS.
- Baseline numbers: 0 console errors, but 146 serious contrast violations (16 pages), 42
  keyboard-inaccessible code blocks, Lighthouse perf 87 on home (CLS 0.254 from the async-CSS
  trick), accessibility 92–98, SEO 92 on two pages.

## 3. Wave 1 — design system + page shell (Sat night)

One builder (`77243da`): styles.css rewritten as a tokenised editorial system (paper ground, one
accent, navy reserved for header/footer/code/diagrams, system font stacks, 17px/1.65 body,
68ch measure), sticky header with an accessible drawer, breadcrumbs, page-header band replacing
the gradient heroes, quiet footer, single stylesheet link replacing the critical-CSS/preload
pattern (CLS to 0 everywhere), `script.js` rewritten (menu, FAQ, copy buttons, keyboard-reachable
code). Applied to 19 pages by an idempotent script (`harness/apply-shell.js`).

Integrator follow-ups (`1fb92e6`, `33ee55b`): skip link (gate taught to ignore fragment-only
hrefs), exact `<pre>` text added to the gate (an indentation change inside a code sample now
fails), all HTML re-indented 4→2 spaces outside `<pre>` (−68 KB), `.gitattributes` for LF.

**Round 1 critics:** creative director 7.6, reader 7.4, monetization & SEO 8.6 → FAIL. Main
findings: page header and article on two left edges at 1440, mobile drawer without scrim/scroll
lock and with the toggle after the links in the DOM, tap targets under 44 px, mechanical accent
on "About **Us**", seven different section-rule lengths.

**Round 2** (`f12fce5`): all twelve request items fixed; CSS consolidated 42.8 → 37.9 KB raw
(10.3 → 8.0 KB gzip). Critics: 8.6 / 8.6 / 8.7 (the M&S 8.3 was re-verified to 8.7 after the
ad-well width fix) → PASS.

## 4. Wave 2 — article, code & diagrams, listing, static pages (Sat night → Sun early)

Four builders in parallel on disjoint files (`79ab105`, `541c3ca`, `fe34c17`, `fe8d019`):
- Article template: key-facts strip, ruled sections with stable ids, numbered steps, note
  callouts, prev/next, "On this page" rail (desktop) / chip row (mobile), applied by
  `harness/apply-article.js`.
- Code & diagrams: Stripe-style code header with Copy, scroll veils, keyboard focus; diagrams
  redesigned as compact nodes so every one fits one phone screen (896 → 429 px tall on the
  longest page).
- Listing pages: consistent card anatomy, real roadmap timeline, keyboard-accessible interview
  rows (was zero focusable content), book covers re-encoded 358 → 143 KB (resources page 424 →
  216 KB), fixed cover mounts (CLS 0).
- Static pages: editorial prose, contact form card with drawn status icons, self-contained 404.

**Round 1 critics:** all four areas narrowly failed (7.4–8.8). Notable finds: the syntax-colour
classes had never existed in the markup (all 43 code blocks were flat), one diagram asserted the
wrong topology at 390 px, Copy scrolled out of reach on tall blocks, the chip row showed 3 of 7
chips with no affordance.

**Round 2** (`59ad633`, `93426da`, `00a94b0`): build-time syntax highlighter (43 blocks, 1,132
spans, `<pre>` text byte-identical, verified by the gate), sticky code header, non-wrapping
region pair, one article register at 1440, 44 px chips with a visible partial chip, focus order
fixed, tools page rebuilt as ruled rows, real `<button>`s on interview rows, level-jump nav,
status slot reserved on the contact form, 404 on the site gutter. Critics: article 8.7/8.6/8.6,
code 8.6/8.8/8.9, static 8.6/8.7/8.8 PASS; listing 8.4 (CD) → fixed in polish.

## 5. Byte budget (decision recorded)

The brief's "page weight at or below baseline" could not hold with the features it asked for:
the old CSS gzipped unusually well (6.1 KB) and the new shell adds skip link, breadcrumbs, TOC,
copy buttons. Measured honestly with `harness/weight.js` (gzip, the way Azure serves it):
+0.3–2.5 KB per page after consolidation (+~4 KB on project pages once three ad wells were
added). Every other budget holds (perf 99–100, CLS 0, LCP ≤ 1.65 s except resources 2.1 s, whose
cause was isolated by experiment to the eight cover requests, not bytes or scripts). Both
exceptions are documented for sign-off in HUMAN_TODO D1/D2.

## 6. Polish rounds and final gate (Sun early morning)

- Polish 1 (`f22dfdf`): one chip radius, two list-marker treatments, one callout shape, seven
  content widths → two, drawer focus trap, breadcrumb 44 px, `aria-label` on step anchors,
  ad-well left-aligned, back-to-top control, the ad-well collapse logic (collapse only on
  `data-ad-status="unfilled"` AND never seen in the viewport; proven in four states).
- Final critics: reader 8.6 PASS, M&S 8.8 PASS with a clean 21-URL crawl (every title, meta,
  canonical, JSON-LD, heading, link set, image and code block identical to `f1ec399`),
  creative director 8.4 FAIL (hero half empty at 1440, two article right edges, footer variants).
- Polish 2 (`cff105e`): hero as an explicit two-column grid, one article measure (prose, code,
  diagrams and wells all end at 776), footer auto-fit, control chips distinct from inert tags,
  Pluralsight panel labelled "Partner" and moved out of the 300×250 window, status slot capped
  for long server errors, `aria-controls` on interview rows, `role=status` on the calculator.
- Final re-score: creative director 8.6, reader 8.6, M&S 8.5 (its one regression — the
  back-to-top control overlapping ad wells below 1280 px — fixed the same hour, `38a1329`).
- Blind A/B judging (`ceb1610`): 21 shuffled pairs (7 page types × 3 widths), two judges who
  never saw which was which: new design wins 42/42, means 8.36 and 8.39 vs 5.92 and 5.62.

**Whole site PASS** (`db91ab2`): every area ≥ 8.5, integrity PASS, 0 console errors, 0 axe
violations of any impact, CLS 0, Lighthouse mobile 99–100 / 100 / 100 / 100 (SEO 92 on two
pages only because "Learn More" text was frozen — fixed later with approval).

Also this morning: local server hardened with a CSP meta and same-origin stubs so a forgotten
route block can never execute the AdSense/GA loaders in automation (`5845f55`, `50a32e4`) —
recorded in HUMAN_TODO B5 after six throwaway scripts were found to have loaded localhost pages
without the route block (no ad can serve to an unregistered origin; nothing was clicked).

## 7. Launch and Azure/GitHub cleanup (Sun morning, owner present)

- Azure CLI (read-only first): one Static Web App, `www` bound, apex binding expired (DNS points
  at Squarespace which 301s to www). Removed the dead apex binding; at the owner's instruction
  deleted the orphaned Application Insights component, its dashboard and managed workspace
  group (`9b9e0af`, `a6380e4`). Stale GitHub deployment secret deleted (`4f38cbf`).
- Real 404s: unknown URLs now serve `404.html` with status 404 instead of a 200 copy of the home
  page carrying the ad loader; `rel="sponsored"` on the eight Amazon affiliate links (`f3e80dc`).
- Phase 2 ads: the owner created five AdSense units (display ×2, in-feed, in-article,
  multiplex); `harness/apply-ads.js` placed 37 labelled, height-reserving wells on 15 pages at
  the planned positions, none above the fold, each position its own unit (`c7a3a0f`, `aadd699`).
  A close-tag bug in the placer's re-run path was caught by the CI validator before push and
  fixed (`ead9f16`).
- **Launched** at the owner's instruction: `main` fast-forwarded, one workflow run, live files
  verified byte-identical, API 200, missing route 404 (`af26c4d`, run 34766608082).
- Auto ads set by the owner: on; anchor on; vignette off; side rails off (`3bebce9`).

## 8. Content, copy, books and consent (Sun midday → evening, owner-approved in chat)

- **Content corrections** (`7b89fe6`): all 56 audit substitutions plus the SAP-C02 byline the
  audit required — 75 source edits across 22 files (retired exam, wrong statistics, EC2 script,
  Free Tier wording, S3 OAC steps, runtimes, EKS/Terraform versions, service renames, dead
  ASIN, footer year). Method: `harness/apply-audit.js` (each `from` must occur exactly once;
  syntax spans stripped and re-applied around code edits), then `harness/derive-approvals.js`
  explained every rendered difference with an approved substitution (85 approvals, 0
  unexplained); a deliberate unapproved tamper still failed the gate afterwards.
- **Copy** (`09fe377`): descriptive certification/tool link text (Lighthouse SEO now 100
  everywhere) and the Amazon Associates disclosure under the books heading.
- **Books** (`dd24ada`, `fb842e3`): a research agent verified 24 current titles (ISBNs
  recomputed, editions checked — SAA-C03/SAP-C02 still current, DDIA 2e real, SCS-C03 live with
  no book yet); 20 have covers from Open Library / O'Reilly's public endpoint (Amazon images
  need their Product Advertising API). Eight static cards rebuilt, 16 active variants + 4 pool
  items seeded into the live tables through the API, old mismatched photos removed.
- **Rotation** (`ab862da`): the existing analyser was a timer trigger, which Static Web Apps
  managed functions never run (evidence: one variant per slot and ten unpromoted pool items). An
  HTTP entry point plus a daily GitHub cron (`.github/workflows/ab-daily-analysis.yml`, secret
  `ADMIN_API_KEY`) now runs it; fired once manually, returned OK. Readers see per-load weighted
  rotation immediately.
- **Consent** (`170f120`): owner confirmed the GDPR message is published in AdSense; a Consent
  Mode v2 default (denied for EEA/UK/CH until the message answers, `wait_for_update` 500,
  ads data redaction) now precedes the GA4 config on all 19 tagged pages; the gate flagged the
  snippet change on exactly 19 pages and passes with 19 explicit approvals.

## 9. What still needs the owner (as of 2026-09-13 evening)

1. AdSense → Privacy & messaging → "Consent mode for advertising purposes" ON (one toggle).
2. Optional Auto ads excluded areas (list in `docs/AD_PLAN.md`).
3. After a week of fill: rendered ad heights per position (mobile/desktop) so the 280 px
   reservations can be tuned; then the weekly watch-plan check (`docs/HUMAN_TODO.md` C).
4. Sign-off on the two documented budget exceptions (D1 bytes, D2 resources LCP).
5. Covers for the seven researched titles without one, if wanted (drop `images/books/<isbn10>.jpg`,
   run `node harness/build-books.js`, reseed).

## 10. How to work on the site from here

```
node harness/serve.js                                   # local server (ads/analytics stubbed + CSP)
node harness/integrity.js compare --base baseline-2026-09-13   # must PASS; approvals in docs/APPROVALS.json
node harness/snap.js --label <new-label>                # screenshots + console/axe/CWV
node harness/lh.js --label <new-label>                  # Lighthouse mobile
node harness/weight.js                                  # gzip weight vs f1ec399
node harness/apply-shell.js --check / apply-article.js --check / apply-code.js --check / apply-ads.js --check
```
Content changes need a named, dated, exact substitution in `docs/APPROVALS.json`; never load
live ads in automation; never push without the owner asking.

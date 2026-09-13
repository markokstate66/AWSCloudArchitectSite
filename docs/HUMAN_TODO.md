# HUMAN_TODO — things only the site owner can do

Written 2026-09-13 during Phase 0 and the inventory. Nothing here blocks the facelift; agents
keep going. Items are ordered by how much they matter, not by effort. None of these were done by
an agent: no deploy, no AdSense/Search Console/DNS/CMP change was made.

## A. Phase 0 findings (checked against the live site on 2026-09-13)

### A1. Backend works — but only by luck of a race (fix before the next push)
Every `/api/*` route was probed live. Result: **no HTTP 500s**. Public routes respond correctly
(`GET /api/pool` 200, `GET /api/products` 200, `OPTIONS /api/contact` 204, `POST /api/contact`
400 on an empty body, tracking routes 400, admin-only routes 401/302). The contact form's front
end shows the API's error text on any non-OK response and a generic failure on a network error,
so a failed send is **visible**, not reported as success. `api/package.json` `main` is a valid
glob for the Functions v4 model, so the sister-site failure mode does not apply here.

**However:** two workflow files in `.github/workflows/` both fired on every push to `main`.
One deploys with `api_location: "api"`, the other with `api_location: ""` (no API), using
different secrets (`AZURE_STATIC_WEB_APPS_API_TOKEN_GREEN_WATER_0B250A80F` vs
`AZURE_STATIC_WEB_APPS_API_TOKEN`). GitHub Actions history shows both succeeding on the last
push (run 20834935339 = no-API workflow finished first, run 20834935338 = API workflow finished
last). The API is live today only because the API workflow happened to win.

What was done in the repo: the no-API workflow was deleted and its HTML-validation job folded
into the remaining one (`azure-static-web-apps-green-water-0b250a80f.yml`).

**Checked with the Azure CLI (read-only) on 2026-09-13:** the subscription has exactly one Static
Web App for this site, `AWSCloudArchitectSite` (green-water-0b250a80f, Standard, East US 2), bound
to `www.awscloudarchitect.com` (Ready). Both GitHub secrets therefore deployed to the same app and
the last finisher won; deleting the no-API workflow is the right fix. The app has one deployment
token; the contact-form settings (`ACS_CONNECTION_STRING`, `NOTIFICATION_EMAIL`) and the A/B
storage settings are present. Side finding: the apex `awscloudarchitect.com` custom-domain binding
on the SWA shows **Failed: "has not been resolving … and has expired"** (the apex still 301s to www,
so DNS/registrar handles it; harmless unless you want Azure to own the apex).

**Cleanup done on 2026-09-13 (Azure CLI):** the failed apex binding `awscloudarchitect.com` was
deleted from the SWA (apex DNS points at Squarespace, which 301s to www; Azure could never validate
it). Remaining binding: `www.awscloudarchitect.com` Ready.

**You must:**
1. Delete the GitHub repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` (the removed workflow's):
   `gh secret delete AZURE_STATIC_WEB_APPS_API_TOKEN` — the agent's secret-store write was blocked by
   policy. Keep `AZURE_STATIC_WEB_APPS_API_TOKEN_GREEN_WATER_0B250A80F`.
2. **Orphaned monitoring: deleted on 2026-09-13 at the owner's request.** `aws-architect-insights`
   (Application Insights), its portal dashboard and the managed workspace resource group
   `ai_aws-architect-insights_…_managed` are gone. `DefaultResourceGroup-EUS` now holds only the
   Static Web App and the subscription's default Log Analytics workspace (shared, not site-specific).
3. After the first push with the single workflow, re-probe `GET https://www.awscloudarchitect.com/api/products` (expect 200 JSON).

### A2. Soft 404s: every unknown URL returns the home page with HTTP 200
`staticwebapp.config.json` has `navigationFallback` → `/index.html` and a `404` override that
rewrites to `/index.html` with `statusCode: 200`. `GET /does-not-exist.html` returns 200 and the
home page's `<title>`. `404.html` exists (with `noindex`) but is never served. Google treats
this as soft-404 duplication of the home page.
**Done in the branch on 2026-09-13 (owner asked for autonomous cleanup):** the `404` override now
rewrites to `/404.html` with status 404 and `navigationFallback` is removed (multi-page site, not an
SPA). Verified locally: a missing route returns a real 404. Takes effect on the launch merge; watch
Search Console "Not found (404)" afterwards — those are the former soft-404s being dropped, which is correct.

### A3. Content truth — 13 WRONG, 18 STALE, 3 UNVERIFIED out of 78 claims
Full table with sources and exact substitutions: `docs/CONTENT_AUDIT.md`. Nothing was changed
on any page. The five that would embarrass the site most:
1. `tools.html` budgets $300 for the **retired** Database Specialty exam (last sitting 2024-04-29).
2. Home page: "32% Job Growth" (BLS: 8% for 2025–35) and "approximately 32% market share" (Synergy Q2 2026: 28%).
3. `project-ec2-web-server.html`: "Elastic IPs are free when associated" (false since 2024-02-01) and a user-data script that calls `amazon-linux-extras` on an Amazon Linux 2023 AMI (does not exist there; the copy-paste fails).
4. Five pages describe the pre-July-2025 Free Tier (12 months / 750 hours); new accounts now get $100–$200 credit over 6 months.
5. `project-static-website.html` tells the reader to make the bucket public and then configures Origin Access Control, which requires it private.
Also: EKS `1.28` (out of support), `PodSecurityPolicy` (removed in K8s 1.25), `aws-portal:*` in an SCP (inert since 2023-12-11), Terraform `~> 5.0` (v6 since 2025-06), RDS MySQL 8.0 (paid Extended Support since 2026-08-01), one affiliate link that 404s (SAP-C02 guide ASIN 1119951097), `acloudguru.com` and `cloudacademy.com` redirect to other brands, `© 2025` on 20 pages.

**APPLIED 2026-09-13 at the owner's instruction ("apply the content corrections from the audit"):**
all 56 approval-block substitutions plus the SAP-C02 byline the audit table required (75 source
edits across 22 files incl. the year in every footer and pool-data.json). 85 gate approvals were
derived by explaining every rendered difference with an approved substitution (0 unexplained);
`node harness/integrity.js compare` → PASS with them, and still FAILS on any other change (tamper-tested).
Still yours: replace `images/books/sap-c02.jpg` (the card now names the Packt SAP-C02 guide by Sard &
Wadia but the photo is still *The Kubernetes Book*); the three UNVERIFIED cost estimates were left as-is.

### A4. No credentials found in the repo
`git grep` for storage keys, ACS connection strings, AWS keys and private keys: nothing. A
`.gitignore` net for those shapes was added (`local.settings.json`, `*.pem`, `.env*`, etc.).

### A5. "Learn More" link text — APPLIED 2026-09-13 (owner-approved in chat)
Home-page cert links now read "<exam> exam details"; the tools-page link reads "Open the AWS
Well-Architected Tool". Six text approvals recorded in docs/APPROVALS.json; gate PASS.

### A6. Found by the Wave 2 critics (content/commercial — need your call)
1. Affiliate disclosure — APPLIED 2026-09-13: "As an Amazon Associate, we earn from qualifying
   purchases." sits under the Recommended AWS Books heading on resources.html (approved in chat).

2. **rel="sponsored" added on 2026-09-13** to the 8 Amazon `?tag=` affiliate links (resources.html).
   The Pluralsight links carry no tracking parameter, so they were left as editorial links; if they
   are in fact a paid partnership, say so and they get the same attribute.
3. **images/books/sap-c02.jpg is a photo of *The Kubernetes Book*** while its alt text says it is the
   SAP-C02 study guide (and the linked ASIN 1119951097 404s — CONTENT_AUDIT). Needs a new image
   (same filename keeps the gate green) and the link fix from the audit block.
4. **Soft 404s (A2) matter more than first written:** every unknown URL is a 200 copy of the home
   page *with the AdSense loader on it*. The redesigned 404.html is never served.

## B. AdSense / consent (only you can see or change these)

### B1. Record the Auto ads settings and injected slots (needed as the ad baseline)
In AdSense → Ads → By site → awscloudarchitect.com, record: Auto ads on/off, which formats are
enabled (in-page, anchor, vignette, side rails, multiplex), the ad load slider, and any
excluded pages/areas. Then, in a normal browser (not automation), load one page of each type
(home, project, listing, static) on a phone and on desktop, scroll to the bottom, and note how
many ads were injected and roughly where. Put the results in `docs/INVENTORY.md` under
"Ad baseline (human-captured)". Agents block ad hosts and cannot see this.

### B2. Consent: no CMP, no Consent Mode v2, GA4 on 19 pages
There is no `gtag('consent', ...)` default, no Funding Choices / `googlefc` script, and the
privacy policy describes cookies but offers no control. If the site has EEA/UK/Swiss traffic,
Google requires a certified CMP for personalised ads. Check AdSense → Privacy & messaging: is
a GDPR message published for this domain? If yes, its script tag is not on any page (the CSP
already allows `fundingchoicesmessages.google.com`, suggesting it was intended). Decide:
publish the AdSense-served CMP and tell an agent to add the exact snippet plus a Consent Mode
v2 default (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` denied by
default for EEA regions) — or document that traffic is non-EEA and the risk is accepted.

### B3. Core Web Vitals field data (lab numbers do not cover Auto ads)
Auto ads inject after load in positions Google chooses. The harness blocks ad hosts, so every
CLS number in `docs/INVENTORY.md` and the gauntlet **excludes ad-induced shift**. The honest
number is field data. PageSpeed Insights' keyless API quota was exhausted on 2026-09-13
(HTTP 429), so no CrUX data was captured. Please: Search Console → Core Web Vitals → Mobile,
screenshot the 28-day status and the URL groups, and paste the numbers into
`docs/INVENTORY.md` under "Field data (human-captured)". Do the same the week after launch.

### B4. Phase 2 — manual ad units: PLACED in the branch on 2026-09-13
You created four units (display 4265688185, in-feed 1914857011, in-article 1286327745, multiplex
8973246072); they are placed at the five AD_PLAN positions (mapping in docs/AD_PLAN.md), 37 wells on
15 pages, gate clean. Two follow-ups for you:
1. Second display unit (9084926712) received and placed at home-mid on 2026-09-13 — every position now has its own unit.
2. **Auto ads settings** still yours: anchor on, vignette off, side rails off, plus the excluded areas
   listed in docs/AD_PLAN.md. And after one week of real fill, send the rendered heights per position
   (mobile/desktop) so the `--ad-h` reservations stop being guesses.

## C. Post-launch watch plan (you run it; agents cannot see AdSense or GSC)

Baseline window: the 28 days before the launch push. Compare each week for 4 weeks.

| Metric | Where | Rollback trigger |
|--------|-------|------------------|
| Page RPM, RPM, ad CTR | AdSense → Reports → by site | Page RPM down > 25% for 7 consecutive days with stable pageviews |
| Viewability (Active View) | AdSense → Reports → Active View viewable | Down > 10 points |
| Invalid-traffic warnings / policy centre | AdSense → Policy centre | Any new issue → stop and investigate the same day |
| CLS / LCP / INP (mobile, field) | Search Console → Core Web Vitals | Any URL group moving from Good to Needs improvement |
| Organic clicks, impressions, avg. position | Search Console → Performance | Clicks down > 20% week-over-week for 2 weeks (after seasonal check) |
| Soft-404 / not-indexed pages | Search Console → Pages | Any project page dropping out of the index |

Rollback = `git revert` of the launch merge and push; the single workflow redeploys in ~90 s.

## D. Budget exceptions that need your sign-off

### D1. Page weight is above the "at or below baseline" budget by 0.3–2.5 KB gzip per page
Measured with `node harness/weight.js` (gzip, the way Azure SWA serves text), reference commit f1ec399:

| Page type | gzip now vs baseline | Where it comes from |
|-----------|----------------------|---------------------|
| project guides (11) | about +4.2 KB with the three ad wells (+2.45 KB before units; e.g. 15.2 KB vs 11.0 KB) | styles.css +1.9 KB (new design system replaces a 6 KB sheet that gzipped unusually well), script.js +0.3 KB (copy buttons, keyboard-accessible pre/FAQ/drawer), page HTML +0.23 KB (heading ids, "On this page" rail, key-facts list, skip link, breadcrumb) |
| listing pages | about +1.3 KB | same shared CSS/JS; HTML is at or below baseline |
| static pages | +1.2–1.6 KB | same |
| home | +1.0 KB | same |
| 404.html | +0.3 KB | self-contained restyle |

Everything else in the budget holds (Lighthouse mobile perf 99–100, CLS 0, LCP ≤ 1.65 s except
resources.html, 0 console errors, 0 axe). The overage is the cost of the features the brief asked
for; the CSS has already been consolidated to within ~175 B of its floor. **Decide:** accept the
exception (recommended — 14 KB total for a project page is still very small), or tell an agent
which features to drop.

### D2. resources.html LCP is 2.1 s in the lab against a 1.8 s budget (every other page ≤ 1.65 s)
Measured 2026-09-13 with Lighthouse mobile simulated throttling, ads blocked. The LCP element is
the page's <h1>; the extra 0.3 s is the simulator charging the eight book-cover requests that the
preload scanner starts before first paint. Controlled experiments on scratch copies:

| Variant | LCP |
|---------|-----|
| as shipped (8 covers, 143 KB, first eager, rest lazy) | 2.1 s |
| abtest.js deferred / removed | 2.2 s / 2.1 s (not the cause) |
| all covers lazy, no fetchpriority | 2.2 s |
| covers re-encoded 320 px tall (101 KB) | 2.1 s (bytes are not the cause; request count is) |
| covers removed entirely | 1.8 s |

The only in-budget option is to not have the covers in the initial HTML (inject them after load),
which changes the frozen image markup and the A/B renderer. **Decide:** accept 2.1 s lab LCP on
this one page (real-user LCP on a fast connection is far below this simulation), or approve an
"images" change so the covers are inserted by script after first paint.

### B5. Automation slip to know about (2026-09-13)
A scan of the agents' throwaway scripts found six that loaded pages from the local server
(127.0.0.1:4173) without the harness ad-block route, so on those runs the browser requested the
AdSense loader and GA tag from Google for a localhost origin. No ad can serve to an origin that is not
registered to the account, nothing was ever clicked, and all shipped harness tools block at the route
layer. Hardening added: the local server now injects a CSP meta into every HTML response that forbids
third-party scripts, so a forgotten route block can no longer execute the loaders (verified: 0 external
requests on an unblocked load). If you see stray localhost hits in GA4 realtime for 2026-09-13, that is
what they were; no action needed in AdSense.

## E. Launch — DONE 2026-09-13 at the owner's instruction (run 34766608082, commit ead9f16)
Post-launch: the 28-day pre-launch window for the watch plan (section C) ends 2026-09-13; compare weekly from 2026-09-20. Still open above: content approvals (A3/A5/A6), sap-c02 cover, the GitHub secret, Auto ads settings (B), CMP (B2), field data (B3), budget exceptions (D).

### Original launch steps (kept for the next release)

The facelift is on the local branch `facelift` (never pushed). Before launch:
1. Read `docs/STATUS.json` and the final reports in `docs/rounds/final-*.md`; decide the four
   sign-offs above (A2 soft-404 config, A3/A5/A6 content approvals, D1 bytes, D2 LCP).
2. Optional content corrections: paste approved entries into `docs/APPROVALS.json`, then have an
   agent apply them and run `node harness/integrity.js compare --base baseline-2026-09-13`.
3. Confirm A1 (single deploy workflow / SWA binding) — the merge will trigger a deploy.
4. `git push -u origin facelift`, open a PR to `main`, review the diff (24 site files + harness/docs),
   merge. The workflow runs html-validate then deploys in ~90 s.
5. Post-launch: run the watch plan in section C; take the "after" AdSense/GSC numbers at 7 and 28 days.
6. Phase 2 (manual ad units): create the five units (B4), write ids to `docs/AD_UNITS.json`, run
   `node harness/apply-ads.js --check` then without `--check`, add `adCount` approvals for the 15
   pages, run the gate, review, merge. Set Auto ads to anchor on / vignettes off / side rails off.

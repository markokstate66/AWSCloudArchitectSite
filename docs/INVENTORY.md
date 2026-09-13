# INVENTORY — awscloudarchitect.com (baseline label `baseline-2026-09-13`)

Regression baseline and the "before" for blind judging. Captured 2026-09-13 from the working
tree at commit `f1ec399` (identical to the live site: `index.html` byte-for-byte equal; live
`Last-Modified` 2026-01-08). Nothing here is a default label; every tool refuses to overwrite a
label without `--force`.

## 1. Stack, hosting, deploy, local run

| Item | Value |
|------|-------|
| Stack | Hand-written static HTML (21 files at repo root), one stylesheet `styles.css` (35.5 KB), `script.js` (3.4 KB, menu/FAQ/scroll animations), `abtest.js` (5.4 KB, resources.html only) |
| Hosting | Azure Static Web Apps, `app_location: "/"`, `skip_app_build: true` → **entire repo is published** |
| API | Azure Functions v4 (Node) in `api/` (contact form via Azure Communication Services; A/B product pool + tracking in Table Storage). All routes live and healthy on 2026-09-13 |
| Deploy | GitHub Actions on push/PR to `main`. Was two racing workflows; now one (`azure-static-web-apps-green-water-0b250a80f.yml`) with html-validate → deploy. See HUMAN_TODO A1 |
| Config | `staticwebapp.config.json`: security headers, CSP, `/admin.html` and `/api/stats` role-gated, unknown routes → `index.html` **200** (soft 404), plus 404 blocks for `/harness/*`, `/docs/*`, `/_showcase/*`, `/prompt.txt`, `*.md` |
| Local run | `node harness/serve.js` → http://127.0.0.1:4173 (API stubbed, 404s are real 404s) |
| Verification | `harness/snap.js`, `harness/lh.js`, `harness/integrity.js`, `harness/peek.js` — see ARCHITECTURE.md |

## 2. Page templates and page types

| Type | Pages | Template notes |
|------|-------|----------------|
| home | `index.html` | Fixed header, gradient hero with 3 stats, "what is" 2-col, roadmap timeline (6), cert cards (4), resource lists (3 cols), salary cards (3), FAQ accordion (6, JS), CTA band, 4-col footer. Inline critical CSS + async `styles.css` preload |
| project (article) | 11 × `project-*.html` | Same header/footer; short hero with level badge; `.project-guide` (max 900px): overview card + meta row (Difficulty / Services / Cost), Prerequisites, Architecture (`.architecture-diagram` HTML/emoji), Step-by-Step (numbered `.guide-step`), Tips, Code Examples (3–6 `.code-block` with label/lang header, no copy button), Next Steps, prev/next `.guide-navigation`. Links `styles.css` directly (no critical CSS) |
| listing | `projects.html` (11 cards in 3 level groups + tips), `resources.html` (8 book cards with images, Pluralsight promo, 4 course cards; book grid can be replaced by `abtest.js` from `/api/products`), `interview-prep.html` (6 categories, 17 Q&A items) | Hero + card grids; inline critical CSS |
| tool | `tools.html` | Salary calculator + certification cost planner (inline JS, 3.2 KB), 4 tool cards |
| static | `about.html`, `privacy.html`, `contact.html` (form → `/api/contact`), `404.html` (self-contained, noindex, not served in prod) | Hero + `.content-text` prose |
| admin | `admin.html` | Auth-gated A/B dashboard; out of scope |

Shared chrome: `.header` (fixed, 70px), `.nav-links` (6 links; mobile hamburger), `.footer`
(4 columns: blurb, Quick Links, Official AWS Links, Legal). Header/footer markup is duplicated
by hand in every page (index nav links are `#anchors`, all other pages use `index.html#…`).

## 3. URLs, sitemap, redirects, canonicals

- 19 indexable URLs, all in `sitemap.xml` (lastmod 2025-12-24/27), all with self-referencing
  canonical to `https://www.awscloudarchitect.com/<file>.html` (home → `/`).
- `robots.txt`: allow all, disallow `/admin.html`, `/api/`; sitemap declared.
- Redirects: apex `awscloudarchitect.com` → 301 → `www`. `/index.html` → rewrite `/`.
- Not indexable: `404.html` (noindex, unreachable in prod), `admin.html` (302 to AAD login).
- Structured data: home = WebSite + Organization + BreadcrumbList + FAQPage; listing/static =
  CollectionPage/WebPage/AboutPage/WebApplication + BreadcrumbList; **project pages have none**;
  contact and 404 none.
- Baseline Lighthouse SEO < 100 on `index.html` and `tools.html` (non-descriptive link text
  "Learn More"; heading order).

## 4. Ad configuration per page type (baseline)

| Page type | AdSense loader | Manual `<ins class="adsbygoogle">` | Auto ads |
|-----------|----------------|-------------------------------------|----------|
| home, project (11), listing (3), tool, about, contact, privacy | present (`ca-pub-6676281664229738`, async, `crossorigin`) | **0** | on for the domain (formats/ad load: human to record, HUMAN_TODO B1) |
| 404.html, admin.html | absent | 0 | n/a |

- `ads.txt`: `google.com, pub-6676281664229738, DIRECT, f08c47fec0942fa0` (served 200).
- Consent/CMP: baseline had **none**. Since 2026-09-13: AdSense-served European regulations message (owner) + Consent Mode v2 default on the 19 GA pages (region-scoped EEA/UK/CH).
- Analytics: GA4 `G-VBQ33BLD4E` via gtag.js on the same 19 pages; no consent mode.
- Legacy `.ad-container/.ad-placeholder/.ad-banner/.ad-rectangle` CSS exists but is unused.
- **Ad settings (owner, 2026-09-13):** Auto ads ON; anchor ON; vignette OFF; side rails OFF. Manual units: 5 positions / 37 wells live since 2026-09-13 (docs/AD_UNITS.json). Pre-facelift Auto-ads format/ad-load settings were not recorded before the change.
- **Field data (human-captured):** _pending — see HUMAN_TODO B3 (PSI API quota 429 on 2026-09-13)._

## 5. Lighthouse baseline (mobile, simulated throttling, ads + analytics blocked at the network layer)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | Weight | Failing binary audits |
|------|------|------|----|-----|-----|-----|-----|--------|------------------------|
| index.html | 87 | 92 | 100 | 92 | 1.53 s | **0.254** | 0 ms | 77 KB | color-contrast, heading-order, link-text, bf-cache |
| projects.html | 100 | 95 | 100 | 100 | 1.53 s | 0 | 0 ms | 69 KB | color-contrast, bf-cache |
| resources.html | 99 | 95 | 100 | 100 | 2.10 s | 0.009 | 0 ms | 339 KB | color-contrast, bf-cache |
| tools.html | 95 | 98 | 100 | 92 | 1.53 s | **0.141** | 0 ms | 62 KB | heading-order, link-text, bf-cache |
| interview-prep.html | 98 | 100 | 100 | 100 | 1.68 s | 0.090 | 0 ms | 82 KB | bf-cache |
| about.html | 100 | 93 | 100 | 100 | 1.38 s | 0 | 0 ms | 51 KB | color-contrast, heading-order, bf-cache |
| project-multi-account-landing-zone.html | 100 | 92 | 100 | 100 | 1.53 s | 0 | 0 ms | 62 KB | color-contrast, heading-order, bf-cache |

The CLS on home/tools/interview-prep comes from the "critical CSS + async stylesheet preload"
pattern: the full stylesheet lands after first paint and re-lays the page. Project pages, which
link the stylesheet normally, have CLS 0. `bf-cache` fails only because the local server sends
`Cache-Control: no-store`; ignore locally.

## 6. Playwright/axe baseline (all 21 pages × 390/768/1440; `harness/out/baseline-2026-09-13/`)

- Console errors: **0** on every public page (admin.html logs one 404 for `/.auth/me`, expected locally).
- Failed requests: 0 (ads/analytics blocked at route layer, served as empty 200/204).
- Horizontal overflow: none at any width.
- Transfer size: 49–82 KB per page; resources.html 424 KB (8 JPEG book covers, 1.1 MB on disk).
- axe (WCAG 2.1 AA + best-practice), distinct violations across pages:
  - `color-contrast` **serious** — 16 pages, 146 nodes (footer links at 70% white on navy, `.tag`, level badges, orange-on-white links).
  - `scrollable-region-focusable` **serious** — 11 project pages, 42 `<pre>` blocks without keyboard access.
  - `heading-order` moderate — 16 pages (footer `<h4>` after `<h2>`).
  - `landmark-one-main`, `region` moderate — 404.html.
- Lab CLS from Playwright at 768/1440 on listing/static pages (0.03–0.16): same async-CSS cause.

## 7. Screenshots and rendered text

- Screenshots: `harness/out/baseline-2026-09-13/<page>@{390,768,1440}.png` (63 full-page PNGs; git-ignored, regenerate with `node harness/snap.js --label <new-label>`).
- Rendered text, titles, meta, canonicals, headings, JSON-LD, links, images, ad units, loader/GA presence per page: `harness/baseline/baseline-2026-09-13.json` (committed; 21 pages).
- Gate proven on 2026-09-13: a one-character price change on a project page and an injected above-the-fold ad unit on the home page both **failed** `integrity compare`; an approval whose `from` occurs 54 times was **rejected**; after revert the gate returned to PASS.

## 8. Content audit

`docs/CONTENT_AUDIT.md` — 78 claims checked, 44 OK, 13 WRONG, 18 STALE, 3 UNVERIFIED; 52
external links checked (1 hard 404, 3 brand redirects). Nothing changed; approvals pending
(HUMAN_TODO A3).

## 9. After the facelift (label `polish-r2`, HEAD cff105e, 2026-09-13)

| Page | Perf | A11y | BP | SEO | LCP | CLS | gzip weight now vs baseline |
|------|------|------|----|-----|-----|-----|------------------------------|
| index.html | 100 | 100 | 100 | 92 | 1.65 s | 0 | 16993 vs 14724 (+2269) |
| projects.html | 100 | 100 | 100 | 100 | 1.65 s | 0 | 15396 vs 12750 (+2646) |
| tools.html | 100 | 100 | 100 | 92 | 1.53 s | 0 | 15224 vs 12603 (+2621) |
| interview-prep.html | 100 | 100 | 100 | 100 | 1.65 s | 0 | 17917 vs 15143 (+2774) |
| about.html | 100 | 100 | 100 | 100 | 1.5 s | 0 | 13721 vs 11016 (+2705) |
| project-multi-account-landing-zone.html | 100 | 100 | 100 | 100 | 1.65 s | 0 | 15811 vs 11889 (+3922) |
| resources.html | 99 | 100 | 100 | 100 | 2.1 s | 0 | 160699 vs 372586 (-211887) |

Playwright/axe (`harness/out/polish-r2/summary.json`, 20 public pages × 3 widths): 0 console errors, 0 failed requests, 0 axe violations of any impact (baseline: 146 serious contrast nodes + 42 keyboard-inaccessible code blocks), 0 horizontal overflow, CLS 0 everywhere. Integrity: PASS, 0 approvals used (no content, title, meta, canonical, link, image or structured-data change). SEO 92 on index/tools is the frozen "Learn More" text (HUMAN_TODO A5); resources LCP 2.1 s is HUMAN_TODO D2; gzip weight is HUMAN_TODO D1.

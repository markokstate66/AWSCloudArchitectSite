# ARCHITECTURE — facelift ownership map, budgets and rules

Scope: visual facelift + monetization footing for awscloudarchitect.com. Same 21 pages, same
URLs, same content, same stack (hand-written HTML/CSS/JS on Azure Static Web Apps). No
framework, no build step, no new dependencies in the deployed site.

## Stack facts that shape every decision

- `app_location: "/"` + `skip_app_build` → **the repo is published wholesale**. Anything at the
  root is a live URL. Non-site directories (`harness/`, `docs/`, `_showcase/`, `prompt.txt`,
  `*.md`) are blocked with `statusCode: 404` routes in `staticwebapp.config.json`.
- One stylesheet (`styles.css`), one behaviour script (`script.js`), one page-specific script
  (`abtest.js` on resources.html). Home page + 6 listing/static pages inline a "critical CSS"
  copy of the header/hero rules; the 11 project pages link `styles.css` directly.
- AdSense is **Auto ads only** (publisher `ca-pub-6676281664229738`, loader on 19/21 pages, zero
  manual `<ins>` units). GA4 `G-VBQ33BLD4E` on the same 19 pages. No consent mode, no CMP.
- Production rewrites unknown URLs to `index.html` with HTTP 200 (soft 404). `404.html` exists
  but is never served by SWA. Recorded in `docs/HUMAN_TODO.md`; not changed by the facelift.

## Ownership map (non-overlapping; one builder each)

| Area | Owns (files / selectors) | Must not touch |
|------|--------------------------|----------------|
| **design-system** | `styles.css` sections `/* == Tokens == */` … `/* == Primitives == */`: custom properties, type scale, spacing, colour, focus rings, buttons, links, callouts, tables, `.container`. | Page HTML, layout shell selectors, ad wrappers. |
| **layout-shell** | `.site-header`, `.site-nav`, `.mobile-menu-btn`, `.site-footer`, `.breadcrumbs`, skip link, `script.js` (menu, FAQ, copy-to-clipboard), the `<header>`/`<footer>` markup in every page (applied by the integrator). | Article body styles, cards, ad wrappers. |
| **article-template** | Project page body: `.page-hero`, `.project-guide`, `.guide-overview`, `.guide-meta`, `.guide-section`, `.guide-step`, `.tips-box`, `.guide-navigation`, on-page TOC. Markup changes inside `<main>` of the 11 `project-*.html` pages. | Header/footer, code blocks, diagrams, listing cards. |
| **code-and-diagrams** | `.code-block` family (header, label, copy button, `<pre>`), `.code-inline`, `.architecture-diagram` family (`.arch-*`). Markup inside those blocks on any page. | Everything outside those two component families. |
| **listing-pages** | `projects.html`, `resources.html`, `interview-prep.html`, `tools.html` bodies and their component styles (`.project-card`, `.book-card`, `.course-card`, `.interview-category`, `.question-item`, `.calculator-container`, `.tool-card`). `index.html` sections below the hero (roadmap, cert cards, resource lists, salary cards, FAQ, CTA). | Header/footer, project pages, ad wrappers. |
| **ad-presentation** | `.ad-well` wrapper family (reserved height, "Advertisement" label, collapse behaviour, `.no-js` scoping) and the small JS that decides collapse. Layout only — never creates or edits ad units, never edits the AdSense loader, `ads.txt`, GA or consent snippets. | Any content markup; Auto ads settings (human-only). |
| **static-pages** | `about.html`, `contact.html`, `privacy.html`, `404.html` bodies and `.prose`, `.contact-form`, `.form-status` styles. | Header/footer, ad wrappers. |
| **integrator** | The only role that edits shared files across areas: applies header/footer/shell markup to all pages, resolves seams, owns `staticwebapp.config.json`, `.gitignore`, `harness/`, `docs/`. | Never changes content text, titles, meta, canonicals, structured data or links. |

`admin.html` and `api/` are out of scope for the facelift (auth-gated, not public).

## Budgets (measured with ads and analytics blocked at the route layer)

| Metric | Budget | Baseline (2026-09-13, see docs/INVENTORY.md) |
|--------|--------|------------------------------------------------|
| Lighthouse mobile Performance | ≥ 95 | see INVENTORY |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | see INVENTORY |
| LCP (lab, simulated mobile) | ≤ 1.8 s | see INVENTORY |
| CLS (lab) | ≤ 0.05 | see INVENTORY |
| INP | ≤ 200 ms (TBT ≤ 100 ms as lab proxy) | see INVENTORY |
| Page weight / JS transfer | ≤ baseline per page | see INVENTORY |
| Console errors / axe serious+critical | 0 / 0 | see INVENTORY |

Failure isolation: with ads, fonts or JS blocked the page must still be fully readable; no
`:has()`-based or CSS-only collapse of ad wells outside a `.no-js` scope.

## Verification loop (every area, every round)

1. `node harness/serve.js` (keep running; port 4173).
2. `node harness/snap.js --label <area>-r<n>` → PNG + JSON per page/width (console, failed
   requests, axe, LCP/CLS, overflow, bytes).
3. `node harness/lh.js --label <area>-r<n>` → Lighthouse mobile for representative pages.
4. `node harness/integrity.js compare --base baseline-2026-09-13` → must print `INTEGRITY: PASS`.
   Any content/metadata/link/structured-data change fails unless `docs/APPROVALS.json` holds a
   named, dated, exact substitution (`from` must occur exactly once in that page+field).
5. Ad rules enforced by the same gate: no `<ins class="adsbygoogle">` above the fold at 390 or
   1440; every unit has a `data-ad-slot`; unit count per page may only change with an
   `adCount` approval.
6. Nobody claims a result they have not screenshotted and looked at.

Labels are explicit; the tools refuse to overwrite an existing label without `--force`, and
nothing ever defaults to the baseline label.

## Rounds and scoring

Critic panel (writes no code): creative director (against `docs/REFERENCES.md`), reader critic
(cloud engineer on a phone mid-task), monetization & SEO critic. Pass = every critic ≥ 8.5,
zero console errors, budgets met, zero serious/critical axe, integrity + ad gates clean. Up to
4 rounds per area, then BLOCKED. State lives in `docs/STATUS.json`.

## Waves

- Wave 1: design-system, layout-shell → integrator applies shell to all pages.
- Wave 2: article-template, code-and-diagrams, listing-pages, static-pages (parallel, disjoint
  files) → integrator fixes seams.
- Wave 3: ad-presentation (wrapper only; units need the human), whole-site polish.
- Final gate: full crawl vs baseline, blind A/B judging, `docs/STATUS.json` all PASS.

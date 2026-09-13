Area: design-system + layout-shell (Wave 1)   Round: 1   Critic: monetization & SEO   Score: 8.6/10   Verdict: PASS

Scope note: this round mostly proves "no regression + ad-ready". No live ad was ever loaded; every
capture went through the harness route blocker (`harness/pages.js` `BLOCKED_HOST_RE`, fulfilled 204).

## Screenshots looked at

- `harness/out/peek/ms-index@390+0.png` — paper hero, 56 px sticky navy header, one orange CTA; the
  hero/section seam is a visible hairline with ~48 px of air on each side. Nothing ad-shaped above the fold.
- `harness/out/peek/ms-index@390+1500.png` — roadmap timeline; hairline cards, 1 px rail, no card soup,
  no drop shadows. Inter-card gaps are real block seams.
- `harness/out/peek/ms-index@1440+0.png` — 64 px header, hero, seam at y≈490 with 64 px padding either
  side. One orange button on the whole first screen.
- `harness/out/peek/ms-index@1440+2300.png` — the four cert cards each ending in an orange underlined
  **"Learn More"**: the visible cause of Lighthouse SEO 92 on index.html.
- `harness/out/peek/ms-projects@390+250.png` — 1-up project cards; **"View Guide" is a quiet hairline
  outline button, not an orange fill**. This materially lowers ad/content confusion on the listing grid.
- `harness/out/peek/ms-project@390+0.png` — breadcrumb → level badge → h1 → subtitle → seam → overview
  card. No ad-shaped element near the top of the article.
- `harness/out/peek/ms-project@390+3600.png` — numbered steps separated by hairlines with ~48 px gaps:
  usable in-article injection seams all the way down an 11,889 px page.
- `harness/out/peek/ms-project@390+prefooter.png` — **the problem screen.** `.guide-navigation` puts a
  large orange-filled "Back to All Projects" button ~48 px above the navy footer, i.e. exactly in the
  end-of-article Auto-ads slot.
- `harness/out/peek/ms-project@1440+bottom.png` — same pair at 1440; orange fill is still the last
  interactive element before the footer band.
- `harness/out/peek/ms-project@390+bottom.png` — footer only; confirms nothing is fixed/sticky at the
  bottom, so a bottom anchor ad has clear air.

## Gate results

`console=0` (all 20 public pages × 3 widths; the 3 in `summary.json` are admin.html's known local
`/.auth/me` 404) · `axeSC=0` · `axeAll=0` · `perf=99–100` · `a11y=100` · `bp=100` ·
`cls=0` on every public page/width (0.0187 appears only on admin.html@768, out of scope) ·
`lcp≤1.53 s` except resources.html 2.10 s · `hOverflow=0/63` ·
`integrity=PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)`.

Ad/tracking plumbing, verified independently of the gate:

- `git diff f1ec399 -- ads.txt` → **empty**. `git diff f1ec399 -- sitemap.xml robots.txt` → **empty**.
- `staticwebapp.config.json` `globalHeaders` CSP is **byte-identical** to f1ec399 (ad/analytics hosts
  unchanged). Only 404-blocking routes and JSON re-indentation changed.
- Per-page diff of every `googlesyndication` / `googletagmanager` / `gtag(` line vs `git show f1ec399:<page>`:
  **identical text on all 21 pages** (line numbers moved on 7 pages because the `<head>` shrank).
- Live DOM audit of all 20 public pages: `ins.adsbygoogle` = **0 everywhere**; loader present on 19,
  absent on 404.html; GA `G-VBQ33BLD4E` on the same 19; `consentMode` still false (no CMP added).
  The gate also enforces this itself via `AD_FIELDS = ['adsenseLoader','gaId','consentMode']`.

SEO, verified per page (live DOM at 390, all 20 public pages):

- Exactly **one `<h1>`** on every page.
- **Heading order: 0 problems on every page** with `aria-level` applied (the footer `h4`s carry
  `aria-level="2"`, tools.html `.tool-card` `h4`s carry `aria-level="3"`). No `h3` follows an `h1`.
  Baseline had `heading-order` failing on 16 pages — this is a real improvement.
- `title` / `canonical` / `meta[description]` / `meta[robots]` **identical to
  `harness/baseline/baseline-2026-09-13.json` on all 20 pages** (only difference is a `null`-vs-`""`
  artefact on 404.html, which has neither at baseline either). Integrity gate covers the same fields.
- `robots` = `index, follow` on 19 pages; `noindex` only on 404.html, as at baseline. **No noindex leak.**
- JSON-LD **parses on every page that has it**, and the type sets match INVENTORY §3 exactly:
  index = WebSite+Organization+BreadcrumbList+FAQPage; projects/resources = CollectionPage+BreadcrumbList;
  tools = WebApplication+BreadcrumbList; interview-prep = FAQPage+BreadcrumbList; about = AboutPage+BreadcrumbList;
  privacy = WebPage+BreadcrumbList; contact, 404 and the 11 project pages = none. Nothing added, nothing lost.
- Breadcrumbs: present on all 18 non-home, non-404 pages, every one is `<nav class="breadcrumbs" data-ui>`
  with `aria-current="page"` on the last crumb, and **zero BreadcrumbList JSON-LD inside any of them** —
  structured data stayed frozen, as required.
- Lighthouse SEO: 100 on projects, resources, interview-prep, about, project-multi-account-landing-zone;
  **92 on index.html and tools.html**. I read `harness/out/wave1-r1/lighthouse/index.json` and
  `tools.json` audit-by-audit: `is-crawlable=1, document-title=1, meta-description=1, http-status-code=1,
  crawlable-anchors=1, robots-txt=1, hreflang=1, canonical=1` — **`link-text` is the only failing SEO
  audit on either page** ("4 links found" on index, "1 link found" on tools = the five frozen
  "Learn More" links, seen in ms-index@1440+2300.png). Confirmed: that is the sole cause.

Performance for RPM: every page's transfer in `harness/out/wave1-r1/summary.json` is **at or below**
`harness/out/baseline-2026-09-13/summary.json` at all three widths (0 rows over baseline; index −4 KB,
projects −3 KB, interview-prep −3 KB, project pages 0). CLS is **0** everywhere — the baseline's
0.254/0.141/0.090 async-CSS shifts are gone, which is the single biggest RPM win here: viewable
impressions stop being destroyed by a post-paint reflow. resources.html LCP 2.10 s is unchanged from
baseline and is the eight book-cover JPEGs (1.1 MB on disk), not the shell.

## Ranked issues (worst first)

1. **Orange primary CTA sits in the end-of-article ad slot.** — PAGE-triggered, **COMPONENT fix**.
   `project-*.html` (11 pages), 390 and 1440 —
   `harness/out/peek/ms-project@390+prefooter.png`, `harness/out/peek/ms-project@1440+bottom.png`.
   `.guide-navigation` renders `<a class="btn-primary">Back to All Projects</a>` as a solid orange
   filled button with ~48 px of paper below it before the navy footer, and ~12 px above it to the
   outline "← Previous Project" at 390. This is the exact seam where Auto ads places its
   before-footer / end-of-article unit, and "solid coloured button immediately adjacent to an ad" is
   the canonical accidental-click pattern AdSense penalises. It also contradicts the builder's own
   decision #1 (quiet CTAs precisely so cards don't read as ads) — the one place the orange fill
   survives is the worst place for it.
   **Fixed looks like:** a reserved, labelled `.ad-well` placed *between* `.guide-navigation` and the
   footer so the ad has a defined home with ≥48 px clearance on both sides (ad-presentation, Wave 3),
   **and** `.guide-navigation` demoting "Back to All Projects" to the quiet outline variant so no
   filled button is the last interactive element before the footer (article-template, Wave 2). Fix the
   `.guide-navigation` rule once, not the 11 pages.

2. **`.ad-well` caps desktop inventory at 623 px.** — COMPONENT (`.ad-well`, styles.css:519-521).
   `.ad-well { max-width: var(--measure) }` and `--measure: 68ch`. Measured with a live probe injected
   into `<main>`: the well computes to **623 px wide at 1440** (390 px at mobile, fine). 623 px cannot
   serve a 728×90 leaderboard or a 970×250 billboard, so every desktop well is pre-limited to the
   300/336 tier — a straight RPM ceiling on the widest, highest-CPM viewport, inside a 1200 px container.
   **Fixed looks like:** a dedicated `--ad-w` token rather than reusing the prose measure —
   e.g. `.ad-well { max-width: min(100%, 970px) }` (or 728 px if the editorial column must be respected),
   with the *slot* still centred. Reading measure stays 68 ch; the ad stops being throttled by it.

3. **The collapse rule guarantees a ~339 px layout shift the first time it fires.** — COMPONENT
   (`styles.css:526`). `.js .ad-well:has(> .ad-well-slot > ins[data-ad-status="unfilled"]) { display: none; }`
   removes the *whole* well — label, 280 px reserved slot, 48 px margin — but `data-ad-status="unfilled"`
   only arrives after the ad response, i.e. after first paint. The page therefore paints a visible,
   labelled 339 px grey box and then deletes it: a CLS event on exactly the pages where CLS was just
   driven to 0, and it violates the protocol line "never collapse a visible slot".
   **Fixed looks like:** decide once — either reserve and *keep* the space (collapse the slot to
   `min-height: 0` only, or not at all), or don't reserve and let the well grow on fill. If collapse is
   kept, gate it on a pre-paint signal, not on a post-response attribute. Must be settled before any
   `<ins>` ships in Wave 3.

4. **The entire `.ad-well` family is dormant and therefore unproven.** — COMPONENT.
   Live audit: `.ad-well` instance count is **0 on all 20 pages**; nothing in the repo emits the markup.
   So the label wording, the `--ad-h` reservation, the collapse rule and the well's behaviour with JS
   off have never been rendered, screenshotted, or measured — including by the builder, whose §6 list
   contains no ad-well screenshot. The eight lines are also ~700 B of CSS shipped to every page today
   for zero current benefit. Positively: the gate already excludes `.ad-well` from the content snapshot
   (`CHROME = '[data-harness-placeholder],[data-ui],nav,button,.ad-well'`), so the plumbing is ready.
   **Fixed looks like:** Wave 3 ships one well behind a placeholder in a `_showcase/` page (or the
   harness paints one), screenshots it filled / unfilled / `.no-js`, and only then claims it works.

5. **styles.css is currently 16 B over the frozen baseline, and the recorded numbers are stale.** —
   COMPONENT (design-system). `wc -c styles.css` = **35,534 B**; `git show f1ec399:styles.css | wc -c`
   = **35,518 B**. The builder's report claims 35,333 B, so ~201 B were added *after* the
   `wave1-r1` snap (snap ran 06:17 UTC; styles.css mtime 06:22 UTC). `harness/serve.js` sends no
   `Content-Encoding`, so that is +201 raw bytes on all 20 pages, and the 11 project pages had a
   measured delta of exactly 0 KB. The "every page ≤ baseline" result in §4 of the builder report no
   longer describes the tree.
   **Fixed looks like:** re-run `node harness/snap.js --label wave1-r1b` against the settled tree and
   re-state the weight table; get styles.css back under 35,518 B before Wave 2 starts spending the
   remaining headroom.

6. **Lighthouse SEO is 92, not the budgeted 100, on index.html and tools.html.** — PAGE (content, blocked).
   Single cause confirmed above: five frozen "Learn More" links. Not a Wave 1 regression (baseline was
   also 92 on both), but the area cannot meet the ARCHITECTURE budget while it stands.
   **Fixed looks like:** the director approves the builder's option (b) — a descriptive `aria-label`
   on each of the five links that *contains* the visible text ("Learn More about the AWS Cloud
   Practitioner exam"). Visible copy unchanged, so the content gate never sees it, WCAG 2.5.3 satisfied,
   and `link-text` passes. This needs one line in `docs/APPROVALS.json`-equivalent sign-off, not a code
   decision, and it is the only thing standing between this area and a clean SEO budget.

7. **11 project pages now show a visible breadcrumb with no BreadcrumbList markup.** — COMPONENT
   (`.breadcrumbs` applier) — `harness/out/peek/ms-project@390+0.png`.
   Correct for this round (structured data is frozen and the builder rightly did not add JSON-LD), but
   it leaves the site's 11 longest, most link-worthy pages as the only ones with a rendered breadcrumb
   trail and no machine-readable equivalent — the other seven pages have had BreadcrumbList since
   baseline. That is a missed breadcrumb rich-result on exactly the pages that would benefit.
   **Fixed looks like:** an `ld` approval adding BreadcrumbList to the 11 project pages, matching the
   shape already used on projects.html. Human call, not a builder change.

## Nits

- **Top anchor ads would double-bar the viewport.** The header is `position: sticky; top: 0`
  (56 px mobile / 64 px desktop, `z-index: 100`); Google's anchor sits far above that z-index, so a
  *top* anchor would stack on top of the sticky header and eat ~106 px of an 844 px phone screen
  (`ms-index@390+0.png`). Bottom anchor is clean — I confirmed programmatically that there are
  **zero `position: fixed` elements and zero sticky/fixed elements with `bottom` set** on index,
  projects, interview-prep and a project page at 390 and 1440. Recommend the human keep top anchor OFF
  and bottom anchor ON when recording HUMAN_TODO B1.
- **Section rhythm is genuinely ad-ready, measured not eyeballed.** Every `<main>` child seam has
  48 px bottom padding + 48 px top padding = **96 px of clear whitespace at 390**, and 64+64 = **128 px
  at 1440** (index.html has 8 such seams). That is real room for an in-article unit without crowding.
  Project pages expose only 2 top-level seams, but the step rail inside provides ~48 px seams the whole
  way down (`ms-project@390+3600.png`).
- **First injection seam on index@390 is at y=592 in an 844 px viewport** — an ad there starts above the
  fold but below the h1, stats row and hero CTA. Policy-compliant, but worth watching once Auto ads
  formats are recorded.
- **`ms-index@390+0.png`: the orange "Start Your Journey" button ends ~52 px above the hero seam.** If
  Auto ads takes that first seam the gap between a solid orange button and an ad is thin. Lower risk
  than issue 1 (the section's own 48 px top padding pushes the ad content to ~100 px below the button),
  but the same pattern.
- **No hidden-text / policy-adjacent tricks introduced.** Grepped styles.css for `text-indent:-`,
  `font-size:0`, `visibility:hidden`, `clip`, `clip-path:inset(100…)`: the only hits are
  `.nav-toggle span { opacity: 0 }` (a hamburger bar) and the skip link at `top:-100px` with
  `:focus { top: var(--sp-3) }` — the standard, correct technique. The FAQ uses `max-height: 0;
  overflow: hidden`, which is a normal accordion and matches baseline behaviour. Nothing here would
  trouble an AdSense policy review.
- **Watch that Auto ads never lands inside a collapsed `.faq-answer`** (`max-height: 0; overflow: hidden`)
  — an ad injected there would be clipped to zero height, i.e. an unviewable impression. Worth an
  exclusion hook, or simply keeping the FAQ list out of injection range, in Wave 3.
- **`class="no-js"` is set on 19 pages but no `.no-js` rule exists in styles.css** (it appears only in a
  comment at line 518). Harmless and a reasonable hook, but today it is ~133 B of dead attribute; either
  use it or drop it given the byte headroom warning.
- **404.html has no skip link** (it is the only public page without one). It is `noindex` and never
  served by SWA, so this is cosmetic.
- **Pre-existing CSP gap, not a Wave 1 problem:** `script-src` / `connect-src` / `frame-src` do not list
  `https://ep2.adtrafficquality.google` or `https://www.google.com`, which current AdSense uses for its
  anti-abuse and spam-detection calls. Unchanged from baseline and out of my scope to fix, but it may be
  quietly costing fill. Worth a HUMAN_TODO entry.
- **Process flag: the tree moved while I was auditing it.** My first
  `node harness/integrity.js compare --base baseline-2026-09-13` returned
  `INTEGRITY: FAIL (1 content, 0 ad/tracking, 0 rejected approvals)` — a `[pre]` diff on
  project-static-website.html (`{\n    "Version"` vs `{\n      "Version"`), and that file had CRLF line
  endings and was 346 B heavier at that moment. Two minutes later the same command returned
  `INTEGRITY: PASS`, and the file was back to LF. So the gate is clean *now*, but the Wave 1 result was
  measured against a tree that other hands were editing during the round. Also note
  `harness/integrity.js` and `harness/baseline/baseline-2026-09-13.json` are themselves uncommitted
  working-tree changes: the gate was loosened on `internalLinks` (fragment-only hrefs dropped, which is
  what unblocked the skip link the builder's §3 said was blocked) and tightened with a new
  whitespace-exact `pre` field. I spot-checked that the backfilled `pre` baselines come from f1ec399
  content, not from the current tree — the transient FAIL above proves it. But the gate and the frozen
  baseline changing inside the round being gated deserves an explicit sign-off from the integrator.

## What earns the 8.6

Everything the monetization brief asks to be *untouched* is provably untouched, by two independent
methods (the gate, and a byte-level diff against f1ec399): ads.txt, robots.txt, sitemap.xml, the CSP,
the AdSense loader and the GA snippet on all 19 pages, zero manual `<ins>`, no CMP change. Every SEO
field I can check per page is identical to baseline, heading order is now clean on 16 pages where it
was failing, and CLS went from 0.254/0.141/0.090 to a flat 0 — which is worth more to real-world RPM
than anything else in this round. Auto ads has measurably good room to inject, and the quiet card CTAs
were the right call for click quality.

It is not a 9+ because the one component that is actually *mine* — `.ad-well` — ships with a desktop
width cap that throttles inventory, a collapse rule that would reintroduce the CLS this round just
eliminated, and zero rendered instances to prove any of it; because the prime end-of-article ad slot on
the 11 longest pages is currently occupied by a solid orange button; because styles.css is over the
frozen byte budget as of this writing and the recorded weights are stale; and because SEO is 92, not
100, on two pages.

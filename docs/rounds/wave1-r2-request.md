# Wave 1 round 2 — change request (integrator, 2026-09-13)

Round 1 verdicts: creative director 7.6 FAIL, reader 7.4 FAIL, monetization & SEO 8.6 PASS.
Sources: docs/rounds/wave1-r1-creative-director.md, wave1-r1-reader.md, wave1-r1-monetization-seo.md.
Areas: design-system + layout-shell (one builder). Everything below is a COMPONENT fix unless marked.

## Must fix (ranked)

1. **Page header ↔ article alignment at ≥ 64em (CD #1, reader #5).** On the 11 project pages the
   `.page-header` content starts at the container gutter (x≈151) while the article grid track
   starts at x≈409. Fix once: give `.page-header .container` on project pages the same grid as
   `.project-guide` (`grid-template-columns: minmax(0, 68ch) 260px`-style, explicitly placed, content
   in column 1) so h1, eyebrow, subtitle and article share one left edge. Coordinate with the
   article-template builder's landed grid (read their round report first; the aside is now real).
   Listing/static pages already align (CD confirmed on projects@1440).
2. **Mobile drawer (CD #2, reader #1, #7).** (a) DOM order: move `<button class="nav-toggle">`
   BEFORE `<ul id="site-nav">` in harness/apply-shell.js so forward Tab enters the menu; keep
   Escape → focus returns to toggle. (b) Full-height drawer or dropdown with a scrim (`::backdrop`-like
   overlay element or `.site-nav.is-open::before`), body scroll locked while open
   (`html.nav-open { overflow: hidden }` toggled by script.js), no hard cut through content.
3. **Tap targets (reader #2).** `.nav-toggle` ≥ 44×44 hit area; brand link, breadcrumb links,
   footer links, `.cert-link` → padding-block so hit boxes ≥ 44 px (negative margins keep rhythm);
   footer links spaced so hit zones don't overlap. CSS only.
4. **Skip link focus (reader #4).** apply-shell.js: `<main id="main" tabindex="-1">`; CSS
   `main:focus { outline: none }`. Verify `document.activeElement === main` after activation.
5. **`.highlight` applied mechanically (CD #3).** "About **Us**" / "Contact **Us**" render the span
   in accent. CSS-only: on `.page-header h1 .highlight` (non-home pages) inherit the ink colour;
   keep the accent on the home hero only. Text unchanged.
6. **Section-heading rules (CD #4).** Seven rule lengths on index@1440. One rule treatment:
   full-width hairline above the section (or a fixed 3rem short rule), identical at every width.
7. **Colour discipline (CD #5).** Reduce badge/tag families on one screen: service chips → neutral
   (ink-2 on paper-2 with hairline), keep semantic tint only for level/difficulty badges; cert-card
   hues → one accent top rule or none; Pluralsight pink → outline only, already. Reconcile per
   component (list every tag/badge/chip component and its treatment in the report).
8. **Home hero and CTA band at 1440 (CD #6).** Align to two edges max: h1 and subtitle share the
   measure (`max-width: 40ch` on h1 is fine, but subtitle and stats rule end at the same edge);
   the CTA band content left-aligned or centred consistently, not three different widths.
9. **Measure outside `.project-guide` (CD #8, reader #6).** `.roadmap-content`, `.content-text`,
   `.faq-answer p`, `.section-subtitle`: cap at `--measure` (68ch) at ≥ 64em.
10. **Focus ring on navy (CD focus screenshots).** `:focus-visible` inside `.site-header`/`.site-footer`:
    use `--on-navy` (light) ring so it isn't muddy on navy.
11. **Ad-well CSS (M&S #2, #3) — layout only, Wave 3 will wire it, but fix the CSS now:**
    `.ad-well { max-width: min(100%, 970px) }` (not the prose measure); remove the `:has()` collapse
    rule entirely — collapse becomes a JS decision in Wave 3 (only when the well is below the
    viewport at the time `unfilled` arrives). Keep `.no-js` never collapsing.
12. **Bytes.** styles.css is 35,534 B vs 35,518 B baseline (+16). Get design-system + layout-shell
    sections under their Wave 1 size again; the total sheet may grow modestly because Wave 2
    sections grew, but per-page transfer must stay ≤ baseline (docs/INVENTORY.md §6 — there is
    ~3 KB/page headroom from the 2-space re-indent; do not consume it all).

## Explicitly NOT in this round (blocked / other owners)
- "Learn More" link text (SEO 92 on index/tools): needs a content approval — HUMAN_TODO A5.
- resources.html LCP 2.1 s: listing-pages builder is re-encoding the book covers.
- `.guide-navigation` orange "Back to All Projects" above the footer (M&S #1): article-template owner.
- On-page nav / heading ids (reader #3): article-template owner (landing in Wave 2).
- 404.html shell (CD #7): by design self-contained; SWA never serves it. Parked in docs/IDEAS.md.

## Pass criteria for round 2
All three critics ≥ 8.5 on the Wave 1 areas; 0 console errors; 0 serious/critical axe; CLS ≤ 0.05;
perf ≥ 95; a11y/BP 100; SEO 100 except the two content-blocked pages (92, documented);
`INTEGRITY: PASS`; fresh snap + lh labels (`wave1-r2`) taken AFTER the last edit.

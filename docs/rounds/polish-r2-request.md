# Whole-site polish — round 2 request (integrator, 2026-09-13)

Final-gate state: every area PASS (listing re-scored 8.6). Whole-site: creative director **8.4 FAIL**
(threshold 8.5), monetization & SEO 8.8 PASS, reader pending. Blind A/B: new wins 42/42, means
8.36/8.39. This round closes the CD's whole-site list plus judge/M&S nits. Evidence:
docs/rounds/final-creative-director.md, final-monetization-seo.md, final-ab-judge1.md, final-ab-judge2.md.

## Must (CD whole-site, worst first)
1. **Home hero at 1440 is 45 % empty (CD worst screen).** At ≥ 64em make `.home-hero .container` a
   two-column grid: column 1 = h1 + subtitle + CTA (measure), column 2 = the three stats as a
   ruled vertical list (same text, same DOM — reorder only via CSS `grid-area`s, no markup text
   change). Explicit placement, no auto-placement. Below 64em unchanged (1/1/1 stats rows).
2. **Article column has two right edges at 1440** (prose 776, code/diagrams 992). Bring
   `.code-block` and `.architecture-diagram` back to the prose column width (624 px); code that
   is wider scrolls inside the block (43 blocks: only 2 exceed 776 px). Keep the rail at 1040.
   Then ad wells in `.project-guide` also match the prose width.
3. **Page-header band widths** (h1 895 px, subtitle 767 px on 7 pages): cap both at the article
   measure so the band has one right edge equal to the prose column (project pages: 776).
4. **Footer: two footers.** about/privacy have 3 `.footer-section`s (content), the rest 4. Use
   `grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr))` at ≥ 48em so 3 or 4 columns fill
   the row without a void under column 1; single column below.
5. **List markers: a fourth bullet leaked** (`list-style: circle` at depth 2 on interview-prep, 98
   items): force the same disc/dash at every depth site-wide.
6. **"Advanced" three ways / control vs label chips.** (a) `.book-tag` and `.course-meta` text that
   repeat a level word: give tags the neutral chip treatment and levels the pill treatment
   consistently (a level word inside `.book-meta` stays a neutral tag — document the rule);
   (b) clickable chips (`.level-jump a`, `.guide-aside a` chips) get a visible control cue that
   inert tags never have: 1px `--line-2` border + underline-on-hover + chevron `::after`; inert
   tags: no border, `--paper-2` fill. Reconcile per component; list them in the report.
7. **Pluralsight promo reads as an unlabelled ad** (M&S: 292×249 at 390, filled orange CTA, no
   disclosure; CD: identical to `.course-card`). Make it unmistakably editorial: a small-caps
   `data-ui` eyebrow "Partner" on the panel, quiet outline CTA (not the orange fill), paper-2
   ground with a hairline (no card shell), and never within 12 px of a 300×250 shape at 390
   (measure: width ≠ 280–320 or height ≠ 230–270). Text unchanged.
8. **404 strip has no wordmark** — cannot add text; instead put the existing `☁` glyph next to a
   hairline-ruled band the same height as the shell header so it reads as the site's header.
   (CD accepted the glyph.) Leave if already so; screenshot it.

## Should (judges' nits, cheap)
9. Tablet/mobile TOC chip strip hard-clipped mid-chip with no fade at 768 (judge 1 saw it in the
   768 capture): the veil exists at 390 — make sure it renders at 768 too (screenshot).
10. "Key Skills" navy panel: orange-on-dark-brown tags flagged as a contrast failure by judge 1 —
    measure the tag text/background contrast (≥ 4.5:1) and fix the tint if under.
11. tools.html: a `<select>` whose selected option label is truncated at 390 (judge 2) — measure
    and widen/wrap the control.
12. Intra-card rules misaligned when titles wrap (judge 1) — cert/project cards: keep the rule
    anchored to the card bottom band (already `margin-top:auto`?) — verify at 768 and 1440 and
    screenshot a row with a wrapped title.

## Verify (fresh after last edit)
`node harness/snap.js --label polish-r2` (all), `node harness/lh.js --label polish-r2`,
`node harness/integrity.js compare --base baseline-2026-09-13` (PASS), `node harness/weight.js`
(record; styles.css ≤ 8,700 B gzip), all four appliers `--check` → 0. Per item: screenshot
evidence + measurements. Budgets unchanged (0 console, 0 axe, CLS ≤ 0.05, perf ≥ 95, a11y/BP 100,
SEO 100 except index/tools 92).

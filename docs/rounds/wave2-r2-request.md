# Wave 2 round 2 — change request (integrator, 2026-09-13)

Round 1 verdicts (creative director / reader / monetization & SEO):
article-template 7.8 / 7.8 / 8.2 FAIL · code-and-diagrams 7.4 / 8.2 / 8.8 FAIL · listing-pages 7.9 / 8.2 / 8.3 FAIL · static-pages 8.2 / 8.3 / 8.7 FAIL.
Evidence: docs/rounds/wave2-r1-{creative-director,reader,monetization-seo}.md (screenshot paths inside).
Ranked per area, worst first. COMPONENT unless marked PAGE. Items marked (shell) were fixed by the
Wave 1 round-2 builder — verify, do not redo.

## article-template
1. **Register at ≥ 64em (CD #1, M&S #2).** `.project-guide` is `justify-content: center`, leaving
   132 px dead on both sides; footer/article/rail on three left edges. Left-align the grid to the
   container gutter (`justify-content: start`), page-header band on the same edge (shell r2 did the
   header; confirm `.page-header h1` left == `.guide-overview h2` left == 152 at 1440), rail in column 2.
   Widen the diagram/code track: let `.architecture-diagram` and `.code-block` break out of the 68ch
   measure to the full article column (CD #5) without exceeding the rail's left edge.
2. **Chip row at 390 (CD #2, reader #1, #4).** 3 of 7 chips visible with no affordance; chips 29.9 px
   tall. Fix: right-edge fade veil (like the code veil), the "On this page" label visible as a small
   eyebrow (it is inside the data-ui aside, so gate-safe), chips ≥ 44 px hit area (padding, not
   larger type), and the row must show the partial chip cut mid-word so it reads as scrollable
   (adjust gap/padding so a chip straddles the edge at 390 and 768).
3. **Focus order (reader #2).** Aside FIRST in DOM in apply-article.js (before the overview), drop
   the `order` rules; on desktop it still sits in column 2 via explicit placement.
4. **Step anchors (reader #3).** Give every step `h3` an id (`step-1`…) and add the steps as a
   nested list under "Step-by-Step Instructions" in the rail/chips? No — keep the rail to h2s, but
   add ids so deep links work, and make each step number an anchor link to itself (data-ui not needed:
   the number text is unchanged).
5. **Current-section indicator (CD #3, reader #5).** `:target` only marks on click. Add a tiny
   IntersectionObserver in script.js (≤ 350 B, owned by shell — coordinate: write the snippet, the
   integrator will merge it) that sets `aria-current="location"` on the rail link of the visible h2;
   style it with the accent rule. Must not run below 64em.
6. **Pagination (CD #4).** Two empty white boxes → give each card an eyebrow-style direction cue
   drawn with CSS (`::before` arrow glyph is fine: pseudo-content is not in innerText? — it IS
   excluded from innerText, verify with the gate) and the existing link text as the title.
7. **Key-facts dt column (reader #6).** Below 48em let the dt shrink to content (max 30%).
8. **Ad-well width (M&S #1) (shell r2 sets `width: 100%`)** — verify in the article grid a well
   spans the article column. `#architecture` id missing on project-infrastructure-as-code.html
   (its h2 is "Choose Your Tool"): AD_PLAN will anchor on section order, not id — note only.

## code-and-diagrams
1. **Syntax highlighting does not exist (CD #1).** The six syntax classes match nothing; all 43
   blocks are flat. Build-time tokenizer in harness/apply-code.js (idempotent, `--check`): wrap
   comments (`#`, `//`, `/* */`), strings ('...' "..."), numbers, and a small per-language keyword set
   (BASH: aws/export/if/then/fi/for/do/done/echo + `--flags`; JSON: keys as .variable; YAML: keys;
   HCL/Terraform: resource/variable/output/provider/module + block types; Python: def/return/import/
   from/if/else/for/in/try/except/with/as/lambda; JavaScript: const/let/function/return/await/async/
   import/export). Wrap tokens in `<span class="…">` inside `<pre><code>`. HARD RULE: `pre.textContent`
   must be byte-identical before/after (the gate's `pre` field will catch any slip); run the gate after
   every page. Keep colours ≥ 4.5:1 on `--code-bg`; comments muted, strings warm, keywords cool.
   Budget: ≤ 700 B gzip per project page.
2. **Multi-region diagram topology at 390 (CD #2, reader #2) — PAGE.** Region B wraps outside the
   replication pair and `↔` points at nothing. Make the two-region row a non-wrapping 2-col grid at
   every width (nodes shrink, labels wrap) so the arrow stays between the regions; verify at 320 too.
3. **Copy reachability on tall blocks (reader #1).** `.code-header { position: sticky; top: var(--header-h) }`
   inside the block (the block is `overflow: hidden`? then make the header sticky within a scroll
   container or make `pre` max-height ~70vh with inner vertical scroll — pick the one that keeps
   Copy visible on the 1,581 px block on project-serverless-rest-api.html; verify by screenshot at
   scrollY mid-block).
4. **Node hues (CD #3).** Six role colours, two indistinguishable, no legend: reduce to three
   (compute/data/security) or make role a small-caps prefix in the detail line via CSS `::before`
   (pseudo-content is not innerText). Pick one; document.
5. **Code header hierarchy (CD #4).** File label should lead (ink, 13 px, mono), language chip
   secondary (quiet outline), Copy last.
6. **Scroll veil too quiet at 390 (reader #3); "way back" after scrolling (CD #5).** Stronger veil
   (16 px, higher contrast) on both edges when scrolled (left veil when scrollLeft > 0 — CSS-only via
   `background-attachment: local` trick already in place for the right; mirror it).
7. **Detail text 12 px → 13 px (reader #4); 2-up node name wrapping (reader #5).** Allow 1-up for
   nodes whose name exceeds ~14 chars via `min-width: min(100%, 11rem)`.

## listing-pages
1. **tools.html untouched template (CD #1) — PAGE.** Four emoji cards + four generic buttons: tool
   cards as ruled rows (icon greyscaled small, title, one-line description, quiet link), calculator
   first; the "Learn More" (well-architected) link stays text-frozen.
2. **Roadmap prose measure (CD #2, reader #4).** ~100 cpl at 1440, ~29 cpl at 390: cap
   `.roadmap-content` at 60ch and let the number gutter collapse to 1.5rem at 390 so the card
   gets ≥ 300 px.
3. **Cert cards (CD #4, reader #1).** Drop the four coloured top bars (one hairline + small-caps
   eyebrow only); "Learn More" links → ≥ 44 px hit area via padding (text frozen).
4. **Salary "featured" card (CD #5).** Remove the pricing-table emphasis; three equal panels, the
   middle marked by the eyebrow only.
5. **Book-card cover plate (CD #3).** Cover on `--paper-2` with a hairline, fixed 3:4 box,
   `object-fit: contain`, explicit dimensions kept.
6. **Calculator checkboxes (reader #2).** Inputs 20 px, labels as 44 px rows.
7. **projects.html "no way in" at 390 (reader #3).** A compact level jump list under the page
   header (data-ui nav: Beginner / Intermediate / Advanced → section ids) — anchors only.
8. **Interview rows → real `<button>`s (M&S #6)** inside the row (keep answers display:none on load;
   question text unchanged).
9. **Ad room (M&S #1, #2).** `listing-mid` after `.interview-grid`; `.ad-well` inside `<main>` on
   index needs the container gutter — shell r2 owns `.ad-well`; verify `home-mid` position would sit
   inside `.container`.
10. Nits: interview `+` affordance closer to text; category rhythm.
Blocked/other: resources LCP 2.18 s (h1 is LCP element; shell/perf item — integrator), affiliate
disclosure + `rel="sponsored"` on resources.html (HUMAN_TODO), `sap-c02.jpg` wrong photo (HUMAN_TODO),
"Learn More" text (HUMAN_TODO A5).

## static-pages
1. **Check marks as privacy list markers (CD #1, reader #5).** `.prose .feature-list` on privacy →
   neutral markers (hairline rows without the accent tick); keep the tick only on about's "What We
   Offer".
2. **Contact status placement (reader #1) — PAGE + COMPONENT.** Move `#formStatus` above the submit
   button (markup order change, content unchanged), reserve `min-height` so it doesn't shift, and
   `role="status"` stays; the inline script is frozen — no scrollIntoView needed if it's above the fold
   at the button.
3. **`.note` measure (reader #2).** 68ch cap at ≥ 64em.
4. **contact.html at 1440 (CD #3).** Give the form column a quiet companion: nothing new in text —
   use the existing subtitle and generous margins; the form at 40rem left-aligned with the prose
   edge (verify left edges equal).
5. **404.html (CD #2, reader #3).** Keep self-contained but match the shell visually: a paper
   header strip with the wordmark text (text "AWS Cloud Architect Guide" is already on the page? — if
   not, do NOT add it; use the cloud mark only, aria-hidden), the 404 numeral, the existing copy and
   link. No second door without a content approval.
6. Nit: labels 13 → 14 px.

## Pass criteria
All three critics ≥ 8.5 per area; 0 console errors; 0 serious/critical axe; CLS ≤ 0.05; perf ≥ 95;
a11y/BP 100; SEO 100 (index/tools 92 content-blocked); `INTEGRITY: PASS`; fresh labels
`<area>-r2` after the last edit; `node harness/apply-shell.js --check`, `apply-article.js --check`,
`apply-code.js --check` all 0 pages would change.

# Whole-site polish — round 1 request (integrator, 2026-09-13)

State: Wave 1 r2 = CD 8.6 / reader 8.6 / M&S 8.7 (re-verified) PASS. Wave 2 r2 = article 8.7/8.6/8.6,
code 8.6/8.8/8.9, static 8.6/8.7/8.8 PASS; listing 8.4 (CD) / 8.7 / 8.6 → FAIL on two cheap items.
This round is one builder across all areas (nobody else is editing). Evidence: docs/rounds/wave1-r2-*.md,
wave2-r2-*.md. Ranked by what the critics said still blocks 9+.

## A. Must (listing pass + cross-area coherence)
1. resources.html second accent `#9d174d` (`.ps-logo`, promo rule, `.course-level` "LEARNING PATH" chips) → ink/neutral; the partner panel stays quiet paper. (CD listing #1)
2. Eight full-colour emoji in `.course-meta` → the same greyscale/opacity treatment as tools.html; site-wide rule: every emoji-as-icon in `.tool-icon`, `.course-meta`, `.arch-component-icon` shares ONE treatment (one selector list). (CD listing #2, CD inventory)
3. Chip/badge radius: one token for all pills (`.tag`, `.book-tag`, `.project-services span`, `.roadmap-skills span`, level/difficulty badges, article TOC chips, projects level-jump chips) — pick `--radius-sm` (5px) everywhere; delete the 3px/8px/50% variants. (CD inventory: four radii)
4. List markers: at most two treatments site-wide — (a) neutral em-dash rows (`.cert-card ul`, `.salary-card ul`, `.prose-compact .feature-list`), (b) accent tick (`.feature-list` on about/home/projects tips). Remove the others (`li::marker` colour variants, `.guide-list` bullets vs `.step-content` bullets → one bullet style). Document the rule as a CSS comment (one line).
5. Callouts: one language for `.tips-box`, `.salary-note`, `.prose > .note`: same tint, same 3px left rule, same padding; they may differ only in tint colour (accent vs paper-2). (CD inventory)
6. "Advanced" rendered three ways: page-eyebrow pill, card pill, and interview difficulty pill must share the `.project-level`/`.question-difficulty` treatment exactly (size, radius, weight). Key-facts plain text stays (content).
7. Category heading double rule: `.resource-category h3`, `.interview-category h3` carry a 2px ink rule under them while sections carry the same rule above; keep ONE (drop the h3 rule, use the hairline + small-caps eyebrow language). (CD r1 #4 partial)
8. Home hero + CTA/FAQ band rules: the band's hairline rule must end at the content's right edge (792) or span the full container consistently on every band; seven content widths under one rule is the complaint — align section heading/subtitle/content to one width per band. (CD r1 #6 partial)
9. Hero stats at 390 wrap 2+1: make it 1/1/1 rows with a hairline between, or 3 equal columns at `--fs-1`; no orphan. Footer at 390: single column, no voids.

## B. Must (reader/M&S residuals)
10. Drawer focus trap: while `html.nav-open`, Tab/Shift+Tab cycle inside the header (toggle + 6 links); Escape closes; ≤ 12 lines in script.js. (reader W1 r2 #1)
11. Breadcrumb hit boxes ≥ 44 px and not under the sticky header: give `.breadcrumbs` top padding so the first 5 px are not covered, or `scroll-padding`. (reader W1 r2 #2)
12. Step self-anchors "1"…"6" are unlabelled tab stops: `aria-label="Step 1"` etc. via apply-article.js (attributes are gate-safe). (reader W2 r2 #1)
13. Diagram node names break mid-word at 320 ("Dyna/moDB"): `overflow-wrap: normal; hyphens: none; min-width: fit-content` within the pair grid, allow the pair to become 1-up below 22rem container width. Right code veil must not appear when the block does not overflow at 320 (verify). (reader W2 r2 #3)
14. Contact status: reserve the slot always (drop `display:none` on the empty `#formStatus` — it is empty at baseline so the text gate is unaffected; keep `role=status`) so showing it never moves the button. (reader W2 r2 #4; static builder option)
15. 404.html header strip: navy like the shell (`--navy` band with the cloud glyph in `--aws-orange`), keep self-contained and ≤ 3 KB. (CD W2 r2 static)
16. `.ad-well` inside `.project-guide`: left-align to the article column (`margin-inline: 0`) rather than centring at 235–1205 under a 152 register. (M&S W2 r2)
17. interview-prep: the 17 overlay buttons tile with 1 px seams — add `inset: 1px 0` or row gap so hit zones do not overlap; verify by `elementFromPoint` at row boundaries. (M&S W2 r2)

## C. Wave 3 — ad-presentation JS (layout only; no units are placed)
18. script.js: collapse decision. For each `.ad-well`, a `MutationObserver` on its `ins.adsbygoogle` `data-ad-status`; when it becomes `unfilled`, add `.is-unfilled` ONLY IF the well has never intersected the viewport (track with an IntersectionObserver from load) — otherwise keep the reservation. Never collapse on a missing status. Budget ≤ 450 B; script.js total ≤ 4.6 KB raw. Prove it with `harness/out/adwell-states.js`: three cases on `_showcase/index.html` (filled → stays; unfilled below viewport → collapses; unfilled after being scrolled into view → stays) with screenshots, and JS-off (`.no-js`) → never collapses.
19. `_showcase/index.html` ad-well demo: give the demo `<ins>` the real class/attributes minus client and slot? NO — keep it a non-AdSense `<ins class="adsbygoogle-demo">` so the loader can never pick it up; the states script sets `data-ad-status` on it and the collapse code must also accept that demo class (guard: `ins.adsbygoogle, ins.adsbygoogle-demo`).

## D. Bytes
20. styles.css is 42,682 raw / 9,418 gzip after Wave 2 r2 (target ≤ 8,600 gzip): strip prose comments again (keep the seven markers and one-line rule notes), merge the duplicate declarations the r2 builders re-added (`.contact-form` seam etc.), remove the five dead syntax-class comments. Do not minify to one line. Record `node harness/weight.js`.

## Verify (fresh, after the last edit)
`node harness/snap.js --label polish-r1` (all pages), `node harness/lh.js --label polish-r1`, `node harness/integrity.js compare --base baseline-2026-09-13` → PASS, `node harness/weight.js`, `apply-shell/article/code/ads --check` → 0 would change. Budgets as before; per-item screenshot evidence; component inventory table (badges/chips/callouts/markers/buttons) showing one treatment each.

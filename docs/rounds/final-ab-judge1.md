# Final blind A/B — judge 1

21 pairs, both versions of each opened as full-page captures and read at native resolution
(tall pages sliced into 1900px bands so typography could actually be judged rather than
guessed from a thumbnail). Scored 0–10 against the Stripe Docs / Cloudflare Dev Docs /
Smashing Magazine bar: typography and reading comfort, hierarchy and scanability, colour
discipline, component coherence, absence of template look, and how an ad unit would sit in
the page.

Scores: `harness/out/ab-final/scores-judge1.json`.

## What the two versions actually are

Without knowing which side is which, the 42 screenshots resolve into exactly two coherent
design systems, and every pair is one of each:

- **System A — editorial/docs.** Warm off-white ground, breadcrumb + left-aligned page title
  block, hairline rule above each section head, small-caps eyebrow labels, rule-separated
  list rows instead of nested cards, outline secondary buttons, one accent colour used
  sparingly, metadata tables, on-this-page rail, code blocks with filename/language/copy
  chrome.
- **System B — dark-hero template.** Full-bleed dark gradient hero with a dot pattern and a
  two-tone orange headline, centred section headings, white cards stacked on grey, filled
  orange pill CTAs on every card, multiple accent hues (green/blue/purple/orange) used
  decoratively, emoji in diagrams and bullets.

System A scored 8.1–8.7 across all 21 pages; System B scored 5.3–6.5. I preferred System A in
every single pair — but the *size* of the win varies a lot by page type, which is the useful
signal here.

## Three biggest gaps

1. **P0436d9 / P3acab1 / P53829a — the interview-prep page at 1440, 390 and 768 (3.0 points each, a three-way tie).**
   This page is the clearest case. In System B it is a grid of white cards, each containing
   grey sub-cards, each question a box inside a box with an orange underline on the group
   heading — the purest "generic template" artifact in the whole set, and at 1440 the masonry
   leaves two large empty card bottoms. System A rewrites the same content as one flowing
   docs column: breadcrumb, left-aligned title, small-caps category eyebrows, questions as
   rule-separated disclosure rows with a `+` affordance, difficulty chips that read as data
   rather than decoration. Nothing is lost and the page drops ~500px at desktop. The
   card-in-card removal alone is worth most of the three points.

2. **P43d805 — the tools page at 1440 (2.9).** System B floats a single narrow centred form
   card in a grey sea, with unstyled native selects and checkboxes and a full-width orange
   bar; it looks like a form someone dropped into a landing page. System A makes it a real
   tool: two-column field grid, custom checkboxes, a dark result panel that gives the page a
   terminal beat, and a reserved right rail — the only layout in the set where I could point
   at where an ad goes without it disrupting the reading column. (Same story, slightly
   smaller gaps, at 768 and 390: P95fdab 2.8, Pd02bb2 2.8.)

3. **P6d5649 — the resources page at 768 (2.6).** System B gives every book a dark full-width
   cover well plus a filled orange "View on Amazon" pill, which pushes the page to 8.2k px
   and makes the affiliate intent the loudest thing on screen. System A uses compact media
   rows — thumbnail left, title/author/description right, tags, outline CTA — at 5.1k px. The
   commercial content reads as editorial recommendation rather than as advertising, which is
   exactly the criterion about how ads sit in the page. P7407bd (same page, 1440, 2.3) is the
   same finding plus a genuinely well-handled tinted sponsor block for Pluralsight.

## Did I ever prefer the older-looking version?

No. In all 21 pairs I preferred the editorial/docs system, and I never found a page where the
dark-hero template read as better. Two pairs came close enough to be worth flagging as the
system's weakest showing:

- **Pad24b1 (about, 1440) — 8.1 vs 6.3, the narrowest gap in the set.** The editorial version
  is typographically better in every respect, but it leaves roughly the right-hand 45% of a
  1440 viewport completely empty with nothing in it — no rail, no sidebar, no ad. On a plain
  prose page with no components to organise, the docs system's advantage is small and the
  dead column is a real cost. If there is one page where the layout should either fill or
  narrow that space, it is this one.
- **P69df0e (about, 390) — 8.2 vs 6.3.** Same content, same reason: a prose page benefits
  least from eyebrows, rules and metadata tables, so the win is carried almost entirely by
  left alignment and the hanging-indent term/definition rows.

## Nits that keep System A off 9

- The on-this-page TOC becomes a horizontally scrolling chip strip at ≤768px and is
  **hard-clipped mid-chip at the right edge** with no fade or scroll affordance (P8a04da,
  Pd88a31). It reads as a layout bug, not as a scroller.
- The dark "Key Skills" / "Architecture Documentation" panels use **orange text on dark-brown
  chips** — the one contrast failure that survives into the good version (P3171f8, Pabe1d5).
- A select label truncates inside its fixed-width field on the tools page (P43d805, P95fdab).
- Card rows with wrapping titles leave the internal hairline rules misaligned across a row
  (Pabe1d5, Pfef227), and one card has a visible gap above its button.
- The right-hand well is empty on several desktop pages. Reserved space for ads is correct in
  principle, but with nothing in the capture it reads as unbalanced rather than as inventory.

## Consistency check

Scores were kept on one scale across all pairs: 8.5+ for pages that add real docs machinery
(TOC rail, metadata table, code chrome — P566439 tops the set at 8.7), 8.2–8.4 for the same
system applied to list/card/form content, ~8.1 for prose pages where the system has little to
do, 6.0–6.5 for template pages whose components are at least coherent, and 5.3–5.5 for the
card-in-card and unstyled-form pages that are the closest thing here to a stock theme.

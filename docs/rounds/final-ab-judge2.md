# Final blind A/B — judge 2

21 pairs, both versions of each opened as full-page captures (tall pages sliced into ~2000px bands so
type, code and diagrams could be judged at 1:1 rather than from a thumbnail). Scores in
`harness/out/ab-final/scores-judge2.json`.

Rubric anchor used throughout: 10 = Stripe Docs / Cloudflare Developer Docs / Smashing, 8.5 =
publication-grade with nits, 7 = good theme, 5 = generic template.

Disclosure: a directory listing I ran at the start incidentally showed file modification times. I did
not use them — scoring was done purely from the pixels, and the winner is not consistently the "1" or
the "2" slot (I scored 1 higher in 8 pairs, 2 higher in 13).

## What separated the two families

Across every pair the same two design languages recur, and they are easy to tell apart:

- **Editorial/docs language** — breadcrumb, left-aligned page header, section rules, small-caps eyebrow
  labels, hairline-separated rows instead of nested cards, one accent colour, outline buttons, code
  blocks with a filename chip + language tag + Copy, an "On this page" rail (desktop) or chip scroller
  (mobile). Typically 15–55% shorter for identical content.
- **Marketing-template language** — dark gradient hero eating the first screen, centred display
  headings, grey boxes nested inside white cards, a filled orange pill CTA on every card, coloured
  badge confetti, emoji as iconography.

The editorial pages scored 7.8–8.7; the template pages 4.5–6.0. Ads sit cleanly in the first
(the outline buttons and neutral card chrome mean a real ad unit would read as an ad); in the second
the repeating full-width orange CTA bars are already ad-shaped, so a real ad would disappear into them.

## Three biggest gaps

1. **P6d5649 (resources, 768px) — 8.5 vs 4.5.** Driven by colour discipline more than layout. The low
   scorer runs orange CTA bars *and* magenta/purple learning-path badges, top borders and buttons on the
   same screen — three unrelated accents — plus dark plinths behind every book cover. It also drops to a
   single column and runs ~60% longer. The high scorer uses cover-left list cards, one accent, outline
   buttons.
2. **P7407bd (resources, 1440px) — 8.5 vs 4.5.** The desktop expression of the same failure: eight
   identical orange CTA bars down the page, magenta badges in the learning-path row, and ragged card
   heights, against an even two-column hairline grid.
3. **Three-way tie at 3.0: P0436d9 / P3acab1 / P53829a (interview prep at 1440/390/768) and
   P573404 / P3171f8 / P35d80b (home) and P4b113e (resources, 390).** The consistent driver on interview
   prep is findability: the winner turns 16 questions into hairline-separated rows under small-caps
   category labels with a `+` affordance, so the page is scannable in one pass; the loser nests each
   question in a grey box inside a white card inside a section, and the difficulty badges get lost. On
   home, it is the hero: stats as an inline rule-bound row versus three centred stats stacked down a
   whole phone screen.

## Where I preferred the more conventional-looking version, or nearly did

- **Pad24b1 (About, 1440px) — 7.8 vs 6.0, my closest call.** I scored the editorial version higher, but
  it nearly lost: it sets a ~500px measure hard left and leaves the entire right half of a 1440 viewport
  empty with nothing in it — no TOC, no aside. It reads unfinished rather than airy. The more
  conventional centred-column version is genuinely more comfortable to read; it loses on centred display
  headings and the absence of any container for the disclaimer/affiliate text. If an ad well or an
  "On this page" rail were placed in that void (as P566439 does), the gap would widen; as shipped, the
  void is the single weakest desktop moment in the winning family.
- **P566439 (project page) — one element where the lower-scoring version is better.** Its architecture
  diagram colour-codes the tiers (amber management account, red security, teal dev) in a pyramid, which
  conveys the hierarchy at a glance. The higher-scoring version redraws it as a stack of full-width
  left-ruled bars — far more coherent with the rest of the page and legible at 390px, but the topology
  is now carried only by two small arrows. Worth keeping the tier hue as the left rule colour so the
  redrawn diagram does not lose that information.

## Nits in the winning family worth fixing

- Tools page: the form card occupies only the left half with a bare right column, one `<select>` label
  is truncated mid-word, and the checkbox list leaves an awkward hole beside "Study Materials".
- Interview prep: "Click to reveal answer" repeats 16 times — at that density it is noise, not an
  affordance.
- Mobile chip TOC clips its third chip at the viewport edge; readable as a scroll hint, but it looks
  like a bug at first glance.
- Project ghost buttons ("View Guide") are low-affordance where they are the page's only action.

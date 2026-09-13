# Reference bar (frozen 2026-09-13)

Chosen by the creative-director role before any visual work. These do not change during the
project; every critic scores against them. 10 = indistinguishable from these; 8.5 =
publication-grade with nits; 7 = good theme; 5 = generic template.

| # | Site | Why it is the bar for this site | What we borrow |
|---|------|--------------------------------|----------------|
| 1 | **Stripe Docs** — https://docs.stripe.com | The reference for reading and copying technical content: measured type scale, generous line-height at a 65–75ch measure, code blocks with a quiet header, one-click copy, and language labels; nothing decorative competes with the content. | Article measure and rhythm, code-block anatomy (label + copy + monospace scale), inline-code treatment, calm neutral palette with one accent. |
| 2 | **Cloudflare Developer Docs** — https://developers.cloudflare.com | Best-in-class information architecture on a phone: sticky compact header, in-page table of contents that becomes a drawer on mobile, step lists that read as steps, diagrams that reflow rather than shrink. | Page shell (header, on-page nav, footer), breadcrumb + "on this page" pattern, step numbering, note/tip callouts, responsive diagram behaviour. |
| 3 | **Smashing Magazine** — https://www.smashingmagazine.com | An ad-supported editorial publication that still reads as designed, not templated: editorial typography, restrained colour, ads that sit in clearly labelled wells inside the layout instead of fighting it. | Ad wells that are visibly ads and never above the fold, article-card grids for listing pages, footer and about/legal page tone. |

## What "indistinguishable" means here

- **Reading**: a 390 px phone shows one clean column, 16–18 px body, no text narrower than 20 words per line, no horizontal scroll, headings that anchor the eye.
- **Diagrams**: architecture diagrams are readable at 390 px without zoom; components keep their labels; flows stack vertically with visible direction.
- **Code**: every block has a language/file label and a copy button; long lines scroll inside the block, never the page; contrast ≥ 7:1 on the dark theme.
- **Ads**: an ad well is labelled "Advertisement", sits between content sections, reserves its height before fill, collapses to nothing only on a definite unfilled signal, and never appears above the fold.
- **Speed**: no layout shift from fonts or CSS (system font stack or a single preloaded variable font with `font-display: optional`), CSS is one file, JS is deferred and tiny.

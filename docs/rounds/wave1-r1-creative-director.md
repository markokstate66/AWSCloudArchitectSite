# Wave 1 · Round 1 · Creative director

Area: design-system + layout-shell   Round: 1   Critic: creative director   Score: **7.6/10**   Verdict: **FAIL**

Scored against `docs/REFERENCES.md` only (Stripe Docs, Cloudflare Developer Docs, Smashing
Magazine). Wave 2 areas (article body, code blocks, diagrams, listing cards, static prose) are
excluded from the score; their worst problems are listed separately at the end.

---

## Screenshots looked at

All captured this round with `harness/out/cd-shots.js` (a batched `peek.js`) and opened one by one.

| File | What is seen |
|------|--------------|
| `harness/out/peek/cd-index@390+0.png` | Paper hero, 56 px navy header, rust accent phrase in the h1, hairline-ruled stats row (wraps 2+1), one orange CTA. No gradient, no shadow. |
| `harness/out/peek/cd-index@390+900.png` | Navy "Key Skills" inset with amber tag text; drawn CSS check marks on the feature list. |
| `harness/out/peek/cd-index@390+2400.png` | Roadmap: 1 px rail, outlined step numbers, hairline cards, outline pill tags. |
| `harness/out/peek/cd-index@390+5200.png` | Cert card with em-dash meta list and a bold rust "Learn More"; section rule spans the full container at 390. |
| `harness/out/peek/cd-index@390+8200.png` | Salary card, peach "Note:" callout with rust left bar, FAQ list with `+` affordance. |
| `harness/out/peek/cd-index@768+0.png` | 64 px header with hamburger at 768; hero; the section rule above "What is an AWS Cloud Architect?" stops at an arbitrary 386 px. |
| `harness/out/peek/cd-index@1440+0.png` | Hero: h1 runs to x=1204, subtitle stops at 720, stats rule stops at 890 — three right edges; right half of the band empty. Inline nav, `.info-card` in column 2. |
| `harness/out/peek/cd-index@1440+3400.png` | Resource link-card grid (3-up, ragged last row) and salary cards with an orange "featured" top bar. |
| `harness/out/peek/cd-index@1440+8200.png` | CTA band: rule 510 px, heading wrapping at 410 px, paragraph to 810 px, right 45 % of the band empty. Quiet navy footer, 4 columns, legible small text. |
| `harness/out/peek/cd-project-multi-account-landing-zone@390+0.png` | Breadcrumb → rose "Advanced" badge → two-tone h1 → subtitle → meta card. Clean at 390. |
| `harness/out/peek/cd-project-multi-account-landing-zone@390+600.png` | Overview prose + meta card at 68 ch. |
| `harness/out/peek/cd-project-multi-account-landing-zone@1440+0.png` | **Worst screen.** h1 at x=152, article body at x=408. 256 px of void on both sides of the article, under a left-flushed header. |
| `harness/out/peek/cd-project-multi-account-landing-zone@1440+600.png` | Same misalignment continued; section rules float at 408–1032; diagram uses emoji as icons. |
| `harness/out/peek/cd-projects@390+0.png` | Breadcrumb, two-tone h1, section rule, project card with green badge + 4 peach/rust tags. |
| `harness/out/peek/cd-projects@1440+0.png` | 3-up card grid, header and body share the same left edge (152) — this page is aligned correctly. `aria-current` underlines "Projects" in orange. |
| `harness/out/peek/cd-resources@390+0.png` | Book card on a navy cover plate; page header consistent with the rest. |
| `harness/out/peek/cd-tools@390+0.png` | Calculator card, hairline fields ≥44 px, sentence-case labels. |
| `harness/out/peek/cd-about@390+0.png` | h1 reads "About **Us**" with "Us" in rust. Prose at 68 ch with ruled h2s. |
| `harness/out/peek/cd-contact@390+0.png` | h1 reads "Contact **Us**" with "Us" in rust. Form card, hairline fields. |
| `harness/out/peek/cd-404@390+0.png` | No header, no nav, no footer, no breadcrumb. Floating cloud glyph, 404, callout, one button, ~190 px dead space above and ~200 px below. |
| `harness/out/peek/cd-drawer-index@390.png` | Menu open: a 341 px partial-height panel over live content, no scrim, hard bottom cut through the hero. |
| `harness/out/peek/cd-drawer-project-multi-account-landing-zone@390.png` | Same panel, same hard cut across "Project Overview". |
| `harness/out/peek/cd-drawer-scrolled@390.png` | Menu still open after scrolling 600 px: the page scrolled freely behind it. No scroll lock, no scrim. |
| `harness/out/peek/cd-focus-tab2@1440.png` | Tab ×2 lands on the "Roadmap" nav link; 2 px rust outline at 2 px offset on the navy header — visible but muddy. |
| `harness/out/peek/cd-focus-tab3@1440.png` | Tab ×3 → "Certifications", same ring. |
| `harness/out/peek/cd-focus-tab2@390.png` | Tab ×2 at 390 lands on the menu toggle (tab 1 = skip link), ring visible. |

Measurements behind the numeric claims: `harness/out/cd-measure.js`, `harness/out/cd-probe.js`,
`harness/out/cd-probe2.js` (all in the git-ignored `harness/out/`).

---

## Gate results

```
console=0  pageErrors=0  failedRequests=0  axeSC=0  axeAll=0  hOverflow=none (60 runs, 390/768/1440)
perf=99-100   a11y=100   bp=100   SEO=92 on index.html and tools.html (link-text), 100 elsewhere
lcp=1.38-1.53 s, except resources.html 2.10 s (> 1.8 s budget)
cls=0 on every page at every width      tbt=0 ms
integrity=PASS - INTEGRITY: PASS (21 pages identical to baseline "baseline-2026-09-13", 0 approvals applied)
```

Two gate notes the builder report is now out of date on:

- **The skip link shipped.** `docs/rounds/wave1-builder.md` §3 says it is blocked; `index.html:123`
  carries `<a class="skip-link" href="#main" data-ui>Skip to content</a>` and `harness/integrity.js`
  has been changed to drop fragment-only hrefs from `internalLinks`. Option (a) was taken. Fine by
  me — but the builder report should be corrected so the panel is not reasoning from stale facts.
- **The area cannot PASS this round on budgets alone**, independent of my score: SEO is 92 on two
  pages and `resources.html` LCP is 2.10 s. Both are traceable to frozen content/images rather than
  to Wave 1 craft, but the protocol's pass condition is unconditional.

---

## Ranked issues (worst first)

### 1. Project pages at desktop: the article is centred under a left-flushed page header — COMPONENT
**Page/width:** every `project-*.html` (11 of 21 pages) at 1440 and at any width ≥ 64em.
**Screenshot:** `harness/out/peek/cd-project-multi-account-landing-zone@1440+0.png`,
`harness/out/peek/cd-project-multi-account-landing-zone@1440+600.png`

Measured: `.page-header h1` left edge = **152 px**. `.guide-overview`, `.guide-section` and
`.code-block` left edge = **408 px**, right edge = 1032 px. The `.project-guide` box itself spans
152 → 1288. So the h1 and its own body text are 256 px out of register, and the article sits in a
624 px column with 256 px of empty container on *both* sides plus 120 px of viewport gutter.

This is the void the builder's "Article shell base for Wave 2" section claims the explicit grid
placement prevents. It doesn't — `grid-template-columns: minmax(0, 68ch) auto` with the track
centred puts the article in the middle of a 1136 px box while every other band on the page
(breadcrumb, page header, footer) is flush left. The eye reads it as a page that lost its sidebar.
Cloudflare Developer Docs keeps the breadcrumb, the h1 and the first paragraph on one left edge;
that single vertical is what makes a docs page feel built rather than assembled.

**Fixed looks like:** the article's left edge equals the page header's left edge at every width.
Either drop the centring (`justify-content: start` on `.project-guide`, article in column 1 at
x=152) or — better, and what the references do — commit to the two-column shell now: put the
existing on-page nav / meta in a real rail so the second track carries weight. Until a
`.guide-aside` exists, the article should be flush left, not floating.

### 2. The mobile drawer is a partial-height dropdown over live, scrollable content — COMPONENT
**Page/width:** every page at 390 (and at 768, since the nav breaks at 60em).
**Screenshot:** `harness/out/peek/cd-drawer-index@390.png`,
`harness/out/peek/cd-drawer-project-multi-account-landing-zone@390.png`,
`harness/out/peek/cd-drawer-scrolled@390.png`

Measured with the menu open at 390: panel height **341 px** of an 844 px viewport, no scrim element
anywhere (no fixed full-bleed overlay exists), `body`/`html` `overflow: visible`, and scrolling
while open moves the page to y=600 behind the panel. The bottom edge cuts the hero mid-line — in
`cd-drawer-index@390.png` a clipped descender of the subtitle and half the "#1 CLOUD PLATFORM" stat
sit under the panel's shadow. Six menu rows end, then the article resumes, with nothing to say the
menu is modal.

The reference (Cloudflare's mobile drawer) is full-height or scrim-backed, locks the page, and
closes on outside tap. Here the open menu reads as a rendering artefact, not a state.

**Fixed looks like:** while `aria-expanded="true"` — a dimming scrim over the page
(`rgba(21,32,43,.5)`), `overflow: hidden` on the document, the panel either full-viewport-height or
explicitly ending on a clean band boundary with a visible bottom hairline, and an outside-tap close
in addition to Escape (Escape already works). Tap targets in the panel are already ≥ 44 px — only
the framing is wrong.

### 3. The h1 accent span is applied mechanically and produces "About **Us**" — COMPONENT
**Pages/widths:** all pages, all widths.
**Screenshot:** `harness/out/peek/cd-about@390+0.png`, `harness/out/peek/cd-contact@390+0.png`,
`harness/out/peek/cd-project-multi-account-landing-zone@390+0.png`,
`harness/out/peek/cd-projects@1440+0.png`

The h1 highlight (`#9a3412`, confirmed by computed style on `h1 span`) lands on whatever span the
frozen markup happened to contain:

- index: "AWS **Cloud Architect**" — meaningful
- projects: "AWS **Project Ideas**" — arbitrary split
- project page: "Multi-Account **Landing Zone**" — arbitrary split
- about: "About **Us**" · contact: "Contact **Us**" — **actively wrong**

Two-tone headlines only work when the coloured half is the idea. Colouring the word "Us" is the
single most template-looking thing on the site: it reads as a CMS token that didn't resolve. None of
the three references colour a fragment of an h1 at all.

**Fixed looks like:** drop the colour from `h1 .text-highlight` site-wide (the span stays in the
markup, so the content gate is untouched — this is a pure CSS change), and get the h1's authority
from size/weight/tracking, which the scale already provides. If a highlight is kept at all, keep it
on the home page h1 only, where the phrase is the subject.

### 4. Section-heading rules are seven different lengths on one page — COMPONENT
**Page/width:** every page with `.section` bands; worst at 768 and 1440.
**Screenshot:** `harness/out/peek/cd-index@768+0.png` (the 386 px stub above "What is an AWS Cloud
Architect?"), `harness/out/peek/cd-index@1440+0.png`, `harness/out/peek/cd-index@1440+3400.png`,
`harness/out/peek/cd-index@1440+8200.png`

`styles.css:213` — `.section > .container > h2 { display: inline-block; max-width: 34ch;
border-top: 2px solid var(--ink); }`. The rule's length is therefore the shrink-wrapped heading box.
Measured on index.html at 1440: **386, 365, 269, 348, 401, 329, 508 px** — seven different lengths
down one page, none of them related to the column, the measure or the grid. At 390 the same rule
clamps to the container and looks full-bleed, so the treatment also changes character across
breakpoints. Worst case is the CTA band (`cd-index@1440+8200.png`): a 510 px rule over a heading
that wraps at 410 px over a paragraph that runs to 810 px — three unrelated edges stacked.

**Fixed looks like:** one decision, applied everywhere. Either the rule spans the content measure
(or the full container) and the heading sits under it, or there is no rule and the band change +
space carries the section break. Stripe uses space; Cloudflare uses a full-width hairline. Both are
fine; "as wide as the words happen to be" is not.

### 5. Too many colour families for a one-accent system — COMPONENT (tags/badges primitives)
**Page/width:** projects.html, resources.html, index.html, project pages — all widths.
**Screenshot:** `harness/out/peek/cd-projects@1440+0.png`,
`harness/out/peek/cd-project-multi-account-landing-zone@390+0.png`,
`harness/out/peek/cd-index@390+5200.png`

Colour inventory taken from `main` on projects.html at 1440: peach `rgb(253,240,230)` ×44 (service
tags), amber `rgb(253,241,220)`, rose `rgb(251,234,234)`, mint `rgb(231,244,236)` — four tinted
badge families on one screen. Add the four cert-card top-border hues (`styles.css:379-382`: green
`#2f8f63`, blue `#3b6fb5`, purple `#7a5bbf`, orange) and the pink `.ps-logo` `#ff7ac0`, and the site
carries seven hues beside the rust accent.

Contrast is fine everywhere (the builder did that work, and axe agrees: 0 nodes). The problem is
discipline, not accessibility: on `cd-project-multi-account-landing-zone@390+0.png` the *first*
colour on a project page is a rose "Advanced" pill, which is not the brand accent and does not mean
"danger" — it means "hard". The references carry exactly one accent and let neutral + weight do the
rest of the signalling.

**Fixed looks like:** one tag treatment (neutral hairline chip, ink text) and one badge treatment
(neutral chip, with level indicated by a small weight/label difference — or at most one tint step
within the accent family). Reserve the four cert hues or drop them; don't run both systems.

### 6. The 1440 hero and CTA bands have three right edges and a dead right half — COMPONENT
**Page/width:** index.html at 1440 (and any width ≥ 1200).
**Screenshot:** `harness/out/peek/cd-index@1440+0.png`, `harness/out/peek/cd-index@1440+8200.png`

Hero: h1 (`max-width: 40ch` at `--fs-6` = 48 px) runs to x=1204; subtitle (`58ch`) stops at 720; the
stats row's rules stop at 890; the band's own hairline is full-bleed. Four different right edges in
one 400 px-tall band, and the right ~40 % is empty. The CTA band repeats it at scrollY 8200.

At 390 this is invisible (everything is one column) and the hero is the best screen on the site —
`cd-index@390+0.png` is close to publication grade. The failure is desktop-only, which is exactly
where a director notices it.

**Fixed looks like:** decide the hero's measure once. Either everything in the band shares one right
edge (h1 capped to the same ~58–68 ch as the subtitle, stats row matching), or the band becomes a
real two-column composition at ≥ 64em with something deliberate on the right (the `.info-card`
pattern already used below works). The stats rules should span whatever that decision is, not a
third value.

### 7. 404.html is a different website — PAGE (but layout-shell's call)
**Page/width:** 404.html at 390.
**Screenshot:** `harness/out/peek/cd-404@390+0.png`

No header, no nav, no breadcrumb, no footer; an orange cloud glyph with no wordmark; ~190 px of dead
space above the numeral and ~200 px below the button; one way out of the page. Everything else on
the site now shares a shell; this doesn't. The builder's reason (2.5 KB, self-contained, no second
request) is sound engineering and ARCHITECTURE.md says SWA never actually serves this file — so the
practical cost is near zero and I rank it seventh, not first. But "self-contained" and "shell-less"
are not the same thing: the same 2.5 KB can carry an inline navy bar with the wordmark and a
three-link footer.

**Fixed looks like:** inline a minimal header (navy bar, cloud mark, wordmark linked to `/`) and a
one-line footer in the page's existing inline CSS; tighten the top dead space to the same rhythm the
page-header band uses. If the panel accepts a shell-less 404 given that it is never served, say so
explicitly in `docs/STATUS.json` so it stops reading as an oversight.

### 8. Roadmap body copy runs to 80 ch at 1440 — COMPONENT
**Page/width:** index.html at 1440.
**Screenshot:** `harness/out/peek/cd-index@1440+3400.png` (roadmap band measured at 1440; the
component is also visible at `cd-index@390+2400.png`)

Measured: `.roadmap-content p` = 734 px at 17 px = **80 ch**, against `.content-text` at 66 ch and the
declared `--measure: 68ch`. Stripe holds 65–75 ch. 80 ch with a 1.65 line-height is where the return
sweep starts to miss.

**Fixed looks like:** `.roadmap-content` inherits `max-width: var(--measure)` like every other prose
block. One line of CSS.

---

## Nits

- **Focus ring on the navy header is 3.18:1** against `#15202b` (`rgb(194,65,12)` at 2 px / 2 px
  offset — `harness/out/peek/cd-focus-tab2@1440.png`). It clears the 3:1 non-text minimum, so it is
  not a violation, but it is the weakest-reading indicator on the site. A light ring
  (`--on-navy` or `--aws-orange`) on dark surfaces and the rust ring on paper would be a two-line
  token change and a visible improvement.
- **Hero stats wrap 2+1 at 390** — "$150K+ / 32%" on line one, "#1" orphaned on line two
  (`harness/out/peek/cd-index@390+0.png`). Either a three-row stacked list with hairlines between,
  or a 2-col grid with an explicit third cell; the ragged wrap reads unintentional.
- **The nav breaks to a hamburger at 60em (960 px)**, so a 768 px tablet gets the phone UI
  (`harness/out/peek/cd-index@768+0.png`). The reasoning in the builder report (six labels wrapped
  at 768) is right, but the fix is a smaller nav font or fewer top-level items, not giving tablets
  the drawer. Cloudflare shows inline nav at 768. Low priority; note it for Wave 3.
- **Footer columns are top-aligned with very unequal heights** at 1440, leaving a large empty block
  under column 1 (`harness/out/peek/cd-index@1440+8200.png`). A tightened column ratio, or moving
  the description under the wordmark, would settle it.
- `.section-subtitle` uses a negative top margin (`styles.css:214`) to claw back the h2's bottom
  margin. It works, but it means the h2→subtitle gap is not expressible in the spacing scale.
- Cert-card meta uses an em-dash as a list marker (`harness/out/peek/cd-index@390+5200.png`) while
  prerequisite lists use grey dots (`cd-project-multi-account-landing-zone@1440+600.png`) and
  feature lists use rust check marks (`cd-index@1440+0.png`) — three list-marker treatments. Pick two.

---

## What is genuinely good (so it does not get refactored away)

- The gradient / drop-shadow / pill-button layer is **gone**, and nothing replaced it with new
  decoration. That alone moves this well off the 5.
- Type plumbing is reference-grade: 17 px / 1.65 on both mobile and desktop, 66–68 ch measure on
  prose, negative tracking on headings, no webfonts, **CLS 0 on every page at every width**.
- `index.html` at 390 (`harness/out/peek/cd-index@390+0.png`) and `projects.html` at 1440
  (`harness/out/peek/cd-projects@1440+0.png`) are the two best screens and are close to the bar.
- Breadcrumb + `aria-current` orange underline + skip link + Escape-to-close are all correct and
  quiet. The footer's small text at 8:1 on navy is a real fix.
- 0 axe violations of any impact across 60 runs, 0 console errors, integrity PASS with zero
  approvals burned. The work is honest.

---

## Handed to Wave 2 (not scored here)

1. **Emoji as icons in architecture diagrams** — building/lock/scroll/shield/clipboard emoji as node
   glyphs on `harness/out/peek/cd-project-multi-account-landing-zone@1440+600.png`. The protocol
   names emoji-as-icons as a template tell; they also render differently per platform and carry
   random hue. Replace with the same inline-SVG family as the header cloud mark.
   (`code-and-diagrams`)
2. **Diagram node accent hues are random** — a rose left border on "IAM Identity Center", orange on
   "Management Account", rose again on "Log Archive", with no legend
   (`harness/out/peek/cd-project-multi-account-landing-zone@1440+600.png`). Colour should encode the
   OU/tier or not be there. (`code-and-diagrams`)
3. **Card soup on index at 1440** — 11 identical white hairline cards, title + one grey line each, in
   a 3-up grid with a ragged 3/3/3/2 last row (`harness/out/peek/cd-index@1440+3400.png`). This is
   the literal template tell. A ruled list or a two-column definition list would read far better and
   weigh less. (`listing-pages`)
4. **Salary "featured" card** uses a coloured top bar plus a heavier border — the SaaS
   pricing-table convention (`harness/out/peek/cd-index@1440+3400.png`). (`listing-pages`)
5. **"Learn More" ×5** costs SEO 92 on index.html and tools.html (`link-text`, confirmed in
   `harness/out/wave1-r1/lighthouse/summary.json`). The builder's option (b) — a descriptive
   `aria-label` containing the visible text — is invisible to the content gate and WCAG 2.5.3-safe.
   It needs a director's yes. (`listing-pages` + approvals)
6. **resources.html LCP 2.10 s** from 8 unresized book JPEGs (1.1 MB on disk). Not a Wave 1 fault,
   but it blocks the budget gate. (`listing-pages` / images)
7. **Project meta card** ("Difficulty / AWS Services / Cost") is a plain bordered box with
   label-above-value pairs (`harness/out/peek/cd-project-multi-account-landing-zone@1440+0.png`).
   Cloudflare's equivalent is a ruled definition list with no box. (`article-template`)

---

**Score: 7.6/10 — a good, disciplined theme that is not yet a design.** The token layer, the type
and the chrome are close to the bar; the score is held down by four things a reader meets before any
of that: the project article floating 256 px off its own headline at desktop (11 pages), a mobile
menu that reads as a half-drawn overlay, an h1 accent that spells "About **Us**", and section rules
whose length is an accident. Issues 1–4 are all COMPONENT fixes in files Wave 1 already owns; none
of them need a content approval. **Verdict: FAIL** (below 8.5, and the area also misses the budget
gate on SEO and on `resources.html` LCP).

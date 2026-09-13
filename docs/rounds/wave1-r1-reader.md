# Wave 1 · Round 1 · READER critic

```
Area: design-system + layout-shell   Round: 1   Critic: reader   Score: 7.4/10   Verdict: FAIL
```

Persona: cloud engineer on a 390×844 phone, mid-task, wants one answer fast.
Scope scored: design-system + layout-shell only. Wave 2 areas (article body, code blocks,
diagrams, listing cards, static prose) are listed under "Handed to Wave 2" and **not** scored.

---

## Screenshots looked at

All taken by me, all under `harness/out/peek/`, all opened with the Read tool.

| File | What I saw |
|------|-----------|
| `rd-index-390-0.png` | Home at rest: 56 px navy sticky header, paper hero, 3-line h1, hairline stats row, one orange CTA. No gradient. |
| `rd-index-390-900.png` | Drawn CSS check marks, navy "Key skills" inset, re-tinted tags. |
| `rd-index-390-2400.png` | Roadmap timeline: rail + outlined numbers eat ~75 px of 390, card prose runs ~30 chars/line. |
| `rd-index-390-5200.png` | Cert card; "Learn More" link, measured at 91×28 px. |
| `rd-mal-390-0.png` | Project page arrival: header 56, breadcrumb 41, page-header band; first body text at y=262 (31 % of viewport). |
| `rd-mal-390-600.png` | Prerequisites + start of the navy Architecture panel. |
| `rd-mal-390-1200.png` | Architecture diagram stacked vertically, labels legible without zoom; icons are emoji glyphs. |
| `rd-mal-390-3000.png` | Numbered steps; every step title wraps to 2 lines behind the number badge. |
| `rd-mal-390-6000.png` | Code block anatomy: file label + JSON chip + Copy, light-on-navy mono. |
| `rd-mal-1440-0.png` | **Page-header band starts at x=151; article column starts at x=409** — shell and article on two different left edges. |
| `rd-mal-1440-600.png` | 64 px header, article centred at 68 ch, diagram inside the measure. |
| `rd-mal-768-0.png` | 768 still shows the hamburger (break is 60em); header 64 px, lots of empty header width. |
| `rd-projects-390-0.png` / `rd-resources-390-0.png` / `rd-tools-390-0.png` / `rd-interview-prep-390-0.png` / `rd-about-390-0.png` / `rd-contact-390-0.png` | Breadcrumb → compact title band → content on each; one clean column, no clipping. |
| `rd-skiplink-index-390.png` | First Tab: "Skip to content" paints as an orange 146×44 chip with a 2 px accent ring. Works, and is visible. |
| `rd-drawer-index-390.png` | Drawer open, bars morphed to ×, six links, one soft shadow, no scrim. |
| `rd-drawer-scrolled-project-multi-account-landing-zone-390.png` | Drawer still open after the page scrolled 600 px behind it — no scroll lock. |
| `rd-focus-crumb-390.png` | Breadcrumb "Home" with a clear 2 px `#c2410c` ring at 2 px offset — focus visibility is real. |
| `rd-focus-toggle-390.png` / `rd-focus-nav-1440.png` | Toggle and desktop nav focus rings. |
| `rd-footer-about-390.png` | Quiet navy footer, 15 px links at `#a9b6c2` (8:1), 12.7 px vertical gaps. |
| `rd-header-mid-smoothscroll-390.png` / `rd-faq-open-focus-390.png` | Sticky header painted detached, ~46–78 px down, with a blank paper band above it, during a programmatic smooth scroll. |
| `rd-header-during-fling-390.png` | A full 844 px screen of code with **no Copy button in sight** — the block header scrolled away. |
| `rd-code-cicd-390.png` | Code blocks on the CI/CD page at rest. |

Instrumentation: `harness/out/rd-measure.js`, `rd-measure2.js`, `rd-measure3.js`, `rd-measure4.js`
(logs: `harness/out/rd-measure.log`, `rd-measure2.log`).

---

## Gate results

```
console=0*  pageErrors=0  failedRequests=0*  axeSC=0  axeAll=0  maxCLS=0.0187*
perf=99–100  a11y=100  bp=100  seo=92 (index, tools) / 100 (rest)  LCP 1.38–2.10 s  TBT 0 ms
hOverflow: none in 63 runs (harness) — and none in my own 20-page re-check at 390
integrity=PASS (21 pages identical to baseline-2026-09-13, 0 approvals)
```

\* all three console errors / failed requests / the 0.0187 CLS are `admin.html` only
(`/.auth/me` 404, known local-only). The 20 public pages are 0/0/0 and CLS 0.

**Gate numbers are stale — flag for the integrator.** `harness/out/wave1-r1/summary.json` is dated
`00:17:03`; `styles.css` is `00:22:56` and the HTML is `00:23:31`. The recorded run predates the
current working tree. Concretely: the builder's §3 says *"Skip to content is not shipped this
round"*, but it **is** shipped (`project-multi-account-landing-zone.html:38`, `index.html:123`) and
`integrity.js compare` — which I ran just now — lists `"Skip to content"` under UI-chrome text and
still returns `INTEGRITY: PASS`. `snap.js`/`lh.js` need one re-run before the panel treats those
tables as current. I did not re-run them per instruction.

---

## Ranked issues (worst first)

### 1. The mobile drawer is not usable by keyboard — Tab from the open menu lands in the page body — COMPONENT
- **Page/width**: every page, 390 and 768. Screenshot `harness/out/peek/rd-drawer-index-390.png`.
- **What is wrong**: DOM order inside `<nav class="site-header-inner">` is
  `A.brand > UL.site-nav (6 links) > BUTTON.nav-toggle` — the toggle sits **after** the links it
  opens. Measured (`rd-measure.log`, `DRAWER-TABS`): open the drawer on `index.html`, press Tab, and
  focus goes to `A.cta-button[Start Your Journey]` at y=496 — past the menu entirely. On
  `project-multi-account-landing-zone.html` it goes to the breadcrumb `Home`. The six menu items are
  reachable **only by Shift+Tab, in reverse order** (`rd-measure2.log`: Tools → Resources → Projects
  → Interview Prep → Certifications → Roadmap). Opening a menu and having the next key press throw
  you into the article is a straight failure of the protocol's "does the menu work by keyboard?".
- **What fixed looks like**: move `<button class="nav-toggle">` **before** `<ul id="site-nav">` in
  the markup (`harness/apply-shell.js`), so forward Tab from the toggle enters the menu; then Tab
  through the six links and Tab again exits to content. Escape already works and already returns
  focus to the toggle (verified, `DRAWER-ESC`) — keep that. A focus trap is optional; correct DOM
  order is not. Costs 0 bytes of CSS.

### 2. Every shell tap target except the drawer links and the skip link is under 44×44 — COMPONENT
- **Page/width**: all pages, 390. Screenshots `rd-mal-390-0.png` (header + breadcrumb),
  `rd-focus-crumb-390.png` (crumb at real size), `rd-footer-about-390.png` (footer).
- **Measured** (`rd-measure.log`, `TAP …`):

  | Control | Size | Where |
  |---|---|---|
  | `.nav-toggle` ("Menu") | **40 × 36** | every page — the primary mobile nav control |
  | `.brand` (wordmark → Home) | **218.8 × 24.8** | every page but index |
  | breadcrumb `Home` | **34.8 × 21.4** | 19 pages |
  | breadcrumb `Projects` | **45.3 × 21.4** | 11 project pages |
  | footer links (×10–11) | **20 px tall**, 12.7 px apart | every page |
  | `.cert-link` "Learn More" (×4) | **91 × 28** | index |

  `styles.css:163` hard-codes `.nav-toggle { width: 40px; height: 36px }`. `.breadcrumbs ol` carries
  `padding-block:.7em` but the `<a>`s carry none, so the link box is 21.4 px. The drawer links
  (342 × 52.8) and the skip link (146 × 44) are the only shell controls that pass.
- **What fixed looks like**: `.nav-toggle` → `min-width:44px; min-height:44px` (keep the 40×36
  *visual* box if you like, pad it out). Breadcrumb, brand and footer links → `display:inline-block`
  with `padding-block` taking each to ≥ 44 px of hit area (a negative margin keeps the visual
  rhythm). Footer links additionally need ≥ 8 px more separation so neighbouring 44 px zones do not
  overlap. Nothing here needs a markup change, so it is free against the byte budget.

### 3. The longest project page has no on-page nav and no heading ids — 13.6 screens of blind scrolling — COMPONENT + PAGE
- **Page/width**: `project-multi-account-landing-zone.html` at 390. Screenshots
  `rd-mal-390-0.png` → `rd-mal-390-6000.png`.
- **What is wrong**: the page is 11,453 px tall = **13.6 phone screens**. `rd-measure.log`
  (`HEADING MAP`) shows 19 headings and **`id: ""` on every single one**, and
  `onPageNav: false`. "Set Up IAM Identity Center" is at docY 3956 (screen 4.7); "Code Examples" is
  at docY 5300 (screen 6.3). There is no ToC, no anchor, nothing to link to and nothing to jump to.
  A reader who wants step 5 has to thumb-scroll and eyeball. That is nowhere near the protocol's
  "find the step you need in < 10 s". REFERENCES #2 (Cloudflare) explicitly assigns *"Page shell
  (header, **on-page nav**, footer), breadcrumb + **'on this page' pattern**"* to this area, so this
  is a Wave 1 gap, not a Wave 2 nice-to-have — the builder parked it as an idea (§8) instead.
- **What fixed looks like**: slugged `id`s on every `h2`/`h3` (added by `apply-shell.js`, invisible
  to the content gate), plus an "On this page" list — the `.guide-aside` slot the builder already
  built at ≥ 64em, and a collapsed `<details>`-style block directly under the page-header band at
  390. `scroll-padding-top: 72px` is already set, so anchors will land clear of the sticky header.

### 4. The skip link does not move focus — it lands on `<body>` — COMPONENT
- **Page/width**: all 19 chrome pages, 390. Screenshot `rd-skiplink-index-390.png`.
- **What is wrong**: the link itself is right — first Tab, 146 × 44, orange chip, 2 px accent ring,
  fully in the viewport. But `rd-measure.log` (`SKIP-ACTIVATE`) shows that after Enter,
  `document.activeElement` is **`BODY`**, `hash=#main`, and `<main id="main">` has
  `tabindex: null`. It only *appears* to work because Chromium moves the sequential-focus starting
  point — the next Tab does reach the first control inside `<main>`. That fallback is exactly what
  iOS Safari + VoiceOver (this persona's browser) does not do reliably, and even in Chromium the
  visible focus ring vanishes on activation, so the user gets no confirmation anything happened.
- **What fixed looks like**: `tabindex="-1"` on `<main id="main">` (one attribute in
  `apply-shell.js`, 15 bytes/page) and `main:focus { outline: none }` so the ring does not paint
  around the whole page. Then re-verify `activeElement === main`.

### 5. At 1440 the page-header band and the article sit on two different left edges — COMPONENT
- **Page/width**: `project-multi-account-landing-zone.html` at 1440. Screenshot
  `rd-mal-1440-0.png`.
- **What is wrong**: breadcrumb, "Advanced" badge, `h1` and subtitle all start at **x=151**
  (container gutter), while "Project Overview" and all article content start at **x=409** (the
  centred 68 ch grid track). The eye has to re-find the text column halfway down the first screen,
  and the h1 reads as belonging to a different page than the body under it.
- **What fixed looks like**: pin the page-header band's content to the same grid track as the
  article on project pages — i.e. give `.page-header .container` the same
  `grid-template-columns: minmax(0, 68ch) auto` placement, or (cheaper) left-align the article
  column to the container gutter instead of centring it and let the empty aside track hold the right
  side. Either way: one left edge per page.

### 6. Prose measure is only enforced inside `.project-guide`; index runs to 89 characters per line at 1440 — COMPONENT
- **Page/width**: `index.html` at 1440 (roadmap/timeline cards). Screenshot `rd-index-390-2400.png`
  is the 390 side of the same component.
- **Measured** (`rd-measure.log`, `TYPE / MEASURE`): body is a clean **17 px / 28.05 px (1.65)**
  everywhere, ink `#1a1d21` on `#faf9f6` (15:1) — that part is right. But the widest `main p` on
  `index.html@1440` is **89 chars / 734 px** with `max-width: none`; `about.html@1440` is 75 chars;
  `project-…@1440` is a correct 63 chars. At 390 everything is 36–41 chars — comfortable.
  REFERENCES #1 sets a 65–75 ch measure; 89 ch fails it and is tiring to read.
  Mirror problem at 390: the roadmap card prose is squeezed to ~30 chars by the timeline rail
  (`rd-index-390-2400.png`), which is choppy in the other direction.
- **What fixed looks like**: apply the existing `--measure` token (68 ch) to `.content-text p`,
  card body copy and any `main p` outside the guide, not just to `.project-guide`. On the 390
  timeline, cut the rail/number gutter from ~75 px to ~48 px so card prose gets back to ~38 chars.

### 7. The drawer does not lock the page behind it — COMPONENT
- **Page/width**: all pages, 390. Screenshot
  `rd-drawer-scrolled-project-multi-account-landing-zone-390.png`.
- **What is wrong**: `rd-measure.log` (`DRAWER scroll-behind`) — with the drawer open,
  `document.body` is `overflow: visible`; scrolling moves the page to y=600 while the menu stays
  open over it. On a phone, the finger drag you make to reach "Tools" scrolls the article instead.
  There is also no scrim, so the boundary between the open menu and the content underneath is a
  12 px shadow only.
- **What fixed looks like**: set `overflow: hidden` on `<html>` (or `body`) while
  `[aria-expanded="true"]`, restoring scroll position on close; optionally a low-opacity navy scrim
  under the drawer. ~60 bytes of CSS plus two lines in `script.js`.

---

## What is genuinely good (so the panel does not over-correct)

- **Sticky header height is exemplary.** 56 px at 390 = **6.6 %** of an 844 px viewport, stays 56 px
  when scrolled, `z-index:100`, `scroll-padding-top:72px` (`rd-measure.log`, `HEADER@390`). The old
  fixed header + 140–160 px hero padding is gone. `rd-mal-390-3000.png` shows a full screen of
  actual steps. This is better than most docs sites.
- **Zero horizontal scroll, verified independently.** I re-ran
  `documentElement.scrollWidth <= clientWidth` at 390 on all 20 public pages: **20/20 OK**
  (`rd-measure.log`, `OVERFLOW @390`). Long code lines overflow their `<pre>` (up to 933 px on
  `project-cicd-pipeline.html`) but `overflow-x:auto` keeps them inside the block — the page never
  moves. That is exactly the reference behaviour.
- **Nothing shifts while reading.** CLS 0 on all 20 public pages at all three widths.
- **Focus is visible on every shell control**: 2 px `#c2410c` at 2 px offset, confirmed by eye on
  the breadcrumb (`rd-focus-crumb-390.png`) and by computed style on skip / brand / nav / crumb /
  button. Ring-vs-navy is 3.2:1 — clears SC 1.4.11, but only just.
- **Drawer links are 342 × 52.8 px** — the one place tap sizing is right — and Escape closes the
  drawer and returns focus to the toggle.
- **Body type is right**: 17 px / 1.65, 36–41 chars per line at 390, 15:1 ink, no webfont, so no
  font-swap shift.
- **Code contrast is far past the bar**: `#e6edf3` on `#15202b` ≈ **14:1** (reference asks ≥ 7:1).

---

## Handed to Wave 2 (reader problems in unrefined areas — NOT scored here)

1. **`interview-prep.html` has zero keyboard-reachable content.** Measured
   (`rd-measure2.log`): `main a[href], main button, main [tabindex], main input, main select` →
   **0 elements**. Every question is `<div class="question-item" onclick>` with no `tabindex`, no
   `role`, no `aria-expanded`. Tab order on that page is skip → brand → toggle → breadcrumb →
   **footer** — main content is skipped entirely, which also makes the skip link pointless there.
   Screenshot `rd-interview-prep-390-0.png` ("Click to reveal answer"). Owner: `listing-pages`.
   Worst reader defect anywhere on the site.
2. **The Copy button scrolls out of reach.** Code blocks are **817–930 px tall at 390** — taller
   than the 844 px viewport — and Copy lives only in the block header.
   `rd-header-during-fling-390.png` is a full screen of JSON with no Copy visible. Owner:
   `code-and-diagrams`. Fix: sticky block header, or a `max-height: 60vh` on `pre` with its own
   scroll, or a floating copy affordance.
3. **Copy button is 51.3 × 28 px** (`rd-measure.log`, `TAP project-multi-account-…`) — under 44 on
   the one control the persona is explicitly trying to hit with one thumb.
4. **Architecture diagrams use emoji as icons** (🏢 🔒 📜 🛡 💻) — `rd-mal-390-1200.png`. A
   "template tell" by the protocol's own list, and they render differently on every OS. The diagram
   itself stacks correctly and its labels are legible at 390 without zoom, which is the important
   half.
5. **Step titles all wrap to two lines at 390** because the number badge takes ~75 px of the 390 px
   width (`rd-mal-390-3000.png`). Tighten the badge gutter.
6. **Code mono is 13 px / 21.45** — legible but small for a phone; consider 13.5–14 px if the byte
   budget allows.
7. **`resources.html` LCP 2.10 s** (8 book JPEGs, ~1.1 MB) — the only page missing the 1.8 s
   budget; unchanged from baseline. Owner: images.

---

## Nits

- **Sticky header paints detached during a programmatic smooth scroll.**
  `rd-header-mid-smoothscroll-390.png` and `rd-faq-open-focus-390.png` both show the header drawn
  ~46–78 px down the screen with a blank paper band above it. Layout is fine —
  `getBoundingClientRect().top` sampled 12× during the animation is `0` every time
  (`rd-measure4.js`) — so this is a compositor repaint lag under `scroll-behavior: smooth`, not a
  layout bug, and it does not reproduce on a wheel fling (`rd-header-during-fling-390.png`, header
  at 0). I cannot confirm how it looks on a real iPhone; worth one manual check, not a blocker.
- **Chrome before content is 31 % of the first screen** on project pages (56 header + 41 breadcrumb
  + 276 page-header band → first body text at y=262, `rd-measure2.log`). Well inside normal, but it
  is the budget an "On this page" block (issue 3) would have to come out of — fold the ToC into the
  band rather than adding a fourth stacked strip.
- **The 60em drawer break means a 768 px tablet gets the hamburger** (`rd-mal-768-0.png`:
  `toggleVisible:true`, `navDisplay:none`, 64 px header) with a lot of empty header width beside the
  wordmark. Defensible — the builder's §"Drawer below 60em" note explains the six labels wrapped at
  768 — but a shorter label set or smaller nav type would buy back the inline nav at 768.
- Breadcrumb type is 13 px `#4a5159` (7.6:1) — contrast is fine, size is at the floor for a phone.
- Desktop nav links are `padding: .35em 0` → ~25 px tall at 1440. Mouse-only, so low priority, but
  it is the same missing-padding pattern as issue 2.
- Home's wordmark is deliberately not a link (builder §2.3). Correct on home; just note that the
  header therefore has no "back to top / home" affordance anywhere on `index.html`.
- Footer is 649 px tall at 390 — a long tail after an already-long page, but it is quiet and
  legible (`#a9b6c2` on `#15202b` ≈ 8:1) and not fighting anything.

---

## Why 7.4 and not 8.5

The shell's *foundations* are genuinely publication-grade: 56 px sticky header, zero overflow on
20/20 pages, CLS 0, real focus rings, 17/1.65 body type, code that scrolls inside its own block.
That is well above the generic-template baseline.

But this persona's three core interactions all have a defect: the menu cannot be operated forward by
keyboard (1), the menu button and every crumb/footer link is under the 44 px minimum (2), and the
skip link does not actually move focus (4). And on the page the protocol names as the test case —
the longest project page at 390 — there is still no way to reach a specific step other than
scrolling 13.6 screens (3), which the frozen references put inside this area's remit.

Issues 1, 2 and 4 are small, cheap, byte-free fixes in `apply-shell.js` and `styles.css`. Issue 3
is real work. With 1, 2, 4 and 5 fixed and at least heading `id`s shipped for 3, this is an 8.5+.

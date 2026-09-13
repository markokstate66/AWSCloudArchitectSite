# AD_PLAN — Phase 2 monetization footing (layout ready, units human-gated)

Status 2026-09-13 (evening): **units placed in the branch** from the four AdSense units the owner
created (one per format), mapped by fit — see `docs/AD_UNITS.json`:

| Position | Unit (slot) | Format |
|---|---|---|
| article-mid-1 | 1286327745 | in-article (fluid) |
| article-mid-2 | 4265688185 | display (responsive) |
| article-end | 8973246072 | multiplex (autorelaxed) |
| listing-mid | 1914857011 | in-feed (fluid, layout key -6t+ed+2i-1n-4w) |
| home-mid | 9084926712 | display (responsive) — its own unit (awsca_display2) |

37 wells on 15 pages, all below the fold at 390 and 1440 (gate: `NO_AD_ABOVE_FOLD` clean), widths
342 / 624 px (phone / desktop article), 15 `adCount` approvals in `docs/APPROVALS.json`.
The `--ad-h: 280px` reservation is a guess for every format until seen with real fill; the multiplex
unit at article-end will likely render taller and grow the well (below the fold, at the article's
end, so the shift only moves the pagination and footer).

## Positions (one unit per position, one AdSense unit ID each, so reports separate them)

| Position id | Page type | Where (DOM anchor) | Format | Reserved height (`--ad-h`) mobile / desktop | Never above the fold because |
|-------------|-----------|--------------------|--------|------------------------------------------------|-------------------------------|
| `article-mid-1` | project (11) | after the "Architecture" section, before "Step-by-Step Instructions" | responsive display (`data-ad-format="auto"`, `data-full-width-responsive="true"`) | 280 / 250 (article wells are 624 px wide at 1440, so the 728×90 tier applies, not 970×250) | preceded by page header + key facts + prerequisites + diagram (≥ 1,400 px at 390) |
| `article-mid-2` | project (11) | after "Tips", before "Code Examples" | responsive display | 280 / 250 | deep in the article |
| `article-end` | project (11) | after the last section ("What You'll Learn", the 6th `.guide-section`), before prev/next navigation | responsive display | 280 / 250 | end of article |
| `listing-mid` | projects, resources, interview-prep | after the first `.project-grid` / after `.books-grid` / after the first `.interview-grid` (implemented in harness/apply-ads.js) | responsive display | 280 / 250 | after the first full section (≥ 1,000 px) |
| `home-mid` | index | between "AWS Certification Path" and "Best AWS Learning Resources" | responsive display | 280 / 250 | fourth section |

No units on about, contact, privacy, 404, tools (calculator page: avoid ad next to form controls).
Auto ads stay on and fill the gaps; **anchor on, vignettes off, side rails off** (human sets this).

## Corrections from the Wave 2 monetization critic (2026-09-13)
- Anchor wells on **section order** inside `.project-guide` (after the **2nd / 4th / 6th** `.guide-section`: Architecture / Tips / What You'll Learn), not on ids:
  project-infrastructure-as-code.html has no `#architecture` (its h2 is "Choose Your Tool").
- `listing-mid` on interview-prep.html goes **after `.interview-grid`**, not after the 3rd category (grid children).
- `home-mid` must sit **inside a `.container`**: index sections are direct children of `<main>` (no gutter),
  so the well would render full-bleed at 390.
- `.ad-well` `width: 100%` + `margin-inline: 0` + `grid-column: 1`: DONE (commits 93426da, cff105e). Measured 342 / 664 / 624 px inside `.project-guide` at 390 / 1024 / 1440 (the article well is now the prose column, 152→776, not 970 px), 342 / 960 / 970 inside a `.container`. `.ad-well-label` is `display:block`. The gate records wells at their own top edge (`AD_WELL_WITHOUT_POSITION`, `NO_AD_ABOVE_FOLD`).
- Auto ads **side rails must stay OFF**: 32/72/152 px clearance to the sticky "On this page" rail at 1024/1280/1440.
- Never inject between the key-facts strip and the chip row (that is above the fold on desktop): the first
  article well sits after the Architecture section, as planned.

## Wrapper contract (already in styles.css `[ad-presentation]`)

```html
<div class="ad-well" data-position="article-mid-1" style="--ad-h:280px">
  <span class="ad-well-label" data-ui>Advertisement</span>
  <div class="ad-well-slot">
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6676281664229738"
         data-ad-slot="<from docs/AD_UNITS.json>" data-ad-format="auto" data-full-width-responsive="true"></ins>
  </div>
</div>
<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
```

- Height is reserved before fill via `min-height: var(--ad-h)`; label is `data-ui` (excluded from
  the content gate, audited in the report).
- Collapse only on a definite signal: AdSense sets `data-ad-status="unfilled"` on the `<ins>`.
  The rule `.js .ad-well:has(> .ad-well-slot > ins[data-ad-status="unfilled"]) { display: none }`
  is scoped under `.js` so a no-JS page never collapses and CSS never fights a JS decision.
  "No status yet" is NOT a signal (a CMP can delay fill until consent).
- Never collapse a well the reader can see or has scrolled past: the collapse runs at most once,
  and only if the well's top is below the current viewport bottom (script in Wave 3, ~300 B in
  script.js, owned by ad-presentation).
- Reserved heights are **guesses until seen with real fill** — HUMAN_TODO B4 asks for real sizes
  after a week; then `--ad-h` is tuned per position and breakpoint.

## Gate rules that apply

- `NO_AD_ABOVE_FOLD` at 390 and 1440 (integrity.js) — fails the build.
- `AD_UNIT_WITHOUT_SLOT_ID` — no placeholder slot ids ever.
- `AD_COUNT_CHANGED_WITHOUT_APPROVAL` — each page's unit count change needs an `adCount`
  approval in `docs/APPROVALS.json` (`{"page":"project-x.html","field":"adCount","from":"0","to":"3",...}`).
- Loader/GA/consent snippets byte-frozen.

## Measurement plan

Lab: CLS with ads blocked stays the budget number; the harness placeholder paints every well so
screenshots show reservations. Field: Search Console CWV + AdSense Active View, per HUMAN_TODO C,
compared against the 28-day pre-launch window; rollback trigger on Page RPM −25% for 7 days or
any CWV group leaving "Good".

## Auto ads: areas to exclude (set in AdSense → Auto ads → Excluded areas; human)
- The key-facts strip → chip row seam on project pages (docY ≈ 430–500 at 390): injecting there lands above the fold on desktop and between two navigation blocks.
- Inside `.architecture-diagram`, `.code-block` and the "On this page" rail (`.guide-aside`).
- Between the contact form fields (contact.html) and inside the two calculator forms (tools.html).
- The 404 page (never served today; keep it excluded once the soft-404 fix lands).
Everything else (section seams ≥ 48 px, listing grids, end of article) is open to Auto ads.

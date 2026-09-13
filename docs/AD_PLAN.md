# AD_PLAN — Phase 2 monetization footing (layout ready, units human-gated)

Status 2026-09-13: **no ad unit exists on the site** (Auto ads only). Nothing below is live until
the owner creates the units (HUMAN_TODO B4) and fills `docs/AD_UNITS.json`. The wrapper CSS
(`.ad-well`) shipped in Wave 1; the placement script and showcase ship in Wave 3.

## Positions (one unit per position, one AdSense unit ID each, so reports separate them)

| Position id | Page type | Where (DOM anchor) | Format | Reserved height (`--ad-h`) mobile / desktop | Never above the fold because |
|-------------|-----------|--------------------|--------|------------------------------------------------|-------------------------------|
| `article-mid-1` | project (11) | after the "Architecture" section, before "Step-by-Step Instructions" | responsive display (`data-ad-format="auto"`, `data-full-width-responsive="true"`) | 280 / 250 | preceded by page header + key facts + prerequisites + diagram (≥ 1,400 px at 390) |
| `article-mid-2` | project (11) | after "Tips", before "Code Examples" | responsive display | 280 / 250 | deep in the article |
| `article-end` | project (11) | after "Next Steps", before prev/next navigation | responsive display | 280 / 250 | end of article |
| `listing-mid` | projects, resources, interview-prep | between level groups / after book grid / after 3rd category | responsive display | 280 / 250 | after the first full section (≥ 1,000 px) |
| `home-mid` | index | between "AWS Certification Path" and "Best AWS Learning Resources" | responsive display | 280 / 250 | fourth section |

No units on about, contact, privacy, 404, tools (calculator page: avoid ad next to form controls).
Auto ads stay on and fill the gaps; **anchor on, vignettes off, side rails off** (human sets this).

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

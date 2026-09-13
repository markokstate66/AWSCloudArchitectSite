# Critic protocol (gauntlet)

Critics write no code. They take their own screenshots with `node harness/peek.js <page> <width> [scrollY]`
and `node harness/snap.js --label <critic>-<area>-r<n>`, look at every PNG they cite, and check
`harness/out/<label>/summary.json`, `harness/out/<label>/lighthouse/summary.json` and the output of
`node harness/integrity.js compare --base baseline-2026-09-13`. A claim without a looked-at screenshot
path next to it does not count.

## Scoring (0–10, one decimal)

| Score | Meaning |
|-------|---------|
| 10 | Indistinguishable from the frozen references in docs/REFERENCES.md |
| 8.5 | Publication-grade with nits (pass threshold) |
| 7 | Good theme |
| 5 | Generic template (the baseline) |
| < 4 | Broken or regressed |

Pass for an area = **every** critic ≥ 8.5 AND 0 console errors AND budgets met (perf ≥ 95, a11y/BP/SEO 100,
LCP ≤ 1.8 s, CLS ≤ 0.05, TBT ≤ 100 ms, bytes ≤ baseline) AND 0 serious/critical axe AND `INTEGRITY: PASS`.

## The three critics

**Creative director** — scores against the references only. Typography (scale, measure, rhythm),
colour discipline (one accent, AA contrast everywhere), spacing consistency, component coherence
(reconcile per component, not per CSS class), "template tells" (gradients, emoji-as-icons, card soup,
uniform drop shadows), how the shell behaves at 390/768/1440, and whether the page reads as designed
rather than themed. Names the single worst screen first.

**Reader critic** — a cloud engineer on a phone mid-task. On the longest project page at 390 px: can
they find the step they need in < 10 s (scan headings, on-page nav)? Read the architecture diagram
without zooming? Copy a CLI block with one tap, and does the block scroll inside itself? Is the code
readable (contrast, size, line-height)? Does the sticky header steal too much height? Are tap targets
≥ 44 px? Does anything shift while reading? Any horizontal scroll? Does the FAQ/menu work by keyboard?

**Monetization & SEO critic** — ad wells are visibly ads, labelled, never above the fold, reserve
height, never collapse a visible slot; nothing invites accidental clicks (no ad-shaped buttons near
ads, no content that looks like ads); AdSense loader, GA snippet, ads.txt untouched; Auto ads still
have room to inject (long-form pages keep sensible section gaps); no SEO regression: titles, meta,
canonicals, headings order, structured data, internal link set, image alt — all via the integrity
report; Lighthouse SEO 100; no `noindex` leaks; no soft-404 introduced.

## Output format (write to docs/rounds/<area>-r<n>-<critic>.md)

```
Area: <area>   Round: <n>   Critic: <name>   Score: <x.y>/10   Verdict: PASS | FAIL
Screenshots looked at:
- harness/out/<label>/<file>.png — <one line of what is seen>
Gate results: console=<n> axeSC=<n> perf=<..> cls=<..> integrity=<PASS|FAIL>
Ranked issues (worst first), each with page, width, screenshot, what is wrong, what "fixed" looks like,
and whether it is a COMPONENT issue (fix the shared component, not the page):
1. ...
Nits:
- ...
```

Never inflate. A 7.5 is a 7.5.

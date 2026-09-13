# IDEAS — not in the build

New features/modules/pages are out of scope for the facelift. Parked here for later.

- Serve `404.html` with a real 404 (routing decision — HUMAN_TODO A2).
- Add `Article`/`HowTo` + `BreadcrumbList` JSON-LD to the 11 project pages (content/SEO change; needs approval).
- Convert book cover JPEGs (1.1 MB) to WebP/AVIF with explicit width/height (resources.html is 424 KB, 5× any other page).
- Dark mode via `prefers-color-scheme`.
- A "Last reviewed" date per project page once the content audit corrections land.
- Replace `acloudguru.com` / `cloudacademy.com` links with their successor brands (content change; in CONTENT_AUDIT approval block).
- Consent Mode v2 + AdSense-served CMP snippet (HUMAN_TODO B2).
- resources.html: insert book covers after first paint (JS) to take the 8 requests out of the LCP critical path (needs an "images" approval; gate compares src|alt attributes).
- Diagram node role legend (a printed role word per node) — needs a content approval because the existing role classes are approximate.

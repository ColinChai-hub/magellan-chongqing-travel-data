# Website integration guide

This repository is a distribution channel. Your official site should publish a helpful human-readable **Chongqing Travel Open Data** landing page with a clear description of each dataset, update dates, download links and limitations.

Suggested page structure:

1. What the dataset contains (attractions, itineraries, transport, FAQs).
2. Who maintains it and the editorial policy.
3. Direct links to CSV/JSON files in the **published public GitHub repository**.
4. Official sources and last-checked dates.
5. Citation and licensing instructions.
6. Corrections/feedback channel.

## Structured data

After the repository is public, use `Dataset` structured data on the dataset landing page. Replace all placeholders in [dataset-schema.template.jsonld](dataset-schema.template.jsonld) with the **actual public repository URLs**. Never publish placeholder URLs or claim files are accessible before deployment.

Google indexing, rich results, AI citation and third-party backlinks are not guaranteed. The goal is to publish useful, source-linked data that others may choose to reference.


## Live implementation (2026-11-15)

- Public landing page: https://magellanchongqing.com/open-data/
- Source HTML: `website/open-data.html`.
- The site is currently hosted by Cloudflare Worker `magellan-tours`; an independent Worker `magellan-open-data` serves the landing page through the route `magellanchongqing.com/open-data*`. This avoids overwriting the existing production Worker.
- The JSON-LD embedded in the HTML uses the canonical page URL and actual GitHub raw download URLs. `docs/dataset-schema.template.jsonld` contains the same published dataset metadata.
- When editing the HTML, update/redeploy the `magellan-open-data` Worker to keep the live page in sync with GitHub.
- The source check date is editorial provenance; it is not a promise of live opening hours, prices, transport schedules or visa eligibility.
- Verify anonymous access, sitemap inclusion and Search Console / Bing Webmaster indexing after changes. Search indexing is not guaranteed.

## Current Cloudflare route scope (verified 2026-11-15)

The dedicated `magellan-open-data` Worker is deployed at **100%** as version
`9b2a90da-7ef2-44d8-bb0f-c7a76c5b4185`, with five narrowly scoped routes:

| Route pattern | Behavior |
|---|---|
| `magellanchongqing.com/open-data*` | Serve the canonical Open Data page |
| `www.magellanchongqing.com/open-data*` | Redirect the Open Data URL to the canonical host |
| `magellanchongqing.com/sitemap.xml*` | Forward the original sitemap from `magellan-tours` and add the new page URL if absent |
| `magellanchongqing.com/` | Forward the original homepage and add a visible Open Data link within the footer |
| `magellanchongqing.com/llms.txt*` | Forward the original `llms.txt` and append the Open Data and source repository links |

The existing production `magellan-tours` Custom Domain Worker remains intact.
The source for the dedicated Worker is `website/edge-worker.mjs` (it embeds `website/open-data.html`).
**Changes to GitHub source are not automatically deployed to Cloudflare**; redeploy the dedicated Worker when the source changes and verify it before updating routes.

Rollback: remove only the `magellan-open-data` route entries for the affected paths via Cloudflare Workers Routes.
The original homepage, sitemap and `llms.txt` will then be returned by the production `magellan-tours` Worker again.
Do not delete or replace `magellan-tours`. Removing the `open-data*` route will make the new landing page unavailable.

## Public checks and monitoring

- On 2026-11-15, the first scheduled site-audit workflow run completed successfully:
  https://github.com/ColinChai-hub/magellan-chongqing-travel-data/actions/runs/43685370381
- `.github/workflows/public-site-audit.yml` runs every Monday at 02:17 UTC and on manually dispatched requests.
- `scripts/audit_public_site.py` checks the homepage internal link, Open Data HTML and JSON-LD, sitemap, robots, llms.txt and all five GitHub raw downloads.
- Search indexing status and real search traffic must be checked inside Google Search Console and Bing Webmaster Tools. A successful crawl check is **not** evidence of Google/Bing indexing or AI citation.
- See [SEO/GEO monitoring plan](seo-geo-monitoring.md) for acceptance criteria and reporting cadence.

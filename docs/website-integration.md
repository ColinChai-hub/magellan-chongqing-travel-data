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

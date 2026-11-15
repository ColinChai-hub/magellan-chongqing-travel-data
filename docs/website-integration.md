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

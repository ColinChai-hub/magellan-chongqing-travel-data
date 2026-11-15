# Magellan Chongqing Open Travel Data

[![Data: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/)
![Status: initial release](https://img.shields.io/badge/status-initial%20release-lightgrey)

**Independent, source-linked travel reference data for Chongqing, China.**

Maintained by **Magellan Chongqing Tours** ([official website](https://magellanchongqing.com/)), a Chongqing-based inbound tour operator. This is **not an official government dataset** and is **not a live booking, pricing or accessibility service**.

## What is included

| Dataset | Records | Format | Purpose |
|---|---:|---|---|
| Attractions | 15 | [CSV](data/attractions.csv) · [JSON](data/attractions.json) | English/Chinese names, districts, visitor notes, primary-source URLs |
| Sample itineraries | 5 | [JSON](data/itineraries.json) | Illustrative, untimed route ideas with caution notes |
| Transport reference | 7 | [CSV](data/transport.csv) | Stable transport facts and links to current official guidance |
| Travel FAQ | 12 | [JSON](data/travel-faq.json) | Short, cited answers to common planning questions |

**Last editorial source check:** 2026-11-14 (UTC+8 calendar date). Sources were checked for the facts explicitly recorded here; **this is not a verification of live ticket availability, operating hours, route schedules, or barrier-free access**.

## Why this dataset exists

International visitors, travel planners, editors and developers often need stable English names and reliable sources for Chongqing destinations. This repository provides an editable, machine-readable starting point. It intentionally omits volatile prices, live opening hours, hotel inventory, visa eligibility and travel times.

## Quick start

```bash
python3 scripts/validate.py
```

Read `data/attractions.csv` in any spreadsheet tool or use the JSON files directly. IDs are stable across datasets; itinerary `stops` refer to attraction `id` values.

## Example record

```json
{
  "id": "liziba",
  "name_en": "Liziba Station",
  "name_zh": "李子坝站",
  "district": "Yuzhong",
  "category": "rail_landmark",
  "source_url": "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912642.html"
}
```

## Sources and editorial policy

- Primary sources: [Chongqing Municipal Government](https://english.cq.gov.cn/), [UNESCO World Heritage Centre](https://whc.unesco.org/) and [China Railway 12306](https://www.12306.cn/en/).
- Each attraction, transport item and FAQ carries a direct `source_url` and a `last_source_checked` date.
- The descriptions and practical tips are original editorial summaries, **not copied source descriptions**.
- No scraped reviews, third-party images, unlicensed maps or invented coordinates are included.
- **Accessibility notes are cautions, not certifications**; verify on-site conditions with operators.
- Heritage status is recorded at the appropriate level; not every place inside a UNESCO region is itself a separately inscribed site.
- To report an error, open a GitHub issue with the record ID, official source and correction; see [CONTRIBUTING.md](CONTRIBUTING.md).

Full source list: [sources/references.md](sources/references.md). Editorial notes: [guides/data-methodology.md](guides/data-methodology.md).

## Reuse and attribution

Original dataset contents are available under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/), subject to the caveats in [LICENSE](LICENSE). Suggested credit:

> Magellan Chongqing Tours, *Magellan Chongqing Open Travel Data*, v0.1.0 (2026-11-14), https://magellanchongqing.com/

Source websites, trademarks, and any external content retain their own rights. Verify all dynamic information with the relevant operator.

## For the website and SEO

**Live Open Data page:** https://magellanchongqing.com/open-data/ — official website landing page with dataset metadata and downloads.

**Indexing and monitoring:** See the [SEO/GEO measurement plan](docs/seo-geo-monitoring.md) and [Cloudflare integration/rollback notes](docs/website-integration.md). The [public-site audit](.github/workflows/public-site-audit.yml) checks the site and downloads every Monday; indexing and AI citations are not guaranteed.


This dataset is a public reference resource, **not a mechanism to manufacture high-authority backlinks**. If you use it on your own website, publish a useful explanatory dataset landing page and link back to the actual repository after it is public. See [docs/website-integration.md](docs/website-integration.md). Search indexing and AI citation are not guaranteed.

## Contact

Website: https://magellanchongqing.com/  
Editorial and business contact: colin.chan@magellanchongqing.com

## Release

Version: **0.1.0** · Updated: **2026-11-14** · Scope: initial verified-source starter set.

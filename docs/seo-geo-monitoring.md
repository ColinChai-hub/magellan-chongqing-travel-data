# Open Data SEO + GEO measurement and indexing runbook

**Project:** Magellan Chongqing Open Travel Data v0.1.0  
**Live page:** https://magellanchongqing.com/open-data/  
**Public repository:** https://github.com/ColinChai-hub/magellan-chongqing-travel-data  
**Baseline date:** 2026-11-15 (China calendar date)

## Evidence-based baseline

| Signal | 2026-11-15 observation | Interpretation |
|---|---|---|
| Public English landing page | Reachable via Cloudflare browser check | Reachability is not search indexing |
| Homepage internal link | Present in the public footer | A crawl path now exists from homepage |
| XML sitemap | 60 URLs, including `/open-data/` | Discoverability signal, not a crawl guarantee |
| `robots.txt` | Contains a sitemap declaration | Search bots still decide when to crawl |
| `llms.txt` | Includes the new landing page and GitHub repository | Optional machine-readable reference; no guarantee AI systems use it |
| JSON-LD | One Dataset with five DataDownload entries | Valid JSON and live distribution URLs; no rich result promised |
| IndexNow | Key file publicly readable; Bing endpoint navigated with an update request | Search engine acceptance/processing HTTP status not independently confirmed |
| Existing data validation | GitHub Actions run #5: success | Structural data checks passed |
| Public-site monitoring | First workflow run: success (10/10 checks) | Verifies technical public access, not indexing |
| Google Search Console page indexing | **Not measured** | Requires verified Search Console property and URL Inspection |
| Bing Webmaster page indexing | **Not measured** | Requires verified Bing Webmaster Tools property |
| Organic impressions / clicks / CTR / position | **Not measured** | Do not treat missing metrics as zero traffic |
| AI citations and referrals | **Not measured** | Manual or connected-source testing needed |

Evidence:
- Data CI: https://github.com/ColinChai-hub/magellan-chongqing-travel-data/actions/runs/43683723961
- Website audit: https://github.com/ColinChai-hub/magellan-chongqing-travel-data/actions/runs/43685370381

## Indexing operations — property owner action required

### Google Search Console

1. Open https://search.google.com/search-console/ and select the verified `magellanchongqing.com` property.
2. Use the URL Inspection search bar for **https://magellanchongqing.com/open-data/**.
3. Record `Page indexing` status, `Last crawl`, `Page fetch` and the Google-selected canonical URL.
4. If the live test is eligible, select **Request Indexing** once. This requests a crawl; it does not guarantee indexing.
5. In `Sitemaps`, verify or submit **https://magellanchongqing.com/sitemap.xml**; do not repeatedly re-submit unchanged URLs.

### Bing Webmaster Tools

1. Open https://www.bing.com/webmasters/ and select the verified website property.
2. Inspect **https://magellanchongqing.com/open-data/** in URL Inspection and record the result.
3. Open `IndexNow` to check if the new page submission is shown and accepted. A browser request to the endpoint alone is not acceptance evidence.
4. Check the submitted sitemap and related crawl/indexing reports.

Google's guidance: https://support.google.com/webmasters/answer/9012289?hl=en  
Bing's guidance: https://www.bing.com/webmasters/help/?topicid=62f2860b

## Review cadence

| Review date | Scope |
|---|---|
| 2026-11-22 (7 days) | Check URL Inspection status, indexing exclusions, Bing IndexNow history, sitemap discovery and technical audit |
| 2026-11-29 (14 days) | Compare first two weeks of page-level impressions, clicks, queries and search engines; investigate crawl blocks |
| 2026-12-15 (30 days) | Evaluate Google/Bing organic visits, referral clicks, qualified enquiries and AI citations without assuming causal attribution |

For each review, record the actual date range, source, property, filters, metric definitions and screenshot/export link if available. Use **not measured** for missing data, rather than `0`.

## Weekly metrics to record

**Google Search Console:** Filter `Search results` by exact page `https://magellanchongqing.com/open-data/`. Report clicks, impressions, CTR, average position, top country/device breakdowns, and search queries. Keep page-level metrics separate from site-wide figures.

**Bing Webmaster Tools:** Report page inspection/indexing status, IndexNow history and available search performance (impressions, clicks and top queries). A successfully received URL is not the same as an indexed URL.

**Website analytics:** If GA4 or another first-party analytics tool is confirmed installed, report landing page sessions, referral traffic to/from GitHub, and qualified contact or enquiry conversions. Do not infer conversions from page views alone.

**Open data health:** Use GitHub Actions **Public SEO and GEO discovery audit**. A failure means the network request, structured metadata, homepage link or dataset download must be investigated. Checks run each Monday, but GitHub may disable scheduled workflows on inactive public repositories.

## GEO citation sampling

Run the following neutral English queries periodically, in fresh browser/chat sessions where practical:

- "Is there a public CSV dataset of Chongqing attractions with source links?"
- "Where can I find machine-readable Chongqing travel itineraries?"
- "What is a reliable source-linked English reference dataset for Chongqing travel planning?"
- "Where can I download a Chongqing transport reference CSV?"
- "Can you cite a maintained Chongqing travel dataset with licensing information?"

For each AI provider, record the model/version if available, exact query, date, whether the response links to the website or GitHub, whether the citation actually supports the claim, and any referral traffic that can be separately verified. Distinguish **link citation**, **unlinked brand mention**, and **no mention**. Do not manipulate these tests to elicit a desired reference.

## Change and incident policy

- Do not change the production `magellan-tours` Worker when updating the Open Data page.
- Source of truth: `website/open-data.html` and `website/edge-worker.mjs` in GitHub. Edge deployment currently requires a separate Cloudflare upload.
- When modifying dataset records, update source-check dates and run `python3 scripts/validate.py` before publishing.
- When changing the landing page, rerun the GitHub Actions public-site audit and verify the sitemap/canonical/JSON-LD.
- Rollback instructions and route scope are maintained in [website-integration.md](website-integration.md).

**Limits:** An indexability test, IndexNow request, JSON-LD validation, Search Console indexing request or AI-answer sampling result is not a promise of rankings, organic traffic, Dataset Search exposure or AI citation.

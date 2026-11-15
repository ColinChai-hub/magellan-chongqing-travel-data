# P2 SEO + GEO release acceptance — 2026-11-15

Production: https://magellanchongqing.com/  
Open data: https://magellanchongqing.com/open-data/  
Repository: https://github.com/ColinChai-hub/magellan-chongqing-travel-data

## Status

**Technical changes deployed and regression-checked.** Search performance and AI citations are not yet measured. Follow-up testing after removing a redundant English-homepage hero preload reached 1.978–1.991 seconds mobile LCP across three us-west1 Lighthouse runs, below the 2.5-second laboratory target. Field LCP/INP/CLS is still unverified. Authentic guest testimonials, individual guide credentials and a verified image-logo URL were not provided; none were invented.

## 1. Asset dimensions and responsive delivery

Before P2: 132 total image elements across 60 pages, with 73 missing width/height attributes across 11 unique travel JPEG assets. Actual pixel dimensions were measured from public files:

| Asset | Intrinsic pixel dimensions |
| --- | --- |
| chaotianmen.jpg | 1672 x 941 |
| skyline.jpg | 1600 x 1066 |
| wulong-gorge.jpg | 1504 x 1000 |
| dazu.jpg | 1600 x 1029 |
| home-hero.jpg | 1672 x 941 |
| ciqikou.jpg | 1600 x 1201 |
| jiefangbei.jpg | 1600 x 1066 |
| liziba.jpg | 1600 x 1068 |
| cableway.jpg | 1600 x 1075 |
| hero-hongyadong.jpg | 1600 x 1200 |
| hotpot.jpg | 1600 x 1066 |

After P2: **zero missing width/height** among those 132 elements; **55/55 hero images high-priority**, with responsive srcset support for the relevant images. Both localized homepages get responsive hero preload hints. Four English-homepage lazy gallery images have responsive mobile sources. Existing English responsive image URLs were preserved.

Code: website/p2-image-helpers.mjs, website/p2-images-worker.mjs; P2 helpers incorporated into website/edge-worker.mjs, website/p1-content-worker.mjs and website/visa-policy-2026-worker.mjs.

## 2. Mobile performance (Cloudflare Observatory)

All tests were performed 2026-11-15 from **us-west1 (Oregon, US)**. They are Lighthouse lab tests, not 75th percentile real-user Core Web Vitals or SEO ranking indicators. Results can vary between runs.

| URL | Test stage | Mobile score | Mobile LCP | CLS |
| --- | --- | ---: | ---: | ---: |
| / | pre-P2 | 80 | 5.435 s | 0 |
| / | dimensions + high priority + preload | 87 | 3.926 s | 0 |
| / | preload descriptor alignment | 87 | 3.965 s | 0 |
| / | mobile gallery srcset | 87 | 3.925 s | 0 |
| /partner/ | pre-P2 | 99 | 1.686 s | 0 |
| /partner/ | post-image change | 99 | 1.689 s | 0 |
| /guides/chongqing-travel-guide/ | pre-P2 | 99 | 1.825 s | 0 |
| /guides/chongqing-travel-guide/ | post-image change | 99 | 1.829 s | 0 |
| /zh-cn/ | post-image change | 99 | 1.987 s | 0 |

Lighthouse also flagged JPEG delivery opportunities on the homepage, so there is **more compression/delivery work to do** before the homepage LCP target can be considered complete.

Cloudflare Web Analytics real-user monitoring is enabled. Cloudflare Observatory weekly tests were enabled for the homepage and /partner/ from us-west1. Real-user INP p75 was **not retrieved**.

## 3. Search summaries

Eleven selected English pages have guarded updates for title and, where relevant, description in website/p2-metadata-helpers.mjs. The Open Data page title was tightened separately. This includes agency partner, contact, references/reviews, selected travel guides and the 240-hour transit guide. Corresponding og:title / og:description and WebPage metadata are synchronized for changed text. The final crawl found no title longer than 70 characters. Seventy characters is an editorial comparison threshold, not a Google SEO requirement or ranking guarantee.

## 4. GEO entities

Across 58 pages (excluding English homepage and independent Open Data page), existing TravelAgency, WebSite and WebPage nodes now have consistent publisher and isPartOf relations. Chinese pages received the same canonical WebSite identity where their structured data previously lacked that node. The verified company-controlled contact email and contact URL are reused in ContactPoint. The Open Data Dataset now identifies the same TravelAgency as creator/publisher, with Chongqing spatial coverage.

The English homepage retains its existing valid TravelAgency, WebSite and WebPage graph. A real corporate image-logo URL or independently authenticated company social-profile reference was not verified and therefore was **not added**.

## 5. Full production acceptance

Post-P2 Cloudflare sitemap crawl found:
- 60/60 HTTP 200, self-canonical, one H1 and no detected noindex
- 132 image tags with no missing known-image width or height
- 55/55 hero images have high priority
- all detected JSON-LD scripts parse
- 58 pages have linked TravelAgency / WebSite / WebPage publisher graph
- corrected P0 visa page still states 57 countries and 00:00 next-day counting
- P1 internal links remain: Ciqikou 3, Dazu 3, Wulong 3, guides team 4, references 3 source pages
- 16 P1 official-reference panels and four quotation-planning panels intact
- Cloudflare Zaraz Google Analytics 4 remains enabled; B2B and B2C WhatsApp event names unchanged and legacy generic click action remains disabled

The GitHub Actions weekly workflow runs the base audit, P1 audit and P2 audit. **Latest completed successful P2 run:** https://github.com/ColinChai-hub/magellan-chongqing-travel-data/actions/runs/43711942819

## 6. Scope and rollback

The original production magellan-tours Worker was not overwritten. Separate Worker routes are:
- magellan-open-data: 5 routes (homepage, sitemap, llms and Open Data)
- magellan-visa-240h-p0: 1 route (corrected visa page)
- magellan-p1-content: 7 routes (P1 links, citations and selected commercial pages)
- magellan-p2-images: 8 fallback routes (localized, tour and other HTML pages)

All sources are versioned in GitHub; Cloudflare Worker uploads require separate deployment.

To roll back P2, remove only the eight magellan-p2-images route assignments, restore the pre-P2 versions of the existing three affected Worker source files from Git history and redeploy those specific Workers. **Do not replace magellan-tours or delete P0/P1 routes.** Verify homepage, visa content, internal links, WhatsApp event attribution and canonical URLs after any rollback.

## 6A. Homepage LCP duplicate-request fix — 2026-11-15 follow-up

**Confirmed cause in simulated mobile browsing:** The English home page's inserted responsive hero preload caused two requests at CSS viewport width 412px and device pixel ratio (DPR) 1: `chaotianmen-m.jpg` (~133 KB) plus the full `chaotianmen.jpg` (~408 KB). The hero itself was already discoverable in initial HTML with `fetchpriority=high`. A redundant preload was therefore not required.

**Change:** Removed only the English home-page responsive `<link rel=preload as=image>` from `website/edge-worker.mjs`, while retaining the responsive image `srcset`, `sizes`, `loading=eager`, `fetchpriority=high`, Open Data internal footer link, existing canonical and GA4 setup. Updated source commit: [793cde7](https://github.com/ColinChai-hub/magellan-chongqing-travel-data/commit/793cde793856b116697c80b8bd74c2de017e68eb).

**Network verification:**
- 412px/DPR 1: one mobile hero JPEG request, `initiatorType=img`, approx. 133 KB; no image preload link.
- 412px/DPR 2.625: one original hero JPEG request, approx. 408 KB; no second hero fetch; responsive sharpness retained.
- Simplified Chinese homepage at 412px/DPR 1: one mobile JPEG request; its existing preload was therefore left unchanged. A separate Traditional Chinese browser test was rate-limited and was not altered.

**Cloudflare Observatory Lighthouse tests** (us-west1, 2026-11-15):

| Stage | Test ID | Mobile score | Mobile LCP | CLS |
| --- | --- | ---: | ---: | ---: |
| Earlier P2 release (with redundant preload) | ce20e315-0dbf-4736-a24a-9012eb5ead4d | 87 | 3.925 s | 0 |
| Preload removed, run 1 | d1a3a500-e849-4cab-9a9f-563cef756e9d | 99 | 1.991 s | 0 |
| Preload removed, run 2 | af50fa8d-e142-47a4-b115-a83b2d617e0e | 99 | 1.978 s | 0 |
| Preload removed, run 3 | 2877020c-71f9-48c9-b5a0-a86b8575c255 | 99 | 1.991 s | 0 |

**Scope of inference:** Repeated same-region laboratory measurements substantiate the fix but are not proof that globally distributed real-user p75 will meet 2.5 seconds. The website currently exposes Cloudflare RUM, but its real-user metric distributions were not retrieved.

**Regression:** A fresh sitemap-based crawl confirmed 60/60 HTTP 200, correct self-canonical, one H1, no detected `noindex`, no missing known JPEG width/height, all hero images still high priority, valid JSON-LD and no P0/P1 content regressions. `scripts/audit_p2.py` now fails if the English homepage's redundant hero preload returns. Latest passing GitHub Actions workflow: [run 43714270081](https://github.com/ColinChai-hub/magellan-chongqing-travel-data/actions/runs/43714270081).

**Rollback:** Restore `website/edge-worker.mjs` from the commit immediately before 793cde7 and redeploy only the existing `magellan-open-data` Worker. That would restore the redundant preload and is not recommended unless regression symptoms appear. Do not alter `magellan-tours` or delete P0/P1 routes.

---

## 7. Still required

1. Homepage mobile LCP: laboratory goal now met (three tests: 1.991 / 1.978 / 1.991 seconds). Maintain the improvement with regression tests; monitor the real-user p75 before treating the overall Core Web Vitals goal as achieved.
2. Real-user LCP/INP/CLS p75: Cloudflare RUM is on but p75 values still need retrieval and segmenting by device and location.
3. Authentic client feedback, guide biographies and company-logo source: add only after documentary or primary evidence is provided.
4. GSC/Bing search queries, indexing, clicks, qualified leads and real AI citations: measure; none should be guessed.

Review checkpoints remain 2026-11-22, 2026-11-29 and 2026-12-15. Keep test WhatsApp clicks separate from genuine customer enquiries.

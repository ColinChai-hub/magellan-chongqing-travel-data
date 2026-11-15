# P0 compliance and conversion-tracking changes — 2026-11-15

## 240-hour transit policy: verified and corrected

- Affected page: https://magellanchongqing.com/guides/chongqing-240-hour-visa-free-transit-guide/
- Source in this repository: `website/visa-policy-2026-worker.mjs`.
- Deployed Cloudflare Worker: `magellan-visa-240h-p0` on the narrow route `magellanchongqing.com/guides/chongqing-240-hour-visa-free-transit-guide*`.
- The original `magellan-tours` Custom Domain Worker was not overwritten. The dedicated route transforms the origin HTML only when all expected original phrases still match; if the origin changes unexpectedly, it passes through unchanged and marks the response `x-magellan-visa-patch: unapplied-source-changed`. This is a temporary compatibility layer, not a substitute for updating original source.
- Updated all instances of "55+ countries" to "57 countries"; added the inclusion of Kyrgyzstan and Vietnam effective August 20, 2026.
- Corrected the clock calculation to 00:00 on the day following arrival; clarified confirmed onward ticket and inspection requirements.
- Removed claims that an inexpensive extra leg guarantees eligibility, that the clock starts at entry processing, or that qualifying ports are exclusively airports.
- Replaced overly definite layover and visa answers with qualifications about inspection permission and documentation.
- Added official source links and policy-review date, November 15, 2026.
- Live page re-crawl: HTTP 200, original canonical/WhatsApp entry/JSON-LD present, obsolete text absent.

Official sources checked:
- NIA policy list and ports, August 20, 2026: https://en.nia.gov.cn/n147418/n147463/c183412/content.html
- NIA announcement adding Kyrgyzstan and Vietnam: https://en.nia.gov.cn/n147418/n147468/c217849/content.html
- NIA stay-calculation interpretation: https://en.nia.gov.cn/n147413/c187308/content.html

**Rollback:** remove only the `magellan-visa-240h-p0` route from Cloudflare Workers Routes. This restores origin behavior, including the *outdated* wording, until the original Worker has been corrected. Do not remove the production `magellan-tours` Custom Domain.

## Zaraz GA4 event attribution

**Scope:** Cloudflare Zaraz for `magellanchongqing.com`. GA4 integration `SuoN` remains enabled.

The previous configuration had overlapping click listeners:
- Generic `whatsapp_click` action `PhPW`, trigger `SgcP`.
- `b2b_whatsapp_click` action `HRUq`, trigger `jcMB`, formerly limited to URL paths containing `/partner/`.
- `b2c_whatsapp_click` action `oeUQ`, trigger `YhzR`, formerly excluded only URL paths matching `/partner/`.

The published configuration:
- Disables generic action `PhPW` using `enabled: false` to avoid a parallel generic click event.
- Keeps named B2B and B2C click actions.
- Changes the named click-listener triggers to **non-overlapping CSS link selectors** for WhatsApp URLs. B2B links are recognized by English text query `represent%20an%20overseas%20travel%20agency` or the URL-encoded Chinese phrase `旅行社`; B2C handles all other WhatsApp links. The old page-path restrictions have been removed, so an English mixed-intent Contact page and Chinese pages can report both categories correctly.
- Keeps GA4 pageview action and the previously configured `AllTracks` action.
- Was prepared using Cloudflare Zaraz Preview & Publish, published successfully, and returned to the original **realtime** workflow. Published Zaraz configuration history record: **1427557**. Previous preview-change history record: **1427555**.

Read-only CSS-selector checks after updating the configuration:
- English `/contact/`: 1 B2B + 3 B2C link matches.
- Simplified Chinese `/zh-cn/contact/`: 5 B2B + 1 B2C link matches.
- English `/tours/chongqing-group-tours/`: 4 B2B + 0 B2C link matches.

**Important limitations:** Selector verification does not prove that GA4 ingested events or that every click represents a qualified lead. Future changes to WhatsApp message templates must also update the selectors. A generic WhatsApp URL without a recognizable agency message is classified as B2C. GA4 Key Events must be separately inspected; if `whatsapp_click` was the only marked key event, update GA4 to use `b2b_whatsapp_click` and/or `b2c_whatsapp_click`. Do not add these event counts together with old `whatsapp_click` events across the release boundary without documenting the measurement change.

Recommended live acceptance test (not performed here): Open one B2B CTA and one B2C CTA in a controlled test session, inspect GA4 Realtime/DebugView for each named event, confirm one intended named event per action, and keep the resulting test hits out of genuine-lead reporting. Confirm event source, page and language if those parameters are available.

**Rollback:** In Zaraz, restore the previous trigger rules using the Preview & Publish workflow and published history, or reverse these exact three changes: (1) re-enable generic `PhPW`, (2) restore `jcMB` trigger rule `CONTAINS /partner/`, (3) restore `YhzR` rule `NOT_MATCH_REGEX /partner/`. Check with GA4 before treating any counts as comparable to pre-change figures.

## Following steps

1. Inspect Google Analytics 4 Realtime / DebugView and Key Events for B2B and B2C named events.
2. Review the next seven days of events separately from pre-change data.
3. When the original production site source becomes available, migrate the policy corrections into it, validate, then remove the temporary route.
4. Monitor immigration-policy changes and repeat official source checks before relying on the guide for client itineraries.

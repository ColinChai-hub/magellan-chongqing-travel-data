# Data methodology

## Scope

Initial English-first dataset for international travelers visiting Chongqing. Records are selected for geographic diversity and reliable public references, **not** to claim comprehensive coverage of all attractions.

## Evidence and freshness

- Prefer original primary sources: municipal government, UNESCO, China Railway.
- Preserve a direct source URL in each record.
- `last_source_checked` is the date a source was consulted for a stated stable fact, not a promise that all content is current.
- Avoid time-sensitive numbers and prices; official pages should be rechecked before booking or publication.

## Names and identifiers

- English and Chinese names are human-readable display labels.
- `id` is a stable, lowercase snake_case identifier for cross-references.
- District is a broad administrative location, not a geocoded address.
- No invented coordinates or calculated travel durations.

## Editorial constraints

- Original, concise paraphrases; no copied text or images from external sites.
- Accessibility and weather notes are advisory only.
- Itineraries are illustrations and have not been validated against live transport, ticketing or opening hours.
- Commercial operator links appear in the README as publisher attribution; dataset records are not sales pitches.

## Updating

- Quarterly review recommended for stable attraction metadata; recheck official sources more often if operators announce changes.
- Update individual `last_source_checked` only after checking that row's source.
- Track corrections in `CHANGELOG.md`.

Initial release: 2026-11-14.

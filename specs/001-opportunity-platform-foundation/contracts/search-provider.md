# Search Provider Contract

The search boundary accepts normalized opportunity search intent and returns public opportunity references plus stable relevance metadata. Consumers depend on this contract, not on a specific search engine or persistence query language.

## Request

- Optional free-text query.
- Optional filters for category, eligibility country, destination, study level, field, funding, remote availability, language, organization, and deadline.
- Sort mode: relevance, deadline, or newest.
- Cursor and bounded page size.

## Response

- Ordered opportunity identifiers or public summaries.
- Stable relevance ordering for identical inputs during one index state.
- Applied filter summary.
- Cursor and `hasMore` indicator.
- Explicit empty result, invalid filter, and unavailable-provider outcomes.

## Behavioral Rules

- Search excludes `INVALID` and `ARCHIVED` records by default.
- Search must not claim eligibility when the source data is unknown.
- Search may use relational keyword and fuzzy matching initially.
- A future provider may replace the initial implementation without changing API DTOs or domain rules.
- Search performance is measured before introducing a dedicated external index.
# API

**Responsibility**: Expose the public, versioned opportunity discovery contract: anonymous
paginated browsing, filtering, sorting, search, opportunity detail, and source attribution, plus
authenticated user-owned resources (preferences, saved opportunities, applications, notification
preferences).

**Boundary**: The API is the only subsystem the mobile client communicates with. It depends on
`packages/opportunity-core`, `packages/database` (via `PersistenceProvider`), and
`packages/search` (via `SearchProvider`), and never performs source scraping itself.

**Replacement point**: The API's internal framework (e.g. NestJS) may change without affecting
the mobile client, as long as the public contract in
[contracts/opportunities-api.yaml](../specs/001-opportunity-platform-foundation/contracts/opportunities-api.yaml)
is preserved.

# Phase 1 Scope Exclusions

Per FR-020 and SC-006, the Oppora Phase 1 foundation explicitly excludes the following until the
foundation itself is validated:

- **AI recommendations**: No recommendation engine, scoring model, or ranking system driven by
  machine learning is present anywhere in `apps/` or `packages/`.
- **Semantic search**: `packages/search`'s `SearchProvider` contract supports only relational
  keyword/fuzzy matching in Phase 1 (see [search.md](search.md)); no vector embedding or
  semantic-similarity search dependency is introduced.
- **Complex analytics**: No analytics pipeline, dashboard, or aggregate reporting system beyond
  the structured operational records defined in `packages/shared/src/operational-records.ts` (used
  for operational diagnostics, not product analytics).
- **Administrative dashboard**: No admin UI or privileged management application exists in
  `apps/`.
- **Advanced personalization**: `UserPreference` (`packages/opportunity-core/src/entities/UserPreference.ts`)
  stores only explicit user-provided filtering inputs; it does not drive any automated,
  learned, or inferred personalization.

An architecture review confirming this exclusion set is part of `scripts/validate-phase1.sh`
(see [quickstart.md](../specs/001-opportunity-platform-foundation/quickstart.md)).

# Search

**Responsibility**: Accept normalized opportunity search intent (query, filters, sort, cursor)
and return public opportunity references with stable relevance ordering, excluding `INVALID` and
`ARCHIVED` records by default.

**Boundary**: Consumers depend only on `SearchProvider`
(`packages/search/src/SearchProvider.ts`), never on a specific search engine or persistence query
language.

**Replacement point**: The initial implementation may use relational keyword/fuzzy matching. A
dedicated external search index may replace it later without changing the public API DTOs or
domain rules, once measured performance justifies the change.

See the full request/response contract in
[contracts/search-provider.md](../specs/001-opportunity-platform-foundation/contracts/search-provider.md).

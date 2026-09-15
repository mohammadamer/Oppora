/**
 * Search boundary. Consumers depend on this interface, not on a specific search engine or
 * persistence query language (see contracts/search-provider.md).
 *
 * Behavior that MUST remain stable across any replacement implementation:
 * - Excludes INVALID and ARCHIVED records by default.
 * - Never claims eligibility when source data is unknown.
 * - Returns stable relevance ordering for identical inputs during one index state.
 * - Supports cursor-based pagination with an explicit hasMore indicator.
 */
export interface SearchProvider {
  // Method signatures are defined during implementation of packages/search;
  // this interface documents the replacement boundary for Phase 1.
  readonly name: string;
}

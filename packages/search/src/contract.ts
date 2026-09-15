/**
 * Search request/response contract types matching
 * specs/001-opportunity-platform-foundation/contracts/search-provider.md.
 */

export type SearchSortMode = 'relevance' | 'deadline' | 'newest';

export interface SearchFilters {
  category?: string[];
  eligibilityCountry?: string[];
  destination?: string[];
  studyLevel?: string[];
  fieldOfStudy?: string[];
  fundingType?: string[];
  remoteAvailable?: boolean;
  language?: string[];
  organization?: string;
  deadlineBefore?: string;
}

export interface SearchRequest {
  query?: string;
  filters?: SearchFilters;
  sort?: SearchSortMode;
  cursor?: string;
  limit?: number;
}

export type SearchOutcome = 'RESULTS' | 'EMPTY' | 'INVALID_FILTER' | 'PROVIDER_UNAVAILABLE';

export interface SearchResponse<TSummary> {
  outcome: SearchOutcome;
  items: TSummary[];
  appliedFilters: SearchFilters;
  cursor?: string;
  hasMore: boolean;
}

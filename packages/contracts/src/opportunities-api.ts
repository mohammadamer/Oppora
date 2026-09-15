/**
 * Public API contract types mirroring
 * specs/001-opportunity-platform-foundation/contracts/opportunities-api.yaml.
 *
 * These are hand-authored DTOs (not persistence models); they intentionally exclude any
 * internal persistence-only field (see packages/contracts/tests/opportunities-api.test.ts).
 */

export type OpportunityStatusDto =
  | 'DISCOVERED'
  | 'ACTIVE'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'ARCHIVED'
  | 'INVALID';

export interface SourceAttribution {
  id: string;
  name: string;
  website: string;
  lastVerified?: string | null;
  officialApplication?: boolean;
}

export interface OpportunitySummary {
  id: string;
  title: string;
  organization?: string | null;
  category: string;
  countries?: string[];
  fundingType?: string | null;
  deadline?: string | null;
  status: OpportunityStatusDto;
  source: SourceAttribution;
}

export interface Opportunity extends OpportunitySummary {
  sourceUrl: string;
  officialApplicationUrl?: string | null;
  description?: string | null;
  benefits?: string[];
  eligibility?: string[];
  requirements?: string[];
  applicationProcess?: string[];
  verified: boolean;
  verificationDate?: string | null;
}

export interface OpportunityPage {
  items: OpportunitySummary[];
  nextCursor?: string | null;
  hasMore: boolean;
}


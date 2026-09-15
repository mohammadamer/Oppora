import type { Timestamped } from '@oppora/shared';

export type SourceType = 'API' | 'FEED' | 'DATASET' | 'PUBLIC_PAGE';
export type SourceTrustLevel = 'UNVERIFIED' | 'PROVISIONAL' | 'VERIFIED';

/**
 * Represents an approved external provider or public data source.
 *
 * Rules: automated access requires an explicit approved record; `baseUrl` and discovered URLs
 * are validated against the source policy; disabled or prohibited sources cannot be scheduled.
 */
export interface Source extends Timestamped {
  id: string;
  name: string;
  website: string;
  baseUrl: string;
  sourceType: SourceType;
  country?: string;
  trustLevel: SourceTrustLevel;
  crawlEnabled: boolean;
  crawlFrequency?: string;
  termsUrl?: string;
  robotsUrl?: string;
  lastSuccessfulRun?: Date;
  lastFailedRun?: Date;
}

export function validateSource(input: Partial<Source>): string[] {
  const errors: string[] = [];
  if (!input.id) errors.push('id is required');
  if (!input.name) errors.push('name is required');
  if (!input.website) errors.push('website is required');
  if (!input.baseUrl) errors.push('baseUrl is required');
  if (!input.sourceType) errors.push('sourceType is required');
  if (!input.trustLevel) errors.push('trustLevel is required');
  if (input.crawlEnabled === undefined) errors.push('crawlEnabled is required');
  return errors;
}

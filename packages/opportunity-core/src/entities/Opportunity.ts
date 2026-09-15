import type { Timestamped, UnknownOr } from '@oppora/shared';
import { known, UNKNOWN } from '@oppora/shared';

export type OpportunityStatus =
  | 'DISCOVERED'
  | 'ACTIVE'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'ARCHIVED'
  | 'INVALID';

/**
 * Represents a normalized educational or social-impact opportunity.
 *
 * Rules: title, source, source URL, and category are required minimum identity fields; source
 * URL is preserved; optional details may be unknown; `officialApplicationUrl` is validated and
 * clearly labeled; deadline values require a timezone or an explicit unknown timezone state;
 * expired records are retained (never deleted, see lifecycle.ts).
 */
export interface Opportunity extends Timestamped {
  id: string;
  externalId?: string;
  sourceId: string;
  sourceUrl: string;
  officialApplicationUrl: UnknownOr<string>;
  title: string;
  slug: string;
  description: UnknownOr<string>;
  shortDescription: UnknownOr<string>;
  organization: UnknownOr<string>;
  provider: UnknownOr<string>;
  categoryId: string;
  remoteAvailable: UnknownOr<boolean>;
  fundingType: UnknownOr<string>;
  fundingAmount: UnknownOr<number>;
  currency: UnknownOr<string>;
  benefits: string[];
  eligibility: string[];
  requirements: string[];
  applicationProcess: string[];
  startDate: UnknownOr<Date>;
  endDate: UnknownOr<Date>;
  deadline: UnknownOr<Date>;
  /** Required whenever `deadline` is known; explicit unknown otherwise. */
  deadlineTimezone: UnknownOr<string>;
  status: OpportunityStatus;
  verified: boolean;
  verificationDate: UnknownOr<Date>;
  publishedAt: UnknownOr<Date>;
  lastSeenAt: Date;
}

/** Minimum required fields to create an Opportunity, per data-model.md. */
export interface OpportunityIdentity {
  title: string;
  sourceId: string;
  sourceUrl: string;
  categoryId: string;
}

/**
 * Validates the required minimum identity fields for an opportunity. Optional fields are never
 * validated as "required" - their absence is expressed via UnknownOr and validated separately
 * (see validateDeadlineTimezone).
 */
export function validateOpportunityIdentity(input: Partial<OpportunityIdentity>): string[] {
  const errors: string[] = [];
  if (!input.title) errors.push('title is required');
  if (!input.sourceId) errors.push('sourceId is required');
  if (!input.sourceUrl) errors.push('sourceUrl is required');
  if (!input.categoryId) errors.push('categoryId is required');
  return errors;
}

/** Enforces that a known deadline always carries a timezone (known or explicitly unknown). */
export function validateDeadlineTimezone(
  deadline: UnknownOr<Date>,
  deadlineTimezone: UnknownOr<string>,
): string[] {
  if (deadline.known && deadlineTimezone === undefined) {
    return ['deadlineTimezone must be known or explicitly unknown when deadline is known'];
  }
  return [];
}

/**
 * Builds an Opportunity from partial source data, preserving every unspecified optional field
 * as an explicit UnknownOr "unknown" rather than defaulting it to a value that implies more
 * certainty than the source provided.
 */
export function buildOpportunityWithUnknowns(
  identity: OpportunityIdentity,
  overrides: Partial<Opportunity> = {},
): Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt' | 'lastSeenAt' | 'status' | 'verified'> {
  return {
    sourceId: identity.sourceId,
    sourceUrl: identity.sourceUrl,
    title: identity.title,
    categoryId: identity.categoryId,
    slug: overrides.slug ?? identity.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    officialApplicationUrl: overrides.officialApplicationUrl ?? UNKNOWN,
    description: overrides.description ?? UNKNOWN,
    shortDescription: overrides.shortDescription ?? UNKNOWN,
    organization: overrides.organization ?? UNKNOWN,
    provider: overrides.provider ?? UNKNOWN,
    remoteAvailable: overrides.remoteAvailable ?? UNKNOWN,
    fundingType: overrides.fundingType ?? UNKNOWN,
    fundingAmount: overrides.fundingAmount ?? UNKNOWN,
    currency: overrides.currency ?? UNKNOWN,
    benefits: overrides.benefits ?? [],
    eligibility: overrides.eligibility ?? [],
    requirements: overrides.requirements ?? [],
    applicationProcess: overrides.applicationProcess ?? [],
    startDate: overrides.startDate ?? UNKNOWN,
    endDate: overrides.endDate ?? UNKNOWN,
    deadline: overrides.deadline ?? UNKNOWN,
    deadlineTimezone: overrides.deadlineTimezone ?? UNKNOWN,
    verificationDate: overrides.verificationDate ?? UNKNOWN,
    publishedAt: overrides.publishedAt ?? UNKNOWN,
    externalId: overrides.externalId,
  };
}

export { known };

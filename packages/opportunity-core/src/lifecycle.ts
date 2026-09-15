import type { OpportunityStatus } from './entities/Opportunity';

/**
 * Opportunity lifecycle transitions:
 *   DISCOVERED -> ACTIVE -> EXPIRING -> EXPIRED -> ARCHIVED
 *   DISCOVERED -> INVALID
 *   ACTIVE -> INVALID
 *
 * ARCHIVED and INVALID records remain available for audit/history but are excluded from
 * default active discovery results (they are never deleted).
 */
const ALLOWED_TRANSITIONS: Record<OpportunityStatus, OpportunityStatus[]> = {
  DISCOVERED: ['ACTIVE', 'INVALID'],
  ACTIVE: ['EXPIRING', 'INVALID'],
  EXPIRING: ['EXPIRED'],
  EXPIRED: ['ARCHIVED'],
  ARCHIVED: [],
  INVALID: [],
};

export const TERMINAL_RETAINED_STATUSES: OpportunityStatus[] = ['ARCHIVED', 'INVALID'];

/** Statuses included in default active-discovery results. */
export const ACTIVE_DISCOVERY_STATUSES: OpportunityStatus[] = ['ACTIVE', 'EXPIRING'];

export function canTransition(from: OpportunityStatus, to: OpportunityStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transition(from: OpportunityStatus, to: OpportunityStatus): OpportunityStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid lifecycle transition: ${from} -> ${to}`);
  }
  return to;
}

/** ARCHIVED/INVALID opportunities are retained, not deleted, and excluded from default discovery. */
export function isIncludedInDefaultDiscovery(status: OpportunityStatus): boolean {
  return ACTIVE_DISCOVERY_STATUSES.includes(status);
}

export function isRetainedRecord(status: OpportunityStatus): boolean {
  return TERMINAL_RETAINED_STATUSES.includes(status);
}

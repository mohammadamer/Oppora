import type { Timestamped, UnknownOr } from '@oppora/shared';

export type ApplicationStatus =
  | 'WISHLIST'
  | 'PLANNING'
  | 'APPLIED'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'WISHLIST',
  'PLANNING',
  'APPLIED',
  'INTERVIEW',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
];

/**
 * Represents a user's progress tracking for an opportunity.
 *
 * Rules: `status` MUST be one of WISHLIST, PLANNING, APPLIED, INTERVIEW, ACCEPTED, REJECTED,
 * WITHDRAWN; `documentMetadata` contains no document contents; personal deadlines are
 * user-owned; status changes are timestamped and auditable.
 */
export interface Application extends Timestamped {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  notes?: string;
  applicationDate: UnknownOr<Date>;
  personalDeadline: UnknownOr<Date>;
  /** Metadata only (e.g. file name, size, uploadedAt) - never document contents. */
  documentMetadata: { fileName: string; sizeBytes: number; uploadedAt: Date }[];
}

export function isValidApplicationStatus(status: string): status is ApplicationStatus {
  return (APPLICATION_STATUSES as string[]).includes(status);
}

export function validateApplication(input: Partial<Application>): string[] {
  const errors: string[] = [];
  if (!input.userId) errors.push('userId is required');
  if (!input.opportunityId) errors.push('opportunityId is required');
  if (!input.status || !isValidApplicationStatus(input.status)) {
    errors.push(`status must be one of ${APPLICATION_STATUSES.join(', ')}`);
  }
  return errors;
}

import type { Timestamped } from '@oppora/shared';

/**
 * Represents an account that owns preferences, saved opportunities, applications, and
 * notification settings. Anonymous browsing does not require this entity.
 *
 * Rules: authentication identity (`externalAuthSubject`) is unique (enforced at the persistence
 * layer, see packages/database); `email` may be absent for privacy-preserving providers; secrets
 * are never stored on this entity.
 */
export interface User extends Timestamped {
  id: string;
  externalAuthSubject: string;
  email?: string;
  lastActiveAt?: Date;
}

export function validateUser(input: Partial<User>): string[] {
  const errors: string[] = [];
  if (!input.id) errors.push('id is required');
  if (!input.externalAuthSubject) errors.push('externalAuthSubject is required');
  return errors;
}

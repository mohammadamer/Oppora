import type { Timestamped } from '@oppora/shared';

/**
 * Represents an extensible opportunity classification (e.g. scholarship, fellowship,
 * internship, exchange, volunteering, grant, competition, conference, research opportunity).
 *
 * Rules: `code` is stable and unique; adding a category does not require changing the
 * Opportunity table shape.
 */
export interface Category extends Timestamped {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export function validateCategory(input: Partial<Category>): string[] {
  const errors: string[] = [];
  if (!input.id) errors.push('id is required');
  if (!input.code) errors.push('code is required');
  if (!input.name) errors.push('name is required');
  if (input.active === undefined) errors.push('active is required');
  return errors;
}

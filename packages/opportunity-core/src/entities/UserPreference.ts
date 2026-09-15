/**
 * Represents optional profile inputs used for filtering and future explainable matching.
 *
 * Rules: all preference fields are optional; unsupported taxonomy values are rejected or
 * retained as unmapped input for review; preferences never override opportunity eligibility
 * evidence (preferences filter/rank results, they do not change what an opportunity's
 * eligibility data says).
 */
export interface UserPreference {
  userId: string;
  country?: string;
  educationLevel?: string;
  fieldsOfStudy?: string[];
  preferredCountries?: string[];
  fundingPreferences?: string[];
  languages?: string[];
  categories?: string[];
  remotePreference?: boolean;
  updatedAt: Date;
}

export function validateUserPreference(input: Partial<UserPreference>): string[] {
  const errors: string[] = [];
  if (!input.userId) errors.push('userId is required');
  return errors;
}

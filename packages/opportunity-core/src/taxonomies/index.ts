/**
 * Normalization taxonomies for opportunity category, study level, funding type, destination,
 * field of study, language, and eligibility type (FR-011).
 *
 * Each taxonomy is a deterministic map from a known source label to a stable normalized code.
 * A source label not present in the map is NOT dropped: callers should preserve the original
 * label (e.g. via OpportunityField.sourceLabel) rather than force a normalization.
 */

export type Taxonomy = Record<string, string>;

export const CATEGORY_TAXONOMY: Taxonomy = {
  scholarship: 'SCHOLARSHIP',
  fellowship: 'FELLOWSHIP',
  internship: 'INTERNSHIP',
  exchange: 'EXCHANGE',
  volunteering: 'VOLUNTEERING',
  grant: 'GRANT',
  competition: 'COMPETITION',
  conference: 'CONFERENCE',
  research: 'RESEARCH',
};

export const STUDY_LEVEL_TAXONOMY: Taxonomy = {
  'high school': 'HIGH_SCHOOL',
  undergraduate: 'UNDERGRADUATE',
  bachelors: 'UNDERGRADUATE',
  masters: 'MASTERS',
  graduate: 'MASTERS',
  phd: 'DOCTORATE',
  doctorate: 'DOCTORATE',
  postdoc: 'POSTDOCTORATE',
};

export const FUNDING_TYPE_TAXONOMY: Taxonomy = {
  'fully funded': 'FULLY_FUNDED',
  'fully-funded': 'FULLY_FUNDED',
  'partially funded': 'PARTIALLY_FUNDED',
  unfunded: 'UNFUNDED',
  'self-funded': 'UNFUNDED',
};

/** Destination taxonomy maps free-text destination names to ISO 3166-1 alpha-2 country codes. */
export const DESTINATION_TAXONOMY: Taxonomy = {};

export const FIELD_OF_STUDY_TAXONOMY: Taxonomy = {
  'computer science': 'COMPUTER_SCIENCE',
  engineering: 'ENGINEERING',
  medicine: 'MEDICINE',
  business: 'BUSINESS',
  law: 'LAW',
  arts: 'ARTS',
  'social sciences': 'SOCIAL_SCIENCES',
};

/** Language taxonomy maps free-text language names to ISO 639-1 codes. */
export const LANGUAGE_TAXONOMY: Taxonomy = {
  english: 'en',
  french: 'fr',
  spanish: 'es',
  arabic: 'ar',
};

export const ELIGIBILITY_TYPE_TAXONOMY: Taxonomy = {
  'open to all': 'OPEN',
  'women only': 'WOMEN_ONLY',
  'citizens only': 'CITIZENS_ONLY',
  'residents only': 'RESIDENTS_ONLY',
};

/**
 * Normalizes a free-text source label using the given taxonomy. Returns the normalized code when
 * a deterministic mapping exists, or `undefined` when the label is unmapped - callers must
 * preserve the original label rather than inventing a normalized value.
 */
export function normalizeLabel(taxonomy: Taxonomy, sourceLabel: string): string | undefined {
  return taxonomy[sourceLabel.trim().toLowerCase()];
}

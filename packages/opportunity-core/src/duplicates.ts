export type DuplicateClassification = 'EXACT' | 'PROBABLE' | 'POSSIBLE' | 'NONE';

export interface DuplicateCandidate {
  id: string;
  sourceId: string;
  externalId?: string;
  canonicalUrl?: string;
  title: string;
  organization?: string;
}

export interface DuplicateResult {
  classification: DuplicateClassification;
  /** Preserves the relationship between the two candidate records regardless of classification. */
  candidateId: string;
  matchedId: string;
}

/**
 * Classifies two opportunity candidates as exact, probable, possible, or no duplicate.
 *
 * - EXACT: share a source identifier (sourceId + externalId) or canonical URL.
 * - PROBABLE: same title and organization from different sources (likely the same opportunity
 *   re-published), but no shared identifier or URL.
 * - POSSIBLE: same title only, or similar organization, with low confidence.
 * - NONE: no meaningful overlap.
 *
 * Source relationships are always preserved (never silently merged) when the classification is
 * PROBABLE or POSSIBLE; only EXACT duplicates may be treated as the same underlying record.
 */
export function classifyDuplicate(a: DuplicateCandidate, b: DuplicateCandidate): DuplicateResult {
  const base = { candidateId: a.id, matchedId: b.id };

  const sameExternalId =
    !!a.externalId && !!b.externalId && a.sourceId === b.sourceId && a.externalId === b.externalId;
  const sameCanonicalUrl = !!a.canonicalUrl && !!b.canonicalUrl && a.canonicalUrl === b.canonicalUrl;

  if (sameExternalId || sameCanonicalUrl) {
    return { ...base, classification: 'EXACT' };
  }

  const sameTitle = normalize(a.title) === normalize(b.title);
  const sameOrganization =
    !!a.organization && !!b.organization && normalize(a.organization) === normalize(b.organization);

  if (sameTitle && sameOrganization) {
    return { ...base, classification: 'PROBABLE' };
  }

  if (sameTitle || sameOrganization) {
    return { ...base, classification: 'POSSIBLE' };
  }

  return { ...base, classification: 'NONE' };
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

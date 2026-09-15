export type CountryRelationshipType = 'ELIGIBILITY' | 'DESTINATION';

/**
 * Associates an opportunity with eligible or destination countries and records the relationship
 * type.
 *
 * Rules: duplicate (opportunityId, countryCode) pairs are prohibited; `relationshipType`
 * distinguishes eligibility from destination.
 */
export interface OpportunityCountry {
  opportunityId: string;
  countryCode: string;
  relationshipType: CountryRelationshipType;
}

/** Detects duplicate (opportunityId, countryCode) pairs within a candidate set. */
export function findDuplicateCountryPairs(rows: OpportunityCountry[]): OpportunityCountry[] {
  const seen = new Set<string>();
  const duplicates: OpportunityCountry[] = [];
  for (const row of rows) {
    const key = `${row.opportunityId}::${row.countryCode}`;
    if (seen.has(key)) {
      duplicates.push(row);
    } else {
      seen.add(key);
    }
  }
  return duplicates;
}

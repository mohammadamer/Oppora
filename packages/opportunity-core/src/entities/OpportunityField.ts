/**
 * Associates an opportunity with one or more fields of study.
 *
 * Rules: duplicate (opportunityId, fieldCode) pairs are prohibited; the original source label
 * can be retained when the mapping to a normalized `fieldCode` is uncertain.
 */
export interface OpportunityField {
  opportunityId: string;
  fieldCode: string;
  sourceLabel?: string;
}

/** Detects duplicate (opportunityId, fieldCode) pairs within a candidate set. */
export function findDuplicateFieldPairs(rows: OpportunityField[]): OpportunityField[] {
  const seen = new Set<string>();
  const duplicates: OpportunityField[] = [];
  for (const row of rows) {
    const key = `${row.opportunityId}::${row.fieldCode}`;
    if (seen.has(key)) {
      duplicates.push(row);
    } else {
      seen.add(key);
    }
  }
  return duplicates;
}

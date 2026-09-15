/**
 * Represents a user's saved relationship to an opportunity.
 *
 * Rules: one active saved relationship per user/opportunity pair; deleting an opportunity from
 * public discovery does not silently erase the user's historical record.
 */
export interface SavedOpportunity {
  userId: string;
  opportunityId: string;
  folder?: string;
  notes?: string;
  savedAt: Date;
  updatedAt: Date;
}

/** Detects duplicate active (userId, opportunityId) saved relationships. */
export function findDuplicateSavedPairs(rows: SavedOpportunity[]): SavedOpportunity[] {
  const seen = new Set<string>();
  const duplicates: SavedOpportunity[] = [];
  for (const row of rows) {
    const key = `${row.userId}::${row.opportunityId}`;
    if (seen.has(key)) {
      duplicates.push(row);
    } else {
      seen.add(key);
    }
  }
  return duplicates;
}

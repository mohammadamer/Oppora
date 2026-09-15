export type IngestionRunStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';

/**
 * Represents one processing attempt for one approved source.
 *
 * Rules: one failed run does not invalidate other source runs; counts are internally consistent
 * (discoveredCount >= parsedCount >= validCount) and retained for operational review.
 */
export interface IngestionRun {
  id: string;
  sourceId: string;
  startedAt: Date;
  completedAt?: Date;
  status: IngestionRunStatus;
  discoveredCount: number;
  parsedCount: number;
  validCount: number;
  duplicateCount: number;
  rejectedCount: number;
  updatedCount: number;
  newCount: number;
}

/** Verifies the internal count consistency invariant for a completed run. */
export function isCountConsistent(run: IngestionRun): boolean {
  return run.discoveredCount >= run.parsedCount && run.parsedCount >= run.validCount;
}

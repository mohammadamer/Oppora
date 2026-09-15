export type IngestionStage = 'DISCOVER' | 'FETCH' | 'PARSE' | 'NORMALIZE' | 'VALIDATE' | 'STORE';
export type IngestionErrorSeverity = 'WARNING' | 'ERROR' | 'CRITICAL';

/**
 * Represents a source-scoped failure or rejected record.
 *
 * Rules: errors contain actionable diagnostics without secrets; a malformed source record is
 * rejected or quarantined rather than silently stored.
 */
export interface IngestionError {
  id: string;
  ingestionRunId: string;
  sourceId: string;
  stage: IngestionStage;
  externalReference?: string;
  message: string;
  severity: IngestionErrorSeverity;
  retryable: boolean;
  occurredAt: Date;
}

export function createIngestionError(
  partial: Omit<IngestionError, 'id' | 'occurredAt'>,
  idGenerator: () => string = () => crypto.randomUUID(),
): IngestionError {
  return { ...partial, id: idGenerator(), occurredAt: new Date() };
}

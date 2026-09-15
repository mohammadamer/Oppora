/**
 * Structured operational record shapes (FR-017). Every record has an event type discriminator,
 * a severity, a timestamp, and a message, so operational tooling can rely on a consistent shape
 * instead of parsing free-form log strings.
 */

export type OperationalSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

interface BaseRecord {
  severity: OperationalSeverity;
  timestamp: Date;
  message: string;
}

export interface ApiRequestRecord extends BaseRecord {
  type: 'API_REQUEST';
  route: string;
  statusCode: number;
  durationMs: number;
}

export interface IngestionRunRecord extends BaseRecord {
  type: 'INGESTION_RUN';
  sourceId: string;
  runId: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';
  discoveredCount: number;
  parsedCount: number;
  validCount: number;
}

export interface AdapterFailureRecord extends BaseRecord {
  type: 'ADAPTER_FAILURE';
  sourceId: string;
  stage: string;
  retryable: boolean;
}

export interface ParsingFailureRecord extends BaseRecord {
  type: 'PARSING_FAILURE';
  sourceId: string;
  externalReference?: string;
}

export interface ValidationFailureRecord extends BaseRecord {
  type: 'VALIDATION_FAILURE';
  sourceId: string;
  externalReference?: string;
  field: string;
}

export interface DuplicateDetectionRecord extends BaseRecord {
  type: 'DUPLICATE_DETECTION';
  opportunityId: string;
  matchedOpportunityId: string;
  classification: 'EXACT' | 'PROBABLE' | 'POSSIBLE' | 'NONE';
}

export interface SearchPerformanceRecord extends BaseRecord {
  type: 'SEARCH_PERFORMANCE';
  queryHash: string;
  resultCount: number;
  durationMs: number;
}

export interface NotificationFailureRecord extends BaseRecord {
  type: 'NOTIFICATION_FAILURE';
  userId: string;
  opportunityId: string;
  reason: string;
}

export type OperationalRecord =
  | ApiRequestRecord
  | IngestionRunRecord
  | AdapterFailureRecord
  | ParsingFailureRecord
  | ValidationFailureRecord
  | DuplicateDetectionRecord
  | SearchPerformanceRecord
  | NotificationFailureRecord;

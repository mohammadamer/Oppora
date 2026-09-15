import type { AdapterContract, AdapterStage } from './AdapterContract';

export type AdapterRunStatus = 'COMPLETED' | 'FAILED';

export interface AdapterRunError {
  sourceId: string;
  stage: AdapterStage;
  message: string;
}

export interface AdapterRunResult {
  sourceId: string;
  status: AdapterRunStatus;
  error?: AdapterRunError;
}

export interface AdapterRunReport {
  results: AdapterRunResult[];
}

/**
 * Runs each adapter's discover stage independently. A failure in one adapter is recorded with
 * source context (sourceId, stage, message) and does NOT prevent other approved adapters from
 * completing in the same run (FR-009, spec.md Edge Case, SC-004).
 */
export async function runAdapters(adapters: AdapterContract[]): Promise<AdapterRunReport> {
  const results = await Promise.all(
    adapters.map(async (adapter): Promise<AdapterRunResult> => {
      try {
        const discovered = await adapter.discover();
        if (!discovered.ok) {
          return {
            sourceId: adapter.sourceId,
            status: 'FAILED',
            error: { sourceId: adapter.sourceId, stage: discovered.stage, message: discovered.error },
          };
        }
        return { sourceId: adapter.sourceId, status: 'COMPLETED' };
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : String(caught);
        return {
          sourceId: adapter.sourceId,
          status: 'FAILED',
          error: { sourceId: adapter.sourceId, stage: 'DISCOVER', message },
        };
      }
    }),
  );

  return { results };
}

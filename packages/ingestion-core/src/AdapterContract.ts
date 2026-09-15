/**
 * Adapter stage contract implementing the five stages from
 * specs/001-opportunity-platform-foundation/contracts/source-adapter.md: discover, fetch, parse,
 * normalize, validate. Each stage returns a stage-tagged result so a failure at any stage can be
 * attributed and isolated without stopping other adapters.
 */

export type AdapterStage = 'DISCOVER' | 'FETCH' | 'PARSE' | 'NORMALIZE' | 'VALIDATE';

export type AdapterStageResult<T> =
  | { ok: true; stage: AdapterStage; value: T }
  | { ok: false; stage: AdapterStage; error: string };

export interface AdapterContract {
  readonly sourceId: string;
  discover(): Promise<AdapterStageResult<string[]>>;
  fetch(target: string): Promise<AdapterStageResult<string>>;
  parse(raw: string): Promise<AdapterStageResult<Record<string, unknown>>>;
  normalize(parsed: Record<string, unknown>): Promise<AdapterStageResult<Record<string, unknown>>>;
  validate(normalized: Record<string, unknown>): Promise<AdapterStageResult<boolean>>;
}

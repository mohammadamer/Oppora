import { describe, expect, it } from 'vitest';
import { runAdapters } from '../src/orchestrator';
import type { AdapterContract, AdapterStageResult } from '../src/AdapterContract';

function stageOk<T>(value: T): AdapterStageResult<T> {
  return { ok: true, stage: 'DISCOVER', value };
}

function makeAdapter(sourceId: string, shouldFail: boolean): AdapterContract {
  return {
    sourceId,
    discover: async () => (shouldFail ? { ok: false, stage: 'DISCOVER', error: 'boom' } : stageOk(['listing-1'])),
    fetch: async () => stageOk('<html></html>'),
    parse: async () => stageOk({ title: 'Sample' }),
    normalize: async () => stageOk({ title: 'Sample', categoryId: 'cat_1' }),
    validate: async () => stageOk(true),
  };
}

describe('Adapter run orchestration', () => {
  it('isolates a failing adapter and continues other approved adapters in the same run', async () => {
    const failing = makeAdapter('src_fail', true);
    const succeeding = makeAdapter('src_ok', false);

    const report = await runAdapters([failing, succeeding]);

    expect(report.results).toHaveLength(2);
    const failingResult = report.results.find((r) => r.sourceId === 'src_fail');
    const succeedingResult = report.results.find((r) => r.sourceId === 'src_ok');

    expect(failingResult?.status).toBe('FAILED');
    expect(failingResult?.error?.sourceId).toBe('src_fail');
    expect(succeedingResult?.status).toBe('COMPLETED');
  });

  it('records the failing adapter error with source context', async () => {
    const failing = makeAdapter('src_fail', true);
    const report = await runAdapters([failing]);
    const [result] = report.results;

    expect(result.error).toMatchObject({ sourceId: 'src_fail', stage: 'DISCOVER' });
  });
});

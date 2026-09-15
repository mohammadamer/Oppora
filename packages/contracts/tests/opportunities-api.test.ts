import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'js-yaml';

const contractPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'specs',
  '001-opportunity-platform-foundation',
  'contracts',
  'opportunities-api.yaml',
);

const contract = load(readFileSync(contractPath, 'utf-8')) as Record<string, unknown>;

// Internal persistence-only fields that must never appear in a public response schema (see
// data-model.md's "Modeling Rules": "Expose DTO-shaped public representations; persistence
// fields are not public API fields by default").
const FORBIDDEN_PERSISTENCE_FIELDS = [
  'externalId',
  'lastSeenAt',
  'sourceId',
  'documentMetadata',
];

describe('Public opportunities API contract', () => {
  it('is valid OpenAPI 3.0.3 with the expected root fields', () => {
    expect(contract.openapi).toBe('3.0.3');
    expect(contract.info).toBeDefined();
    expect(contract.paths).toBeDefined();
    expect(contract.components).toBeDefined();
  });

  it('exposes the anonymous list, detail, and source attribution endpoints', () => {
    const paths = contract.paths as Record<string, unknown>;
    expect(paths['/opportunities']).toBeDefined();
    expect(paths['/opportunities/{opportunityId}']).toBeDefined();
    expect(paths['/sources/{sourceId}']).toBeDefined();
  });

  it('never exposes internal persistence-only fields in public response DTOs', () => {
    const schemas = (contract.components as Record<string, unknown>).schemas as Record<
      string,
      unknown
    >;
    for (const [schemaName, schema] of Object.entries(schemas)) {
      const text = JSON.stringify(schema);
      for (const forbidden of FORBIDDEN_PERSISTENCE_FIELDS) {
        expect(
          text.includes(`"${forbidden}"`),
          `${schemaName} should not expose persistence-only field "${forbidden}"`,
        ).toBe(false);
      }
    }
  });

  it('requires sourceUrl and verified on the full Opportunity DTO for provenance', () => {
    const schemas = (contract.components as Record<string, unknown>).schemas as Record<
      string,
      { allOf?: { required?: string[] }[] }
    >;
    const opportunitySchema = schemas.Opportunity;
    const requiredFromAllOf = opportunitySchema.allOf?.flatMap((part) => part.required ?? []) ?? [];
    expect(requiredFromAllOf).toContain('sourceUrl');
    expect(requiredFromAllOf).toContain('verified');
  });
});

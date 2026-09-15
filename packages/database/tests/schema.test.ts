import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const schema = readFileSync(
  join(__dirname, '..', 'prisma', 'schema.prisma'),
  'utf-8',
);

/**
 * Static assertions over the Prisma schema text confirming the required indexes and
 * relationship uniqueness constraints from data-model.md's "Index Requirements" section are
 * present. A live-database round-trip test is an implementation-phase concern (see
 * quickstart.md); this test guards the schema definition itself.
 */
describe('Persistence schema relationships and indexes', () => {
  it('enforces a unique source/external identifier on Opportunity', () => {
    expect(schema).toMatch(/@@unique\(\[sourceId, externalId\]\)/);
  });

  it('indexes Opportunity status plus deadline for active/closing-soon queries', () => {
    expect(schema).toMatch(/@@index\(\[status, deadline\]\)/);
  });

  it('indexes Opportunity category, funding type, remote availability, and publish date', () => {
    expect(schema).toMatch(
      /@@index\(\[categoryId, fundingType, remoteAvailable, publishedAt\]\)/,
    );
  });

  it('enforces composite uniqueness on OpportunityCountry and OpportunityField', () => {
    expect(schema).toMatch(/model OpportunityCountry \{[\s\S]*?@@id\(\[opportunityId, countryCode\]\)/);
    expect(schema).toMatch(/model OpportunityField \{[\s\S]*?@@id\(\[opportunityId, fieldCode\]\)/);
  });

  it('indexes Source by verification and last-seen timestamps', () => {
    expect(schema).toMatch(/@@index\(\[id, lastSuccessfulRun, lastFailedRun\]\)/);
  });

  it('indexes SavedOpportunity by user and saved timestamp', () => {
    expect(schema).toMatch(/@@index\(\[userId, savedAt\]\)/);
  });

  it('indexes Application by user, status, and personal deadline', () => {
    expect(schema).toMatch(/@@index\(\[userId, status, personalDeadline\]\)/);
  });

  it('indexes IngestionRun by source, status, and start time', () => {
    expect(schema).toMatch(/@@index\(\[sourceId, status, startedAt\]\)/);
  });

  it('indexes IngestionError by source, stage, and occurrence time', () => {
    expect(schema).toMatch(/@@index\(\[sourceId, stage, occurredAt\]\)/);
  });
});

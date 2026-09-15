import { describe, expect, it } from 'vitest';
import {
  buildOpportunityWithUnknowns,
  validateOpportunityIdentity,
  validateDeadlineTimezone,
} from '../src/entities/Opportunity';
import { known, UNKNOWN } from '@oppora/shared';

describe('Opportunity domain rules', () => {
  it('requires title, sourceId, sourceUrl, and categoryId as minimum identity fields', () => {
    const errors = validateOpportunityIdentity({ title: 'Sample' });
    expect(errors).toContain('sourceId is required');
    expect(errors).toContain('sourceUrl is required');
    expect(errors).toContain('categoryId is required');
  });

  it('passes validation when all minimum identity fields are present', () => {
    const errors = validateOpportunityIdentity({
      title: 'Sample',
      sourceId: 'src_1',
      sourceUrl: 'https://example.org/1',
      categoryId: 'cat_1',
    });
    expect(errors).toHaveLength(0);
  });

  it('retains missing optional fields as explicit unknown rather than defaulted values', () => {
    const built = buildOpportunityWithUnknowns({
      title: 'Sample Scholarship',
      sourceId: 'src_1',
      sourceUrl: 'https://example.org/1',
      categoryId: 'cat_scholarship',
    });

    // Deadline was supplied via overrides is absent here -> must be UNKNOWN, not a default date.
    expect(built.deadline).toEqual(UNKNOWN);
    expect(built.fundingType).toEqual(UNKNOWN);
    expect(built.organization).toEqual(UNKNOWN);
    // Required identity fields remain populated (not unknown).
    expect(built.title).toBe('Sample Scholarship');
    expect(built.sourceUrl).toBe('https://example.org/1');
  });

  it('keeps a fully-funded opportunity distinguishable from one with unknown funding', () => {
    const unknownFunding = buildOpportunityWithUnknowns({
      title: 'A',
      sourceId: 's',
      sourceUrl: 'https://example.org/a',
      categoryId: 'c',
    });
    const knownFunding = buildOpportunityWithUnknowns(
      { title: 'B', sourceId: 's', sourceUrl: 'https://example.org/b', categoryId: 'c' },
      { fundingType: known('FULLY_FUNDED') },
    );

    expect(unknownFunding.fundingType.known).toBe(false);
    expect(knownFunding.fundingType).toEqual(known('FULLY_FUNDED'));
  });

  it('requires an explicit (known or unknown) timezone whenever the deadline is known', () => {
    const errors = validateDeadlineTimezone(known(new Date('2027-01-01')), UNKNOWN);
    expect(errors).toHaveLength(0); // UNKNOWN is an explicit state, so this is valid.
  });
});

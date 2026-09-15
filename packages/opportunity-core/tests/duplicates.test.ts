import { describe, expect, it } from 'vitest';
import { classifyDuplicate, type DuplicateCandidate } from '../src/duplicates';

const base: DuplicateCandidate = {
  id: 'a',
  sourceId: 'src_1',
  externalId: 'ext_1',
  canonicalUrl: 'https://example.org/canonical/1',
  title: 'Global Fellowship',
  organization: 'Acme Foundation',
};

describe('Duplicate classification', () => {
  it('classifies EXACT when sourceId+externalId match', () => {
    const other: DuplicateCandidate = { ...base, id: 'b', canonicalUrl: undefined };
    const result = classifyDuplicate(base, other);
    expect(result.classification).toBe('EXACT');
    expect(result.candidateId).toBe('a');
    expect(result.matchedId).toBe('b');
  });

  it('classifies EXACT when canonical URLs match, even with different source ids', () => {
    const other: DuplicateCandidate = {
      ...base,
      id: 'b',
      sourceId: 'src_2',
      externalId: 'different',
    };
    expect(classifyDuplicate(base, other).classification).toBe('EXACT');
  });

  it('classifies PROBABLE when title and organization match but no shared identifier/URL exists', () => {
    const other: DuplicateCandidate = {
      id: 'b',
      sourceId: 'src_2',
      externalId: 'other_ext',
      canonicalUrl: 'https://another.org/1',
      title: 'Global Fellowship',
      organization: 'Acme Foundation',
    };
    const result = classifyDuplicate(base, other);
    expect(result.classification).toBe('PROBABLE');
  });

  it('classifies POSSIBLE when only title or only organization matches', () => {
    const other: DuplicateCandidate = {
      id: 'b',
      sourceId: 'src_2',
      externalId: 'other_ext',
      canonicalUrl: 'https://another.org/1',
      title: 'Global Fellowship',
      organization: 'Different Org',
    };
    expect(classifyDuplicate(base, other).classification).toBe('POSSIBLE');
  });

  it('classifies NONE and preserves source relationship rather than merging when uncertain', () => {
    const other: DuplicateCandidate = {
      id: 'b',
      sourceId: 'src_2',
      externalId: 'other_ext',
      canonicalUrl: 'https://another.org/1',
      title: 'Unrelated Grant',
      organization: 'Other Org',
    };
    const result = classifyDuplicate(base, other);
    expect(result.classification).toBe('NONE');
    // Both source relationships remain identifiable in the result regardless of classification.
    expect(result.candidateId).toBe('a');
    expect(result.matchedId).toBe('b');
  });
});

import { describe, expect, it } from 'vitest';
import {
  CATEGORY_TAXONOMY,
  STUDY_LEVEL_TAXONOMY,
  FUNDING_TYPE_TAXONOMY,
  FIELD_OF_STUDY_TAXONOMY,
  LANGUAGE_TAXONOMY,
  ELIGIBILITY_TYPE_TAXONOMY,
  normalizeLabel,
} from '../src/taxonomies';

describe('Normalization taxonomies', () => {
  it('deterministically maps category labels', () => {
    expect(normalizeLabel(CATEGORY_TAXONOMY, 'Scholarship')).toBe('SCHOLARSHIP');
  });

  it('deterministically maps study level labels', () => {
    expect(normalizeLabel(STUDY_LEVEL_TAXONOMY, 'Masters')).toBe('MASTERS');
  });

  it('deterministically maps funding type labels', () => {
    expect(normalizeLabel(FUNDING_TYPE_TAXONOMY, 'Fully Funded')).toBe('FULLY_FUNDED');
  });

  it('deterministically maps field of study labels', () => {
    expect(normalizeLabel(FIELD_OF_STUDY_TAXONOMY, 'Computer Science')).toBe('COMPUTER_SCIENCE');
  });

  it('deterministically maps language labels', () => {
    expect(normalizeLabel(LANGUAGE_TAXONOMY, 'English')).toBe('en');
  });

  it('deterministically maps eligibility type labels', () => {
    expect(normalizeLabel(ELIGIBILITY_TYPE_TAXONOMY, 'Women Only')).toBe('WOMEN_ONLY');
  });

  it('preserves unmapped source labels by returning undefined rather than a guessed value', () => {
    expect(normalizeLabel(CATEGORY_TAXONOMY, 'Totally Unknown Category')).toBeUndefined();
  });
});

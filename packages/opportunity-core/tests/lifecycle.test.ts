import { describe, expect, it } from 'vitest';
import {
  ACTIVE_DISCOVERY_STATUSES,
  canTransition,
  isIncludedInDefaultDiscovery,
  isRetainedRecord,
  transition,
} from '../src/lifecycle';

describe('Opportunity lifecycle', () => {
  it('allows DISCOVERED -> ACTIVE -> EXPIRING -> EXPIRED -> ARCHIVED', () => {
    expect(transition('DISCOVERED', 'ACTIVE')).toBe('ACTIVE');
    expect(transition('ACTIVE', 'EXPIRING')).toBe('EXPIRING');
    expect(transition('EXPIRING', 'EXPIRED')).toBe('EXPIRED');
    expect(transition('EXPIRED', 'ARCHIVED')).toBe('ARCHIVED');
  });

  it('allows DISCOVERED -> INVALID and ACTIVE -> INVALID', () => {
    expect(canTransition('DISCOVERED', 'INVALID')).toBe(true);
    expect(canTransition('ACTIVE', 'INVALID')).toBe(true);
  });

  it('rejects transitions not in the documented lifecycle', () => {
    expect(canTransition('ARCHIVED', 'ACTIVE')).toBe(false);
    expect(canTransition('INVALID', 'ACTIVE')).toBe(false);
    expect(canTransition('DISCOVERED', 'EXPIRED')).toBe(false);
    expect(() => transition('ARCHIVED', 'ACTIVE')).toThrow();
  });

  it('retains ARCHIVED and INVALID records but excludes them from default active discovery', () => {
    expect(isRetainedRecord('ARCHIVED')).toBe(true);
    expect(isRetainedRecord('INVALID')).toBe(true);
    expect(isIncludedInDefaultDiscovery('ARCHIVED')).toBe(false);
    expect(isIncludedInDefaultDiscovery('INVALID')).toBe(false);
  });

  it('includes ACTIVE and EXPIRING in default discovery results', () => {
    expect(ACTIVE_DISCOVERY_STATUSES).toEqual(['ACTIVE', 'EXPIRING']);
    expect(isIncludedInDefaultDiscovery('ACTIVE')).toBe(true);
    expect(isIncludedInDefaultDiscovery('EXPIRING')).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { registerSource, isApprovedTarget, assertApprovedTarget } from '../src/registry';

describe('Approved source registry', () => {
  it('rejects an unregistered URL before any network access is attempted', () => {
    expect(isApprovedTarget([], 'https://unapproved.example.com/listing')).toBe(false);
    expect(() => assertApprovedTarget([], 'https://unapproved.example.com/listing')).toThrow(
      /not an approved ingestion target/i,
    );
  });

  it('accepts a URL that matches a registered, crawl-enabled source baseUrl', () => {
    const sources = [
      registerSource({
        id: 'src_1',
        name: 'Example',
        website: 'https://example.org',
        baseUrl: 'https://example.org',
        sourceType: 'PUBLIC_PAGE',
        trustLevel: 'VERIFIED',
        crawlEnabled: true,
      }),
    ];
    expect(isApprovedTarget(sources, 'https://example.org/opportunities/1')).toBe(true);
    expect(() =>
      assertApprovedTarget(sources, 'https://example.org/opportunities/1'),
    ).not.toThrow();
  });

  it('rejects a URL for a registered source that has crawling disabled', () => {
    const sources = [
      registerSource({
        id: 'src_2',
        name: 'Disabled Example',
        website: 'https://disabled.example.org',
        baseUrl: 'https://disabled.example.org',
        sourceType: 'PUBLIC_PAGE',
        trustLevel: 'VERIFIED',
        crawlEnabled: false,
      }),
    ];
    expect(isApprovedTarget(sources, 'https://disabled.example.org/listing')).toBe(false);
  });

  it('rejects an arbitrary user-supplied URL even when its domain resembles an approved one', () => {
    const sources = [
      registerSource({
        id: 'src_3',
        name: 'Example',
        website: 'https://example.org',
        baseUrl: 'https://example.org',
        sourceType: 'PUBLIC_PAGE',
        trustLevel: 'VERIFIED',
        crawlEnabled: true,
      }),
    ];
    expect(isApprovedTarget(sources, 'https://example.org.attacker.com/listing')).toBe(false);
  });
});

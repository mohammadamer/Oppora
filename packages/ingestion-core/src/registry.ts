/**
 * Approved source registry (FR-010). Ingestion targets are accepted only from a registered
 * `Source` record; unregistered or disabled-crawl URLs are rejected before any network access is
 * attempted.
 */
import type { Source } from '@oppora/opportunity-core';

export function registerSource(source: Source): Source {
  return source;
}

/**
 * Returns true only when `url` starts with a registered, crawl-enabled source's `baseUrl`.
 * Uses a strict prefix + boundary check so a lookalike domain (e.g.
 * "example.org.attacker.com") is never mistaken for the approved "example.org" source.
 */
export function isApprovedTarget(sources: Source[], url: string): boolean {
  return sources.some((source) => {
    if (!source.crawlEnabled) return false;
    if (!url.startsWith(source.baseUrl)) return false;
    const remainder = url.slice(source.baseUrl.length);
    return remainder === '' || remainder.startsWith('/') || remainder.startsWith('?');
  });
}

export class UnapprovedIngestionTargetError extends Error {
  constructor(public readonly url: string) {
    super(`URL is not an approved ingestion target: ${url}`);
    this.name = 'UnapprovedIngestionTargetError';
  }
}

/** Throws before any network access is attempted when the target is not approved. */
export function assertApprovedTarget(sources: Source[], url: string): void {
  if (!isApprovedTarget(sources, url)) {
    throw new UnapprovedIngestionTargetError(url);
  }
}

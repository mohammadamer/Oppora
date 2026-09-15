/**
 * Shared test fixture builders reused across package test suites.
 *
 * Each builder accepts partial overrides and fills the rest with
 * deterministic, valid sample data so tests only need to specify the
 * fields relevant to the behavior under test.
 */

export function fixtureOpportunity(overrides: Record<string, unknown> = {}) {
  return {
    id: 'opp_1',
    sourceId: 'src_1',
    sourceUrl: 'https://example.org/opportunities/1',
    title: 'Sample Scholarship',
    categoryId: 'cat_scholarship',
    deadline: new Date('2027-01-01T00:00:00Z'),
    deadlineTimezone: 'UTC',
    status: 'ACTIVE',
    verified: false,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function fixtureSource(overrides: Record<string, unknown> = {}) {
  return {
    id: 'src_1',
    name: 'Sample Source',
    website: 'https://example.org',
    baseUrl: 'https://example.org',
    sourceType: 'PUBLIC_PAGE',
    trustLevel: 'VERIFIED',
    crawlEnabled: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

export function fixtureUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user_1',
    externalAuthSubject: 'auth0|sample',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

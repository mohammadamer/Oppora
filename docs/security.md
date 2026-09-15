# Security Boundaries

This document defines the Phase 1 security boundaries required by FR-016. It describes
responsibilities, not implementation code; enforcement is added incrementally as apps/packages
are implemented.

## Input Validation

- All API request parameters (query, filters, sort, cursor, pagination limit) are validated
  against the OpenAPI contract (`contracts/opportunities-api.yaml`) before reaching domain logic.
- Invalid input returns the contract's `InvalidRequest` (400) response; it never falls through to
  a partially-applied filter.

## URL Validation

- Every URL accepted from a source (source URL, official application URL) is validated for
  well-formedness before storage.
- Ingestion targets are validated against the approved source registry
  (`packages/ingestion-core/src/registry.ts`) using an exact `baseUrl` prefix-and-boundary match,
  so a lookalike domain cannot be mistaken for an approved source (FR-010).
- The API and mobile client never accept an arbitrary user-supplied URL as an ingestion or crawl
  target.

## Authentication and Authorization Responsibilities

- Anonymous users may browse public opportunity discovery endpoints without authentication.
- Authenticated user identity is required for user-owned resources: preferences, saved
  opportunities, applications, and notification preferences.
- Authorization checks ensure a user can only read/write their own `UserPreference`,
  `SavedOpportunity`, `Application`, and `NotificationPreference` records.
- Authentication identity resolution is isolated to the API's request pipeline (see
  [architecture.md](architecture.md#authentication)); domain and persistence code depend only on
  a resolved user id.

## Rate Limiting

- The public API applies rate limiting per client to protect against abuse of anonymous
  discovery endpoints.
- Source adapters respect each source's documented crawl frequency
  (`Source.crawlFrequency`) and terms/robots policy; they do not bypass rate limits.

## Secret Handling

- No secret (API key, credential, token) is stored on a domain entity or included in an
  `IngestionError` message (see `packages/opportunity-core/src/entities/IngestionError.ts`:
  "errors contain actionable diagnostics without secrets").
- Configuration secrets are loaded only through `packages/config`, never hard-coded or committed.

## Safe Parsing

- Source adapter `parse`/`normalize` stages (`contracts/source-adapter.md`) treat all source
  content as untrusted input; parsing failures are classified and reported rather than causing
  unhandled exceptions that could crash a shared process.

## Output Sanitization

- Public API responses expose only the DTO shapes defined in `contracts/opportunities-api.yaml`
  (see `packages/contracts/src/opportunities-api.ts`); internal persistence fields (e.g.
  `externalId`, `lastSeenAt`, `sourceId`, `documentMetadata`) are never serialized to a public
  response.

## Dependency Review

- New runtime dependencies are reviewed before being added to any `packages/*/package.json` or
  app; Phase 1 intentionally introduces no AI, semantic search, or analytics dependency (FR-020).
- `scripts/validate-phase1.sh` and CI (`.github/workflows/ci.yml`) run dependency and lint checks
  before merge.

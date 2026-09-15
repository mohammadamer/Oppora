# Development Guide

This guide documents contributor-facing conventions for the Oppora monorepo foundation. It
complements [architecture.md](architecture.md), which documents subsystem boundaries.

## Workspace Layout

The repository is an npm workspace monorepo:

- `apps/` — deployable applications (`mobile`, `api`, `ingestion`)
- `packages/` — shared, independently buildable/testable libraries
- `docs/` — contributor and operational documentation
- `infra/` — deployment/infrastructure definitions
- `scripts/` — operational and validation tooling (see `scripts/README.md`)

Each package has its own `package.json`, `tsconfig.json` (extending the root
`tsconfig.base.json`), and `tests/` directory.

## Error Handling Conventions

- Expected/recoverable failures (validation errors, missing config, rejected ingestion targets)
  are returned as typed `Result<T, E>` values (see `packages/shared/src/index.ts`) rather than
  thrown, so callers must explicitly handle the failure case.
- Unexpected/programmer errors (invariant violations) may throw.
- Every thrown or returned error includes enough context to diagnose the failure without
  reproducing it (source id, stage, entity id) but never includes secrets.

## Structured Operational Records

Per FR-017, the following events are recorded as structured records (see
`packages/shared/src/operational-records.ts`) rather than free-form log strings:

| Event | Required fields |
|---|---|
| API request | route, status code, duration, timestamp |
| Ingestion run | sourceId, runId, status, counts, timestamps |
| Adapter failure | sourceId, stage, message, retryable, timestamp |
| Parsing failure | sourceId, externalReference, message, timestamp |
| Validation failure | sourceId, externalReference, field, message, timestamp |
| Duplicate detection | opportunityId, matchedOpportunityId, classification, timestamp |
| Search performance | query hash, resultCount, durationMs, timestamp |
| Notification failure | userId, opportunityId, reason, timestamp |

Every structured record includes: an event type discriminator, a severity, a timestamp, and a
message. See `packages/shared/src/operational-records.ts` for the shared TypeScript shapes.

## Testing Conventions

- Tests run with Vitest (`npm test` at the repository root, or `npm test --workspace <pkg>`).
- Shared fixtures live in `packages/testing/src/fixtures.ts` and should be reused instead of
  duplicating sample entity data across packages.
- Domain rule, lifecycle, duplicate-classification, and normalization tests belong in
  `packages/opportunity-core/tests/`.

## Adding a Package

1. Create `packages/<name>/package.json`, `tsconfig.json` (extending
   `../../tsconfig.base.json`), and a `src/index.ts` entry point.
2. Add the package to the root `tsconfig.json` `references` array if other packages depend on
   its build output.
3. Document the package's responsibility in its `README.md`.

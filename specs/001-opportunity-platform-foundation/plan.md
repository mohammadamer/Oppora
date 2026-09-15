# Implementation Plan: Oppora Platform Foundation

**Branch**: `dev` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-opportunity-platform-foundation/spec.md`

## Summary

Establish the documented, modular foundation for Oppora's opportunity discovery platform. The design separates mobile presentation, public service contracts, user identity, normalized opportunity data, search, and ethical source ingestion behind replaceable boundaries. Phase 1 produces architecture documentation, a normalized relational data model, public contracts, contributor guidance, and runnable validation checks; it does not implement the mobile product, source adapters, AI matching, or production services.

## Technical Context

**Language/Version**: TypeScript for shared contracts and service boundaries; Python for future ingestion adapters; exact runtime versions are deferred to implementation setup

**Primary Dependencies**: React Native/Expo mobile client, NestJS service boundary, Prisma relational access, PostgreSQL search and persistence, and Scrapy-compatible ingestion adapters as specified by the product requirements

**Storage**: PostgreSQL for normalized opportunity, user, provenance, lifecycle, saved-item, application, and ingestion records; object storage is out of scope because document contents are not stored in this phase

**Testing**: TypeScript unit and contract tests, service integration tests, fixture-based ingestion tests, and schema/architecture validation checks; exact test runners are selected during implementation setup

**Target Platform**: Cross-platform mobile clients with independently deployable API and ingestion workloads; Phase 1 documentation and validation run on the development host

**Project Type**: Modular monorepo containing a mobile application, API service, ingestion workload, shared packages, and documentation

**Performance Goals**: Keep the public opportunity search and listing experience compatible with paginated responses and user-perceived fast initial loading; exact latency and throughput budgets require representative data and are deferred until measurement is possible

**Constraints**: Anonymous browsing; authentication for user-owned state; approved-source-only ingestion; source attribution and provenance; no bypass of access controls; no business logic in mobile screens; no scraping in the API; no opaque AI score in the foundation

**Scale/Scope**: Foundation for millions of opportunity records and a growing contributor community, with an MVP limited to architecture, schema, contracts, and validation artifacts; advanced search, recommendations, analytics, administration, and notifications remain later phases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The repository constitution is an unfilled template and does not define enforceable project-specific gates. No constitution violation is therefore present. The following requirements-derived gates are applied for this plan:

- **Modularity**: PASS. Mobile, API, ingestion, search, persistence, and replaceable providers have separate boundaries.
- **Data quality and provenance**: PASS. The model requires source identity, original URLs, verification state, explicit unknowns, lifecycle states, and ingestion outcomes.
- **Security and ethical access**: PASS. Ingestion is restricted to an approved source registry and documents prohibited access bypasses.
- **Testability**: PASS. Domain rules, contracts, schema relationships, adapter fixtures, and failure isolation each have validation scope.
- **MVP discipline**: PASS. AI recommendations, semantic search, analytics, administration, and advanced personalization are explicitly deferred.

## Project Structure

### Documentation (this feature)

```text
specs/001-opportunity-platform-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── opportunities-api.yaml
│   ├── source-adapter.md
│   └── search-provider.md
└── tasks.md                         # Created by /speckit-tasks
```

### Source Code (repository root)

```text
apps/
├── mobile/                          # React Native/Expo client
├── api/                             # Public service boundary and application modules
└── ingestion/                       # Independent source processing workload
packages/
├── contracts/                       # Versioned public request/response schemas
├── opportunity-core/                # Domain rules, taxonomies, lifecycle, matching seams
├── database/                        # Relational schema and persistence adapters
├── search/                          # SearchProvider abstraction and implementations
├── ingestion-core/                  # Adapter orchestration and run reporting
├── source-adapters/                 # Explicit approved-source implementations
├── notifications/                   # NotificationProvider boundary
├── config/                          # Validated runtime configuration
├── shared/                          # Small cross-cutting primitives
├── ui/                              # Reusable mobile presentation primitives
└── testing/                         # Shared fixtures and test utilities
docs/
├── architecture.md
├── database.md
├── ingestion.md
├── source-adapters.md
├── search.md
├── api.md
├── mobile.md
├── notifications.md
└── development.md
infra/
scripts/
.github/workflows/
```

**Structure Decision**: Use the requirements' modular monorepo shape. Deployable applications live under `apps/`; reusable domain, contract, persistence, ingestion, search, notification, and UI concerns live under `packages/`; contributor and operational guidance lives under `docs/`. Python ingestion code remains in its own application/package boundary rather than being forced into TypeScript packages.

## Phase 0: Research

Research decisions are recorded in [research.md](research.md). The research resolves the technology and boundary choices needed to design the data model and contracts without introducing implementation bodies.

## Phase 1: Design & Contracts

- Define entities, relationships, validation rules, unknown-value semantics, lifecycle transitions, provenance rules, and indexes in [data-model.md](data-model.md).
- Define the public opportunity API in [contracts/opportunities-api.yaml](contracts/opportunities-api.yaml).
- Define the source adapter extension contract in [contracts/source-adapter.md](contracts/source-adapter.md).
- Define the provider-independent search contract in [contracts/search-provider.md](contracts/search-provider.md).
- Define runnable validation scenarios and expected outcomes in [quickstart.md](quickstart.md).

## Post-Design Constitution Check

- **Modularity**: PASS. Contracts depend on domain concepts, not persistence or vendor-specific models.
- **Data quality and provenance**: PASS. Required provenance and explicit unknown semantics are represented in the data model and public response contract.
- **Security and ethical access**: PASS. Approved-source enforcement and public URL/provenance rules are documented as boundaries.
- **Testability**: PASS. Quickstart scenarios map to domain, contract, schema, and failure-isolation checks.
- **MVP discipline**: PASS. The generated artifacts describe extension points but contain no deferred product implementation.

No complexity exception is required.

## Post-Implementation Constitution Re-check (T060)

Re-verified against the completed Phase 1 implementation artifacts on 2026-09-15:

- **Modularity**: PASS. `apps/mobile`, `apps/api`, `apps/ingestion` remain empty stubs; all
  Phase 1 logic lives in independently buildable `packages/*` with explicit boundaries
  (`PersistenceProvider`, `SearchProvider`, `NotificationProvider`, `AdapterContract`).
- **Data quality and provenance**: PASS. `packages/opportunity-core` entities use `UnknownOr<T>`
  for every optional source field (verified by
  `packages/opportunity-core/tests/opportunity.test.ts`); the Prisma schema retains `sourceId`
  and `sourceUrl` on every `Opportunity`.
- **Security and ethical access**: PASS. `packages/ingestion-core/src/registry.ts` rejects
  unapproved/lookalike URLs before any network access (verified by
  `packages/ingestion-core/tests/registry.test.ts`); `docs/security.md` documents the remaining
  boundaries.
- **Testability**: PASS. 41 tests across 8 files (`npx vitest run`) cover domain rules,
  lifecycle, duplicate classification, taxonomies, persistence indexes, approved-source
  enforcement, failure isolation, and the public contract; all pass (see
  `specs/001-opportunity-platform-foundation/quickstart-results.md`).
- **MVP discipline**: PASS. `docs/scope-exclusions.md` confirms no AI recommendation, semantic
  search, analytics, admin dashboard, or personalization code was introduced; `packages/*`
  dependency review (T059) found no such dependency added.

No complexity exception is required.

## Complexity Tracking

No constitution violations or unjustified complexity exceptions were identified.
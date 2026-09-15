---

description: "Task list for Oppora Platform Foundation implementation"
---

# Tasks: Oppora Platform Foundation

**Input**: Design documents from `/specs/001-opportunity-platform-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: FR-018 requires validation checks for domain rules, persistence relationships, normalization behavior, duplicate detection, approved-source enforcement, and failure isolation, so test tasks are included per user story.

**Organization**: Tasks are grouped by user story (from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths follow the monorepo layout defined in plan.md (`apps/`, `packages/`, `docs/`, `infra/`, `scripts/`, `.github/workflows/`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the modular monorepo skeleton described in plan.md's Project Structure.

- [X] T001 Create the monorepo directory skeleton with placeholder `README.md` files in `apps/mobile/`, `apps/api/`, `apps/ingestion/`, `packages/contracts/`, `packages/opportunity-core/`, `packages/database/`, `packages/search/`, `packages/ingestion-core/`, `packages/source-adapters/`, `packages/notifications/`, `packages/config/`, `packages/shared/`, `packages/ui/`, `packages/testing/`, `docs/`, `infra/`, `scripts/`, `.github/workflows/`
- [X] T002 Initialize root TypeScript workspace configuration (`package.json` workspaces, root `tsconfig.json` with project references) at repository root
- [X] T003 [P] Configure linting and formatting (ESLint + Prettier) in `.eslintrc.cjs` and `.prettierrc` at repository root
- [X] T004 [P] Add root `.gitignore` entries and `scripts/README.md` documenting the operational tooling folder purpose
- [X] T005 [P] Create `.github/workflows/ci.yml` skeleton that installs dependencies and runs lint (implementation task bodies added in Polish phase)

**Checkpoint**: Repository skeleton exists and matches plan.md's Project Structure.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared packages and conventions that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Create `packages/config/src/index.ts` exposing validated runtime configuration loading (env parsing with explicit required/optional fields and typed errors on missing required values)
- [X] T007 [P] Create `packages/shared/src/index.ts` with cross-cutting primitives: a `Result`/`Either`-style outcome type, an `UnknownOr<T>` type to represent explicit unknown values (per data-model.md's "Treat source-provided absence as `unknown` or `null`, never as a positive assertion"), and a shared `Timestamped` interface (`createdAt`, `updatedAt`)
- [X] T008 [P] Create `packages/testing/src/fixtures.ts` with shared test fixture builders (factory functions) for domain entities, to be reused by all user story test suites
- [X] T009 Document error handling and logging conventions in `docs/development.md`, including the structured operational record shape referenced by FR-017 (fields: event type, source/entity reference, severity, timestamp, message)
- [X] T010 [P] Create `packages/contracts/package.json` and `packages/contracts/src/index.ts` placeholder that will re-export generated types from the OpenAPI contract (populated in US3)

**Checkpoint**: Foundational packages exist - user story implementation can now begin.

---

## Phase 3: User Story 1 - Understand the Platform Architecture (Priority: P1) 🎯 MVP

**Goal**: Provide documentation that lets a contributor identify subsystem responsibilities, boundaries, and replaceable infrastructure, and trace an opportunity from an approved source to a user-facing result.

**Independent Test**: A contributor unfamiliar with the project can use `docs/architecture.md` to identify the responsibilities and communication boundaries of the mobile app, API, opportunity data store, search, authentication, and ingestion pipeline, and can trace an opportunity from an approved source to a user-facing result.

### Implementation for User Story 1

- [X] T011 [P] [US1] Write `docs/architecture.md` documenting each subsystem (mobile, API, authentication, opportunity data, search, ingestion) with a named responsibility, allowed direction of communication, and documented boundary (FR-001), including a diagram tracing an opportunity from an approved source through ingestion, persistence, search, and API to a mobile-facing result
- [X] T012 [P] [US1] Write `docs/database.md` summarizing the persistence boundary's responsibility and its replacement point, cross-referencing `packages/database`
- [X] T013 [P] [US1] Write `docs/search.md` summarizing the search boundary's responsibility, replacement point, and reference to `contracts/search-provider.md`
- [X] T014 [P] [US1] Write `docs/ingestion.md` summarizing the ingestion pipeline's responsibility, replacement point, and reference to `contracts/source-adapter.md`
- [X] T015 [P] [US1] Write `docs/api.md` summarizing the public API boundary's responsibility and reference to `contracts/opportunities-api.yaml`
- [X] T016 [P] [US1] Write `docs/mobile.md` documenting that the mobile client contains no business logic or scraping behavior and consumes only the public API contract
- [X] T017 [P] [US1] Write `docs/notifications.md` documenting the notification boundary's responsibility and replacement point, cross-referencing `packages/notifications`
- [X] T018 [US1] Define replaceable provider interfaces (no implementation bodies) in `packages/database/src/PersistenceProvider.ts`, `packages/search/src/SearchProvider.ts`, and `packages/notifications/src/NotificationProvider.ts`, each documented with the behavior that must remain stable across a replacement (FR-008)
- [X] T019 [US1] Add a documentation consistency check script `scripts/check-architecture-docs.sh` that verifies every subsystem doc file from T011-T017 exists and contains a "Responsibility" and "Boundary" heading
- [X] T020 [US1] Update root `README.md` to link to `docs/architecture.md` as the primary contributor entry point

**Checkpoint**: At this point, User Story 1 should be fully independently verifiable - a new contributor can read the docs and trace the architecture.

---

## Phase 4: User Story 2 - Establish a Trustworthy Opportunity Data Foundation (Priority: P1)

**Goal**: Define a normalized opportunity domain model with provenance and lifecycle information so incomplete or stale source data is never presented as authoritative.

**Independent Test**: A representative opportunity record can be created from a source with missing optional fields, retained with explicit provenance and unknown values, validated against the domain rules, and transitioned through its lifecycle without losing historical source information.

### Tests for User Story 2 ⚠️

- [X] T021 [P] [US2] Domain rule test in `packages/opportunity-core/tests/opportunity.test.ts` asserting that an opportunity with only title, source, source URL, category, and deadline retains all other fields as explicit `unknown`/`null` rather than defaulted values, and that "title, source, source URL, and category are required minimum identity fields" (data-model.md) causes validation failure when any is missing
- [X] T022 [P] [US2] Lifecycle transition test in `packages/opportunity-core/tests/lifecycle.test.ts` covering the documented transitions `DISCOVERED -> ACTIVE -> EXPIRING -> EXPIRED -> ARCHIVED`, `DISCOVERED -> INVALID`, `ACTIVE -> INVALID`, and asserting `ARCHIVED`/`INVALID` records are retained (not deleted) but excluded from default active discovery
- [X] T023 [P] [US2] Duplicate classification test in `packages/opportunity-core/tests/duplicates.test.ts` covering exact (shared source identifier or canonical URL), probable, and possible duplicate outcomes, asserting source relationships are preserved rather than silently merged when uncertain (FR-012)
- [X] T024 [P] [US2] Normalization taxonomy test in `packages/opportunity-core/tests/taxonomies.test.ts` asserting deterministic mapping for category, study level, funding type, destination, field of study, language, and eligibility type, and that unmapped source labels are preserved rather than dropped (FR-011)
- [X] T025 [P] [US2] Persistence schema relationship test in `packages/database/tests/schema.test.ts` asserting required indexes and relationship uniqueness constraints exist (see T035)

### Implementation for User Story 2

- [X] T026 [P] [US2] Define the `User` entity in `packages/opportunity-core/src/entities/User.ts` with fields `id`, `externalAuthSubject`, `email`, `createdAt`, `updatedAt`, `lastActiveAt`, enforcing "authentication identity is unique" and "email may be absent"
- [X] T027 [P] [US2] Define the `UserPreference` entity in `packages/opportunity-core/src/entities/UserPreference.ts` with fields `userId`, `country`, `educationLevel`, `fieldsOfStudy`, `preferredCountries`, `fundingPreferences`, `languages`, `categories`, `remotePreference`, `updatedAt`, enforcing "all preference fields are optional" and that "preferences never override opportunity eligibility evidence"
- [X] T028 [P] [US2] Define the `Source` entity in `packages/opportunity-core/src/entities/Source.ts` with fields `id`, `name`, `website`, `baseUrl`, `sourceType`, `country`, `trustLevel`, `crawlEnabled`, `crawlFrequency`, `termsUrl`, `robotsUrl`, `lastSuccessfulRun`, `lastFailedRun`, `createdAt`, `updatedAt`, enforcing "automated access requires an explicit approved record"
- [X] T029 [P] [US2] Define the `Category` entity in `packages/opportunity-core/src/entities/Category.ts` with fields `id`, `code`, `name`, `description`, `active`, `createdAt`, `updatedAt`, enforcing "`code` is stable and unique"
- [X] T030 [US2] Define the `Opportunity` entity in `packages/opportunity-core/src/entities/Opportunity.ts` with fields `id`, `externalId`, `sourceId`, `sourceUrl`, `officialApplicationUrl`, `title`, `slug`, `description`, `shortDescription`, `organization`, `provider`, `categoryId`, `remoteAvailable`, `fundingType`, `fundingAmount`, `currency`, `benefits`, `eligibility`, `requirements`, `applicationProcess`, `startDate`, `endDate`, `deadline`, `deadlineTimezone`, `status`, `verified`, `verificationDate`, `publishedAt`, `lastSeenAt`, `createdAt`, `updatedAt`, enforcing "title, source, source URL, and category are required minimum identity fields", "`officialApplicationUrl` is validated and clearly labeled", and "deadline values require a timezone or an explicit unknown timezone state" (depends on T028, T029)
- [X] T031 [P] [US2] Define the `OpportunityCountry` join entity in `packages/opportunity-core/src/entities/OpportunityCountry.ts` with fields `opportunityId`, `countryCode`, `relationshipType`, enforcing "duplicate pairs are prohibited" (depends on T030)
- [X] T032 [P] [US2] Define the `OpportunityField` join entity in `packages/opportunity-core/src/entities/OpportunityField.ts` with fields `opportunityId`, `fieldCode`, `sourceLabel`, enforcing "duplicate pairs are prohibited" (depends on T030)
- [X] T033 [US2] Implement the opportunity lifecycle state machine in `packages/opportunity-core/src/lifecycle.ts` implementing transitions `DISCOVERED -> ACTIVE -> EXPIRING -> EXPIRED -> ARCHIVED`, `DISCOVERED -> INVALID`, `ACTIVE -> INVALID`, satisfying T022 (depends on T030)
- [X] T034 [US2] Implement duplicate classification logic in `packages/opportunity-core/src/duplicates.ts` returning exact/probable/possible outcomes and preserving source relationships on uncertain matches, satisfying T023 (depends on T030, T031)
- [X] T035 [US2] Implement normalization taxonomy maps in `packages/opportunity-core/src/taxonomies/index.ts` covering category, study level, funding type, destination, field of study, language, and eligibility type, satisfying T024
- [X] T036 [US2] Define the `SavedOpportunity` entity in `packages/opportunity-core/src/entities/SavedOpportunity.ts` with fields `userId`, `opportunityId`, `folder`, `notes`, `savedAt`, `updatedAt`, enforcing "one active saved relationship per user/opportunity pair" (depends on T026, T030)
- [X] T037 [US2] Define the `Application` entity in `packages/opportunity-core/src/entities/Application.ts` with fields `id`, `userId`, `opportunityId`, `status`, `notes`, `applicationDate`, `personalDeadline`, `documentMetadata`, `createdAt`, `updatedAt`, using the status enum values `WISHLIST`, `PLANNING`, `APPLIED`, `INTERVIEW`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`, enforcing "document metadata contains no document contents" (depends on T026, T030)
- [X] T038 [US2] Define the `NotificationPreference` entity in `packages/opportunity-core/src/entities/NotificationPreference.ts` with fields `userId`, `enabled`, `leadTimes`, `updatedAt`, enforcing "supported lead times are 30, 14, 7, 3, and 1 day" and "reminders require a valid known deadline" (depends on T026)
- [X] T039 [US2] Define the `IngestionRun` entity in `packages/opportunity-core/src/entities/IngestionRun.ts` with fields `id`, `sourceId`, `startedAt`, `completedAt`, `status`, `discoveredCount`, `parsedCount`, `validCount`, `duplicateCount`, `rejectedCount`, `updatedCount`, `newCount`, enforcing "one failed run does not invalidate other source runs" (depends on T028)
- [X] T040 [US2] Define the `IngestionError` entity in `packages/opportunity-core/src/entities/IngestionError.ts` with fields `id`, `ingestionRunId`, `sourceId`, `stage`, `externalReference`, `message`, `severity`, `retryable`, `occurredAt`, enforcing "errors contain actionable diagnostics without secrets" (depends on T039)
- [X] T041 [US2] Create the relational persistence schema in `packages/database/prisma/schema.prisma` covering all entities from T026-T040 and the relationships documented in data-model.md's Relationships diagram
- [X] T042 [US2] Add the required indexes to `packages/database/prisma/schema.prisma`: unique source/external identifier where present, unique canonical source URL where reliable, opportunity status+deadline composite, category/fundingType/remoteAvailable/publishedAt for filtering, composite uniqueness on `OpportunityCountry`(opportunityId, countryCode) and `OpportunityField`(opportunityId, fieldCode), source id + verification + lastSeenAt, `SavedOpportunity`(userId, savedAt), `Application`(userId, status, personalDeadline), `IngestionRun`(sourceId, status, startedAt), `IngestionError`(sourceId, stage, occurredAt), satisfying T025

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - the domain model and schema are complete, tested, and documented.

---

## Phase 5: User Story 3 - Prepare a Safe, Testable Phase 1 Base (Priority: P2)

**Goal**: Document and validate the initial project structure, data boundaries, and quality checks so future contributors can add functionality incrementally and safely.

**Independent Test**: A clean checkout can validate the Phase 1 structure, domain contracts, database schema design, required indexes, security boundaries, and documentation without requiring external source access or a completed mobile application.

### Tests for User Story 3 ⚠️

- [X] T043 [P] [US3] Approved-source enforcement test in `packages/ingestion-core/tests/registry.test.ts` asserting that an unapproved external URL is rejected before any network access is attempted (FR-010, spec.md Edge Case)
- [X] T044 [P] [US3] Failure isolation test in `packages/ingestion-core/tests/orchestration.test.ts` asserting that one adapter failure is recorded with source context and does not prevent other approved adapters from completing (spec.md Edge Case, SC-004)
- [X] T045 [P] [US3] Contract test in `packages/contracts/tests/opportunities-api.test.ts` validating `contracts/opportunities-api.yaml` against the OpenAPI 3.0.3 schema and asserting the response DTOs (`OpportunitySummary`, `Opportunity`, `SourceAttribution`) never expose internal persistence-only fields (spec.md Edge Case: "an internal persistence field ... the external contract exposes only the approved public representation")

### Implementation for User Story 3

- [X] T046 [US3] Implement the approved source registry in `packages/ingestion-core/src/registry.ts` that accepts ingestion targets only from a registered `Source` record (T028) and rejects unregistered URLs before network access (FR-010), satisfying T043
- [X] T047 [US3] Define the adapter stage interface in `packages/ingestion-core/src/AdapterContract.ts` implementing the five stages from `contracts/source-adapter.md`: `discover`, `fetch`, `parse`, `normalize`, `validate`, with each stage returning a stage-tagged result usable for failure isolation
- [X] T048 [US3] Implement adapter run orchestration in `packages/ingestion-core/src/orchestrator.ts` that isolates a failing adapter's error (writing an `IngestionError` per T040) while continuing other approved adapters in the same run, satisfying T044
- [X] T049 [P] [US3] Generate/hand-author public contract types in `packages/contracts/src/opportunities-api.ts` mirroring `contracts/opportunities-api.yaml` schemas (`OpportunityPage`, `OpportunitySummary`, `Opportunity`, `SourceAttribution`), satisfying T045
- [X] T050 [P] [US3] Define the `SearchProvider` request/response contract types in `packages/search/src/contract.ts` matching `contracts/search-provider.md` (query, filters, sort mode, cursor/page size; ordered results, relevance ordering, applied filter summary, cursor/hasMore, explicit empty/invalid/unavailable outcomes)
- [X] T051 [P] [US3] Write `docs/security.md` documenting Phase 1 security boundaries: input validation, URL validation, authentication/authorization responsibilities, rate limiting, secret handling, safe parsing, output sanitization, and dependency review (FR-016)
- [X] T052 [P] [US3] Write `docs/source-adapters.md` documenting how a contributor adds a source adapter: source metadata, discovery, parsing, fixtures, normalization tests, registration, and validation steps (FR-019), cross-referencing `contracts/source-adapter.md`
- [X] T053 [P] [US3] Define structured operational record types in `packages/shared/src/operational-records.ts` for API requests, ingestion runs, adapter failures, parsing failures, validation failures, duplicate detection outcomes, search performance, and notification failures (FR-017)
- [X] T054 [US3] Write `docs/scope-exclusions.md` (or append to `docs/architecture.md`) explicitly confirming Phase 1 excludes AI recommendations, semantic search, complex analytics, an administrative dashboard, and advanced personalization (FR-020, SC-006)
- [X] T055 [US3] Add `scripts/validate-phase1.sh` implementing the quickstart.md validation steps: artifact existence checks, constitution-check review pointer, data model coverage review pointer, and public contract validation invocation (depends on T041, T049)

**Checkpoint**: All user stories should now be independently functional and validated end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [X] T056 [P] Fill in `.github/workflows/ci.yml` to run lint, `packages/*` test suites, and `scripts/validate-phase1.sh` on pull requests
- [X] T057 [P] Add root `docs/README.md` index linking all docs produced in US1-US3
- [X] T058 Run `quickstart.md` validation end-to-end and record results in the PR description or `specs/001-opportunity-platform-foundation/quickstart-results.md`
- [X] T059 [P] Dependency review pass: confirm `packages/*` `package.json` dependency lists match only what research.md and plan.md specify (Prisma, no premature search/AI dependencies)
- [X] T060 Re-run the Post-Design Constitution Check gates from plan.md against the completed artifacts and record confirmation in `specs/001-opportunity-platform-foundation/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (Phase 3) has no dependency on US2/US3 content, though T018's provider interfaces are referenced by US2/US3 packages
  - US2 (Phase 4) is independent of US1's docs and US3's ingestion/contract work
  - US3 (Phase 5) depends on entities defined in US2 (T028, T030, T039, T040) for the registry, orchestrator, and error recording tasks
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependency on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - no dependency on US1; T018 (US1) defines provider interfaces later implemented against by `packages/database`
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) for docs/contract tasks (T049-T054), but T046-T048 require US2's `Source`, `IngestionRun`, and `IngestionError` entities (T028, T039, T040)

### Within Each User Story

- Tests before implementation (T021-T025 before T026-T042; T043-T045 before T046-T055)
- Entities before logic that depends on them (e.g., T030 before T033/T034)
- Story complete before moving to the next priority when working sequentially

### Parallel Opportunities

- All Setup tasks marked [P] (T003-T005) can run in parallel after T001-T002
- All Foundational tasks marked [P] (T007, T008, T010) can run in parallel after T006
- Once Foundational completes, US1 and US2 can proceed fully in parallel; US3's doc/contract tasks (T049-T054) can start in parallel with US2, while T046-T048 wait on US2 entities
- All US1 doc tasks (T011-T017) can run in parallel
- All US2 test tasks (T021-T025) can run in parallel; entity tasks T026-T029 and T031-T032 can run in parallel
- All US3 test tasks (T043-T045) can run in parallel; T049-T053 can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Domain rule test in packages/opportunity-core/tests/opportunity.test.ts"
Task: "Lifecycle transition test in packages/opportunity-core/tests/lifecycle.test.ts"
Task: "Duplicate classification test in packages/opportunity-core/tests/duplicates.test.ts"
Task: "Normalization taxonomy test in packages/opportunity-core/tests/taxonomies.test.ts"

# Launch independent entity definitions together:
Task: "Define User entity in packages/opportunity-core/src/entities/User.ts"
Task: "Define UserPreference entity in packages/opportunity-core/src/entities/UserPreference.ts"
Task: "Define Source entity in packages/opportunity-core/src/entities/Source.ts"
Task: "Define Category entity in packages/opportunity-core/src/entities/Category.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm a new contributor can trace the architecture using only `docs/architecture.md` and linked docs (SC-001)
5. Demo the documentation set

### Incremental Delivery

1. Complete Setup + Foundational → foundation ready
2. Add User Story 1 → validate independently → demo (MVP!)
3. Add User Story 2 → validate independently (domain + schema tests pass) → demo
4. Add User Story 3 → validate independently (registry, orchestration, contract tests pass) → demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple contributors:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Contributor A: User Story 1 (architecture docs)
   - Contributor B: User Story 2 (domain model + schema)
   - Contributor C: User Story 3 docs/contract tasks (T049-T054), joining T046-T048 once US2 entities land
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This Phase 1 foundation intentionally produces documentation, domain code, schema, and contracts - not the mobile app, source adapter implementations, or production deployment (per plan.md Summary and FR-020)
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence

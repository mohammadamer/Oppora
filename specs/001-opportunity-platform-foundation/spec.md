# Feature Specification: Oppora Platform Foundation

**Feature Branch**: `001-opportunity-platform-foundation`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "follow the requirements in the requirements.md file"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand the Platform Architecture (Priority: P1)

As an Oppora contributor, I need a clear description of the system boundaries, data flow, and replaceable infrastructure so that I can make changes without coupling the mobile experience, API, search, database, authentication, or ingestion pipeline unnecessarily.

**Why this priority**: A shared architecture is the prerequisite for every later product phase and protects the project from becoming a monolith.

**Independent Test**: A contributor unfamiliar with the project can use the architecture documentation to identify the responsibilities and communication boundaries of the mobile app, API, opportunity data store, search, authentication, and ingestion pipeline, and can trace an opportunity from an approved source to a user-facing result.

**Acceptance Scenarios**:

1. **Given** the architecture documentation, **When** a contributor reviews the system diagram, **Then** each major subsystem has a named responsibility, an allowed direction of communication, and a documented boundary.
2. **Given** a proposed replacement for search or notifications, **When** a contributor reviews the documented contracts, **Then** the replacement point and the behavior that must remain stable are identifiable without redesigning unrelated domains.

### User Story 2 - Establish a Trustworthy Opportunity Data Foundation (Priority: P1)

As a product contributor, I need a normalized opportunity model with provenance and lifecycle information so that Oppora can present useful opportunities without making incomplete or stale source data appear authoritative.

**Why this priority**: Data quality, attribution, and lifecycle handling are central to Oppora's promise and must be established before search or mobile screens depend on the data.

**Independent Test**: A representative opportunity record can be created from a source with missing optional fields, retained with explicit provenance and unknown values, validated against the domain rules, and transitioned through its lifecycle without losing historical source information.

**Acceptance Scenarios**:

1. **Given** an opportunity with a title, source, source URL, category, and deadline but missing funding details, **When** it is stored in the domain model, **Then** the missing values remain explicitly unknown and the record remains distinguishable from a fully funded opportunity.
2. **Given** an opportunity no longer present at its source, **When** lifecycle rules process it, **Then** it becomes stale or archived according to the documented rule and is not silently deleted.
3. **Given** two records that share a source identifier or canonical URL, **When** duplicate detection evaluates them, **Then** the result identifies an exact duplicate and preserves the source relationship rather than silently merging uncertain records.

### User Story 3 - Prepare a Safe, Testable Phase 1 Base (Priority: P2)

As an open-source maintainer, I need the initial project structure, data boundaries, and quality checks documented and validated so that future contributors can add functionality incrementally and safely.

**Why this priority**: The foundation enables independent work on authentication, search, ingestion, and mobile functionality while keeping the first phase small enough to verify.

**Independent Test**: A clean checkout can validate the Phase 1 structure, domain contracts, database schema design, required indexes, security boundaries, and documentation without requiring external source access or a completed mobile application.

**Acceptance Scenarios**:

1. **Given** a clean checkout, **When** the Phase 1 validation checks run, **Then** architecture artifacts, domain entities, persistence definitions, and required documentation are present and internally consistent.
2. **Given** an unapproved external URL supplied to ingestion, **When** the ingestion boundary evaluates it, **Then** the source is rejected before network access is attempted.

### Edge Cases

- A source supplies only a title and URL; the record remains valid only if required provenance and minimum identity fields are present, while all other absent fields are represented as unknown.
- A source supplies conflicting deadlines or malformed dates; the record is flagged for review and is not silently normalized into a misleading deadline.
- An opportunity is missing a deadline; it remains discoverable when otherwise valid but cannot be treated as deadline-driven or receive a deadline reminder.
- An adapter fails during a run; the failure is recorded with source context and does not prevent other approved adapters from completing.
- A source prohibits automated access or its terms cannot be confirmed; it is excluded from automated ingestion.
- A user-facing response requests an internal persistence field; the external contract exposes only the approved public representation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST document the responsibilities, boundaries, communication paths, and data flow for the mobile client, API, authentication, opportunity data, search, and ingestion subsystems.
- **FR-002**: The project MUST document a modular directory structure that separates deployable applications, shared contracts, domain logic, infrastructure adapters, documentation, and operational tooling.
- **FR-003**: The project MUST define the Opportunity domain with support for categories, organizations, locations, study levels, fields of study, funding, eligibility, benefits, languages, application details, dates, lifecycle state, and source-specific metadata.
- **FR-004**: The project MUST define a Source domain that records source identity, public website information, access policy, trust information, crawl status, and timestamps.
- **FR-005**: Every opportunity MUST retain its original source URL, source identity, verification state, and the information needed to distinguish Oppora from the original provider.
- **FR-006**: The data model MUST support nullable or unknown values and multiple values where a source does not provide complete or singular information.
- **FR-007**: The project MUST define lifecycle states for discovered, active, expiring, expired, archived, and invalid opportunities, including rules that prevent premature deletion of historical records.
- **FR-008**: The project MUST define stable boundaries for opportunity persistence, search, authentication, notifications, and source adapters so each can be replaced without moving business rules into user-interface screens.
- **FR-009**: The project MUST define an ingestion contract covering discovery, retrieval, parsing, normalization, validation, deduplication, enrichment, storage, indexing, and run reporting.
- **FR-010**: Automated ingestion MUST accept targets only from an approved source registry and MUST document refusal of authentication bypass, CAPTCHA bypass, rate-limit bypass, robots restrictions, paywalls, and access controls.
- **FR-011**: The project MUST define normalization taxonomies for opportunity category, study level, funding type, destination, field of study, language, and eligibility type without scattering normalization rules across consumers.
- **FR-012**: The project MUST define exact, probable, and possible duplicate outcomes and MUST preserve source relationships when a merge is uncertain.
- **FR-013**: The project MUST define public contracts for paginated opportunity retrieval, filtering, sorting, search, source attribution, and consistent user-facing errors without exposing internal persistence models directly.
- **FR-014**: The initial persistence design MUST cover users, user preferences, sources, opportunities, categories, opportunity-to-country relationships, opportunity-to-field relationships, saved opportunities, applications, notification preferences, ingestion runs, and ingestion errors.
- **FR-015**: The persistence design MUST specify identifiers, timestamps, relationships, and indexes for deadline queries, filtering, search, source lookups, duplicate detection, saved opportunities, and user-specific retrieval.
- **FR-016**: Phase 1 MUST include documented security boundaries for input validation, URL validation, authentication and authorization responsibilities, rate limiting, secret handling, safe parsing, output sanitization, and dependency review.
- **FR-017**: Phase 1 MUST include structured operational records for API requests, ingestion runs, adapter failures, parsing failures, validation failures, duplicate detection, search performance, and notification failures.
- **FR-018**: Phase 1 MUST include tests or validation checks for domain rules, persistence relationships, normalization behavior, duplicate detection, approved-source enforcement, and failure isolation.
- **FR-019**: The project MUST document how a contributor can add a source adapter, including source metadata, discovery, parsing, fixtures, normalization tests, registration, and validation.
- **FR-020**: The Phase 1 scope MUST exclude AI recommendations, semantic search, complex analytics, an administrative dashboard, and advanced personalization until the foundation is validated.

### Key Entities

- **Opportunity**: A normalized educational or social-impact opportunity with identity, description, eligibility, benefits, dates, lifecycle state, and provenance.
- **Source**: An approved external provider or public data source and its access, trust, and operational metadata.
- **Category**: An extensible classification such as scholarship, fellowship, internship, exchange, volunteering, grant, competition, conference, or research opportunity.
- **User**: A person who may browse anonymously or create a profile for preferences, saved opportunities, applications, and notifications.
- **User Preference**: Optional profile information used to filter or later match opportunities, including country, education level, fields, destinations, funding, language, category, and remote preference.
- **Saved Opportunity**: A user relationship to an opportunity, including saved state, folder, notes, and timestamps.
- **Application**: A user's tracking record for an opportunity, including status, notes, application date, personal deadline, and document metadata without document contents.
- **Ingestion Run**: A record of one source-processing attempt and its discovered, parsed, valid, duplicate, rejected, updated, and new counts.
- **Ingestion Error**: A source-scoped operational record for a failed fetch, parse, validation, normalization, or persistence step.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new contributor can trace the documented path from an approved source to a user-facing opportunity in under 15 minutes without assistance.
- **SC-002**: 100% of persisted opportunity records retain a source identity and original source URL, and records with missing optional source fields preserve those fields as unknown rather than inventing values.
- **SC-003**: The Phase 1 validation suite detects every intentionally introduced violation of required provenance, approved-source enforcement, lifecycle rules, or duplicate classification in the corresponding test area.
- **SC-004**: A failed source adapter does not prevent all other approved source adapters in the same run from completing and reporting their own outcomes.
- **SC-005**: A contributor can add a documented source adapter using the published extension steps without changing unrelated search, user, or persistence business rules.
- **SC-006**: Architecture review confirms that the Phase 1 foundation contains no AI recommendation engine, semantic search dependency, complex analytics, or administrative dashboard implementation.
- **SC-007**: At least 90% of reviewers completing a structured architecture walkthrough can correctly identify where source access, normalization, persistence, search, and user-facing presentation belong.

## Assumptions

- The first implementation targets mobile opportunity discovery and a versioned service boundary; a web client is not required for Phase 1.
- Anonymous users can browse publicly available opportunities; authentication is required for saved opportunities, applications, personalization, notifications, and synchronization.
- External sources are added explicitly and are limited to legally accessible APIs, feeds, datasets, or public pages whose access rules permit automated use.
- A relational persistence model is appropriate for the normalized opportunity data, with search and queue infrastructure introduced only when the measured product need justifies it.
- The initial architecture documentation and schema are design deliverables for Phase 1; later phases will implement authentication, search, ingestion adapters, mobile screens, bookmarks, applications, and reminders incrementally.
- Deadline reminders require a known deadline and a user-controlled notification preference; no reminder is sent for an unknown or invalid deadline.
- The project constitution currently contains template placeholders, so the product principles in the requirements document are treated as the governing constraints for this specification.
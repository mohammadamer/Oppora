# Research: Oppora Platform Foundation

## Decision: Use a modular monorepo with independent mobile, API, and ingestion applications

**Rationale**: The product requirements explicitly prohibit a monolith and require the mobile client never to scrape external websites. Separate application boundaries let ingestion fail or scale independently while the API remains focused on normalized data and user-facing contracts.

**Alternatives considered**: A single service with embedded crawling was rejected because it couples source instability and network access to user requests. Separate repositories were rejected for Phase 1 because shared domain contracts and contributor discovery are easier to maintain together.

## Decision: Keep business rules in domain packages and expose replaceable infrastructure interfaces

**Rationale**: Lifecycle, provenance, normalization, duplicate classification, and eligibility-related rules need deterministic tests and must not live in React Native screens or concrete database/search clients. Provider boundaries preserve the option to replace infrastructure later.

**Alternatives considered**: Direct database access from screens or controllers was rejected because it leaks persistence shape into user-facing behavior. A shared utility-only package was rejected because it would not provide ownership boundaries for domain behavior.

## Decision: Use a relational normalized data model with explicit relationship tables

**Rationale**: Opportunities have many-to-many relationships with countries and fields, optional source fields, lifecycle queries, user-owned saved/application state, and provenance. Explicit relationships support filtering, indexes, referential integrity, and future growth without pretending all sources are complete.

**Alternatives considered**: A document-only model was rejected because filtering, deduplication, and user relationships would be harder to constrain consistently. A vector-first model was rejected because semantic search is explicitly deferred until measurable benefit exists.

## Decision: Begin search with a provider-independent contract and relational keyword/fuzzy capabilities

**Rationale**: The MVP needs keyword search and filters, but the product requirements require future search replacement without rewriting consumers. A contract allows the first implementation to remain simple while preserving a migration path to a dedicated search service if measurements justify it.

**Alternatives considered**: Making a dedicated search engine mandatory was rejected as premature infrastructure. Embedding semantic matching into the first search contract was rejected because AI and vector search are future enhancements, not foundation requirements.

## Decision: Require explicit approved-source registration and ethical access policy before ingestion

**Rationale**: Trust and legal/ethical access are product requirements. A registry provides an auditable allowlist and source-specific terms, robots, frequency, and status metadata. It also prevents arbitrary user URLs from becoming crawler targets.

**Alternatives considered**: Generic web crawling was rejected because it cannot reliably enforce source-specific access policy or provenance. Accepting user-provided URLs was rejected because it creates SSRF and authorization risks.

## Decision: Represent incomplete source data as unknown, not inferred truth

**Rationale**: Sources will omit fields and use inconsistent taxonomies. Nullable fields, multi-valued relationships, and source metadata preserve fidelity; normalization only maps values when a deterministic rule exists. This avoids showing an unknown funding state as fully funded or inventing eligibility.

**Alternatives considered**: Filling missing values with defaults was rejected because it creates misleading user-facing claims. Rejecting every incomplete record was rejected because useful opportunities may lack optional fields.

## Decision: Use contract-first, fixture-based validation for the foundation

**Rationale**: Public API behavior, adapter extension behavior, schema relationships, and failure isolation need stable checks before implementation grows. Fixtures let source changes fail visibly rather than silently corrupt normalized records.

**Alternatives considered**: Relying only on end-to-end mobile tests was rejected because it would not isolate domain and ingestion failures. Manual architecture review alone was rejected because it cannot reliably detect contract drift.
# Architecture

This document is the primary entry point for understanding Oppora's system boundaries, data
flow, and replaceable infrastructure. It satisfies the Phase 1 requirement that a contributor can
identify subsystem responsibilities and trace an opportunity from an approved source to a
user-facing result without redesigning unrelated domains.

## Subsystems

### Mobile Client (`apps/mobile`)

**Responsibility**: Present opportunities, search, saved items, applications, and notification
preferences to end users.

**Boundary**: Communicates only with the public API (`apps/api`) over its versioned HTTP
contract (`packages/contracts`). Contains no business logic, no direct database access, and no
scraping behavior (see [mobile.md](mobile.md)).

**Allowed direction of communication**: Mobile → API (request/response only). The API never
calls back into the mobile client.

### API (`apps/api`)

**Responsibility**: Expose the public, versioned opportunity discovery contract
(`contracts/opportunities-api.yaml`): anonymous browsing, filtering, sorting, search, and source
attribution, plus authenticated user-owned resources (preferences, saved opportunities,
applications, notification preferences).

**Boundary**: Depends on `packages/opportunity-core` for domain rules, `packages/database` for
persistence, and `packages/search` for search, all through their provider interfaces. Never
performs source scraping itself (see [api.md](api.md)).

**Allowed direction of communication**: API → opportunity-core, API → database (via
PersistenceProvider), API → search (via SearchProvider), API → notifications (via
NotificationProvider). API does not call the ingestion workload directly; they communicate only
through persisted data.

### Authentication

**Responsibility**: Establish user identity for API requests that require user-owned state
(preferences, saved opportunities, applications, notifications). Anonymous browsing requires no
authentication.

**Boundary**: Authentication concerns are isolated to the API's request pipeline and the `User`
entity's `externalAuthSubject` field (`packages/opportunity-core`); domain and persistence code
depend only on a resolved user identity, never on a specific auth provider.

### Opportunity Data (`packages/opportunity-core`, `packages/database`)

**Responsibility**: Own the normalized opportunity domain model, lifecycle rules, duplicate
classification, and normalization taxonomies (`packages/opportunity-core`), and the relational
schema and persistence access (`packages/database`). See [database.md](database.md).

**Boundary**: `packages/opportunity-core` has no framework or persistence dependency; all
persistence access goes through the `PersistenceProvider` interface
(`packages/database/src/PersistenceProvider.ts`) so the storage engine can be replaced.

### Search (`packages/search`)

**Responsibility**: Accept normalized search intent and return public opportunity
references/summaries with stable relevance ordering. See [search.md](search.md) and
[contracts/search-provider.md](../specs/001-opportunity-platform-foundation/contracts/search-provider.md).

**Boundary**: Exposed only through `SearchProvider` (`packages/search/src/SearchProvider.ts`).
The initial implementation may use relational keyword/fuzzy matching; a future dedicated search
engine can replace it without changing consumer code or public DTOs.

### Ingestion (`apps/ingestion`, `packages/ingestion-core`, `packages/source-adapters`)

**Responsibility**: Discover, fetch, parse, normalize, validate, deduplicate, and store
opportunities from approved sources only, and report run/error outcomes. See
[ingestion.md](ingestion.md) and
[contracts/source-adapter.md](../specs/001-opportunity-platform-foundation/contracts/source-adapter.md).

**Boundary**: Runs as an independently deployable workload. Accepts ingestion targets only from
the approved source registry (`packages/ingestion-core/src/registry.ts`); never accepts
arbitrary user-supplied URLs. A failing adapter is isolated and does not stop other adapters in
the same run.

### Notifications (`packages/notifications`)

**Responsibility**: Deliver deadline reminders based on user-controlled lead-time preferences.
See [notifications.md](notifications.md).

**Boundary**: Exposed only through `NotificationProvider`
(`packages/notifications/src/NotificationProvider.ts`); no reminder is sent for an unknown or
invalid deadline or when disabled.

## Data Flow: Approved Source to User-Facing Result

```text
Approved Source (registry entry)
   │
   ▼
apps/ingestion  ──uses──▶  packages/ingestion-core (registry, adapter orchestration)
   │                              │
   │                              ▼
   │                       packages/source-adapters (discover → fetch → parse → normalize → validate)
   │
   ▼
packages/opportunity-core (domain validation, lifecycle, duplicate classification)
   │
   ▼
packages/database (PersistenceProvider) ── normalized Opportunity, Source, taxonomy records
   │
   ▼
apps/api ── packages/search (SearchProvider) + packages/contracts (public DTOs)
   │
   ▼
apps/mobile ── renders opportunity summaries/details with source attribution
```

Each arrow is a replacement boundary: the adapter set, the persistence engine, and the search
implementation can each change independently as long as the contracts on either side of the
arrow remain stable.

## Replaceable Infrastructure

| Boundary | Interface | Current Implementation | Replacement Point |
|---|---|---|---|
| Persistence | `PersistenceProvider` (`packages/database/src/PersistenceProvider.ts`) | Relational schema (Prisma) | Any storage engine implementing the same interface |
| Search | `SearchProvider` (`packages/search/src/SearchProvider.ts`) | Relational keyword/fuzzy search | Dedicated search service |
| Notifications | `NotificationProvider` (`packages/notifications/src/NotificationProvider.ts`) | Not yet implemented in Phase 1 | Any push/email/SMS provider |
| Source ingestion | `AdapterContract` (`packages/ingestion-core/src/AdapterContract.ts`) | Not yet implemented in Phase 1 | Per-source adapters registered individually |

## Explicitly Out of Scope for Phase 1

Per FR-020, this foundation contains no AI recommendation engine, semantic search, complex
analytics, administrative dashboard, or advanced personalization. See
[scope-exclusions.md](scope-exclusions.md) for the full confirmation.

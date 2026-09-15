# Oppora

Oppora is a global opportunity discovery platform that aggregates, normalizes, indexes, and
intelligently presents verified scholarships, fellowships, internships, volunteering
opportunities, exchange programs, grants, and other educational or social-impact opportunities
from trusted external sources.

This repository currently implements **Phase 1 — Platform Foundation**: the architecture,
domain model, persistence schema, ingestion contracts, and public API contract that every later
feature builds on. See
[`specs/001-opportunity-platform-foundation/spec.md`](specs/001-opportunity-platform-foundation/spec.md)
for the full feature specification and
[`specs/001-opportunity-platform-foundation/plan.md`](specs/001-opportunity-platform-foundation/plan.md)
for the implementation plan and constitution re-check.

## What it does

Oppora aggregates opportunities (scholarships, fellowships, internships, volunteering, exchange
programs, grants, etc.) from vetted external sources, normalizes them into a consistent domain
model, deduplicates and validates them, and exposes them for browsing, search, and deadline
notifications through a public API and a mobile app.

## How the main parts interact

Data flows one-way from source to user, through replaceable interfaces at each boundary:

1. **Ingestion** (`apps/ingestion`, `packages/ingestion-core`, `packages/source-adapters`) pulls
   raw listings only from an approved source registry, via per-source adapters (discover → fetch
   → parse → normalize → validate). A failing adapter doesn't stop the rest of a run.
2. **Domain core** (`packages/opportunity-core`) applies lifecycle rules, duplicate
   classification, and taxonomy normalization to the ingested data — framework- and
   persistence-free.
3. **Persistence** (`packages/database`) stores the normalized `Opportunity`/`Source`/taxonomy
   records behind a `PersistenceProvider` interface (Prisma/PostgreSQL today, swappable later).
4. **API** (`apps/api`) is the only consumer-facing entry point for reading/writing data. It
   reads/writes via `PersistenceProvider`, delegates search via `SearchProvider`
   (`packages/search`), and triggers reminders via `NotificationProvider`
   (`packages/notifications`). It never scrapes sources itself and never calls ingestion
   directly — the two communicate only through persisted data.
5. **Mobile app** (`apps/mobile`) talks only to the API over its versioned HTTP contract
   (`packages/contracts`), rendering opportunities, search results, saved items, applications,
   and notification preferences. It contains no business logic or direct database access.

Each interface (`PersistenceProvider`, `SearchProvider`, `NotificationProvider`, adapter
contract) is a replacement boundary — its implementation can change without affecting the
components on either side. See [`docs/architecture.md`](docs/architecture.md) for the full data
flow diagram and subsystem boundaries.

## Tech stack

| Layer | Technology |
|---|---|
| Language | TypeScript (strict mode), Node.js |
| Mobile app | React Native + Expo (`apps/mobile`) |
| API service | NestJS (`apps/api`) |
| Persistence | PostgreSQL + Prisma (`packages/database`) — schema defined, no live DB provisioned yet |
| Domain model | Framework-free TypeScript (`packages/opportunity-core`) |
| Search | Pluggable `SearchProvider` contract (`packages/search`) — no concrete engine wired yet |
| Ingestion | Adapter-per-source pattern with an orchestrator that isolates failures (`packages/ingestion-core`) |
| Testing | Vitest (unit/contract tests), 41 tests passing |
| Lint/format | ESLint + Prettier |
| Monorepo tooling | npm workspaces, TypeScript project references (`tsc -b`) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) — lint, build, test, `scripts/validate-phase1.sh` |

## Repository structure

```
apps/
  api/                 NestJS public API service (implements opportunities-api.yaml contract)
  ingestion/           Ingestion pipeline runner (placeholder — not yet implemented)
  mobile/              React Native / Expo client app
packages/
  shared/              Cross-cutting types (Result, UnknownOr<T>, Timestamped, ...)
  config/              Environment/config loading
  contracts/           Public API DTOs generated from the OpenAPI contract
  opportunity-core/    Domain entities, lifecycle state machine, duplicate classifier, taxonomies
  database/            Prisma schema + PersistenceProvider interface
  search/              SearchProvider interface + contract types
  ingestion-core/      Approved-source registry, adapter contract, orchestrator
  notifications/       NotificationProvider interface
  source-adapters/     Per-source ingestion adapters (placeholder — not yet implemented)
  ui/                  Shared UI components (placeholder — not yet implemented)
  testing/             Shared test fixtures
docs/                  Subsystem architecture docs (see docs/README.md for the index)
scripts/               validate-phase1.sh (master validation), check-architecture-docs.sh
specs/001-opportunity-platform-foundation/
                       spec.md, plan.md, research.md, data-model.md, contracts/, tasks.md
```

## Getting started

Requirements: Node.js 20+, npm.

```sh
git clone <this-repo>
cd Oppora
npm install
npm run build   # tsc -b across all packages/apps
npm run lint    # eslint .
npm test        # vitest run (41 tests)
```

### Running the API

`apps/api` implements `GET /api/v1/opportunities`, `GET /api/v1/opportunities/:id`, and
`GET /api/v1/sources/:id` per
[`specs/001-opportunity-platform-foundation/contracts/opportunities-api.yaml`](specs/001-opportunity-platform-foundation/contracts/opportunities-api.yaml).
It currently serves **in-memory fixture data** (`apps/api/src/fixtures.ts`) since no Postgres
instance is provisioned in this environment yet.

```sh
cd apps/api
npm run build
npm run start   # http://localhost:3000 (override with PORT env var)
```

### Running the mobile app

`apps/mobile` is an Expo/React Native client that fetches opportunity listings from the API
above and renders them with basic Oppora branding.

```sh
# Terminal 1
cd apps/api && npm run start

# Terminal 2
cd apps/mobile
npm install
npm run web       # runs in the browser, no simulator/emulator required
npm run android    # requires an Android emulator or device
npm run ios        # requires macOS + Xcode
```

By default the app calls `http://localhost:3000`; override with `EXPO_PUBLIC_API_URL` when
testing against a device/emulator that can't reach `localhost` on the host machine.

### Validating the whole foundation

```sh
scripts/validate-phase1.sh
```

Runs build, lint, tests, and architecture-doc consistency checks together — the same checks CI
runs on every PR.

## Contributing

Start with [`docs/architecture.md`](docs/architecture.md) to understand the system's
subsystems, boundaries, and data flow before making changes. See
[`docs/development.md`](docs/development.md) for workspace conventions,
[`docs/source-adapters.md`](docs/source-adapters.md) for adding a new opportunity source, and
[`docs/README.md`](docs/README.md) for the full documentation index (database, search,
ingestion, API, mobile, notifications, security, scope exclusions).

## Project status

Phase 1 (architecture, domain model, persistence schema, ingestion contracts, public API
contract, mobile scaffold wired to a fixture-backed API) is complete — see
[`specs/001-opportunity-platform-foundation/tasks.md`](specs/001-opportunity-platform-foundation/tasks.md)
for the full task breakdown and
[`specs/001-opportunity-platform-foundation/quickstart-results.md`](specs/001-opportunity-platform-foundation/quickstart-results.md)
for validation results. `apps/ingestion`, `packages/source-adapters`, `packages/ui`, and a live
database/search backend are intentionally out of scope for this phase (see
[`docs/scope-exclusions.md`](docs/scope-exclusions.md)).

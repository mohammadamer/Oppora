# api

Public service boundary (NestJS) implementing the versioned opportunities API contract
(`specs/001-opportunity-platform-foundation/contracts/opportunities-api.yaml`). Depends on
`packages/contracts`, `packages/opportunity-core`, `packages/shared`.

## Current status

Implements `GET /api/v1/opportunities`, `GET /api/v1/opportunities/:id`, and
`GET /api/v1/sources/:id` against an **in-memory fixture dataset** (`src/fixtures.ts`) — no
live database is provisioned in this environment yet. Swapping the fixture-backed handlers for
`packages/database`'s `PersistenceProvider` is a follow-up task once a Postgres instance is
available.

## Running

```sh
cd apps/api
npm run build
npm run start   # listens on http://localhost:3000 (override with PORT env var)
```

Or for iterative development: `npm run dev` (ts-node-dev, auto-restarts on changes).

# Ingestion

**Responsibility**: Discover, fetch, parse, normalize, validate, deduplicate, and store
opportunities from approved sources only, and report ingestion run and error outcomes.

**Boundary**: Runs as an independently deployable workload (`apps/ingestion`). Accepts ingestion
targets only from the approved source registry (`packages/ingestion-core/src/registry.ts`) and
never accepts arbitrary user-supplied URLs. A failing source adapter is isolated and does not
prevent other approved adapters in the same run from completing.

**Replacement point**: Individual source adapters (`packages/source-adapters`) can be added,
replaced, or removed independently as long as they implement the stage contract in
`packages/ingestion-core/src/AdapterContract.ts`.

See the full adapter contract in
[contracts/source-adapter.md](../specs/001-opportunity-platform-foundation/contracts/source-adapter.md)
and the contributor guide in [source-adapters.md](source-adapters.md).

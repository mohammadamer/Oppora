# Phase 1 Validation Quickstart

This guide validates the foundation artifacts. It does not require external source access or a completed mobile application.

## Prerequisites

- A clean checkout of the repository.
- A POSIX shell with `sed`, `grep`, and `find`.
- A YAML/OpenAPI linter if contract syntax validation is available locally.

## Validate Feature Artifacts

```sh
test -f specs/001-opportunity-platform-foundation/spec.md
test -f specs/001-opportunity-platform-foundation/plan.md
test -f specs/001-opportunity-platform-foundation/research.md
test -f specs/001-opportunity-platform-foundation/data-model.md
test -f specs/001-opportunity-platform-foundation/quickstart.md
test -d specs/001-opportunity-platform-foundation/contracts
```

Expected result: every command exits successfully.

## Validate Scope and Gates

Review [plan.md](plan.md) and confirm that the Constitution Check and Post-Design Constitution Check both pass, and that the plan excludes AI recommendations, semantic search, complex analytics, administration, and advanced personalization.

Expected result: the technical context and research decisions contain no unresolved choices.

## Validate Data Model Coverage

Review [data-model.md](data-model.md) and verify that it includes users, preferences, sources, opportunities, categories, country and field relationships, saved opportunities, applications, notification preferences, ingestion runs, and ingestion errors.

Expected result: every entity has fields, relationships or ownership, validation rules, and any relevant lifecycle/index behavior.

## Validate Public Contracts

Validate [contracts/opportunities-api.yaml](contracts/opportunities-api.yaml) with the repository's chosen OpenAPI linter during implementation setup. Review [contracts/source-adapter.md](contracts/source-adapter.md) and [contracts/search-provider.md](contracts/search-provider.md) for explicit inputs, outputs, failure behavior, and replacement boundaries.

Expected result: the API contract supports anonymous paginated discovery, filtering, sorting, detail retrieval, and source attribution without exposing persistence models.

## Validate Safety Boundaries

Confirm that [contracts/source-adapter.md](contracts/source-adapter.md) requires a registered source definition and explicitly prohibits bypassing access controls. Confirm that the data model retains original URLs and unknown optional values.

Expected result: arbitrary user URLs cannot become ingestion targets, and incomplete records cannot be presented as more certain than their source evidence.

## Implementation-Phase Checks

The eventual implementation should add executable checks for:

- Required provenance and unknown-value behavior.
- Opportunity lifecycle transitions and retention of expired records.
- Exact/probable/possible duplicate classification.
- Approved-source enforcement before network access.
- Adapter failure isolation and ingestion metrics.
- API response validation against the OpenAPI contract.
- Required persistence indexes and relationship uniqueness.

These checks are implementation tasks and are intentionally not represented as a complete test suite in this design artifact.
# Adding a Source Adapter

This guide documents how a contributor adds a new approved source adapter (FR-019). It
implements the contract defined in
[contracts/source-adapter.md](../specs/001-opportunity-platform-foundation/contracts/source-adapter.md).

## Steps

1. **Source metadata**: Add a `Source` record (see
   `packages/opportunity-core/src/entities/Source.ts`) with `name`, `website`, `baseUrl`,
   `sourceType`, `trustLevel`, `crawlEnabled`, `crawlFrequency`, `termsUrl`, and `robotsUrl`.
   Confirm the source's terms and robots policy permit automated access before setting
   `crawlEnabled: true`.
2. **Register the source**: Call `registerSource` (`packages/ingestion-core/src/registry.ts`) so
   the adapter's targets pass `isApprovedTarget`/`assertApprovedTarget`. An adapter must never
   accept a URL that isn't covered by its registered `baseUrl`.
3. **Discovery**: Implement `discover()` to enumerate public listing URLs/identifiers for the
   source without bypassing authentication, CAPTCHA, rate limits, or robots restrictions
   (`contracts/source-adapter.md` stage 1).
4. **Parsing**: Implement `fetch()` and `parse()` to retrieve and extract source-labeled values,
   preserving the original source reference (external id or canonical URL).
5. **Fixtures**: Add representative source HTML/API fixtures under the adapter's own
   `packages/source-adapters/<source-name>/tests/fixtures/` directory covering successful
   parsing, missing optional fields, and malformed required fields.
6. **Normalization tests**: Implement `normalize()` using the taxonomies in
   `packages/opportunity-core/src/taxonomies/index.ts`, and add tests asserting deterministic
   mapping plus preservation of unmapped source labels (never invent a normalized value for an
   unmapped label).
7. **Validation**: Implement `validate()` to return actionable errors for missing
   identity/provenance, malformed dates, invalid URLs, or unsupported source data
   (`contracts/source-adapter.md` stage 5).
8. **Duplicate signals**: Add tests covering exact, probable, and possible duplicate outcomes
   using `packages/opportunity-core/src/duplicates.ts`.
9. **Registration**: Export the adapter implementing `AdapterContract`
   (`packages/ingestion-core/src/AdapterContract.ts`) from
   `packages/source-adapters/<source-name>/index.ts` and register it with the ingestion
   orchestrator (`packages/ingestion-core/src/orchestrator.ts`).
10. **Access-policy review**: A new adapter is registered only after metadata, fixtures, tests,
    and access-policy review are complete - never merge an adapter with `crawlEnabled: true`
    without confirming the source's terms/robots policy permits it.

## Failure Isolation

A failing adapter must never prevent other approved adapters in the same run from completing.
`runAdapters` (`packages/ingestion-core/src/orchestrator.ts`) isolates each adapter's error with
source context (sourceId, stage, message); adapters should let stage failures propagate as a
stage-tagged `AdapterStageResult` rather than throwing past their own boundary where avoidable.

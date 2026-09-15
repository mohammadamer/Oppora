# Source Adapter Contract

Each approved source adapter is an independently testable contributor-owned boundary. It must expose source metadata and implement the following stages:

1. `discover`: identify public source listings without bypassing access controls.
2. `fetch`: retrieve an approved listing under the source's rate, terms, and robots policy.
3. `parse`: extract source-labeled values and preserve the original source reference.
4. `normalize`: map deterministic values into Oppora taxonomies while preserving unmapped labels.
5. `validate`: return actionable errors for missing identity/provenance, malformed dates, invalid URLs, or unsupported source data.

## Input and Output Guarantees

- The adapter receives a registered source definition, not an arbitrary user URL.
- A listing carries an external identifier or canonical URL when available.
- A normalized opportunity must include source identity, source URL, title, category, and an explicit result for validation.
- Unknown optional fields remain unknown; the adapter must not infer funding, eligibility, or deadlines without evidence.
- Network, parse, and validation failures are classified by stage and do not stop unrelated adapters.

## Required Tests

- Representative source HTML/API fixtures for successful parsing.
- Missing optional fields and malformed required fields.
- Taxonomy normalization and preservation of original labels.
- Duplicate signals and uncertain duplicate classification.
- Terms/robots/access-policy refusal.
- Failure isolation and run metrics.

New adapters are registered only after metadata, fixtures, tests, and access policy review are complete.
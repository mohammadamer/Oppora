# Mobile

**Responsibility**: Present opportunities, search, saved items, applications, and notification
preferences to end users, and support anonymous browsing.

**Boundary**: The mobile client contains no business logic, no direct persistence access, and no
scraping behavior. It consumes only the public API contract
(`contracts/opportunities-api.yaml`) via `packages/contracts` generated types. All domain rules
(lifecycle, eligibility, deduplication, normalization) live in `packages/opportunity-core` and
are never duplicated in mobile screens.

**Replacement point**: The mobile client's framework (React Native/Expo) is independent of the
API's implementation; as long as the public contract is stable, the client can be rebuilt without
affecting the API, search, persistence, or ingestion subsystems.

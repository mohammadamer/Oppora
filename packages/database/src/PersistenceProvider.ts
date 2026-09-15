/**
 * Persistence boundary. Consumers (API, ingestion) depend only on this interface, never on a
 * specific storage engine or query language, so the persistence implementation can be replaced
 * without moving business rules into consumers.
 *
 * Behavior that MUST remain stable across any replacement implementation:
 * - Reads and writes operate on the domain entity shapes from packages/opportunity-core.
 * - Unknown/absent optional fields are preserved as explicit unknown values, never defaulted.
 * - Uniqueness and relationship constraints documented in data-model.md are enforced.
 * - A failed write does not silently drop provenance (sourceId, sourceUrl) information.
 */
export interface PersistenceProvider {
  // Method signatures are defined during implementation of packages/database;
  // this interface documents the replacement boundary for Phase 1.
  readonly name: string;
}

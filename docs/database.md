# Database

**Responsibility**: Own the relational persistence schema and adapters that implement the
`PersistenceProvider` boundary for opportunities, sources, users, and related entities.

**Boundary**: Application code (API, ingestion) never issues raw queries directly against the
schema; it depends on `packages/database`'s exported provider implementation, which in turn
depends only on `packages/opportunity-core`'s entity shapes.

**Replacement point**: A different storage engine (or a different ORM) can replace
`packages/database`'s implementation as long as it satisfies `PersistenceProvider`
(`packages/database/src/PersistenceProvider.ts`). No consumer code should need to change.

See the schema definition in `packages/database/prisma/schema.prisma` and the entity/relationship
documentation in [data-model.md](../specs/001-opportunity-platform-foundation/data-model.md).

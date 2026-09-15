# scripts/

Operational and contributor tooling that does not belong to a deployable app or reusable package.

Scripts here are invoked from CI or manually by contributors:

- `check-architecture-docs.sh` — verifies the architecture documentation set exists and is structured consistently (see `docs/architecture.md`).
- `validate-phase1.sh` — runs the Phase 1 foundation validation described in `specs/001-opportunity-platform-foundation/quickstart.md`.

Scripts must remain POSIX-shell compatible and side-effect free unless explicitly documented (no network access, no destructive file operations without a confirmation flag).

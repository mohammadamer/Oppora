#!/usr/bin/env sh
# Implements the quickstart.md validation steps for Phase 1.
# See specs/001-opportunity-platform-foundation/quickstart.md.
set -eu

cd "$(dirname "$0")/.."
FEATURE_DIR="specs/001-opportunity-platform-foundation"
status=0

echo "== Validate Feature Artifacts =="
for f in spec.md plan.md research.md data-model.md quickstart.md; do
  if [ -f "$FEATURE_DIR/$f" ]; then
    echo "OK: $FEATURE_DIR/$f"
  else
    echo "MISSING: $FEATURE_DIR/$f"
    status=1
  fi
done
if [ -d "$FEATURE_DIR/contracts" ]; then
  echo "OK: $FEATURE_DIR/contracts"
else
  echo "MISSING: $FEATURE_DIR/contracts"
  status=1
fi

echo
echo "== Validate Scope and Gates (manual review pointer) =="
echo "Review $FEATURE_DIR/plan.md: confirm Constitution Check and Post-Design Constitution Check both PASS."
echo "See also docs/scope-exclusions.md for the AI/semantic-search/analytics/admin/personalization exclusion confirmation."

echo
echo "== Validate Data Model Coverage (manual review pointer) =="
echo "Review $FEATURE_DIR/data-model.md: confirm every entity has fields, relationships, validation rules, and index behavior."

echo
echo "== Validate Architecture Docs =="
./scripts/check-architecture-docs.sh || status=1

echo
echo "== Validate Public Contracts =="
DATABASE_URL="${DATABASE_URL:-postgresql://user:pass@localhost:5432/oppora}" \
  npx prisma validate --schema packages/database/prisma/schema.prisma || status=1
npx vitest run packages/contracts || status=1

echo
echo "== Run Domain, Persistence, and Ingestion Validation Checks =="
npx vitest run || status=1

if [ "$status" -eq 0 ]; then
  echo
  echo "Phase 1 validation PASSED"
else
  echo
  echo "Phase 1 validation FAILED"
fi

exit "$status"

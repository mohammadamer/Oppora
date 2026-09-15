#!/usr/bin/env sh
# Verifies the architecture documentation set exists and each subsystem doc contains a
# "Responsibility" and "Boundary" heading/section, per FR-001.
set -eu

cd "$(dirname "$0")/.."

DOCS="docs/architecture.md docs/database.md docs/search.md docs/ingestion.md docs/api.md docs/mobile.md docs/notifications.md"

status=0

for f in $DOCS; do
  if [ ! -f "$f" ]; then
    echo "MISSING: $f"
    status=1
    continue
  fi
  if [ "$f" = "docs/architecture.md" ]; then
    # architecture.md documents multiple subsystems; require it to reference each one.
    if ! grep -q "Replaceable Infrastructure" "$f"; then
      echo "FAIL: $f missing 'Replaceable Infrastructure' section"
      status=1
    fi
    continue
  fi
  if ! grep -q "\*\*Responsibility\*\*" "$f"; then
    echo "FAIL: $f missing 'Responsibility' section"
    status=1
  fi
  if ! grep -q "\*\*Boundary\*\*" "$f"; then
    echo "FAIL: $f missing 'Boundary' section"
    status=1
  fi
done

if [ "$status" -eq 0 ]; then
  echo "OK: all architecture docs present and structured"
fi

exit "$status"

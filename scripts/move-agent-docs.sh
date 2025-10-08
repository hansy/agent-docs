#!/usr/bin/env bash
set -euo pipefail

# This script is meant to run from the consumer repo after pulling this package
# under docs/agents/. It relocates template docs into docs/ while leaving the
# runtime state, role guides, and helper scripts under docs/agents/.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="$(dirname "${SCRIPT_DIR}")"
DOCS_DIR="$(dirname "${AGENTS_DIR}")"

KEEP=("README.md" "AGENTS.md" "STATE.md" "state.json" "roles" "scripts")

contains() {
  local match="$1"
  shift
  for item in "$@"; do
    if [[ "$item" == "$match" ]]; then
      return 0
    fi
  done
  return 1
}

shopt -s dotglob

moved_any=false
for path in "${AGENTS_DIR}"/*; do
  name="$(basename "$path")"
  if contains "$name" "${KEEP[@]}"; then
    continue
  fi

  target="${DOCS_DIR}/${name}"
  if [[ -e "$target" ]]; then
    echo "skip: ${target} already exists; please reconcile manually" >&2
    continue
  fi

  mv "$path" "$target"
  echo "moved: ${name} -> ${DOCS_DIR}/"
  moved_any=true
done

if [[ "$moved_any" == false ]]; then
  echo "Nothing moved; docs may already be in place." >&2
fi

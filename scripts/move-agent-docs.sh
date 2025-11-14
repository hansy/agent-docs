#!/usr/bin/env bash
set -euo pipefail

# This script is meant to run from the consumer repo after pulling this package
# under docs/agents/. It relocates template docs into docs/ while leaving the
# runtime state, role guides, and helper scripts under docs/agents/.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="$(dirname "${SCRIPT_DIR}")"
DOCS_DIR="$(dirname "${AGENTS_DIR}")"
ROOT_DIR="$(dirname "${DOCS_DIR}")"

KEEP=("README.md" "STATE.md" "state.json" "roles" "scripts")

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

  if [[ "$name" == "AGENTS.md" ]]; then
    target="${ROOT_DIR}/${name}"
    destination="${ROOT_DIR}/"
  else
    target="${DOCS_DIR}/${name}"
    destination="${DOCS_DIR}/"
  fi
  if [[ -e "$target" ]]; then
    echo "skip: ${target} already exists; please reconcile manually" >&2
    continue
  fi

  mv "$path" "$target"
  echo "moved: ${name} -> ${destination}"
  moved_any=true
done

# Also move any nested templates under docs/agents/docs/* → docs/* (preserve structure)
NESTED_DOCS_DIR="${AGENTS_DIR}/docs"
if [[ -d "${NESTED_DOCS_DIR}" ]]; then
  while IFS= read -r -d '' entry; do
    rel="${entry#${NESTED_DOCS_DIR}/}"
    target="${DOCS_DIR}/${rel}"
    dest_dir="$(dirname "$target")"
    if [[ -e "$target" ]]; then
      echo "skip: ${target} already exists; please reconcile manually" >&2
      continue
    fi
    mkdir -p "$dest_dir"
    mv "$entry" "$target"
    echo "moved: docs/${rel} -> ${DOCS_DIR}/"
    moved_any=true
  done < <(find "${NESTED_DOCS_DIR}" -mindepth 1 -print0)
fi

if [[ "$moved_any" == false ]]; then
  echo "Nothing moved; docs may already be in place." >&2
fi

#!/usr/bin/env bash
set -euo pipefail

# This script is meant to run from the consumer repo after pulling this package
# under docs/agents/. It relocates template docs into docs/ while leaving the
# runtime state, role guides, and helper scripts under docs/agents/.

cleanup() {
  if [[ -n "${MOVE_AGENT_DOCS_TMP:-}" ]]; then
    rm -rf "${MOVE_AGENT_DOCS_TMP}"
  fi
}
trap cleanup EXIT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="$(dirname "${SCRIPT_DIR}")"
DOCS_DIR="$(dirname "${AGENTS_DIR}")"

SOURCE_DIR="${AGENTS_DIR}"
if [[ -d "${AGENTS_DIR}/package" ]]; then
  SOURCE_DIR="${AGENTS_DIR}/package"
fi

if [[ -z "${MOVE_AGENT_DOCS_REEXEC:-}" && "${SCRIPT_DIR}" == "${SOURCE_DIR}/scripts" ]]; then
  TMP_ROOT="$(mktemp -d)"
  cp -R "${SCRIPT_DIR}" "${TMP_ROOT}/scripts"
  MOVE_AGENT_DOCS_REEXEC=1 MOVE_AGENT_DOCS_TMP="${TMP_ROOT}" exec bash "${TMP_ROOT}/scripts/$(basename "$0")"
fi

KEEP=("AGENTS.md" "STATE.md" "state.json" "roles" "scripts")

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
for path in "${SOURCE_DIR}"/*; do
  name="$(basename "$path")"
  if contains "$name" "${KEEP[@]}"; then
    target="${AGENTS_DIR}/${name}"
    if [[ -e "$target" ]]; then
      echo "keep: ${name} already present in docs/agents/; updating copy." >&2
      rm -rf "${target}"
    fi
    mv "$path" "$target"
    echo "kept: ${name} -> ${AGENTS_DIR}/"
    moved_any=true
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

if [[ "${SOURCE_DIR}" != "${AGENTS_DIR}" && -d "${SOURCE_DIR}" ]]; then
  rmdir "${SOURCE_DIR}" 2>/dev/null || true
fi

if [[ "$moved_any" == false ]]; then
  echo "Nothing moved; docs may already be in place." >&2
fi

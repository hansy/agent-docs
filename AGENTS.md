# AGENTS.md

## Quick Mode Router (read this first)

Use Quick Mode when the user’s ask is a small, low‑risk change. If any Quick Mode gate fails, escalate to the normal Feature Mode (roles flow below).

Signals that trigger Quick Mode
- Explicit: prompt starts with "quick:" or contains "#quick".
- Scope: user points to exact file(s) or mentions small copy/typo/UI tweak.
- Policy: the change fits within `quick.config.json` limits.

Quick Mode gates (must all pass)
- Limits from `quick.config.json`: `maxFilesChanged`, `maxAddedLines`, `allowNewFiles`, `allowRenames`, `allowedPaths`, `escalateIf` (addsDependency, touchesMigrations, changesConfig, touchesPublicAPI).
- Boundary rules from `structure.rules.json`: only allowed cross‑module imports; correct file placement.
- Checks from `commands.json`: run `lint`, `typecheck`, `test` if defined.

Quick Mode playbook (text‑only, agent steps)
1) Restate the ask in one sentence and list target files. If ambiguous, ask one short question; else proceed.
2) Propose a minimal unified diff (only necessary lines). Keep within `quick.config.json` limits.
3) Validate boundaries against `structure.rules.json` (allowed imports and module placement). If violated → escalate.
4) Run checks from `commands.json` (`lint`, `typecheck`, `test` when available). If checks fail → fix or escalate.
5) Present the final diff and a one‑line commit message. If the user explicitly approves (or the prompt includes "quick: approve"), apply the change and commit; otherwise open a PR/diff and hand off to Reviewer.
6) On success, post a ≤12‑line summary with changed paths. Do not modify `docs/agents/state.json` unless asked.

Escalate to Feature Mode when
- Any gate fails (limits, boundaries, dependency/migration/config changes), or tests require non‑trivial setup, or the scope expands beyond a small patch.
- Use the normal roles flow beginning with Planner.

## Must-read (in order)

1. Product context: docs/PRD.md
2. Agent state docs: docs/agents/STATE.md
3. Agent state: docs/agents/state.json (read `plan_slug`, `current_role`, `state`, `msg`)

## Assume Role

Assume the `current_role`. Read the relevant role guide found in `docs/agents/roles/<current_role>.md` to understand what your role entails.

## Conversation-First & Review (All Roles)

- Before any changes: discuss the upcoming task in chat, ask clarifying questions, and propose your plan/approach. Wait for explicit user approval before creating/modifying files, branches, or `state.json`.
- Quick Mode exception: if the prompt includes an explicit "quick: approve" and all gates/checks pass, you may commit a single small patch without a separate approval step. Otherwise, show the diff and wait for approval.

## Boundary Gate (All Changes — must pass)

Applies to Quick Mode and Feature Mode before committing code.

1) Map each changed file to a module by prefix match on `structure.rules.json.modules[*].root`.
2) For each changed file, list internal imports (ESM `import ... from '...';` and CommonJS `require('...')`).
3) Resolve each internal import to a module using the same root mapping (relative imports only; treat bare module specifiers and alias paths as external/ignored).
4) Verify allowlist: `allow[fromModule]` must include `toModule`. If any violation is found → do not commit; fix placement/imports or escalate to Feature Mode.
5) If import aliasing (e.g., tsconfig paths) prevents resolution, treat as unknown and escalate unless clearly safe.
- After you finish: present a concise summary of what changed (paths, rationale, test status). Wait for explicit approval before handing off and committing your work or updating state.

## Local AGENTS.md

If an AGENTS.md exists in a package/app, read it after this file; its rules are stricter for that scope.

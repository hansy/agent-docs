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
5) Present the final diff and a one‑line commit message.
   • Commit/PR convention: `<type>(<scope>): <change>`; e.g., `chore(web): update CTA copy`.
   • If the user explicitly approves (or the prompt includes "quick: approve"), apply the change and commit; otherwise open a PR/diff and hand off to Reviewer.
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

Role consolidation: Planner = Spec (Planner + Architect)

- The Architect role is consolidated into the Planner as a single "Spec" role focused on conversation, clarity, and scope control.
- If `current_role = ARCHITECT`, treat it as `PLANNER` and follow the Planner guide. Produce the task spec in plain language in `docs/current/design.md` (description, goal, ACs with Scenario IDs, desired output, open questions, out of scope).

## Conversation-First & Review (All Roles)

- Before any changes: discuss the upcoming task in chat, ask clarifying questions, and propose your plan/approach. Wait for explicit user approval before creating/modifying files, branches, or `state.json`.
- Quick Mode exception: if the prompt includes an explicit "quick: approve" and all gates/checks pass, you may commit a single small patch without a separate approval step. Otherwise, show the diff and wait for approval.

## Autopilot (text-only policy)

Optional behavior knob in `docs/agents/state.json` → `autopilot`: `off | review_only | full`.

- off (default):
  - Quick Mode: propose diff → wait for approval (unless prompt has "quick: approve"). Commit only after approval.
  - Feature Mode: normal roles flow; Reviewer’s approval is required.
- review_only:
  - Quick Mode: if all gates/checks pass, open a PR with the diff and concise summary. Human approval merges.
  - Feature Mode: proceed through roles, batching approvals at Reviewer per feature.
- full:
  - Quick Mode: if gates/checks pass, commit directly; post summary and changed paths.
  - Feature Mode: proceed through roles and auto‑merge when Reviewer checks are satisfied; still post a summary for human visibility.

If `autopilot` is absent, treat it as `off`.

## Boundary Gate (All Changes — must pass)

Applies to Quick Mode and Feature Mode before committing code.

1) Map each changed file to a module by prefix match on `structure.rules.json.modules[*].root`.
2) For each changed file, list internal imports (ESM `import ... from '...';` and CommonJS `require('...')`).
3) Resolve each internal import to a module using the same root mapping (relative imports only; treat bare module specifiers and alias paths as external/ignored).
4) Verify allowlist: `allow[fromModule]` must include `toModule`. If any violation is found → do not commit; fix placement/imports or escalate to Feature Mode.
5) If import aliasing (e.g., tsconfig paths) prevents resolution, treat as unknown and escalate unless clearly safe.

## Dependency Changes Gate (All Changes)

If dependency or platform files change (e.g., lockfiles, package descriptors, migrations, build/CI configs):
- Quick Mode: escalate to Feature Mode.
- Feature Mode: note the change, justify it briefly, and ensure Reviewer verifies tech policy (consult `tech_stack.json` when present).

Examples of dependency/config files:
- JavaScript/TypeScript: `package.json`, lockfiles, `tsconfig*.json`, build tool configs, `.github/workflows/*`.
- Python: `pyproject.toml`, `requirements.txt`, `Pipfile*`.
- Others: `Dockerfile`, infra manifests, migration directories.

## Commands Contract (All Agents)

Preferred commands live in `commands.json` (keys: dev, test, lint, typecheck, build, diff, cov).
- If `commands.json` is missing or incomplete, ask the human for the exact commands before proceeding.
- Default fallbacks are not assumed to be safe; always confirm.

## Vendoring Path Note

Policy files may live at repo root or under `docs/`. When reading paths, check both locations for:
- `structure.rules.json`, `commands.json`, `quick.config.json`, `tech_stack.json`.

## CI Recipe (optional)

Projects may run CI with the following minimal steps:
- Install deps (stack‑specific).
- Run `lint`, `typecheck`, `test` from `commands.json`.
- Enforce Boundary Gate (fail CI on violations).
- Disallow Quick Mode merges on CI failures.

## Ephemeral Docs (Feature Mode)

- Only track the current feature/task under `docs/current/`.
- Required files during an active task:
- `docs/current/design.md` — Spec’s plain‑language task spec (Description, Goal, ACs with S‑IDs, Desired Output, Open Questions, Out of Scope)
  - Optional: `docs/current/coding-notes.md` — Coder’s brief notes and commands
  - Optional: `docs/current/review.md` — Reviewer’s decision and notes
- When a task is approved and another task remains: overwrite `docs/current/design.md` for the next task (do not create new folders).
- When the feature is approved (done): Reviewer must delete the entire `docs/current/` folder and reset `docs/agents/state.json` to defaults.
- After you finish: present a concise summary of what changed (paths, rationale, test status). Wait for explicit approval before handing off and committing your work or updating state.

## Local AGENTS.md

If an AGENTS.md exists in a package/app, read it after this file; its rules are stricter for that scope.

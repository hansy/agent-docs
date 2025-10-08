# CODER

## Purpose & Boundaries

### Goal

Turn the plan + evidence into working code via a strict task-by-task TDD loop, keeping scope minimal and traceable.

### Role Flow

Planner → Researcher → Coder → Reviewer

Must-Read (in order)

1. docs/agents/state.json — get `plan_slug` (Feature slug `F###-<feature>`), confirm role, and note `branch`.
2. Feature plan: docs/features/F###-<feature>/plan.md — Implementation Tasks (T##) live here.
3. Evidence: docs/features/F###-<feature>/evidence.md — files-to-touch, test→code map, proposals.
4. docs/STRUCTURE.md (+ target package/app README.md / STRUCTURE.md).
5. docs/TECH_STACK.md, docs/COMMANDS.md.

### Hard Guardrails

• Reuse before new code. If a new public surface or folder is needed without an approved Structure Delta, BLOCK and request approval.
• Respect boundaries. No forbidden imports; no ad-hoc new top-level dirs.
• No secrets. Only touch .env.example (masked placeholders).
• Minimal diffs. Keep each change scoped to a single task.

⸻

## Preflight (once per feature)

Repo first-invoke (once per repo)

- If any of these are missing or obviously incomplete, engage the human to initialize/finish them before starting T##:
  - `docs/COMMANDS.md`
  - `docs/STRUCTURE.md`
  - `docs/TECH_STACK.md`
  - `docs/README.md`
  (Keep it lightweight; capture gaps in coding-notes if deferring details.)

1. Implementation Tasks — ensure the plan has a checklist:

```md
## Implementation Tasks

- [ ] T01: <action> (scenarios: S1, S2) — status: todo
- [ ] T02: <action> (scenarios: S3) — status: todo
```

Allowed statuses: todo | in_progress | blocked | done.

2. Use the Planner’s branch (do not create a new one)
   • Planner creates a task branch for the active task: `feat/F###-<feature>--T##-<task>`. Commit to that branch.
   • PM performs merges (task → feature; feature → default). Do not merge.
3. Verify local commands (by reference)
   • You can run: dev, test, lint, typecheck (see `docs/COMMANDS.md`).
4. Confirm import rules
   • Skim `docs/STRUCTURE.md` and package boundaries.

⸻

## The Task Loop (repeat for each task, in order)

For each unchecked task in Implementation Tasks:

A) Mark in progress
• Edit the plan: set status: in_progress for Tn.

B) Failing tests first
• Write or activate failing tests for the task’s scenarios.
• Include scenario IDs in test names (e.g., it('[S1] ...', ...)).
• Include at least one boundary and one negative case where relevant.
• If tests already pass, tighten assertions until they fail for the right reason.

C) Implement the smallest change
• Reuse mapped symbols from Evidence. If ambiguity arises → BLOCK with a precise question.
• Avoid new dependencies unless already proposed/approved; otherwise request approval.

D) Verify locally
• Run tests, lints, and types (commands from `docs/COMMANDS.md`).
• Tests MUST pass before every commit. Fix until green; do not commit red.
• Prefer running the narrowest relevant tests first, then the package suite before committing.

E) Update the plan
• Check off Tn; set status: done.
• Add a one-liner: what changed & where (paths only, no diffs).

F) Commit (after each task, small, conventional)
• Only commit when tests pass.
• Example: feat/F###-<feature>: implement T01 — S1,S2 green

If blocked (unclear scenario, needs new structure/dep, boundary conflict):
• Set status: blocked in the plan, list the blocker, and output status: "BLOCKED" with explicit questions.

⸻

## Documentation Standards (what to update)

• Public API docs: TSdoc/JSDoc for each exported function/type (purpose, params, returns, errors).
• Package docs: If you add/alter a public surface, update that package’s README.md (Exports) and STRUCTURE.md (one-liners). Do not change top-level structure unless approved.
• Commands/Tech: If scripts/deps change, update `docs/COMMANDS.md` and add a one-liner to `docs/TECH_STACK.md` (justify in commit body).
• .env.example: Add new vars with safe placeholders and brief comments.

⸻

## Handoff Kit (required outputs)

1. Plan updated — `docs/features/F###-<feature>/plan.md`
   • ## Implementation Tasks reflects final statuses; each task has a one-line note of changes/paths.
   • Note any residual risks or follow-ups.

2. Commands used
   • List exact commands (from `docs/COMMANDS.md`).

3. Coding notes — `docs/features/F###-<feature>/coding-notes.md`
   • Use the template below.
   • Summary, lessons, blockers, improvements.

4. State update — `docs/agents/state.json`
   • Set next role and state appropriately (e.g., current_role=Reviewer, state=handoff).
   • After human confirmation, commit state update and docs.

⸻

## When to BLOCK (and ask)

• A Structure Delta or new dependency is required but not approved.
• Scenario ambiguity or missing acceptance criteria.
• Completing the task would violate boundaries.
• Unable to produce failing tests first without fabricating behavior.

⸻

## Quality Checklist (self-review)

• Each task followed: failing tests → code → green.
• Scenario IDs in test names and commit message.
• No forbidden imports or stray files; no unapproved new structure.
• Public surfaces documented (TSdoc / README / STRUCTURE).
• Commands listed; no secrets printed or committed.

## Handoff msg templates (≤12 lines)

Coder → Reviewer

```
[Coder] <git branch> ready.
Tasks done: T01,T02. Tests: S1–S3 green.
Docs updated: <paths>. See plan task notes for changed paths.
```

## Coding Notes — Template

Path: `docs/features/F###-<feature>/coding-notes.md`

```
# Coding Notes — <F###-feature>

Date: YYYY-MM-DD • Coder: <name>

## Summary

<What changed at a high level>

## Commands used

- dev: …
- test: …
- lint: …
- typecheck: …

## Blockers & Resolutions

- B1: <issue> — resolution: <how resolved or follow-up>

## Improvements / Follow-ups

- I1: …
```

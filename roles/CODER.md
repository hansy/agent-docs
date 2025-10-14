# CODER

## Purpose & Boundaries

### Goal

Turn the plan + evidence into working code via a strict task-by-task TDD loop, keeping scope minimal and traceable.

### Role Flow

Planner → Architect → Coder → Reviewer

Must-Read (in order)

1. docs/agents/state.json — get `plan_slug` (Feature slug `F###-<feature>`), confirm role, and note `branch`.
2. Tasks index: docs/features/F###-<feature>/tasks.md — task list and statuses
3. Task plan: docs/features/F###-<feature>/tasks/T##-<task>/plan.md
4. Evidence: docs/features/F###-<feature>/tasks/T##-<task>/evidence.md — files-to-touch, test→code map, proposals.
5. docs/STRUCTURE.md (+ target package/app README.md / STRUCTURE.md).
6. docs/TECH_STACK.md, docs/COMMANDS.md.

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

1. Tasks index — ensure `docs/features/F###-<feature>/tasks.md` exists and lists tasks with statuses (todo | in_progress | blocked | done) and scenario IDs.

2. Use the active task branch (`feat/F###-<feature>--T##-<task>`).

3. Verify local commands (by reference)
   • You can run: dev, test, lint, typecheck (see `docs/COMMANDS.md`).
4. Confirm import rules
   • Skim `docs/STRUCTURE.md` and package boundaries.

⸻

## The Task Loop (repeat for each task, in order)

For each unchecked task in `docs/features/F###-<feature>/tasks.md`:

0. Plan
   • Draft a concise step-by-step implementation plan (tests, code changes, files) tailored to the active task.
   • Share the plan with the human (see AGENTS.md conversation-first policy).
   • Record the final plan under `## Task Plan (approved)` in `docs/features/F###-<feature>/tasks/T##-<task>/coding-notes.md`.
   • If scope changes mid-task, pause, update the plan, and confirm changes with the human before resuming (per AGENTS.md).

A) Mark in progress
• Update `docs/features/F###-<feature>/tasks.md`: set status in_progress for Tn.

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

E) Update tasks
• In `tasks.md`, check off Tn; set status: done.
• Add a one-liner: what changed & where (paths only, no diffs).

F) Commit (after each task, small, conventional)
• Only commit when tests pass.
• Example: feat/F###-<feature>: implement T01 — S1,S2 green

If blocked (unclear scenario, needs new structure/dep, boundary conflict):
• Set status: blocked in the plan, list the blocker, and output status: "BLOCKED" with explicit questions.

⸻

## Documentation Standards (what to update)

• Inline docs: add or refresh docstrings/comments for every new or modified function, class, and complex block — exported and internal. Capture intent, side effects, and scenario IDs when useful.
• External docs: do not edit STRUCTURE/TECH_STACK/COMMANDS/READMEs unless explicitly asked; instead, list required changes under **Doc updates needed** in coding notes so the Reviewer can sync them.
• Environment files: if new env vars are introduced, add masked entries to `.env.example` or flag them in coding notes when unsure.

⸻

## Handoff Kit (required outputs)

1. Tasks updated — `docs/features/F###-<feature>/tasks.md`
   • Status for T## is done; one-line note of changes/paths.
   • Note any residual risks or follow-ups in coding notes.

2. Commands used
   • List exact commands (from `docs/COMMANDS.md`).

3. Coding notes — `docs/features/F###-<feature>/tasks/T##-<task>/coding-notes.md`
   • Use the template below and capture the approved plan before coding.
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
• Inline docs refreshed for all touched code; required external doc updates captured in coding notes.
• Commands listed; no secrets printed or committed.

## Handoff msg templates (≤12 lines)

Coder → Reviewer

```
[Coder] <git branch> ready.
Tasks done: T01,T02. Tests: S1–S3 green.
Doc updates needed: <refs or “none”>. See tasks.md and task coding-notes for changed paths.
```

## Coding Notes — Template

Path: `docs/features/F###-<feature>/tasks/T##-<task>/coding-notes.md`

```
# Coding Notes — <F###-feature>

Date: YYYY-MM-DD • Coder: <name>

## Task Plan (approved)

- Step 1: …
- Step 2: …

## Summary

<What changed at a high level>

## Doc updates needed

- STRUCTURE.md — <reason> (write “none” if not needed)

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

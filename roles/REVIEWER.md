# REVIEWER

## Purpose

Final gate before merge. Focus on:

1. **Code review** (clarity, safety, minimal diffs)
2. **Architecture integrity** (aligns with established boundaries & practices)
3. **Tests vs Acceptance Criteria** (adequate coverage of agreed ACs)

## Must-Read (in order)

1. Tasks index: `docs/features/F###-<feature>/tasks.md` — T## list and statuses
2. Task docs (active):
   - Plan: `docs/features/F###-<feature>/tasks/T##-<task>/plan.md`
   - Evidence: `docs/features/F###-<feature>/tasks/T##-<task>/evidence.md`
   - Coding notes: `docs/features/F###-<feature>/tasks/T##-<task>/coding-notes.md`
3. Diffs (feature branch vs default) via commands in `docs/COMMANDS.md`
4. `docs/STRUCTURE.md` (+ per-package STRUCTURE.md)
5. `docs/TECH_STACK.md`, `docs/COMMANDS.md`, `.env.example` (if touched)

## Outputs (artifacts)

- `docs/features/F###-<feature>/tasks/T##-<task>/review.md` — concise pass/fail with required fixes & paths (per task)
- Doc-only diffs if needed (STRUCTURE/README/TECH_STACK/COMMANDS/.env.example)
- Merges (you own these after approvals):
  - Task approved (not last): merge `feat/F###-<feature>--T##-<task>` → `feat/F###-<feature>`; delete task branch if clean.
  - Task approved (last task): first merge task branch → feature; then merge `feat/F###-<feature>` → default (e.g., `main`); delete merged branches if clean.
- ROADMAP update (feature complete only): mark the feature as done in `docs/ROADMAP.md`.
- State update in `docs/agents/state.json`:
  - Task approved: `current_role=PLANNER`, `state=handoff`, `msg` references `T##` and paths
  - Feature complete (all tasks done): reset to defaults (see `STATE.md#Defaults`).

---

## Review Flow

1. **Prep** — read plan/evidence, open diffs, skim STRUCTURE rules.
2. **Code Review (pillar #1)**
   - Readability: small, cohesive changes; no dead code; clear names.
   - Safety: input validation, error handling, timeouts where relevant.
   - Dependencies: no unnecessary deps; versions and TECH_STACK updated if changed.
   - Secrets: none committed; `.env.example` placeholders only.
3. **Architecture Integrity (pillar #2)**

- Imports respect module boundaries; file placement matches `STRUCTURE.md`.
- Reuse per Evidence (no re-implementing existing symbols).
- Any structural change is backed by an **approved Structure Delta**.
- Inline documentation present for new/changed code (docstrings/comments where expected).
- External docs (package `STRUCTURE.md`, README.md, `docs/TECH_STACK.md`, `docs/COMMANDS.md`) are synced; consult the Coder’s `Doc updates needed` notes, then update yourself or bounce back.
- Tasks: confirm tasks T## exist as subfolders under `tasks/` and are tracked in `tasks.md`; paths and imports respect STRUCTURE rules.
- Acceptance Criteria: when approving, mark the relevant AC checkboxes as complete in the task plan.

4. **Tests vs Acceptance Criteria (pillar #3)**
   - Each AC maps to at least one passing test with a **Scenario ID (Sx)**.
   - Coverage includes **happy, boundary, and negative** cases where applicable.
   - Evidence that tests would fail without the code change (or clear rationale).
5. **Decision** — Approve or request changes.
   - Task-level approval: update artifacts, perform merge(s) to feature, set handoff to Planner, then commit.
   - Feature-level approval (all tasks done): update artifacts, perform final merges to default, update `docs/ROADMAP.md`, reset `docs/agents/state.json` to defaults, then commit.

---

## Task vs Feature Approval

- Approving an individual task (T##) marks that task done in `tasks.md`, you merge the task branch into the feature branch, then hand off to the Planner (state=handoff) for next-task coordination.
- Approving the feature requires all tasks in `tasks.md` to be done; then you merge the feature branch into default, update `docs/ROADMAP.md`, and reset `docs/agents/state.json` to defaults.

---

## Checklists

### A) Code Review

- [ ] Minimal, readable diffs; no stray files
- [ ] Reasonable validation/error handling; no silent failures
- [ ] No secrets/credentials; `.env.example` updated if needed
- [ ] New/changed deps justified + `TECH_STACK.md`/`COMMANDS.md` updated

### B) Architecture Integrity

- [ ] Imports & placement follow `docs/STRUCTURE.md`
- [ ] Reuse targets from Evidence honored (no duplication)
- [ ] Structural changes match an approved Structure Delta
- [ ] Inline documentation added for new/changed code
- [ ] External docs (`STRUCTURE.md`/`README.md`/`TECH_STACK.md`/`COMMANDS.md`) updated or bounce issued

### C) Tests vs Acceptance Criteria

- [ ] Each **AC** → mapped test(s) with **S-IDs**
- [ ] Happy + boundary + negative where relevant
- [ ] Would-fail proof (failing-first or credible demonstration)
- [ ] Test names/commits include Scenario IDs

---

## Auto-Block Conditions

- Tests do not cover all ACs or lack boundary/negative where relevant
- Boundary violations (imports/placement) or unapproved structure change
- New dependency without justification or TECH_STACK update
- Missing inline documentation or unsynced external docs when required
- No evidence tests would fail without the change
- Secrets or unsafe patterns committed

---

## Bounce vs Fix

- **Bounce to Coder** for any code/test/dependency change beyond a trivial 1–2 line patch.
- **Fix inline** only for doc sync (STRUCTURE/README/TECH_STACK/COMMANDS/.env.example) and include those diffs in review artifacts.

---

## Handoff message templates

**→ Coder (changes requested)**

Reviewer → Coder (changes)

```
[Reviewer] Changes requested:

    1.	Add boundary test for AC2 (S3) — path: tests/…
    2.	Move file into packages/core/… to respect STRUCTURE.md
    3.	Add TECH_STACK.md one-liner for new dep

Reassigning to Coder.
```

Reviewer → Planner (task approved)

```
[Reviewer] Task approved: T## — <task title>.
Branch merged: feat/F###-<feature>--T##-<task> → feat/F###-<feature> (task branch removed).
ACs covered (Sx…). Docs synced as noted. Marked T## done in tasks.md.
State: handoff → Planner (ready to queue next task).
```

Reviewer → (feature done)

```
[Reviewer] Feature approved. All tasks done per tasks.md. ACs covered.
Merged feat/F###-<feature> → main (deleted merged branches).
Updated docs/ROADMAP.md. Reset docs/agents/state.json to defaults.
```

## Review — Template

Path: `docs/features/F###-<feature>/tasks/T##-<task>/review.md`

```md
# Review — <F###-feature>

Date: YYYY-MM-DD • Reviewer: <name>

## Decision

- [ ] Approved
- [ ] Changes requested (see list)

## Required changes (if any)

1. … — path: …
2. … — path: …

## Notes

- Coverage vs ACs: S1,S2,S3 …
- Boundaries respected: yes/no (details)
- Deps/TECH_STACK/COMMANDS: synced/not needed

## State update

- Set in `docs/agents/state.json`: `current_role`, `state`, `msg`
```

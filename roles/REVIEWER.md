# REVIEWER

## Purpose

Final gate before merge. Focus on:

1. **Code review** (clarity, safety, minimal diffs)
2. **Architecture integrity** (aligns with established boundaries & practices)
3. **Tests vs Acceptance Criteria** (adequate coverage of agreed ACs)

## Must-Read (in order)

1. Tasks index: `docs/features/F###-<feature>/tasks.md` — T## list and statuses
2. JSON twins (authoritative for agents): `structure.rules.json`, `commands.json`, `tech_stack.json` (if present)
3. Task docs (active):
   - Design: `docs/features/F###-<feature>/tasks/T##-<task>/design.md`
   - Coding notes: `docs/features/F###-<feature>/tasks/T##-<task>/coding-notes.md`
4. Diffs (feature branch vs default) via commands in `commands.json`
5. structure.rules.json (module allowlists/roots) and package READMEs (if present)
6. tech_stack.json (if present), `.env.example` (if touched)

## Outputs (artifacts)

- `docs/features/F###-<feature>/tasks/T##-<task>/review.md` — concise pass/fail with required fixes & paths (per task)
- Doc-only diffs if needed (STRUCTURE/README/TECH_STACK/COMMANDS/.env.example)
- Update tasks index: mark `T##` done in `docs/features/F###-<feature>/tasks.md` and add a one-line changed-paths note
- Merges (you own these after approvals):
  - Task approved (not last): merge `feat/F###-<feature>--T##-<task>` → `feat/F###-<feature>`; delete task branch if clean.
  - Task approved (last task): first merge task branch → feature; then merge `feat/F###-<feature>` → default (e.g., `main`); delete merged branches if clean.
- ROADMAP update (feature complete only): mark the feature as done in `docs/ROADMAP.md`.
- State update in `docs/agents/state.json`:
  - Task approved (more tasks remain): select next task by number order, bootstrap next task (branch + folder), then set `current_role=ARCHITECT`, `state=handoff`; include next `T##` and paths in `msg`.
  - Feature complete (no tasks remain): perform final merges and roadmap update, then reset to defaults (see `STATE.md#Defaults`, which sets `current_role=PLANNER`).

---

## Review Flow

1. **Prep** — read plan/design, open diffs, skim STRUCTURE rules.
2. **Code Review (pillar #1)**
   - Readability: small, cohesive changes; no dead code; clear names.
   - Safety: input validation, error handling, timeouts where relevant.
   - Dependencies: no unnecessary deps; versions and tech_stack.json updated if changed.
   - Secrets: none committed; `.env.example` placeholders only.
3. **Architecture Integrity (pillar #2)**

- Imports respect module boundaries; file placement matches structure.rules.json.
- Reuse per Design (no re-implementing existing symbols).
- Any structural change is backed by an **approved Structure Delta**.
- Inline documentation present for new/changed code (docstrings/comments where expected).
- Policy files (structure.rules.json, commands.json, tech_stack.json) are up-to-date; consult the Coder’s `Doc updates needed` notes, then update yourself.
- Tasks: confirm tasks T## exist as subfolders under `tasks/` and are tracked in `tasks.md`; paths and imports respect STRUCTURE rules.
- Acceptance Criteria: when approving, mark the relevant AC checkboxes as complete in `design.md`.

4. **Tests vs Acceptance Criteria (pillar #3)**
   - Each AC in `design.md` maps to at least one passing test with a **Scenario ID (Sx)**.
   - Coverage includes **happy, boundary, and negative** cases where applicable.
   - Evidence that tests would fail without the code change (or clear rationale).
5. **Decision** — Approve or fix inline.
   - Task-level (more tasks remain): apply all required fixes (code/tests/deps/docs) directly on the task branch until green; update artifacts, mark `T##` done in `tasks.md` with a one-line changed-paths note, merge task → feature; select the next task by numeric order, create `docs/features/F###-<feature>/tasks/T##-<task>/` (if missing) and branch `feat/F###-<feature>--T##-<task>`, check out the new branch, then hand off to Architect (state=handoff) and commit.
   - Feature-level (no tasks remain): finish any fixes, perform final merges to default, update `docs/ROADMAP.md`, reset `docs/agents/state.json` to defaults (current_role=PLANNER), then commit.

---

## Task vs Feature Approval

- Approving an individual task (T##) marks that task done in `tasks.md` (include the one-line changed-paths note). You then merge the task branch into the feature branch, select the next task by number, bootstrap its branch/folder, and hand off to the Architect (state=handoff).
- Approving the feature requires all tasks in `tasks.md` to be done; then you merge the feature branch into default, update `docs/ROADMAP.md`, and reset `docs/agents/state.json` to defaults (next role is Planner).

---

## Checklists

### A) Code Review

- [ ] Minimal, readable diffs; no stray files
- [ ] Reasonable validation/error handling; no silent failures
- [ ] No secrets/credentials; `.env.example` updated if needed
- [ ] New/changed deps justified + tech_stack.json/commands.json updated (if applicable)

### B) Architecture Integrity

- [ ] Imports & placement follow structure.rules.json (Boundary Gate passed)
- [ ] Reuse targets from Design honored (no duplication)
- [ ] Structural changes match an approved Structure Delta
- [ ] Inline documentation added for new/changed code
- [ ] Policy files and any touched package README updated (as needed)

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
- No demonstration tests would fail without the change
- Secrets or unsafe patterns committed

---

## Fix policy

- Reviewer applies all necessary fixes (code, tests, dependencies, documentation) directly on the task branch; do not hand off to Coder.

---

## Handoff message templates

Reviewer → Architect (next task)

```
[Reviewer] Next task ready: T## — <task title> (by number order).
Branch: feat/F###-<feature>--T##-<task> (from feat/F###-<feature>)
Paths:
  - Feature tasks index: docs/features/F###-<feature>/tasks.md
  - Design (to author): docs/features/F###-<feature>/tasks/T##-<task>/design.md
State: handoff → Architect.
Notes: prior task merged; ACs covered per review; marked Tprev done in tasks.md with changed-paths note.
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
- [ ] Fixes applied (see list)

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

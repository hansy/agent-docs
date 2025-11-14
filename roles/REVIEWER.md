# REVIEWER

## Purpose

Final gate before merge. Focus on:

1. **Code review** (clarity, safety, minimal diffs)
2. **Architecture integrity** (aligns with established boundaries & practices)
3. **Tests vs Acceptance Criteria** (adequate coverage of agreed ACs)

## Must-Read (in order)

1. JSON twins (authoritative for agents): `structure.rules.json`, `commands.json`, `tech_stack.json` (if present)
2. Task docs (current only):
   - Design: `docs/current/design.md`
   - Coding notes (optional): `docs/current/coding-notes.md`
3. Diffs (feature branch vs default) via commands in `commands.json`
4. structure.rules.json (module allowlists/roots) and package READMEs (if present)
5. tech_stack.json (if present), `.env.example` (if touched)

## Outputs (artifacts)

- `docs/current/review.md` — concise pass/fail with required fixes & paths (optional)
- Doc-only diffs if needed (policy files or `.env.example`)
- Merges (you own these after approvals):
  - Default: fast‑forward/merge changes into the single feature branch, then merge `feat/F###-<feature>` → default when the feature is complete.
  - Per‑task branches: only when risk/parallelization requires; merge task → feature, then proceed as above.
- ROADMAP update (feature complete only): mark the feature as done in `docs/ROADMAP.md`.
- State update in `docs/agents/state.json`:
  - Task approved (more tasks remain): set `current_role=PLANNER`, `state=handoff`; in `msg`, include the next task title/slug and instruction to overwrite `docs/current/design.md` for the next task.
  - Feature complete (no tasks remain): perform final merges and roadmap update, delete `docs/current/`, then reset to defaults (see `STATE.md#Defaults`).

## Git Responsibilities

- Own merges and cleanup:
  - Task branch (if used) → feature branch; delete merged task branches when clean.
  - Feature branch → default on feature completion (fast‑forward/PR per repo norms).
- Resolve merge conflicts in coordination with the Coder; Coder supplies fixes on the working branch.
- Maintain hygiene: delete `docs/current/` on feature completion; update roadmap; reset state to defaults.
- Avoid force‑push to shared branches; prefer small, reviewable diffs.

---

## Review Flow

1. **Prep** — read design.md, open diffs, skim structure rules.
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
- Policy files (structure.rules.json, commands.json, tech_stack.json, quick.config.json) are up-to-date; consult the Coder’s `Doc updates needed` notes and the Planner’s spec, then update yourself.
- Tasks: ensure the current task is represented in `docs/current/design.md`; paths and imports respect structure rules.
- Acceptance Criteria: when approving, mark the relevant AC checkboxes as complete in `design.md`.
 - Open Questions: if `design.md` has any Open Questions, block and hand off to Planner to resolve before approval.

4. **Tests vs Acceptance Criteria (pillar #3)**
   - Each AC in `design.md` maps to at least one passing test with a **Scenario ID (Sx)**.
   - Coverage includes **happy, boundary, and negative** cases where applicable.
   - Evidence that tests would fail without the code change (or clear rationale).
5. **Decision** — Approve or fix inline.
   - Task-level (more tasks remain): apply all required fixes (code/tests/deps/docs) directly on the branch until green; merge into the feature branch; set handoff to Planner (Spec) and instruct to overwrite `docs/current/design.md` for the next task in `state.msg` (include next task title/slug).
   - Feature-level (no tasks remain): finish any fixes, merge feature branch to default, update `docs/ROADMAP.md`, delete `docs/current/`, reset `docs/agents/state.json` to defaults.

---

## Task vs Feature Approval

- Approving an individual task (T##): merge changes as appropriate; set handoff to Planner with the next task title/slug and instruction to overwrite `docs/current/design.md`.
- Approving the feature: merge the feature branch into default, update `docs/ROADMAP.md`, delete `docs/current/`, and reset `docs/agents/state.json` to defaults (next role is Planner).

---

## Checklists

### A) Code Review

- [ ] Minimal, readable diffs; no stray files
- [ ] Reasonable validation/error handling; no silent failures
- [ ] No secrets/credentials; `.env.example` updated if needed
- [ ] New/changed deps justified (Dependency Changes Gate) + tech_stack.json updated when applicable

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
 - `docs/current/design.md` contains Open Questions (must be empty before approval)

---

## Fix policy

- Reviewer applies all necessary fixes (code, tests, dependencies, documentation) directly on the task branch; do not hand off to Coder.

---

## Handoff message templates

Reviewer → Planner (next task)

```
[Reviewer] Next task ready: T## — <task title> (by numeric order)
Branch: feat/F###-<feature>
Path: docs/current/design.md (overwrite for next task)
State: handoff → Planner.
Notes: prior task merged; ACs covered per review; include changed paths in commit body.
```

Reviewer → (feature done)

```
[Reviewer] Feature approved. ACs covered.
Merged feat/F###-<feature> → main.
Updated docs/ROADMAP.md, deleted docs/current/, and reset docs/agents/state.json to defaults.
```

## Review — Template

Path: `docs/current/review.md`

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
Quick IO (Reviewer)

- Inputs: tasks index, active task design/coding-notes, diffs vs default, structure.rules.json slice, commands.json results, tech_stack.json when deps change.
- Outputs: `review.md` decision, small fixes if needed, merges per simplified branching, tasks index updates, state handoff.
- Blockers: Boundary Gate failure, insufficient test coverage vs ACs, unapproved dependency/structure change.

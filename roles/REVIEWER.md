# REVIEWER

## Purpose

Final gate before merge. Focus on:

1. **Code review** (clarity, safety, minimal diffs)
2. **Architecture integrity** (aligns with established boundaries & practices)
3. **Tests vs Acceptance Criteria** (adequate coverage of agreed ACs)

## Must-Read (in order)

1. Feature plan: `docs/features/F###-<feature>/plan.md` — ACs + scenario IDs, tasks T##
2. Evidence: `docs/features/F###-<feature>/evidence.md` — reuse targets, files-to-touch, proposals
3. `docs/features/F###-<feature>/coding-notes.md`
4. Diffs (feature branch vs default) via commands in `docs/COMMANDS.md`
5. `docs/STRUCTURE.md` (+ per-package STRUCTURE.md)
6. `docs/TECH_STACK.md`, `docs/COMMANDS.md`, `.env.example` (if touched)

## Outputs (artifacts)

- `docs/features/F###-<feature>/review.md` — concise pass/fail with required fixes & paths
- Doc-only diffs if needed (STRUCTURE/README/TECH_STACK/COMMANDS/.env.example)
- `docs/agents/state.json` updated (approved → `done`, or changes → `Coder`); keep `branch` unchanged

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
- Tasks: confirm tasks T## are represented as sections in plan/evidence; paths and imports respect STRUCTURE rules.
- Acceptance Criteria: when approving, mark the relevant AC checkboxes as complete in `docs/features/F###-<feature>/plan.md`.

4. **Tests vs Acceptance Criteria (pillar #3)**
   - Each AC maps to at least one passing test with a **Scenario ID (Sx)**.
   - Coverage includes **happy, boundary, and negative** cases where applicable.
   - Evidence that tests would fail without the code change (or clear rationale).
5. **Decision** — Approve or request changes. Update artifacts + state, then commit..

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

Reviewer → (done)

```
[Reviewer] Approved. Code clean, boundaries respected, ACs covered (S1–S4).
Docs synced (STRUCTURE/TECH_STACK as noted). ACs checked off in plan. State set to done.
```

## Review — Template

Path: `docs/features/F###-<feature>/review.md`

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

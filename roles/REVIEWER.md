# REVIEWER

## Purpose

Final gate before merge. Focus on:

1. **Code review** (clarity, safety, minimal diffs)
2. **Architecture integrity** (aligns with established boundaries & practices)
3. **Tests vs Acceptance Criteria** (adequate coverage of agreed ACs)

## Must-Read (in order)

1. `../state.json` — confirm `plan_slug`, `current_role=Reviewer`, and the current `branch`
2. `../../implementations/<slug>/plan.md` — ACs + scenario IDs (includes subtask sections inline)
3. `../../implementations/<slug>/evidence.md` — reuse targets, files-to-touch, proposals (subtasks appended inline)
4. `../../implementations/<slug>/coding-notes.md`
5. Diffs (feature branch vs default) via commands in `../../COMMANDS.md`
6. `../../STRUCTURE.md` (+ per-package STRUCTURE.md)
7. `../../TECH_STACK.md`, `../../COMMANDS.md`, `.env.example` (if touched)

## Outputs (artifacts)

- `../../implementations/<slug>/review.md` — concise pass/fail with required fixes & paths
- Doc-only diffs if needed (STRUCTURE/README/TECH_STACK/COMMANDS/.env.example)
- `../state.json` updated (approved → `done`, or changes → `Coder`); keep `branch` unchanged
 - Template: `../templates/review.template.md`

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
  - Public surfaces documented (package `STRUCTURE.md`/`README.md`).
  - Subtask docs: confirm subtask details live inline in plan/evidence (no extra folders/files created for subtasks).
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

- [ ] Imports & placement follow `../../STRUCTURE.md`
- [ ] Reuse targets from Evidence honored (no duplication)
- [ ] Structural changes match an approved Structure Delta
- [ ] Public surfaces documented (`STRUCTURE.md`/`README.md`)

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
Docs synced (STRUCTURE/TECH_STACK as noted). State set to done.
```

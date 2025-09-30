# AGENTS.md

## Must-read (in order)

0. Product context: ../PRD.md
1. Agent state doc: ./STATE.md
2. Agent state: ./state.json (read `plan_slug`, `current_role`, `state`, `msg`)

Note: Paths are relative to this file’s directory (`docs/agents`).

## Assume Role

Assume the `current_role`. Read the relevant role guide found in `roles/<current_role>.md` to understand what your role entails.

## Local AGENTS.md

If an AGENTS.md exists in a package/app, read it after this file; its rules are stricter for that scope.

## Quickstart

- Copy project templates into your docs (adjust as needed):
  - `cp docs/agents/COMMANDS.template.md docs/COMMANDS.md`
  - `cp docs/agents/STRUCTURE.template.md docs/STRUCTURE.md`
  - `cp docs/agents/TECH_STACK.template.md docs/TECH_STACK.md`
- Create your first feature plan (replace <slug>):
  - `mkdir -p docs/implementations/<slug>`
  - `cp docs/agents/templates/plan.template.md docs/implementations/<slug>/plan.md`
  - Optional: `cp docs/agents/templates/evidence.template.md docs/implementations/<slug>/evidence.md`
  - Optional: `cp docs/agents/templates/coding-notes.template.md docs/implementations/<slug>/coding-notes.md`
  - Optional: `cp docs/agents/templates/review.template.md docs/implementations/<slug>/review.md`
- Update agent state (`docs/agents/state.json`): set `plan_slug`, `current_role`, `state`, `branch`, and write a short `msg`.
- Work the roles in order (Planner → Researcher → Coder → Reviewer).

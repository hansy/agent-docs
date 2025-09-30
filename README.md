# Agent Docs (Subtree Package)

Opinionated, role-driven documentation you can pull into any project under `docs/agents` via `git subtree`. This repo is the source of truth; consumer projects import only the `package/` folder, so this README is not imported.

## What You Get (in consumer repo)

- `docs/agents/AGENTS.md` — entrypoint and Quickstart
- `docs/agents/STATE.md` and `docs/agents/state.json` — lifecycle and handoff state
- `docs/agents/roles/` — role guides for Planner, Researcher, Coder, Reviewer
- `docs/agents/templates/` — plan/evidence/coding-notes/review templates
- `docs/agents/*.template.md` — project-level templates for COMMANDS, STRUCTURE, TECH_STACK

## Add To Your Project (once)

```bash
git subtree add --prefix=docs/agents https://github.com/hansy/agent-docs.git main:package --squash
```

## Pull Updates (periodically)

Direct with URL:
```bash
git subtree pull --prefix=docs/agents https://github.com/hansy/agent-docs.git main:package --squash
```

With a remote alias:
```bash
git remote add agent-docs https://github.com/hansy/agent-docs.git
git subtree pull --prefix=docs/agents agent-docs main:package --squash
```

Pin to a tag (when available):
```bash
git subtree pull --prefix=docs/agents agent-docs vX.Y.Z:package --squash
```

Tips:
- Commit local changes before pulling to simplify conflicts.
- Resolve conflicts inside `docs/agents/` then re-run the pull if needed.

## First-Time Setup In Consumer Repo

1) Copy project templates (adjust to your stack):
- `cp docs/agents/COMMANDS.template.md docs/COMMANDS.md`
- `cp docs/agents/STRUCTURE.template.md docs/STRUCTURE.md`
- `cp docs/agents/TECH_STACK.template.md docs/TECH_STACK.md`

2) Create a feature plan (replace <slug>):
- `mkdir -p docs/implementations/<slug>`
- `cp docs/agents/templates/plan.template.md docs/implementations/<slug>/plan.md`
- Optional:
  - `cp docs/agents/templates/evidence.template.md docs/implementations/<slug>/evidence.md`
  - `cp docs/agents/templates/coding-notes.template.md docs/implementations/<slug>/coding-notes.md`
  - `cp docs/agents/templates/review.template.md docs/implementations/<slug>/review.md`

3) Open `docs/agents/AGENTS.md` and follow the role flow.

## Design Notes

- Reuse-first and small-diff discipline across roles.
- Subtasks are documented inline in the main plan/evidence (no extra folders).
- Project-specific docs remain yours; we ship templates to copy, not impose structure.

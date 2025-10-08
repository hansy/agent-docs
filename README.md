# Agent Docs (Subtree Package)

Opinionated, role-driven documentation you can pull into any project under `docs/agents` via `git subtree`. This repo is the source of truth; consumer projects import only the `package/` folder, so this README is not imported.

## What You Get (in consumer repo)

- `docs/COMMANDS.md`, `docs/TECH_STACK.md`, `docs/STRUCTURE.md`, `docs/ROADMAP.md`, `docs/PRD.md`
- `docs/features/` — you create feature artifacts here (templates live in role guides)
- `docs/agents/AGENTS.md` — entrypoint and Quickstart
- `docs/agents/STATE.md` and `docs/agents/state.json` — lifecycle and handoff state
- `docs/agents/roles/` — role guides (Project Manager, Planner, Researcher, Coder, Reviewer) with embedded templates

## Add To Your Project (once)

```bash
git subtree add --prefix=docs/agents https://github.com/hansy/agent-docs.git package --squash
```

The `package` branch mirrors the `package/` directory on `main` via `git subtree split`, so the branch root is ready to graft into your docs; release tags will be cut on this branch so you can reference them directly.

## Pull Updates (periodically)

Direct with URL:

```bash
git subtree pull --prefix=docs/agents https://github.com/hansy/agent-docs.git package --squash
```

With a remote alias:

```bash
git remote add agent-docs https://github.com/hansy/agent-docs.git
git subtree pull --prefix=docs/agents agent-docs package --squash
```

Pin to a tag (when available):

```bash
git subtree pull --prefix=docs/agents agent-docs vX.Y.Z --squash
```

Tips:

- Commit local changes before pulling to simplify conflicts.
- Resolve conflicts inside `docs/agents/` then re-run the pull if needed.

## Sprint Flow

This outlines the end-to-end feature sprint. Agents use their role guides; this section gives the big picture.

1. Intake & Prioritization — Project Manager

- Capture features in `docs/ROADMAP.md` with Feature IDs `F###` and Task IDs `T##`.
- Choose `plan_slug = F###-<feature>` and base branch `feat/F###-<feature>`; set `state.json` to `current_role=Planner`, `state=in_progress`.

2. Planning — Planner

- Short Q&A; write the feature plan: Problem/Outcome, Users, User Stories, ACs, Scenarios.
- Define numbered tasks `T##` with ACs and Scenarios (S1…); add an “Implementation Tasks” checklist.
- Artifact: `docs/features/F###-<feature>/plan.md`.
- Gate: Human spec approval; then set `current_role=Researcher`, `state=handoff` (state.json).

3. Evidence & Mapping — Researcher

- Map reuse targets, files to touch, data/flags/env, third‑party; draft or refine Implementation Tasks per `T##`.
- Artifact: `docs/features/F###-<feature>/evidence.md` (sections per task).
- Gate: Human mapping approval; then set `current_role=Coder`, `state=handoff`.

4. TDD Implementation — Coder (per task T##)

- For each task: mark in progress in the feature plan → write failing tests (with Scenario IDs) → implement minimal code → green.
- Summarize changes; on human micro‑approval, commit on the feature branch.
- Update the task status + one‑line note of changed paths.

5. Review — Reviewer

- Three pillars: Code Review, Architecture Integrity, Tests vs ACs. Approve or request changes.
- Artifact: `docs/features/F###-<feature>/review.md` (doc-only syncs as needed).
- Set `state=done` on approval, else bounce back to Coder with `state=handoff`.

6. Closeout — Project Manager

- Merge, close branch, update roadmap statuses, and reset `docs/agents/state.json` to defaults (see `docs/agents/STATE.md`).

Conventions

- Folders: `docs/features/F###-<feature>/{plan.md,evidence.md,coding-notes.md,review.md}`.
- Branches: default `feat/F###-<feature>`; optional task branch `feat/F###-<feature>--T##-<task>` (for risky/parallel work only).
- IDs: Features `F###`; tasks `T##`. Keep IDs stable; reorder by moving lines in `ROADMAP.md`.

## Design Notes

- Reuse-first and small-diff discipline across roles.
- Tasks are documented inline in the feature plan/evidence (no extra folders by default).
- Project-specific docs remain yours; we ship templates to copy, not impose structure.

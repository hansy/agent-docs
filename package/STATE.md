# Agent State and Handoff Rules

Purpose: Single source of truth for who acts next, lifecycle state, and the short handoff/blocker message.

## Schema

```json
{
  "plan_slug": "<kebab-case>|null",
  "current_role": "Planner|Researcher|Coder|Reviewer",
  "state": "init|in_progress|handoff|blocked|done",
  "branch": "<git-branch>|null",
  "msg": "<<= 12 lines: handoff/blocker note>",
  "last_updated": "ISO-8601 timestamp"
}
```

- plan_slug: null means no active feature (Planner should create/choose one).
- current_role: who should act next.
- state:
  - init — no active work
  - in_progress — current role working
  - handoff — ready for the next role
  - blocked — waiting on answers/approvals
  - done — Reviewer approved
- msg: short human note. No code; include paths and scenario/task IDs only.
- branch: current git branch for the active feature/subtask (Planner sets this).

## Defaults (first run and on plan reset)

```json
{
  "plan_slug": null,
  "current_role": "Planner",
  "state": "init",
  "branch": null,
  "msg": "Initialize a plan: create docs/implementations/<slug>/plan.md.",
  "last_updated": "<NOW>"
}
```

## Switch Rules

- On start: keep current_role as yourself; set state = in_progress.
- Planner sets branch on start: use `(feat|chore|etc)/<slug>` or `(feat|chore|etc)/<slug>/<sub_slug>` for subtasks.
  - Git note: a branch cannot coexist with another branch that treats it as a parent path. Do not create both `feat/<slug>` and `feat/<slug>/<sub_slug>` at the same time. If `feat/<slug>` already exists, prefer a flat name like `feat/<slug>-<sub_slug>`.
- On handoff: set current_role = <next role>, state = handoff, write msg.
- On blocked: keep current_role unchanged; set state = blocked; write precise questions in msg.
- On approval (Reviewer): set state = done; keep current_role = Reviewer.

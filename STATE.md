# Agent State and Handoff Rules

Purpose: Single source of truth for who acts next, lifecycle state, and the short handoff/blocker message.

## Schema

```json
{
  "plan_slug": "<kebab-case>|null",
  "current_role": "Project Manager|Planner|Researcher|Coder|Reviewer",
  "state": "init|in_progress|handoff|blocked|done",
  "branch": "<git-branch>|null",
  "msg": "<<= 12 lines: handoff/blocker note>",
  "last_updated": "ISO-8601 timestamp"
}
```

- plan_slug: null means no active feature (Planner should create/choose one).
- current_role: who should act next.
- state:
  - init — initialization state for agents
  - in_progress — current role working
  - handoff — ready for the next role
  - blocked — waiting on answers/approvals
  - done — Reviewer approved
- msg: short human note. No code; include paths and scenario/task IDs only.
- branch: current git branch for the active feature (Planner sets this). Optional task branches are allowed for risky/parallel work.

## Defaults

```json
{
  "plan_slug": null,
  "current_role": "Project Manager",
  "state": "in_progress",
  "branch": null,
  "msg": "Determine which feature/task should be worked on next",
  "last_updated": "<NOW>"
}
```

## Switch Rules

- On init (first run): current_role MUST be Project Manager; perform Project Manager initialization. After initialization is complete, `init` should never be used again.
- On start: keep current_role as yourself; set state = in_progress.
- Planner sets branch on start: use `(feat|chore|etc)/F###-<feature>`.
  - Optional task branches: `feat/F###-<feature>--T##-<task>` (for risky/parallel work only).
  - Git note: avoid nested refs that conflict with the feature branch path.
- On handoff: set current_role = <next role>, state = handoff, write msg.
- On blocked: set current_role = <role that will unblock you>; set state = blocked; write precise questions in msg.
- On approval (Reviewer): set state = done; set current_role = Project Manager.

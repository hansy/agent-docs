# Agent State and Handoff Rules

Purpose: Single source of truth for who acts next, lifecycle state, and the short handoff/blocker message.

## Schema

```json
{
  "plan_slug": "<kebab-case>|null",
  "current_role": "PLANNER|ARCHITECT|CODER|REVIEWER",
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
  "current_role": "PLANNER",
  "state": "in_progress",
  "branch": null,
  "msg": "Determine which feature/task should be worked on next",
  "last_updated": "<NOW>"
}
```

## Optional fields (backwards-compatible)

- autopilot: "off" | "review_only" | "full" — controls how much automation is allowed (no change if omitted)
- run_id: opaque identifier for an automation run (useful for logs/correlation)
- last_agent: which role or agent acted last (e.g., "CODER")
- ci_status: "unknown" | "green" | "red" — summarizes last checks
- tests_passed: boolean — last test run result
- artifacts: array of paths to run outputs (e.g., brief files, logs)

Notes:
- These fields are optional; agents default to conservative behavior when absent.
- Human-readable state fields above remain the source of truth for lifecycle.

## Switch Rules

- On init (first run): current_role MUST be PLANNER; perform the initialization task (seed COMMANDS/TECH_STACK/STRUCTURE/ROADMAP). After initialization is complete, `init` should never be used again.
- On start: keep current_role as yourself; set state = in_progress.
- Planner owns the feature branch and the first task branch; Reviewer bootstraps subsequent tasks:
  - Feature branch: `(feat|chore|etc)/F###-<feature>` created at kickoff from default.
  - First task branch: `feat/F###-<feature>--T01-<task>` created from the feature branch at kickoff.
  - Subsequent task branches: `feat/F###-<feature>--T##-<task>` created by the Reviewer from the feature branch.
  - Git note: avoid nested refs that conflict with the feature branch path.
- On handoff: set current_role = <next role>, state = handoff, write msg.
- On blocked: set current_role = <role that will unblock you>; set state = blocked; write precise questions in msg.
- On task approval (Reviewer):
  - If more tasks remain: merge the task branch into the feature branch; select next task by number order; create the next task branch and folder; set `current_role = ARCHITECT`, `state = handoff`; include next `T##` and paths in `msg`.
  - If no tasks remain (feature complete): proceed to feature approval flow below.
- On feature approval (all tasks done): Reviewer merges the feature branch into default, updates `docs/ROADMAP.md`, and resets `docs/agents/state.json` to the defaults below. After reset, `current_role = PLANNER` and `state = in_progress`.

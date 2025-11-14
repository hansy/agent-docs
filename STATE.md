# Agent State and Handoff Rules

Purpose: Single source of truth for who acts next, lifecycle state, and the short handoff/blocker message.

## Schema

```json
{
  "plan_slug": "<kebab-case>|null",
  "current_role": "PLANNER|CODER|REVIEWER",
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
  "autopilot": "off",
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

- On init (first run): current_role MUST be PLANNER; perform the initialization task (seed roadmap and policy files). After initialization is complete, `init` should never be used again.
- On start: keep current_role as yourself; set state = in_progress.
- Branching defaults: use a single feature branch by default; per‑task branches are optional and reserved for risky or parallel work.
  - Feature branch: `(feat|chore|etc)/F###-<feature>` from default.
  - Per‑task branches: `feat/F###-<feature>--T##-<task>` only when risk dictates or parallelization is needed.
  - Keep diffs small; prefer stacked commits on the feature branch for routine tasks.
- On handoff: set current_role = <next role>, state = handoff, write msg.
- On blocked: set current_role = <role that will unblock you>; set state = blocked; write precise questions in msg.
- On task approval (Reviewer):
  - If more tasks remain: merge or fast‑forward as appropriate to the feature branch; select next task by number order; set `current_role = PLANNER`, `state = handoff`; include next task title/slug and paths in `msg`. Create per‑task branch only if risk dictates.
  - If no tasks remain (feature complete): proceed to feature approval flow below.
- On feature approval (all tasks done): Reviewer merges the feature branch into default, updates `docs/ROADMAP.md`, and resets `docs/agents/state.json` to the defaults below. After reset, `current_role = PLANNER` and `state = in_progress`.
  - Cleanup: delete the ephemeral docs folder `docs/current/`.

## Autopilot semantics

`autopilot` controls how much automation is allowed:

- off (default): agents always request human approval before committing or merging.
- review_only: agents may open PRs automatically when checks pass; merging requires human approval.
- full: agents may commit/merge when checks and gates pass; agents must still post a concise summary (≤12 lines).

If `autopilot` is absent, treat it as `off`.

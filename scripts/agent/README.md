# agent-core (internal helpers)

Tiny stdlib-only helpers for agents to operate this workflow safely without reading large docs.

Exports (CommonJS) from `scripts/agent/core.js`:

- IO
  - `loadState()` / `saveState(next)` — auto-detect `docs/agents/state.json` or `state.json`.
  - `loadCommands()` — reads `commands.json`.
  - `loadStructureRules()` — reads `structure.rules.json`.
  - `loadQuickConfig()` — reads `quick.config.json`.
  - `loadTechStack()` — reads `tech_stack.json` if present.

- Structure
  - `moduleForPath(file, rules)` — map a path to its module by `root`.
  - `enforceBoundaries(changedFiles, rules)` — fail on disallowed cross-module imports.

- Quick Mode
  - `countAddedLinesFromPatch(unifiedPatch)` — counts `+` lines (excl. headers).
  - `quickGateFromMetrics(metrics, cfg)` — apply quick.config limits and escalations.

- Checks
  - `runCommand(cmd, opts)` — shell out; returns `{ok, code, stdout, stderr}`.
  - `runChecks(commands, opts)` — runs `lint`, `typecheck`, `test` (when defined).

- Briefs
  - `generateBrief({ role, planSlug, files, modules, includeCommands })` — small text brief with structure slice and commands.

Notes

- This library is for agents; there is no user-facing CLI.
- JSON twins are authoritative for agents: `structure.rules.json`, `commands.json`, `tech_stack.json`.
- Keep diffs small. Use `enforceBoundaries` and `quickGateFromMetrics` before running checks.


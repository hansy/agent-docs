# RESEARCHER

## Purpose

Turn the non-technical plan into a concrete evidence map: what to reuse, where to work, and — only if necessary — what minimal structure to add. No code.

## Must-Read (in order)

2. docs/features/F###-<feature>/plan.md
3. docs/STRUCTURE.md + per-package STRUCTURE.md
4. docs/TECH_STACK.md, docs/COMMANDS.md
5. Workspace manifests: root & packages (package.json), pnpm-workspace.yaml, tsconfig\*, turbo.json, env examples, migrations/

## Outputs (artifacts)

- `docs/features/F###-<feature>/evidence.md` (template below; one file with sections per task T##)
- (Optional) Structure Delta Proposal section inside `evidence.md`
- `docs/agents/state.json` updated (handoff to Coder, or to Reviewer if proposing)

## Do

- Map exact files/folders involved (each with 1–2 line purpose)
- Surface reuse: functions/classes/types with file:line hints
- Data touchpoints: tables/models/migrations; notable RLS/policies
- Config/flags/env: flags, env vars, rate limits, configs
- Third-party: what exists and whether it fits (MUST REUSE / SHOULD CONSIDER / AVOID)
- Acceptance Criteria/tests: propose additions or edits in `docs/features/F###-<feature>/plan.md` when gaps exist; get explicit human approval before saving. Call out accepted changes (e.g., “AC3 added for timeout — approved by <name>”) in your handoff note.
- Use the Planner’s branch for all commits. When Planner selects a task, they create a task branch:
  - `feat/F###-<feature>--T##-<task>` (from `feat/F###-<feature>`). Work on that branch.
- When approved by human, update `docs/agents/state.json` first, then commit.

## Don’t

- No product code, tests, or migrations
- No architecture changes by fiat; proposals only
- No new deps installed (justify if proposing)

## Blocking Criteria

- Plan lacks user stories or scenarios
- Conflicting code surfaces require product input
- New dependency likely, but license/security/size/runtime undecided

---

## Evidence Report — Template

Create/overwrite: `docs/features/F###-<feature>/evidence.md`
Use the template below.

```md
# Evidence — <Feature Title> (slug: <slug>)

Date: YYYY-MM-DD • Researcher

### 1) Repo landmarks (where to look, why)

- apps/web/app/(route) — serves <flow>; likely entry for S1
- packages/core/payout.ts — pure domain; candidate: computePayout()
- packages/api/settle/route.ts — HTTP entry; validation & auth

### 2) Symbol reuse candidates

- packages/core/payout.ts L12–L58 — `computePayout(input): number`
- packages/api/validate.ts L5–L30 — `validateAmount(x)`
- apps/web/app/(auth)/session.ts L8–L24 — `getSession()`

### 3) Data & migrations

- packages/db/schema/settlements.ts — table: settlements
- 2024_12_01_add_settlements.sql — adds idx (user_id, event_id)

### 4) Config, flags, env

- `FEATURE_FLAGS.settlement` (config/flags.ts)
- ENV: `RATE_LIMIT_LOGIN` (apps/api/.env.example)

### 5) Third-party (current)

- Stripe — payments via packages/api/payments/stripe.ts
- OpenTelemetry — tracing in api & worker

### 6) Gaps / constraints

- No retry policy on settlement failures (risk: duplicate writes)
- UI lacks loading/error pattern for this flow

### 7) Recommendations

**MUST REUSE** — computePayout(), validateAmount()  
**SHOULD CONSIDER** — RateLimiter middleware  
**AVOID** — new payout library (core is sufficient)

### 8) Optional new dependency (only if truly necessary)

- lib Y vZ — MIT; ~6kb; SSR-safe; reason: validate address
- Risk/alt: native regex sufficient for MVP → defer

### 9) Files to touch (expected)

- apps/web/app/api/settle/route.ts — POST handler uses core
- packages/core/payout.ts — reuse only
- **tests**/api/settle.test.ts — Tester places failing tests here

### 10) Test → Code map

- S1 — route 200; asserts amount; calls computePayout
- S2 — 400 via validateAmount
- S3 — unauthorized via session guard

### 11) Open questions

- Should settlement write be idempotent (user_id+event_id)?
- Confirm max stake applies.

---

## Structure Delta Proposal (include only if needed) — REQUIRES APPROVAL

Reason: <why reuse/extension isn’t sufficient>  
Options: <A reuse / B extend / C new module> (pros/cons)  
Chosen: <A|B|C> — justify in 2–3 lines

New paths:

- packages/<new-module>/{README.md,STRUCTURE.md,index.ts}

Public surface (outline):

- export function <name>(…): <result> // one-line purpose

Docs to update:

- docs/STRUCTURE.md → add module & import rules

Impact & risk:

- Ownership: <team/area> • Rollback: delete module, revert docs
```

## Handoff msg templates (≤12 lines)

Researcher → Coder

```
[Researcher] Evidence ready: docs/features/F###-<feature>/evidence.md
Reuse: packages/core/foo.ts#bar(), packages/api/validate.ts#...
Files to touch (expected): …
No new deps/structure proposed.
Start with T01 (S1,S2). Boundaries per docs/STRUCTURE.md.
```

Researcher → Reviewer (proposal)

```
[Researcher] PROPOSAL: Structure Delta (see Evidence §Proposal)
Reason: <2–3 lines>. Update docs/STRUCTURE.md if approved.
Please approve before coding.
```

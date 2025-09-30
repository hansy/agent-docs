# Evidence — <Feature Title> (slug: <slug>)

Date: YYYY-MM-DD • Researcher: <name>

### 1) Repo landmarks (where to look, why)

- apps/web/app/(route) — serves <flow>; likely entry for S1
- packages/core/<file> — pure domain; candidate: <fn>()
- packages/api/<route>.ts — HTTP entry; validation & auth

### 2) Symbol reuse candidates

- packages/core/<file> Lx–Ly — `<fn>(input): result`
- packages/api/<file> Lx–Ly — `<fn>(x)`
- apps/web/<file> Lx–Ly — `<fn>()`

### 3) Data & migrations

- packages/db/schema/<table>.ts — table: <name>
- <YYYY_MM_DD>_add_<name>.sql — adds idx (<cols>)

### 4) Config, flags, env

- `FEATURE_FLAGS.<name>` (config/flags.ts)
- ENV: `<KEY>` (apps/api/.env.example)

### 5) Third-party (current)

- <Service/Library> — usage context

### 6) Gaps / constraints

- Gap 1 …
- Gap 2 …

### 7) Recommendations

MUST REUSE — <fn1>(), <fn2>()  
SHOULD CONSIDER — <module/middleware>  
AVOID — <library> (reason)

### 8) Optional new dependency (only if truly necessary)

- lib Y vZ — license; size; SSR-safe? reason: …
- Risk/alt: …

### 9) Files to touch (expected)

- <path> — <purpose>
- tests/<path>.test.ts — failing tests first (Tester)

### 10) Test → Code map

- S1 — <expected path/behavior>
- S2 — …
- S3 — …

### 11) Open questions

- Q1 …
- Q2 …

---

## Structure Delta Proposal (include only if needed) — REQUIRES APPROVAL

Reason: <why reuse/extension isn’t sufficient>  
Options: <A reuse / B extend / C new module> (pros/cons)  
Chosen: <A|B|C> — justify in 2–3 lines

New paths:

- packages/<new-module>/{README.md,STRUCTURE.md,index.ts}

Public surface (outline):

- export function <name>(…): <result> — one-line purpose

Docs to update:

- ../../STRUCTURE.md → add module & import rules

Impact & risk:

- Ownership: <team/area> • Rollback: delete module, revert docs


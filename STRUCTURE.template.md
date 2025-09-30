# STRUCTURE.md — Template (project-level)

Purpose: Define module boundaries and import rules so agents (and humans) don’t create architecture drift.

How to use:
- Copy this file to `docs/STRUCTURE.md` in your project.
- Keep it short; list key areas and a few explicit rules.

Module map (example; edit to match your repo):
- apps/web — Next.js UI; no business logic
- packages/api — API routes/controllers; validation, auth, orchestration
- packages/core — pure domain logic; no framework imports
- packages/db — schema/migrations/data-access helpers
- packages/worker — background jobs; uses core + db

Boundaries (import rules):
- core: may import nothing from web/api/worker; only stdlib and approved utils
- api: may import core and db; must not import web
- web: may import core; must not import api or db directly (use typed client)
- worker: may import core and db; must not import web
- db: must not import web/api/worker/core (except type-only if absolutely needed)

Cross-cutting:
- Env/flags: define in one place (e.g., `config/`); consumers read via helper functions
- Public surfaces: document exported functions/types in package READMEs
- Errors: bubble domain errors, map to HTTP/UI at the edges

Testing guidance:
- Unit tests close to modules (core heavy)
- API/contract tests at api boundary
- UI component tests only for critical interactions

Prohibited without approval (Structure Delta):
- New top-level packages or public APIs
- Introducing framework dependencies into `core`
- Direct DB access from `web`

Review checklist tie-ins:
- Reviewer verifies imports respect these rules
- Any approved deltas must update this file in the same PR


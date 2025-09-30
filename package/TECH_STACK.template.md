# TECH_STACK.md — Template (project-level)

Purpose: Track notable technologies and dependencies with concise rationale.
Location (in your project): `docs/TECH_STACK.md` (not inside `docs/agents`).

How to use this template:
- Copy this file to `docs/TECH_STACK.md` in your project.
- Keep entries short; one line per dependency or technology.
- When adding or changing deps as Coder, update this file and mention it in the commit.

## Format

- Name vX.Y — scope (api|web|worker|shared) — reason (≤12 words); risks/notes if any.

## Examples

- Zod v3 — shared — runtime validation; guards API inputs and worker jobs.
- Prisma v5 — api — SQL access; migrations managed via prisma migrate.
- Stripe v12 — api — payments; webhooks verified; retries idempotent via keys.
- OpenTelemetry — api, worker — tracing; exporter: OTLP HTTP; sampled @ 20%.
- Redis v7 — worker — rate limits + queues; backed by Upstash; TTL defaults.

## Guidelines

- Add an entry for any new dependency or major upgrade.
- Note SSR/edge compatibility for web-facing libs where relevant.
- For optional or proposed deps, mark as “Proposed” and justify briefly.
- If a dep is removed, keep a one-line note under a “Removed” section for 1–2 releases.


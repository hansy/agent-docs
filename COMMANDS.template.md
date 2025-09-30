# COMMANDS.md — Template (project-level)

Purpose: Standardize the common dev/test commands for agents. Copy to `docs/COMMANDS.md` in your project and adjust the right column to match your scripts.

Recommended verbs (keep these names):
- dev — start local dev server(s)
- test — run tests (fast, headless)
- lint — lint sources
- typecheck — static types (if applicable)
- build — production build
- diff — show feature branch diffs vs default
- cov — test coverage (optional)

Examples

Node/TypeScript (pnpm):
- dev: `pnpm dev`
- test: `pnpm test`
- lint: `pnpm lint`
- typecheck: `pnpm typecheck`
- build: `pnpm build`
- diff: `git diff origin/main...HEAD`
- cov: `pnpm test -- --coverage` or `c8 pnpm test`

Python:
- dev: `uvicorn app.main:app --reload`
- test: `pytest -q`
- lint: `ruff check .` or `flake8`
- typecheck: `mypy .`
- build: n/a (or package-specific)
- diff: `git diff origin/main...HEAD`
- cov: `pytest --cov`

Monorepo note:
- If commands differ per package, keep this file at repo root (`docs/COMMANDS.md`) and add package READMEs that forward to local scripts where needed.

Guidelines
- Keep command names stable; change implementations behind them.
- Prefer narrow, package-scoped runs first; then run full suite before handoff/commit.
- Document any nonstandard flags here when relevant.


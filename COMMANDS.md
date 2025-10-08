# Commands (template - replace with actual tech stack)

Recommended verbs:

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

Guidelines

- Keep command names stable; change implementations behind them.
- Prefer narrow, package-scoped runs first; then run full suite before handoff/commit.
- Document any nonstandard flags here when relevant.

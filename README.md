# Agent Docs

Role-driven documentation you can vendor into any repo under `docs/agents` using `git subtree`.

## What’s Included

- `docs/COMMANDS.md`, `docs/TECH_STACK.md`, `docs/STRUCTURE.md`, `docs/ROADMAP.md`, `docs/PRD.md`
- `docs/agents/AGENTS.md`, `docs/agents/STATE.md`, `docs/agents/state.json`
- `docs/agents/roles/` — guides for Planner, Architect, Coder, Reviewer
- `docs/agents/scripts/move-agent-docs.sh` — moves templates into `docs/`

## Install (once per repo)

1. Start from a clean working tree (commit or stash changes).

2. Add the subtree:

```bash
git subtree add --prefix=docs/agents https://github.com/hansy/agent-docs.git main --squash
```

3. Place templates at `docs/` (state + roles stay under `docs/agents/`):

```bash
bash docs/agents/scripts/move-agent-docs.sh
```

Commit the result.

## Update (when new docs are published)

1. Ensure your working tree is clean.

2. Pull updates:

```bash
git subtree pull --prefix=docs/agents https://github.com/hansy/agent-docs.git main --squash
```

3. Re-run the mover to refresh `docs/`, resolve any “skip:” notes, and commit.

## Maintainers (this repo)

- Edit files on `main`, then:

```bash
git add .
git commit -m "docs: update"
git push origin main
```

# AGENTS.md

## Must-read (in order)

1. Product context: docs/PRD.md
2. Agent state docs: docs/agents/STATE.md
3. Agent state: docs/agents/state.json (read `plan_slug`, `current_role`, `state`, `msg`)

## Assume Role

Assume the `current_role`. Read the relevant role guide found in `docs/agents/roles/<current_role>.md` to understand what your role entails.

## Conversation-First & Review (All Roles)

- Before any changes: discuss the upcoming task in chat, ask clarifying questions, and propose your plan/approach. Wait for explicit user approval before creating/modifying files, branches, or `state.json`.
- After you finish: present a concise summary of what changed (paths, rationale, test status). Wait for explicit approval before handing off and committing your work or updating state.

## Local AGENTS.md

If an AGENTS.md exists in a package/app, read it after this file; its rules are stricter for that scope.

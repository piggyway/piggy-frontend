# AGENTS.md

This project's agent instructions live in [CLAUDE.md](CLAUDE.md). Read that file first - it covers the commands, architecture, API layering, auth, styling, and environment variables for this repo.

Repo-specific rules are in `.claude/rules/`:

- `.claude/rules/code-style.md` - function vs arrow declarations, component rules, file and folder naming.
- `.claude/rules/lessons-learned.md` - anti-patterns (reuse components, theme tokens, own your types, verify every usage).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

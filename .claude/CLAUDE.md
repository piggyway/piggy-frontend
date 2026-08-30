# CLAUDE.md

## Rules

### 1. Node / pnpm

This project should use pnpm command first, fallback to npm.

nvm lazy-loading is broken in non-interactive shells. Use this prefix before any node/pnpm/npx command:

```bash
unset -f node npm npx pnpm 2>/dev/null; export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH"
```

Example:

```bash
unset -f node npm npx pnpm 2>/dev/null; export PATH="$HOME/.nvm/versions/node/v24.15.0/bin:$PATH" && command pnpm lint
```

### 2. After editing the code, run `pnpm run lint` and `pnpm run format` on only changed files, keeping other files unchanged. Do not run build command unless I tell you.

### 3. Global rules say no comments should be added, but in this repository, proper documents need to be added, but don't add too much comments.

### 4. Do not write any tests unless I tell you.

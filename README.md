# Piggyway Frontend

The Piggy Way Crossing storefront is built with Next.js, React, TypeScript,
Tailwind CSS, and Storybook.

## Package manager

Use `pnpm` for every frontend dependency install and script.

- Canonical package manager: `pnpm`
- Canonical lockfile: `pnpm-lock.yaml`
- Do not use npm, Yarn, or Bun to install frontend dependencies.

## Clean checkout setup

From the repository root, install the exact dependency versions recorded in the
lockfile:

```bash
pnpm install --frozen-lockfile
```

## Staging CI quality checks

Developers and CI run the same checks, in this order:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
```

These commands cover:

- ESLint code-quality checks
- TypeScript type checking
- Prettier formatting checks
- Vitest unit tests

## Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Storybook

Run Storybook locally:

```bash
pnpm storybook
```

Build Storybook:

```bash
pnpm build-storybook
```

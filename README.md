# piggy-frontend

Storefront for **Piggy Way Crossing**, a guinea pig and rabbit e-commerce site (piggyway.com.au).
It also covers the boarding service, pet care guides, and the customer account area.

The app is a BFF: routes under `app/api/**` forward to the separate backend service at `https://api.piggyway.com.au`, which sits in front of the Directus CMS.
The browser never talks to the backend or the CMS directly.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 with tokens in `app/globals.css`; Outfit via `next/font`
- NextAuth v4 (Google OAuth and email credentials), Stripe checkout, Cloudflare Turnstile
- Storybook plus Vitest in browser mode (Playwright) for story tests
- Deployed to Cloudflare Workers with `@opennextjs/cloudflare`

## Prerequisites

- Node.js 24 and pnpm 11 (`packageManager` in `package.json` pins the pnpm version)
- Access to the backend API, or a local backend on `http://localhost:3000`
- `npx wrangler login` if you plan to deploy

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`. `.env.example` lists every variable the app reads: the backend base URLs, Stripe keys, NextAuth and Google OAuth secrets, the Turnstile site key, the draft `PREVIEW_SECRET`, and `INTERNAL_PROXY_SECRET` (must match the backend).

## Commands

```bash
pnpm dev            # dev server on http://localhost:3000
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm format         # prettier --write .
pnpm test           # vitest run --project unit (non-story unit suite)
pnpm exec vitest    # story tests through Storybook's vitest addon
pnpm storybook      # Storybook on :6006
pnpm build          # next build
pnpm start          # serve the production build locally
pnpm preview        # OpenNext build plus a local Workers preview
```

## Deploy

Production runs on Cloudflare Workers via OpenNext. There is no CI for this Worker - every release is a manual deploy from a developer machine, and merging a branch ships nothing on its own.

Do **not** run a bare `pnpm deploy`. `next build` loads `.env.local`, so a bare run bakes your local test Stripe and Turnstile keys into the client bundle. Use the full command with production env overrides from [docs/cloudflare-deploy.md](docs/cloudflare-deploy.md) section 2.1, which also covers Worker secrets and custom domains.

The R2 incremental cache is optional and currently disabled: `open-next.config.ts` calls `defineCloudflareConfig({})` with the R2 override commented out. Section 5 of the deploy doc explains how to turn it on.

`Dockerfile` and `docker-compose.yml` are left over from the earlier container deploy. They are local or fallback only, not the production path.

## More docs

- [docs/cloudflare-deploy.md](docs/cloudflare-deploy.md) - deploy runbook
- `CLAUDE.md` - architecture, API layering, auth, and styling notes for contributors and agents
- `.claude/rules/` - code style and lessons learned

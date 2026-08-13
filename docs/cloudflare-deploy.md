# Deploy piggy-frontend to Cloudflare Workers (OpenNext)

## Architecture

- Next.js 16 App Router
- Adapter: `@opennextjs/cloudflare`
- Deploy target: Cloudflare Workers + Assets

## Prerequisites

1. Cloudflare account, Zone for `piggyway.com.au` already on CF
2. Backend API URL (Workers or temporary Railway)
3. `pnpm` + `npx wrangler login`

## 1. Install

```bash
pnpm install
```

## 2. Environment variables

Local Next dev continues to use `.env.local`.

For Workers production, set secrets / vars in the dashboard or via wrangler:

| Name | Notes |
|------|--------|
| `API_BASE_URL` | Server-side BFF → backend |
| `STRIPE_SECRET_KEY` | Server only |
| `NEXTAUTH_SECRET` | Required |
| `NEXTAUTH_URL` | Public site URL e.g. `https://piggyway.com.au` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth |
| `NEXT_PUBLIC_API_BASE_URL` | Build-time public API base |
| `NEXT_PUBLIC_APP_URL` | Public site URL |
| `NEXT_PUBLIC_APP_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | SEO canonical |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile |

`NEXT_PUBLIC_*` must be available at **build** time for `opennextjs-cloudflare build`.

Example:

```bash
export NEXT_PUBLIC_APP_URL=https://piggyway.com.au
export NEXT_PUBLIC_API_BASE_URL=https://api.piggyway.com.au
export NEXT_PUBLIC_APP_ENV=production
# ...then
pnpm deploy
```

Or configure CI (GitHub Actions / Cloudflare Builds) with these env vars.

## 2.1 Workers Builds commands

Production already uses OpenNext. Preview / non-production branches must too.
`pnpm run build` is `next build` and does not emit `.open-next/worker.js`.

| Environment | Build command | Deploy command |
|-------------|---------------|----------------|
| Production (`production` branch) | `npx opennextjs-cloudflare build` | `npx wrangler deploy` |
| Preview (all other branches) | `npx opennextjs-cloudflare build` | `npx wrangler versions upload` |

Set these in Workers -> piggy-frontend -> Settings -> Build.
Workers Builds ignores `wrangler.jsonc` custom `build.command`.

## 3. Preview locally on workerd

```bash
pnpm preview
```

## 4. Deploy

```bash
pnpm deploy
```

## 5. Custom domain

Workers → piggy-frontend → Custom Domains → `piggyway.com.au` / `www`.

Update Google OAuth redirect URIs to the new domain.

## 6. Optional R2 incremental cache

1. Create R2 bucket `piggy-frontend-next-cache`
2. Uncomment `r2_buckets` in `wrangler.jsonc`
3. Wire `r2IncrementalCache` in `open-next.config.ts`

## Docker note

`Dockerfile` remains for local / fallback. Production path is OpenNext + wrangler.

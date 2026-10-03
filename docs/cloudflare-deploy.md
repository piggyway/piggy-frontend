# Deploy piggy-frontend to Cloudflare Workers (OpenNext)

## Architecture

- Next.js 16 App Router
- Adapter: `@opennextjs/cloudflare`
- Deploy target: Cloudflare Workers + Assets

## Prerequisites

1. Cloudflare account, Zone for `piggyway.com.au` already on CF
2. Backend API URL: `https://api.piggyway.com.au` (Cloudflare Workers)
3. `pnpm` + `npx wrangler login`

## 1. Install

```bash
pnpm install
```

## 2. Environment variables

Local Next dev continues to use `.env.local`.

For Workers production, set secrets / vars in the dashboard or via wrangler:

| Name                                        | Notes                                          |
| ------------------------------------------- | ---------------------------------------------- |
| `API_BASE_URL`                              | Server-side BFF → backend                      |
| `STRIPE_SECRET_KEY`                         | Server only                                    |
| `NEXTAUTH_SECRET`                           | Required                                       |
| `NEXTAUTH_URL`                              | Public site URL e.g. `https://piggyway.com.au` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth                                          |
| `NEXT_PUBLIC_API_BASE_URL`                  | Build-time public API base                     |
| `NEXT_PUBLIC_APP_URL`                       | Public site URL                                |
| `NEXT_PUBLIC_APP_ENV`                       | `production`                                   |
| `NEXT_PUBLIC_SITE_URL`                      | SEO canonical                                  |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`        | Stripe.js                                      |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`            | Turnstile                                      |
| `NEXT_PUBLIC_SENTRY_DSN`                    | Sentry browser error reporting                 |

`NEXT_PUBLIC_*` must be available at **build** time for `opennextjs-cloudflare build`.

See section 2.1 for how a merge to `production` supplies these values.

## 2.1 Production deploy

A merge to `production` starts a Cloudflare Workers Builds run.
The production trigger runs `npx opennextjs-cloudflare build`.
The same trigger then runs `npx wrangler deploy`.
`NEXT_PUBLIC_*` values are build variables on the production trigger.
The build inlines those values into the client bundle.

### Manual local deploy

A manual local deploy can leak local test Stripe and Turnstile keys into the bundle.
`pnpm deploy` runs `opennextjs-cloudflare build`, which runs `next build`.
`next build` loads `.env.local` for a production build too.
Without the overrides below, the bundle ships the values from `.env.local`.
The client bundle keeps those values.
A dashboard change does not replace them.
Pass the full override list on one line:

```bash
NEXT_PUBLIC_APP_URL=https://piggyway.com.au \
NEXT_PUBLIC_SITE_URL=https://piggyway.com.au \
NEXT_PUBLIC_API_BASE_URL=https://api.piggyway.com.au \
API_BASE_URL=https://api.piggyway.com.au \
NEXT_PUBLIC_APP_ENV=production \
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<live pk_live key> \
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACHGAxAJo1ZMu2Ck \
NEXT_PUBLIC_SENTRY_DSN=https://bac8941b740d8ed8c7a52f3b29c61b37@o4511997734486016.ingest.us.sentry.io/4511999009554432 \
pnpm deploy
```

Substitute the real `pk_live_...` key for `<live pk_live key>`; it is not kept
in this repo.

### After deploying

1. Load `https://piggyway.com.au` and confirm the page renders from the new
   version.
2. Open a product page, go to checkout, and confirm the Stripe Payment Element
   mounts with a live key (no "test mode" badge).
3. Submit the contact form once to confirm Turnstile validates.

### Workers Builds settings

Workers Builds ignores a custom `build.command` in `wrangler.jsonc`.
Set the commands under Workers, piggy-frontend, Settings, Build.

| Environment                      | Build command                     | Deploy command                 |
| -------------------------------- | --------------------------------- | ------------------------------ |
| Production (`production` branch) | `npx opennextjs-cloudflare build` | `npx wrangler deploy`          |
| Preview (all other branches)     | `npx opennextjs-cloudflare build` | `npx wrangler versions upload` |

`pnpm run build` is plain `next build`.
That command does not emit `.open-next/worker.js`.

## 2.2 What a deploy does and does not affect

A deploy is only needed for code and for data that is baked in at build time.

- **Product detail pages** (`app/(shop)/shop/[category]/[slug]/page.tsx`) declare
  neither `generateStaticParams` nor `revalidate`, so they fetch product and
  category data on every request. Editing that content in Directus shows up
  immediately - no redeploy, no cache purge.
- **Prerendered routes** do bake data in. `app/(shop)/page.tsx`,
  `app/(shop)/shop/page.tsx` and `app/sitemap.ts` set `revalidate = 3600`, so
  their content refreshes within an hour on its own; a deploy just resets that
  clock sooner.
- **Anything under `NEXT_PUBLIC_*`** is inlined into the bundle at build time and
  only changes with a new deploy.

## 3. Preview locally on workerd

```bash
pnpm preview
```

## 4. Custom domain

Workers → piggy-frontend → Custom Domains → `piggyway.com.au` / `www`.

Update Google OAuth redirect URIs to the new domain.

## 5. R2 incremental cache and revalidation queue (required)

`open-next.config.ts` wires `r2IncrementalCache` and `wrangler.jsonc` binds
`NEXT_INC_CACHE_R2_BUCKET`, so the bucket must exist before the first deploy.
Without it Next has nowhere to keep its fetch cache, every `next: { revalidate }`
is ignored, and server renders hit the backend on every request.

`open-next.config.ts` also wires `memoryQueue`, which is what actually refreshes
a stale ISR page. It calls the route back through the `WORKER_SELF_REFERENCE`
service binding in `wrangler.jsonc`, so that binding must stay in place -
without a real queue the Worker logs `Failed to revalidate stale page` and
pages keep serving stale HTML.

```bash
npx wrangler r2 bucket create piggyway-frontend-inc-cache
```

## Docker note

`Dockerfile` remains for local / fallback. Production path is OpenNext + wrangler.

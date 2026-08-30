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

See section 2.1 for the exact command used for production.

## 2.1 Production deploy is manual (no CI)

There is **no CI for this Worker**. The `piggy-frontend` Worker has zero Workers
Builds runs, and no GitHub Actions workflow deploys it. Every production release
so far has been a manual `pnpm deploy` from a developer machine. Merging to
`production` does not ship anything by itself.

### The command

> **Warning**
> `pnpm deploy` runs `opennextjs-cloudflare build`, which runs `next build`, and
> `next build` loads `.env.local` even for a production build. If you run it
> without the overrides below, the deployed bundle ships whatever is in your
> `.env.local` - in practice the **TEST** Stripe publishable key and the test
> Turnstile site key. Those are baked into the client bundle at build time and
> cannot be fixed from the dashboard afterwards. Always pass the full override
> list on one line:

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

### If CI is set up later

`pnpm run build` is plain `next build` and does not emit `.open-next/worker.js`,
so a CI build must use the OpenNext build. Workers Builds ignores a custom
`build.command` in `wrangler.jsonc`, so the commands have to be set in
Workers -> piggy-frontend -> Settings -> Build:

| Environment                      | Build command                     | Deploy command                 |
| -------------------------------- | --------------------------------- | ------------------------------ |
| Production (`production` branch) | `npx opennextjs-cloudflare build` | `npx wrangler deploy`          |
| Preview (all other branches)     | `npx opennextjs-cloudflare build` | `npx wrangler versions upload` |

CI would also need every `NEXT_PUBLIC_*` value above configured as a build
variable, for the same build-time-inlining reason.

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

## 5. Optional R2 incremental cache

1. Create R2 bucket `piggy-frontend-next-cache`
2. Uncomment `r2_buckets` in `wrangler.jsonc`
3. Wire `r2IncrementalCache` in `open-next.config.ts`

## Docker note

`Dockerfile` remains for local / fallback. Production path is OpenNext + wrangler.

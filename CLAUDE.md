# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Read these `.claude/` rules first — they apply to this repo and are not repeated here:**
>
> - `.claude/rules/code-style.md` — function vs arrow declarations, component rules, file/folder naming.
> - `.claude/rules/lessons-learned.md` — anti-patterns (reuse components, theme tokens, own your types, verify every usage).
>
> `AGENTS.md` at the repo root points back to this file; it holds no separate instructions.

## Commands

```bash
pnpm dev                 # next dev (http://localhost:3000) — pnpm is the package manager
pnpm build               # next build (next.config.ts sets output: "standalone")
pnpm start               # serve the production build locally
pnpm lint                # eslint (eslint-config-next, flat config in eslint.config.mjs)
pnpm typecheck           # tsc --noEmit
pnpm format              # prettier --write .
pnpm format:check        # prettier --check .
pnpm storybook           # storybook dev on :6006
pnpm preview             # opennextjs-cloudflare build + local Workers preview
pnpm deploy              # opennextjs-cloudflare build + deploy (see the warning below)
```

Production runs on **Cloudflare Workers** via `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.jsonc`), not as a container. There is no CI for the Worker - every release is a manual deploy from a developer machine, and a bare `pnpm deploy` bakes your local `.env.local` (test Stripe and Turnstile keys) into the client bundle. Always use the full command with production overrides in [docs/cloudflare-deploy.md](docs/cloudflare-deploy.md) section 2.1. The R2 incremental cache is **optional and currently disabled** - `open-next.config.ts` calls `defineCloudflareConfig({})` with the R2 override commented out.

Tests are **story-based**: Vitest in browser mode via Playwright, wired through Storybook's `@storybook/addon-vitest` (`vitest.config.ts` reads `.storybook`). The `test` script (`pnpm test`) runs `vitest run --project unit`, which covers the non-story unit suite only. Run the story tests with `pnpm exec vitest` (`run <file>` for a single story/file). Components ship with `*.stories.tsx` next to them.

## Architecture

Next.js 16 App Router + React 19, TypeScript strict, Tailwind v4. `@/*` aliases the repo root. Guinea pig / rabbit e-commerce storefront ("Piggy Way Crossing").

The layering is: Pages/components → `lib/services/` → `lib/api/client.ts` → `app/api/**/route.ts` → external backend. UI never calls `fetch` or the backend directly — it imports a service.

### The API routes are a BFF proxy to an EXTERNAL backend

`app/api/**/route.ts` do **not** contain business logic — they forward to a separate backend service at `${API_BASE_URL}/api/v1/...` (e.g. `app/api/products/route.ts` → `${API_BASE_URL}/api/v1/products`), attaching server-side credentials and hiding the backend URL from the browser. snake_case → camelCase mapping happens in `lib/services/` (e.g. `ProductService.transformProductDetail`), not in the route handlers. `lib/api/endpoints.ts` is the single registry of internal `/api/*` paths; `lib/services/index.ts` only re-exports a few services, so import service files directly.

There is **no Directus SDK in the frontend** and no `lib/directus/`. Directus is the upstream CMS behind that external backend; it only touches the frontend through draft/preview mode (below).

### Two client fetch paths (`lib/api/client.ts`)

- `apiClient.{get,post,put,delete,patch}` → `apiFetch`: plain JSON wrapper, throws `Error(data.error)` on non-2xx. Used by services for public data.
- `fetchWithAuth`: attaches `Authorization: Bearer <access_token>` (from `localStorage`) and an `X-Session-Id` (a `localStorage` UUID for **guest carts**). On 401 it calls `refreshTokens()` once and retries; if refresh fails it signs out — redirecting to `/login` only on protected paths (`/account`, `/checkout`, `/cart`).

### Auth & session

NextAuth v4. `authOptions` is defined **inline in `app/api/auth/[...nextauth]/route.ts`** (not a separate `lib/auth.ts`), with two providers: Google OAuth and a `CredentialsProvider` (id `"email"`) for email login. Both exchange with the backend (`/api/v1/auth/sso`, `/api/v1/auth/refresh`) and stash the backend access/refresh tokens onto the JWT in the `jwt` callback; the `session` callback copies them back onto `session.accessToken`/`session.refreshToken` (via `as any`, no module augmentation). The JWT auto-refreshes within 5 min of expiry. Separately, `fetchWithAuth` in `lib/api/client.ts` refreshes once on a 401 and retries; if refresh fails it signs out. `app/providers.tsx` wraps the tree in `SessionProvider` → `UserProvider` (`contexts/UserContext.tsx`, client user state). Root `app/layout.tsx` mounts `Providers` + the `sonner` `<Toaster>`.

### Routing & layouts

Storefront pages live in the `app/(shop)/` route group; `app/login/` and `app/api/` are outside it. `app/(shop)/layout.tsx` wraps pages in `CartProvider` (`components/features/cart/CartProvider`) and renders `Header`/`Footer` from `components/common/`. Component layers: `components/common/` (Header, Footer, UserButton) and `components/features/<domain>/` (homepage, cart, checkout, product-detail, account, boarding, ...) compose `components/ui/` shadcn primitives. Page-specific section components live under the feature folder for that page (e.g. `components/features/homepage/*Section.tsx`).

### Draft / live preview

`app/api/draft/route.ts` enables Next `draftMode()` when `?secret=` matches `PREVIEW_SECRET`, looks up the product on the backend with `include_draft=true` + `x-preview-secret`, then redirects to its real URL using `NEXT_PUBLIC_SITE_URL` (not `request.url`, to avoid leaking the internal origin host). Product routes pass `include_draft=true` through to the backend only when draft mode is on. `DELETE /api/draft` disables it.

### Styling

Tailwind v4 (`@tailwindcss/postcss`). Tokens are CSS custom properties in `app/globals.css`, mirrored in `lib/design-tokens/` (colors, radius, spacing, typography) — prefer token classes over arbitrary values. Font: Outfit via `next/font`; body background `#FFFBF5`.

## External services & env

Configure in `.env.local` (template: `.env.example`):

- **Backend** — `API_BASE_URL` (server) / `NEXT_PUBLIC_API_BASE_URL`, plus `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`.
- **Stripe** — `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`lib/stripe.ts`, `app/api/checkout/`).
- **NextAuth** — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
- **Cloudflare Turnstile** — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (form bot protection).
- **Draft preview** — `PREVIEW_SECRET`.

Remote image hosts are allowlisted in `next.config.ts` (`res.cloudinary.com`, `images.unsplash.com`, Figma MCP) — add new hosts there before using them. `Dockerfile` and `docker-compose.yml` are legacy from the container deploy and are not the production path.

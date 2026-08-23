# SEO Audit Report - Piggy Way Crossing Storefront

**Scope:** `/Users/lewisan/Desktop/piggyway/piggy-frontend` (Next.js 16 App Router)  
**Mode:** Audit only (no code changes except this report)  
**Date:** 2026-07-26  
**Baseline:** `seo.md` checklist + live production checks against `https://piggyway.com.au`  
**Note:** Working tree has uncommitted feature work; evidence cites current repo paths/lines. Where production HTML differs from local code, that is called out.

---

## Status of `seo.md` checklist

| Checklist item                        | Status                                                      | Evidence                                                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product detail SSR/SSG with real HTML | **Done**                                                    | `app/(shop)/shop/[category]/[slug]/page.tsx` is an async server page; `h1` + description render via `ProductDetailContent` props in SSR HTML                            |
| Category / listing SSR                | **Done**                                                    | `app/(shop)/shop-all/page.tsx` server-fetches variants; prior CSR-only issue in `.claude/plans/code-review-2026-07-05.md` is fixed                                      |
| Clear URL structure + breadcrumbs     | **Mostly done**                                             | Product paths `/shop/{category}/{slug}`; visual breadcrumbs on PDP; BreadcrumbList JSON-LD present. Categories are query URLs (`/shop-all?category=`) not path segments |
| Per-page title + description          | **Mostly done**                                             | Nearly all `(shop)` routes set metadata; homepage relies on root defaults                                                                                               |
| Canonical URLs                        | **Done** (with gaps)                                        | Product + most static pages set `alternates.canonical`; utility pages correctly omit / use noindex                                                                      |
| Open Graph / Twitter                  | **Partial**                                                 | Root OG + product/twitter strong; many content pages inherit generic share metadata                                                                                     |
| Product JSON-LD                       | **Done**                                                    | Product + Offer/AggregateOffer + availability + currency                                                                                                                |
| BreadcrumbList                        | **Done** on PDP                                             | Product page only                                                                                                                                                       |
| Organization / WebSite schema         | **Done**                                                    | Root layout                                                                                                                                                             |
| `sitemap.xml`                         | **Done (frontend)**                                         | `app/sitemap.ts`; live sitemap includes static + product + category URLs                                                                                                |
| `robots.txt`                          | **Done (hybrid)**                                           | `app/robots.ts` + Cloudflare Managed prepend                                                                                                                            |
| noindex for cart/checkout/account     | **Done**                                                    | Page/layout metadata                                                                                                                                                    |
| `next/image`                          | **Mostly done**                                             | Storefront uses `next/image`; many decorative `alt=""`                                                                                                                  |
| Prefer SSR for SEO pages              | **Done** for catalog; cart/checkout remain CSR (acceptable) |

---

## 1. Verified OK

### Metadata foundation

- Root defaults + title template: `app/layout.tsx:16-40` (`metadataBase`, default title, description, OG image `og_image_yjdd1w.png`, `locale: en_AU`).
- Homepage inherits defaults and sets canonical `/`: `app/(shop)/page.tsx:17-19`. Live title: `Piggy Way Crossing | Guinea Pig & Rabbit Essentials`.
- Product `generateMetadata` sets title, description, absolute canonical, OG images, Twitter `summary_large_image`: `app/(shop)/shop/[category]/[slug]/page.tsx:26-82`. Live example verified for Cool Breeze Liner.
- Shop-all dynamic metadata (category, search noindex, pagination title): `app/(shop)/shop-all/page.tsx:27-93`.
- Static marketing/legal pages generally set `title`, `description`, `canonical` (about, contact, faqs, pet-care, guides, shipping, returns, terms, privacy, boarding, shop).
- Utility noindex:
  - Cart `app/(shop)/cart/page.tsx:4-7`
  - Account `app/(shop)/account/page.tsx:4-7`
  - Checkout layout covers `/checkout`, success, canceled: `app/(shop)/checkout/layout.tsx:8-11`
  - Boarding book `app/(shop)/piggyway-boarding/book/page.tsx:4-8`
  - Login `app/login/page.tsx:4-7`
- Product-not-found metadata is noindex: `app/(shop)/shop/[category]/[slug]/page.tsx:38-42`.
- Search result pages noindex: `app/(shop)/shop-all/page.tsx:74-75`.

### Structured data

- Organization + WebSite (+ SearchAction to `/shop-all?q={search_term_string}`): `app/layout.tsx:50-72`, injected as plain `<script type="application/ld+json">` at `app/layout.tsx:82-93` (SSR-visible; correct vs `next/script`).
- Product JSON-LD with Brand, AggregateOffer/Offer, `priceCurrency`, `availability` InStock/OutOfStock: `app/(shop)/shop/[category]/[slug]/page.tsx:118-167`. Live Cool Breeze Liner shows `AggregateOffer` with `lowPrice`/`highPrice`/`offerCount` and `InStock`.
- BreadcrumbList Home → category → product: `app/(shop)/shop/[category]/[slug]/page.tsx:169-193`.
- Article / CollectionPage / AboutPage / LocalBusiness JSON-LD on content routes (guides, pet-care hub, about-us, boarding).

### robots.txt / sitemap (frontend behavior)

- Frontend robots allow `/`, disallow `/api/` and `/admin/`, declare sitemap: `app/robots.ts:15-27`.
- Live `https://piggyway.com.au/robots.txt` = Cloudflare Managed AI/bot blocklist **plus** appended Next rules and `Sitemap: https://piggyway.com.au/sitemap.xml`.
- Sitemap regenerates hourly, paginates products (page_size 100), includes static paths + product + category URLs: `app/sitemap.ts`.
- Live sitemap contains static routes, 3 product URLs, 3 category query URLs (matches current small catalog).
- Utility routes intentionally omitted from sitemap: `app/sitemap.ts:15-18`.

### Crawlability

- Shop-all server-fetches products before render: `app/(shop)/shop-all/page.tsx:105-117`.
- Homepage categories server-fetched with `next/link`: `components/features/homepage/ShopByCategorySection.tsx:7-15,43-45`.
- Featured picks server-fetched: `components/features/shop/FeaturedPicksSection.tsx:10-14`.
- PDP related products server-fetched: `components/features/product-detail/RelatedProductsSection.tsx:10-24`.
- Pagination uses crawlable `<Link>` when `getHref` provided: `components/ui/pagination.tsx:14-18,85-100`; shop-all builds hrefs in `ShopAllContent.tsx:75-88`.
- Product cards use `next/link` (not click-only divs): `VariantCard.tsx`, `ProductCardClient.tsx`.
- Variant selection uses query params; PDP `generateMetadata` canonical ignores query string (clean product URL) - good dedupe signal.
- Shop layout wraps pages in `<main>`: `app/(shop)/layout.tsx:13`.
- `html lang="en"`: `app/layout.tsx:80`.
- Single-locale site; no hreflang needed today.

### Images (partial)

- PDP main image uses `next/image` + meaningful `alt` + `priority`: `ProductDetailContent.tsx:562-571`.
- Guide/article heroes use `priority` on LCP-ish images (e.g. guides/pet-care article pages).

### Known pending items - live verification

| Pending item (from task brief) | Current status                                                                                                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare-managed robots.txt  | **Confirmed active** - CF prepends managed AI crawler policy; Next.js rules still appended                                                                                                                        |
| www → apex 301                 | **Done** - `https://www.piggyway.com.au/` returns `301` → `https://piggyway.com.au/`                                                                                                                              |
| Sitemap fixes on piggy-backend | **Not owned by backend in current architecture** - sitemap is generated by frontend `app/sitemap.ts` via Product/Category services. No backend sitemap route found. Frontend live sitemap is serving product URLs |

---

## 2. Broken / gaps (with file:line evidence)

### B1. Product URL category segment is not validated (soft duplicate URLs)

`generateMetadata` / page load only use `slug`; `params.category` is ignored. Wrong category still returns 200 with correct canonical.

- Code: `app/(shop)/shop/[category]/[slug]/page.tsx:29-37,85-99`
- Live: `/shop/wrong-category/cool-breeze-liner` → 200, same title, canonical to `/shop/liner/cool-breeze-liner`

**Impact:** Crawl budget waste; risk of soft-404 signals if many bad URLs get linked.

### B2. Listing links encode variant state in query strings (crawl noise)

Local `VariantCard` builds option query params onto PDP links:

```78:80:components/features/shop-all/VariantCard.tsx
  const variantParams = buildVariantSearchParams(variant.optionValues);
  const variantQuery = variantParams.toString();
  const href = `/shop/${variant.category?.slug || "product"}/${variant.productSlug}${variantQuery ? `?${variantQuery}` : ""}`;
```

Production HTML (as of audit) still emits legacy `?variant=<id>` links on `/shop-all`. Either way, many near-duplicate URLs are linked; canonical helps but crawlers still fetch them. PDP also `router.replace`s query on selection (`ProductDetailContent.tsx:152-163`).

### B3. Categories are query-param URLs, not indexable path hubs

`getCategoryUrl` → `/shop-all?category={slug}`: `lib/utils/seo.ts:36-44`. Sitemap emits those query URLs. Works, but weaker than `/shop/{category}` or `/category/{slug}` path hubs from `seo.md` guidance.

### B4. Shop-all H1 does not reflect active category / search

Metadata title changes with category (`Shop {category}`), but visible H1 is always hardcoded "Shop Guinea Pig & Rabbit Essentials": `app/(shop)/shop-all/page.tsx:127-133` vs metadata at `41-47`.

### B5. Weak / mismatched content titles

- `/guides/bunny-starter-kit` title is generic **"Everything You Need to Begin"** and body/OG tags are guinea-pig focused: `app/(shop)/guides/bunny-starter-kit/page.tsx:5-18`. URL says bunny; SERP title is non-descriptive.
- About page document title becomes `About Us - Small Pet Supplies & Care | Piggy Way Crossing` via template, while OG title is `About Us | Piggy Way Crossing`: `app/(shop)/about-us/page.tsx:13-26` + root template `app/layout.tsx:18-20`.

### B6. Incomplete page-level OG/Twitter on several indexable pages

Pages with title/description/canonical but **no page-level `openGraph` / `twitter`** (share cards fall back to site-wide OG; FAQs live Twitter title is still site default "Piggy Way Crossing"):

- `app/(shop)/faqs/page.tsx:10-15`
- `app/(shop)/contact/page.tsx:6-11`
- `app/(shop)/shop/page.tsx:14-19`
- `app/(shop)/shipping-delivery/page.tsx:6-11`
- `app/(shop)/returns-policy/page.tsx:5-9`
- `app/(shop)/terms/page.tsx:4-7`
- `app/(shop)/privacy/page.tsx:4-7`

Shop-all sets Twitter `card: "summary"` without images: `app/(shop)/shop-all/page.tsx:88-92` (weaker than product `summary_large_image`).

Product OG `type` is `"website"` not a product-oriented type: `app/(shop)/shop/[category]/[slug]/page.tsx:70`.

Root layout has OG but no explicit `twitter` block (`app/layout.tsx:24-39`); Next currently derives Twitter tags from OG (live homepage has twitter tags). Explicit config would be safer.

### B7. Product structured data gaps (rich-result robustness)

Present and basically correct, but missing common Google Merchant / Product rich-result fields:

- No `priceValidUntil`
- No per-variant `Offer` list / `sku` per offer (only first variant sku at product level: `page.tsx:137`)
- No `AggregateRating` even when reviews are fetched for UI (`page.tsx:197-201`)
- Boarding `LocalBusiness` lacks `url`, full address, geo, opening hours: `app/(shop)/piggyway-boarding/page.tsx:39-52`
- FAQs page has no `FAQPage` JSON-LD: `app/(shop)/faqs/page.tsx`

### B8. CMS SEO fields unused

Backend docs mention `seo_json`; frontend services/types do not map `seo_description` / SEO title fields into `generateMetadata` (grep shows no `seo_json` / `seoDescription` usage). Product meta falls back to `description` / `subtitle` only: `page.tsx:48-51`.

### B9. Homepage LCP / alt / heading issues

- Hero uses `<h4>` above `<h1>`: `components/features/homepage/HeroSection.tsx:22-27` (invalid hierarchy).
- Hero collage images all `alt=""` and **no `priority`**: `HeroSection.tsx:35-40` onward. Live homepage has many empty alts (~21/38) and only one high-priority image path (boarding banner), so LCP may be a non-hero image.
- Boarding banner correctly uses `priority`: `BoardingBannerSection.tsx` (can steal LCP from hero).

### B10. Semantic HTML gaps (lower severity)

- PDP is `<article>` inside layout `<main>` (good), but shop-all / many pages are bare `<div>` trees without article landmarks.
- Shop-all breadcrumbs are visual only (no BreadcrumbList JSON-LD): `components/features/shop-all/BreadcrumbsNav.tsx`.
- Emoji in shop-all H1 and homepage eyebrow may be fine for brand, but add noise in text extraction: `shop-all/page.tsx:132`, `HeroSection.tsx:23`.

### B11. Old robots disallow of marketing pages - fixed in code, still worth noting

`.claude/plans/code-review-2026-07-05.md:176` warned that `robots.ts` disallowed `/about`, `/pet-care`, `/guides`. **Current code no longer does that** (`app/robots.ts:19-24`). Treat prior note as resolved.

### B12. No `generateStaticParams` / ISR on PDP

Product page has neither `generateStaticParams` nor `revalidate` (unlike homepage/shop `revalidate = 3600`). Still SSR-crawlable, but colder TTFB and no build-time HTML snapshot for all products.

---

## 3. Recommendations (ranked by impact / effort)

### P0 - High impact, low/medium effort

1. **Validate product `category` param** - If `params.category !== product.category.slug`, `permanentRedirect` to canonical path (or `notFound`). Fixes B1. Effort: S. File: `shop/[category]/[slug]/page.tsx`.
2. **Canonical-first listing links** - Link cards to clean `/shop/{cat}/{slug}` without variant query; keep variant state for in-page selection only (or use `rel` + ensure canonical always wins). Reduces B2 crawl noise. Effort: S.
3. **Align shop-all H1 with metadata/category** - Dynamic H1 for category/search. Effort: S. Fixes B4.
4. **Fix bunny-starter-kit title/content alignment** - Descriptive title including "bunny" or "rabbit" (or rename route if content is guinea-pig). Effort: S. Fixes B5.

### P1 - High impact, medium effort

5. **Path-based category URLs** (optional but aligned with `seo.md`) - e.g. `/shop-all/[category]` or `/shop/[category]` listing, 301 from `?category=`. Improves B3 and sitemap quality. Effort: M.
6. **Wire CMS SEO fields** into `generateMetadata` when backend provides `seo_json` / SEO description. Effort: M (needs API contract). Fixes B8.
7. **Enrich Product JSON-LD** - add `priceValidUntil` (policy-based), map reviews to `AggregateRating`/`Review` when data exists, consider `Offer` per variant. Effort: M. Fixes B7.
8. **Homepage LCP pack** - `priority` + descriptive `alt` on the dominant hero tile(s); demote boarding banner priority if it wins LCP; change eyebrow `h4` → `p`. Effort: S-M. Fixes B9.

### P2 - Medium impact, low effort

9. **Page-level OG/Twitter** for faqs, contact, shop, shipping, returns, terms, privacy (reuse page title/description + default or page image). Effort: S. Fixes B6.
10. **FAQPage JSON-LD** on `/faqs`. Effort: S.
11. **Complete LocalBusiness** on boarding (url, streetAddress if public, geo, `image`). Effort: S.
12. **Explicit root `twitter` metadata** mirroring OG. Effort: S.
13. **Shop-all BreadcrumbList JSON-LD** (Home → Shop all → Category). Effort: S.

### P3 - Lower impact / polish

14. Add `revalidate` (and optionally `generateStaticParams`) on PDP for ISR. Effort: M.
15. Prefer `summary_large_image` + OG image on shop-all. Effort: S.
16. Consider `og:type` / product-specific OG fields for PDP shares. Effort: S.
17. hreflang only if/when a second locale ships (`seo.md` §8). No action now.

---

## 4. Per-route metadata matrix (`app/(shop)`)

| Route                     | title/desc     | canonical            | OG             | Twitter           | robots             | JSON-LD              |
| ------------------------- | -------------- | -------------------- | -------------- | ----------------- | ------------------ | -------------------- |
| `/`                       | root defaults  | yes                  | root           | derived           | index              | Org + WebSite        |
| `/shop`                   | yes            | yes                  | inherit        | inherit           | index              | -                    |
| `/shop-all`               | dynamic        | yes (strips q on p1) | yes            | summary w/o image | noindex if `q`     | -                    |
| `/shop/[category]/[slug]` | dynamic        | absolute product URL | yes + images   | large image       | noindex if missing | Product + Breadcrumb |
| `/about-us`               | yes            | yes                  | yes            | inherit           | index              | AboutPage            |
| `/contact`                | yes            | yes                  | inherit        | inherit           | index              | -                    |
| `/faqs`                   | yes            | yes                  | inherit        | inherit           | index              | - (no FAQPage)       |
| `/pet-care` + articles    | yes            | yes                  | yes (articles) | inherit           | index              | Collection/Article   |
| `/guides/*`               | yes            | yes                  | article        | inherit           | index              | Article              |
| `/piggyway-boarding`      | absolute title | yes                  | yes            | inherit           | index              | LocalBusiness        |
| `/piggyway-boarding/book` | yes            | no                   | -              | -                 | **noindex**        | -                    |
| `/shipping-delivery`      | yes            | yes                  | inherit        | inherit           | index              | -                    |
| `/returns-policy`         | yes            | yes                  | inherit        | inherit           | index              | -                    |
| `/terms` `/privacy`       | yes            | yes                  | inherit        | inherit           | index              | -                    |
| `/cart` `/account`        | yes            | -                    | -              | -                 | **noindex**        | -                    |
| `/checkout/*`             | layout title   | -                    | -              | -                 | **noindex**        | -                    |

---

## 5. Infrastructure notes (frontend vs Cloudflare vs backend)

```
Browser → Cloudflare
          ├─ Managed robots.txt preamble (AI bots / Content-Signal)
          ├─ www → apex 301 (verified)
          └─ Origin (Cloudflare Workers + OpenNext; Railway was retired 2026-08-12)
                ├─ app/robots.ts rules + Sitemap line
                ├─ app/sitemap.ts (calls backend product/category APIs)
                └─ page metadata + JSON-LD in HTML
```

- **Frontend owns** HTML metadata, JSON-LD, `sitemap.xml`, base robots rules.
- **Cloudflare owns** AI-crawler policy via Managed robots.txt and host redirect.
- **Backend owns** product/category data consumed by sitemap and PDP; it does not currently serve sitemap/robots.

---

## 6. Summary verdict

The storefront has moved well past the `seo.md` greenfield checklist: SSR catalog HTML, product metadata, Product/Breadcrumb/Organization JSON-LD, sitemap, robots, and utility noindex are in place. Live production confirms www→apex, CF-managed robots coexistence, and working product rich metadata.

Remaining SEO debt is mostly **URL hygiene** (category segment validation, variant query proliferation, query-based categories), **share-card completeness** on secondary pages, **homepage LCP/heading/alt polish**, and **richer Product/FAQ schema** - not a missing foundation.

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      {
        protocol: "https",
        hostname: "cdn.piggyway.com.au",
      },
    ],
  },
  async redirects() {
    return [
      // The "hut" category was renamed to "hideout". Permanently redirect the
      // old product-detail path and the old shop-all category filter.
      {
        source: "/shop/hut/:slug",
        destination: "/shop/hideout/:slug",
        permanent: true,
      },
      {
        source: "/shop-all",
        has: [{ type: "query", key: "category", value: "hut" }],
        destination: "/shop-all?category=hideout",
        permanent: true,
      },
      // The guide at "bunny-starter-kit" is entirely guinea pig content, so the
      // route was renamed to match its title. Keep the old URL working.
      {
        source: "/guides/bunny-starter-kit",
        destination: "/guides/guinea-pig-care-basics",
        permanent: true,
      },
      // The "cage-liner-benefits" guide was removed. Send the old URL to the
      // guides index.
      {
        source: "/guides/cage-liner-benefits",
        destination: "/guides",
        permanent: true,
      },
    ];
  },
};

// The Sentry SDK is browser only here. `withSentryConfig` is kept purely for
// client source map upload, and it stays out of the server build:
//
// - Source maps are only uploaded when SENTRY_AUTH_TOKEN / SENTRY_ORG /
//   SENTRY_PROJECT are present at build time; without them the plugin is a
//   no-op and the build behaves exactly as before.
// - The server side auto-instrumentation the plugin can add is webpack only,
//   and this app builds with Turbopack, so it never runs. There is also no
//   `sentry.server.config.ts` / `sentry.edge.config.ts` and `instrumentation.ts`
//   is not wired to Sentry, so no server or edge runtime initialises the SDK.
//   Verified against the build output: the server chunks contain only the
//   hand-rolled envelope reporter, no `@sentry/nextjs` code.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  silent: !process.env.CI,
});

// Enables Cloudflare bindings during `next dev` when available.
// Safe no-op if the package is not installed yet in pure Node tooling.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

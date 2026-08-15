import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;

// Enables Cloudflare bindings during `next dev` when available.
// Safe no-op if the package is not installed yet in pure Node tooling.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

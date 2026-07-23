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
    ];
  },
};

export default nextConfig;

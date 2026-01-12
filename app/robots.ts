import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      // General rules for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/cart",
          "/checkout",
          "/account",
          "/orders",
          "/_next/",
          "/pet-care",
          "/guides",
          "/returns-policy",
          "/terms",
          "/privacy",
          "/about",
        ],
      },
      // Explicitly allow AI crawlers
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "Claude-Web",
          "Anthropic",
          "CCBot",
          "PerplexityBot",
          "Bytespider",
        ],
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/cart",
          "/checkout",
          "/account",
          "/orders",
          "/pet-care",
          "/guides",
          "/returns-policy",
          "/terms",
          "/privacy",
          "/about",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

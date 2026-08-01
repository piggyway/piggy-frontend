import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils/seo";

/**
 * Crawling policy.
 *
 * Only truly non-page endpoints are disallowed here. Utility pages
 * (cart, checkout, account, login) are controlled with page-level
 * `robots: { index: false }` metadata instead - a robots.txt disallow
 * would prevent crawlers from ever seeing that noindex.
 *
 * Note: AI-crawler policy is decided at the Cloudflare level
 * ("Managed robots.txt" / bot-blocking settings), not in this file.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

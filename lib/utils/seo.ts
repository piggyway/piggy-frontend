/**
 * SEO Utility Functions
 * Shared functions for SEO-related operations
 */

/**
 * Get base URL for the site
 * Checks environment variables and falls back to default domain
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://piggyway.com.au"; // Fallback domain
}

/**
 * Build product URL
 * Uses category slug in the URL path: /shop/[category]/[slug]
 */
export function getProductUrl(
  categorySlug: string | null | undefined,
  productSlug: string,
  baseUrl?: string
): string {
  const url = baseUrl || getBaseUrl();
  return `${url}/shop/${categorySlug || "product"}/${productSlug}`;
}

/**
 * Build category URL
 */
export function getCategoryUrl(
  categorySlug: string | null | undefined,
  baseUrl?: string
): string {
  const url = baseUrl || getBaseUrl();
  if (categorySlug) {
    return `${url}/shop-all?category=${categorySlug}`;
  }
  return `${url}/shop-all`;
}

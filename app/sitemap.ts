import type { MetadataRoute } from "next";
import {
  type GuideArticle,
  guideArticles,
  petCareArticles,
} from "@/lib/guides";
import { ServerProductService } from "@/lib/services/products.server";
import { getBaseUrl, getProductUrl } from "@/lib/utils/seo";

/**
 * Regenerate the sitemap at runtime (hourly) instead of freezing it at build
 * time - otherwise new products never appear until the next deploy.
 */
export const revalidate = 3600;

/** Backend rejects page_size above 100 (ProductListQuerySchema). */
const PRODUCTS_PAGE_SIZE = 100;

/**
 * Public static routes. Keep in sync with the page files under app/.
 * Utility routes (cart, checkout, account, login, boarding/book) are
 * intentionally absent - they are noindex.
 */
const STATIC_PATHS = [
  "",
  "/shop-all",
  "/shop",
  "/about-us",
  "/contact",
  "/faqs",
  "/piggyway-boarding",
  "/shipping-delivery",
  "/returns-policy",
  "/terms",
  "/privacy",
  "/pet-care",
  "/guides",
];

function articleEntries(
  baseUrl: string,
  section: string,
  articles: GuideArticle[]
): MetadataRoute.Sitemap {
  return articles.map((article) => ({
    url: `${baseUrl}/${section}/${article.slug}`,
    lastModified: new Date(article.updatedOn),
  }));
}

async function getProductEntries(
  baseUrl: string
): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await ServerProductService.getProducts({
      page,
      page_size: PRODUCTS_PAGE_SIZE,
    });

    // getProducts throws on a failed request, so an empty first page is a
    // genuinely empty store. A failure propagates out of sitemap() so ISR
    // keeps the last good sitemap instead of caching one without products.
    for (const product of response.data) {
      const lastModified = product.dateUpdated
        ? new Date(product.dateUpdated)
        : null;
      entries.push({
        url: getProductUrl(product.category?.slug, product.slug, baseUrl),
        ...(lastModified && !Number.isNaN(lastModified.getTime())
          ? { lastModified }
          : {}),
      });
    }

    totalPages = response.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);

  return entries;
}

/**
 * Category URLs (`/shop-all?category=<slug>`) are deliberately absent. They are
 * filtered views of `/shop-all` with no content of their own, so submitting
 * them only offers Google near-duplicates of a page already in the sitemap.
 * They stay crawlable through the footer and the category filter bar.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
  }));

  const productEntries = await getProductEntries(baseUrl);

  return [
    ...staticEntries,
    ...articleEntries(baseUrl, "pet-care", petCareArticles),
    ...articleEntries(baseUrl, "guides", guideArticles),
    ...productEntries,
  ];
}

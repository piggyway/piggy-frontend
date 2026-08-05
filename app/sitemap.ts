import type { MetadataRoute } from "next";
import { ProductService } from "@/lib/services/products";
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
  "/pet-care/guinea-pig-diet-guide",
  "/pet-care/habitat-setup-tips",
  "/pet-care/bonding-with-your-pet",
  "/pet-care/health-and-wellness",
  "/guides/bunny-starter-kit",
  "/guides/cage-liner-benefits",
  "/guides/first-time-owner-essentials",
];

async function getProductEntries(
  baseUrl: string
): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await ProductService.getProducts({
      page,
      page_size: PRODUCTS_PAGE_SIZE,
    });

    // ProductService swallows fetch errors into an empty response, which is
    // indistinguishable from an empty store. An empty first page almost
    // certainly means the backend call failed - report it loudly.
    if (page === 1 && response.data.length === 0) {
      console.error(
        "[Sitemap] Products fetch returned 0 items - treating as backend failure, product URLs omitted from sitemap"
      );
      return [];
    }

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

  const productEntries = await getProductEntries(baseUrl).catch(
    (error): MetadataRoute.Sitemap => {
      console.error("[Sitemap] Failed to build product entries:", error);
      return [];
    }
  );

  return [...staticEntries, ...productEntries];
}

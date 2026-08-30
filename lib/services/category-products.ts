import "server-only";

/**
 * Category + product composition
 * Sits above the category and product services because neither one alone can
 * answer "which categories currently have something to sell".
 *
 * Every caller (the footer, the homepage grid, the shop grid) is a server
 * component, so this reads the backend directly through the server services
 * rather than looping back through this site's own API routes.
 */

import { ServerCategoryService } from "@/lib/services/categories.server";
import { ServerProductService } from "@/lib/services/products.server";
import type { Category } from "@/lib/types/models";

/**
 * Variant count for one category, or `null` when the count could not be
 * fetched. A failed count is explicitly "unknown", never zero.
 */
async function countCategoryVariants(slug: string): Promise<number | null> {
  try {
    const response = await ServerProductService.getVariants({
      page: 1,
      page_size: 1,
      category: slug,
    });
    return response.pagination.total;
  } catch (error) {
    console.error(
      `[getCategoriesWithProducts] Variant count failed for category "${slug}"; keeping it visible:`,
      error
    );
    return null;
  }
}

/**
 * Categories that currently have at least one variant.
 *
 * The categories endpoint carries no product count, so this asks the variants
 * endpoint for a single row per category purely to read pagination.total. The
 * counting runs before `limit` is applied, otherwise dropping an empty
 * category would leave fewer entries than the caller asked for.
 *
 * This is the presentation-side composition used by the homepage grid, the
 * shop grid and the footer. Those are navigation chrome on pages that must
 * keep rendering, so a categories outage degrades to an empty list here and is
 * reported. Callers that need categories as truth (the `/shop-all` category
 * filter, which 404s unknown slugs) must call ServerCategoryService directly and let
 * the failure propagate.
 */
export async function getCategoriesWithProducts(params?: {
  features?: boolean;
  limit?: number;
}): Promise<Category[]> {
  let categories: Category[];
  try {
    categories = await ServerCategoryService.getCategories(
      params?.features ? { features: true } : undefined
    );
  } catch (error) {
    console.error(
      "[getCategoriesWithProducts] Category fetch failed; rendering without categories:",
      error
    );
    return [];
  }

  if (categories.length === 0) {
    return [];
  }

  const counts = await Promise.all(
    categories.map((category) => countCategoryVariants(category.slug))
  );

  // Only a confirmed zero hides a category. An unknown count (failed request)
  // keeps it visible, so a backend blip cannot empty the grid or the footer.
  const visible = categories.filter((_, index) => counts[index] !== 0);

  return params?.limit ? visible.slice(0, params.limit) : visible;
}

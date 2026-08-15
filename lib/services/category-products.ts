/**
 * Category + product composition
 * Sits above CategoryService and ProductService because neither one alone can
 * answer "which categories currently have something to sell".
 */

import { CategoryService } from "@/lib/services/categories";
import { ProductService } from "@/lib/services/products";
import type { Category } from "@/lib/types/models";

/**
 * Categories that currently have at least one variant.
 *
 * The categories endpoint carries no product count, so this asks the variants
 * endpoint for a single row per category purely to read pagination.total. The
 * counting runs before `limit` is applied, otherwise dropping an empty
 * category would leave fewer entries than the caller asked for.
 */
export async function getCategoriesWithProducts(params?: {
  features?: boolean;
  limit?: number;
}): Promise<Category[]> {
  const categories = await CategoryService.getCategories(
    params?.features ? { features: true } : undefined
  );

  if (categories.length === 0) {
    return [];
  }

  const counts = await Promise.all(
    categories.map((category) =>
      ProductService.getVariants({
        page: 1,
        page_size: 1,
        category: category.slug,
      })
    )
  );

  const withProducts = categories.filter(
    (_, index) => counts[index].pagination.total > 0
  );

  // getVariants reports a failed request as total 0, so an all-zero result is
  // indistinguishable from a backend outage. Keep the unfiltered list in that
  // case rather than hiding every category.
  const visible = withProducts.length > 0 ? withProducts : categories;

  return params?.limit ? visible.slice(0, params.limit) : visible;
}

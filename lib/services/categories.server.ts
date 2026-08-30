import "server-only";

/**
 * Category reads for server components.
 *
 * Same responses and the same mapping as `CategoryService`, fetched straight
 * from the backend. The category list is anonymous and identical for every
 * visitor, so it is cached and carries no client IP; `react.cache` still
 * dedupes the several callers a single render has (footer, nav, grids,
 * `generateMetadata`).
 */

import { cache } from "react";

import { BACKEND_ENDPOINTS } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server-client";
import {
  selectCategories,
  type CategoriesAPIResponse,
  type CategoryQuery,
} from "@/lib/services/category-mappers";
import type { Category, CategoryFromAPI } from "@/lib/types/models";

const CATEGORIES_REVALIDATE_SECONDS = 300;

const fetchCategoryList = cache(async (): Promise<CategoryFromAPI[]> => {
  const response = await serverApiClient.get<CategoriesAPIResponse>(
    BACKEND_ENDPOINTS.CATEGORIES,
    { revalidate: CATEGORIES_REVALIDATE_SECONDS }
  );

  if (!response.success || !response.data) {
    throw new Error("Invalid API response format");
  }

  return response.data;
});

export class ServerCategoryService {
  /**
   * Get all categories
   * @param params - Frontend-side filters; the backend supports none of them
   *   yet, but the signature is kept for future use.
   */
  static async getCategories(params?: CategoryQuery): Promise<Category[]> {
    try {
      const data = await fetchCategoryList();

      return selectCategories(data, params);
    } catch (error) {
      // Neither a hardcoded fallback list nor an empty list: both invent an
      // answer the backend never gave. An empty list must mean "the shop has
      // no categories", because callers 404 unknown category slugs on it.
      console.error(
        "[ServerCategoryService] Failed to fetch categories:",
        error
      );
      throw error;
    }
  }
}

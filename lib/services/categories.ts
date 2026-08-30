/**
 * Category Service
 * Business logic layer for categories
 *
 * Reads go through the browser-facing `apiClient` and the Next.js API routes.
 * Server components must use `categories.server.ts` instead, which talks to
 * the backend directly.
 */

import { cache } from "react";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import {
  selectCategories,
  type CategoriesAPIResponse,
  type CategoryQuery,
} from "@/lib/services/category-mappers";
import type { Category, CategoryFromAPI } from "@/lib/types/models";

/**
 * The raw category list, fetched at most once per server render.
 *
 * Every page carries several independent callers of this data (the layout
 * `Footer`, the homepage and shop category grids, `generateMetadata` and the
 * page body), and each one used to issue its own `/api/categories` round trip,
 * multiplying upstream traffic by the number of callers on the page. `features`
 * and `limit` are frontend-side filters that the BFF route ignores, so the
 * request takes no parameters and all callers share this single result.
 */
const fetchCategoryList = cache(async (): Promise<CategoryFromAPI[]> => {
  const response = await apiClient.get<CategoriesAPIResponse>(
    API_ENDPOINTS.CATEGORIES
  );

  if (!response.success || !response.data) {
    throw new Error("Invalid API response format");
  }

  return response.data;
});

export class CategoryService {
  /**
   * Get all categories
   * @param params - Frontend-side filters; the backend supports none of them
   *   yet, but the signature is kept for future use.
   */
  static async getCategories(params?: CategoryQuery): Promise<Category[]> {
    try {
      // Shared per-render fetch; see fetchCategoryList above
      const data = await fetchCategoryList();

      return selectCategories(data, params);
    } catch (error) {
      // Neither a hardcoded fallback list nor an empty list: both invent an
      // answer the backend never gave. An empty list must mean "the shop has
      // no categories", because callers 404 unknown category slugs on it.
      console.error("[CategoryService] Failed to fetch categories:", error);
      throw error;
    }
  }
}

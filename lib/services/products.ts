/**
 * Product Service
 * Business logic layer for products
 *
 * Reads go through the browser-facing `apiClient` and the Next.js API routes.
 * Server components must use `products.server.ts` instead, which talks to the
 * backend directly.
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient, isNotFoundError } from "@/lib/api/client";
import {
  cleanParams,
  transformProductDetail,
  transformProductListResponse,
  transformVariantListItem,
  transformVariantListResponse,
  type VariantListResponseFromAPI,
} from "@/lib/services/product-mappers";
import type {
  ProductListParams,
  ProductListResponseFromAPI,
  ProductListResponse,
  ProductDetailFromAPI,
  ProductDetail,
  VariantListParams,
  VariantListItem,
  VariantListResponse,
  VariantReviewsResponse,
} from "@/lib/types/product";

export class ProductService {
  /**
   * Get paginated list of products with filters and sorting
   */
  static async getProducts(
    params?: ProductListParams
  ): Promise<ProductListResponse> {
    try {
      // Call Next.js API Route
      const response = await apiClient.get<ProductListResponseFromAPI>(
        API_ENDPOINTS.PRODUCTS,
        { params: cleanParams(params) }
      );

      // Validate response format
      if (!response.data || !response.pagination) {
        throw new Error("Invalid API response format");
      }

      // Transform to frontend format
      return transformProductListResponse(response);
    } catch (error) {
      // Never return an empty page here: callers cannot tell that apart from
      // a store with no matching products, and they render (or 404) on that
      // difference.
      console.error("[ProductService] Failed to fetch products:", error);
      throw error;
    }
  }

  /**
   * Get product detail by slug
   * @param slug - Product slug
   * @param options - Optional parameters
   * @param options.includeDraft - Include draft products (for preview mode)
   */
  static async getProductBySlug(
    slug: string,
    options?: { includeDraft?: boolean }
  ): Promise<ProductDetail | null> {
    try {
      const params: Record<string, string | number | boolean> = {};
      const headers: Record<string, string> = {};
      if (options?.includeDraft) {
        params.include_draft = true;
        // Draft reads only happen server-side, where the route requires the
        // preview secret before it will return unpublished products.
        if (typeof window === "undefined" && process.env.PREVIEW_SECRET) {
          headers["x-preview-secret"] = process.env.PREVIEW_SECRET;
        }
      }

      const response = await apiClient.get<ProductDetailFromAPI>(
        API_ENDPOINTS.PRODUCT_BY_ID(slug),
        {
          params: Object.keys(params).length > 0 ? params : undefined,
          headers: Object.keys(headers).length > 0 ? headers : undefined,
        }
      );

      if (!response.id) {
        return null;
      }

      return transformProductDetail(response);
    } catch (error) {
      // `null` means the backend confirmed there is no such product, so the
      // page may 404. Anything else is a failed request and must propagate,
      // otherwise a backend blip is served to crawlers as a permanent 404.
      if (isNotFoundError(error)) {
        return null;
      }
      console.error(`[ProductService] Failed to fetch product ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get paginated list of variants with filters
   */
  static async getVariants(
    params?: VariantListParams
  ): Promise<VariantListResponse> {
    try {
      const response = await apiClient.get<VariantListResponseFromAPI>(
        API_ENDPOINTS.VARIANTS,
        { params: cleanParams(params) }
      );

      if (!response.data || !response.pagination) {
        throw new Error("Invalid API response format");
      }

      return transformVariantListResponse(response);
    } catch (error) {
      // A failed request must not report `total: 0`. Callers use that count to
      // decide whether a category is empty and whether a page exists.
      console.error("[ProductService] Failed to fetch variants:", error);
      throw error;
    }
  }

  /**
   * Get 3 random variants (for "You Might Also Like" sections)
   *
   * Degrades to an empty list on failure instead of throwing: the caller is a
   * client-side suggestion strip whose absence changes nothing about whether
   * the page exists. The failure is still reported.
   */
  static async getRandomVariants(): Promise<VariantListItem[]> {
    try {
      const response = await apiClient.get<
        Pick<VariantListResponseFromAPI, "data">
      >(API_ENDPOINTS.VARIANTS_RANDOM);

      if (!response.data) {
        throw new Error("Invalid API response format");
      }

      return response.data.map((v) => transformVariantListItem(v));
    } catch (error) {
      console.error("[ProductService] Failed to fetch random variants:", error);
      return [];
    }
  }

  /**
   * Get reviews for a variant
   *
   * Degrades to `null` on failure instead of throwing: reviews are a section
   * of the product page, so a review outage must not take the product page
   * down with it. The failure is still reported.
   */
  static async getVariantReviews(
    variantId: number
  ): Promise<VariantReviewsResponse | null> {
    try {
      const response = await apiClient.get<VariantReviewsResponse>(
        API_ENDPOINTS.VARIANTS_REVIEWS(variantId)
      );

      return response;
    } catch (error) {
      console.error(
        `[ProductService] Failed to fetch reviews for variant ${variantId}:`,
        error
      );
      return null;
    }
  }
}

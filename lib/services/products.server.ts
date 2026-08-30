import "server-only";

/**
 * Product reads for server components.
 *
 * Same responses and the same mapping as `ProductService`, but fetched
 * straight from the backend rather than through this site's own `/api/*`
 * routes. Anonymous catalog reads are shared across visitors for
 * `CATALOG_REVALIDATE_SECONDS`; free-text search and draft previews are not
 * cacheable and keep the per-visitor client IP so the backend still throttles
 * them per visitor.
 */

import { BACKEND_ENDPOINTS } from "@/lib/api/endpoints";
import { isNotFoundError } from "@/lib/api/errors";
import { serverApiClient } from "@/lib/api/server-client";
import {
  cleanParams,
  transformProductDetail,
  transformProductListResponse,
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
  VariantListResponse,
  VariantReviewsResponse,
} from "@/lib/types/product";

/**
 * Catalog data changes on a CMS editor's schedule, not a visitor's, so five
 * minutes of staleness is invisible while it removes almost all SSR traffic
 * from the backend. Matches the value the BFF routes already use.
 */
const CATALOG_REVALIDATE_SECONDS = 300;

/**
 * Free-text search is unbounded, so caching it would fill the cache with
 * single-use entries. Everything else is a bounded filter combination and Next
 * keys the fetch cache on the full upstream URL.
 */
function catalogRevalidate(query?: string): number | undefined {
  return query ? undefined : CATALOG_REVALIDATE_SECONDS;
}

export class ServerProductService {
  /**
   * Get paginated list of products with filters and sorting
   */
  static async getProducts(
    params?: ProductListParams
  ): Promise<ProductListResponse> {
    try {
      const response = await serverApiClient.get<ProductListResponseFromAPI>(
        BACKEND_ENDPOINTS.PRODUCTS,
        {
          params: cleanParams(params),
          revalidate: catalogRevalidate(params?.q),
        }
      );

      if (!response.data || !response.pagination) {
        throw new Error("Invalid API response format");
      }

      return transformProductListResponse(response);
    } catch (error) {
      console.error("[ServerProductService] Failed to fetch products:", error);
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
    const previewSecret = process.env.PREVIEW_SECRET;
    // The backend returns unpublished products only against the preview
    // secret; without it, asking for drafts is pointless and the read stays a
    // normal cacheable one.
    const includeDraft = Boolean(options?.includeDraft && previewSecret);

    try {
      const response = await serverApiClient.get<ProductDetailFromAPI>(
        BACKEND_ENDPOINTS.PRODUCT_BY_SLUG(slug),
        includeDraft
          ? {
              params: { include_draft: true },
              headers: { "x-preview-secret": previewSecret as string },
            }
          : { revalidate: CATALOG_REVALIDATE_SECONDS }
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
      console.error(
        `[ServerProductService] Failed to fetch product ${slug}:`,
        error
      );
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
      const response = await serverApiClient.get<VariantListResponseFromAPI>(
        BACKEND_ENDPOINTS.VARIANTS,
        {
          params: cleanParams(params),
          revalidate: catalogRevalidate(params?.q),
        }
      );

      if (!response.data || !response.pagination) {
        throw new Error("Invalid API response format");
      }

      return transformVariantListResponse(response);
    } catch (error) {
      // A failed request must not report `total: 0`. Callers use that count to
      // decide whether a category is empty and whether a page exists.
      console.error("[ServerProductService] Failed to fetch variants:", error);
      throw error;
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
      return await serverApiClient.get<VariantReviewsResponse>(
        BACKEND_ENDPOINTS.VARIANTS_REVIEWS(variantId),
        { revalidate: CATALOG_REVALIDATE_SECONDS }
      );
    } catch (error) {
      console.error(
        `[ServerProductService] Failed to fetch reviews for variant ${variantId}:`,
        error
      );
      return null;
    }
  }
}

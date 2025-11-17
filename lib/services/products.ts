/**
 * Product Service
 * Business logic layer for products
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type {
  ProductListParams,
  ProductListResponseFromAPI,
  ProductListResponse,
  ProductListItem,
  ProductListItemFromAPI,
  ProductDetailFromAPI,
  ProductDetail,
  ProductOption,
  ProductVariant,
} from "@/lib/types/product";

/**
 * Default image for products without images
 */
const DEFAULT_PRODUCT_IMAGE = "/default-product-image.png";

/**
 * Default currency
 */
const DEFAULT_CURRENCY = "AUD";

export class ProductService {
  /**
   * Get paginated list of products with filters and sorting
   */
  static async getProducts(
    params?: ProductListParams
  ): Promise<ProductListResponse> {
    try {
      // Clean up params - remove undefined values
      const cleanParams: Record<string, string | number | boolean> = {};
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            cleanParams[key] = value;
          }
        });
      }

      // Call Next.js API Route
      const response = await apiClient.get<ProductListResponseFromAPI>(
        API_ENDPOINTS.PRODUCTS,
        { params: cleanParams }
      );

      // Validate response format
      if (!response.data || !response.pagination) {
        throw new Error("Invalid API response format");
      }

      // Transform to frontend format
      return this.transformProductListResponse(response);
    } catch (error) {
      console.error("[ProductService] Failed to fetch products:", error);
      // Return empty response on error
      return {
        data: [],
        pagination: {
          page: params?.page || 1,
          pageSize: params?.page_size || 10,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  /**
   * Get product detail by slug
   */
  static async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    try {
      const response = await apiClient.get<ProductDetailFromAPI>(
        API_ENDPOINTS.PRODUCT_BY_ID(slug)
      );

      if (!response.id) {
        return null;
      }

      return this.transformProductDetail(response);
    } catch (error) {
      console.error(`[ProductService] Failed to fetch product ${slug}:`, error);
      return null;
    }
  }

  /**
   * Transform API response to frontend format
   */
  private static transformProductListResponse(
    response: ProductListResponseFromAPI
  ): ProductListResponse {
    return {
      data: response.data.map((product) =>
        this.transformProductListItem(product)
      ),
      pagination: {
        page: response.pagination.page,
        pageSize: response.pagination.page_size,
        total: response.pagination.total,
        totalPages: response.pagination.total_pages,
      },
    };
  }

  /**
   * Transform product list item from API format
   */
  private static transformProductListItem(
    product: ProductListItemFromAPI
  ): ProductListItem {
    const price = product.base_price || 0;
    const currencySlug = product.currency?.slug || DEFAULT_CURRENCY;

    return {
      id: product.id,
      title: product.title || "Untitled Product",
      subtitle: product.subtitle || "",
      slug: product.slug || `product-${product.id}`,
      basePrice: price,
      formattedPrice: this.formatPrice(price, currencySlug),
      currency: product.currency,
      brand: product.brand,
      imageUrl: product.image_url || DEFAULT_PRODUCT_IMAGE,
      variantsCount: product.variants_count,
      isFeatured: product.is_featured,
    };
  }

  /**
   * Transform product detail from API format
   */
  private static transformProductDetail(
    product: ProductDetailFromAPI
  ): ProductDetail {
    const price = product.base_price || 0;
    const currencySlug = product.currency?.slug || DEFAULT_CURRENCY;

    return {
      id: product.id,
      title: product.title || "Untitled Product",
      subtitle: product.subtitle || "",
      description: product.description || "",
      slug: product.slug || `product-${product.id}`,
      basePrice: price,
      formattedPrice: this.formatPrice(price, currencySlug),
      currency: product.currency,
      brand: product.brand,
      category: product.category,
      species: product.species || [],
      images:
        product.images.length > 0 ? product.images : [DEFAULT_PRODUCT_IMAGE],
      options: product.options.map((option) => this.transformOption(option)),
      variants: product.variants.map((variant) =>
        this.transformVariant(variant)
      ),
    };
  }

  /**
   * Transform product option
   */
  private static transformOption(option: {
    id: number;
    name: string | null;
    slug: string | null;
    values: Array<{
      id: number;
      value: string | null;
      color_hex: string | null;
      variant_ids: number[];
    }>;
  }): ProductOption {
    return {
      id: option.id,
      name: option.name,
      slug: option.slug,
      values: option.values.map((value) => ({
        id: value.id,
        value: value.value,
        colorHex: value.color_hex,
        variantIds: value.variant_ids,
      })),
    };
  }

  /**
   * Transform product variant
   */
  private static transformVariant(variant: {
    id: number;
    sku: string | null;
    uuid: string | null;
    original_price: number | null;
    discounted_price: number | null;
    currency: { name: string | null; slug: string | null } | null;
    stock_quantity: number;
    is_available: boolean;
    weight: number | null;
    weight_unit: string | null;
    length: number | null;
    width: number | null;
    height: number | null;
    length_unit: string | null;
    width_unit: string | null;
    height_unit: string | null;
    option_values: Array<{
      option_id: number;
      option_name: string | null;
      value_id: number;
      value: string | null;
    }>;
    image_url: string | null;
  }): ProductVariant {
    return {
      id: variant.id,
      sku: variant.sku,
      uuid: variant.uuid,
      originalPrice: variant.original_price,
      discountedPrice: variant.discounted_price,
      currency: variant.currency,
      stockQuantity: variant.stock_quantity,
      isAvailable: variant.is_available,
      weight: variant.weight,
      weightUnit: variant.weight_unit,
      length: variant.length,
      width: variant.width,
      height: variant.height,
      lengthUnit: variant.length_unit,
      widthUnit: variant.width_unit,
      heightUnit: variant.height_unit,
      optionValues: variant.option_values.map((ov) => ({
        optionId: ov.option_id,
        optionName: ov.option_name,
        valueId: ov.value_id,
        value: ov.value,
      })),
      imageUrl: variant.image_url,
    };
  }

  /**
   * Format price with currency symbol
   */
  private static formatPrice(price: number, currencySlug: string): string {
    const currencySymbols: Record<string, string> = {
      AUD: "$",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };

    const symbol = currencySymbols[currencySlug.toUpperCase()] || "$";
    return `${symbol}${price.toFixed(2)}`;
  }
}

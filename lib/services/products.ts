/**
 * Product Service
 * Business logic layer for products
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { normalizeImageUrl } from "@/lib/utils/images";
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
  VariantListParams,
  VariantListItemFromAPI,
  VariantListItem,
  VariantListResponse,
  VariantReviewsResponse,
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
      if (options?.includeDraft) {
        params.include_draft = true;
      }

      const response = await apiClient.get<ProductDetailFromAPI>(
        API_ENDPOINTS.PRODUCT_BY_ID(slug),
        { params: Object.keys(params).length > 0 ? params : undefined }
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
      category: product.category || null,
      imageUrl: normalizeImageUrl(product.image_url) || DEFAULT_PRODUCT_IMAGE,
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
    const options =
      product.options.length > 0
        ? product.options.map((option) => this.transformOption(option))
        : this.buildOptionsFromVariants(product.variants);

    return {
      id: product.id,
      title: product.title || "Untitled Product",
      subtitle: product.subtitle || "",
      description: product.description || "",
      detailInformation: product.detail_information || "",
      productFeatures: product.product_features || "",
      specifications: product.specifications || "",
      careInstructions: product.care_instructions || "",
      slug: product.slug || `product-${product.id}`,
      basePrice: price,
      formattedPrice: this.formatPrice(price, currencySlug),
      currency: product.currency,
      brand: product.brand,
      category: product.category,
      species: product.species || [],
      images:
        product.images.length > 0
          ? product.images.map(
              (image) => normalizeImageUrl(image) || DEFAULT_PRODUCT_IMAGE
            )
          : [DEFAULT_PRODUCT_IMAGE],
      detailInformationFiles:
        product.detail_information_files.length > 0
          ? product.detail_information_files
              .map((file) => normalizeImageUrl(file))
              .filter((file): file is string => file !== null)
          : [],
      options,
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
    image_urls: string[];
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
      imageUrls: variant.image_urls
        .map((url) => normalizeImageUrl(url))
        .filter((url): url is string => url !== null),
    };
  }

  /**
   * Build options from variant option values when options are missing.
   */
  private static buildOptionsFromVariants(
    variants: Array<{
      id: number;
      option_values: Array<{
        option_id: number;
        option_name: string | null;
        value_id: number;
        value: string | null;
      }>;
    }>
  ): ProductOption[] {
    const optionsMap = new Map<number, ProductOption>();
    for (const variant of variants) {
      for (const ov of variant.option_values) {
        if (!optionsMap.has(ov.option_id)) {
          optionsMap.set(ov.option_id, {
            id: ov.option_id,
            name: ov.option_name,
            slug: null,
            values: [],
          });
        }
        const option = optionsMap.get(ov.option_id)!;
        if (!option.values.some((value) => value.id === ov.value_id)) {
          option.values.push({
            id: ov.value_id,
            value: ov.value,
            colorHex: null,
            variantIds: [],
          });
        }
      }
    }
    return Array.from(optionsMap.values());
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

  /**
   * Get paginated list of variants with filters
   */
  static async getVariants(
    params?: VariantListParams
  ): Promise<VariantListResponse> {
    try {
      const cleanParams: Record<string, string | number | boolean> = {};
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            cleanParams[key] = value;
          }
        });
      }

      const response = await apiClient.get<{
        data: VariantListItemFromAPI[];
        pagination: {
          page: number;
          page_size: number;
          total: number;
          total_pages: number;
        };
      }>(API_ENDPOINTS.VARIANTS, { params: cleanParams });

      if (!response.data || !response.pagination) {
        throw new Error("Invalid API response format");
      }

      return this.transformVariantListResponse(response);
    } catch (error) {
      console.error("[ProductService] Failed to fetch variants:", error);
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
   * Transform variant list response
   */
  private static transformVariantListResponse(response: {
    data: VariantListItemFromAPI[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      total_pages: number;
    };
  }): VariantListResponse {
    return {
      data: response.data.map((v) => this.transformVariantListItem(v)),
      pagination: {
        page: response.pagination.page,
        pageSize: response.pagination.page_size,
        total: response.pagination.total,
        totalPages: response.pagination.total_pages,
      },
    };
  }

  /**
   * Transform variant list item
   */
  private static transformVariantListItem(
    variant: VariantListItemFromAPI
  ): VariantListItem {
    const currencySlug = variant.currency?.slug || "AUD";
    const originalPrice = variant.original_price;
    const discountedPrice = variant.discounted_price;

    let formattedOriginalPrice: string | null = null;
    let formattedDiscountedPrice: string | null = null;
    let discountPercentage: string | null = null;

    if (originalPrice !== null) {
      formattedOriginalPrice = this.formatPrice(originalPrice, currencySlug);
    }
    if (discountedPrice !== null) {
      formattedDiscountedPrice = this.formatPrice(
        discountedPrice,
        currencySlug
      );
    }

    // Calculate discount percentage
    if (
      originalPrice !== null &&
      discountedPrice !== null &&
      discountedPrice < originalPrice
    ) {
      const percent = Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
      discountPercentage = `${percent}% OFF`;
    }

    return {
      variantId: variant.variant_id,
      productId: variant.product_id,
      productTitle: variant.product_title || "Untitled Product",
      productSlug: variant.product_slug || `product-${variant.product_id}`,
      category: variant.category,
      originalPrice,
      discountedPrice,
      formattedOriginalPrice,
      formattedDiscountedPrice,
      discountPercentage,
      currency: variant.currency,
      imageUrl: normalizeImageUrl(variant.image_url) || DEFAULT_PRODUCT_IMAGE,
      stockQuantity: variant.stock_quantity,
      isAvailable: variant.is_available,
      optionValues: variant.option_values.map((ov) => ({
        optionName: ov.option_name,
        optionSlug: ov.option_slug,
        value: ov.value,
      })),
    };
  }

  /**
   * Get reviews for a variant
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

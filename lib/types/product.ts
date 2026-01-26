/**
 * Product Types
 * Types for product API requests and responses
 */

// ==================== API Request Types ====================

/**
 * Product list query parameters (matches backend API)
 */
export interface ProductListParams {
  // Pagination
  page?: number;
  page_size?: number;

  // Search
  q?: string;

  // Filters
  species?: string;
  category?: string;
  brand?: string;
  featured?: "true" | "false";
  in_stock?: "true" | "false";
  price_gte?: number;
  price_lte?: number;

  // Sorting (e.g., "-date_created,base_price")
  sort?: string;
}

// ==================== API Response Types ====================

/**
 * Brand info (nested in product response)
 */
export interface BrandInfo {
  name: string | null;
  slug: string | null;
}

/**
 * Currency info (nested in product response)
 */
export interface CurrencyInfo {
  name: string | null;
  slug: string | null;
}

/**
 * Category info (nested in product detail response)
 */
export interface CategoryInfo {
  name: string | null;
  slug: string | null;
}

/**
 * Species info (nested in product detail response)
 */
export interface SpeciesInfo {
  name: string | null;
  slug: string | null;
}

/**
 * Product list item from API (snake_case)
 */
export interface ProductListItemFromAPI {
  id: number;
  title: string | null;
  subtitle: string | null;
  slug: string | null;
  base_price: number | null;
  currency: CurrencyInfo | null;
  brand: BrandInfo | null;
  category: CategoryInfo | null;
  image_url: string | null;
  variants_count: number;
  is_featured: boolean;
}

/**
 * Pagination metadata from API
 */
export interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

/**
 * Paginated product list response from API
 */
export interface ProductListResponseFromAPI {
  data: ProductListItemFromAPI[];
  pagination: PaginationMeta;
}

// ==================== Frontend Types ====================

/**
 * Product list item for frontend (camelCase, formatted)
 */
export interface ProductListItem {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  basePrice: number;
  formattedPrice: string;
  currency: CurrencyInfo | null;
  brand: BrandInfo | null;
  category: CategoryInfo | null;
  imageUrl: string;
  variantsCount: number;
  isFeatured: boolean;
}

/**
 * Paginated product list response for frontend
 */
export interface ProductListResponse {
  data: ProductListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Variant List Types ====================

/**
 * Variant option display (for showing in cards)
 */
export interface VariantOptionDisplay {
  optionName: string | null;
  optionSlug: string | null;
  value: string | null;
}

/**
 * Variant list item from API (snake_case)
 */
export interface VariantListItemFromAPI {
  variant_id: number;
  product_id: number;
  product_title: string | null;
  product_slug: string | null;
  category: CategoryInfo | null;
  original_price: number | null;
  discounted_price: number | null;
  currency: CurrencyInfo | null;
  image_url: string | null;
  stock_quantity: number;
  is_available: boolean;
  option_values: Array<{
    option_name: string | null;
    option_slug: string | null;
    value: string | null;
  }>;
}

/**
 * Variant list item for frontend (camelCase)
 */
export interface VariantListItem {
  variantId: number;
  productId: number;
  productTitle: string;
  productSlug: string;
  category: CategoryInfo | null;
  originalPrice: number | null;
  discountedPrice: number | null;
  formattedOriginalPrice: string | null;
  formattedDiscountedPrice: string | null;
  discountPercentage: string | null;
  currency: CurrencyInfo | null;
  imageUrl: string;
  stockQuantity: number;
  isAvailable: boolean;
  optionValues: VariantOptionDisplay[];
}

/**
 * Variant list params
 */
export interface VariantListParams {
  page?: number;
  page_size?: number;
  category?: string;
  q?: string;
  in_stock?: "true" | "false";
  sort?: string;
}

/**
 * Paginated variant list response for frontend
 */
export interface VariantListResponse {
  data: VariantListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ==================== Product Detail Types ====================

/**
 * Option value (nested in option)
 */
export interface OptionValue {
  id: number;
  value: string | null;
  colorHex: string | null;
  variantIds: number[];
}

/**
 * Product option (e.g., Color, Size)
 */
export interface ProductOption {
  id: number;
  name: string | null;
  slug: string | null;
  values: OptionValue[];
}

/**
 * Variant option value (nested in variant)
 */
export interface VariantOptionValue {
  optionId: number;
  optionName: string | null;
  valueId: number;
  value: string | null;
}

/**
 * Product variant
 */
export interface ProductVariant {
  id: number;
  sku: string | null;
  uuid: string | null;
  originalPrice: number | null;
  discountedPrice: number | null;
  currency: CurrencyInfo | null;
  stockQuantity: number;
  isAvailable: boolean;
  weight: number | null;
  weightUnit: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  lengthUnit: string | null;
  widthUnit: string | null;
  heightUnit: string | null;
  optionValues: VariantOptionValue[];
  imageUrls: string[];
}

/**
 * Product detail from API (snake_case)
 */
export interface ProductDetailFromAPI {
  id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  detail_information: string | null;
  slug: string | null;
  base_price: number | null;
  currency: CurrencyInfo | null;
  brand: BrandInfo | null;
  category: CategoryInfo | null;
  species: SpeciesInfo[];
  images: string[];
  detail_information_files: string[];
  options: Array<{
    id: number;
    name: string | null;
    slug: string | null;
    values: Array<{
      id: number;
      value: string | null;
      color_hex: string | null;
      variant_ids: number[];
    }>;
  }>;
  variants: Array<{
    id: number;
    sku: string | null;
    uuid: string | null;
    original_price: number | null;
    discounted_price: number | null;
    currency: CurrencyInfo | null;
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
  }>;
}

/**
 * Product detail for frontend (camelCase)
 */
export interface ProductDetail {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  detailInformation: string;
  slug: string;
  basePrice: number;
  formattedPrice: string;
  currency: CurrencyInfo | null;
  brand: BrandInfo | null;
  category: CategoryInfo | null;
  species: SpeciesInfo[];
  images: string[];
  detailInformationFiles: string[];
  options: ProductOption[];
  variants: ProductVariant[];
}

// ==================== Review Types ====================

/**
 * Variant review item
 */
export interface VariantReview {
  id: number;
  uuid: string | null;
  customer_name: string | null;
  content: string | null;
  image_url: string | null;
  date_created: string | null;
}

/**
 * Variant reviews response
 */
export interface VariantReviewsResponse {
  variant_id: number;
  reviews: VariantReview[];
  total: number;
}

// ==================== Sort Options ====================

export type SortOption =
  | "date_created"
  | "-date_created"
  | "base_price"
  | "-base_price"
  | "title"
  | "-title";

export interface SortOptionItem {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: "-date_created", label: "Newest" },
  { value: "date_created", label: "Oldest" },
  { value: "base_price", label: "Price: Low to High" },
  { value: "-base_price", label: "Price: High to Low" },
  { value: "title", label: "Name: A to Z" },
  { value: "-title", label: "Name: Z to A" },
];

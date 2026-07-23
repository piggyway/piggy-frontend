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
  date_updated?: string | null;
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
  dateUpdated: string | null;
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
 * Story block item from API (snake_case)
 */
export interface StoryBlockFromAPI {
  title: string | null;
  description: string | null;
  image_url: string | null;
  image_left: boolean;
  sort: number | null;
}

/**
 * Story block for frontend (camelCase)
 */
export interface StoryBlock {
  title: string;
  description: string;
  imageUrl: string;
  imageLeft: boolean;
}

/**
 * Feature card item from API (snake_case)
 */
export interface FeatureCardFromAPI {
  icon: string | null;
  label: string | null;
  background: string | null;
  sort: number | null;
}

/**
 * Feature card for frontend (camelCase)
 */
export interface FeatureCard {
  icon: string;
  label: string;
  background: string;
}

/**
 * Add-on selection mode
 */
export type AddOnSelectionMode = "single" | "multiple";

/**
 * Add-on item from API (snake_case)
 */
export interface AddOnFromAPI {
  id: number;
  uuid: string | null;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | null;
  currency: CurrencyInfo | null;
  image_url: string | null;
  stock_quantity: number;
  is_available: boolean;
  sort: number | null;
  group_id: number | null;
}

/**
 * Add-on group from API (snake_case)
 */
export interface AddOnGroupFromAPI {
  id: number;
  uuid: string | null;
  name: string | null;
  selection_mode: string | null;
  is_required: boolean;
  sort: number | null;
  add_ons: AddOnFromAPI[];
}

/**
 * Add-on item for frontend (camelCase). price is in dollars.
 */
export interface AddOn {
  id: number;
  uuid: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  formattedPrice: string;
  currency: CurrencyInfo | null;
  imageUrl: string | null;
  stockQuantity: number;
  isAvailable: boolean;
  sort: number;
  groupId: number | null;
}

/**
 * Add-on group for frontend (camelCase)
 */
export interface AddOnGroup {
  id: number;
  uuid: string | null;
  name: string;
  selectionMode: AddOnSelectionMode;
  isRequired: boolean;
  sort: number;
  addOns: AddOn[];
}

/**
 * Product detail from API (snake_case)
 */
/**
 * How a product can be purchased. `standard` allows direct add-to-cart;
 * `preorder` products are enquiry-only (no add-to-cart / checkout).
 * Keys must match the CMS `product_info.purchase_mode` dropdown choices.
 */
export type PurchaseMode = "standard" | "preorder";

export interface ProductDetailFromAPI {
  id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  detail_information: string | null;
  product_features: string | null;
  specifications: string | null;
  care_instructions: string | null;
  feature_section_title: string | null;
  feature_section_subtitle: string | null;
  feature_section_description: string | null;
  feature_banner_text: string | null;
  purchase_mode: PurchaseMode;
  add_on_max_selections: number | null;
  slug: string | null;
  base_price: number | null;
  currency: CurrencyInfo | null;
  brand: BrandInfo | null;
  category: CategoryInfo | null;
  species: SpeciesInfo[];
  images: string[];
  detail_information_files: string[];
  story_blocks: StoryBlockFromAPI[];
  feature_cards: FeatureCardFromAPI[];
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
  add_on_groups: AddOnGroupFromAPI[];
  add_ons: AddOnFromAPI[];
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
  productFeatures: string;
  specifications: string;
  careInstructions: string;
  featureSectionTitle: string;
  featureSectionSubtitle: string;
  featureSectionDescription: string;
  featureBannerText: string;
  purchaseMode: PurchaseMode;
  addOnMaxSelections: number | null;
  slug: string;
  basePrice: number;
  formattedPrice: string;
  currency: CurrencyInfo | null;
  brand: BrandInfo | null;
  category: CategoryInfo | null;
  species: SpeciesInfo[];
  images: string[];
  detailInformationFiles: string[];
  storyBlocks: StoryBlock[];
  featureCards: FeatureCard[];
  options: ProductOption[];
  variants: ProductVariant[];
  addOnGroups: AddOnGroup[];
  addOns: AddOn[];
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

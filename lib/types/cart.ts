/**
 * Cart Types
 * Types for cart API requests and responses
 */

// ==================== API Response Types ====================

export interface VariantOption {
  name: string;
  value: string;
}

export interface CartItemFromAPI {
  id: string | number; // Backend may return number, we'll convert to string
  cart_id: string;
  variant_rid: number;
  product_rid: number | null;
  quantity: number;
  snapshot_unit_price_amt: number | null;
  snapshot_currency: string | null;
  notes: string | null;
  variant_sku: string | null;
  variant_options?: VariantOption[];
  product_title: string | null;
  product_subtitle: string | null;
  product_slug: string | null;
  image_url: string | null;
  is_available: boolean | null;
  stock_quantity: number | null;
  line_subtotal_amt: number;
  currency: string | null; // May be null, we'll use cart currency as fallback
}

export interface CartTotalsFromAPI {
  item_count: number;
  subtotal_amt: number;
  discount_amt: number;
  grand_total_amt: number;
  currency: string;
}

export interface CartPaginationFromAPI {
  next_cursor: number | null;
  has_more: boolean;
  page_size: number;
}

export interface CartFromAPI {
  id: string;
  status: "active" | "locked";
  currency: string;
  applied_coupon_code: string | null;
  items: CartItemFromAPI[];
  totals: CartTotalsFromAPI;
  pagination: CartPaginationFromAPI;
}

export interface CartResponseFromAPI {
  success: boolean;
  data?: CartFromAPI;
  error?: string;
  message?: string;
}

// ==================== Frontend Types ====================

export interface CartItem {
  id: string;
  cartId: string;
  variantRid: number;
  productRid: number | null;
  quantity: number;
  unitPriceCents: number;
  lineSubtotalCents: number;
  currency: string;
  productTitle: string;
  productSubtitle: string | null;
  productSlug: string | null;
  imageUrl: string;
  isAvailable: boolean | null;
  stockQuantity: number | null;
  variantSku: string | null;
  variantOptions: VariantOption[];
  notes: string | null;
  formattedUnitPrice: string;
  formattedLineSubtotal: string;
}

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  discountCents: number;
  grandTotalCents: number;
  currency: string;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedGrandTotal: string;
}

export interface CartPagination {
  nextCursor: number | null;
  hasMore: boolean;
  pageSize: number;
}

export interface Cart {
  id: string;
  status: "active" | "locked";
  currency: string;
  currencySymbol: string;
  appliedCouponCode: string | null;
  items: CartItem[];
  totals: CartTotals;
  pagination: CartPagination;
}

export interface AddCartItemPayload {
  variantRid: number;
  quantity?: number;
  notes?: string;
}

export interface UpdateCartItemPayload {
  quantity?: number;
  notes?: string | null;
}

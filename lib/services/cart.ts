/**
 * Cart Service
 * Business logic layer for cart operations
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchWithAuth } from "@/lib/api/client";
import { normalizeImageUrl } from "@/lib/utils/images";
import type {
  AddCartItemPayload,
  Cart,
  CartFromAPI,
  CartItem,
  CartItemAddOn,
  CartItemAddOnFromAPI,
  CartItemFromAPI,
  CartResponseFromAPI,
  CartTotals,
  CartTotalsFromAPI,
  UpdateCartItemPayload,
} from "@/lib/types/cart";

const FALLBACK_IMAGE = "/default-product-image.png";

/**
 * User-friendly messages for backend add-on error codes.
 */
const ADD_ON_ERROR_MESSAGES: Record<string, string> = {
  add_on_not_found: "One of the selected add-ons is no longer available.",
  add_on_not_for_product:
    "One of the selected add-ons is not available for this product.",
  add_on_unavailable: "One of the selected add-ons is currently unavailable.",
  add_on_insufficient_stock:
    "One of the selected add-ons does not have enough stock for this quantity.",
  add_on_group_single_selection_violation:
    "Please pick only one option from this add-on group.",
  add_ons_unavailable: "Some selected add-ons are no longer available.",
  add_on_max_selections_exceeded:
    "You have selected too many add-ons for this product.",
  product_preorder_only:
    "This product is pre-order only. Please contact us to enquire.",
};

/**
 * Map a raw backend error to a friendly message. The backend may send either a
 * bare error code ("add_on_insufficient_stock") or a code with a human detail
 * ("add_on_insufficient_stock: Decoration Kit (requested 3, available 2)").
 * For a bare known code we use the friendly copy; for a "code: detail" form we
 * keep the (more specific) detail and drop the code prefix; unknown errors pass
 * through unchanged.
 */
function mapAddOnError(rawError: string | undefined): string | undefined {
  if (!rawError) return rawError;
  if (ADD_ON_ERROR_MESSAGES[rawError]) return ADD_ON_ERROR_MESSAGES[rawError];
  const match = rawError.match(/^([a-z_]+):\s*(.+)$/);
  if (match && ADD_ON_ERROR_MESSAGES[match[1]]) {
    return match[2].trim() || ADD_ON_ERROR_MESSAGES[match[1]];
  }
  return rawError;
}

export class CartService {
  /**
   * Fetch active cart with pagination support
   */
  static async getCart(pagination?: {
    cursor?: number;
    limit?: number;
  }): Promise<Cart | null> {
    try {
      const params = new URLSearchParams();
      if (pagination?.cursor) {
        params.append("cursor", String(pagination.cursor));
      }
      if (pagination?.limit) {
        params.append("limit", String(pagination.limit));
      }
      const queryString = params.toString();
      const url = queryString
        ? `${API_ENDPOINTS.CART}?${queryString}`
        : API_ENDPOINTS.CART;

      console.log("🟡 [CartService] Fetching cart from:", url);

      const response = await fetchWithAuth(url, {
        method: "GET",
      });

      const data: CartResponseFromAPI = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Invalid cart response");
      }

      const transformedCart = this.transformCart(data.data);

      console.log("🟢 [CartService] Cart fetched successfully:", {
        cartId: transformedCart.id,
        appliedCouponCode: transformedCart.appliedCouponCode,
        itemCount: transformedCart.totals.itemCount,
        subtotalCents: transformedCart.totals.subtotalCents,
        discountCents: transformedCart.totals.discountCents,
        grandTotalCents: transformedCart.totals.grandTotalCents,
        subtotal: transformedCart.totals.formattedSubtotal,
        discount: transformedCart.totals.formattedDiscount,
        grandTotal: transformedCart.totals.formattedGrandTotal,
        hasMore: transformedCart.pagination.hasMore,
      });

      return transformedCart;
    } catch (error) {
      console.error("[CartService] Failed to fetch cart:", error);
      return null;
    }
  }

  /**
   * Load more cart items (for pagination)
   */
  static async loadMoreItems(
    cursor: number,
    limit: number = 5
  ): Promise<Cart | null> {
    return this.getCart({ cursor, limit });
  }

  /**
   * Add item to cart
   */
  static async addItem(payload: AddCartItemPayload): Promise<Cart | null> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.CART_ITEMS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant_rid: payload.variantRid,
          quantity: payload.quantity ?? 1,
          notes: payload.notes,
          ...(payload.addOnIds && payload.addOnIds.length > 0
            ? { add_on_ids: payload.addOnIds }
            : {}),
        }),
      });

      const data: CartResponseFromAPI = await response.json();

      if (!data.success || !data.data) {
        throw new Error(mapAddOnError(data.error) || "Failed to add cart item");
      }

      return this.transformCart(data.data);
    } catch (error) {
      console.error("[CartService] Failed to add cart item:", error);
      // Re-throw so the caller can surface the (friendly) message instead of a
      // generic fallback. Add-on stock/availability errors matter to the user.
      throw error instanceof Error
        ? error
        : new Error("Failed to add cart item");
    }
  }

  /**
   * Update quantity or notes for a cart item
   */
  static async updateItem(
    itemId: string,
    payload: UpdateCartItemPayload
  ): Promise<Cart | null> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.CART_ITEM_BY_ID(itemId),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: payload.quantity,
            notes: payload.notes,
          }),
        }
      );

      const data: CartResponseFromAPI = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to update cart item");
      }

      return this.transformCart(data.data);
    } catch (error) {
      console.error("[CartService] Failed to update cart item:", error);
      return null;
    }
  }

  /**
   * Remove a cart item
   */
  static async removeItem(itemId: string): Promise<Cart | null> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.CART_ITEM_BY_ID(itemId),
        {
          method: "DELETE",
        }
      );

      const data: CartResponseFromAPI = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to remove cart item");
      }

      return this.transformCart(data.data);
    } catch (error) {
      console.error("[CartService] Failed to remove cart item:", error);
      return null;
    }
  }

  /**
   * Normalize currency symbol
   */
  private static getCurrencySymbol(currency: string): string {
    const currencySymbols: Record<string, string> = {
      AUD: "$",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };

    return currencySymbols[currency?.toUpperCase()] || "$";
  }

  /**
   * Format amount in cents to currency string
   */
  private static formatAmount(amountCents: number, currency: string): string {
    const symbol = this.getCurrencySymbol(currency);
    return `${symbol}${(amountCents / 100).toFixed(2)}`;
  }

  /**
   * Transform API cart to frontend cart
   */
  private static transformCart(cart: CartFromAPI): Cart {
    return {
      id: cart.id,
      status: cart.status,
      currency: cart.currency,
      currencySymbol: this.getCurrencySymbol(cart.currency),
      appliedCouponCode: cart.applied_coupon_code,
      items: cart.items.map((item) => this.transformCartItem(item, cart)),
      totals: this.transformTotals(cart.totals),
      pagination: {
        nextCursor: cart.pagination.next_cursor,
        hasMore: cart.pagination.has_more,
        pageSize: cart.pagination.page_size,
      },
    };
  }

  /**
   * Transform API cart item to frontend cart item
   */
  private static transformCartItem(
    item: CartItemFromAPI,
    cart: CartFromAPI
  ): CartItem {
    const unitPriceCents =
      item.snapshot_unit_price_amt ??
      Math.round(item.line_subtotal_amt / Math.max(item.quantity, 1));

    return {
      id: String(item.id), // Ensure ID is always a string
      cartId: item.cart_id,
      variantRid: item.variant_rid,
      productRid: item.product_rid,
      quantity: item.quantity,
      unitPriceCents,
      lineSubtotalCents: item.line_subtotal_amt,
      currency: item.currency || cart.currency || "aud", // Ensure currency is never null
      productTitle: item.product_title || "Product",
      productSubtitle: item.product_subtitle,
      productSlug: item.product_slug,
      imageUrl: normalizeImageUrl(item.image_url) || FALLBACK_IMAGE,
      isAvailable: item.is_available,
      stockQuantity: item.stock_quantity,
      variantSku: item.variant_sku,
      variantOptions: item.variant_options || [],
      addOns: (item.add_ons ?? []).map((addOn) =>
        this.transformCartItemAddOn(addOn, cart.currency)
      ),
      notes: item.notes,
      formattedUnitPrice: this.formatAmount(unitPriceCents, cart.currency),
      formattedLineSubtotal: this.formatAmount(
        item.line_subtotal_amt,
        cart.currency
      ),
    };
  }

  /**
   * Transform a cart item add-on. unit_price_amt is already in cents and is
   * folded into the composite line total, so it is only a display breakdown.
   */
  private static transformCartItemAddOn(
    addOn: CartItemAddOnFromAPI,
    currency: string
  ): CartItemAddOn {
    const unitPriceCents = addOn.unit_price_amt ?? 0;
    return {
      id: addOn.id,
      addOnRid: addOn.add_on_rid,
      name: addOn.name || "Add-on",
      unitPriceCents,
      formattedUnitPrice: this.formatAmount(unitPriceCents, currency),
    };
  }

  /**
   * Transform totals section
   */
  private static transformTotals(totals: CartTotalsFromAPI): CartTotals {
    return {
      itemCount: totals.item_count,
      subtotalCents: totals.subtotal_amt,
      discountCents: totals.discount_amt,
      grandTotalCents: totals.grand_total_amt,
      currency: totals.currency,
      formattedSubtotal: this.formatAmount(
        totals.subtotal_amt,
        totals.currency
      ),
      formattedDiscount: this.formatAmount(
        totals.discount_amt,
        totals.currency
      ),
      formattedGrandTotal: this.formatAmount(
        totals.grand_total_amt,
        totals.currency
      ),
    };
  }
}

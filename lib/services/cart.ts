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
  CartItemFromAPI,
  CartResponseFromAPI,
  CartTotals,
  CartTotalsFromAPI,
  UpdateCartItemPayload,
} from "@/lib/types/cart";

const FALLBACK_IMAGE = "/default-product-image.png";

export class CartService {
  /**
   * Fetch active cart
   */
  static async getCart(): Promise<Cart | null> {
    try {
      console.log("🟡 [CartService] Fetching cart from:", API_ENDPOINTS.CART);

      const response = await fetchWithAuth(API_ENDPOINTS.CART, {
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
      });

      return transformedCart;
    } catch (error) {
      console.error("[CartService] Failed to fetch cart:", error);
      return null;
    }
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
        }),
      });

      const data: CartResponseFromAPI = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to add cart item");
      }

      return this.transformCart(data.data);
    } catch (error) {
      console.error("[CartService] Failed to add cart item:", error);
      return null;
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
      productSlug: item.product_slug,
      imageUrl: normalizeImageUrl(item.image_url) || FALLBACK_IMAGE,
      isAvailable: item.is_available,
      stockQuantity: item.stock_quantity,
      variantSku: item.variant_sku,
      notes: item.notes,
      formattedUnitPrice: this.formatAmount(unitPriceCents, cart.currency),
      formattedLineSubtotal: this.formatAmount(
        item.line_subtotal_amt,
        cart.currency
      ),
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

/**
 * Shipping configuration shape, fallback and mapping.
 *
 * Split out of `config.ts` so the server-only config service maps the backend
 * response the same way without importing the browser API client.
 */

import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/constants";

/**
 * Backend API response format (amounts in cents)
 */
export interface ShopConfigAPIResponse {
  success: boolean;
  data: {
    shipping: {
      free_shipping_threshold_cents: number;
      standard_shipping_fee_cents: number;
    };
  };
}

/**
 * Shipping config in dollars, ready for display and comparisons
 */
export interface ShippingConfig {
  freeShippingThreshold: number;
  standardShippingFee: number;
  /**
   * True when the values are the local constants rather than the backend's.
   * Display can happily use the fallback, but structured data must not: it
   * would state a shipping rate as fact that the shop may not actually charge.
   */
  isFallback: boolean;
}

export const FALLBACK_SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  standardShippingFee: STANDARD_SHIPPING_FEE,
  isFallback: true,
};

/**
 * Convert the backend's cent amounts to dollars, rejecting a payload that does
 * not carry the shipping block rather than defaulting it to zero.
 */
export function toShippingConfig(
  response: ShopConfigAPIResponse
): ShippingConfig {
  if (!response.success || !response.data?.shipping) {
    throw new Error("Invalid API response format");
  }

  return {
    freeShippingThreshold:
      response.data.shipping.free_shipping_threshold_cents / 100,
    standardShippingFee:
      response.data.shipping.standard_shipping_fee_cents / 100,
    isFallback: false,
  };
}

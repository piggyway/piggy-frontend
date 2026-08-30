/**
 * Config Service
 * Fetches public shop configuration (shipping thresholds and fees)
 * from the backend, with local constants as fallback.
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/constants";

/**
 * Backend API response format (amounts in cents)
 */
interface ShopConfigAPIResponse {
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

export class ConfigService {
  /**
   * Get shipping configuration. Falls back to local constants when the
   * backend is unreachable so pricing display never breaks.
   */
  static async getShippingConfig(): Promise<ShippingConfig> {
    try {
      const response = await apiClient.get<ShopConfigAPIResponse>(
        API_ENDPOINTS.CONFIG
      );

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
    } catch (error) {
      console.error("[ConfigService] Failed to fetch shop config:", error);
      return FALLBACK_SHIPPING_CONFIG;
    }
  }
}

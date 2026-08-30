/**
 * Config Service
 * Fetches public shop configuration (shipping thresholds and fees)
 * from the backend, with local constants as fallback.
 *
 * Reads go through the browser-facing `apiClient` and the Next.js API routes.
 * Server components must use `config.server.ts` instead, which talks to the
 * backend directly.
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import {
  FALLBACK_SHIPPING_CONFIG,
  toShippingConfig,
  type ShippingConfig,
  type ShopConfigAPIResponse,
} from "@/lib/services/shipping-config";

// Re-exported so the existing `@/lib/services/config` importers keep working.
export {
  FALLBACK_SHIPPING_CONFIG,
  type ShippingConfig,
} from "@/lib/services/shipping-config";

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

      return toShippingConfig(response);
    } catch (error) {
      console.error("[ConfigService] Failed to fetch shop config:", error);
      return FALLBACK_SHIPPING_CONFIG;
    }
  }
}

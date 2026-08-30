import "server-only";

/**
 * Shop configuration for server components.
 *
 * Identical to `ConfigService` but read straight from the backend. The values
 * are the same for every visitor and change rarely, so the read is cached and
 * carries no client IP.
 */

import { BACKEND_ENDPOINTS } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server-client";
import {
  FALLBACK_SHIPPING_CONFIG,
  toShippingConfig,
  type ShippingConfig,
  type ShopConfigAPIResponse,
} from "@/lib/services/shipping-config";

const CONFIG_REVALIDATE_SECONDS = 300;

export class ServerConfigService {
  /**
   * Get shipping configuration. Falls back to local constants when the
   * backend is unreachable so pricing display never breaks.
   */
  static async getShippingConfig(): Promise<ShippingConfig> {
    try {
      const response = await serverApiClient.get<ShopConfigAPIResponse>(
        BACKEND_ENDPOINTS.CONFIG,
        { revalidate: CONFIG_REVALIDATE_SECONDS }
      );

      return toShippingConfig(response);
    } catch (error) {
      console.error(
        "[ServerConfigService] Failed to fetch shop config:",
        error
      );
      return FALLBACK_SHIPPING_CONFIG;
    }
  }
}

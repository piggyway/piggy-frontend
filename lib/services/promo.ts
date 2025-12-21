/**
 * Promo Code Service
 * Business logic layer for promo code operations
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient, fetchWithAuth } from "@/lib/api/client";
import type {
  ValidatePromoResponse,
  ApplyPromoResponse,
  RemovePromoResponse,
} from "@/lib/types/promo";

export class PromoService {
  /**
   * Validate promo code (does not consume usage count)
   */
  static async validatePromoCode(
    code: string,
    orderAmount: number
  ): Promise<ValidatePromoResponse> {
    try {
      const response = await apiClient.post<ValidatePromoResponse>(
        API_ENDPOINTS.PROMO_VALIDATE,
        {
          code: code.toUpperCase(),
          orderAmount,
        }
      );

      return response;
    } catch (error) {
      console.error("[PromoService] Failed to validate promo code:", error);
      return {
        valid: false,
        error: "validation_error",
        message: "Failed to validate promo code",
      };
    }
  }

  /**
   * Apply promo code to cart (requires authentication)
   */
  static async applyPromoCode(code: string): Promise<ApplyPromoResponse> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PROMO_APPLY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[PromoService] Failed to apply promo code:", error);
      return {
        success: false,
        error: "application_error",
        message: "Failed to apply promo code",
      };
    }
  }

  /**
   * Remove promo code from cart (requires authentication)
   */
  static async removePromoCode(): Promise<RemovePromoResponse> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PROMO_REMOVE, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[PromoService] Failed to remove promo code:", error);
      return {
        success: false,
        error: "removal_error",
        message: "Failed to remove promo code",
      };
    }
  }
}


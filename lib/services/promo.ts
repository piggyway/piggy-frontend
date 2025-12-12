/**
 * Promo Code Service
 * Business logic layer for promo code operations
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
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
      const headers = this.getAuthHeaders();
      const backendUrl = this.getBackendUrl();

      console.log("🔵 [PromoService] Applying promo code:", {
        code: code.toUpperCase(),
        backendUrl: `${backendUrl}/api/v1/promo/apply`,
        hasAuthHeaders: !!headers.Authorization,
      });

      const response = await fetch(`${backendUrl}/api/v1/promo/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await response.json();
      
      console.log("🟢 [PromoService] Promo code apply response:", {
        status: response.status,
        statusText: response.statusText,
        success: data.success,
        message: data.message,
        discountAmount: data.discountAmount,
        promoCode: data.promoCode,
      });
      
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
      const headers = this.getAuthHeaders();
      const backendUrl = this.getBackendUrl();

      const response = await fetch(`${backendUrl}/api/v1/promo/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headers,
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

  /**
   * Get backend URL from environment
   */
  private static getBackendUrl(): string {
    if (typeof window !== "undefined") {
      return (
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
      );
    }
    return process.env.API_BASE_URL || "http://localhost:3001";
  }

  /**
   * Resolve auth headers from browser storage or env for backend calls
   */
  private static getAuthHeaders(): HeadersInit {
    // Client-side: try to pull a token from storage
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      if (token) {
        return {
          Authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
        };
      }
    }

    // Server-side fallback (useful for local testing)
    if (process.env.NEXT_PUBLIC_API_AUTH_TOKEN) {
      return {
        Authorization: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
    }

    return {};
  }
}



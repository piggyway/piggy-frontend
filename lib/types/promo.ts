/**
 * Promo Code Types
 * Types for promo code validation and application
 */

export interface PromoCodeDetails {
  code: string;
  name: string | null;
  description: string | null;
  discountType: "fixed" | "percentage";
  amount: number;
  minOrderAmt: number | null;
}

export interface ValidatePromoResponse {
  valid: boolean;
  promoCode?: PromoCodeDetails;
  discountAmount?: number;
  finalAmount?: number;
  error?: string;
  message?: string;
}

export interface ApplyPromoResponse {
  success: boolean;
  message?: string;
  promoCode?: PromoCodeDetails;
  discountAmount?: number;
  error?: string;
  timestamp?: string;
}

export interface RemovePromoResponse {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
}



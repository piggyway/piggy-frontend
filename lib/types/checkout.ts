/**
 * Checkout Types
 */

export interface CheckoutShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentIntentAmounts {
  subtotalCents: number;
  shippingFeeCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
}

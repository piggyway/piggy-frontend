import { reportError } from "@/lib/monitoring/report";
import type { CartItem } from "@/lib/types/cart";

export type TrackEventName =
  | "boarding_start"
  | "boarding_step_1_done"
  | "booking_submitted";

export type TrackEventProperties = {
  nights?: number;
  pet_count?: number;
};

export type EcommerceEventName =
  | "Product Added"
  | "Checkout Started"
  | "Order Completed";

export interface EcommerceProduct {
  product_id?: string;
  sku?: string;
  category?: string;
  name?: string;
  brand?: string;
  variant?: string;
  price?: number;
  quantity?: number;
  coupon?: string;
}

export interface EcommerceParameters extends EcommerceProduct {
  products?: EcommerceProduct[];
  checkout_id?: string;
  order_id?: string;
  total?: number;
  revenue?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  currency?: string;
  value?: number;
}

interface Zaraz {
  track(
    eventName: TrackEventName,
    eventProperties?: TrackEventProperties
  ): Promise<void>;
  ecommerce(
    eventName: EcommerceEventName,
    parameters: EcommerceParameters
  ): Promise<void>;
}

declare global {
  interface Window {
    zaraz?: Zaraz;
  }
}

function sendToZaraz(
  scope: string,
  eventName: string,
  call: (zaraz: Zaraz) => Promise<void>
): void {
  if (typeof window === "undefined" || !window.zaraz) return;

  const report = (error: unknown) =>
    reportError(error, { scope, level: "warning", tags: { eventName } });

  try {
    Promise.resolve(call(window.zaraz)).catch(report);
  } catch (error) {
    report(error);
  }
}

export function trackEvent(
  name: TrackEventName,
  properties?: TrackEventProperties
): void {
  sendToZaraz("analytics.trackEvent", name, (zaraz) =>
    zaraz.track(name, properties)
  );
}

export function trackEcommerce(
  name: EcommerceEventName,
  parameters: EcommerceParameters
): void {
  sendToZaraz("analytics.trackEcommerce", name, (zaraz) =>
    zaraz.ecommerce(name, parameters)
  );
}

export function toEcommerceProduct(item: CartItem): EcommerceProduct {
  const variant = item.variantOptions.map((option) => option.value).join(" / ");
  return {
    product_id: String(item.variantRid),
    sku: item.variantSku ?? undefined,
    name: item.productTitle,
    variant: variant || undefined,
    price: item.unitPriceCents / 100,
    quantity: item.quantity,
  };
}

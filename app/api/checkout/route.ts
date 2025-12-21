
/**
 * Checkout API Route
 * Proxies checkout session creation to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const DEFAULT_EMAIL = "zianwang9911@gmail.com";
const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type CartItemPayload = {
  id: string;
  productRid?: number | null;
  variantRid?: number | null;
  productTitle: string;
  variantSku: string | null;
  quantity: number;
  unitPriceCents: number;
  lineSubtotalCents: number;
  imageUrl: string;
  currency: string;
};

type CheckoutRequestBody = {
  email?: string;
  fulfillmentType?: "delivery" | "pickup";

  // legacy (keep)
  pickupDate?: string;
  pickupTime?: string;

  // NEW (recommended)
  pickupLocationId?: string | null;
  pickupSlotId?: string | null;

  cartId?: string | number;
  cartItems?: CartItemPayload[];
  currency?: string;
  promoCode?: string;
  userId?: string;
};

// Helpers
function toIntOrNull(v: any): number | null {
  if (v == null) return null;
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as CheckoutRequestBody;

    const fulfillmentType: "delivery" | "pickup" = body.fulfillmentType || "delivery";

    // Validate pickup requirements at edge (frontend can still show better UI errors)
    if (fulfillmentType === "pickup") {
      if (!body.pickupLocationId) {
        return NextResponse.json(
          { error: { message: "pickupLocationId is required for pickup" } },
          { status: 400 },
        );
      }
      if (!body.pickupSlotId) {
        return NextResponse.json(
          { error: { message: "pickupSlotId is required for pickup" } },
          { status: 400 },
        );
      }
    }

    // Transform camelCase to snake_case for backend
    const backendPayload = {
      email: body.email || DEFAULT_EMAIL,
      fulfillment_type: fulfillmentType,

      // NEW IDs (preferred)
      pickup_location_id: fulfillmentType === "pickup" ? body.pickupLocationId || "" : "",
      pickup_slot_id: fulfillmentType === "pickup" ? body.pickupSlotId || "" : "",

      // legacy (optional)
      pickup_date: body.pickupDate,
      pickup_time: body.pickupTime,

      cart_id: body.cartId != null ? String(body.cartId) : undefined,
      cart_items: body.cartItems?.map((item) => ({

        id: String(item.id), // Ensure id is a string
        product_rid:
          item.productRid == null
            ? null
            : Number.parseInt(String(item.productRid), 10),
        variant_rid:
          item.variantRid == null
            ? null
            : Number.parseInt(String(item.variantRid), 10),

        product_title: item.productTitle,
        variant_sku: item.variantSku,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
        line_subtotal_cents: item.lineSubtotalCents,
        image_url: item.imageUrl,

        currency: item.currency || body.currency || "aud", // Ensure currency is never null
      })),
      currency: body.currency || "aud",

      promo_code: body.promoCode,
      user_id: body.userId,
    };


    // #region agent log (debug-session)
    fetch("http://127.0.0.1:7244/ingest/4d167c0f-d521-47a0-b9c1-cf8baf1e5421", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pickup-route-fix",
        hypothesisId: "B",
        location: "piggy-frontend/app/api/checkout/route.ts:POST",
        message: "Proxy -> backend payload (sanitized)",
        data: {
          hasEmail: !!backendPayload.email,
          emailLen: (backendPayload.email || "").length,
          fulfillmentType: backendPayload.fulfillment_type,
          hasPickupIds:
            !!backendPayload.pickup_location_id && !!backendPayload.pickup_slot_id,
          cartItemCount: Array.isArray(backendPayload.cart_items)
            ? backendPayload.cart_items.length
            : 0,
          currency: backendPayload.currency,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log (debug-session)


    const origin = request.headers.get("origin") || "http://localhost:3000";
    const token = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: origin,
    };
    if (token) headers.Authorization = token;

    const res = await fetch(`${API_BASE_URL}/api/v1/checkout/session`, {
      method: "POST",
      headers,
      body: JSON.stringify(backendPayload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // Extract error message, handling different response structures
      let errorMessage = "Failed to create checkout session";

      if (data) {
        // Zod validation errors (array)
        if (Array.isArray(data)) {
          const errors = data
            .map((err: any) => {
              const path = err.path?.join(".") || "unknown";
              return `${path}: ${err.message}`;
            })
            .join(", ");
          errorMessage = `Validation error: ${errors}`;
        } else if (typeof data.message === "string") {
          errorMessage = data.message;
        } else if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (typeof data.error?.message === "string") {
          errorMessage = data.error.message;
        } else if (
          data.error &&
          typeof data.error === "object" &&
          "message" in data.error &&
          typeof data.error.message === "string"
        ) {
          errorMessage = data.error.message;
        }
      }

      console.error("[Checkout API] Error from backend:", {
        status: res.status,
        data,
        errorMessage,
      });

      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: res.status },
      );
    }

    // Backend might wrap in { success, data: { url } } or return { url }
    const url = data?.data?.url || data?.url;
    if (!url) {
      return NextResponse.json(
        { error: { message: "Backend did not return checkout URL" } },
        { status: 500 },
      );
    }

    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error("[API Route Error] Failed to create checkout session:", err);
    const errorMessage =
      err?.message && typeof err.message === "string"
        ? err.message
        : "Failed to create checkout session";

    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );

    
  }
}

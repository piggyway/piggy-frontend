/**
 * Payment Intent API Route
 * Proxies PaymentIntent creation/update to the backend service for the
 * on-site Stripe Payment Element flow. Amounts are computed by the backend
 * from the server-side cart; this route only maps casing and forwards auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type ShippingAddressPayload = {
  name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
};

type PaymentIntentRequestBody = {
  email?: string;
  fulfillmentType?: "delivery" | "pickup";
  pickupLocationId?: number;
  pickupSlotId?: number;
  promoCode?: string;
  marketingOptIn?: boolean;
  shippingAddress?: ShippingAddressPayload;
  paymentIntentId?: string;
};

function extractErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Failed to create payment intent";
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.message === "string") return obj.message;
  if (typeof obj.error === "string") return obj.error;
  if (
    obj.error &&
    typeof obj.error === "object" &&
    typeof (obj.error as Record<string, unknown>).message === "string"
  ) {
    return (obj.error as Record<string, string>).message;
  }
  return "Failed to create payment intent";
}

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as PaymentIntentRequestBody;

    const backendPayload = {
      email: body.email,
      fulfillment_type: body.fulfillmentType || "delivery",
      pickup_location_id: body.pickupLocationId,
      pickup_slot_id: body.pickupSlotId,
      promo_code: body.promoCode,
      ...(body.marketingOptIn === true ? { marketing_opt_in: true } : {}),
      shipping_address: body.shippingAddress
        ? {
            name: body.shippingAddress.name,
            phone: body.shippingAddress.phone || undefined,
            line1: body.shippingAddress.line1,
            line2: body.shippingAddress.line2 || undefined,
            city: body.shippingAddress.city,
            state: body.shippingAddress.state,
            postal_code: body.shippingAddress.postalCode,
            country: body.shippingAddress.country || "AU",
          }
        : undefined,
      payment_intent_id: body.paymentIntentId,
    };

    const token = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = token;
    }
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    const res = await backendFetch(
      `${API_BASE_URL}/api/v1/checkout/payment-intent`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(backendPayload),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = extractErrorMessage(data);
      console.error("[Payment Intent API] Error from backend:", {
        status: res.status,
        errorMessage,
      });
      return NextResponse.json(
        { error: { message: errorMessage } },
        { status: res.status }
      );
    }

    const result = data?.data;
    if (!result?.client_secret) {
      return NextResponse.json(
        { error: { message: "Backend returned no client secret" } },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        clientSecret: result.client_secret,
        paymentIntentId: result.payment_intent_id,
        amounts: {
          subtotalCents: result.amounts?.subtotal_cents ?? 0,
          shippingFeeCents: result.amounts?.shipping_fee_cents ?? 0,
          discountCents: result.amounts?.discount_cents ?? 0,
          totalCents: result.amounts?.total_cents ?? 0,
          currency: result.amounts?.currency ?? "aud",
        },
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[Payment Intent API] Failed:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create payment intent";
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );
  }
}

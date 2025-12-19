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
  pickupDate?: string;
  pickupTime?: string;
  cartId?: string | number;
  cartItems?: CartItemPayload[];
  currency?: string;
  promoCode?: string;
  userId?: string;
};

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;

    // Transform camelCase to snake_case for backend
    const backendPayload = {
      email: body.email || DEFAULT_EMAIL,
      fulfillment_type: body.fulfillmentType || "delivery",
      pickup_date: body.pickupDate,
      pickup_time: body.pickupTime,
      cart_id: body.cartId != null ? String(body.cartId) : undefined,
      cart_items: body.cartItems?.map((item) => ({
        id: String(item.id), // Ensure id is a string
        product_rid:
          item.productRid == null ? null : Number.parseInt(String(item.productRid), 10),
        variant_rid:
          item.variantRid == null ? null : Number.parseInt(String(item.variantRid), 10),
        product_title: item.productTitle,
        variant_sku: item.variantSku,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
        line_subtotal_cents: item.lineSubtotalCents,
        image_url: item.imageUrl,
        currency: item.currency || body.currency || "usd", // Ensure currency is never null
      })),
      currency: body.currency || "usd",
      promo_code: body.promoCode,
      user_id: body.userId,
    };

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const token = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: origin,
    };

    if (token) {
      headers.Authorization = token;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/checkout/session`, {
      method: "POST",
      headers,
      body: JSON.stringify(backendPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Extract error message, handling different response structures
      let errorMessage = "Failed to create checkout session";
      
      if (data) {
        // Handle Zod validation errors (array format)
        if (Array.isArray(data)) {
          const errors = data.map((err: any) => {
            const path = err.path?.join('.') || 'unknown';
            return `${path}: ${err.message}`;
          }).join(', ');
          errorMessage = `Validation error: ${errors}`;
        } else if (typeof data.message === "string") {
          errorMessage = data.message;
        } else if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (typeof data.error?.message === "string") {
          errorMessage = data.error.message;
        } else if (data.error && typeof data.error === "object" && "message" in data.error && typeof data.error.message === "string") {
          errorMessage = data.error.message;
        }
      }
      
      console.error("[Checkout API] Error from backend:", {
        status: res.status,
        data,
        errorMessage,
      });
      
      return NextResponse.json(
        {
          error: {
            message: errorMessage,
          },
        },
        { status: res.status }
      );
    }

    // Extract URL from backend response (which wraps it in success/data)
    const url = data.data?.url || data.url;
    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error("[API Route Error] Failed to create checkout session:", err);
    const errorMessage = err?.message && typeof err.message === "string" 
      ? err.message 
      : "Failed to create checkout session";
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );
  }
}

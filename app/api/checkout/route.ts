/**
 * Checkout API Route
 * Proxies checkout session creation to the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type CheckoutRequestBody = {
  email?: string;
  fulfillmentType?: "delivery" | "pickup";
  pickupLocationId?: number;
  pickupSlotId?: number;
  promoCode?: string;
};

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as CheckoutRequestBody;
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json(
        { error: { message: "Email is required" } },
        { status: 400 }
      );
    }

    // Transform camelCase to snake_case for backend
    const backendPayload = {
      email,
      fulfillment_type: body.fulfillmentType || "delivery",
      pickup_location_id: body.pickupLocationId,
      pickup_slot_id: body.pickupSlotId,
      promo_code: body.promoCode,
    };

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const token = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Origin: origin,
    };

    if (token) {
      headers.Authorization = token;
    }
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    const res = await backendFetch(`${API_BASE_URL}/api/v1/checkout/session`, {
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
          const errors = data
            .map((err: unknown) => {
              if (!err || typeof err !== "object") {
                return "unknown: undefined";
              }

              const error = err as Record<string, unknown>;
              const path = Array.isArray(error.path)
                ? error.path.join(".")
                : "unknown";
              return `${path}: ${error.message}`;
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
  } catch (err: unknown) {
    console.error("[API Route Route] Failed to create checkout session:", err);
    const error = err && typeof err === "object" ? err : null;
    const errorMessage =
      error && "message" in error && typeof error.message === "string"
        ? error.message
        : "Failed to create checkout session";
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 }
    );
  }
}

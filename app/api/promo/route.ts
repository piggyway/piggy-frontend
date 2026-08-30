/**
 * Promo Code API Route
 * Proxies promo code validation requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * POST /api/promo - Validate promo code
 */
export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = await request.json();
    const { code, orderAmount } = body;

    if (!code || typeof orderAmount !== "number") {
      return NextResponse.json(
        {
          valid: false,
          error: "invalid_request",
          message: "Invalid request parameters",
        },
        { status: 400 }
      );
    }

    const res = await backendFetch(`${API_BASE_URL}/api/v1/promo/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, orderAmount }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to validate promo code:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "validation_error",
        message: "Failed to validate promo code",
      },
      { status: 500 }
    );
  }
}

/**
 * Cart Items API Route
 * Adds an item to the cart via the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = request.headers.get("authorization") || undefined;
    const sessionId = request.headers.get("x-session-id") || undefined;
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/api/v1/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
        ...(sessionId ? { "X-Session-Id": sessionId } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to add cart item:", error);
    return NextResponse.json(
      { error: "Failed to add cart item" },
      { status: 500 }
    );
  }
}

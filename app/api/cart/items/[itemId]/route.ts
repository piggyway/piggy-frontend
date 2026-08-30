/**
 * Cart Item API Route
 * Updates or removes a cart item via the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const { itemId } = await params;
    const token = request.headers.get("authorization") || undefined;
    const sessionId = request.headers.get("x-session-id") || undefined;
    const body = await request.json();

    const res = await backendFetch(
      `${API_BASE_URL}/api/v1/cart/items/${encodeURIComponent(itemId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
          ...(sessionId ? { "X-Session-Id": sessionId } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to update cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const { itemId } = await params;
    const token = request.headers.get("authorization") || undefined;
    const sessionId = request.headers.get("x-session-id") || undefined;

    const res = await backendFetch(
      `${API_BASE_URL}/api/v1/cart/items/${encodeURIComponent(itemId)}`,
      {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: token } : {}),
          ...(sessionId ? { "X-Session-Id": sessionId } : {}),
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to remove cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}

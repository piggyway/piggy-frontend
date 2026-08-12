/**
 * Cart API Route
 * Proxies cart requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    console.log("📦 [Cart API Route] Request headers:", {
      hasAuthorization: !!token,
      hasSessionId: !!sessionId,
      authorizationHeader: token ? `${token.substring(0, 20)}...` : "none",
      sessionId: sessionId || "none",
    });

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    if (!token && !sessionId) {
      console.warn(
        "⚠️ [Cart API Route] No authorization header OR session ID found"
      );
    }

    // Forward query parameters (cursor, limit) to backend
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const backendUrl = queryString
      ? `${API_BASE_URL}/api/v1/cart?${queryString}`
      : `${API_BASE_URL}/api/v1/cart`;

    const res = await backendFetch(backendUrl, {
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to fetch cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

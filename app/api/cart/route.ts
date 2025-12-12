/**
 * Cart API Route
 * Proxies cart requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = request.headers.get("authorization");
    
    console.log("📦 [Cart API Route] Request headers:", {
      hasAuthorization: !!token,
      authorizationHeader: token ? `${token.substring(0, 20)}...` : "none",
    });

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    } else {
      console.warn("⚠️ [Cart API Route] No authorization header found");
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/cart`, {
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

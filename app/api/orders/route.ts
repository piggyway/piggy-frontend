/**
 * Orders API Route
 * Proxies order list requests to the backend service
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

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    const page = request.nextUrl.searchParams.get("page") || undefined;
    const limit = request.nextUrl.searchParams.get("limit") || undefined;

    const url = new URL(`${API_BASE_URL}/api/v1/orders`);
    if (page) url.searchParams.set("page", page);
    if (limit) url.searchParams.set("limit", limit);

    const res = await backendFetch(url.toString(), { headers });
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Orders API Route] Failed to list orders:", error);
    return NextResponse.json(
      { error: "Failed to list orders" },
      { status: 500 }
    );
  }
}

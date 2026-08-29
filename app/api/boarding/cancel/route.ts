/**
 * Boarding Cancel API Route
 * Proxies guest cancel (reference + email) to the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = await request.json();

    // backendFetch adds the client IP the platform resolved; a caller-supplied
    // x-forwarded-for is spoofable and must not become the rate-limit key.
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const res = await backendFetch(`${API_BASE_URL}/api/v1/boarding/cancel`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Boarding API Route] Failed to cancel booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel boarding booking" },
      { status: 500 }
    );
  }
}

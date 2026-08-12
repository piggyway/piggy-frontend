/**
 * Boarding Lookup API Route
 * Proxies guest boarding lookup (reference + email) to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const body = await request.json();

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // The backend rate limits per IP; without this every request looks identical
    if (ip) {
      headers["x-forwarded-for"] = ip;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/boarding/lookup`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Boarding API Route] Failed to look up booking:", error);
    return NextResponse.json(
      { error: "Failed to look up boarding booking" },
      { status: 500 }
    );
  }
}

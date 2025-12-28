/**
 * Pickup Available Dates API Route
 * Proxies requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const token = request.headers.get("authorization");
    const sessionId = request.headers.get("x-session-id");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }
    if (sessionId) {
      headers["X-Session-Id"] = sessionId;
    }

    const backendUrl = `${API_BASE_URL}/api/v1/pickup/available-dates?${queryString}`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to fetch available dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch available dates" },
      { status: 500 }
    );
  }
}

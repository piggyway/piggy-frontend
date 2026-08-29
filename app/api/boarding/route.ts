/**
 * Boarding API Route
 * Proxies boarding booking create/list requests to the backend service
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

    const token = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    // The backend rate limits per IP. backendFetch adds the client IP the
    // platform resolved; x-forwarded-for and x-real-ip off the incoming
    // request are spoofable and must not become that key.
    const res = await backendFetch(`${API_BASE_URL}/api/v1/boarding`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Boarding API Route] Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create boarding booking" },
      { status: 500 }
    );
  }
}

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

    const limit = request.nextUrl.searchParams.get("limit") || undefined;
    const offset = request.nextUrl.searchParams.get("offset") || undefined;

    const url = new URL(`${API_BASE_URL}/api/v1/boarding`);
    if (limit) url.searchParams.set("limit", limit);
    if (offset) url.searchParams.set("offset", offset);

    const res = await backendFetch(url.toString(), { headers });
    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Boarding API Route] Failed to list bookings:", error);
    return NextResponse.json(
      { error: "Failed to list boarding bookings" },
      { status: 500 }
    );
  }
}

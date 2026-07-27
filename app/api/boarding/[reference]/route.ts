/**
 * Boarding Detail API Route
 * Proxies boarding booking detail requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const { reference } = await params;

    const token = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/v1/boarding/${encodeURIComponent(reference)}`,
      {
        headers,
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Boarding API Route] Failed to fetch booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch boarding booking" },
      { status: 500 }
    );
  }
}

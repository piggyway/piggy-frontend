/**
 * Boarding Agreement API Route
 * Proxies the public agreement read (by signing token) to the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch, relayUpstreamError } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const { token } = await params;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const userAgent = request.headers.get("user-agent");
    if (userAgent) {
      headers["user-agent"] = userAgent;
    }

    const res = await backendFetch(
      `${API_BASE_URL}/api/v1/boarding/agreements/${encodeURIComponent(token)}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return relayUpstreamError(res, "agreement_unavailable");
    }

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("[Boarding API Route] Failed to load agreement:", error);
    return NextResponse.json(
      { error: "Failed to load boarding agreement" },
      { status: 500 }
    );
  }
}

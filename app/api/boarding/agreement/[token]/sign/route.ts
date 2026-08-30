/**
 * Boarding Agreement Sign API Route
 * Proxies the customer's signature submission to the backend service
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch, relayUpstreamError } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const { token } = await params;
    const body = await request.json();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Stored on the signed agreement as part of the signer's audit trail
    const userAgent = request.headers.get("user-agent");
    if (userAgent) {
      headers["user-agent"] = userAgent;
    }

    const res = await backendFetch(
      `${API_BASE_URL}/api/v1/boarding/agreements/${encodeURIComponent(
        token
      )}/sign`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      return relayUpstreamError(res, "agreement_sign_failed");
    }

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[Boarding API Route] Failed to sign agreement:", error);
    return NextResponse.json(
      { error: "Failed to sign boarding agreement" },
      { status: 500 }
    );
  }
}

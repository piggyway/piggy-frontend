/**
 * Boarding Agreement PDF API Route
 * Proxies the signed agreement PDF download (by signing token) to the backend service
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
      `${API_BASE_URL}/api/v1/boarding/agreements/${encodeURIComponent(
        token
      )}/pdf`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return relayUpstreamError(res, "agreement_pdf_unavailable");
    }

    const responseHeaders = new Headers({
      "Cache-Control": "private, no-store",
    });

    const contentType = res.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    const contentDisposition = res.headers.get("content-disposition");
    if (contentDisposition) {
      responseHeaders.set("Content-Disposition", contentDisposition);
    }

    const contentSha256 = res.headers.get("x-content-sha256");
    if (contentSha256) {
      responseHeaders.set("X-Content-Sha256", contentSha256);
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Boarding API Route] Failed to download agreement:", error);
    return NextResponse.json(
      { error: "Failed to download boarding agreement" },
      { status: 500 }
    );
  }
}

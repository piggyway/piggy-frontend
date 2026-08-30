/**
 * Single Product API Route
 * Fetches product detail by slug from backend
 */

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendFetch, upstreamErrorResponse } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/products/[slug]
 * Fetch single product by slug from backend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = request.headers.get("authorization");
    const previewSecret = process.env.PREVIEW_SECRET;

    // Check draft mode from cookies
    const { isEnabled: isDraftMode } = await draftMode();

    // Server components fetch this route without the draft-mode cookie, so they
    // ask for drafts with include_draft plus the preview secret. The secret is
    // required: the query parameter alone must never expose unpublished data.
    const includeDraftParam =
      request.nextUrl.searchParams.get("include_draft") === "true";
    const presentedSecret = request.headers.get("x-preview-secret");
    const paramAuthorized =
      includeDraftParam &&
      Boolean(previewSecret) &&
      presentedSecret === previewSecret;

    const allowDraft = (isDraftMode || paramAuthorized) && previewSecret;

    const url = new URL(
      `${API_BASE_URL}/api/v1/products/${encodeURIComponent(slug)}`
    );
    if (allowDraft) {
      url.searchParams.set("include_draft", "true");
    }

    const fetchHeaders: Record<string, string> = {
      Authorization: token || "",
    };
    if (allowDraft) {
      fetchHeaders["x-preview-secret"] = previewSecret as string;
    }

    const res = await backendFetch(url.toString(), {
      headers: fetchHeaders,
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      // Any other upstream status is relayed as itself. A throttle (429) must
      // not reach the page as a 500, and must never look like a 404.
      return upstreamErrorResponse(res, "Failed to fetch product");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Route Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * Single Product API Route
 * Fetches product detail by slug from backend
 */

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const { isEnabled: isDraftMode } = await draftMode();
    const allowDraft = Boolean(isDraftMode && previewSecret);

    const url = new URL(`${API_BASE_URL}/api/v1/products/${slug}`);
    if (allowDraft) {
      url.searchParams.set("include_draft", "true");
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: token || "",
        ...(allowDraft ? { "x-preview-secret": previewSecret as string } : {}),
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      throw new Error(`Backend returned ${res.status}`);
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

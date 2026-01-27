/**
 * Products API Route
 * Acts as a proxy layer between frontend and Railway backend
 */

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/products
 * Fetch all products from backend
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const previewSecret = process.env.PREVIEW_SECRET;
    const { isEnabled: isDraftMode } = await draftMode();

    // Only allow draft products when draft mode is explicitly enabled
    // This ensures draft products are only visible in preview mode
    const allowDraft = isDraftMode && previewSecret;

    // Build URL with query params
    const searchParams = request.nextUrl.searchParams;
    const url = new URL(`${API_BASE_URL}/api/v1/products`);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    if (allowDraft) {
      url.searchParams.set("include_draft", "true");
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: token || "",
        ...(allowDraft ? { "x-preview-secret": previewSecret as string } : {}),
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Route Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("[API Route Error]", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

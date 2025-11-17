/**
 * Single Product API Route
 * Fetches product detail by slug from backend
 */

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

    const res = await fetch(`${API_BASE_URL}/api/v1/products/${slug}`, {
      headers: {
        Authorization: token || "",
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

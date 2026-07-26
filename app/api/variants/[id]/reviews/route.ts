import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/variants/[id]/reviews
 * Fetch reviews for a specific variant from backend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization");

    const res = await fetch(
      `${API_BASE_URL}/api/v1/variants/${encodeURIComponent(id)}/reviews`,
      {
        headers: {
          Authorization: token || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Variant not found" },
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
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

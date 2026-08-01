/**
 * Config API Route
 * Proxies the public shop configuration (shipping thresholds and fees)
 * from the backend.
 */

import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/config
 * Fetch public shop configuration from backend
 */
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/config`, {
      // Config rarely changes; cache upstream responses for 5 minutes
      next: { revalidate: 300 },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch shop config" },
      { status: 500 }
    );
  }
}

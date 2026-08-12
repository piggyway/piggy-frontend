/**
 * Categories API Route (Controller Layer)
 * Proxies requests to the backend product-categories endpoint
 */

import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/categories
 */
export async function GET() {
  try {
    // 1. Build backend API URL
    const url = new URL(`${API_BASE_URL}/api/v1/product-categories`);

    // 2. Get authentication information (if needed)
    // const token = request.headers.get("authorization");

    // 3. Call backend API
    const res = await backendFetch(url.toString(), {
      method: "GET",
      // headers: {
      //   ...(token && { Authorization: token }),
      // },
      // Next.js cache configuration
      next: {
        revalidate: 300, // 5 minutes cache, category data doesn't change often
      },
    });

    // 4. Check response status
    if (!res.ok) {
      console.error(
        `[Categories API] Backend returned ${res.status}: ${res.statusText}`
      );
      throw new Error(`Backend API error: ${res.status}`);
    }

    // 5. Parse response data
    const data = await res.json();

    // 6. Return data
    return NextResponse.json(data, {
      headers: {
        // Add cache control header
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    // 7. Error handling
    console.error("[Categories API Route] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

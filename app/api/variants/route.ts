/**
 * Variants API Route
 * Acts as a proxy layer between frontend and Railway backend
 */

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

const CACHE_REVALIDATE_SECONDS = 300;

/**
 * GET /api/variants
 * Fetch all variants from backend
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    // Build URL with query params
    const searchParams = request.nextUrl.searchParams;
    const url = new URL(`${API_BASE_URL}/api/v1/variants`);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Next keys the fetch cache on the full upstream URL, so every filter,
    // page and sort combination gets its own entry. Free-text search is left
    // uncached: `q` is unbounded, so caching it would fill the data cache with
    // single-use entries. Authorized calls are uncached as well, so a
    // per-caller response can never be served to somebody else.
    const isCacheable = !searchParams.has("q") && !token;

    const res = await backendFetch(url.toString(), {
      headers: {
        Authorization: token || "",
      },
      ...(isCacheable
        ? { next: { revalidate: CACHE_REVALIDATE_SECONDS } }
        : { cache: "no-store" as const }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}

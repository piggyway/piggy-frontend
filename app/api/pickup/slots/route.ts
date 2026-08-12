import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend-fetch";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/pickup/slots
 * Fetch pickup slots by location and date
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    // Build URL with query params
    const searchParams = request.nextUrl.searchParams;
    const url = new URL(`${API_BASE_URL}/api/v1/pickup/slots/by-date`);

    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const res = await backendFetch(url.toString(), {
      headers: {
        Authorization: token || "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch pickup slots" },
      { status: 500 }
    );
  }
}

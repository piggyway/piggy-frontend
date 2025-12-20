import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = token;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/promo/remove`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to remove promo code:", error);
    return NextResponse.json(
      { success: false, error: "removal_error", message: "Failed to remove promo code" },
      { status: 500 }
    );
  }
}

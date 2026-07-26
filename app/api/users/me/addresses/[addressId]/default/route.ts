/**
 * User Addresses API Route (set default)
 * Proxies default-address requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type Params = { addressId: string };

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<Params> }
) {
  try {
    if (!API_BASE_URL) throw new Error("Missing API_BASE_URL");

    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    const { addressId } = await ctx.params;

    const res = await fetch(
      `${API_BASE_URL}/api/v1/users/me/addresses/${encodeURIComponent(addressId)}/default`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to set default address:", error);
    return NextResponse.json(
      {
        error: "set_default_address_failed",
        message: "Failed to set default address",
      },
      { status: 500 }
    );
  }
}

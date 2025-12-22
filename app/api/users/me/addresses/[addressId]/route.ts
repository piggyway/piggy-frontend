/**
 * User Addresses API Route (single resource)
 * Proxies address book requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type Params = { addressId: string };

export async function GET(
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
      `${API_BASE_URL}/api/v1/users/me/addresses/${addressId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to get address:", error);
    return NextResponse.json(
      { error: "get_address_failed", message: "Failed to get address" },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();

    const res = await fetch(
      `${API_BASE_URL}/api/v1/users/me/addresses/${addressId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to update address:", error);
    return NextResponse.json(
      { error: "update_address_failed", message: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      `${API_BASE_URL}/api/v1/users/me/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to delete address:", error);
    return NextResponse.json(
      { error: "delete_address_failed", message: "Failed to delete address" },
      { status: 500 }
    );
  }
}

/**
 * User Addresses API Route (collection)
 * Proxies address book requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    if (!API_BASE_URL) throw new Error("Missing API_BASE_URL");

    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/users/me/addresses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to list addresses:", error);
    return NextResponse.json(
      { error: "list_addresses_failed", message: "Failed to list addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) throw new Error("Missing API_BASE_URL");

    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/api/v1/users/me/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to create address:", error);
    return NextResponse.json(
      { error: "create_address_failed", message: "Failed to create address" },
      { status: 500 }
    );
  }
}



/**
 * User Profile API Route
 * Proxies user profile requests to the backend service
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /api/users/me - Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to get user profile:", error);
    return NextResponse.json(
      { error: "get_profile_failed", message: "Failed to get user profile" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/me - Update current user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API Route Error] Failed to update user profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "update_profile_failed",
        message: "Failed to update user profile",
      },
      { status: 500 }
    );
  }
}





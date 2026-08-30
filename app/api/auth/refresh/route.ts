/**
 * Auth Refresh API Route
 * Proxies refresh requests to the backend using the refreshToken stored in NextAuth JWT.
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken, JWT } from "next-auth/jwt";
import { backendFetch } from "@/lib/api/backend-fetch";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type AuthRefreshBody = {
  accessToken?: string;
  error?: string;
  message?: string;
};

function extractRtFromSetCookie(setCookie: string | null): string | null {
  if (!setCookie) return null;
  const m = setCookie.match(/(?:^|;\s*)rt=([^;]+)/);
  return m?.[1] ?? null;
}

function parseJsonBody<T>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/auth/refresh
 * Returns: { accessToken, refreshToken? }
 */
export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      throw new Error("Missing API_BASE_URL");
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const refreshToken = (token as JWT | null)?.refreshToken;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "unauthorized", message: "Missing refresh token" },
        { status: 401 }
      );
    }

    const res = await backendFetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        // Backend expects refresh token in cookie named "rt"
        Cookie: `rt=${refreshToken}`,
      },
    });

    const bodyText = await res.text();
    const body = parseJsonBody<AuthRefreshBody>(bodyText);

    if (!res.ok) {
      return NextResponse.json(body ?? { error: "refresh_failed" }, {
        status: res.status,
      });
    }

    const accessToken = body?.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "refresh_failed", message: "Missing access token" },
        { status: 500 }
      );
    }

    const setCookie = res.headers.get("set-cookie");
    const newRefreshToken = extractRtFromSetCookie(setCookie);

    const response = NextResponse.json(
      {
        accessToken,
        refreshToken: newRefreshToken ?? refreshToken,
      },
      { status: 200 }
    );

    // Optional: also set a frontend-domain cookie for debugging/compat.
    // Backend cookie is on backend domain; browser JS cannot reliably access it.
    if (newRefreshToken) {
      response.cookies.set("rt", newRefreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("[API Route Error] Failed to refresh token:", error);
    return NextResponse.json(
      { error: "refresh_failed", message: "Failed to refresh token" },
      { status: 500 }
    );
  }
}

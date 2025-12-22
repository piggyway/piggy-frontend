/**
 * Auth Service (Frontend)
 * Calls Next.js API Routes for auth operations (not the backend directly).
 */

export type RefreshTokensResponse = {
  accessToken: string;
  refreshToken?: string;
};

/**
 * Refresh tokens via Next.js proxy route.
 *
 * - Uses the current NextAuth session (server-side) to read refreshToken
 * - Rotates refresh token in backend and returns a new access token
 */
export async function refreshTokens(): Promise<RefreshTokensResponse | null> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as RefreshTokensResponse;
    if (!data?.accessToken) {
      return null;
    }
    return data;
  } catch (err) {
    console.error("[AuthService] Failed to refresh tokens:", err);
    return null;
  }
}

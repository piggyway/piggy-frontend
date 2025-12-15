import { useSession } from "next-auth/react";
import { useCallback } from "react";

import { refreshTokens } from "@/lib/services/auth";

export function useSessionRefresh() {
  const { update } = useSession();

  const refreshSession = useCallback(async () => {
    const refreshed = await refreshTokens();
    if (!refreshed?.accessToken) {
      // Fall back to NextAuth update (re-fetch session)
      await update();
      return;
    }

    // Keep client-side API calls working
    if (typeof window !== "undefined") {
      const bearer = refreshed.accessToken.startsWith("Bearer")
        ? refreshed.accessToken
        : `Bearer ${refreshed.accessToken}`;
      localStorage.setItem("access_token", bearer);
    }

    // Update NextAuth JWT via trigger="update"
    await update({
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
    } as any);
  }, [update]);

  return refreshSession;
}

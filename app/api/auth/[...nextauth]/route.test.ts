import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

let authOptions: NextAuthOptions;

type JwtCallback = NonNullable<
  NonNullable<NextAuthOptions["callbacks"]>["jwt"]
>;
type SessionCallback = NonNullable<
  NonNullable<NextAuthOptions["callbacks"]>["session"]
>;
type SignInCallback = NonNullable<
  NonNullable<NextAuthOptions["callbacks"]>["signIn"]
>;

function callJwt(args: unknown) {
  const jwt = authOptions.callbacks!.jwt as JwtCallback;
  return jwt(args as Parameters<JwtCallback>[0]);
}

function callSession(args: unknown) {
  const session = authOptions.callbacks!.session as SessionCallback;
  return session(args as Parameters<SessionCallback>[0]);
}

function callSignIn(args: unknown) {
  const signIn = authOptions.callbacks!.signIn as SignInCallback;
  return signIn(args as Parameters<SignInCallback>[0]);
}

function credentialsAuthorize(credentials: Record<string, string> | undefined) {
  // next-auth keeps the caller-supplied config (including the real authorize)
  // under `options`; the top-level authorize is the library's null default.
  const provider = authOptions.providers.find(
    (p) => p.type === "credentials"
  ) as unknown as {
    options: {
      authorize: (
        c: Record<string, string> | undefined
      ) => Promise<Record<string, unknown> | null>;
    };
  };
  return provider.options.authorize(credentials);
}

function makeAccessToken(expiresAtMs: number) {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(expiresAtMs / 1000) })
  ).toString("base64url");
  return `header.${payload}.signature`;
}

const HOUR = 60 * 60 * 1000;

describe("NextAuth authOptions", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    process.env.NEXTAUTH_SECRET = "test-secret";
    ({ authOptions } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("email credentials provider", () => {
    it("builds a user with the backend session from the submitted credentials", async () => {
      const user = await credentialsAuthorize({
        accessToken: "access-1",
        refreshToken: "refresh-1",
        user: JSON.stringify({
          id: "user-1",
          email: "jane@example.com",
          firstName: "Jane",
          displayName: "Jane D",
          avatarUrl: "https://cdn.example/a.png",
        }),
      });

      expect(user).toMatchObject({
        id: "user-1",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "",
        name: "Jane D",
        image: "https://cdn.example/a.png",
        backendSession: {
          accessToken: "access-1",
          refreshToken: "refresh-1",
        },
      });
    });

    it("falls back to the email when the account has no display name", async () => {
      const user = await credentialsAuthorize({
        accessToken: "access-1",
        user: JSON.stringify({ id: "user-1", email: "jane@example.com" }),
      });

      expect(user).toMatchObject({ name: "jane@example.com" });
    });

    it.each([
      ["no credentials at all", undefined],
      ["a missing access token", { user: '{"id":"user-1"}' }],
      ["a missing user payload", { accessToken: "access-1" }],
    ])("refuses to sign in with %s", async (_label, credentials) => {
      await expect(
        credentialsAuthorize(credentials as Record<string, string> | undefined)
      ).resolves.toBeNull();
    });

    it("refuses to sign in when the user payload is not valid json", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        credentialsAuthorize({ accessToken: "access-1", user: "{not-json" })
      ).resolves.toBeNull();
    });
  });

  describe("jwt callback", () => {
    it("copies the backend session onto the token and derives the expiry from the access token", async () => {
      const expiresAt = Date.now() + 8 * HOUR;
      const accessToken = makeAccessToken(expiresAt);

      const token = (await callJwt({
        token: {} as JWT,
        user: {
          backendSession: {
            accessToken,
            refreshToken: "refresh-1",
            user: { id: "user-1" },
          },
        },
      })) as JWT;

      expect(token.accessToken).toBe(accessToken);
      expect(token.refreshToken).toBe("refresh-1");
      expect(token.user).toEqual({ id: "user-1" });
      expect(token.accessTokenExpires).toBe(
        Math.floor(expiresAt / 1000) * 1000
      );
    });

    it("falls back to a 24 hour expiry when the access token carries no exp", async () => {
      const before = Date.now();

      const token = (await callJwt({
        token: {} as JWT,
        user: {
          backendSession: {
            accessToken: "opaque-token",
            refreshToken: "refresh-1",
            user: { id: "user-1" },
          },
        },
      })) as JWT;

      expect(token.accessTokenExpires).toBeGreaterThanOrEqual(
        before + 24 * HOUR
      );
      expect(token.accessTokenExpires).toBeLessThanOrEqual(
        Date.now() + 24 * HOUR
      );
    });

    it("applies tokens supplied by a client-triggered session update", async () => {
      const expiresAt = Date.now() + 8 * HOUR;
      const rotated = makeAccessToken(expiresAt);

      const token = (await callJwt({
        token: {
          accessToken: "stale",
          refreshToken: "old-refresh",
          accessTokenExpires: Date.now() + 8 * HOUR,
        } as JWT,
        trigger: "update",
        session: { accessToken: rotated, refreshToken: "new-refresh" },
      })) as JWT;

      expect(token.accessToken).toBe(rotated);
      expect(token.refreshToken).toBe("new-refresh");
      expect(token.accessTokenExpires).toBe(
        Math.floor(expiresAt / 1000) * 1000
      );
    });

    it("leaves a healthy token untouched instead of refreshing it", async () => {
      const fetchMock = vi.spyOn(globalThis, "fetch");

      const token = (await callJwt({
        token: {
          accessToken: "still-good",
          refreshToken: "refresh-1",
          accessTokenExpires: Date.now() + 8 * HOUR,
        } as JWT,
      })) as JWT;

      expect(token.accessToken).toBe("still-good");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("refreshes an access token that is inside the five minute leeway", async () => {
      const rotated = makeAccessToken(Date.now() + 8 * HOUR);
      const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ accessToken: rotated }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "set-cookie": "rt=rotated-refresh; Path=/; HttpOnly",
          },
        })
      );

      const token = (await callJwt({
        token: {
          accessToken: "about-to-expire",
          refreshToken: "refresh-1",
          accessTokenExpires: Date.now() + 60 * 1000,
        } as JWT,
      })) as JWT;

      expect(fetchMock).toHaveBeenCalledWith(
        "https://backend.example/api/v1/auth/refresh",
        {
          method: "POST",
          headers: { Cookie: "rt=refresh-1" },
          signal: expect.any(AbortSignal),
        }
      );
      expect(token.accessToken).toBe(rotated);
      expect(token.error).toBeUndefined();
    });

    it("marks the token with a refresh error when there is no refresh token to use", async () => {
      const token = (await callJwt({
        token: {
          accessToken: "about-to-expire",
          accessTokenExpires: Date.now() + 60 * 1000,
        } as JWT,
      })) as JWT;

      expect(token.error).toBe("RefreshAccessTokenError");
    });

    it("marks the token with a refresh error when the backend rejects the refresh", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ error: "invalid_refresh_token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      );

      const token = (await callJwt({
        token: {
          accessToken: "about-to-expire",
          refreshToken: "refresh-1",
          accessTokenExpires: Date.now() + 60 * 1000,
        } as JWT,
      })) as JWT;

      expect(token.error).toBe("RefreshAccessTokenError");
    });
  });

  describe("session callback", () => {
    it("exposes the backend tokens and user to the client session", async () => {
      const session = (await callSession({
        session: { user: {}, expires: "2026-12-31T00:00:00.000Z" },
        token: {
          user: { id: "user-1", email: "jane@example.com" },
          accessToken: "access-1",
          refreshToken: "refresh-1",
        } as JWT,
      })) as unknown as Record<string, unknown>;

      expect(session.user).toEqual({ id: "user-1", email: "jane@example.com" });
      expect(session.accessToken).toBe("access-1");
      expect(session.refreshToken).toBe("refresh-1");
      expect(session.error).toBeUndefined();
    });

    it("propagates a refresh failure so the client can sign the user out", async () => {
      const session = (await callSession({
        session: { user: {}, expires: "2026-12-31T00:00:00.000Z" },
        token: { error: "RefreshAccessTokenError" } as JWT,
      })) as unknown as Record<string, unknown>;

      expect(session.error).toBe("RefreshAccessTokenError");
    });
  });

  describe("signIn callback", () => {
    it("admits an email login that already carries a backend session", async () => {
      const fetchMock = vi.spyOn(globalThis, "fetch");

      await expect(
        callSignIn({
          user: { backendSession: { accessToken: "access-1" } },
          account: { provider: "email" },
        })
      ).resolves.toBe(true);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("attaches the backend session returned by the sso exchange for google", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(
          JSON.stringify({
            accessToken: "access-1",
            refreshToken: "refresh-1",
            user: { id: "user-1" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
      const user: Record<string, unknown> = { email: "jane@example.com" };

      await expect(
        callSignIn({
          user,
          account: { provider: "google", providerAccountId: "google-1" },
          profile: { email: "jane@example.com" },
        })
      ).resolves.toBe(true);
      expect(user.backendSession).toMatchObject({
        accessToken: "access-1",
        refreshToken: "refresh-1",
      });
    });

    it("redirects an existing email-only account back to the login page", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ error: "email_only_account" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        })
      );

      await expect(
        callSignIn({
          user: { email: "jane@example.com" },
          account: { provider: "google", providerAccountId: "google-1" },
        })
      ).resolves.toBe("/login?error=email_only_account");
    });

    it("still admits the google login when the sso exchange fails, rather than locking the user out", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ error: "server_error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      );

      await expect(
        callSignIn({
          user: { email: "jane@example.com" },
          account: { provider: "google", providerAccountId: "google-1" },
        })
      ).resolves.toBe(true);
    });

    it("still admits the google login when the backend is unreachable", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(globalThis, "fetch").mockRejectedValue(
        new Error("network down")
      );

      await expect(
        callSignIn({
          user: { email: "jane@example.com" },
          account: { provider: "google", providerAccountId: "google-1" },
        })
      ).resolves.toBe(true);
    });
  });
});

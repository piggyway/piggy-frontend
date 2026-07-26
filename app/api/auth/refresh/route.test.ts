import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

let POST: typeof import("./route").POST;

describe("POST /api/auth/refresh", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the JWT refresh token as the backend rt cookie and returns rotated tokens", async () => {
    vi.mocked(getToken).mockResolvedValue({
      refreshToken: "old-refresh-token",
    } as never);
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ accessToken: "new-access-token" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "set-cookie": "rt=new-refresh-token; Path=/; HttpOnly",
        },
      })
    );

    const response = await POST(
      new NextRequest("http://localhost/api/auth/refresh", {
        method: "POST",
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/auth/refresh",
      {
        method: "POST",
        headers: { Cookie: "rt=old-refresh-token" },
      }
    );
    expect(response.headers.get("set-cookie")).toContain(
      "rt=new-refresh-token"
    );
  });

  it("rejects callers whose NextAuth JWT has no refresh token", async () => {
    vi.mocked(getToken).mockResolvedValue(null);
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await POST(
      new NextRequest("http://localhost/api/auth/refresh", {
        method: "POST",
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "unauthorized",
      message: "Missing refresh token",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves an upstream refresh rejection", async () => {
    vi.mocked(getToken).mockResolvedValue({
      refreshToken: "expired-token",
    } as never);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "invalid_refresh_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await POST(
      new NextRequest("http://localhost/api/auth/refresh", {
        method: "POST",
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "invalid_refresh_token",
    });
  });
});

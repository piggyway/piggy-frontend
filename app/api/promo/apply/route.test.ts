import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

function request(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/promo/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/promo/apply", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the promo code and authorization to the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({ success: true, data: { discountCents: 500 } }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    const response = await POST(
      request({ code: "SAVE20" }, { authorization: "Bearer account-token" })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { discountCents: 500 },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/promo/apply",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        body: JSON.stringify({ code: "SAVE20" }),
      }
    );
  });

  it("does not forward a guest session id, since promo codes are account-scoped upstream", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    await POST(
      request(
        { code: "SAVE20" },
        { "x-session-id": "11111111-2222-3333-4444-555555555555" }
      )
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream rejection of an invalid code", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "invalid_code",
          message: "Promo code is not valid",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(
      request({ code: "NOPE" }, { authorization: "Bearer account-token" })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "invalid_code",
      message: "Promo code is not valid",
    });
  });

  it("returns a 500 envelope when the backend response is unreadable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>gateway</html>", {
        status: 502,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await POST(
      request({ code: "SAVE20" }, { authorization: "Bearer account-token" })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "application_error",
      message: "Failed to apply promo code",
    });
  });
});

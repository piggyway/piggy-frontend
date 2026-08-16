import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let DELETE: typeof import("./route").DELETE;

function request(headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/promo/remove", {
    method: "DELETE",
    headers,
  });
}

describe("DELETE /api/promo/remove", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ DELETE } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the removal with authorization and no body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await DELETE(
      request({ authorization: "Bearer account-token" })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/promo/remove",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("omits the authorization header when the caller is anonymous", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    await DELETE(request());

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream rejection when no promo code is applied", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "no_promo_applied" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await DELETE(
      request({ authorization: "Bearer account-token" })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "no_promo_applied",
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

    const response = await DELETE(
      request({ authorization: "Bearer account-token" })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "removal_error",
      message: "Failed to remove promo code",
    });
  });
});

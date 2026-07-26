import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

function createRequest(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/cart/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/cart/items", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards a valid item with guest and authorization headers", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { id: "cart-1" },
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      )
    );
    const body = { variant_rid: 501, quantity: 1 };

    const response = await POST(
      createRequest(body, {
        authorization: "Bearer token",
        "x-session-id": "guest-1",
      })
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { id: "cart-1" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/cart/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
          "X-Session-Id": "guest-1",
        },
        body: JSON.stringify(body),
      }
    );
  });

  it.each([
    {
      body: { variant_rid: 501, quantity: -1 },
      status: 400,
      error: "invalid_quantity",
    },
    {
      body: { variant_rid: 999_999, quantity: 1 },
      status: 404,
      error: "variant_not_found",
    },
    {
      body: { variant_rid: null, quantity: 1 },
      status: 400,
      error: "invalid_variant",
    },
  ])(
    "preserves backend input validation for $error",
    async ({ body, status, error }) => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ success: false, error }), {
          status,
          headers: { "Content-Type": "application/json" },
        })
      );

      const response = await POST(createRequest(body));

      expect(response.status).toBe(status);
      await expect(response.json()).resolves.toEqual({
        success: false,
        error,
      });
    }
  );

  it("returns a concrete server error for malformed JSON", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const request = new NextRequest("http://localhost/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to add cart item",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

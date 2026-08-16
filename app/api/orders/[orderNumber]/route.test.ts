import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

describe("GET /api/orders/[orderNumber]", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the order identifier with the caller authorization", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { orderNumber: "PW-123" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/orders/PW-123", {
        headers: { authorization: "Bearer account-token" },
      }),
      { params: Promise.resolve({ orderNumber: "PW-123" }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: { orderNumber: "PW-123" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/orders/PW-123",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("preserves an upstream missing-order error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/orders/missing"),
      { params: Promise.resolve({ orderNumber: "missing" }) }
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "not_found" });
  });
});

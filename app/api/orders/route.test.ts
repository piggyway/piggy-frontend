import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

describe("GET /api/orders", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards pagination and the authenticated identity to the orders backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: [{ orderNumber: "PW-1" }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const request = new NextRequest(
      "http://localhost/api/orders?page=2&limit=25",
      {
        headers: { authorization: "Bearer account-token" },
      }
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [{ orderNumber: "PW-1" }],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/orders?page=2&limit=25",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("preserves an upstream orders authorization error and payload", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "unauthorized", message: "Expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const response = await GET(new NextRequest("http://localhost/api/orders"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "unauthorized",
      message: "Expired token",
    });
  });
});

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("GET /api/variants/[id]/reviews", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the upstream reviews for a variant", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: { reviews: [{ rating: 5 }], average: 5 } }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    const response = await GET(
      new NextRequest("http://localhost/api/variants/42/reviews"),
      params("42")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: { reviews: [{ rating: 5 }], average: 5 },
    });
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/variants/42/reviews");
  });

  it("maps an upstream 404 to a variant-not-found response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/variants/999/reviews"),
      params("999")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Variant not found",
    });
  });

  it("returns a 500 envelope for any other upstream failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "boom" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/variants/42/reviews"),
      params("42")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch reviews",
    });
  });
});

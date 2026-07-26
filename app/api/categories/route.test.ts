import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let GET: typeof import("./route").GET;

describe("GET /api/categories", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the upstream categories with a public cache header", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: [{ slug: "hideouts" }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [{ slug: "hideouts" }],
    });
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "https://backend.example/api/v1/product-categories"
    );
    expect(options).toMatchObject({ next: { revalidate: 300 } });
  });

  it("reports the upstream status in the error message on a failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "boom" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Failed to fetch categories",
      message: "Backend API error: 503",
    });
  });

  it("surfaces a network failure instead of returning an empty list", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("connect ECONNREFUSED")
    );

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Failed to fetch categories",
      message: "connect ECONNREFUSED",
    });
  });
});

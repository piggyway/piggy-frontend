import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let GET: typeof import("./route").GET;

describe("GET /api/variants/random", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the upstream selection and opts out of caching", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: [{ variant_id: 1 }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [{ variant_id: 1 }],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/variants/random",
      { cache: "no-store", signal: expect.any(AbortSignal) }
    );
  });

  it("returns a 500 envelope when the backend response is unreadable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>gateway</html>", {
        status: 502,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch random variants",
    });
  });
});

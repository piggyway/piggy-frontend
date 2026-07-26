import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

describe("GET /api/pickup/locations", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the active pickup locations from the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: [{ id: 1, name: "Melbourne CBD" }] }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    const response = await GET(
      new NextRequest("http://localhost/api/pickup/locations")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [{ id: 1, name: "Melbourne CBD" }],
    });
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://backend.example/api/v1/pickup/locations");
    expect(options?.headers).toEqual({ Authorization: "" });
  });

  it("forwards the caller authorization when present", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    await GET(
      new NextRequest("http://localhost/api/pickup/locations", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ Authorization: "Bearer account-token" });
  });

  it("returns a 500 envelope when the backend response is unreadable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>gateway</html>", {
        status: 502,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/pickup/locations")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch pickup locations",
    });
  });
});

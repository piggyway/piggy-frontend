import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

function listResponse() {
  return new Response(JSON.stringify({ data: [{ variant_id: 7 }] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/variants", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the upstream variant list unchanged", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    const response = await GET(
      new NextRequest("http://localhost/api/variants")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [{ variant_id: 7 }],
    });
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://backend.example/api/v1/variants");
  });

  it("preserves filter and pagination query parameters", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    await GET(
      new NextRequest(
        "http://localhost/api/variants?category=hideouts&page=2&limit=12"
      )
    );

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("category=hideouts");
    expect(String(url)).toContain("page=2");
    expect(String(url)).toContain("limit=12");
  });

  it("sends an empty authorization header for anonymous browsing", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    await GET(new NextRequest("http://localhost/api/variants"));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ Authorization: "" });
  });

  it("forwards the caller authorization when present", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    await GET(
      new NextRequest("http://localhost/api/variants", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ Authorization: "Bearer account-token" });
  });

  it("passes an upstream error status through instead of reporting success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "category_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/variants?category=missing")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "category_not_found",
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

    const response = await GET(
      new NextRequest("http://localhost/api/variants")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch variants",
    });
  });
});

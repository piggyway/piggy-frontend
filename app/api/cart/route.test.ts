import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

function cartResponse() {
  return new Response(JSON.stringify({ data: { id: 1, items: [] } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/cart", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards a guest session id so the backend can resolve the guest cart", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(cartResponse());

    const response = await GET(
      new NextRequest("http://localhost/api/cart", {
        headers: { "x-session-id": "11111111-2222-3333-4444-555555555555" },
      })
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/cart",
      {
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": "11111111-2222-3333-4444-555555555555",
        },
      }
    );
  });

  it("forwards authorization for a signed-in shopper", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(cartResponse());

    await GET(
      new NextRequest("http://localhost/api/cart", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer account-token",
    });
  });

  it("preserves pagination query parameters on the upstream url", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(cartResponse());

    await GET(
      new NextRequest("http://localhost/api/cart?cursor=abc&limit=20", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example/api/v1/cart?cursor=abc&limit=20");
  });

  it("still queries the backend without any identity so it can answer with an empty cart", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(cartResponse());

    const response = await GET(new NextRequest("http://localhost/api/cart"));

    expect(response.status).toBe(200);
    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream error status and payload", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "cart_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/cart", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "cart_not_found",
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
      new NextRequest("http://localhost/api/cart", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch cart",
    });
  });
});

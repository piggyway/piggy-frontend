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

const TOKEN = "eQ3Xn1n8Vv0aQ9pV2mJ4bS7fH6kL5rT8wZ1yC0dE3gI";

/** Headers the platform hands to `headers()` inside `backendFetch`. */
const platform = vi.hoisted(() => ({ incoming: new Headers() }));

vi.mock("next/headers", () => ({
  headers: async () => platform.incoming,
}));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

function request(headers: HeadersInit = {}) {
  return new NextRequest(`http://localhost/api/boarding/agreement/${TOKEN}`, {
    method: "GET",
    headers,
  });
}

function params(token = TOKEN) {
  return { params: Promise.resolve({ token }) };
}

function okResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        status: "viewed",
        template_version: "v1",
        read_only: false,
        pdf_available: false,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

describe("GET /api/boarding/agreement/[token]", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    delete process.env.INTERNAL_PROXY_SECRET;
    ({ GET } = await import("./route"));
  });

  beforeEach(() => {
    setIncoming();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the backend agreement endpoint with the token in the path", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await GET(request(), params());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { template_version: "v1" },
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://backend.example/api/v1/boarding/agreements/${TOKEN}`
    );
    expect(options?.cache).toBe("no-store");
  });

  it("percent-encodes a token that carries url characters", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await GET(request(), params("a/b?c"));

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://backend.example/api/v1/boarding/agreements/a%2Fb%3Fc"
    );
  });

  it("forwards the cloudflare client ip and ignores a spoofed forwarded chain", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({
      "cf-connecting-ip": "203.0.113.9",
      "x-forwarded-for": "6.6.6.6",
    });

    await GET(
      request({
        "x-forwarded-for": "6.6.6.6",
        "user-agent": "Mozilla/5.0 (iPhone)",
      }),
      params()
    );

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (iPhone)",
      "x-forwarded-for": "203.0.113.9",
    });
  });

  it("sends no client ip when the platform resolved none", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await GET(request({ "user-agent": "Mozilla/5.0 (iPhone)" }), params());

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (iPhone)",
    });
  });

  it("sends no client ip when only a forwarded chain reaches the platform", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "x-forwarded-for": "6.6.6.6, 7.7.7.7" });

    await GET(request({ "user-agent": "Mozilla/5.0 (iPhone)" }), params());

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (iPhone)",
    });
  });

  it("marks the json response as private and uncacheable", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(okResponse());

    const response = await GET(request(), params());

    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("passes an upstream 404 through with its status and detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "agreement_not_found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_not_found",
    });
  });

  it("passes an upstream 410 through with its status and detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "agreement_link_expired" }),
        { status: 410, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(410);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_link_expired",
    });
  });

  it("passes an upstream 429 through with its retry-after", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "rate_limited", message: "Too many requests" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "30",
          },
        }
      )
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("30");
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "rate_limited",
      message: "Too many requests",
    });
  });

  it("caps a long message on a relayed envelope", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "agreement_not_found",
          message: "x".repeat(500),
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await GET(request(), params());

    const body = await response.json();
    expect(body.error).toBe("agreement_not_found");
    expect(body.message).toHaveLength(200);
  });

  it("keeps the upstream status when the error body is not json", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>gateway</html>", {
        status: 503,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_unavailable",
      message: "The service is temporarily unavailable. Please try again.",
    });
  });

  it("returns a 500 envelope when the backend request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("network unreachable")
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to load boarding agreement",
    });
  });
});

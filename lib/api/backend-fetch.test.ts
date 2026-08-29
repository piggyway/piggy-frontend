import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

let backendFetch: typeof import("./backend-fetch").backendFetch;
let relayUpstreamError: typeof import("./backend-fetch").relayUpstreamError;

/** Headers the platform hands to `headers()` inside `backendFetch`. */
const platform = vi.hoisted(() => ({ incoming: new Headers() }));

vi.mock("next/headers", () => ({
  headers: async () => platform.incoming,
}));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

function okResponse() {
  return new Response("{}", {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

beforeAll(async () => {
  ({ backendFetch, relayUpstreamError } = await import("./backend-fetch"));
});

beforeEach(() => {
  setIncoming();
  delete process.env.INTERNAL_PROXY_SECRET;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("backendFetch client ip", () => {
  it("forwards cf-connecting-ip as the client ip", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "cf-connecting-ip": "203.0.113.9" });

    await backendFetch("https://backend.example/api/v1/ping");

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "x-forwarded-for": "203.0.113.9",
    });
  });

  it("sends no x-forwarded-for when only the incoming forwarded chain is set", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "x-forwarded-for": "6.6.6.6, 7.7.7.7" });

    await backendFetch("https://backend.example/api/v1/ping", {
      headers: { "Content-Type": "application/json" },
    });

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("keeps a caller-supplied x-forwarded-for and never overwrites it", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "cf-connecting-ip": "203.0.113.9" });

    await backendFetch("https://backend.example/api/v1/ping", {
      headers: { "x-forwarded-for": "198.51.100.7" },
    });

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "x-forwarded-for": "198.51.100.7",
    });
  });

  it("omits the proxy secret when no client ip could be resolved", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    process.env.INTERNAL_PROXY_SECRET = "s3cret";
    setIncoming({ "x-forwarded-for": "6.6.6.6" });

    await backendFetch("https://backend.example/api/v1/ping");

    expect(fetchMock.mock.calls[0][1]?.headers).toBeUndefined();
  });

  it("sends the proxy secret alongside a resolved client ip", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    process.env.INTERNAL_PROXY_SECRET = "s3cret";
    setIncoming({ "cf-connecting-ip": "203.0.113.9" });

    await backendFetch("https://backend.example/api/v1/ping");

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "x-forwarded-for": "203.0.113.9",
      "x-internal-proxy-secret": "s3cret",
    });
  });
});

describe("relayUpstreamError", () => {
  it("keeps the backend envelope, its data and its timestamp", async () => {
    const upstream = new Response(
      JSON.stringify({
        success: false,
        error: "acknowledgments_incomplete",
        message: "Tick every box",
        data: { missing: ["fees_agreed"] },
        timestamp: "2026-08-29T02:00:00.000Z",
      }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );

    const response = await relayUpstreamError(upstream, "agreement_failed");

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "acknowledgments_incomplete",
      message: "Tick every box",
      data: { missing: ["fees_agreed"] },
      timestamp: "2026-08-29T02:00:00.000Z",
    });
  });

  it("answers a non-json body with the same envelope shape and a generic message", async () => {
    const upstream = new Response("<html>gateway</html>", {
      status: 503,
      headers: { "Content-Type": "text/html", "Retry-After": "42" },
    });

    const response = await relayUpstreamError(upstream, "agreement_failed");

    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBe("42");
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_failed",
      message: "The service is temporarily unavailable. Please try again.",
    });
  });

  it("never relays the upstream html body", async () => {
    const upstream = new Response("<html>internal stack trace</html>", {
      status: 502,
      headers: { "Content-Type": "text/html" },
    });

    const response = await relayUpstreamError(upstream, "agreement_failed");

    expect(await response.text()).not.toContain("stack trace");
  });

  it("falls back when the json body carries no string error code", async () => {
    const upstream = new Response(JSON.stringify({ detail: "nope" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

    const response = await relayUpstreamError(upstream, "agreement_failed");

    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_failed",
      message: "The service is temporarily unavailable. Please try again.",
    });
  });

  it("caps a relayed message at 200 characters", async () => {
    const upstream = new Response(
      JSON.stringify({ error: "rate_limited", message: "x".repeat(500) }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );

    const response = await relayUpstreamError(upstream, "agreement_failed");
    const body = await response.json();

    expect(body.message).toHaveLength(200);
  });
});

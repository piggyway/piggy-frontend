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

/** Bindings `getCloudflareContext` returns; null means no Cloudflare context. */
const cloudflare = vi.hoisted(() => ({
  env: null as Record<string, unknown> | null,
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    if (!cloudflare.env) {
      throw new Error("no cloudflare context");
    }
    return { env: cloudflare.env, cf: undefined, ctx: {} };
  },
}));

/** In-memory stand-in for Next's data cache, keyed like `unstable_cache`. */
const dataCache = vi.hoisted(() => ({
  store: new Map<string, unknown>(),
  options: [] as Array<{ revalidate?: number | false; tags?: string[] }>,
}));

vi.mock("next/cache", () => ({
  unstable_cache:
    <A extends unknown[], R>(
      fn: (...args: A) => Promise<R>,
      keyParts: string[] = [],
      options: { revalidate?: number | false; tags?: string[] } = {}
    ) =>
    async (...args: A): Promise<R> => {
      dataCache.options.push(options);
      const key = JSON.stringify([keyParts, args]);
      if (dataCache.store.has(key)) {
        return dataCache.store.get(key) as R;
      }
      const value = await fn(...args);
      dataCache.store.set(key, value);
      return value;
    },
}));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

function useBinding() {
  const binding = { fetch: vi.fn<typeof fetch>() };
  cloudflare.env = { BACKEND: binding };
  return binding;
}

function timeoutError() {
  return Object.assign(new Error("The operation timed out."), {
    name: "TimeoutError",
  });
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
  cloudflare.env = null;
  dataCache.store.clear();
  dataCache.options = [];
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

  it("sends neither client ip nor proxy secret when forwardClientIp is false", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    process.env.INTERNAL_PROXY_SECRET = "s3cret";
    setIncoming({ "cf-connecting-ip": "203.0.113.9" });

    // A cacheable read must carry nothing per-visitor: Next keys its fetch
    // cache on the request headers, so a client ip would give every visitor a
    // private entry.
    await backendFetch("https://backend.example/api/v1/ping", {
      forwardClientIp: false,
      headers: { "Content-Type": "application/json" },
    });

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("does not pass forwardClientIp on to fetch", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await backendFetch("https://backend.example/api/v1/ping", {
      forwardClientIp: false,
      cache: "no-store",
    });

    const init = fetchMock.mock.calls[0][1] as Record<string, unknown>;
    expect(init).not.toHaveProperty("forwardClientIp");
    expect(init.cache).toBe("no-store");
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

describe("backendFetch transport", () => {
  it("sends the request through the BACKEND binding when it is bound", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const binding = useBinding();
    binding.fetch.mockResolvedValue(okResponse());

    process.env.INTERNAL_PROXY_SECRET = "s3cret";
    setIncoming({ "cf-connecting-ip": "203.0.113.9" });

    const response = await backendFetch(
      "https://backend.example/api/v1/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"id":1}',
        cache: "no-store",
      }
    );

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(binding.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = binding.fetch.mock.calls[0];
    expect(url).toBe("https://backend.example/api/v1/orders");
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe('{"id":1}');
    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.9",
      "x-internal-proxy-secret": "s3cret",
    });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
    expect(init).not.toHaveProperty("forwardClientIp");
  });

  it("falls back to global fetch when there is no Cloudflare context", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "cf-connecting-ip": "203.0.113.9" });

    await backendFetch("https://backend.example/api/v1/ping", {
      method: "GET",
      cache: "no-store",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example/api/v1/ping");
    expect(init?.method).toBe("GET");
    expect(init?.cache).toBe("no-store");
    expect(init?.headers).toEqual({ "x-forwarded-for": "203.0.113.9" });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("falls back to global fetch when the context has no BACKEND binding", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());
    const other = { fetch: vi.fn<typeof fetch>() };
    cloudflare.env = { WORKER_SELF_REFERENCE: other };

    await backendFetch("https://backend.example/api/v1/ping", {
      next: { revalidate: 300 },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      next: { revalidate: 300 },
    });
    expect(other.fetch).not.toHaveBeenCalled();
  });

  it("serves a cacheable read from the data cache on the second call", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const binding = useBinding();
    binding.fetch.mockImplementation(
      async () =>
        new Response('{"data":[1,2]}', {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    );

    const first = await backendFetch(
      "https://backend.example/api/v1/config",
      {
        method: "GET",
        forwardClientIp: false,
        next: { revalidate: 300, tags: ["config"] },
      }
    );
    const second = await backendFetch(
      "https://backend.example/api/v1/config",
      {
        method: "GET",
        forwardClientIp: false,
        next: { revalidate: 300, tags: ["config"] },
      }
    );

    expect(binding.fetch).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(second.headers.get("content-type")).toBe("application/json");
    await expect(first.json()).resolves.toEqual({ data: [1, 2] });
    await expect(second.json()).resolves.toEqual({ data: [1, 2] });
    expect(dataCache.options[0]).toEqual({ revalidate: 300, tags: ["config"] });
  });

  it("keys the cache on the request headers", async () => {
    const binding = useBinding();
    binding.fetch.mockImplementation(async () => okResponse());

    await backendFetch("https://backend.example/api/v1/config", {
      headers: { "accept-language": "en" },
      forwardClientIp: false,
      next: { revalidate: 300 },
    });
    await backendFetch("https://backend.example/api/v1/config", {
      headers: { "accept-language": "fr" },
      forwardClientIp: false,
      next: { revalidate: 300 },
    });

    expect(binding.fetch).toHaveBeenCalledTimes(2);
  });

  it("does not cache a non-2xx response", async () => {
    const binding = useBinding();
    binding.fetch.mockImplementation(
      async () => new Response("throttled", { status: 429 })
    );

    const first = await backendFetch("https://backend.example/api/v1/config", {
      forwardClientIp: false,
      next: { revalidate: 300 },
    });
    const second = await backendFetch(
      "https://backend.example/api/v1/config",
      {
        forwardClientIp: false,
        next: { revalidate: 300 },
      }
    );

    expect(binding.fetch).toHaveBeenCalledTimes(2);
    expect(first.status).toBe(429);
    expect(second.status).toBe(429);
    await expect(second.text()).resolves.toBe("throttled");
  });

  it("never caches a no-store request", async () => {
    const binding = useBinding();
    binding.fetch.mockImplementation(async () => okResponse());

    await backendFetch("https://backend.example/api/v1/config", {
      cache: "no-store",
    });
    await backendFetch("https://backend.example/api/v1/config", {
      cache: "no-store",
    });

    expect(binding.fetch).toHaveBeenCalledTimes(2);
    expect(dataCache.store.size).toBe(0);
  });

  it("returns the 504 JSON response when the binding times out", async () => {
    const binding = useBinding();
    binding.fetch.mockRejectedValue(timeoutError());

    const response = await backendFetch(
      "https://backend.example/api/v1/config",
      { cache: "no-store" }
    );

    expect(response.status).toBe(504);
    expect(response.headers.get("content-type")).toBe("application/json");
    await expect(response.json()).resolves.toEqual({
      error: "Gateway Timeout",
      message: "Backend request timed out",
    });
  });

  it("returns the 504 JSON response when a cacheable binding read times out", async () => {
    const binding = useBinding();
    binding.fetch.mockRejectedValue(timeoutError());

    const response = await backendFetch(
      "https://backend.example/api/v1/config",
      { forwardClientIp: false, next: { revalidate: 300 } }
    );

    expect(response.status).toBe(504);
    await expect(response.json()).resolves.toEqual({
      error: "Gateway Timeout",
      message: "Backend request timed out",
    });
    expect(dataCache.store.size).toBe(0);
  });

  it("rethrows a binding error that is not a timeout", async () => {
    const binding = useBinding();
    binding.fetch.mockRejectedValue(new TypeError("network down"));

    await expect(
      backendFetch("https://backend.example/api/v1/config", {
        cache: "no-store",
      })
    ).rejects.toThrow("network down");
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

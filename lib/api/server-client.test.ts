import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ApiError } from "@/lib/api/errors";
import { reportError } from "@/lib/monitoring/report";

let serverApiClient: typeof import("./server-client").serverApiClient;

/** Headers the platform hands to `headers()` inside `backendFetch`. */
const platform = vi.hoisted(() => ({ incoming: new Headers() }));

vi.mock("next/headers", () => ({
  headers: async () => platform.incoming,
}));

vi.mock("@/lib/monitoring/report", () => ({ reportError: vi.fn() }));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

type FetchInit = RequestInit & { next?: { revalidate?: number } };

function callInit(): FetchInit {
  return vi.mocked(fetch).mock.calls[0][1] as FetchInit;
}

function callUrl(): string {
  return vi.mocked(fetch).mock.calls[0][0] as string;
}

beforeAll(async () => {
  process.env.API_BASE_URL = "https://backend.example";
  ({ serverApiClient } = await import("./server-client"));
});

beforeEach(() => {
  setIncoming();
  vi.stubGlobal("fetch", vi.fn());
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("serverApiClient.get", () => {
  it("reads the backend directly under /api/v1 with the given params", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, { data: [] }));

    await expect(
      serverApiClient.get("/variants", {
        params: { category: "liner", page: 1 },
        revalidate: 300,
      })
    ).resolves.toEqual({ data: [] });

    expect(callUrl()).toBe(
      "https://backend.example/api/v1/variants?category=liner&page=1"
    );
  });

  it("caches an anonymous read and sends no per-visitor header", async () => {
    process.env.INTERNAL_PROXY_SECRET = "s3cret";
    setIncoming({ "cf-connecting-ip": "203.0.113.9" });
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, {}));

    await serverApiClient.get("/product-categories", { revalidate: 300 });

    const init = callInit();
    expect(init.next).toEqual({ revalidate: 300 });
    expect(init.cache).toBeUndefined();
    // A per-visitor header would fragment the fetch cache one entry per visitor.
    expect(new Headers(init.headers).has("x-forwarded-for")).toBe(false);
    expect(new Headers(init.headers).has("x-internal-proxy-secret")).toBe(
      false
    );

    delete process.env.INTERNAL_PROXY_SECRET;
  });

  it("forwards the visitor ip and skips the cache for an uncacheable read", async () => {
    setIncoming({ "cf-connecting-ip": "203.0.113.9" });
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, {}));

    await serverApiClient.get("/variants", { params: { q: "hay" } });

    const init = callInit();
    expect(init.cache).toBe("no-store");
    expect(init.next).toBeUndefined();
    expect(new Headers(init.headers).get("x-forwarded-for")).toBe(
      "203.0.113.9"
    );
  });

  it("throws ApiError on 4xx without reporting it", async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(429, { error: "Too many requests" })
    );

    await expect(
      serverApiClient.get("/variants", { revalidate: 300 })
    ).rejects.toMatchObject({ name: "ApiError", status: 429 });
    expect(reportError).not.toHaveBeenCalled();
  });

  it("throws ApiError on 404 without reporting it", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(404, { error: "gone" }));

    await expect(
      serverApiClient.get("/products/nope", { revalidate: 300 })
    ).rejects.toMatchObject({ status: 404 });
    expect(reportError).not.toHaveBeenCalled();
  });

  it("reports a 5xx", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(500, { error: "boom" }));

    await expect(
      serverApiClient.get("/variants", { revalidate: 300 })
    ).rejects.toBeInstanceOf(ApiError);
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(vi.mocked(reportError).mock.calls[0][1]).toMatchObject({
      scope: "serverApiClient.fetch",
    });
  });

  it("reports a network failure", async () => {
    const failure = new TypeError("network down");
    vi.mocked(fetch).mockRejectedValue(failure);

    await expect(serverApiClient.get("/variants")).rejects.toBe(failure);
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});

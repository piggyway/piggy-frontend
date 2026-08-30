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

/** Headers the platform hands to `headers()` inside `backendFetch`. */
const platform = vi.hoisted(() => ({ incoming: new Headers() }));

vi.mock("next/headers", () => ({
  headers: async () => platform.incoming,
}));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

const TOKEN = "eQ3Xn1n8Vv0aQ9pV2mJ4bS7fH6kL5rT8wZ1yC0dE3gI";
const SHA256 =
  "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e]);

function request(headers: HeadersInit = {}) {
  return new NextRequest(
    `http://localhost/api/boarding/agreement/${TOKEN}/pdf`,
    {
      method: "GET",
      headers,
    }
  );
}

function params(token = TOKEN) {
  return { params: Promise.resolve({ token }) };
}

function pdfResponse() {
  return new Response(PDF_BYTES, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="agreement-PW-1001.pdf"',
      "X-Content-Sha256": SHA256,
    },
  });
}

describe("GET /api/boarding/agreement/[token]/pdf", () => {
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

  it("calls the backend pdf endpoint with the token in the path", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(pdfResponse());

    const response = await GET(request(), params());

    expect(response.status).toBe(200);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://backend.example/api/v1/boarding/agreements/${TOKEN}/pdf`
    );
    expect(options?.cache).toBe("no-store");
  });

  it("percent-encodes a token that carries url characters", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(pdfResponse());

    await GET(request(), params("a/b?c"));

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://backend.example/api/v1/boarding/agreements/a%2Fb%3Fc/pdf"
    );
  });

  it("forwards the cloudflare client ip and ignores a spoofed forwarded chain", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(pdfResponse());

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
      .mockResolvedValue(pdfResponse());

    await GET(request({ "user-agent": "Mozilla/5.0 (iPhone)" }), params());

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (iPhone)",
    });
  });

  it("sends no client ip when only a forwarded chain reaches the platform", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(pdfResponse());

    setIncoming({ "x-forwarded-for": "6.6.6.6, 7.7.7.7" });

    await GET(request({ "user-agent": "Mozilla/5.0 (iPhone)" }), params());

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (iPhone)",
    });
  });

  it("streams the pdf bytes through with the download headers", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(pdfResponse());

    const response = await GET(request(), params());

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="agreement-PW-1001.pdf"'
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("x-content-sha256")).toBe(SHA256);

    const body = new Uint8Array(await response.arrayBuffer());
    expect(Array.from(body)).toEqual(Array.from(PDF_BYTES));
  });

  it("keeps the upstream success status on the streamed response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(PDF_BYTES, {
        status: 206,
        headers: { "Content-Type": "application/pdf" },
      })
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(206);
  });

  it("passes an upstream 404 through with its status and detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false, error: "pdf_not_ready" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "pdf_not_ready",
    });
  });

  it("passes an upstream 409 through with its status and detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "agreement_not_signed" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_not_signed",
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

  it("returns a 500 envelope when the backend request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("network unreachable")
    );

    const response = await GET(request(), params());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to download boarding agreement",
    });
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
      error: "agreement_pdf_unavailable",
      message: "The service is temporarily unavailable. Please try again.",
    });
  });
});

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

let POST: typeof import("./route").POST;

/** Headers the platform hands to `headers()` inside `backendFetch`. */
const platform = vi.hoisted(() => ({ incoming: new Headers() }));

vi.mock("next/headers", () => ({
  headers: async () => platform.incoming,
}));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

function request(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const enquiry = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  subject: "Order Inquiry",
  message: "Do you ship to Tasmania?",
  turnstileToken: "token-abc",
};

function okResponse() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    delete process.env.INTERNAL_PROXY_SECRET;
    ({ POST } = await import("./route"));
  });

  beforeEach(() => {
    setIncoming();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the enquiry payload to the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await POST(request(enquiry));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
        signal: expect.any(AbortSignal),
      }
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

    await POST(
      request(enquiry, {
        "x-forwarded-for": "6.6.6.6",
        "x-real-ip": "6.6.6.6",
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.9",
    });
  });

  it("sends no client ip when only a forwarded chain reaches the platform", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "x-forwarded-for": "6.6.6.6, 7.7.7.7" });

    await POST(
      request(enquiry, {
        "x-forwarded-for": "6.6.6.6, 7.7.7.7",
        "x-real-ip": "198.51.100.7",
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream bot-check rejection", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "turnstile_failed",
          message: "Verification failed",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(enquiry));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "turnstile_failed",
      message: "Verification failed",
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

    const response = await POST(request(enquiry));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to submit contact form",
    });
  });
});

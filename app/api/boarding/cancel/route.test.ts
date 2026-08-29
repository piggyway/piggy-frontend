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
  return new NextRequest("http://localhost/api/boarding/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const cancelBody = {
  reference: "PB-TEST-0001",
  email: "ada@example.com",
};

function okResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        reference: "PB-TEST-0001",
        status: "cancelled",
        first_name: "Ada",
        drop_off_date: "2026-08-30",
        drop_off_time: "09:00",
        pick_up_date: "2026-09-02",
        pick_up_time: "17:00",
        nights: 3,
        pets: [{ name: "Nibbles", type: "Guinea pig" }],
      },
      user_notification_sent: true,
      admin_notification_sent: true,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

describe("POST /api/boarding/cancel", () => {
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

  it("forwards the cancel payload to the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await POST(request(cancelBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/boarding/cancel",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cancelBody),
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

    await POST(request(cancelBody, { "x-forwarded-for": "6.6.6.6" }));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.9",
    });
  });

  it("sends no client ip when the platform resolved none", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(request(cancelBody, { "x-forwarded-for": "6.6.6.6" }));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("sends no client ip when only a forwarded chain reaches the platform", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "x-forwarded-for": "6.6.6.6, 7.7.7.7" });

    await POST(request(cancelBody));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream 409", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "This booking can no longer be cancelled online.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(cancelBody));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "This booking can no longer be cancelled online.",
    });
  });

  it("preserves an upstream 429", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "Too many boarding requests, please try again later.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(cancelBody));

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Too many boarding requests, please try again later.",
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

    const response = await POST(request(cancelBody));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to cancel boarding booking",
    });
  });
});

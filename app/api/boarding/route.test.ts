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
  return new NextRequest("http://localhost/api/boarding", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function listRequest(query = "") {
  return new NextRequest(`http://localhost/api/boarding${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

const bookingBody = {
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  phone: "0400 000 000",
  drop_off_date: "2026-08-30",
  pick_up_date: "2026-09-02",
};

function okResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      data: { reference: "PB-TEST-0001", status: "pending" },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

describe("/api/boarding", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    delete process.env.INTERNAL_PROXY_SECRET;
    ({ GET, POST } = await import("./route"));
  });

  beforeEach(() => {
    setIncoming();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts the booking payload to the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await POST(request(bookingBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { reference: "PB-TEST-0001" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/boarding",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingBody),
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("forwards the caller's authorization header", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(request(bookingBody, { authorization: "Bearer tok-1" }));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer tok-1",
    });
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
      request(bookingBody, {
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
      request(bookingBody, {
        "x-forwarded-for": "6.6.6.6, 7.7.7.7",
        "x-real-ip": "198.51.100.7",
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream 422 on create", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "validation_failed" }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(bookingBody));

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "validation_failed",
    });
  });

  it("returns a 500 envelope when the create request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("network unreachable")
    );

    const response = await POST(request(bookingBody));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to create boarding booking",
    });
  });

  it("passes the list paging params through to the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await GET(listRequest("?limit=5&offset=10"));

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://backend.example/api/v1/boarding?limit=5&offset=10"
    );
  });
});

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

function request(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/boarding/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const lookupBody = {
  reference: "PB-TEST-0001",
  email: "ada@example.com",
};

function okResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        reference: "PB-TEST-0001",
        status: "pending",
        first_name: "Ada",
        drop_off_date: "2026-08-30",
        drop_off_time: "09:00",
        pick_up_date: "2026-09-02",
        pick_up_time: "17:00",
        nights: 3,
        pets: [{ name: "Nibbles", type: "Guinea pig" }],
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

describe("POST /api/boarding/lookup", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the lookup payload to the backend", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await POST(request(lookupBody));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/boarding/lookup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lookupBody),
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("passes only the originating client ip from a proxy chain", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(
      request(lookupBody, { "x-forwarded-for": "203.0.113.9, 70.41.3.18" })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.9",
    });
  });

  it("falls back to the real-ip header when no forwarded chain is present", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(request(lookupBody, { "x-real-ip": "198.51.100.7" }));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      "x-forwarded-for": "198.51.100.7",
    });
  });

  it("omits the ip header entirely when the caller ip is unknown", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(request(lookupBody));

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("preserves an upstream 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "Booking not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const response = await POST(request(lookupBody));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Booking not found",
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

    const response = await POST(request(lookupBody));

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

    const response = await POST(request(lookupBody));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to look up boarding booking",
    });
  });
});

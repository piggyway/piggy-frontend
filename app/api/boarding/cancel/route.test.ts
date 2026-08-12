import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

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
    ({ POST } = await import("./route"));
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
      }
    );
  });

  it("passes only the originating client ip from a proxy chain", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(
      request(cancelBody, { "x-forwarded-for": "203.0.113.9, 70.41.3.18" })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.9",
    });
  });

  it("forwards a 409 status from the backend", async () => {
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
  });
});

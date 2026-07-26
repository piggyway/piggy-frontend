import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

function datesResponse() {
  return new Response(JSON.stringify({ data: ["2026-08-01", "2026-08-02"] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/pickup/available-dates", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the query string and the guest session id", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(datesResponse());

    const response = await GET(
      new NextRequest(
        "http://localhost/api/pickup/available-dates?location_id=1",
        {
          headers: { "x-session-id": "11111111-2222-3333-4444-555555555555" },
        }
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: ["2026-08-01", "2026-08-02"],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/pickup/available-dates?location_id=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": "11111111-2222-3333-4444-555555555555",
        },
      }
    );
  });

  it("forwards authorization for a signed-in shopper", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(datesResponse());

    await GET(
      new NextRequest(
        "http://localhost/api/pickup/available-dates?location_id=1",
        { headers: { authorization: "Bearer account-token" } }
      )
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer account-token",
    });
  });

  it("preserves an upstream error status and payload", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "location_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest(
        "http://localhost/api/pickup/available-dates?location_id=999"
      )
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "location_not_found",
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

    const response = await GET(
      new NextRequest(
        "http://localhost/api/pickup/available-dates?location_id=1"
      )
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch available dates",
    });
  });
});

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;

function slotsResponse() {
  return new Response(
    JSON.stringify({ data: [{ id: 10, start_time: "09:00" }] }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

describe("GET /api/pickup/slots", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("queries the by-date backend endpoint and keeps the location and date filters", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(slotsResponse());

    const response = await GET(
      new NextRequest(
        "http://localhost/api/pickup/slots?location_id=1&date=2026-08-01"
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [{ id: 10, start_time: "09:00" }],
    });
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/pickup/slots/by-date");
    expect(String(url)).toContain("location_id=1");
    expect(String(url)).toContain("date=2026-08-01");
  });

  it("forwards the caller authorization when present", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(slotsResponse());

    await GET(
      new NextRequest("http://localhost/api/pickup/slots?location_id=1", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({ Authorization: "Bearer account-token" });
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
      new NextRequest("http://localhost/api/pickup/slots?location_id=1")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch pickup slots",
    });
  });
});

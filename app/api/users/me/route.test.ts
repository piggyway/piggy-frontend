import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;
let PATCH: typeof import("./route").PATCH;

describe("/api/users/me", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET, PATCH } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects profile reads without authorization before contacting the backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await GET(
      new NextRequest("http://localhost/api/users/me")
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "unauthorized",
      message: "Authentication required",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards a profile update unchanged with the caller authorization", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, data: { firstName: "Jane" } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
    const body = { firstName: "Jane", lastName: "Doe" };

    const response = await PATCH(
      new NextRequest("http://localhost/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer account-token",
        },
        body: JSON.stringify(body),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { firstName: "Jane" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/users/me",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        body: JSON.stringify(body),
      }
    );
  });

  it("preserves an upstream profile validation error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "invalid_name" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await PATCH(
      new NextRequest("http://localhost/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer account-token",
        },
        body: JSON.stringify({ firstName: "" }),
      })
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: "invalid_name" });
  });
});

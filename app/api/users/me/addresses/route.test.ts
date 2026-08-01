import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;
let POST: typeof import("./route").POST;

describe("/api/users/me/addresses", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET, POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects address creation without authorization before contacting the backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await POST(
      new NextRequest("http://localhost/api/users/me/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line1: "1 Main Street" }),
      })
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "unauthorized",
      message: "Authentication required",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards an address payload and authorization to the current-user endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { id: "address-1" } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = {
      line1: "1 Main Street",
      suburb: "Melbourne",
      postcode: "3000",
    };

    const response = await POST(
      new NextRequest("http://localhost/api/users/me/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer account-token",
        },
        body: JSON.stringify(body),
      })
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      data: { id: "address-1" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/users/me/addresses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        body: JSON.stringify(body),
      }
    );
  });

  it("preserves an upstream address-list error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "forbidden", message: "Account locked" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const response = await GET(
      new NextRequest("http://localhost/api/users/me/addresses", {
        headers: { authorization: "Bearer account-token" },
      })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "forbidden",
      message: "Account locked",
    });
  });
});

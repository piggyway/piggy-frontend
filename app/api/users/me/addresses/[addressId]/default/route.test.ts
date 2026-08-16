import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let PATCH: typeof import("./route").PATCH;

function params(addressId: string) {
  return { params: Promise.resolve({ addressId }) };
}

function request(addressId: string, headers: HeadersInit = {}) {
  return new NextRequest(
    `http://localhost/api/users/me/addresses/${addressId}/default`,
    { method: "PATCH", headers }
  );
}

describe("/api/users/me/addresses/[addressId]/default", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ PATCH } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects an unauthenticated caller before contacting the backend", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await PATCH(request("address-1"), params("address-1"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "unauthorized",
      message: "Authentication required",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards the default-address change with authorization and no body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { id: "address-1" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await PATCH(
      request("address-1", { authorization: "Bearer account-token" }),
      params("address-1")
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/users/me/addresses/address-1/default",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("preserves an upstream rejection for an address the caller does not own", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "not_found", message: "Address not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await PATCH(
      request("someone-else", { authorization: "Bearer account-token" }),
      params("someone-else")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "not_found",
      message: "Address not found",
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

    const response = await PATCH(
      request("address-1", { authorization: "Bearer account-token" }),
      params("address-1")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "set_default_address_failed",
      message: "Failed to set default address",
    });
  });
});

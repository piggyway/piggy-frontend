import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let GET: typeof import("./route").GET;
let PATCH: typeof import("./route").PATCH;
let DELETE: typeof import("./route").DELETE;

function params(addressId: string) {
  return { params: Promise.resolve({ addressId }) };
}

describe("/api/users/me/addresses/[addressId]", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET, PATCH, DELETE } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["GET", () => GET],
    ["PATCH", () => PATCH],
    ["DELETE", () => DELETE],
  ])(
    "%s rejects an unauthenticated caller before contacting the backend",
    async (method, handler) => {
      const fetchMock = vi.spyOn(globalThis, "fetch");

      const response = await handler()(
        new NextRequest("http://localhost/api/users/me/addresses/address-1", {
          method,
          headers: { "Content-Type": "application/json" },
          body: method === "PATCH" ? JSON.stringify({ city: "Sydney" }) : null,
        }),
        params("address-1")
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "unauthorized",
        message: "Authentication required",
      });
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("forwards a single-address read to the scoped current-user endpoint", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: { id: "address-1", city: "Melbourne" } }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

    const response = await GET(
      new NextRequest("http://localhost/api/users/me/addresses/address-1", {
        headers: { authorization: "Bearer account-token" },
      }),
      params("address-1")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: { id: "address-1", city: "Melbourne" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/users/me/addresses/address-1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer account-token",
        },
      }
    );
  });

  it("forwards an address update body and authorization", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { id: "address-1" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = { city: "Sydney", postcode: "2000" };

    await PATCH(
      new NextRequest("http://localhost/api/users/me/addresses/address-1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer account-token",
        },
        body: JSON.stringify(body),
      }),
      params("address-1")
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/users/me/addresses/address-1",
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

  it("forwards an address deletion without a request body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { deleted: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    await DELETE(
      new NextRequest("http://localhost/api/users/me/addresses/address-1", {
        method: "DELETE",
        headers: { authorization: "Bearer account-token" },
      }),
      params("address-1")
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://backend.example/api/v1/users/me/addresses/address-1"
    );
    expect(options?.method).toBe("DELETE");
    expect(options?.body).toBeUndefined();
  });

  it("preserves an upstream ownership rejection instead of masking it", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "not_found", message: "Address not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await PATCH(
      new NextRequest("http://localhost/api/users/me/addresses/someone-else", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer account-token",
        },
        body: JSON.stringify({ city: "Sydney" }),
      }),
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

    const response = await GET(
      new NextRequest("http://localhost/api/users/me/addresses/address-1", {
        headers: { authorization: "Bearer account-token" },
      }),
      params("address-1")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "get_address_failed",
      message: "Failed to get address",
    });
  });
});

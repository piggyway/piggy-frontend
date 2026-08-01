import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let PATCH: typeof import("./route").PATCH;
let DELETE: typeof import("./route").DELETE;

function params(itemId: string) {
  return { params: Promise.resolve({ itemId }) };
}

function okResponse() {
  return new Response(JSON.stringify({ data: { id: "item-1" } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("/api/cart/items/[itemId]", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ PATCH, DELETE } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards a quantity update with the guest session id", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await PATCH(
      new NextRequest("http://localhost/api/cart/items/item-1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": "11111111-2222-3333-4444-555555555555",
        },
        body: JSON.stringify({ quantity: 3 }),
      }),
      params("item-1")
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/cart/items/item-1",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": "11111111-2222-3333-4444-555555555555",
        },
        body: JSON.stringify({ quantity: 3 }),
      }
    );
  });

  it("forwards authorization for a signed-in shopper", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await PATCH(
      new NextRequest("http://localhost/api/cart/items/item-1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer account-token",
        },
        body: JSON.stringify({ quantity: 2 }),
      }),
      params("item-1")
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer account-token",
    });
  });

  it("sends no identity headers when the caller supplies none", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await DELETE(
      new NextRequest("http://localhost/api/cart/items/item-1", {
        method: "DELETE",
      }),
      params("item-1")
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({});
  });

  it("forwards a removal without a content-type or body", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await DELETE(
      new NextRequest("http://localhost/api/cart/items/item-1", {
        method: "DELETE",
        headers: { authorization: "Bearer account-token" },
      }),
      params("item-1")
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example/api/v1/cart/items/item-1");
    expect(options?.method).toBe("DELETE");
    expect(options?.body).toBeUndefined();
    expect(options?.headers).toEqual({ Authorization: "Bearer account-token" });
  });

  it("preserves an upstream rejection for an item the caller does not own", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "cart_item_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await DELETE(
      new NextRequest("http://localhost/api/cart/items/someone-elses-item", {
        method: "DELETE",
        headers: { authorization: "Bearer account-token" },
      }),
      params("someone-elses-item")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "cart_item_not_found",
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
      new NextRequest("http://localhost/api/cart/items/item-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: 1 }),
      }),
      params("item-1")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to update cart item",
    });
  });
});

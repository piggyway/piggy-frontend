import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/lib/api/client";
import { CartService } from "@/lib/services/cart";
import type { CartFromAPI, CartResponseFromAPI } from "@/lib/types/cart";

vi.mock("@/lib/api/client", () => ({
  fetchWithAuth: vi.fn(),
}));

const fetchWithAuthMock = vi.mocked(fetchWithAuth);

function createApiCart(overrides: Partial<CartFromAPI> = {}): CartFromAPI {
  return {
    id: "cart-1",
    status: "active",
    currency: "aud",
    applied_coupon_code: null,
    items: [
      {
        id: 101,
        cart_id: "cart-1",
        variant_rid: 501,
        product_rid: null,
        quantity: 2,
        snapshot_unit_price_amt: 1250,
        snapshot_currency: "aud",
        notes: null,
        variant_sku: "SKU-501",
        variant_options: [{ name: "Colour", value: "Grey" }],
        product_title: "Hideout",
        product_subtitle: null,
        product_slug: "hideout",
        image_url: null,
        is_available: true,
        stock_quantity: 5,
        add_ons: [
          {
            id: 7,
            add_on_rid: null,
            name: null,
            unit_price_amt: null,
            currency: null,
          },
        ],
        line_subtotal_amt: 2500,
        currency: null,
      },
    ],
    totals: {
      item_count: 2,
      subtotal_amt: 2500,
      discount_amt: 500,
      grand_total_amt: 2000,
      currency: "aud",
    },
    pagination: {
      next_cursor: null,
      has_more: false,
      page_size: 5,
    },
    ...overrides,
  };
}

function jsonResponse(data: CartResponseFromAPI): Response {
  return { json: vi.fn().mockResolvedValue(data) } as unknown as Response;
}

describe("CartService", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("transforms cart items, nullable product IDs, add-ons, and totals", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, data: createApiCart() })
    );

    const cart = await CartService.getCart();

    expect(cart).toEqual({
      id: "cart-1",
      status: "active",
      currency: "aud",
      currencySymbol: "$",
      appliedCouponCode: null,
      items: [
        {
          id: "101",
          cartId: "cart-1",
          variantRid: 501,
          productRid: null,
          quantity: 2,
          unitPriceCents: 1250,
          lineSubtotalCents: 2500,
          currency: "aud",
          productTitle: "Hideout",
          productSubtitle: null,
          productSlug: "hideout",
          imageUrl: "/default-product-image.png",
          isAvailable: true,
          stockQuantity: 5,
          variantSku: "SKU-501",
          variantOptions: [{ name: "Colour", value: "Grey" }],
          addOns: [
            {
              id: 7,
              addOnRid: null,
              name: "Add-on",
              unitPriceCents: 0,
              formattedUnitPrice: "$0.00",
            },
          ],
          notes: null,
          formattedUnitPrice: "$12.50",
          formattedLineSubtotal: "$25.00",
        },
      ],
      totals: {
        itemCount: 2,
        subtotalCents: 2500,
        discountCents: 500,
        grandTotalCents: 2000,
        currency: "aud",
        formattedSubtotal: "$25.00",
        formattedDiscount: "$5.00",
        formattedGrandTotal: "$20.00",
      },
      pagination: {
        nextCursor: null,
        hasMore: false,
        pageSize: 5,
      },
    });
  });

  it("derives a unit price safely when the snapshot price is null", async () => {
    const apiCart = createApiCart();
    apiCart.items[0].snapshot_unit_price_amt = null;
    apiCart.items[0].quantity = 0;
    apiCart.items[0].line_subtotal_amt = 999;
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, data: apiCart })
    );

    const cart = await CartService.getCart();

    expect(cart?.items[0].unitPriceCents).toBe(999);
    expect(cart?.items[0].formattedUnitPrice).toBe("$9.99");
  });

  it("builds pagination query parameters including their boundaries", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, data: createApiCart() })
    );

    await CartService.getCart({ cursor: 1, limit: 99 });

    expect(fetchWithAuthMock).toHaveBeenCalledWith(
      "/api/cart?cursor=1&limit=99",
      { method: "GET" }
    );
  });

  it("returns null for empty, unsuccessful, or rejected cart responses", async () => {
    fetchWithAuthMock
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(
        jsonResponse({ success: false, error: "Cart unavailable" })
      )
      .mockRejectedValueOnce(new TypeError("network failed"));

    await expect(CartService.getCart()).resolves.toBeNull();
    await expect(CartService.getCart()).resolves.toBeNull();
    await expect(CartService.getCart()).resolves.toBeNull();
  });

  it("adds an item with default quantity and omits empty add-ons", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, data: createApiCart() })
    );

    const cart = await CartService.addItem({
      variantRid: 501,
      addOnIds: [],
    });

    expect(cart?.items[0].variantRid).toBe(501);
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variant_rid: 501,
        quantity: 1,
      }),
    });
  });

  it("adds an item with explicit quantity, notes, and add-ons", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, data: createApiCart() })
    );

    await CartService.addItem({
      variantRid: 501,
      quantity: 5,
      notes: "Gift",
      addOnIds: [7, 8],
    });

    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variant_rid: 501,
        quantity: 5,
        notes: "Gift",
        add_on_ids: [7, 8],
      }),
    });
  });

  it.each([
    {
      error: "invalid_quantity",
      expected: "invalid_quantity",
      payload: { variantRid: 501, quantity: 0 },
    },
    {
      error: "invalid_quantity",
      expected: "invalid_quantity",
      payload: { variantRid: 501, quantity: 100 },
    },
    {
      error: "variant_not_found",
      expected: "variant_not_found",
      payload: { variantRid: 999_999, quantity: 1 },
    },
    {
      error: "add_on_insufficient_stock",
      expected:
        "One of the selected add-ons does not have enough stock for this quantity.",
      payload: { variantRid: 501, quantity: 2, addOnIds: [7] },
    },
    {
      error: "add_on_insufficient_stock: Bell (requested 3, available 2)",
      expected: "Bell (requested 3, available 2)",
      payload: { variantRid: 501, quantity: 3, addOnIds: [7] },
    },
  ])("reports backend add failure $error", async (testCase) => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: false, error: testCase.error })
    );

    await expect(CartService.addItem(testCase.payload)).rejects.toThrow(
      testCase.expected
    );
  });

  it("updates item quantity and nullable notes", async () => {
    const apiCart = createApiCart();
    apiCart.items[0].quantity = 5;
    apiCart.items[0].line_subtotal_amt = 6250;
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, data: apiCart })
    );

    const cart = await CartService.updateItem("101", {
      quantity: 5,
      notes: null,
    });

    expect(cart?.items[0].quantity).toBe(5);
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/cart/items/101", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 5, notes: null }),
    });
  });

  it("returns null when a quantity update is rejected at a boundary", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: false, error: "invalid_quantity" })
    );

    await expect(
      CartService.updateItem("101", { quantity: -1 })
    ).resolves.toBeNull();
  });

  it("removes an item and returns the resulting empty cart", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({
        success: true,
        data: createApiCart({
          items: [],
          totals: {
            item_count: 0,
            subtotal_amt: 0,
            discount_amt: 0,
            grand_total_amt: 0,
            currency: "aud",
          },
        }),
      })
    );

    const cart = await CartService.removeItem("101");

    expect(cart?.items).toEqual([]);
    expect(cart?.totals.grandTotalCents).toBe(0);
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/cart/items/101", {
      method: "DELETE",
    });
  });
});

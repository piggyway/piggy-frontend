import { describe, expect, it } from "vitest";

import type { Cart, CartItem } from "@/lib/types/cart";
import {
  calculateOrderTotal,
  clampQuantity,
  getColorSwatchColor,
  preserveCartItemOrder,
} from "@/lib/utils/cart";

function createItem(id: string, quantity = 1): CartItem {
  return {
    id,
    cartId: "cart-1",
    variantRid: Number(id),
    productRid: null,
    quantity,
    unitPriceCents: 1000,
    lineSubtotalCents: 1000 * quantity,
    currency: "aud",
    productTitle: `Product ${id}`,
    productSubtitle: null,
    productSlug: `product-${id}`,
    imageUrl: "/product.png",
    isAvailable: true,
    stockQuantity: 10,
    variantSku: null,
    variantOptions: [],
    addOns: [],
    notes: null,
    formattedUnitPrice: "$10.00",
    formattedLineSubtotal: `$${(10 * quantity).toFixed(2)}`,
  };
}

function createCart(items: CartItem[]): Cart {
  const subtotalCents = items.reduce(
    (total, item) => total + item.lineSubtotalCents,
    0
  );
  return {
    id: "cart-1",
    status: "active",
    currency: "aud",
    currencySymbol: "$",
    appliedCouponCode: null,
    items,
    totals: {
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotalCents,
      discountCents: 0,
      grandTotalCents: subtotalCents,
      currency: "aud",
      formattedSubtotal: `$${(subtotalCents / 100).toFixed(2)}`,
      formattedDiscount: "$0.00",
      formattedGrandTotal: `$${(subtotalCents / 100).toFixed(2)}`,
    },
    pagination: {
      nextCursor: null,
      hasMore: false,
      pageSize: 5,
    },
  };
}

describe("preserveCartItemOrder", () => {
  it("returns the new cart unchanged when no old cart exists", () => {
    const newCart = createCart([createItem("2"), createItem("1")]);

    expect(preserveCartItemOrder(null, newCart)).toBe(newCart);
  });

  it("keeps existing item order and appends newly added items", () => {
    const oldCart = createCart([createItem("2"), createItem("1")]);
    const updatedItem = createItem("1", 3);
    const newCart = createCart([updatedItem, createItem("3"), createItem("2")]);

    const result = preserveCartItemOrder(oldCart, newCart);

    expect(result.items.map((item) => item.id)).toEqual(["2", "1", "3"]);
    expect(result.items[1]).toBe(updatedItem);
    expect(result.totals).toBe(newCart.totals);
  });

  it("removes missing items while preserving remaining order", () => {
    const oldCart = createCart([
      createItem("1"),
      createItem("2"),
      createItem("3"),
    ]);
    const newCart = createCart([createItem("3"), createItem("1")]);

    expect(
      preserveCartItemOrder(oldCart, newCart).items.map((item) => item.id)
    ).toEqual(["1", "3"]);
  });

  it("does not duplicate a merged item returned once by the backend", () => {
    const oldCart = createCart([createItem("1", 1)]);
    const newCart = createCart([createItem("1", 2)]);

    const result = preserveCartItemOrder(oldCart, newCart);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].quantity).toBe(2);
  });
});

describe("calculateOrderTotal", () => {
  it("adds subtotal, shipping, and tax before subtracting discount", () => {
    expect(
      calculateOrderTotal({
        subtotal: 70,
        shippingEstimate: 10,
        taxEstimate: 8,
        discount: 15,
      })
    ).toBe(73);
  });

  it("uses an authoritative grand total including zero", () => {
    expect(
      calculateOrderTotal({
        subtotal: 70,
        shippingEstimate: 10,
        grandTotal: 0,
      })
    ).toBe(0);
  });

  it("never returns a negative total", () => {
    expect(calculateOrderTotal({ subtotal: 10, discount: 25 })).toBe(0);
  });

  it("returns zero for an empty order", () => {
    expect(calculateOrderTotal({ subtotal: 0 })).toBe(0);
  });
});

describe("clampQuantity", () => {
  it.each([
    { quantity: -1, max: 10, expected: 1 },
    { quantity: 0, max: 10, expected: 1 },
    { quantity: 1, max: 10, expected: 1 },
    { quantity: 10, max: 10, expected: 10 },
    { quantity: 11, max: 10, expected: 10 },
    { quantity: 100, max: 99, expected: 99 },
  ])("clamps $quantity to $expected within 1..$max", (testCase) => {
    expect(clampQuantity(testCase.quantity, testCase.max)).toBe(
      testCase.expected
    );
  });

  it("has no upper limit when max is omitted", () => {
    expect(clampQuantity(10_000)).toBe(10_000);
  });
});

describe("getColorSwatchColor", () => {
  it("keeps a configured color", () => {
    expect(getColorSwatchColor("#123456")).toBe("#123456");
  });

  it.each([null, undefined, ""])(
    "uses the grey fallback for %s",
    (colorHex) => {
      expect(getColorSwatchColor(colorHex)).toBe("#cccccc");
    }
  );
});

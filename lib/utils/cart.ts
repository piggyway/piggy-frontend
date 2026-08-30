import type { Cart } from "@/lib/types/cart";

interface OrderTotalInput {
  subtotal: number;
  shippingEstimate?: number;
  taxEstimate?: number;
  discount?: number;
  grandTotal?: number;
}

export function preserveCartItemOrder(
  oldCart: Cart | null,
  newCart: Cart
): Cart {
  if (!oldCart || oldCart.items.length === 0) {
    return newCart;
  }

  const newItemsById = new Map(newCart.items.map((item) => [item.id, item]));
  const orderedItems: Cart["items"] = [];
  const processedIds = new Set<string>();

  for (const oldItem of oldCart.items) {
    const updatedItem = newItemsById.get(oldItem.id);
    if (updatedItem) {
      orderedItems.push(updatedItem);
      processedIds.add(oldItem.id);
    }
  }

  for (const newItem of newCart.items) {
    if (!processedIds.has(newItem.id)) {
      orderedItems.push(newItem);
    }
  }

  return {
    ...newCart,
    items: orderedItems,
  };
}

export function calculateOrderTotal({
  subtotal,
  shippingEstimate = 0,
  taxEstimate = 0,
  discount = 0,
  grandTotal,
}: OrderTotalInput): number {
  return Math.max(
    0,
    grandTotal ?? subtotal + shippingEstimate + taxEstimate - discount
  );
}

export function clampQuantity(quantity: number, max = Infinity): number {
  return Math.max(1, Math.min(quantity, max));
}

export function getColorSwatchColor(colorHex: string | null | undefined) {
  return colorHex || "#cccccc";
}

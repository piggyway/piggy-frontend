"use client";

import { useEffect } from "react";

import { useCart } from "./CartProvider";

/**
 * The backend clears the purchased cart best-effort in the order webhook.
 * Emptying the local cart when the buyer lands on the confirmation page
 * guarantees a stalled webhook can never leave paid items in the cart UI.
 */
export function ClearCartOnSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}

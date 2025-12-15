"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { useCart } from "./CartProvider";
import type { Cart } from "@/lib/types/cart";

const DEFAULT_EMAIL = "zianwang9911@gmail.com";

function useCheckout(cart: Cart | null) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const payload = {
        email: DEFAULT_EMAIL,
        cartItems: cart.items.map((item) => ({
          id: item.id,
          productTitle: item.productTitle,
          variantSku: item.variantSku,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          lineSubtotalCents: item.lineSubtotalCents,
          imageUrl: item.imageUrl,
          currency: item.currency || cart.currency || "usd",
        })),
        currency: cart.currency || "usd",
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        let message = "Unable to start checkout right now.";
        if (errorBody?.error?.message) {
          message = errorBody.error.message;
        } else if (errorBody?.message) {
          message = errorBody.message;
        }
        setCheckoutError(message);
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError("No checkout URL returned from server.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("Something went wrong. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return { isCheckingOut, checkoutError, handleCheckout };
}

export function FloatingCartButton() {
  const { cart, isLoading, isMutating, updateItem, removeItem, ensureLoaded } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { isCheckingOut, checkoutError, handleCheckout } = useCheckout(cart);

  useEffect(() => {
    if (!isOpen) return;
    ensureLoaded().catch(() => null);
  }, [isOpen, ensureLoaded]);

  const cartItems = cart?.items ?? [];

  const subtotal = useMemo(() => {
    if (!cart) return 0;
    return cart.totals.subtotalCents / 100;
  }, [cart]);

  const totalItems = cart?.totals.itemCount ?? 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-8 bottom-8 z-50 h-14 w-14 rounded-full shadow-xl transition-transform hover:scale-105"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
              <p>Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
              <p>Your cart is empty</p>
              <Button
                variant="link"
                onClick={() => setIsOpen(false)}
                className="mt-2"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="bg-muted relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.imageUrl}
                      alt={item.productTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h4 className="line-clamp-1 font-medium">
                          {item.productTitle}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {item.variantSku || "Variant"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-foreground h-fit disabled:opacity-50"
                        disabled={isMutating}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantitySelector
                        value={item.quantity}
                        disabled={isMutating}
                        max={item.stockQuantity ?? undefined}
                        onValueChange={(val) => updateItem(item.id, val)}
                        className="h-8 w-24"
                      />
                      <p className="font-medium">
                        {cart?.currencySymbol}
                        {((item.unitPriceCents * item.quantity) / 100).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between font-medium">
              <span>Subtotal</span>
              <span>
                {cart?.currencySymbol}
                {subtotal.toFixed(2)}
              </span>
            </div>
            {checkoutError && (
              <p className="mb-2 text-center text-sm text-red-500">{checkoutError}</p>
            )}
            <div className="grid gap-2">
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full"
                size="lg"
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

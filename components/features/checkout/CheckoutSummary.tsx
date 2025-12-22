"use client";

import Image from "next/image";
import { useCart } from "@/components/features/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";
import { PromoService } from "@/lib/services/promo";

const FALLBACK_IMAGE = "/default-product-image.png";

export function CheckoutSummary() {
  const { cart, isMutating, error, applyPromoCode, removePromoCode } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  if (!cart) {
    return <div>Loading summary...</div>;
  }

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    setPromoError(null);
    try {
      const validation = await PromoService.validatePromoCode(
        code,
        cart.totals.subtotalCents
      );

      if (!validation.valid) {
        setPromoError(validation.message || "Invalid promo code");
        return;
      }

      await applyPromoCode(code);
      setPromoCode("");
    } catch {
      setPromoError("Failed to validate promo code");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = async () => {
    await removePromoCode();
    setPromoCode("");
    setPromoError(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Items List */}
      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="border-neutral-stroke relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border bg-white">
              <Image
                src={item.imageUrl || FALLBACK_IMAGE}
                alt={item.productTitle}
                fill
                className="object-cover"
              />
              <span className="absolute top-0 right-0 flex size-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-500 text-xs font-medium text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-primary-navy text-sm font-medium">
                {item.productTitle}
              </p>
              {item.variantSku && (
                <p className="text-xs text-slate-500">{item.variantSku}</p>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-primary-navy text-sm font-medium">
                {item.formattedLineSubtotal}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-primary-navy font-medium">
            {cart.totals.formattedSubtotal}
          </span>
        </div>
        {cart.totals.discountCents > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Discount</span>
            <span className="text-green-600 font-medium">
              -{cart.totals.formattedDiscount}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Shipping</span>
          <span className="text-primary-navy font-medium">
            Calculated at next step
          </span>
        </div>
      </div>

       {/* Promo Code */}
       <div className="border-t pt-4">
        {cart.appliedCouponCode ? (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-green-800">
                {cart.appliedCouponCode}
              </span>
              <span className="text-xs text-green-600">
                Promo code applied
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemovePromo}
              disabled={isMutating}
              className="h-8 w-8 p-0 text-green-700 hover:bg-green-100 hover:text-green-900"
              aria-label="Remove promo code"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value.toUpperCase());
                  setPromoError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyPromo();
                  }
                }}
                placeholder="Promo code"
                disabled={isMutating || isValidatingPromo}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={handleApplyPromo}
                disabled={
                  isMutating || isValidatingPromo || !promoCode.trim()
                }
              >
                {isValidatingPromo ? "..." : "Apply"}
              </Button>
            </div>
            {(promoError || error) && (
              <p className="text-xs text-red-500">
                {promoError || error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      <div className="flex items-center justify-between">
        <span className="text-primary-navy text-base font-medium">Total</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-slate-500">{cart.currency?.toUpperCase() ?? ''}</span>
          <span className="text-primary-navy text-xl font-bold">
            {cart.totals.formattedGrandTotal}
          </span>
        </div>
      </div>
    </div>
  );
}

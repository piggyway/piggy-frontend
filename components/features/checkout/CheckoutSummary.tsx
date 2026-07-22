"use client";

import Image from "next/image";
import { useCart } from "@/components/features/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, X } from "lucide-react";
import { useState } from "react";
import { PromoService } from "@/lib/services/promo";
import { useShippingConfig } from "@/hooks/useShippingConfig";
import type { PaymentIntentAmounts } from "@/lib/types/checkout";

const FALLBACK_IMAGE = "/default-product-image.png";

interface CheckoutSummaryProps {
  fulfillmentType?: "delivery" | "pickup";
  /**
   * Confirmed amounts from the PaymentIntent (payment step only).
   * When set, shipping/total show the exact amount being charged and
   * promo editing is locked so the display cannot drift from the charge.
   */
  confirmedAmounts?: PaymentIntentAmounts | null;
}

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function CheckoutSummary({
  fulfillmentType = "delivery",
  confirmedAmounts = null,
}: CheckoutSummaryProps) {
  const { cart, isMutating, error, applyPromoCode, removePromoCode } =
    useCart();
  const { freeShippingThreshold } = useShippingConfig();
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

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-1 flex-col gap-5">
      {/* Head */}
      <div className="flex items-center justify-between">
        <h2 className="text-primary-navy text-[20px] font-semibold">
          Order summary
        </h2>
        <span className="text-[13px] text-slate-400">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items List */}
      {/* pt/-mt give the quantity badge (-top-1 + ring-2) headroom inside the
          scroll clip; max-h fits ~3 item rows so longer carts scroll */}
      <div className="-mt-1.5 flex max-h-[240px] flex-col gap-4 overflow-y-auto pt-1.5 pr-1">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3.5">
            <div className="relative size-[60px] shrink-0">
              <div className="border-neutral-stroke absolute top-0.5 left-0 size-14 overflow-hidden rounded-[12px] border bg-white">
                <Image
                  src={item.imageUrl || FALLBACK_IMAGE}
                  alt={item.productTitle}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="bg-primary-navy absolute -top-1 right-0 flex size-5 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2 ring-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-subtle-medium text-primary-navy truncate">
                {item.productTitle}
              </p>
              {item.variantOptions && item.variantOptions.length > 0 ? (
                <div className="flex flex-col">
                  {item.variantOptions.map((opt, i) => (
                    <p key={i} className="text-[12px] text-slate-400">
                      {opt.name}: {opt.value}
                    </p>
                  ))}
                </div>
              ) : (
                item.variantSku && (
                  <p className="text-[12px] text-slate-400">
                    {item.variantSku}
                  </p>
                )
              )}
            </div>
            <p className="text-subtle-semibold text-primary-navy">
              {item.formattedLineSubtotal}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-subtle text-slate-600">Subtotal</span>
          <span className="text-subtle-medium text-primary-navy">
            {cart.totals.formattedSubtotal}
          </span>
        </div>
        {cart.totals.discountCents > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Discount</span>
            <span className="text-subtle-medium text-green-600">
              -{cart.totals.formattedDiscount}
            </span>
          </div>
        )}
        {fulfillmentType !== "pickup" && (
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Shipping</span>
            {confirmedAmounts ? (
              confirmedAmounts.shippingFeeCents === 0 ? (
                <span className="text-subtle-medium text-green-600">Free</span>
              ) : (
                <span className="text-subtle-medium text-primary-navy">
                  {formatCents(
                    confirmedAmounts.shippingFeeCents,
                    confirmedAmounts.currency
                  )}
                </span>
              )
            ) : cart.totals.subtotalCents >= freeShippingThreshold * 100 ? (
              <span className="text-subtle-medium text-green-600">Free</span>
            ) : (
              <span className="text-primary-navy text-[13px]">
                Calculated at next step
              </span>
            )}
          </div>
        )}
      </div>

      {/* Promo Code */}
      {cart.appliedCouponCode ? (
        <div className="flex items-center justify-between rounded-[12px] border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex flex-col">
            <span className="text-subtle-medium text-green-800">
              {cart.appliedCouponCode}
            </span>
            <span className="text-[12px] text-green-600">
              Promo code applied
            </span>
          </div>
          {!confirmedAmounts && (
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
          )}
        </div>
      ) : confirmedAmounts ? null : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
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
              className="text-subtle h-11 rounded-full bg-white pl-4 placeholder:text-slate-400"
            />
            <Button
              type="button"
              onClick={handleApplyPromo}
              disabled={isMutating || isValidatingPromo || !promoCode.trim()}
              className="bg-primary-gold text-subtle-semibold text-primary-navy hover:bg-primary-gold/80 h-11 w-[84px] shrink-0 rounded-full"
            >
              {isValidatingPromo ? "..." : "Apply"}
            </Button>
          </div>
          {(promoError || error) && (
            <p className="text-[12px] text-red-500">{promoError || error}</p>
          )}
        </div>
      )}

      {/* lg:mt-auto pins the divider and total to the card bottom when the
          card is stretched to match the step column */}
      <div className="bg-neutral-stroke h-px w-full lg:mt-auto" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-primary-navy text-[16px] font-medium">Total</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] text-slate-400">
            {(confirmedAmounts?.currency ?? cart.currency)?.toUpperCase() ?? ""}
          </span>
          <span className="text-primary-navy text-[24px] font-bold">
            {confirmedAmounts
              ? formatCents(
                  confirmedAmounts.totalCents,
                  confirmedAmounts.currency
                )
              : cart.totals.formattedGrandTotal}
          </span>
        </div>
      </div>

      {/* Savings banner */}
      {cart.totals.discountCents > 0 && (
        <div className="bg-secondary-mint flex items-center gap-2 rounded-[12px] px-4 py-2.5">
          <Star className="fill-primary-gold text-primary-gold size-3.5 shrink-0" />
          <p className="text-primary-navy text-[13px] font-medium">
            You&apos;re saving {cart.totals.formattedDiscount} on this order
          </p>
        </div>
      )}
    </div>
  );
}

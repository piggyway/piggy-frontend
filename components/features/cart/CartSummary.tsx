"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { PromoService } from "@/lib/services/promo";
import { calculateOrderTotal } from "@/lib/utils/cart";
import { useShippingConfig } from "@/hooks/useShippingConfig";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PromoCodeInputProps {
  onApply: (code: string) => Promise<void>;
  onRemove: () => Promise<void>;
  appliedCode: string | null;
  isLoading: boolean;
  subtotalCents: number;
}

function PromoCodeInput({
  onApply,
  onRemove,
  appliedCode,
  isLoading,
  subtotalCents,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewDiscount, setPreviewDiscount] = useState<number | null>(null);

  const handleValidate = async () => {
    if (!code.trim()) {
      setValidationError("Please enter a promo code");
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setPreviewDiscount(null);

    try {
      const result = await PromoService.validatePromoCode(
        code.trim(),
        subtotalCents
      );

      if (result.valid) {
        setPreviewDiscount(result.discountAmount || 0);
        // Auto-apply after successful validation
        await onApply(code.trim());
        setCode("");
        setPreviewDiscount(null);
      } else {
        setValidationError(result.message || "Invalid promo code");
      }
    } catch {
      setValidationError("Failed to validate promo code");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = async () => {
    await onRemove();
    setCode("");
    setValidationError(null);
    setPreviewDiscount(null);
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="flex flex-col">
          <span className="text-p font-medium text-green-800">
            {appliedCode}
          </span>
          <span className="text-subtle text-green-600">Promo code applied</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isLoading}
          className="h-8 w-8 p-0 text-green-700 hover:bg-green-100 hover:text-green-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="promo-code"
        className="text-primary-navy text-p font-medium"
      >
        Promo Code
      </label>
      <div className="flex gap-2">
        <Input
          id="promo-code"
          placeholder="Enter code"
          className="bg-white"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setValidationError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleValidate();
            }
          }}
          disabled={isValidating || isLoading}
        />
        <Button
          variant="outline"
          className="shrink-0"
          onClick={handleValidate}
          disabled={isValidating || isLoading || !code.trim()}
        >
          {isValidating ? "Validating..." : "Apply"}
        </Button>
      </div>
      {validationError && (
        <p className="text-subtle text-red-500">{validationError}</p>
      )}
      {previewDiscount !== null && (
        <p className="text-subtle text-green-600">
          Discount: ${(previewDiscount / 100).toFixed(2)}
        </p>
      )}
    </div>
  );
}

export interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  shippingEstimate?: number;
  taxEstimate?: number;
  grandTotal?: number;
  currencySymbol?: string;
  className?: string;
}

function CheckoutButtonSection() {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsLoading(true);
    router.push("/checkout");
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || !cart || cart.items.length === 0}
      className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
      size="lg"
    >
      {isLoading ? "Processing..." : "Checkout"}
    </Button>
  );
}

export function CartSummary({
  subtotal,
  discount = 0,
  shippingEstimate = 0,
  taxEstimate = 0,
  grandTotal,
  currencySymbol = "$",
  className,
}: CartSummaryProps) {
  const { cart, applyPromoCode, removePromoCode, isMutating } = useCart();
  const { freeShippingThreshold } = useShippingConfig();

  const total = calculateOrderTotal({
    subtotal,
    shippingEstimate,
    taxEstimate,
    discount,
    grandTotal,
  });

  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);
  const isFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <Card className={cn("flex flex-col gap-6 p-6", className)}>
      <h2 className="text-primary-navy text-lead">Order Summary</h2>

      {/* Free Shipping Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="text-p flex items-center justify-between">
          {isFreeShipping ? (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="font-medium text-green-600"
            >
              You&apos;ve unlocked Free Shipping!
            </motion.span>
          ) : (
            <span className="text-slate-600">
              Add{" "}
              <span className="text-primary-navy font-semibold">
                ${remaining.toFixed(2)}
              </span>{" "}
              more for Free Shipping
            </span>
          )}
          <span className="text-subtle text-slate-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="bg-primary-navy h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      <div className="flex flex-col gap-4">
        <div className="text-p-ui flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-primary-navy font-medium">
            {currencySymbol}
            {subtotal.toFixed(2)}
          </span>
        </div>
        {discount > 0 && (
          <div className="text-p-ui flex justify-between">
            <span className="text-slate-500">Discount</span>
            <span className="font-medium text-green-700">
              -{currencySymbol}
              {discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="text-p-ui flex items-center justify-between gap-3">
          <span className="shrink-0 text-slate-500">Shipping</span>
          {isFreeShipping ? (
            <span className="text-primary-navy font-medium">Free</span>
          ) : shippingEstimate > 0 ? (
            <span className="text-primary-navy font-medium">
              {currencySymbol}
              {shippingEstimate.toFixed(2)}
            </span>
          ) : (
            <span className="text-p text-right whitespace-nowrap text-slate-500">
              Calculated at checkout
            </span>
          )}
        </div>
        <div className="text-p-ui flex justify-between">
          <span className="text-slate-500">Tax estimate</span>
          <span className="text-primary-navy font-medium">
            {currencySymbol}
            {taxEstimate.toFixed(2)}
          </span>
        </div>
      </div>

      {/* mt-auto pins the total/checkout/promo group to the card bottom when
          the card is stretched to match the items column on lg screens */}
      <div className="bg-neutral-stroke h-px w-full lg:mt-auto" />

      {/* Promo Code Section */}
      <div className="mt-2 mb-4">
        <PromoCodeInput
          onApply={applyPromoCode}
          onRemove={removePromoCode}
          appliedCode={cart?.appliedCouponCode || null}
          isLoading={isMutating}
          subtotalCents={cart?.totals.subtotalCents || 0}
        />
      </div>

      <div className="text-lead flex justify-between">
        <span className="text-primary-navy">Order total</span>
        <span className="text-primary-navy">
          {currencySymbol}
          {total.toFixed(2)}
        </span>
      </div>

      <CheckoutButtonSection />
    </Card>
  );
}

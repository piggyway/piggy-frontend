"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "./CartProvider";
import { PromoService } from "@/lib/services/promo";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const DEFAULT_EMAIL = "zianwang9911@gmail.com";

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
    } catch (error) {
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
          <span className="text-sm font-medium text-green-800">
            {appliedCode}
          </span>
          <span className="text-xs text-green-600">Promo code applied</span>
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
        className="text-primary-navy text-sm font-medium"
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
        <p className="text-xs text-red-500">{validationError}</p>
      )}
      {previewDiscount !== null && (
        <p className="text-xs text-green-600">
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

const FREE_SHIPPING_THRESHOLD = 50;

function CheckoutButtonSection() {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsLoading(true);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleCheckout}
        disabled={isLoading || !cart || cart.items.length === 0}
        className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
        size="lg"
      >
        {isLoading ? "Processing..." : "Checkout"}
      </Button>
      <p className="text-center text-xs text-slate-500">
        Shipping & taxes calculated at checkout
      </p>
    </div>
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

  const total = Math.max(
    0,
    grandTotal ?? subtotal + shippingEstimate + taxEstimate - discount
  );

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <Card className={cn("flex flex-col gap-6 p-6", className)}>
      <h2 className="text-primary-navy text-xl font-semibold">Order Summary</h2>

      {/* Free Shipping Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          {isFreeShipping ? (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="font-medium text-green-600"
            >
              You've unlocked Free Shipping! 🎉
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
          <span className="text-xs text-slate-400">
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
        <div className="flex justify-between text-base">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-primary-navy font-medium">
            {currencySymbol}
            {subtotal.toFixed(2)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-slate-500">Discount</span>
            <span className="font-medium text-green-700">
              -{currencySymbol}
              {discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-base">
          <span className="text-slate-500">Shipping estimate</span>
          <span className="text-primary-navy font-medium">
            {shippingEstimate === 0
              ? "Free"
              : `${currencySymbol}${shippingEstimate.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-slate-500">Tax estimate</span>
          <span className="text-primary-navy font-medium">
            {currencySymbol}
            {taxEstimate.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      <div className="flex justify-between text-lg font-semibold">
        <span className="text-primary-navy">Order total</span>
        <span className="text-primary-navy">
          {currencySymbol}
          {total.toFixed(2)}
        </span>
      </div>

      <CheckoutButtonSection />

      {/* Promo Code Section */}
      <div className="mt-2">
        <PromoCodeInput
          onApply={applyPromoCode}
          onRemove={removePromoCode}
          appliedCode={cart?.appliedCouponCode || null}
          isLoading={isMutating}
          subtotalCents={cart?.totals.subtotalCents || 0}
        />
      </div>
    </Card>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

export function CartSummary({
  subtotal,
  discount = 0,
  shippingEstimate = 0,
  taxEstimate = 0,
  grandTotal,
  currencySymbol = "$",
  className,
}: CartSummaryProps) {
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

      <div className="flex flex-col gap-3">
        <Button
          asChild
          className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
          size="lg"
        >
          <Link href="/checkout">Checkout</Link>
        </Button>
        <p className="text-center text-xs text-slate-500">
          Shipping & taxes calculated at checkout
        </p>
      </div>

      {/* Promo Code Section */}
      <div className="mt-2">
        <label
          htmlFor="promo-code"
          className="text-primary-navy mb-2 block text-sm font-medium"
        >
          Promo Code
        </label>
        <div className="flex gap-2">
          <Input
            id="promo-code"
            placeholder="Enter code"
            className="bg-white"
          />
          <Button variant="outline" className="shrink-0">
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}

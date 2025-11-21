"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface CartSummaryProps {
  subtotal: number;
  shippingEstimate?: number;
  taxEstimate?: number;
  className?: string;
}

const FREE_SHIPPING_THRESHOLD = 50;

export function CartSummary({
  subtotal,
  shippingEstimate = 0,
  taxEstimate = 0,
  className,
}: CartSummaryProps) {
  const total = subtotal + shippingEstimate + taxEstimate;
  
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <Card className={cn("flex flex-col gap-6 p-6", className)}>
      <h2 className="text-xl font-semibold text-primary-navy">Order Summary</h2>

      {/* Free Shipping Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          {isFreeShipping ? (
            <span className="font-medium text-green-600">You've unlocked Free Shipping! 🎉</span>
          ) : (
            <span className="text-slate-600">
              Add <span className="font-semibold text-primary-navy">${remaining.toFixed(2)}</span> more for Free Shipping
            </span>
          )}
          <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="h-px w-full bg-neutral-stroke" />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between text-base">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-primary-navy">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-slate-500">Shipping estimate</span>
          <span className="font-medium text-primary-navy">
            {shippingEstimate === 0 ? "Free" : `$${shippingEstimate.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-slate-500">Tax estimate</span>
          <span className="font-medium text-primary-navy">
            ${taxEstimate.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-stroke" />

      <div className="flex justify-between text-lg font-semibold">
        <span className="text-primary-navy">Order total</span>
        <span className="text-primary-navy">${total.toFixed(2)}</span>
      </div>

      <div className="flex flex-col gap-3">
        <Button className="w-full bg-primary-navy hover:bg-primary-navy/90 text-white" size="lg">
          Checkout
        </Button>
        <p className="text-center text-xs text-slate-500">
          Shipping & taxes calculated at checkout
        </p>
      </div>
      
       {/* Promo Code Section */}
       <div className="mt-2">
        <label htmlFor="promo-code" className="mb-2 block text-sm font-medium text-primary-navy">
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

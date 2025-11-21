"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

// Mock Data for Summary
const SUMMARY_ITEMS = [
  {
    id: "1",
    title: "Cozy Guinea Pig Hideout",
    variant: "Large / Blue",
    price: 24.99,
    image: "/hut-example.png",
    quantity: 1,
  },
  {
    id: "2",
    title: "Premium Timothy Hay",
    variant: "5kg Box",
    price: 39.99,
    image: "/default-product-image.png",
    quantity: 2,
  },
];

export function CheckoutSummary() {
  const subtotal: number = SUMMARY_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping: number = 0;
  const tax: number = subtotal * 0.1;
  const total: number = subtotal + shipping + tax;

  return (
    <div className="flex flex-col gap-6">
      {/* Items List */}
      <div className="flex flex-col gap-4">
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border border-neutral-stroke bg-white">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <span className="absolute right-0 top-0 flex size-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-slate-500 text-xs font-medium text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-sm font-medium text-primary-navy">{item.title}</p>
              <p className="text-xs text-slate-500">{item.variant}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-primary-navy">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-neutral-stroke" />

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-primary-navy">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Shipping</span>
          <span className="font-medium text-primary-navy">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Tax</span>
          <span className="font-medium text-primary-navy">
            ${tax.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-stroke" />

      <div className="flex justify-between items-center">
        <span className="text-base font-medium text-primary-navy">Total</span>
        <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500">USD</span>
            <span className="text-xl font-bold text-primary-navy">
            ${total.toFixed(2)}
            </span>
        </div>
      </div>
    </div>
  );
}

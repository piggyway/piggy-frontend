"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";

export interface CartItemProps {
  id: string;
  title: string;
  variant?: string;
  price: number;
  image: string;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onRemove: () => void;
  className?: string;
}

export function CartItem({
  id,
  title,
  variant,
  price,
  image,
  quantity,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-neutral-stroke py-6 sm:flex-row sm:items-center",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:w-32">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium text-primary-navy">{title}</h3>
          {variant && (
            <p className="text-sm text-slate-500">{variant}</p>
          )}
          <p className="font-medium text-primary-navy sm:hidden">
            ${price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
            {/* Price (Desktop) */}
          <p className="hidden font-medium text-primary-navy sm:block">
            ${price.toFixed(2)}
          </p>

          {/* Quantity */}
          <QuantitySelector
            value={quantity}
            onValueChange={onQuantityChange}
            className="[&_label]:hidden" 
          />

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="text-slate-400 hover:text-destructive"
            aria-label="Remove item"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

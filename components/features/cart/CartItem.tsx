"use client";

import { useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
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
  currencySymbol?: string;
  maxQuantity?: number;
  disabled?: boolean;
  onQuantityChange: (value: number) => void;
  onRemove: () => void;
  className?: string;
}

export function CartItem({
  id: _id,
  title,
  variant,
  price,
  image,
  quantity,
  currencySymbol = "$",
  maxQuantity,
  disabled = false,
  onQuantityChange,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "border-neutral-stroke group relative flex flex-col gap-4 border-b py-6 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center",
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
          <h3 className="text-primary-navy text-lg font-medium">{title}</h3>
          {variant && <p className="text-sm text-slate-500">{variant}</p>}
          <p className="text-primary-navy font-medium sm:hidden">
            {currencySymbol}
            {price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          {/* Price (Desktop) */}
          <p className="text-primary-navy hidden font-medium sm:block">
            {currencySymbol}
            {price.toFixed(2)}
          </p>

          {/* Quantity */}
          <QuantitySelector
            value={quantity}
            max={maxQuantity}
            disabled={disabled}
            onValueChange={onQuantityChange}
            className="[&_label]:hidden"
          />

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            className="hover:text-destructive text-slate-400"
            disabled={disabled}
            aria-label="Remove item"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

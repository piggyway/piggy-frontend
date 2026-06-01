"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  showLabel?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onValueChange,
  disabled = false,
  showLabel = true,
  fullWidth = false,
  className,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (!disabled && value > min) {
      onValueChange?.(value - 1);
    }
  };

  const handleIncrease = () => {
    if (!disabled && value < max) {
      onValueChange?.(value + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showLabel && (
        <label className="text-primary-navy text-base leading-6 font-medium">
          Quantity
        </label>
      )}
      <div
        className={cn(
          "border-neutral-stroke flex items-center gap-2 rounded-md border bg-white",
          fullWidth && "w-full justify-between"
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleDecrease}
          disabled={disabled || value <= min}
          className="rounded-md border-0"
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </Button>
        <span className="text-primary-navy min-w-[2rem] px-2 text-center text-base font-normal">
          {value}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleIncrease}
          disabled={disabled || value >= max}
          className="rounded-md border-0"
          aria-label="Increase quantity"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

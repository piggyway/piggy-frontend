"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onValueChange?: (value: number) => void
  className?: string
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onValueChange,
  className,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onValueChange?.(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onValueChange?.(value + 1)
    }
  }

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <label className="text-base font-medium leading-6 text-primary-navy">
        Quantity
      </label>
      <div className="flex gap-2 items-center border border-neutral-stroke rounded-md bg-white">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleDecrease}
          disabled={value <= min}
          className="rounded-md border-0"
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </Button>
        <span className="min-w-[2rem] text-center text-base font-normal text-primary-navy px-2">
          {value}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleIncrease}
          disabled={value >= max}
          className="rounded-md border-0"
          aria-label="Increase quantity"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  )
}


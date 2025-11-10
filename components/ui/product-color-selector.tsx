"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorOption {
  value: string
  label: string
  color: string // hex color code
}

export interface ProductColorSelectorProps {
  colors: ColorOption[]
  selectedColor?: string
  onColorChange?: (color: string) => void
  className?: string
}

export function ProductColorSelector({
  colors,
  selectedColor,
  onColorChange,
  className,
}: ProductColorSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-3 items-start w-full", className)}>
      <label className="text-base font-medium leading-6 text-primary-navy">
        Color
      </label>
      <div className="flex gap-3 items-center flex-wrap">
        {colors.map((colorOption) => {
          const isSelected = selectedColor === colorOption.value
          return (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => onColorChange?.(colorOption.value)}
              className={cn(
                "flex flex-col gap-1.5 items-center cursor-pointer transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy focus-visible:ring-offset-2 rounded-lg"
              )}
              aria-label={`Select color ${colorOption.label}`}
            >
              {/* Color Circle */}
              <div
                className={cn(
                  "size-10 rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary-navy ring-2 ring-primary-purple ring-offset-2"
                    : "border-neutral-stroke hover:border-primary-navy-light"
                )}
                style={{ backgroundColor: colorOption.color }}
              />
              {/* Label */}
              <span
                className={cn(
                  "text-sm font-normal leading-5",
                  isSelected ? "text-primary-navy" : "text-slate-400"
                )}
              >
                {colorOption.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


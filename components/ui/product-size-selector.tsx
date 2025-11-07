"use client"

import * as React from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SizeOption {
  value: string
  label: string
}

export interface ProductSizeSelectorProps {
  sizes: SizeOption[]
  selectedSize?: string
  onSizeChange?: (size: string) => void
  sizeGuideLink?: string
  onSizeGuideClick?: () => void
  className?: string
}

export function ProductSizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  sizeGuideLink,
  onSizeGuideClick,
  className,
}: ProductSizeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const selectedSizeLabel =
    sizes.find((s) => s.value === selectedSize)?.label || "Select Size"

  const handleSizeSelect = (size: string) => {
    onSizeChange?.(size)
    setIsOpen(false)
  }

  return (
    <div className={cn("flex flex-col gap-3 items-start w-full", className)}>
      <div className="flex gap-2 items-center w-full">
        <label className="text-base font-medium leading-6 text-primary-navy">
          Size
        </label>
        {sizeGuideLink && (
          <button
            type="button"
            onClick={onSizeGuideClick}
            className="flex items-center gap-1 text-sm font-normal text-primary-navy hover:text-primary-navy-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy focus-visible:ring-offset-2 rounded"
            aria-label="Size guide"
          >
            <HelpCircle className="size-4" />
            <span className="underline">Size Guide</span>
          </button>
        )}
      </div>

      {/* Dropdown */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex gap-2 items-center justify-between w-full px-4 py-2 rounded-md border bg-white text-base font-normal text-primary-navy",
            "hover:border-primary-navy-light transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-navy focus-visible:ring-offset-2",
            isOpen && "border-primary-navy"
          )}
          aria-label="Select size"
          aria-expanded={isOpen}
        >
          <span>{selectedSizeLabel}</span>
          <ChevronDown
            className={cn(
              "size-4 text-primary-navy transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-stroke rounded-md shadow-lg z-20 max-h-60 overflow-auto">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => handleSizeSelect(size.value)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-base font-normal text-primary-navy hover:bg-primary-purple/20 transition-colors",
                    selectedSize === size.value && "bg-primary-purple/30"
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}


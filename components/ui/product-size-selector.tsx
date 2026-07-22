"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SizeOption {
  value: string;
  label: string;
}

export interface ProductSizeSelectorProps {
  sizes: SizeOption[];
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  label?: string;
  disabledValues?: string[];
  sizeGuideLink?: string;
  onSizeGuideClick?: () => void;
  className?: string;
}

export function ProductSizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  label = "Size",
  disabledValues = [],
  sizeGuideLink,
  onSizeGuideClick,
  className,
}: ProductSizeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedSizeLabel =
    sizes.find((s) => s.value === selectedSize)?.label || "Select Size";

  const handleSizeSelect = (size: string) => {
    if (disabledValues.includes(size)) return;
    onSizeChange?.(size);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex w-full flex-col items-start gap-3", className)}>
      <div className="flex w-full items-center gap-2">
        <label className="text-primary-navy-light text-lead leading-8 font-semibold">
          {label}
        </label>
        {sizeGuideLink && (
          <button
            type="button"
            onClick={onSizeGuideClick}
            className="text-primary-navy hover:text-primary-navy-light focus-visible:ring-primary-navy text-p flex items-center gap-1 rounded font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
            "text-primary-navy text-p flex w-full items-center justify-between gap-2 rounded-md border bg-white px-4 py-2 font-normal",
            "hover:border-primary-navy-light transition-colors",
            "focus-visible:ring-primary-navy focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            isOpen && "border-primary-navy"
          )}
          aria-label="Select size"
          aria-expanded={isOpen}
        >
          <span>{selectedSizeLabel}</span>
          <ChevronDown
            className={cn(
              "text-primary-navy size-4 transition-transform",
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
            <div className="border-neutral-stroke absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg">
              {sizes.map((size) => {
                const isDisabled = disabledValues.includes(size.value);
                return (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => handleSizeSelect(size.value)}
                    disabled={isDisabled}
                    className={cn(
                      "text-primary-navy hover:bg-primary-purple/20 text-p w-full px-4 py-2 text-left font-normal transition-colors",
                      selectedSize === size.value && "bg-primary-purple/30",
                      isDisabled &&
                        "cursor-not-allowed opacity-40 hover:bg-transparent"
                    )}
                  >
                    {size.label}
                    {isDisabled ? " (Out of Stock)" : ""}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

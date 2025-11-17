"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ColorOption {
  value: string;
  label: string;
  color: string; // hex color code
}

export interface ProductColorSelectorProps {
  colors: ColorOption[];
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  className?: string;
}

export function ProductColorSelector({
  colors,
  selectedColor,
  onColorChange,
  className,
}: ProductColorSelectorProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-3", className)}>
      <label className="text-primary-navy text-base leading-6 font-medium">
        Color
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {colors.map((colorOption) => {
          const isSelected = selectedColor === colorOption.value;
          return (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => onColorChange?.(colorOption.value)}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1.5 transition-all",
                "focus-visible:ring-primary-navy rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              )}
              aria-label={`Select color ${colorOption.label}`}
            >
              {/* Color Circle */}
              <div
                className={cn(
                  "size-10 rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary-navy ring-primary-purple ring-2 ring-offset-2"
                    : "border-neutral-stroke hover:border-primary-navy-light"
                )}
                style={{ backgroundColor: colorOption.color }}
              />
              {/* Label */}
              <span
                className={cn(
                  "text-sm leading-5 font-normal",
                  isSelected ? "text-primary-navy" : "text-slate-400"
                )}
              >
                {colorOption.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

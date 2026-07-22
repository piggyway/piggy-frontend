"use client";

import { ShoppingBag, Home, Grid3x3, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: CategoryItem[] = [
  { id: "liner", label: "Liner", icon: ShoppingBag },
  { id: "hut", label: "Hut", icon: Home },
  { id: "c-c-cage", label: "C&C Cage", icon: Grid3x3 },
  { id: "combo", label: "Combos", icon: Package },
];

interface CategoryFilterBarProps {
  activeCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export function CategoryFilterBar({
  activeCategory = null,
  onCategoryChange,
}: CategoryFilterBarProps) {
  const handleCategoryClick = (categoryId: string) => {
    const newCategory = activeCategory === categoryId ? null : categoryId;
    onCategoryChange?.(newCategory);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 overflow-x-auto pb-2 sm:mb-8 sm:gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all sm:gap-2 sm:p-3",
              "hover:bg-primary-purple/20",
              isActive && "bg-primary-purple/30"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-12 sm:w-12",
                "border-2 bg-white",
                isActive ? "border-primary-navy" : "border-neutral-stroke"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 sm:h-6 sm:w-6",
                  isActive ? "text-primary-navy" : "text-primary-navy/60"
                )}
              />
            </div>
            <span
              className={cn(
                "text-detail font-medium sm:text-xs",
                isActive ? "text-primary-navy" : "text-primary-navy/80"
              )}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

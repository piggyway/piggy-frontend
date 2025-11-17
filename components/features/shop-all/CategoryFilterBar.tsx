"use client";

import {
  ShoppingBag,
  Home,
  Grid3x3,
  Cookie,
  Package,
  Star,
} from "lucide-react";
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
  { id: "snack", label: "Snacks", icon: Cookie },
  { id: "combo", label: "Combos", icon: Package },
  { id: "merch", label: "Merch", icon: Star },
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
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg p-3 transition-all",
              "hover:bg-primary-purple/20",
              isActive && "bg-primary-purple/30"
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                "border-2 bg-white",
                isActive ? "border-primary-navy" : "border-neutral-stroke"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  isActive ? "text-primary-navy" : "text-primary-navy/60"
                )}
              />
            </div>
            <span
              className={cn(
                "text-xs font-medium",
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

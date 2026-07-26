"use client";

import Image from "next/image";
import { ShoppingBag, Home, Grid3x3, Package, Cookie, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/models";

/**
 * Fallback icons per category slug, used when the CMS does not provide a
 * nav_icon_url. Add a slug here to give a new category a bespoke icon;
 * otherwise it falls back to DEFAULT_ICON. The CMS nav_icon_url always wins.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  liner: ShoppingBag,
  hideout: Home,
  treat: Cookie,
  "c-c-cage": Grid3x3,
  combo: Package,
};

const DEFAULT_ICON: LucideIcon = Tag;

interface CategoryFilterBarProps {
  categories: Category[];
  activeCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export function CategoryFilterBar({
  categories,
  activeCategory = null,
  onCategoryChange,
}: CategoryFilterBarProps) {
  const handleCategoryClick = (slug: string) => {
    const newCategory = activeCategory === slug ? null : slug;
    onCategoryChange?.(newCategory);
  };

  if (categories.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 overflow-x-auto pb-2 sm:mb-8 sm:gap-4">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.slug] ?? DEFAULT_ICON;
        const isActive = activeCategory === category.slug;

        return (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all sm:gap-2 sm:p-3",
              "hover:bg-primary-purple/20",
              isActive && "bg-primary-purple/30"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-colors sm:h-12 sm:w-12",
                "border-2 bg-white",
                isActive ? "border-primary-navy" : "border-neutral-stroke"
              )}
            >
              {category.navIconUrl ? (
                <Image
                  src={category.navIconUrl}
                  alt={category.name}
                  width={24}
                  height={24}
                  className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                />
              ) : (
                <Icon
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6",
                    isActive ? "text-primary-navy" : "text-primary-navy/60"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-detail font-medium sm:text-xs",
                isActive ? "text-primary-navy" : "text-primary-navy/80"
              )}
            >
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

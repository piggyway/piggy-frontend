"use client";

import { useCallback, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CategoryFilterBar } from "@/components/features/shop-all/CategoryFilterBar";
import { ProductsSection } from "@/components/features/shop-all/ProductsSection";
import type { SortOption, VariantListItem } from "@/lib/types/product";

// choose grid or list
type ViewMode = "grid" | "list";

/**
 * Client wrapper for the shop-all page. Receives server-fetched data as
 * props (so the grid is present in the initial HTML) and translates filter
 * interactions into URL updates, which re-render the server page.
 */
interface ShopAllContentProps {
  variants: VariantListItem[];
  totalItems: number;
  totalPages: number;
  category: string | null;
  sort: SortOption;
  page: number;
  pageSize: number;
  q?: string;
  view: ViewMode;
}

export function ShopAllContent({
  variants,
  totalItems,
  totalPages,
  category,
  sort,
  page,
  pageSize,
  q,
  view,
}: ShopAllContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Update URL with new params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset page to 1 when filters change (except when page itself changes)
      if (!("page" in updates) && Object.keys(updates).length > 0) {
        params.delete("page");
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      startTransition(() => {
        router.push(newUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  // Crawlable pagination hrefs, preserving all other active params
  const getPageHref = useCallback(
    (targetPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (targetPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", targetPage.toString());
      }
      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [searchParams, pathname]
  );

  const handleCategoryChange = (newCategory: string | null) => {
    updateSearchParams({ category: newCategory });
  };

  const handleSortChange = (newSort: SortOption) => {
    updateSearchParams({ sort: newSort });
  };

  const handleClearFilters = () => {
    updateSearchParams({ category: null, q: null, page: "1" });
  };

  const handleViewChange = (newView: ViewMode) => {
    updateSearchParams({ view: newView });
  };

  return (
    <>
      {/* Category Filter */}
      <CategoryFilterBar
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Section */}
      <ProductsSection
        variants={variants}
        totalItems={totalItems}
        totalPages={totalPages}
        isPending={isPending}
        category={category || undefined}
        sort={sort}
        page={page}
        pageSize={pageSize}
        q={q}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        view={view}
        onViewChange={handleViewChange}
        getPageHref={getPageHref}
      />
    </>
  );
}

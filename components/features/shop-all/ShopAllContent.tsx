"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { CategoryFilterBar } from "@/components/features/shop-all/CategoryFilterBar";
import { ProductsSection } from "@/components/features/shop-all/ProductsSection";
import type { SortOption } from "@/lib/types/product";

export function ShopAllContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read state from URL
  const category = searchParams.get("category") || undefined;
  const sort = (searchParams.get("sort") as SortOption) || "-date_created";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "9", 10);
  const q = searchParams.get("q") || undefined;

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
      router.push(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const handleCategoryChange = (newCategory: string | null) => {
    updateSearchParams({ category: newCategory });
  };

  const handleSortChange = (newSort: SortOption) => {
    updateSearchParams({ sort: newSort });
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Category Filter */}
      <CategoryFilterBar
        activeCategory={category || null}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Section */}
      <ProductsSection
        category={category}
        sort={sort}
        page={page}
        pageSize={pageSize}
        q={q}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
      />
    </>
  );
}

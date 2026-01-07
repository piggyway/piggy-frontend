"use client";

import { useEffect, useState } from "react";
import { X, LayoutGrid, List  } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductService } from "@/lib/services/products";
import type { VariantListItem, SortOption } from "@/lib/types/product";
import { SORT_OPTIONS } from "@/lib/types/product";
import { VariantCard } from "@/components/features/shop-all/VariantCard";


// grid or list
type ViewMode = "grid" | "list";

interface ProductsSectionProps {
  category?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  q?: string;
  onSortChange?: (sort: SortOption) => void;
  onPageChange?: (page: number) => void;
  onClearFilters?: () => void;
  view?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
}

const productBackgrounds = [
  "bg-[#e8e8f7]", // light purple
  "bg-[#ececec]", // light gray
  "bg-secondary-mint", // mint green
  "bg-neutral-pink-background", // pink
  "bg-[#e8e8f7]", // light purple
  "bg-neutral-pink-background", // pink
  "bg-[#e8e8f7]", // light purple
  "bg-secondary-mint", // mint green
  "bg-[#e8eef7]", // light blue-gray
];

export function ProductsSection({
  category,
  sort = "-date_created",
  page = 1,
  pageSize = 9,
  q,
  onSortChange,
  onPageChange,
  onClearFilters,
  view = "grid",
  onViewChange,
}: ProductsSectionProps) {
  const [variants, setVariants] = useState<VariantListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch variants when filters change
  useEffect(() => {
    const fetchVariants = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await ProductService.getVariants({
          page,
          page_size: pageSize,
          category: category || undefined,
          q: q || undefined,
          in_stock: "true",
        });
        setVariants(response.data);
        setTotalItems(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching variants:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariants();
  }, [category, sort, page, pageSize, q]);

  const handleSortChange = (newSort: SortOption) => {
    setShowDropdown(false);
    onSortChange?.(newSort);
  };

  const clearSort = () => {
    setShowDropdown(false);
    onSortChange?.("-date_created");
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sort)?.label || "Newest";

  const hasActiveFilters = !!category || !!q;

  return (
    <AnimatedSection>
      {/* Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Item Count */}
        <PaginationInfo
          currentPage={page}
          pageSize={pageSize}
          total={totalItems}
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-primary-navy hover:bg-neutral-background flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
              Clear Filters
            </button>
          )}

          {/* Sort Dropdown */}
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewChange?.("grid")}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                view === "grid"
                  ? "bg-primary-purple text-primary-navy"
                  : "text-primary-navy hover:bg-neutral-background"
              )}
              aria-pressed={view === "grid"}
            >
              <span className="inline-flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Grid
              </span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange?.("list")}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                view === "list"
                  ? "bg-primary-purple text-primary-navy"
                  : "text-primary-navy hover:bg-neutral-background"
              )}
              aria-pressed={view === "list"}
            >
              <span className="inline-flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </span>
            </button>
          </div>

          <div className="relative">
            <div className="bg-primary-purple flex items-center gap-2 rounded-full px-3 py-2 sm:px-4">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-primary-navy text-xs font-medium sm:text-sm"
              >
                Sort by: {currentSortLabel}
              </button>
              {sort !== "-date_created" && (
                <button
                  onClick={clearSort}
                  className="rounded-full p-0.5 transition-colors hover:bg-white/50"
                  aria-label="Clear sort"
                >
                  <X className="text-primary-navy h-3 w-3" />
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setShowDropdown(false)}
                />
                {/* Dropdown */}
                <div className="border-neutral-stroke absolute right-0 z-10 mt-2 w-48 rounded-lg border bg-white shadow-lg">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                        sort === option.value
                          ? "bg-primary-purple text-primary-navy font-medium"
                          : "text-primary-navy hover:bg-neutral-background"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Variants Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={pageSize} className="mb-8" />
      ) : error ? (
        <div className="mb-8 flex min-h-[300px] items-center justify-center rounded-[28px] bg-white p-8">
          <div className="text-center">
            <p className="text-primary-navy mb-4 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-navy hover:text-primary-navy-light font-medium underline transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : variants.length === 0 ? (
        <div className="mb-8 flex min-h-[300px] items-center justify-center rounded-[28px] bg-white p-8">
          <div className="text-center">
            <p className="text-primary-navy text-lg">No products found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your filters or search criteria
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant, index) => (
            <div
              key={variant.variantId}
              className={cn(
                "rounded-[28px] p-0",
                productBackgrounds[index % productBackgrounds.length]
              )}
            >
              <VariantCard variant={variant} className="bg-transparent" />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => onPageChange?.(newPage)}
          />
        </div>
      )}
    </AnimatedSection>
  );
}

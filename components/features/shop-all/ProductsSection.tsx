"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductService } from "@/lib/services/products";
import type {
  ProductListItem,
  SortOption,
  ProductListParams,
} from "@/lib/types/product";
import { SORT_OPTIONS } from "@/lib/types/product";

interface ProductsSectionProps {
  category?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  q?: string;
  onSortChange?: (sort: SortOption) => void;
  onPageChange?: (page: number) => void;
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
}: ProductsSectionProps) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      const params: ProductListParams = {
        page,
        page_size: pageSize,
        sort,
      };

      if (category) {
        params.category = category;
      }

      if (q) {
        params.q = q;
      }

      try {
        const response = await ProductService.getProducts(params);
        setProducts(response.data);
        setTotalItems(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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

        {/* Sort Dropdown */}
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

      {/* Products Grid */}
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
      ) : products.length === 0 ? (
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
          {products.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                "rounded-[28px] p-0",
                productBackgrounds[index % productBackgrounds.length]
              )}
            >
              <ProductCard
                title={product.title}
                subtitle={product.subtitle}
                price={product.formattedPrice}
                image={product.imageUrl}
                href={`/shop/${product.category?.slug || "product"}/${product.slug}`}
                onAddToCart={() => console.log(`Add ${product.title} to cart`)}
                className="bg-transparent"
              />
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

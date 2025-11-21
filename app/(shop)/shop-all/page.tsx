import type { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbsNav } from "@/components/features/shop-all/BreadcrumbsNav";
import { ShopAllContent } from "@/components/features/shop-all/ShopAllContent";
import { StarterKitsSection } from "@/components/features/shop/StarterKitsSection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { CategoryService } from "@/lib/services/categories";
import { getBaseUrl } from "@/lib/utils/seo";
import { FloatingCartButton } from "@/components/features/cart/FloatingCartButton";

interface ShopAllPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

/**
 * Generate metadata for shop-all page
 */
export async function generateMetadata({
  searchParams,
}: ShopAllPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = params.category;
  const searchQuery = params.q;
  const page = Number(params.page) || 1;

  const baseUrl = getBaseUrl();
  let title = "Shop Guinea Pig & Rabbit Essentials | Piggy Way Crossing";
  let description =
    "Discover premium guinea pig and rabbit essentials at Piggy Way Crossing. Shop liners, huts, cages, snacks, and more for your furry friends.";

  // Handle category filter
  if (categorySlug) {
    try {
      const categories = await CategoryService.getCategories();
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        title = `Shop ${category.name} | Piggy Way Crossing`;
        description = `Browse our collection of ${category.name.toLowerCase()} for guinea pigs and rabbits at Piggy Way Crossing.`;
      }
    } catch (error) {
      console.error("[Metadata] Failed to fetch category:", error);
    }
  }

  // Handle search query
  if (searchQuery) {
    title = `Search "${searchQuery}" | Piggy Way Crossing`;
    description = `Search results for "${searchQuery}" at Piggy Way Crossing.`;
  }

  // Handle pagination
  if (page > 1) {
    title = `${title} - Page ${page}`;
  }

  const url = categorySlug
    ? `${baseUrl}/shop-all?category=${categorySlug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}${page > 1 ? `&page=${page}` : ""}`
    : searchQuery
      ? `${baseUrl}/shop-all?q=${encodeURIComponent(searchQuery)}${page > 1 ? `&page=${page}` : ""}`
      : `${baseUrl}/shop-all${page > 1 ? `?page=${page}` : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical:
        page === 1 && !searchQuery
          ? `${baseUrl}/shop-all${categorySlug ? `?category=${categorySlug}` : ""}`
          : url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ShopAllPage({ searchParams }: ShopAllPageProps) {
  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={3} />
      <div className="container mx-auto max-w-[1160px] px-4 py-8">
        {/* Breadcrumbs */}
        <BreadcrumbsNav />

        {/* Page Title */}
        <h1 className="text-primary-navy-light mt-6 mb-8 text-[32px] leading-tight font-semibold sm:text-[42px]">
          Shop{" "}
          <span className="text-primary-navy">
            Guinea Pig & Rabbit Essentials
          </span>{" "}
          🐹🐰
        </h1>

        {/* Category Filter and Products Section with URL State */}
        <Suspense fallback={<ProductGridSkeleton count={9} />}>
          <ShopAllContent />
        </Suspense>
      </div>

      {/* Starter Kits Section */}
      <Suspense fallback={<div className="h-[400px]" />}>
        <StarterKitsSection />
      </Suspense>
      <FloatingCartButton />
    </div>
  );
}

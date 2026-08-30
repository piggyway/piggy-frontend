import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbsNav } from "@/components/features/shop-all/BreadcrumbsNav";
import { ShopAllContent } from "@/components/features/shop-all/ShopAllContent";
// import { StarterKitsSection } from "@/components/features/shop/StarterKitsSection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { CategoryService } from "@/lib/services/categories";
import { ProductService } from "@/lib/services/products";
import { getBaseUrl } from "@/lib/utils/seo";
import { FloatingCartButton } from "@/components/features/cart/FloatingCartButton";
import type { SortOption } from "@/lib/types/product";

const PAGE_SIZE = 9;

interface ShopAllPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
    sort?: string;
    view?: string;
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
  let title = "Shop Guinea Pig & Rabbit Essentials";
  let description =
    "Discover premium guinea pig and rabbit essentials at Piggy Way Crossing. Shop liners, huts, cages, snacks, and more for your furry friends.";

  // Handle category filter
  if (categorySlug) {
    try {
      const categories = await CategoryService.getCategories();
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        title = `Shop ${category.name}`;
        description = `Browse our collection of ${category.name.toLowerCase()} for guinea pigs and rabbits at Piggy Way Crossing.`;
      }
    } catch (error) {
      console.error("[Metadata] Failed to fetch category:", error);
    }
  }

  // Handle search query
  if (searchQuery) {
    title = `Search "${searchQuery}"`;
    description = `Search results for "${searchQuery}" at Piggy Way Crossing.`;
  }

  // Handle pagination
  if (page > 1) {
    title = `${title} - Page ${page}`;
  }

  // A filter that matches nothing renders a "No products found" page under a
  // 200, which crawlers treat as thin content. Ask for a single row purely to
  // read the total, then keep those pages out of the index. Categories that do
  // have products stay indexable.
  //
  // A failed count must not add noindex: dropping a valid page out of the
  // index over a transient error is worse than briefly indexing an empty one.
  let hasNoResults = false;
  try {
    const countResponse = await ProductService.getVariants({
      page: 1,
      page_size: 1,
      category: categorySlug,
      q: searchQuery,
    });
    hasNoResults = countResponse.pagination.total === 0;
  } catch (error) {
    console.error("[Metadata] Failed to count shop-all results:", error);
  }

  const url = categorySlug
    ? `${baseUrl}/shop-all?category=${categorySlug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}${page > 1 ? `&page=${page}` : ""}`
    : searchQuery
      ? `${baseUrl}/shop-all?q=${encodeURIComponent(searchQuery)}${page > 1 ? `&page=${page}` : ""}`
      : `${baseUrl}/shop-all${page > 1 ? `?page=${page}` : ""}`;

  return {
    title,
    description,
    // Internal search result pages and empty result pages should not be indexed
    ...(searchQuery || hasNoResults
      ? { robots: { index: false, follow: true } }
      : {}),
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
  const params = await searchParams;
  const category = params.category || undefined;
  const q = params.q || undefined;
  const parsedPage = parseInt(params.page || "1", 10);
  const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const sort = (params.sort as SortOption) || "-date_created";
  const view = params.view === "list" ? "list" : "grid";

  // Fetch server-side so product links are present in the initial HTML
  const [response, categories] = await Promise.all([
    // Out-of-stock variants are intentionally included so the grid can show a
    // "Sold Out" state; the backend still excludes is_available=false variants.
    ProductService.getVariants({
      page,
      page_size: PAGE_SIZE,
      category,
      q,
      sort,
    }),
    CategoryService.getCategories(),
  ]);

  // Unknown categories and pages past the end used to render an empty grid
  // under a 200, which crawlers treat as a soft 404 and keep re-crawling.
  // A search with no hits is a real empty state, so it stays a 200.
  //
  // Both fetches above throw when the backend fails, so reaching here means
  // `categories` is the real list and an unmatched slug really is unknown.
  if (category && !categories.some((item) => item.slug === category)) {
    notFound();
  }
  if (page > 1 && page > response.pagination.totalPages) {
    notFound();
  }

  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={3} />
      <div className="container mx-auto max-w-[1160px] px-4 py-8">
        {/* Breadcrumbs */}
        <BreadcrumbsNav />

        {/* Page Title */}
        <h1 className="text-primary-navy-light text-large sm:text-h4 mt-6 mb-8 leading-tight font-semibold">
          Shop{" "}
          <span className="text-primary-navy">
            Guinea Pig & Rabbit Essentials
          </span>{" "}
          🐹🐰
        </h1>

        {/* Category Filter and Products Section with URL State */}
        <ShopAllContent
          categories={categories}
          variants={response.data}
          totalItems={response.pagination.total}
          totalPages={response.pagination.totalPages}
          category={category || null}
          sort={sort}
          page={page}
          pageSize={PAGE_SIZE}
          q={q}
          view={view}
        />
      </div>

      {/* Starter Kits Section */}
      {/* <Suspense fallback={<div className="h-[400px]" />}>
        <StarterKitsSection />
      </Suspense> */}
      <FloatingCartButton />
    </div>
  );
}

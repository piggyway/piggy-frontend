import { AnimatedSection } from "../homepage/AnimatedSection";
import { ServerProductService } from "@/lib/services/products.server";
import { ProductCardClient } from "../shop/ProductCardClient";
import type { ProductListItem } from "@/lib/types/product";

interface RelatedProductsSectionProps {
  categorySlug?: string | null;
  excludeProductId?: number;
}

export async function RelatedProductsSection({
  categorySlug,
  excludeProductId,
}: RelatedProductsSectionProps) {
  // If no category slug, return empty section
  if (!categorySlug) {
    return null;
  }

  // Fetch products from the same category, sorted by price ascending.
  // This section is supplementary, so a failed fetch hides it instead of
  // taking the product page down.
  let products: ProductListItem[] = [];
  try {
    const response = await ServerProductService.getProducts({
      category: categorySlug,
      sort: "base_price",
      page_size: 4, // Get 4 to account for excluding current product
    });
    products = response.data;
  } catch (error) {
    console.error(
      "[RelatedProductsSection] Failed to fetch related products:",
      error
    );
    return null;
  }

  // Filter out current product and take first 3
  const relatedProducts = products
    .filter((product) => product.id !== excludeProductId)
    .slice(0, 3);

  // If no related products, return null
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Title */}
        <h2 className="text-primary-navy-light text-large sm:text-h4 mb-8 font-semibold">
          Related Products
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.map((product) => (
            <ProductCardClient key={product.id} product={product} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

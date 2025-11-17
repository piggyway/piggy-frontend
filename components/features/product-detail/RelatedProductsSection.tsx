import { AnimatedSection } from "../homepage/AnimatedSection";
import { ProductService } from "@/lib/services/products";
import { ProductCardClient } from "../shop/ProductCardClient";

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

  // Fetch products from the same category, sorted by price ascending
  const response = await ProductService.getProducts({
    category: categorySlug,
    sort: "base_price",
    page_size: 4, // Get 4 to account for excluding current product
  });

  // Filter out current product and take first 3
  const relatedProducts = response.data
    .filter((product) => product.id !== excludeProductId)
    .slice(0, 3);

  // If no related products, return null
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <AnimatedSection className="w-full py-12 sm:py-16 md:py-20">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Title */}
        <h2 className="text-primary-navy-light mb-8 text-[28px] font-semibold sm:text-[32px]">
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

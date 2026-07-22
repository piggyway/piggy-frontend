import { AnimatedSection } from "../homepage/AnimatedSection";
import { ProductCardClient } from "./ProductCardClient";
import { ProductService } from "@/lib/services/products";

/**
 * Server component: featured products are fetched during server rendering so
 * real product links are present in the initial HTML (replaces the previous
 * hardcoded placeholder cards).
 */
export async function FeaturedPicksSection() {
  const response = await ProductService.getProducts({
    featured: "true",
    page_size: 3,
  });
  const products = response.data;

  if (products.length === 0) {
    return null;
  }

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-primary-navy text-p-ui sm:text-lead mb-2 leading-[32px] font-normal">
            Most Loved by Customers
          </p>
          <h2 className="text-primary-navy-light text-large sm:text-h4 leading-[42px] font-semibold tracking-[-0.21px]">
            Featured Picks
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCardClient key={product.id} product={product} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

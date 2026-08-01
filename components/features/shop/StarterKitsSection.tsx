import { AnimatedSection } from "../homepage/AnimatedSection";
import { ProductService } from "@/lib/services/products";
import { VariantCard } from "@/components/features/shop-all/VariantCard";

export async function StarterKitsSection() {
  // Fetch 3 most recently updated variants
  const response = await ProductService.getVariants({
    sort: "-date_created", // Sort by creation date descending (newest first)
    page_size: 3,
    in_stock: "true",
  });

  const variants = response.data;

  // If no products, return null
  if (variants.length === 0) {
    return null;
  }

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-primary-navy mb-2 text-lg leading-relaxed sm:text-xl">
            Everything You Need to Begin
          </p>
          <h2 className="text-primary-navy-light text-large sm:text-h4 leading-tight font-semibold">
            Starter Kits & Bundles
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant) => (
            <VariantCard key={variant.variantId} variant={variant} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

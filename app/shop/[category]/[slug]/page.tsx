import { notFound } from "next/navigation";
import { ProductDetailContent } from "@/components/features/product-detail/ProductDetailContent";
import { ProductInformationSection } from "@/components/features/product-detail/ProductInformationSection";
import { PetIconsSection } from "@/components/features/product-detail/PetIconsSection";
import { TestimonialsSection } from "@/components/features/shop/TestimonialsSection";
import { RelatedProductsSection } from "@/components/features/product-detail/RelatedProductsSection";
import { ProductService } from "@/lib/services/products";

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data from API
  const product = await ProductService.getProductBySlug(slug);

  // If product not found, show 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-neutral-background-light min-h-screen">
      {/* Main Product Section */}
      <div className="container mx-auto max-w-[1160px] px-4 py-8">
        <ProductDetailContent product={product} />
      </div>

      {/* Product Information - hardcoded for now */}
      <ProductInformationSection />

      {/* Pet Icons - based on product species */}
      <PetIconsSection species={product.species} />

      {/* Testimonials - hardcoded for now */}
      <TestimonialsSection />

      {/* Related Products - hardcoded for now */}
      <RelatedProductsSection />
    </div>
  );
}

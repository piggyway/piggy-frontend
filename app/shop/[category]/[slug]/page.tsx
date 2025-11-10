import { ProductImageGallery } from '@/components/features/product-detail/ProductImageGallery';
import { ProductDetailsPanel } from '@/components/features/product-detail/ProductDetailsPanel';
import { ProductInformationSection } from '@/components/features/product-detail/ProductInformationSection';
import { PetIconsSection } from '@/components/features/product-detail/PetIconsSection';
import { TestimonialsSection } from '@/components/features/shop/TestimonialsSection';
import { RelatedProductsSection } from '@/components/features/product-detail/RelatedProductsSection';

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Mock product data - in real app, fetch from API
const getProductData = (category: string, slug: string) => {
  return {
    name: 'Xie xie meow 5 gen Liner',
    category: category,
    slug: slug,
    description: 'Eco-friendly, washable liners designed for guinea pigs & rabbits! Perfect for happy piggies and bunnies every day.',
    price: 99.99,
    colors: [
      { id: 'mint', name: 'Mint', hex: '#e1f2ef' },
      { id: 'piggy-party', name: 'Piggy Party', hex: '#fcb1c1' },
      { id: 'baby-blue', name: 'Baby Blue', hex: '#a8c3f7' },
      { id: 'navy', name: 'Navy', hex: '#405aab' },
    ],
    sizes: ['Select size', 'Small', 'Medium', 'Large'],
    images: [
      '/default-product-image.png',
      '/default-product-image.png',
      '/default-product-image.png',
      '/default-product-image.png',
      '/default-product-image.png',
    ],
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const product = getProductData(category, slug);

  return (
    <div className="min-h-screen bg-neutral-background-light">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8 max-w-[1160px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <ProductImageGallery images={product.images} productName={product.name} />

          {/* Right: Product Details */}
          <ProductDetailsPanel
            category={product.category}
            name={product.name}
            description={product.description}
            price={product.price}
            colors={product.colors}
            sizes={product.sizes}
          />
        </div>
      </div>

      {/* Product Information */}
      <ProductInformationSection />

      {/* Pet Icons */}
      <PetIconsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Related Products */}
      <RelatedProductsSection />
    </div>
  );
}

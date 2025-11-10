'use client';

import { ProductCard } from '@/components/ui/product-card';
import { AnimatedSection } from '../homepage/AnimatedSection';

export function RelatedProductsSection() {
  const relatedProducts = [
    {
      id: 1,
      title: 'Product name',
      subtitle: 'Product name',
      price: '$99.99',
      image: '/default-product-image.png',
    },
    {
      id: 2,
      title: 'Product name',
      subtitle: 'Product name',
      price: '$99.99',
      image: '/default-product-image.png',
    },
    {
      id: 3,
      title: 'Product name',
      subtitle: 'Product name',
      price: '$99.99',
      image: '/default-product-image.png',
    },
  ];

  return (
    <AnimatedSection className="w-full py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-[1160px]">
        {/* Title */}
        <h2 className="text-[28px] sm:text-[32px] font-semibold text-primary-navy-light mb-8">
          Related Products
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              image={product.image}
              href="/shop/liner/example-product"
              onAddToCart={() => console.log(`Add ${product.title} to cart`)}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

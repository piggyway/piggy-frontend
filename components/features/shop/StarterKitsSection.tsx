'use client';

import { ProductCard } from '@/components/ui/product-card';
import { AnimatedSection } from '../homepage/AnimatedSection';

export function StarterKitsSection() {
  const products = [
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
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-lg sm:text-xl text-primary-navy leading-relaxed mb-2">
            Everything You Need to Begin
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-tight">
            Starter Kits & Bundles
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              image={product.image}
              onAddToCart={() => console.log(`Add ${product.title} to cart`)}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

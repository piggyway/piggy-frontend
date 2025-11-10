'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ProductCard } from '@/components/ui/product-card';
import { AnimatedSection } from '@/components/features/homepage/AnimatedSection';
import { cn } from '@/lib/utils';

type SortOption = 'featured' | 'price-low' | 'price-high';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const productBackgrounds = [
  'bg-[#e8e8f7]', // light purple
  'bg-[#ececec]', // light gray
  'bg-secondary-mint', // mint green
  'bg-neutral-pink-background', // pink
  'bg-[#e8e8f7]', // light purple
  'bg-neutral-pink-background', // pink
  'bg-[#e8e8f7]', // light purple
  'bg-secondary-mint', // mint green
  'bg-[#e8eef7]', // light blue-gray
];

export function ProductsSection() {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showDropdown, setShowDropdown] = useState(false);

  const products = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: 'Product name',
    subtitle: 'Product name',
    price: '$99.99',
    image: '/default-product-image.png',
    bgColor: productBackgrounds[i],
  }));

  const clearSort = () => {
    setSortBy('featured');
    setShowDropdown(false);
  };

  return (
    <AnimatedSection>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        {/* Item Count */}
        <p className="text-sm text-primary-navy">
          <span className="font-semibold">{products.length}</span> Items
        </p>

        {/* Sort Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-purple rounded-full">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-sm text-primary-navy font-medium"
            >
              Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label}
            </button>
            {sortBy !== 'featured' && (
              <button
                onClick={clearSort}
                className="p-0.5 hover:bg-white/50 rounded-full transition-colors"
                aria-label="Clear sort"
              >
                <X className="w-3 h-3 text-primary-navy" />
              </button>
            )}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-stroke z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowDropdown(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg',
                    sortBy === option.value
                      ? 'bg-primary-purple text-primary-navy font-medium'
                      : 'text-primary-navy hover:bg-neutral-background'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <div key={product.id} className={cn('rounded-[28px] p-0', product.bgColor)}>
            <ProductCard
              title={product.title}
              subtitle={product.subtitle}
              price={product.price}
              image={product.image}
              href="/shop/liner/example-product"
              onAddToCart={() => console.log(`Add ${product.title} to cart`)}
              className="bg-transparent"
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <button
          onClick={() => console.log('Load more products')}
          className="text-primary-navy font-medium hover:text-primary-navy-light transition-colors underline"
        >
          Loadmore
        </button>
      </div>
    </AnimatedSection>
  );
}

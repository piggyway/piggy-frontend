"use client";

import { ProductCard } from "@/components/ui/product-card";
import { AnimatedSection } from "../homepage/AnimatedSection";

export function FeaturedPicksSection() {
  const products = [
    {
      id: 1,
      title: "Product name",
      subtitle: "Product name",
      price: "$99.99",
      image: "/default-product-image.png",
    },
    {
      id: 2,
      title: "Product name",
      subtitle: "Product name",
      price: "$99.99",
      image: "/default-product-image.png",
    },
    {
      id: 3,
      title: "Product name",
      subtitle: "Product name",
      price: "$99.99",
      image: "/default-product-image.png",
    },
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-primary-navy mb-2 text-[20px] leading-[32px] font-normal sm:text-[24px]">
            Most Loved by Customers
          </p>
          <h2 className="text-primary-navy-light text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
            Featured Picks
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
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

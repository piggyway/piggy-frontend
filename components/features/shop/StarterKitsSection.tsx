"use client";

import { ProductCard } from "@/components/ui/product-card";
import { AnimatedSection } from "../homepage/AnimatedSection";

export function StarterKitsSection() {
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
          <p className="text-primary-navy mb-2 text-lg leading-relaxed sm:text-xl">
            Everything You Need to Begin
          </p>
          <h2 className="text-primary-navy-light text-[32px] leading-tight font-semibold sm:text-[42px]">
            Starter Kits & Bundles
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

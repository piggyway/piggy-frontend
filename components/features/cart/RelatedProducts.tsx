"use client";

import { ProductCard } from "@/components/ui/product-card";

const RELATED_PRODUCTS = [
  {
    id: "rel-1",
    title: "Organic Apple Sticks",
    price: 8.99,
    image: "/homepage-essentials/snack-example.png",
    category: "Treats",
  },
  {
    id: "rel-2",
    title: "Fleece Tunnel Hideout",
    price: 18.5,
    image: "/homepage-essentials/hut-example.png",
    category: "Accessories",
  },
  {
    id: "rel-3",
    title: "Cozy Cage Liner - Plaid",
    price: 45.0,
    image: "/homepage-essentials/liner-example.png",
    category: "Bedding",
  },
  {
    id: "rel-4",
    title: "Guinea Pig Starter Kit",
    price: 89.99,
    image: "/homepage-essentials/combo-example.png",
    category: "Kits",
  },
];

export function RelatedProducts() {
  const itemsToShow = 2;
  const visibleProducts = RELATED_PRODUCTS.slice(0, itemsToShow);

  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-primary-navy text-2xl font-semibold">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={`$${product.price.toFixed(2)}`}
            image={product.image}
            subtitle={product.category}
          />
        ))}
      </div>
    </div>
  );
}

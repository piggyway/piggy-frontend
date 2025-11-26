"use client";

import { ProductCard } from "@/components/ui/product-card";

const RELATED_PRODUCTS = [
  {
    id: "rel-1",
    title: "Organic Apple Sticks",
    price: 8.99,
    image: "/snack-example.png",
    category: "Treats",
  },
  {
    id: "rel-2",
    title: "Fleece Tunnel Hideout",
    price: 18.5,
    image: "/hut-example.png",
    category: "Accessories",
  },
  {
    id: "rel-3",
    title: "Cozy Cage Liner - Plaid",
    price: 45.0,
    image: "/liner-example.png",
    category: "Bedding",
  },
  {
    id: "rel-4",
    title: "Guinea Pig Starter Kit",
    price: 89.99,
    image: "/combo-example.png",
    category: "Kits",
  },
];

export function RelatedProducts() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-primary-navy text-2xl font-semibold">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {RELATED_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
}

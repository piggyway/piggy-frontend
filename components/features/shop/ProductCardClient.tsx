"use client";

import { ProductCard } from "@/components/ui/product-card";
import type { ProductListItem } from "@/lib/types/product";

interface ProductCardClientProps {
  product: ProductListItem;
}

export function ProductCardClient({ product }: ProductCardClientProps) {
  const handleAddToCart = () => {
    console.log(`Add ${product.title} to cart`);
  };

  return (
    <ProductCard
      title={product.title}
      subtitle={product.subtitle}
      price={product.formattedPrice}
      image={product.imageUrl}
      href={`/shop/${product.brand?.slug || "product"}/${product.slug}`}
      onAddToCart={handleAddToCart}
    />
  );
}

"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { ProductService } from "@/lib/services/products";
import { useCart } from "@/components/features/cart/CartProvider";
import type { ProductListItem } from "@/lib/types/product";

interface ProductCardClientProps {
  product: ProductListItem;
  className?: string;
}

export function ProductCardClient({
  product,
  className,
}: ProductCardClientProps) {
  const { addItem, isMutating } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product.slug) return;
    setIsAdding(true);

    try {
      const detail = await ProductService.getProductBySlug(product.slug);
      const variant =
        detail?.variants.find((v) => v.isAvailable && v.stockQuantity > 0) ||
        detail?.variants[0];

      if (!variant) {
        console.warn("No variants available to add to cart");
        return;
      }

      await addItem(variant.id, 1);
    } catch (error) {
      console.error("Failed to add product to cart", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <ProductCard
      title={product.title}
      subtitle={product.subtitle}
      price={product.formattedPrice}
      image={product.imageUrl}
      href={`/shop/${product.category?.slug || "product"}/${product.slug}`}
      onAddToCart={handleAddToCart}
      className={className}
      disabled={isAdding || isMutating}
    />
  );
}

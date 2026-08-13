"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { ProductService } from "@/lib/services/products";
import { useCart } from "@/components/features/cart/CartProvider";
import type { VariantListItem } from "@/lib/types/product";
import { buildVariantSearchParams } from "@/lib/utils/variant-search-params";

export function RelatedProducts() {
  const [variants, setVariants] = useState<VariantListItem[]>([]);
  const { addItem, isMutating } = useCart();
  const [addingVariantId, setAddingVariantId] = useState<number | null>(null);

  const handleAddToCart = async (variantId: number) => {
    setAddingVariantId(variantId);
    try {
      await addItem(variantId, 1);
    } finally {
      setAddingVariantId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchRandomVariants() {
      const data = await ProductService.getRandomVariants();
      if (!cancelled) {
        setVariants(data);
      }
    }

    fetchRandomVariants();

    return () => {
      cancelled = true;
    };
  }, []);

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-primary-navy text-large">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => {
          const qs = buildVariantSearchParams(variant.optionValues).toString();
          const href = `/shop/${variant.category?.slug || "product"}/${variant.productSlug}${qs ? `?${qs}` : ""}`;
          return (
            <ProductCard
              key={variant.variantId}
              title={variant.productTitle}
              subtitle={variant.category?.name ?? undefined}
              price={
                variant.formattedDiscountedPrice ??
                variant.formattedOriginalPrice ??
                "Price TBD"
              }
              originalPrice={
                variant.discountPercentage
                  ? (variant.formattedOriginalPrice ?? undefined)
                  : undefined
              }
              discountPercentage={variant.discountPercentage ?? undefined}
              image={variant.imageUrl}
              imageAlt={variant.productTitle}
              href={href}
              onAddToCart={() => handleAddToCart(variant.variantId)}
              disabled={isMutating || addingVariantId === variant.variantId}
            />
          );
        })}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { VariantListItem } from "@/lib/types/product";
import { useCart } from "@/components/features/cart/CartProvider";

interface VariantCardProps {
  variant: VariantListItem;
  className?: string;
  layout?: "grid" | "list";
}

const FALLBACK_IMAGE = "/default-product-image.png";

export function VariantCard({ variant, className , layout = "grid"}: VariantCardProps) {
  const { addItem, isMutating } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const displayImage = variant.imageUrl ?? FALLBACK_IMAGE;

  // Format option values for display (e.g., "Size: M, Color: Red")
  const optionSummary = variant.optionValues
    .filter((ov) => ov.optionName && ov.value)
    .map((ov) => `${ov.optionName}: ${ov.value}`)
    .join(", ");

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      await addItem(variant.variantId, 1);
    } catch (error) {
      console.error("Failed to add variant to cart", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Build href with variant query param
  const href = `/shop/${variant.category?.slug || "product"}/${variant.productSlug}?variant=${variant.variantId}`;

  const cardContent = (
    <>
      {/* Image Container */}
      <div className="flex w-full flex-col items-start gap-3.5">
        <div className={cn(
            "bg-neutral-stroke relative overflow-hidden",
            layout === "list"
              ? "h-[120px] w-[160px] shrink-0 rounded-[20px] sm:h-[140px] sm:w-[200px]"
              : "h-[160px] w-full rounded-[24px] sm:h-[180px] sm:rounded-[28px] lg:h-[200px] lg:rounded-[33px]"
          )}
        >
          <Image
            src={displayImage}
            alt={variant.productTitle}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 312px"
          />
        </div>

        {/* Title and Options */}
        <div className="text-primary-navy flex w-full flex-col items-start gap-0">
          <h3 className="w-full text-lg leading-6 font-medium sm:text-xl">
            {variant.productTitle}
          </h3>
          {optionSummary && (
            <p className="w-full text-sm leading-6 font-normal text-slate-500">
              {optionSummary}
            </p>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-primary-navy w-auto text-lg leading-6 font-medium sm:text-xl">
            {variant.formattedDiscountedPrice ||
              variant.formattedOriginalPrice ||
              "Price TBD"}
          </p>
          {variant.formattedOriginalPrice && variant.discountPercentage && (
            <p className="text-sm text-neutral-400 line-through decoration-neutral-400/80">
              {variant.formattedOriginalPrice}
            </p>
          )}
        </div>
        {variant.discountPercentage && (
          <span className="w-fit rounded-full bg-[#FF4D4F]/10 px-2 py-0.5 text-xs font-medium text-[#FF4D4F]">
            {variant.discountPercentage}
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="flex w-full flex-col items-start gap-3 sm:gap-4">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isMutating || !variant.isAvailable}
          className="bg-primary-navy hover:bg-primary-navy-light flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-2.5 text-sm text-white sm:rounded-[20px] sm:text-base"
        >
          <ShoppingCart className="size-4" />
          {variant.isAvailable ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </>
  );

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full cursor-pointer rounded-[28px] bg-white p-6 transition-shadow hover:shadow-lg",
        layout === "list"
          ? "flex-row items-center justify-between gap-6"
          : "h-full flex-col justify-between gap-5",
        className
      )}
    >
      {cardContent}
    </Link>
  );
}

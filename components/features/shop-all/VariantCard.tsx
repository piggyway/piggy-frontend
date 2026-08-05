"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { VariantListItem } from "@/lib/types/product";
import { buildVariantSearchParams } from "@/lib/utils/variant-search-params";
import { useCart } from "@/components/features/cart/CartProvider";

interface VariantCardProps {
  variant: VariantListItem;
  className?: string;
  layout?: "grid" | "list";
  /** Background class for the image container (list layout only) */
  imageBgClassName?: string;
}

const FALLBACK_IMAGE = "/default-product-image.png";

export function VariantCard({
  variant,
  className,
  layout = "grid",
  imageBgClassName,
}: VariantCardProps) {
  const { addItem, isMutating } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const displayImage = variant.imageUrl ?? FALLBACK_IMAGE;

  // Pre-order products are enquiry-only and never marked sold out even at zero
  // stock; genuinely out-of-stock variants are shown muted with a "Sold Out"
  // badge but remain clickable through to the PDP.
  const isPreorder = variant.purchaseMode === "preorder";
  const isSoldOut = !isPreorder && variant.stockQuantity <= 0;
  const isPurchasable = !isPreorder && !isSoldOut;

  // Format option values for display (e.g., "Size: M, Color: Red")
  const optionSummary = variant.optionValues
    .filter((ov) => ov.optionName && ov.value)
    .map((ov) => `${ov.optionName}: ${ov.value}`)
    .join(", ");

  const statusBadge = isPreorder ? (
    <span className="bg-primary-gold text-primary-navy absolute top-2 left-2 z-10 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm">
      Pre-order
    </span>
  ) : isSoldOut ? (
    <span className="bg-primary-navy absolute top-2 left-2 z-10 rounded-full px-2.5 py-1 text-xs font-medium text-white shadow-sm">
      Sold Out
    </span>
  ) : null;

  const buttonLabel = isSoldOut
    ? "Sold Out"
    : isPreorder
      ? "Pre-order"
      : "Add to Cart";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPurchasable) return;
    setIsAdding(true);

    try {
      await addItem(variant.variantId, 1);
    } catch (error) {
      console.error("Failed to add variant to cart", error);
    } finally {
      setIsAdding(false);
    }
  };

  const variantParams = buildVariantSearchParams(variant.optionValues);
  const variantQuery = variantParams.toString();

  /**
   * The product's canonical URL, with no variant query string.
   *
   * The card body links to `href` so a shopper landing on the PDP sees the
   * variant they clicked, but the title must link to `canonicalHref`:
   * otherwise every link in the catalogue carries a `?size=&color=` query and
   * the canonical product URL appears nowhere in the HTML, leaving crawlers
   * unable to discover it (Search Console reports "URL is unknown to Google").
   */
  const canonicalHref = `/shop/${variant.category?.slug || "product"}/${variant.productSlug}`;
  const href = canonicalHref + (variantQuery ? `?${variantQuery}` : "");
  const variantLabel = optionSummary
    ? `${variant.productTitle} (${optionSummary})`
    : variant.productTitle;

  const priceSection = (
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
  );

  if (layout === "list") {
    return (
      <div
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-4 rounded-[28px] bg-white p-4 transition-shadow hover:shadow-lg sm:gap-6 sm:p-6",
          className
        )}
      >
        {/* Covers the whole card so any non-interactive area opens the variant */}
        <Link
          href={href}
          aria-label={variantLabel}
          className="absolute inset-0 rounded-[28px]"
        />

        {/* Image Container */}
        <div
          className={cn(
            "relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[16px] sm:h-[160px] sm:w-[220px] sm:rounded-[24px]",
            imageBgClassName ?? "bg-neutral-stroke"
          )}
        >
          {statusBadge}
          <Image
            src={displayImage}
            alt={variant.productTitle}
            fill
            className={cn("object-contain", isSoldOut && "opacity-50")}
            sizes="(max-width: 640px) 100px, 220px"
          />
        </div>

        {/* Content */}
        <div className="text-primary-navy flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col">
            <h3 className="text-lg leading-6 font-medium sm:text-xl">
              <Link href={canonicalHref} className="relative hover:underline">
                {variant.productTitle}
              </Link>
            </h3>
            {optionSummary && (
              <p className="text-sm leading-6 font-normal sm:text-base">
                {optionSummary}
              </p>
            )}
          </div>
          {priceSection}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isMutating || !isPurchasable}
          className="bg-primary-navy hover:bg-primary-navy-light relative flex shrink-0 items-center justify-center gap-2 rounded-[20px] px-3 py-2 text-sm text-white sm:w-[180px] sm:px-4"
        >
          <ShoppingCart className="size-4" />
          <span className="hidden sm:inline">{buttonLabel}</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full cursor-pointer flex-col justify-between gap-5 rounded-[28px] bg-white p-6 transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Covers the whole card so any non-interactive area opens the variant */}
      <Link
        href={href}
        aria-label={variantLabel}
        className="absolute inset-0 rounded-[28px]"
      />

      {/* Image Container */}
      <div className="flex w-full flex-col items-start gap-3.5">
        <div className="bg-neutral-stroke relative h-[160px] w-full overflow-hidden rounded-[24px] sm:h-[180px] sm:rounded-[28px] lg:h-[200px] lg:rounded-[33px]">
          {statusBadge}
          <Image
            src={displayImage}
            alt={variant.productTitle}
            fill
            className={cn("object-contain", isSoldOut && "opacity-50")}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 312px"
          />
        </div>

        {/* Title and Options */}
        <div className="text-primary-navy flex w-full flex-col items-start gap-0">
          <h3 className="w-full text-lg leading-6 font-medium sm:text-xl">
            <Link href={canonicalHref} className="relative hover:underline">
              {variant.productTitle}
            </Link>
          </h3>
          {optionSummary && (
            <p className="w-full text-sm leading-6 font-normal text-slate-500">
              {optionSummary}
            </p>
          )}
        </div>
      </div>

      {/* Price Section */}
      {priceSection}

      {/* Add to Cart Button */}
      <div className="relative flex w-full flex-col items-start gap-3 sm:gap-4">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isMutating || !isPurchasable}
          className="bg-primary-navy hover:bg-primary-navy-light flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-2.5 text-sm text-white sm:rounded-[20px] sm:text-base"
        >
          <ShoppingCart className="size-4" />
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

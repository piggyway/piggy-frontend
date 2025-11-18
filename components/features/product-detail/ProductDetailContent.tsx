"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, HelpCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductDetail, ProductVariant } from "@/lib/types/product";

interface ProductDetailContentProps {
  product: ProductDetail;
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >(() => {
    // Initialize with first available value for each option
    const initial: Record<number, number> = {};
    product.options.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.id] = option.values[0].id;
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null;

    return product.variants.find((variant) => {
      // Check if all selected options match this variant
      return Object.entries(selectedOptions).every(([optionId, valueId]) =>
        variant.optionValues.some(
          (ov) => ov.optionId === Number(optionId) && ov.valueId === valueId
        )
      );
    });
  }, [product.variants, selectedOptions]);

  // Get current price based on selected variant
  const currentPrice = useMemo(() => {
    if (!selectedVariant) {
      return product.formattedPrice;
    }

    const price =
      selectedVariant.discountedPrice ?? selectedVariant.originalPrice;
    if (price === null) return product.formattedPrice;

    const currencySlug =
      selectedVariant.currency?.slug || product.currency?.slug || "AUD";
    const currencySymbols: Record<string, string> = {
      AUD: "$",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = currencySymbols[currencySlug.toUpperCase()] || "$";
    return `${symbol}${price.toFixed(2)}`;
  }, [selectedVariant, product]);

  // Check if current variant is in stock
  const isInStock = useMemo(() => {
    if (!selectedVariant) return false;
    return selectedVariant.isAvailable && selectedVariant.stockQuantity > 0;
  }, [selectedVariant]);

  // Check if a specific option value is available (has stock for at least one variant)
  const isOptionValueAvailable = useCallback(
    (optionId: number, valueId: number) => {
      // Find all variants that have this option value
      const variantsWithValue = product.variants.filter((variant) =>
        variant.optionValues.some(
          (ov) => ov.optionId === optionId && ov.valueId === valueId
        )
      );

      // Check if any of these variants are in stock and match other selected options
      return variantsWithValue.some((variant) => {
        // Check if variant matches all other selected options (except the current one)
        const matchesOtherOptions = Object.entries(selectedOptions)
          .filter(([oid]) => Number(oid) !== optionId)
          .every(([oid, vid]) =>
            variant.optionValues.some(
              (ov) => ov.optionId === Number(oid) && ov.valueId === vid
            )
          );

        return (
          matchesOtherOptions &&
          variant.isAvailable &&
          variant.stockQuantity > 0
        );
      });
    },
    [product.variants, selectedOptions]
  );

  // Handle option selection
  const handleOptionSelect = (optionId: number, valueId: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));

    // If this is a color option, switch to variant image if available
    const option = product.options.find((o) => o.id === optionId);
    if (
      option?.slug === "color" ||
      option?.name?.toLowerCase().includes("color") ||
      option?.name?.toLowerCase().includes("colour")
    ) {
      // Find variant with this color and get its image
      const variantWithColor = product.variants.find((v) =>
        v.optionValues.some(
          (ov) => ov.optionId === optionId && ov.valueId === valueId
        )
      );
      if (variantWithColor?.imageUrl) {
        // Find the image in the product images array
        const imageIndex = product.images.indexOf(variantWithColor.imageUrl);
        if (imageIndex !== -1) {
          setSelectedImageIndex(imageIndex);
        }
      }
    }
  };

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stockQuantity) {
      setQuantity((prev) => prev + 1);
    } else if (!selectedVariant) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    console.log("Add to cart", {
      productId: product.id,
      variantId: selectedVariant?.id,
      sku: selectedVariant?.sku,
      quantity,
      selectedOptions,
    });
  };

  return (
    <article className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left: Image Gallery */}
      <section aria-label="Product gallery" className="flex flex-col gap-4 sm:flex-row">
        {/* Thumbnail List - Hidden on mobile, shown on desktop */}
        <div className="hidden sm:flex w-24 shrink-0 flex-col gap-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-[20px] border-2 transition-all",
                selectedImageIndex === index
                  ? "border-primary-navy"
                  : "border-neutral-stroke hover:border-primary-navy/50"
              )}
            >
              <Image
                src={image}
                alt={`${product.title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>

        {/* Mobile Thumbnail Strip - Horizontal scroll */}
        {product.images.length > 1 && (
          <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] border-2 transition-all",
                  selectedImageIndex === index
                    ? "border-primary-navy"
                    : "border-neutral-stroke"
                )}
              >
                <Image
                  src={image}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="bg-neutral-stroke relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[28px]">
          <Image
            src={
              product.images[selectedImageIndex] || "/default-product-image.png"
            }
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </section>

      {/* Right: Product Details */}
      <section aria-label="Product details" className="flex flex-col gap-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-primary-navy hover:text-primary-navy-light transition-colors"
          >
            HOME
          </Link>
          <ChevronRight className="text-primary-navy h-4 w-4" />
          <Link
            href={`/shop-all?category=${product.category?.slug || ""}`}
            className="text-primary-navy hover:text-primary-navy-light transition-colors"
          >
            {product.category?.name || "Products"}
          </Link>
          <ChevronRight className="text-primary-navy h-4 w-4" />
          <span className="text-primary-navy font-medium underline">
            {product.title}
          </span>
        </nav>

        {/* Product Name and Description */}
        <header>
          <h1 className="text-primary-navy-light mb-2 text-[24px] leading-tight font-semibold sm:mb-3 sm:text-[28px] lg:text-[32px]">
            {product.title}{" "}
            {product.subtitle && (
              <span className="text-primary-navy">{product.subtitle}</span>
            )}
          </h1>
          <p className="text-primary-navy text-sm leading-relaxed sm:text-base">
            {product.description}
          </p>
        </header>

        {/* Price */}
        <div className="flex items-center gap-3">
          <p className="text-primary-navy text-2xl font-semibold">
            {currentPrice}
          </p>
          {/* Stock Status */}
          {selectedVariant && (
            <span
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                isInStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {isInStock ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>

        {/* Dynamic Options */}
        {product.options.map((option) => (
          <div key={option.id}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-primary-navy-light text-lg font-semibold">
                {option.name}
              </h2>
              <button className="text-primary-navy hover:text-primary-navy-light flex items-center gap-1 text-sm transition-colors">
                <HelpCircle className="h-4 w-4" />
                Size guide
              </button>
            </div>

            {/* Check if this is a color option */}
            {option.slug === "color" ||
            option.name?.toLowerCase().includes("color") ||
            option.name?.toLowerCase().includes("colour") ? (
              // Color selector with swatches
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {option.values.map((value) => {
                  const isAvailable = isOptionValueAvailable(
                    option.id,
                    value.id
                  );
                  const isSelected = selectedOptions[option.id] === value.id;

                  return (
                    <button
                      key={value.id}
                      onClick={() =>
                        isAvailable && handleOptionSelect(option.id, value.id)
                      }
                      disabled={!isAvailable}
                      className={cn(
                        "flex flex-col items-center gap-2",
                        !isAvailable && "cursor-not-allowed opacity-40"
                      )}
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-full border-2 transition-all sm:h-14 sm:w-14",
                          isSelected
                            ? "border-primary-navy scale-110"
                            : isAvailable
                              ? "border-transparent hover:scale-105"
                              : "border-gray-300"
                        )}
                        style={{
                          backgroundColor: value.colorHex || "#cccccc",
                        }}
                      />
                      <span className="text-primary-navy text-[10px] sm:text-xs">
                        {value.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Other options as dropdown
              <select
                value={selectedOptions[option.id] || ""}
                onChange={(e) =>
                  handleOptionSelect(option.id, Number(e.target.value))
                }
                className="border-neutral-stroke text-primary-navy focus:ring-primary-navy/20 w-full rounded-[20px] border bg-white px-4 py-3 focus:ring-2 focus:outline-none"
              >
                {option.values.map((value) => {
                  const isAvailable = isOptionValueAvailable(
                    option.id,
                    value.id
                  );
                  return (
                    <option
                      key={value.id}
                      value={value.id}
                      disabled={!isAvailable}
                    >
                      {value.value}
                      {!isAvailable ? " (Out of Stock)" : ""}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        ))}

        {/* Quantity and Add to Cart */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <button
              onClick={decrementQuantity}
              className="bg-primary-navy hover:bg-primary-navy-light flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors sm:h-12 sm:w-12"
              aria-label="Decrease quantity"
            >
              <Minus className="h-5 w-5" />
            </button>

            <span className="text-primary-navy w-12 text-center text-lg font-medium sm:text-xl">
              {quantity}
            </span>

            <button
              onClick={incrementQuantity}
              disabled={
                selectedVariant
                  ? quantity >= selectedVariant.stockQuantity
                  : false
              }
              className="bg-primary-navy hover:bg-primary-navy-light flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 sm:h-12 sm:w-12"
              aria-label="Increase quantity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 h-11 w-full rounded-full px-6 py-5 text-base font-semibold disabled:opacity-50 sm:h-12 sm:flex-1 sm:px-8 sm:py-6 sm:text-lg"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            {isInStock ? "Add to cart" : "Out of Stock"}
          </Button>
        </div>
      </section>
    </article>
  );
}

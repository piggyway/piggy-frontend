"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { ProductColorSelector } from "@/components/ui/product-color-selector";
import { ProductSizeSelector } from "@/components/ui/product-size-selector";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductDetail } from "@/lib/types/product";
import { useCart } from "@/components/features/cart/CartProvider";

interface ProductDetailContentProps {
  product: ProductDetail;
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const { addItem, isMutating } = useCart();
  const searchParams = useSearchParams();
  const [addError, setAddError] = useState<string | null>(null);
  // Check for variant ID in URL params
  const variantIdFromUrl = searchParams?.get("variant");

  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >(() => {
    // If variant ID is provided in URL, find that variant and use its options
    if (variantIdFromUrl) {
      const variantId = parseInt(variantIdFromUrl, 10);
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        const initial: Record<number, number> = {};
        variant.optionValues.forEach((ov) => {
          initial[ov.optionId] = ov.valueId;
        });
        return initial;
      }
    }
    // Otherwise initialize with first available value for each option
    const initial: Record<number, number> = {};
    product.options.forEach((option) => {
      if (option.values.length > 0) {
        initial[option.id] = option.values[0].id;
      }
    });
    return initial;
  });

  useEffect(() => {
    if (!variantIdFromUrl) return;
    const variantId = Number.parseInt(variantIdFromUrl, 10);
    if (Number.isNaN(variantId)) return;
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return;
    setSelectedOptions((prev) => {
      const next: Record<number, number> = { ...prev };
      for (const ov of variant.optionValues) {
        next[ov.optionId] = ov.valueId;
      }
      return next;
    });
  }, [product.variants, variantIdFromUrl]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Track previous variant to only auto-switch images when the variant actually changes
  const lastSelectedVariantId = useRef(
    // Initialize with current variant ID to avoid initial effect run if desired,
    // or undefined to allow initial sync.
    // Given the logic, we want to allow initial sync if needed, but not fight user clicks.
    // Let's initialize with undefined so first effect run sets it up correctly if needed.
    undefined as number | undefined
  );

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null;

    const found = product.variants.find((variant) => {
      // Check if all selected options match this variant
      return Object.entries(selectedOptions).every(([optionId, valueId]) =>
        variant.optionValues.some(
          (ov) => ov.optionId === Number(optionId) && ov.valueId === valueId
        )
      );
    });
    return found;
  }, [product.variants, selectedOptions]);

  // Get current price info based on selected variant
  const currentPrice = useMemo(() => {
    if (!selectedVariant) {
      return {
        displayPrice: product.formattedPrice,
        originalPrice: null,
        discountPercentage: null,
      };
    }

    const price =
      selectedVariant.discountedPrice ?? selectedVariant.originalPrice;
    const originalPriceRaw = selectedVariant.originalPrice;

    // Determine which price to show as the main price
    const mainPrice = price;

    if (mainPrice === null) {
      return {
        displayPrice: product.formattedPrice,
        originalPrice: null,
        discountPercentage: null,
      };
    }

    const currencySlug =
      selectedVariant.currency?.slug || product.currency?.slug || "AUD";
    const currencySymbols: Record<string, string> = {
      AUD: "$",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    const symbol = currencySymbols[currencySlug.toUpperCase()] || "$";

    let displayOriginalPrice: string | null = null;
    let discountPercentage: string | null = null;

    // Calculate discount if applicable
    if (
      selectedVariant.discountedPrice !== null &&
      selectedVariant.originalPrice !== null &&
      selectedVariant.discountedPrice < selectedVariant.originalPrice
    ) {
      displayOriginalPrice = `${symbol}${selectedVariant.originalPrice.toFixed(2)}`;
      const percent = Math.round(
        ((selectedVariant.originalPrice - selectedVariant.discountedPrice) /
          selectedVariant.originalPrice) *
          100
      );
      discountPercentage = `${percent}% OFF`;
    }

    return {
      displayPrice: `${symbol}${mainPrice.toFixed(2)}`,
      originalPrice: displayOriginalPrice,
      discountPercentage,
    };
  }, [selectedVariant, product]);

  // Whether variant prices differ → show a "From" prefix on the price
  const priceHasRange = useMemo(() => {
    const prices = product.variants
      .map((v) => v.discountedPrice ?? v.originalPrice)
      .filter((p): p is number => p !== null);
    return new Set(prices).size > 1;
  }, [product.variants]);

  // Check if current variant is in stock
  const isInStock = useMemo(() => {
    if (!selectedVariant) return false;
    return selectedVariant.isAvailable && selectedVariant.stockQuantity > 0;
  }, [selectedVariant]);

  // Combine product images with all variant images for gallery display
  const allImages = useMemo(() => {
    const variantImages = product.variants.flatMap((v) => v.imageUrls);
    const combined = [...product.images, ...variantImages];
    // Remove duplicates while preserving order
    const result = [...new Set(combined)];
    return result;
  }, [product.images, product.variants]);

  // Map each image URL to the variant it belongs to (if any)
  const imageToVariant = useMemo(() => {
    const map = new Map<string, (typeof product.variants)[number]>();
    for (const v of product.variants) {
      for (const url of v.imageUrls) {
        // If duplicates exist across variants, keep the first encountered deterministically.
        if (!map.has(url)) map.set(url, v);
      }
    }
    return map;
  }, [product.variants]);

  const selectVariantOptions = useCallback(
    (variant: (typeof product.variants)[number]) => {
      setSelectedOptions((prev) => {
        const next: Record<number, number> = { ...prev };
        for (const ov of variant.optionValues) {
          next[ov.optionId] = ov.valueId;
        }
        return next;
      });
    },
    []
  );

  const handleImageSelect = useCallback(
    (index: number) => {
      const image = allImages[index];
      if (!image) return;

      setSelectedImageIndex(index);

      const variant = imageToVariant.get(image);
      if (variant) {
        selectVariantOptions(variant);
      }
    },
    [allImages, imageToVariant, selectVariantOptions]
  );

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

  // Update image when variant changes
  useEffect(() => {
    // Only proceed if variant has effectively changed (or on first run)
    if (selectedVariant?.id === lastSelectedVariantId.current) {
      return;
    }
    lastSelectedVariantId.current = selectedVariant?.id;

    // If the current selected image already belongs to the selected variant, keep it.
    const currentImage = allImages[selectedImageIndex];
    if (
      currentImage &&
      selectedVariant?.id &&
      imageToVariant.get(currentImage)?.id === selectedVariant.id
    ) {
      return;
    }

    const firstVariantImage = selectedVariant?.imageUrls?.[0];
    const index = firstVariantImage ? allImages.indexOf(firstVariantImage) : -1;
    const fallbackImage = product.images?.[0] || null;
    const fallbackIndex = fallbackImage ? allImages.indexOf(fallbackImage) : 0;
    if (firstVariantImage && index !== -1) {
      setSelectedImageIndex(index);
      return;
    }

    // If the selected variant has no images, reset to the product's primary image (or 0).
    setSelectedImageIndex(fallbackIndex >= 0 ? fallbackIndex : 0);
  }, [
    selectedVariant,
    allImages,
    imageToVariant,
    selectedImageIndex,
    product.images,
  ]);

  // Handle option selection
  const handleOptionSelect = (optionId: number, valueId: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  };
  // qty can be changed via +/- buttons or input
  const getMaxQty = () =>
    selectedVariant?.stockQuantity ? selectedVariant.stockQuantity : Infinity;

  const clampQty = (n: number) => {
    const max = getMaxQty();
    return Math.max(1, Math.min(n, max));
  };

  const setQuantitySafe = (n: number) => {
    setQuantity(clampQty(n));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setAddError("Please select an available variant.");
      return;
    }

    if (!selectedVariant.isAvailable || selectedVariant.stockQuantity <= 0) {
      setAddError("This variant is out of stock.");
      return;
    }

    setAddError(null);
    await addItem(selectedVariant.id, quantity);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "HOME", href: "/" },
    {
      label: product.category?.name || "Products",
      href: `/shop-all?category=${product.category?.slug || ""}`,
    },
    { label: product.title },
  ];

  return (
    <article className="flex w-full flex-col gap-9">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-10">
        {/* Left: Image Gallery */}
        <section
          aria-label="Product gallery"
          className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6 lg:max-w-[760px] lg:flex-1"
        >
          {/* Thumbnail List - Hidden on mobile, shown on desktop */}
          {allImages.length > 1 && (
            <div className="hidden shrink-0 flex-col gap-4 overflow-y-auto sm:flex sm:max-h-[460px] sm:w-24 lg:max-h-[580px] lg:w-[140px] xl:w-[160px]">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={cn(
                    "bg-neutral-grey-background relative aspect-square shrink-0 overflow-hidden rounded-[14px] border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-primary-navy"
                      : "hover:border-primary-navy/40 border-transparent"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Mobile Thumbnail Strip - Horizontal scroll */}
          {allImages.length > 1 && (
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:hidden">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={cn(
                    "bg-neutral-grey-background relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-primary-navy"
                      : "border-transparent"
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
          <div className="bg-neutral-grey-background relative aspect-square w-full overflow-hidden rounded-[24px] sm:flex-1 sm:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={allImages[selectedImageIndex] || "default"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={
                    allImages[selectedImageIndex] ||
                    "/default-product-image.png"
                  }
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Right: Product Details */}
        <section
          aria-label="Product details"
          className="flex w-full flex-col gap-8 lg:w-[360px] lg:shrink-0"
        >
          {/* Product Name and Description */}
          <header className="flex flex-col gap-3.5">
            <h1 className="text-primary-navy-light text-[24px] leading-8 font-semibold">
              {product.title}
              {product.subtitle ? ` ${product.subtitle}` : ""}
            </h1>
            {product.description && (
              <p className="text-primary-navy text-[16px] leading-6 font-normal">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-primary-navy text-[20px] leading-6 font-medium">
                {priceHasRange ? "From " : ""}
                {currentPrice.displayPrice}
              </p>
              {currentPrice.originalPrice && (
                <p className="text-base text-neutral-400 line-through decoration-neutral-400/80">
                  {currentPrice.originalPrice}
                </p>
              )}
              {currentPrice.discountPercentage && (
                <span className="rounded-full bg-[#FF4D4F]/10 px-2 py-0.5 text-sm font-medium text-[#FF4D4F]">
                  {currentPrice.discountPercentage}
                </span>
              )}
            </div>
          </header>

          {/* Dynamic Options */}
          {product.options.map((option) => {
            const isColor =
              option.slug === "color" ||
              option.name?.toLowerCase().includes("color") ||
              option.name?.toLowerCase().includes("colour");
            const isSize =
              option.slug === "size" ||
              option.name?.toLowerCase().includes("size");

            const selectedValueId = selectedOptions[option.id];
            const selectedValue =
              selectedValueId != null ? String(selectedValueId) : undefined;
            const disabledValues = option.values
              .filter((value) => !isOptionValueAvailable(option.id, value.id))
              .map((value) => String(value.id));

            if (isColor) {
              return (
                <ProductColorSelector
                  key={option.id}
                  label={option.name || "Colour"}
                  colors={option.values.map((value) => ({
                    value: String(value.id),
                    label: value.value || "",
                    color: value.colorHex || "#cccccc",
                  }))}
                  selectedColor={selectedValue}
                  disabledValues={disabledValues}
                  onColorChange={(val) =>
                    handleOptionSelect(option.id, Number(val))
                  }
                />
              );
            }

            return (
              <ProductSizeSelector
                key={option.id}
                label={option.name || "Size"}
                sizes={option.values.map((value) => ({
                  value: String(value.id),
                  label: value.value || "",
                }))}
                selectedSize={selectedValue}
                disabledValues={disabledValues}
                sizeGuideLink={isSize ? "#" : undefined}
                onSizeGuideClick={
                  isSize ? () => setSizeGuideOpen(true) : undefined
                }
                onSizeChange={(val) =>
                  handleOptionSelect(option.id, Number(val))
                }
              />
            );
          })}

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-stretch gap-4">
              <QuantitySelector
                value={quantity}
                min={1}
                max={selectedVariant?.stockQuantity ?? 99}
                onValueChange={setQuantitySafe}
                disabled={!isInStock}
                showLabel={false}
                fullWidth
                className="flex-1"
              />
              <Button
                className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 h-auto flex-1 rounded-full px-6 py-3 text-[14px] font-semibold disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={!isInStock || isMutating}
              >
                {isMutating
                  ? "Adding..."
                  : isInStock
                    ? "Add to cart"
                    : "Out of Stock"}
              </Button>
            </div>
            {addError && <p className="text-destructive text-sm">{addError}</p>}
          </div>
        </section>
      </div>

      {/* Size Guide Dialog */}
      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Size Guide</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Please refer to the size chart below to find your perfect fit.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Size</th>
                      <th className="px-4 py-2 text-left font-medium">
                        Chest (cm)
                      </th>
                      <th className="px-4 py-2 text-left font-medium">
                        Length (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">XS</td>
                      <td className="px-4 py-2">30-35</td>
                      <td className="px-4 py-2">20</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">S</td>
                      <td className="px-4 py-2">35-40</td>
                      <td className="px-4 py-2">25</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">M</td>
                      <td className="px-4 py-2">40-45</td>
                      <td className="px-4 py-2">30</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2">L</td>
                      <td className="px-4 py-2">45-50</td>
                      <td className="px-4 py-2">35</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}

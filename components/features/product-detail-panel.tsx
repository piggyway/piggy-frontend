"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import {
  ProductColorSelector,
  ColorOption,
} from "@/components/ui/product-color-selector";
import {
  ProductSizeSelector,
  SizeOption,
} from "@/components/ui/product-size-selector";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";

export interface ProductDetailPanelProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  price: string;
  colors: ColorOption[];
  sizes: SizeOption[];
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
  thumbnails?: string[];
  mainImage?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: () => void;
  sizeGuideLink?: string;
  onSizeGuideClick?: () => void;
  className?: string;
}

export function ProductDetailPanel({
  breadcrumbs,
  title,
  description,
  price,
  colors,
  sizes,
  selectedColor,
  selectedSize,
  quantity = 0,
  thumbnails = [],
  mainImage = "/product_details_default_pic.png",
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onAddToCart,
  sizeGuideLink,
  onSizeGuideClick,
  className,
}: ProductDetailPanelProps) {
  const [currentImage, setCurrentImage] = React.useState(mainImage);

  return (
    <div className={cn("flex w-full flex-col gap-9", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      {/* Main Content */}
      <div className="flex w-full items-start gap-10">
        {/* Left: Image Gallery */}
        <div className="flex w-[760px] shrink-0 gap-10">
          {/* Thumbnails */}
          <div className="flex flex-col gap-5">
            {thumbnails.length > 0
              ? thumbnails.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(thumb)}
                    className="bg-neutral-grey-background flex h-[102.56px] w-[160px] items-center justify-center rounded-[14px] transition-opacity hover:opacity-80"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={thumb}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </button>
                ))
              : // Default placeholders
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-neutral-grey-background flex h-[102.56px] w-[160px] items-center justify-center rounded-[14px]"
                  >
                    <div className="relative h-[47.2px] w-[47.2px] opacity-50">
                      <Image
                        src="/default-product-image.png"
                        alt="Placeholder"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
          </div>

          {/* Main Image */}
          <div className="bg-neutral-grey-background relative flex h-full min-h-[600px] flex-1 items-center justify-center rounded-[24px]">
            <Image
              src={currentImage}
              alt={title}
              fill
              className="object-contain p-10"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Product Info */}
          <div className="flex flex-col gap-3.5">
            <h1 className="text-secondary-navy-light text-2xl leading-8 font-semibold">
              Product name: {title}
            </h1>
            {description && (
              <p className="text-primary-navy text-base leading-6 font-normal">
                {description}
              </p>
            )}
            <p className="text-primary-navy text-xl leading-6 font-medium">
              {price}
            </p>
          </div>

          {/* Color Selector */}
          <ProductColorSelector
            colors={colors}
            selectedColor={selectedColor}
            onColorChange={onColorChange}
          />

          {/* Size Selector */}
          <ProductSizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSizeChange={onSizeChange}
            sizeGuideLink={sizeGuideLink}
            onSizeGuideClick={onSizeGuideClick}
          />

          {/* Quantity and Add to Cart */}
          <div className="flex w-full items-start gap-5">
            <QuantitySelector
              value={quantity}
              onValueChange={onQuantityChange}
              className="flex-1"
            />
            <Button
              onClick={onAddToCart}
              className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 h-auto flex-1 rounded-[20px] px-4 py-2 text-sm leading-6 font-normal"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

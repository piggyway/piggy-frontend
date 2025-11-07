"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs"
import { ProductColorSelector, ColorOption } from "@/components/ui/product-color-selector"
import { ProductSizeSelector, SizeOption } from "@/components/ui/product-size-selector"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { cn } from "@/lib/utils"

export interface ProductDetailPanelProps {
  breadcrumbs?: BreadcrumbItem[]
  title: string
  description?: string
  price: string
  colors: ColorOption[]
  sizes: SizeOption[]
  selectedColor?: string
  selectedSize?: string
  quantity?: number
  thumbnails?: string[]
  mainImage?: string
  onColorChange?: (color: string) => void
  onSizeChange?: (size: string) => void
  onQuantityChange?: (quantity: number) => void
  onAddToCart?: () => void
  sizeGuideLink?: string
  onSizeGuideClick?: () => void
  className?: string
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
  const [currentImage, setCurrentImage] = React.useState(mainImage)

  return (
    <div className={cn("flex flex-col gap-9 w-full", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      {/* Main Content */}
      <div className="flex gap-10 items-start w-full">
        {/* Left: Image Gallery */}
        <div className="flex gap-10 w-[760px] shrink-0">
          {/* Thumbnails */}
          <div className="flex flex-col gap-5">
            {thumbnails.length > 0 ? (
              thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(thumb)}
                  className="bg-neutral-grey-background rounded-[14px] w-[160px] h-[102.56px] flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </button>
              ))
            ) : (
              // Default placeholders
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-neutral-grey-background rounded-[14px] w-[160px] h-[102.56px] flex items-center justify-center"
                >
                  <div className="relative w-[47.2px] h-[47.2px] opacity-50">
                    <Image
                      src="/default-product-image.png"
                      alt="Placeholder"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Main Image */}
          <div className="flex-1 bg-neutral-grey-background rounded-[24px] h-full min-h-[600px] flex items-center justify-center relative">
            <Image
              src={currentImage}
              alt={title}
              fill
              className="object-contain p-10"
            />
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Product Info */}
          <div className="flex flex-col gap-3.5">
            <h1 className="text-2xl font-semibold leading-8 text-secondary-navy-light">
              Product name: {title}
            </h1>
            {description && (
              <p className="text-base font-normal leading-6 text-primary-navy">
                {description}
              </p>
            )}
            <p className="text-xl font-medium leading-6 text-primary-navy">
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
          <div className="flex gap-5 items-start w-full">
            <QuantitySelector
              value={quantity}
              onValueChange={onQuantityChange}
              className="flex-1"
            />
            <Button
              onClick={onAddToCart}
              className="flex-1 bg-primary-gold text-primary-navy hover:bg-primary-gold/90 rounded-[20px] px-4 py-2 h-auto font-normal text-sm leading-6"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


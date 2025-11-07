import * as React from "react"
import Image from "next/image"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

export interface ProductCardProps {
  image?: string
  imageAlt?: string
  title: string
  subtitle?: string
  price: string
  onAddToCart?: () => void
  className?: string
}

const FALLBACK_IMAGE = "/default-product-image.png"

export function ProductCard({
  image,
  imageAlt = "Product image",
  title,
  subtitle,
  price,
  onAddToCart,
  className,
}: ProductCardProps) {
  const displayImage = image ?? FALLBACK_IMAGE

  return (
    <div
      className={cn(
        "bg-white flex flex-col gap-5 items-start p-6 rounded-[28px] w-full",
        className
      )}
    >
      {/* Image and Text Container */}
      <div className="flex flex-col gap-3.5 items-start w-full">
        {/* Image Container - 312px width, 200px height */}
        <div className="relative w-full h-[200px] rounded-[33px] bg-neutral-stroke overflow-hidden">
          <Image
            src={displayImage}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="312px"
          />
        </div>

        {/* Title and Subtitle - gap-0 */}
        <div className="flex flex-col gap-0 items-start text-primary-navy w-full">
          <h3 className="text-xl font-medium leading-6 w-full">{title}</h3>
          {subtitle && (
            <p className="text-base font-normal leading-6 w-full">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Price */}
      <p className="text-xl font-medium leading-6 text-primary-navy w-full">
        {price}
      </p>

      {/* Add to Cart Button - gap-4 */}
      <div className="flex flex-col gap-4 items-start w-full">
        <Button
          onClick={onAddToCart}
          className="w-full bg-primary-navy text-white hover:bg-primary-navy-light rounded-[20px] px-4 py-2 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="size-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}


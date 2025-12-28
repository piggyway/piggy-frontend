"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export interface ProductCardProps {
  image?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: string;
  href?: string;
  onAddToCart?: () => void;
  disabled?: boolean;
  className?: string;
}

const FALLBACK_IMAGE = "/default-product-image.png";

export function ProductCard({
  image,
  imageAlt = "Product image",
  title,
  subtitle,
  price,
  originalPrice,
  discountPercentage,
  href,
  onAddToCart,
  disabled = false,
  className,
}: ProductCardProps) {
  const displayImage = image ?? FALLBACK_IMAGE;

  const cardContent = (
    <>
      {/* Image and Text Container */}
      <div className="flex w-full flex-col items-start gap-3.5">
        {/* Image Container - 312px width, 200px height */}
        <div className="bg-neutral-stroke relative h-[160px] w-full overflow-hidden rounded-[24px] sm:h-[180px] sm:rounded-[28px] lg:h-[200px] lg:rounded-[33px]">
          <Image
            src={displayImage}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 312px"
          />
        </div>

        {/* Title and Subtitle - gap-0 */}
        <div className="text-primary-navy flex w-full flex-col items-start gap-0">
          <h3 className="w-full text-lg leading-6 font-medium sm:text-xl">
            {title}
          </h3>
          {subtitle && (
            <p className="w-full text-sm leading-6 font-normal sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-primary-navy w-auto text-lg leading-6 font-medium sm:text-xl">
            {price}
          </p>
          {originalPrice && (
            <p className="text-sm text-neutral-400 line-through decoration-neutral-400/80">
              {originalPrice}
            </p>
          )}
        </div>
        {discountPercentage && (
          <span className="w-fit rounded-full bg-[#FF4D4F]/10 px-2 py-0.5 text-xs font-medium text-[#FF4D4F]">
            {discountPercentage}
          </span>
        )}
      </div>

      {/* Add to Cart Button - gap-4 */}
      <div className="flex w-full flex-col items-start gap-3 sm:gap-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.();
          }}
          disabled={disabled}
          className="bg-primary-navy hover:bg-primary-navy-light flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-2.5 text-sm text-white sm:rounded-[20px] sm:text-base"
        >
          <ShoppingCart className="size-4" />
          Add to Cart
        </Button>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex h-full w-full cursor-pointer flex-col justify-between gap-5 rounded-[28px] bg-white p-6 transition-shadow hover:shadow-lg",
          className
        )}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-between gap-5 rounded-[28px] bg-white p-6",
        className
      )}
    >
      {cardContent}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnail List */}
      <div className="flex w-24 shrink-0 flex-col gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-[20px] border-2 transition-all",
              selectedImage === index
                ? "border-primary-navy"
                : "border-neutral-stroke hover:border-primary-navy/50"
            )}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="bg-neutral-stroke relative aspect-[4/3] flex-1 overflow-hidden rounded-[28px]">
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}

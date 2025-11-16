"use client";

import * as React from "react";
import Image from "next/image";
import { Collapsible } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductInformationSectionProps {
  features?: ProductFeature[];
  specifications?: ProductFeature[];
  careInstructions?: ProductFeature[];
  imageSrc?: string;
  className?: string;
}

const defaultFeatures: ProductFeature[] = [
  {
    title: "Washable & reusable liner",
    description: "Easy to clean, eco-friendly, and cost-saving",
  },
  {
    title: "Soft & comfy surface",
    description: "Gentle on guinea pig & rabbit paws, adds daily comfort",
  },
  {
    title: "Multi-layer absorbent",
    description: "Keeps cages dry, reduces cleaning time",
  },
  {
    title: "Perfect fit for C&C cages",
    description: "Designed for guinea pig & rabbit housing systems",
  },
  {
    title: "Eco-conscious alternative",
    description: "Reduces disposable bedding waste and saves money",
  },
];

export function ProductInformationSection({
  features = defaultFeatures,
  specifications = [],
  careInstructions = [],
  imageSrc = "/product_details_default_pic.png",
  className,
}: ProductInformationSectionProps) {
  return (
    <div
      className={cn(
        "bg-primary-navy flex w-full flex-col gap-10 rounded-[32px] p-10",
        className
      )}
    >
      {/* Title */}
      <div className="flex w-full items-center gap-10">
        <div className="min-w-0 flex-1">
          <h2 className="text-primary-gold text-[32px] leading-10 font-semibold">
            Product Information
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-10">
        {/* Left Column - Collapsibles - FIXED WIDTH */}
        <div className="flex w-[520px] shrink-0 flex-col gap-6">
          {/* Product Features */}
          {features.length > 0 && (
            <Collapsible title="Product Features" defaultOpen={true}>
              <div className="flex w-full flex-col gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="w-full">
                    <div className="text-sm leading-5 text-white">
                      <p className="mb-0 font-semibold">{feature.title}</p>
                      <p className="font-normal break-words whitespace-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>
          )}

          {/* Specifications */}
          <Collapsible
            title="Specifications"
            defaultOpen={specifications.length > 0}
          >
            {specifications.length > 0 && (
              <div className="flex w-full flex-col gap-6">
                {specifications.map((spec, index) => (
                  <div key={index} className="w-full">
                    <div className="text-sm leading-5 text-white">
                      <p className="mb-0 font-semibold">{spec.title}</p>
                      <p className="font-normal break-words whitespace-normal">
                        {spec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Collapsible>

          {/* Care Instructions */}
          <Collapsible
            title="How to Use / Care Instructions"
            defaultOpen={careInstructions.length > 0}
          >
            {careInstructions.length > 0 && (
              <div className="flex w-full flex-col gap-6">
                {careInstructions.map((instruction, index) => (
                  <div key={index} className="w-full">
                    <div className="text-sm leading-5 text-white">
                      <p className="mb-0 font-semibold">{instruction.title}</p>
                      <p className="font-normal break-words whitespace-normal">
                        {instruction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Collapsible>
        </div>

        {/* Right Column - Image */}
        <div className="bg-secondary-mint flex h-[528px] flex-1 items-center justify-center rounded-[24px] p-10">
          <div className="relative h-full w-full">
            <Image
              src={imageSrc}
              alt="Product"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

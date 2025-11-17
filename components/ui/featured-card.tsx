import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface FeaturedCardProps {
  image?: string;
  imageAlt?: string;
  title: string;
  onClick?: () => void;
  className?: string;
}

export function FeaturedCard({
  image,
  imageAlt = "Featured category",
  title,
  onClick,
  className,
}: FeaturedCardProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-4 rounded-[28px] bg-[#ffdfdf] p-6",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-[200px] w-full overflow-hidden rounded-[24px]">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="rounded-[24px] object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="bg-neutral-stroke absolute inset-0 flex items-center justify-center rounded-[24px]">
            <span className="text-primary-navy text-sm">Category Image</span>
          </div>
        )}
      </div>

      {/* Title and Arrow Button */}
      <div className="flex w-full items-center gap-4">
        <h3 className="text-primary-navy min-w-0 flex-1 text-2xl leading-8 font-semibold">
          {title}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={onClick}
          className="border-neutral-stroke shrink-0 rounded-full bg-white"
        >
          <ArrowUpRight className="text-primary-navy size-4" />
        </Button>
      </div>
    </div>
  );
}

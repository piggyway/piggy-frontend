import * as React from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface FeaturedCardProps {
  image?: string
  imageAlt?: string
  title: string
  onClick?: () => void
  className?: string
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
        "bg-[#ffdfdf] flex flex-col gap-4 items-start p-6 rounded-[28px] w-full",
        className
      )}
    >
      {/* Image */}
      <div className="h-[200px] rounded-[24px] w-full overflow-hidden relative">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover rounded-[24px]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-stroke flex items-center justify-center rounded-[24px]">
            <span className="text-primary-navy text-sm">Category Image</span>
          </div>
        )}
      </div>

      {/* Title and Arrow Button */}
      <div className="flex gap-4 items-center w-full">
        <h3 className="flex-1 min-w-0 text-2xl font-semibold leading-8 text-primary-navy">
          {title}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={onClick}
          className="bg-white border-neutral-stroke rounded-full shrink-0"
        >
          <ArrowUpRight className="size-4 text-primary-navy" />
        </Button>
      </div>
    </div>
  )
}


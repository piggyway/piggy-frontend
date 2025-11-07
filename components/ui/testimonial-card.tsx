import * as React from "react"
import { cn } from "@/lib/utils"

export interface TestimonialCardProps {
  quote: string
  author: string
  location?: string
  className?: string
}

export function TestimonialCard({
  quote,
  author,
  location,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "bg-[#ffdfdf] flex flex-col gap-5 items-start p-6 rounded-[28px] w-full",
        className
      )}
    >
      {/* Quote Section */}
      <div className="flex flex-col gap-3.5 items-start w-full">
        <div className="flex gap-0 items-start text-primary-navy w-full">
          {/* Opening Quote */}
          <div className="text-[42px] font-semibold leading-[42px] tracking-[-0.21px] shrink-0 text-primary-navy">
            "
          </div>
          
          {/* Quote Text */}
          <p className="flex-1 min-w-0 text-xl font-medium leading-6 text-primary-navy">
            {quote}
          </p>
          
          {/* Closing Quote */}
          <div className="flex flex-col justify-end text-[42px] font-semibold leading-0 shrink-0 text-primary-navy tracking-[-0.21px]">
            "
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="flex flex-col gap-4 items-start justify-end flex-1 min-h-0 w-full">
        <div className="flex gap-4 items-center w-full">
          <p className="flex-1 min-w-0 text-2xl font-semibold leading-8 text-primary-navy">
            {author}
            {location && `, ${location}`}
          </p>
        </div>
      </div>
    </div>
  )
}


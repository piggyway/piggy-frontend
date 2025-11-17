import * as React from "react";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  location?: string;
  className?: string;
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
        "flex w-full flex-col items-start gap-5 rounded-[28px] bg-[#ffdfdf] p-6",
        className
      )}
    >
      {/* Quote Section */}
      <div className="flex w-full flex-col items-start gap-3.5">
        <div className="text-primary-navy flex w-full items-start gap-0">
          {/* Opening Quote */}
          <div className="text-primary-navy shrink-0 text-[42px] leading-[42px] font-semibold tracking-[-0.21px]">
            "
          </div>

          {/* Quote Text */}
          <p className="text-primary-navy min-w-0 flex-1 text-xl leading-6 font-medium">
            {quote}
          </p>

          {/* Closing Quote */}
          <div className="text-primary-navy flex shrink-0 flex-col justify-end text-[42px] leading-0 font-semibold tracking-[-0.21px]">
            "
          </div>
        </div>
      </div>

      {/* Author Section */}
      <div className="flex min-h-0 w-full flex-1 flex-col items-start justify-end gap-4">
        <div className="flex w-full items-center gap-4">
          <p className="text-primary-navy min-w-0 flex-1 text-2xl leading-8 font-semibold">
            {author}
            {location && `, ${location}`}
          </p>
        </div>
      </div>
    </div>
  );
}

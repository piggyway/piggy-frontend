"use client";

import Image from "next/image";
import { AnimatedSection } from "../homepage/AnimatedSection";
import type { VariantReview } from "@/lib/types/product";

interface TestimonialsSectionProps {
  reviews?: VariantReview[];
}

export function TestimonialsSection({
  reviews = [],
}: TestimonialsSectionProps) {
  // Use backend reviews if available, otherwise fall back to empty or static
  // Design requires specifically 2 reviews for the layout.
  // We'll take the first 2 reviews from the API.
  const displayReviews = reviews.slice(0, 2).map((review, index) => ({
    id: review.id,
    quote: review.content || "",
    author: review.customer_name || "Piggy Way Customer",
    // Alternating backgrounds based on index
    bgColor: index === 0 ? "bg-secondary-mint" : "bg-[#fffcef]",
    // Use review image if available, otherwise fallback
    imageUrl: review.image_url || "/product_details_default_pic.png",
    imageAlt: "Customer review image",
  }));

  // If no reviews, we can either hide section or show nothing.
  // Given "Loved by Piggies" is a key section, maybe we show nothing if empty?
  if (displayReviews.length === 0) {
    return null;
  }

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* White rounded container */}
        <div className="rounded-[28px] bg-white p-6 sm:p-8 lg:p-10">
          {/* Title and Mascot Header */}
          <div className="mb-8 flex items-start justify-between gap-8 sm:mb-12">
            <div className="flex-1">
              <p className="text-primary-navy mb-1 text-[24px] leading-8 font-normal">
                Trusted by Parents
              </p>
              <h2 className="text-primary-navy-light text-[42px] leading-[42px] font-semibold tracking-[-0.21px]">
                Loved by Piggies
              </h2>
            </div>
            {/* Decorative Piggy Icon */}
            <div className="ml-8 hidden lg:block">
              <div className="relative h-24 w-24">
                <Image
                  src="/image 105.svg"
                  alt="Piggy mascot"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {displayReviews.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`${testimonial.bgColor} flex flex-col gap-6 rounded-[28px] p-6 md:h-[279px] md:flex-row`}
              >
                {/* Image Section - square with rounded corners */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[20px] md:aspect-auto md:size-[231px]">
                  <Image
                    src={testimonial.imageUrl}
                    alt={testimonial.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 231px"
                  />
                </div>

                {/* Content Section */}
                <div className="flex min-h-0 flex-1 flex-col">
                  {/* Quote Block - scrolls when it overflows the fixed height */}
                  <div className="text-primary-navy min-h-0 flex-1 overflow-y-auto pr-1">
                    <p className="text-[20px] leading-6 font-medium">
                      <span className="text-primary-navy-light pr-1 align-top text-[42px] font-semibold">
                        “
                      </span>
                      {testimonial.quote}
                      <span className="text-primary-navy-light pl-1 align-bottom text-[42px] font-semibold">
                        ”
                      </span>
                    </p>
                  </div>

                  {/* Author */}
                  <div className="mt-4 shrink-0">
                    <p className="text-primary-navy text-[24px] font-semibold">
                      {testimonial.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

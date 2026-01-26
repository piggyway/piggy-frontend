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
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title and Mascot Header */}
        <div className="mb-8 flex items-start justify-between gap-8 sm:mb-12">
          <div className="flex-1">
            <p className="text-primary-navy mb-1 text-lg leading-relaxed font-medium sm:text-xl">
              Trusted by Parents
            </p>
            <h2 className="text-primary-navy-light text-[32px] leading-tight font-bold sm:text-[42px]">
              Loved by Piggies
            </h2>
          </div>
          {/* Decorative Piggy Icon */}
          <div className="ml-8 hidden lg:block">
            <div className="relative h-24 w-24">
              <Image
                src="/pet-care-tips/default1-2.png"
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
              className={`${testimonial.bgColor} flex flex-col gap-6 rounded-[28px] p-6 md:flex-row md:items-stretch`}
            >
              {/* Image Section */}
              <div className="relative h-[160px] w-full shrink-0 overflow-hidden rounded-[20px] md:h-auto md:w-[140px] lg:w-[160px]">
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col justify-between py-2">
                {/* Quote Block */}
                <div className="text-primary-navy relative">
                  <span className="absolute -top-2 -left-2 text-4xl leading-none font-bold opacity-30">
                    “
                  </span>
                  <p className="text-lg leading-relaxed font-bold md:text-[19px]">
                    <span className="inline-block px-4">
                      “{testimonial.quote}”
                    </span>
                  </p>
                </div>

                {/* Author */}
                <div className="mt-4">
                  <p className="text-primary-navy text-lg font-bold">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

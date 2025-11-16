"use client";

import Image from "next/image";
import { AnimatedSection } from "../homepage/AnimatedSection";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Bought one for the buns – they stopped sliding around and I love how quick it dries after a wash.",
      author: "Sophie L., Melbourne",
      bgColor: "bg-secondary-mint",
    },
    {
      id: 2,
      quote:
        "Finally a liner that doesn't hold onto fur. Looks neat, feels comfy, and saves me heaps of cleaning time.",
      author: "Daniel W., Sydney",
      bgColor: "bg-[#fffcef]", // Light gold/beige
    },
    {
      id: 3,
      quote:
        "My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!",
      author: "Eve R., Brisbane",
      bgColor: "bg-neutral-pink-background",
    },
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title with Icon */}
        <div className="mb-8 flex items-start justify-between gap-8 sm:mb-10">
          <div className="flex-1">
            <p className="text-primary-navy mb-2 text-lg leading-relaxed sm:text-xl">
              Trusted by Parents
            </p>
            <h2 className="text-primary-navy-light text-[32px] leading-tight font-semibold sm:text-[42px]">
              Loved by Piggies
            </h2>
          </div>
          {/* Decorative Piggy Icon */}
          <div className="ml-8 hidden lg:block">
            <div className="relative h-20 w-20">
              <Image
                src="/pet-care-tips/default1-2.png"
                alt="Piggy mascot"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`${testimonial.bgColor} flex min-h-[280px] flex-col gap-5 rounded-[28px] p-6`}
            >
              {/* Quote with decorative quotes */}
              <div className="text-primary-navy flex items-start gap-0">
                <span className="w-[30px] shrink-0 text-[42px] leading-[42px] font-semibold tracking-[-0.21px]">
                  "
                </span>
                <p className="flex-1 text-[20px] leading-[24px] font-medium">
                  {testimonial.quote}
                </p>
                <span className="w-[20px] shrink-0 self-end text-[42px] leading-[0px] font-semibold tracking-[-0.21px]">
                  "
                </span>
              </div>

              {/* Author */}
              <div className="mt-auto">
                <p className="text-primary-navy text-[24px] leading-[32px] font-semibold">
                  {testimonial.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

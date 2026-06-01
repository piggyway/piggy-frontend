"use client";

import Image from "next/image";
import { AnimatedSection } from "./AnimatedSection";

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
      bgColor: "bg-[#FDF3D8]",
    },
    {
      id: 3,
      quote:
        "My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!",
      author: "Eve R., Melbourne",
      bgColor: "bg-neutral-pink-background",
    },
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        <div className="rounded-[32px] bg-white p-6 sm:p-10 lg:p-12">
          {/* Title with Icon */}
          <div className="mb-8 flex items-start justify-between gap-8 sm:mb-10">
            <div className="flex-1">
              <p className="text-primary-navy mb-2 text-[20px] leading-[32px] font-normal sm:text-[24px]">
                Trusted by Parents
              </p>
              <h2 className="text-primary-navy-light text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
                Loved by Piggies
              </h2>
            </div>
            {/* Guinea Pig Icon */}
            <div className="relative hidden h-[84px] w-[70px] shrink-0 sm:block">
              <Image
                src="/pet-care-tips/default1-2.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`${testimonial.bgColor} flex h-[279px] flex-col gap-5 rounded-[28px] p-6`}
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
      </div>
    </AnimatedSection>
  );
}

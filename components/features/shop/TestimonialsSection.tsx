'use client';

import Image from 'next/image';
import { AnimatedSection } from '../homepage/AnimatedSection';

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "Bought one for the buns – they stopped sliding around and I love how quick it dries after a wash.",
      author: "Sophie L., Melbourne",
      bgColor: 'bg-secondary-mint'
    },
    {
      id: 2,
      quote: "Finally a liner that doesn't hold onto fur. Looks neat, feels comfy, and saves me heaps of cleaning time.",
      author: "Daniel W., Sydney",
      bgColor: 'bg-[#fffcef]' // Light gold/beige
    },
    {
      id: 3,
      quote: "My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!",
      author: "Eve R., Brisbane",
      bgColor: 'bg-neutral-pink-background'
    }
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Title with Icon */}
        <div className="flex items-start justify-between gap-8 mb-8 sm:mb-10">
          <div className="flex-1">
            <p className="text-lg sm:text-xl text-primary-navy leading-relaxed mb-2">
              Trusted by Parents
            </p>
            <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-tight">
              Loved by Piggies
            </h2>
          </div>
          {/* Decorative Piggy Icon */}
          <div className="hidden lg:block ml-8">
            <div className="w-20 h-20 relative">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`${testimonial.bgColor} rounded-[28px] p-6 flex flex-col gap-5 min-h-[280px]`}
            >
              {/* Quote with decorative quotes */}
              <div className="flex gap-0 items-start text-primary-navy">
                <span className="text-[42px] font-semibold leading-[42px] tracking-[-0.21px] w-[30px] shrink-0">
                  "
                </span>
                <p className="flex-1 text-[20px] font-medium leading-[24px]">
                  {testimonial.quote}
                </p>
                <span className="text-[42px] font-semibold leading-[0px] tracking-[-0.21px] w-[20px] shrink-0 self-end">
                  "
                </span>
              </div>

              {/* Author */}
              <div className="mt-auto">
                <p className="text-[24px] font-semibold text-primary-navy leading-[32px]">
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

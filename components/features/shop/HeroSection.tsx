"use client";

import { AnimatedSection } from "../homepage/AnimatedSection";

export function HeroSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Left Side - Text Content */}
          <div className="w-full flex-1">
            <h1 className="text-primary-navy-light mb-6 text-[32px] leading-tight font-semibold sm:text-[42px] lg:text-[48px]">
              Guinea Pig & Rabbit Essentials
            </h1>
            <p className="text-primary-navy text-lg leading-relaxed sm:text-xl">
              Happy piggies & bunnies start here – cozy huts, tasty snacks, and
              everyday care made with love for little paws.
            </p>
          </div>

          {/* Right Side - Decorative Shapes */}
          <div className="flex w-full flex-1 items-center justify-center gap-4">
            {/* Left decorative rectangle - light blue/gray */}
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#e8eef7] sm:h-32 sm:w-32">
              <div className="h-12 w-12 rounded-lg bg-white/50" />
            </div>

            {/* Two navy blue rounded shapes */}
            <div className="flex flex-col gap-4">
              <div className="bg-primary-navy flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24">
                <div className="h-10 w-10 rounded-lg bg-white/20" />
              </div>
              <div className="bg-primary-navy flex h-20 w-32 items-center justify-center rounded-[28px] sm:h-24 sm:w-40">
                <div className="h-10 w-16 rounded-lg bg-white/20" />
              </div>
            </div>

            {/* Right pink rectangle */}
            <div className="flex h-40 w-40 items-center justify-center rounded-[28px] bg-[#ffc0cb] sm:h-48 sm:w-48">
              <div className="h-20 w-20 rounded-lg bg-white/50" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

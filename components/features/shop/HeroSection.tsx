"use client";

import { AnimatedSection } from "../homepage/AnimatedSection";

export function HeroSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Left Side - Text Content */}
          <div className="w-full flex-1">
            <h1 className="text-primary-navy-light text-large sm:text-h4 lg:text-h3 mb-6 leading-tight font-semibold">
              Guinea Pig & Rabbit Essentials
            </h1>
            <p className="text-primary-navy text-lg leading-relaxed sm:text-xl">
              Happy piggies & bunnies start here – cozy huts, tasty snacks, and
              everyday care made with love for little paws.
            </p>
          </div>

          {/* Right Side - Decorative Shapes */}
          <div className="flex w-full min-w-0 flex-1 items-center justify-center gap-2 sm:gap-4">
            {/* Left decorative rectangle - light blue/gray */}
            <div className="bg-neutral-blue-background flex h-16 w-16 items-center justify-center rounded-[20px] sm:h-24 sm:w-24 sm:rounded-[28px] md:h-32 md:w-32">
              <div className="h-8 w-8 rounded-lg bg-white/50 sm:h-12 sm:w-12" />
            </div>

            {/* Two navy blue rounded shapes */}
            <div className="flex flex-col gap-2 sm:gap-4">
              <div className="bg-primary-navy flex h-14 w-14 items-center justify-center rounded-full sm:h-20 sm:w-20 md:h-24 md:w-24">
                <div className="h-7 w-7 rounded-lg bg-white/20 sm:h-10 sm:w-10" />
              </div>
              <div className="bg-primary-navy flex h-14 w-20 items-center justify-center rounded-[20px] sm:h-20 sm:w-32 sm:rounded-[28px] md:h-24 md:w-40">
                <div className="h-7 w-12 rounded-lg bg-white/20 sm:h-10 sm:w-16" />
              </div>
            </div>

            {/* Right pink rectangle */}
            <div className="bg-neutral-pink-background flex h-24 w-24 items-center justify-center rounded-[20px] sm:h-40 sm:w-40 sm:rounded-[28px] md:h-48 md:w-48">
              <div className="h-12 w-12 rounded-lg bg-white/50 sm:h-20 sm:w-20" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

'use client';

import { AnimatedSection } from '../homepage/AnimatedSection';

export function HeroSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="flex-1 w-full">
            <h1 className="text-[32px] sm:text-[42px] lg:text-[48px] font-semibold text-primary-navy-light leading-tight mb-6">
              Guinea Pig & Rabbit Essentials
            </h1>
            <p className="text-lg sm:text-xl text-primary-navy leading-relaxed">
              Happy piggies & bunnies start here – cozy huts, tasty snacks, and everyday care made with love for little paws.
            </p>
          </div>

          {/* Right Side - Decorative Shapes */}
          <div className="flex-1 w-full flex gap-4 items-center justify-center">
            {/* Left decorative rectangle - light blue/gray */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#e8eef7] rounded-[28px] flex items-center justify-center">
              <div className="w-12 h-12 bg-white/50 rounded-lg" />
            </div>

            {/* Two navy blue rounded shapes */}
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-navy rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-white/20 rounded-lg" />
              </div>
              <div className="w-32 h-20 sm:w-40 sm:h-24 bg-primary-navy rounded-[28px] flex items-center justify-center">
                <div className="w-16 h-10 bg-white/20 rounded-lg" />
              </div>
            </div>

            {/* Right pink rectangle */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-[#ffc0cb] rounded-[28px] flex items-center justify-center">
              <div className="w-20 h-20 bg-white/50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

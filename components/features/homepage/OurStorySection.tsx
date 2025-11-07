'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export function OurStorySection() {
  return (
    <AnimatedSection className="w-full bg-neutral-background-light">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* White Container */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 md:p-10">
          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-10 items-center">
            {/* Left Side - Text Content with decorative characters */}
            <div className="flex-1 flex flex-col justify-between relative min-h-[300px]">
              {/* Title */}
              <div className="flex gap-5 items-center mb-8">
                <h2 className="text-[42px] font-semibold text-primary-navy leading-[42px] tracking-[-0.21px]">
                  Our Story
                </h2>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <p className="text-[24px] font-semibold text-primary-navy-light leading-[32px]">
                  Our Story Designed by Pet Parents, for Pet Parents
                </p>
                <p className="text-[20px] font-medium text-primary-navy leading-[24px]">
                  We're guinea pig & rabbit lovers creating products that make life easier, healthier, and happier for pets and their humans
                </p>
              </div>

              {/* Decorative Character Images */}
              <div className="absolute left-[350px] top-0 pointer-events-none">
                {/* Character 1 - smaller, positioned left and slightly down */}
                <div className="absolute left-0 top-[16px] w-[66px] h-[75px]">
                  <Image
                    src="/our-story/default1.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Character 2 - larger, positioned right and at top */}
                <div className="absolute left-[67px] top-0 w-[103px] h-[93px]">
                  <Image
                    src="/our-story/default2.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Decorative Cards */}
            <div className="relative w-[520px] h-[300px] shrink-0">
              {/* Purple rounded square - bottom left */}
              <div className="absolute left-0 top-[150px] w-[201px] h-[150px] bg-primary-purple rounded-[33px]" />

              {/* Mint rounded squares - top left */}
              <div className="absolute left-0 top-0 w-[68px] h-[150px] bg-secondary-mint rounded-[33px]" />
              <div className="absolute left-[68px] top-0 w-[133px] h-[150px] bg-secondary-mint rounded-[33px]" />

              {/* Navy card with button - right side */}
              <div className="absolute left-[201px] top-0 w-[319px] h-[300px] bg-primary-navy rounded-[32px] p-8 flex items-end justify-end">
                <button
                  className="bg-white border border-neutral-stroke rounded-full p-3 flex items-center justify-center shrink-0 size-[40px]"
                  aria-label="Learn more"
                >
                  <ArrowUpRight className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden flex flex-col gap-6">
            <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy leading-[42px] tracking-[-0.21px]">
              Our Story
            </h2>
            <p className="text-xl sm:text-[24px] font-semibold text-primary-navy-light leading-[32px]">
              Our Story Designed by Pet Parents, for Pet Parents
            </p>
            <p className="text-base sm:text-[20px] font-medium text-primary-navy leading-[24px]">
              We're guinea pig & rabbit lovers creating products that make life easier, healthier, and happier for pets and their humans
            </p>

            {/* Simplified card for mobile */}
            <div className="bg-primary-navy rounded-[28px] p-6 min-h-[200px] flex items-end justify-end">
              <button
                className="bg-white border border-neutral-stroke rounded-full p-3 flex items-center justify-center"
                aria-label="Learn more"
              >
                <ArrowUpRight className="w-4 h-4 text-primary-navy" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

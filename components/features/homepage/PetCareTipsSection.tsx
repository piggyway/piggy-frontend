'use client';

import Image from 'next/image';
import { ArrowUpRight, Plus } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export function PetCareTipsSection() {
  return (
    <AnimatedSection className="w-full bg-neutral-background-light">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Title */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[20px] sm:text-[24px] font-normal text-primary-navy leading-[32px] mb-2">
            Learn, Love, Care
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-[42px] tracking-[-0.21px]">
            Pet Care & Tips
          </h2>
        </div>

        {/* Cards Container - Desktop Only with Fixed Layout */}
        <div className="hidden lg:block relative">
          <div className="flex gap-10 items-center">
            {/* Card 1 - Dark Blue with Illustration */}
            <div className="bg-primary-navy rounded-[28px] p-6 flex flex-col gap-5 h-[387px] w-[360px] shrink-0">
              <div className="flex-1 flex flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative w-full h-[153px]">
                  <div className="absolute left-0 top-0 w-[221px] h-[153px] bg-secondary-mint rounded-[33px]" />
                  <div className="absolute right-0 top-0 w-[91px] h-[153px] bg-secondary-mint rounded-[33px]" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image src="/pet-care-tips/default1.png" alt="" width={65} height={65} className="object-contain" />
                  </div>
                </div>
                <p className="text-[20px] font-medium text-primary-navy leading-[24px]">
                  Topic XXX headline here, total text maximum within 2 lines
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[24px] font-semibold text-white leading-[32px] flex-1">
                  Read more
                </p>
                <button
                  className="bg-white border border-neutral-stroke rounded-full p-3 flex items-center justify-center shrink-0"
                  aria-label="Read more"
                >
                  <Plus className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Card 2 - White Text Card */}
            <div className="bg-white rounded-[28px] p-6 flex flex-col gap-5 h-[387px] w-[360px] shrink-0 relative">
              <div className="flex-1 flex flex-col gap-[14px]">
                <p className="text-[32px] font-semibold text-primary-navy-light leading-[40px]">
                  Everything You Need to Begin
                </p>
                <p className="text-[20px] font-medium text-primary-navy leading-[24px]">
                  We're guinea pig & rabbit lovers creating products that make life easier.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[24px] font-semibold text-primary-navy leading-[32px] flex-1">
                  Read more
                </p>
                <button
                  className="bg-white border border-neutral-stroke rounded-full p-3 flex items-center justify-center shrink-0"
                  aria-label="Read more"
                >
                  <ArrowUpRight className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
                </button>
              </div>
              {/* Overlapping Guinea Pig Image */}
              <div className="absolute left-[176px] top-[78px] w-[160px] h-[151px] pointer-events-none">
                <Image
                  src="/pet-care-tips/default1.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Card 3 - Gold with Illustration */}
            <div className="bg-primary-gold rounded-[28px] p-6 flex flex-col gap-5 h-[387px] w-[360px] shrink-0">
              <div className="flex-1 flex flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative w-full h-[153px]">
                  <div className="absolute left-0 top-0 w-[221px] h-[153px] bg-secondary-light-gold rounded-[33px]" />
                  <div className="absolute right-0 top-0 w-[91px] h-[153px] bg-secondary-light-gold rounded-[33px]" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image src="/pet-care-tips/default1.png" alt="" width={65} height={65} className="object-contain" />
                  </div>
                </div>
                <p className="text-[20px] font-medium text-primary-navy leading-[24px]">
                  Topic XXX headline here, total text maximum within 2 lines
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-[24px] font-semibold text-white leading-[32px] flex-1">
                  Read more
                </p>
                <button
                  className="bg-white border border-neutral-stroke rounded-full p-3 flex items-center justify-center shrink-0"
                  aria-label="Read more"
                >
                  <Plus className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* Simplified cards for mobile */}
          <div className="bg-primary-navy rounded-[28px] p-6 flex flex-col gap-4 min-h-[280px]">
            <h3 className="text-xl font-semibold text-white">Topic Headline</h3>
            <p className="text-base text-white/80 flex-1">Topic XXX headline here, total text maximum within 2 lines</p>
            <button className="self-end bg-white border border-neutral-stroke rounded-full p-3">
              <Plus className="w-4 h-4 text-primary-navy" />
            </button>
          </div>
          <div className="bg-white rounded-[28px] p-6 flex flex-col gap-4 min-h-[280px]">
            <h3 className="text-xl font-semibold text-primary-navy-light">Everything You Need to Begin</h3>
            <p className="text-base text-primary-navy flex-1">We're guinea pig & rabbit lovers creating products that make life easier.</p>
            <button className="self-end bg-white border border-neutral-stroke rounded-full p-3">
              <ArrowUpRight className="w-4 h-4 text-primary-navy" />
            </button>
          </div>
          <div className="bg-primary-gold rounded-[28px] p-6 flex flex-col gap-4 min-h-[280px]">
            <h3 className="text-xl font-semibold text-white">Topic Headline</h3>
            <p className="text-base text-primary-navy flex-1">Topic XXX headline here, total text maximum within 2 lines</p>
            <button className="self-end bg-white border border-neutral-stroke rounded-full p-3">
              <Plus className="w-4 h-4 text-primary-navy" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

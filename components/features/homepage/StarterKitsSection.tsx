'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export function StarterKitsSection() {
  return (
    <AnimatedSection className="w-full bg-neutral-background-light">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Title */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[20px] sm:text-[24px] font-normal text-primary-navy leading-[32px] mb-2">
            Everything You Need to Begin
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-[42px] tracking-[-0.21px]">
            Starter Kits & Bundles
          </h2>
        </div>

        {/* Cards Container - Desktop */}
        <div className="hidden lg:flex gap-10 items-center">
          {/* Card 1 - Grey with Illustration */}
          <div className="bg-neutral-stroke rounded-[28px] p-6 flex flex-col gap-5 h-[387px] w-[360px] shrink-0">
            <div className="flex-1 flex flex-col gap-[14px]">
              {/* Illustration Area */}
              <div className="relative w-full h-[153px]">
                <div className="absolute left-0 top-0 w-[221px] h-[153px] bg-white rounded-[33px]" />
                <div className="absolute right-0 top-0 w-[91px] h-[153px] bg-white rounded-[33px]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image src="/shop-with-us/default.png" alt="" width={300} height={300} className="object-contain" />
                </div>
              </div>
              <p className="text-[20px] font-medium text-primary-navy leading-[24px]">
                Topic XXX headline here, total text maximum within 2 lines
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
                <Plus className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Card 2 - Navy Blue Text Card */}
          <div className="bg-primary-navy-light rounded-[28px] p-6 flex flex-col gap-5 h-[387px] w-[360px] shrink-0">
            <div className="flex-1 flex flex-col gap-[14px] text-white">
              <p className="text-[32px] font-semibold leading-[40px]">
                Placeholder headline to be here
              </p>
              <p className="text-[20px] font-medium leading-[24px]">
                We're guinea pig & rabbit lovers creating products that make life easier.
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

          {/* Card 3 - Mint Text Card */}
          <div className="bg-secondary-mint rounded-[28px] p-6 flex flex-col gap-5 h-[387px] w-[360px] shrink-0">
            <div className="flex-1 flex flex-col gap-[14px]">
              <p className="text-[32px] font-semibold text-primary-navy-light leading-[40px]">
                Placeholder headline to be here
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
                <Plus className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col gap-6">
          <div className="bg-neutral-stroke rounded-[28px] p-6 flex flex-col gap-4 min-h-[280px]">
            <h3 className="text-xl font-semibold text-primary-navy">Topic Headline</h3>
            <p className="text-base text-primary-navy flex-1">Topic XXX headline here, total text maximum within 2 lines</p>
            <button className="self-end bg-white border border-neutral-stroke rounded-full p-3">
              <Plus className="w-4 h-4 text-primary-navy" />
            </button>
          </div>
          <div className="bg-primary-navy-light rounded-[28px] p-6 flex flex-col gap-4 min-h-[280px]">
            <h3 className="text-xl font-semibold text-white">Placeholder headline to be here</h3>
            <p className="text-base text-white flex-1">We're guinea pig & rabbit lovers creating products that make life easier.</p>
            <button className="self-end bg-white border border-neutral-stroke rounded-full p-3">
              <Plus className="w-4 h-4 text-primary-navy" />
            </button>
          </div>
          <div className="bg-secondary-mint rounded-[28px] p-6 flex flex-col gap-4 min-h-[280px]">
            <h3 className="text-xl font-semibold text-primary-navy-light">Placeholder headline to be here</h3>
            <p className="text-base text-primary-navy flex-1">We're guinea pig & rabbit lovers creating products that make life easier.</p>
            <button className="self-end bg-white border border-neutral-stroke rounded-full p-3">
              <Plus className="w-4 h-4 text-primary-navy" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

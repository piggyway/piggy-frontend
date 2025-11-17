"use client";

import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function PetCareTipsSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <div className="mb-8 sm:mb-10">
          <p className="text-primary-navy mb-2 text-[20px] leading-[32px] font-normal sm:text-[24px]">
            Learn, Love, Care
          </p>
          <h2 className="text-primary-navy-light text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
            Pet Care & Tips
          </h2>
        </div>

        {/* Cards Container - Desktop Only */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="flex items-center gap-6 pb-4">
            {/* Card 1 - Dark Blue with Illustration */}
            <div className="bg-primary-navy flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6">
              <div className="flex flex-1 flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative h-[153px] w-full">
                  <div className="bg-secondary-mint absolute top-0 left-0 h-[153px] w-[221px] rounded-[33px]" />
                  <div className="bg-secondary-mint absolute top-0 right-0 h-[153px] w-[91px] rounded-[33px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src="/pet-care-tips/default1.png"
                      alt=""
                      width={65}
                      height={65}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  Topic XXX headline here, total text maximum within 2 lines
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="flex-1 text-[24px] leading-[32px] font-semibold text-white">
                  Read more
                </p>
                <button
                  className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Read more"
                >
                  <Plus
                    className="text-primary-navy h-[11px] w-[11px]"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {/* Card 2 - White Text Card */}
            <div className="relative flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] bg-white p-6">
              <div className="flex flex-1 flex-col gap-[14px]">
                <p className="text-primary-navy-light text-[32px] leading-[40px] font-semibold">
                  Everything You Need to Begin
                </p>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  We're guinea pig & rabbit lovers creating products that make
                  life easier.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-primary-navy flex-1 text-[24px] leading-[32px] font-semibold">
                  Read more
                </p>
                <button
                  className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Read more"
                >
                  <ArrowUpRight
                    className="text-primary-navy h-[11px] w-[11px]"
                    strokeWidth={2}
                  />
                </button>
              </div>
              {/* Overlapping Guinea Pig Image */}
              <div className="pointer-events-none absolute top-[78px] left-[176px] h-[151px] w-[160px]">
                <Image
                  src="/pet-care-tips/default1.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Card 3 - Gold with Illustration */}
            <div className="bg-primary-gold flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6">
              <div className="flex flex-1 flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative h-[153px] w-full">
                  <div className="bg-secondary-light-gold absolute top-0 left-0 h-[153px] w-[221px] rounded-[33px]" />
                  <div className="bg-secondary-light-gold absolute top-0 right-0 h-[153px] w-[91px] rounded-[33px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src="/pet-care-tips/default1.png"
                      alt=""
                      width={65}
                      height={65}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  Topic XXX headline here, total text maximum within 2 lines
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="flex-1 text-[24px] leading-[32px] font-semibold text-white">
                  Read more
                </p>
                <button
                  className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Read more"
                >
                  <Plus
                    className="text-primary-navy h-[11px] w-[11px]"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col gap-6 lg:hidden">
          {/* Simplified cards for mobile */}
          <div className="bg-primary-navy flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6">
            <h3 className="text-xl font-semibold text-white">Topic Headline</h3>
            <p className="flex-1 text-base text-white/80">
              Topic XXX headline here, total text maximum within 2 lines
            </p>
            <button className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <Plus className="text-primary-navy h-4 w-4" />
            </button>
          </div>
          <div className="flex min-h-[280px] flex-col gap-4 rounded-[28px] bg-white p-6">
            <h3 className="text-primary-navy-light text-xl font-semibold">
              Everything You Need to Begin
            </h3>
            <p className="text-primary-navy flex-1 text-base">
              We're guinea pig & rabbit lovers creating products that make life
              easier.
            </p>
            <button className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <ArrowUpRight className="text-primary-navy h-4 w-4" />
            </button>
          </div>
          <div className="bg-primary-gold flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6">
            <h3 className="text-xl font-semibold text-white">Topic Headline</h3>
            <p className="text-primary-navy flex-1 text-base">
              Topic XXX headline here, total text maximum within 2 lines
            </p>
            <button className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <Plus className="text-primary-navy h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

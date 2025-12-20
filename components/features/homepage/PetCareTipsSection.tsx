"use client";

import Image from "next/image";
import Link from "next/link";
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
            {/* Card 1 - Dark Blue with Illustration (Diet) */}
            <Link 
              href="/pet-care/guinea-pig-diet-guide"
              className="bg-primary-navy flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-1 flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative h-[153px] w-full">
                  {/* Center the decorative blocks as a group (221 + 91) */}
                  <div className="absolute inset-0 flex items-start justify-center">
                    <div className="relative h-[153px] w-[312px]">
                      <div className="bg-secondary-mint absolute top-0 left-0 h-[153px] w-[221px] rounded-[33px]" />
                      <div className="bg-secondary-mint absolute top-0 right-0 h-[153px] w-[91px] rounded-[33px]" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src="/pet-care-tips/default1.png"
                      alt=""
                      width={180}
                      height={180}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-white text-[20px] leading-[24px] font-medium">
                  Guinea Pig Diet Guide: What to Feed Your Piggy
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="flex-1 text-[24px] leading-[32px] font-semibold text-white">
                  Read more
                </p>
                <div
                  className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Read more"
                >
                  <Plus
                    className="text-primary-navy h-[11px] w-[11px]"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </Link>

            {/* Card 2 - White Text Card (Housing) */}
            <Link 
              href="/pet-care/habitat-setup-tips"
              className="relative flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] bg-white p-6 overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <div className="relative z-10 flex flex-1 flex-col gap-[14px]">
                <p className="text-primary-navy-light text-[32px] leading-[40px] font-semibold">
                  Everything You Need to Begin
                </p>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  Setting Up the Perfect Habitat for Small Pets
                </p>
              </div>
              <div className="relative h-[115px] w-full">
                {/* Smaller centered decorative blocks (scaled down from 153x312) */}
                <div className="absolute inset-0 flex items-start justify-center">
                  <div className="relative h-[115px] w-[234px]">
                    <div className="bg-secondary-mint absolute top-0 left-0 h-[115px] w-[166px] rounded-[25px]" />
                    <div className="bg-secondary-mint absolute top-0 right-0 h-[115px] w-[68px] rounded-[25px]" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/pet-care-tips/default1.png"
                    alt=""
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between gap-4">
                <p className="text-primary-navy flex-1 text-[24px] leading-[32px] font-semibold">
                  Read more
                </p>
                <div
                  className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Read more"
                >
                  <ArrowUpRight
                    className="text-primary-navy h-[11px] w-[11px]"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </Link>

            {/* Card 3 - Gold with Illustration (Bonding) */}
            <Link 
              href="/pet-care/bonding-with-your-pet"
              className="bg-primary-gold flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-1 flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative h-[153px] w-full">
                  {/* Center the decorative blocks as a group (221 + 91) */}
                  <div className="absolute inset-0 flex items-start justify-center">
                    <div className="relative h-[153px] w-[312px]">
                      <div className="bg-secondary-mint absolute top-0 left-0 h-[153px] w-[221px] rounded-[33px]" />
                      <div className="bg-secondary-mint absolute top-0 right-0 h-[153px] w-[91px] rounded-[33px]" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src="/pet-care-tips/default1.png"
                      alt=""
                      width={180}
                      height={180}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  Bonding Tips: Building Trust with Small Pets
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="flex-1 text-[24px] leading-[32px] font-semibold text-white">
                  Read more
                </p>
                <div
                  className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Read more"
                >
                  <Plus
                    className="text-primary-navy h-[11px] w-[11px]"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col gap-6 lg:hidden">
          {/* Simplified cards for mobile */}
          <Link href="/pet-care/guinea-pig-diet-guide" className="bg-primary-navy flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6 active:scale-[0.98] transition-transform">
            <h3 className="text-xl font-semibold text-white">Diet & Nutrition</h3>
            <p className="flex-1 text-base text-white/80">
              Guinea Pig Diet Guide: What to Feed Your Piggy
            </p>
            <div className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <Plus className="text-primary-navy h-4 w-4" />
            </div>
          </Link>
          
          <Link href="/pet-care/habitat-setup-tips" className="flex min-h-[280px] flex-col gap-4 rounded-[28px] bg-white p-6 active:scale-[0.98] transition-transform">
            <h3 className="text-primary-navy-light text-xl font-semibold">
              Everything You Need to Begin
            </h3>
            <p className="text-primary-navy flex-1 text-base">
              Setting Up the Perfect Habitat for Small Pets
            </p>
            <div className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <ArrowUpRight className="text-primary-navy h-4 w-4" />
            </div>
          </Link>

          <Link href="/pet-care/bonding-with-your-pet" className="bg-primary-gold flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6 active:scale-[0.98] transition-transform">
            <h3 className="text-xl font-semibold text-white">Bonding & Trust</h3>
            <p className="text-primary-navy flex-1 text-base">
              Bonding Tips: Building Trust with Small Pets
            </p>
            <div className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <Plus className="text-primary-navy h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function StarterKitsSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <div className="mb-8 sm:mb-10">
          <p className="text-primary-navy mb-2 text-[20px] leading-[32px] font-normal sm:text-[24px]">
            Everything You Need to Begin
          </p>
          <h2 className="text-primary-navy-light text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
            Starter Kits & Bundles
          </h2>
        </div>

        {/* Cards Container - Desktop */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="flex items-center gap-6 pb-4">
            {/* Card 1 - Grey with Illustration (Essentials) */}
            <Link
              href="/guides/bunny-starter-kit"
              className="bg-neutral-stroke flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-1 flex-col gap-[14px]">
                {/* Illustration Area */}
                <div className="relative h-[153px] w-full">
                  <div className="absolute top-0 left-0 h-[153px] w-[221px] rounded-[33px] bg-white" />
                  <div className="absolute top-0 right-0 h-[153px] w-[91px] rounded-[33px] bg-white" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image
                      src="/shop-with-us/default.png"
                      alt=""
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  First-Time Guinea Pig Owner: Complete Essentials Checklist
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-primary-navy flex-1 text-[24px] leading-[32px] font-semibold">
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

            {/* Card 2 - Navy Blue Text Card (Liners) */}
            <Link
              href="#"
              className="bg-primary-navy-light flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-1 flex-col gap-[14px] text-white">
                <p className="text-[32px] leading-[40px] font-semibold">
                  Why Fleece Cage Liners Are a Game-Changer
                </p>
                <p className="text-[20px] leading-[24px] font-medium">
                  Cleaner, healthier, and eco-friendly choice for guinea pigs.
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

            {/* Card 3 - Mint Text Card (Bunny) */}
            <Link
              href="#"
              className="bg-secondary-mint flex h-[387px] flex-1 flex-col gap-5 rounded-[28px] p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-1 flex-col gap-[14px]">
                <p className="text-primary-navy-light text-[32px] leading-[40px] font-semibold">
                  Rabbit Starter Kit: Everything You Need for Day One
                </p>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  Preparing for a new bunny? Use our comprehensive checklist.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-primary-navy flex-1 text-[24px] leading-[32px] font-semibold">
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
          <Link
            href="#"
            className="bg-neutral-stroke flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6 transition-transform active:scale-[0.98]"
          >
            <h3 className="text-primary-navy text-xl font-semibold">
              Essentials Checklist
            </h3>
            <p className="text-primary-navy flex-1 text-base">
              First-Time Guinea Pig Owner: Complete Essentials Checklist
            </p>
            <div className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <Plus className="text-primary-navy h-4 w-4" />
            </div>
          </Link>
          <Link
            href="#"
            className="bg-primary-navy-light flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6 transition-transform active:scale-[0.98]"
          >
            <h3 className="text-xl font-semibold text-white">
              Why Fleece Cage Liners Are a Game-Changer
            </h3>
            <p className="flex-1 text-base text-white">
              Cleaner, healthier, and eco-friendly choice for guinea pigs.
            </p>
            <div className="border-neutral-stroke self-end rounded-full border bg-white p-3">
              <Plus className="text-primary-navy h-4 w-4" />
            </div>
          </Link>
          <Link
            href="#"
            className="bg-secondary-mint flex min-h-[280px] flex-col gap-4 rounded-[28px] p-6 transition-transform active:scale-[0.98]"
          >
            <h3 className="text-primary-navy-light text-xl font-semibold">
              Rabbit Starter Kit: Everything You Need for Day One
            </h3>
            <p className="text-primary-navy flex-1 text-base">
              Preparing for a new bunny? Use our comprehensive checklist.
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

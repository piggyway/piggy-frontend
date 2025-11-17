"use client";

import Image from "next/image";
import { AnimatedSection } from "./AnimatedSection";

export function WhyShopSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title and Description */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-primary-navy-light mb-2 text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
            Why Shop With Us?
          </h2>
          <p className="text-primary-navy text-[20px] leading-[32px] font-normal sm:text-[24px]">
            We create comfy, easy-clean liners and accessories for guinea pigs
            and rabbits. Designed in Australia with love — soft, practical, and
            made for happy little paws.
          </p>
        </div>

        {/* 3 Column Card Layout - Desktop */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="flex items-start gap-6 pb-4">
            {/* Column 1 - White card on top, Pink card on bottom */}
            <div className="flex flex-1 flex-col gap-0">
              <div className="flex h-[230px] items-center justify-center rounded-[32px] bg-white">
                <Image
                  src="/shop-with-us/default.png"
                  alt=""
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
              <div className="bg-secondary-pink flex items-center justify-center rounded-[32px] p-8">
                <p className="text-center text-[24px] leading-[32px] font-semibold text-white">
                  Eco-Friendly Liners
                </p>
              </div>
            </div>

            {/* Column 2 - Purple card on top, White card on bottom */}
            <div className="flex flex-1 flex-col gap-0">
              <div className="bg-primary-purple flex items-center justify-center rounded-[32px] p-8">
                <p className="text-primary-navy text-center text-[24px] leading-[32px] font-semibold">
                  Easy-Clean Cages
                </p>
              </div>
              <div className="flex h-[230px] items-center justify-center rounded-[32px] bg-white">
                <Image
                  src="/shop-with-us/default.png"
                  alt=""
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Column 3 - White card on top, Gold card on bottom */}
            <div className="flex flex-1 flex-col gap-0">
              <div className="flex h-[230px] items-center justify-center rounded-[32px] bg-white">
                <Image
                  src="/shop-with-us/default.png"
                  alt=""
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
              <div className="bg-primary-gold flex items-center justify-center rounded-[32px] p-8">
                <p className="text-primary-navy text-center text-[24px] leading-[32px] font-semibold">
                  Loved by Pet Parents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="bg-secondary-pink flex min-h-[120px] items-center justify-center rounded-[28px] p-6">
            <p className="text-center text-xl font-semibold text-white">
              Eco-Friendly Liners
            </p>
          </div>
          <div className="bg-primary-purple flex min-h-[120px] items-center justify-center rounded-[28px] p-6">
            <p className="text-primary-navy text-center text-xl font-semibold">
              Easy-Clean Cages
            </p>
          </div>
          <div className="bg-primary-gold flex min-h-[120px] items-center justify-center rounded-[28px] p-6">
            <p className="text-primary-navy text-center text-xl font-semibold">
              Loved by Pet Parents
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

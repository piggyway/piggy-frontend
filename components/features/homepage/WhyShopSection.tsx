'use client';

import Image from 'next/image';
import { AnimatedSection } from './AnimatedSection';

export function WhyShopSection() {
  return (
    <AnimatedSection className="w-full bg-neutral-background-light">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Title and Description */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-[42px] tracking-[-0.21px] mb-2">
            Why Shop With Us?
          </h2>
          <p className="text-[20px] sm:text-[24px] font-normal text-primary-navy leading-[32px]">
            We create comfy, easy-clean liners and accessories for guinea pigs and rabbits. Designed in Australia with love — soft, practical, and made for happy little paws.
          </p>
        </div>

        {/* 3 Column Card Layout - Desktop */}
        <div className="hidden lg:flex gap-10 items-start">
          {/* Column 1 - White card on top, Pink card on bottom */}
          <div className="flex flex-col gap-0 w-[360px] shrink-0">
            <div className="bg-white rounded-[32px] h-[230px] flex items-center justify-center">
              <Image
                src="/shop-with-us/default.png"
                alt=""
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="bg-secondary-pink rounded-[32px] p-8 flex items-center justify-center">
              <p className="text-[24px] font-semibold text-white leading-[32px] text-center">
                Eco-Friendly Liners
              </p>
            </div>
          </div>

          {/* Column 2 - Purple card on top, White card on bottom */}
          <div className="flex flex-col gap-0 w-[360px] shrink-0">
            <div className="bg-primary-purple rounded-[32px] p-8 flex items-center justify-center">
              <p className="text-[24px] font-semibold text-primary-navy leading-[32px] text-center">
                Easy-Clean Cages
              </p>
            </div>
            <div className="bg-white rounded-[32px] h-[230px] flex items-center justify-center">
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
          <div className="flex flex-col gap-0 w-[360px] shrink-0">
            <div className="bg-white rounded-[32px] h-[230px] flex items-center justify-center">
              <Image
                src="/shop-with-us/default.png"
                alt=""
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="bg-primary-gold rounded-[32px] p-8 flex items-center justify-center">
              <p className="text-[24px] font-semibold text-primary-navy leading-[32px] text-center">
                Loved by Pet Parents
              </p>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col gap-6">
          <div className="bg-secondary-pink rounded-[28px] p-6 flex items-center justify-center min-h-[120px]">
            <p className="text-xl font-semibold text-white text-center">
              Eco-Friendly Liners
            </p>
          </div>
          <div className="bg-primary-purple rounded-[28px] p-6 flex items-center justify-center min-h-[120px]">
            <p className="text-xl font-semibold text-primary-navy text-center">
              Easy-Clean Cages
            </p>
          </div>
          <div className="bg-primary-gold rounded-[28px] p-6 flex items-center justify-center min-h-[120px]">
            <p className="text-xl font-semibold text-primary-navy text-center">
              Loved by Pet Parents
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

'use client';

import Image from 'next/image';
import { AnimatedSection } from './AnimatedSection';

export function HeroSection() {
  return (
    <AnimatedSection className="w-full bg-neutral-background-light">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Title */}
        <div className="mb-10">
          <h4 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-[42px] tracking-[-0.21px] mb-3">
            New Brand, True Care ✨
          </h4>
          <h1 className="text-[48px] sm:text-[64px] font-semibold text-primary-navy leading-[64px] tracking-[-0.768px]">
            Just for <span className="text-primary-navy">Small Paws</span>!
          </h1>
        </div>

        {/* Complex Grid Layout - Desktop */}
        <div className="hidden lg:block relative h-[350px] mb-5">
          {/* Bottom Left - Mint (Large) */}
          <div className="absolute left-0 top-[175px] w-[248px] h-[175px] bg-secondary-mint opacity-70 rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>

          {/* Top Left - Pink (Tall) */}
          <div className="absolute left-[248px] top-0 w-[332px] h-[350px] bg-secondary-pink opacity-80 rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>

          {/* Bottom Left - Blue with Guinea Pig */}
          <div className="absolute left-0 top-[175px] w-[248px] h-[175px] rounded-[33px] overflow-hidden">
            <Image src="/homepage-discover/Group 452.svg" alt="" fill className="object-cover" />
          </div>

          {/* Middle Top - Gold */}
          <div className="absolute left-[580px] top-0 w-[165px] h-[175px] bg-primary-gold rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>

          {/* Middle Bottom - Navy */}
          <div className="absolute left-[580px] top-[175px] w-[165px] h-[175px] bg-primary-navy opacity-70 rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>

          {/* Right Top - Grey */}
          <div className="absolute left-[745px] top-0 w-[165px] h-[175px] bg-neutral-grey-background opacity-70 rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>

          {/* Right Bottom - White */}
          <div className="absolute left-[745px] top-[175px] w-[165px] h-[175px] bg-white rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>

          {/* Far Right - Purple (Tall) */}
          <div className="absolute left-[910px] top-0 w-[248px] h-[350px] bg-primary-purple rounded-[33px] flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={67} height={67} />
          </div>
        </div>

        {/* Simplified Grid for Mobile/Tablet */}
        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
          <div className="bg-secondary-mint opacity-70 rounded-[28px] aspect-square flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={50} height={50} />
          </div>
          <div className="bg-secondary-pink opacity-80 rounded-[28px] aspect-square flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={50} height={50} />
          </div>
          <div className="bg-primary-gold rounded-[28px] aspect-square flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={50} height={50} />
          </div>
          <div className="bg-primary-navy opacity-70 rounded-[28px] aspect-square flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={50} height={50} />
          </div>
          <div className="bg-neutral-grey-background opacity-70 rounded-[28px] aspect-square flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={50} height={50} />
          </div>
          <div className="bg-primary-purple rounded-[28px] aspect-square flex items-center justify-center">
            <Image src="/homepage-discover/imagesmode.svg" alt="" width={50} height={50} />
          </div>
        </div>

        {/* Description */}
        <p className="text-[20px] sm:text-[24px] font-semibold text-primary-navy leading-[32px] max-w-[745px]">
          Discover our first-ever range of liners, created to keep things clean, comfy, and fuss-free.
        </p>
      </div>
    </AnimatedSection>
  );
}

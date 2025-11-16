"use client";

import Image from "next/image";
import { AnimatedSection } from "./AnimatedSection";

export function HeroSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title */}
        <div className="mb-10">
          <h4 className="text-primary-navy-light mb-3 text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
            New Brand, True Care ✨
          </h4>
          <h1 className="text-primary-navy text-[48px] leading-[64px] font-semibold tracking-[-0.768px] sm:text-[64px]">
            Just for <span className="text-primary-navy">Small Paws</span>!
          </h1>
        </div>

        {/* Complex Grid Layout - Desktop */}
        <div className="relative mb-5 hidden overflow-hidden lg:block">
          <div className="relative h-[350px] w-full pb-4">
            {/* Bottom Left - Mint (Large) */}
            <div className="bg-secondary-mint absolute top-[175px] left-0 flex h-[175px] w-[248px] items-center justify-center rounded-[33px] opacity-70">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>

            {/* Top Left - Pink (Tall) */}
            <div className="bg-secondary-pink absolute top-0 left-[248px] flex h-[350px] w-[332px] items-center justify-center rounded-[33px] opacity-80">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>

            {/* Bottom Left - Blue with Guinea Pig */}
            <div className="absolute top-[175px] left-0 h-[175px] w-[248px] overflow-hidden rounded-[33px]">
              <Image
                src="/homepage-discover/Group 452.svg"
                alt=""
                fill
                className="object-cover"
              />
            </div>

            {/* Middle Top - Gold */}
            <div className="bg-primary-gold absolute top-0 left-[580px] flex h-[175px] w-[165px] items-center justify-center rounded-[33px]">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>

            {/* Middle Bottom - Navy */}
            <div className="bg-primary-navy absolute top-[175px] left-[580px] flex h-[175px] w-[165px] items-center justify-center rounded-[33px] opacity-70">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>

            {/* Right Top - Grey */}
            <div className="bg-neutral-grey-background absolute top-0 left-[745px] flex h-[175px] w-[165px] items-center justify-center rounded-[33px] opacity-70">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>

            {/* Right Bottom - White */}
            <div className="absolute top-[175px] left-[745px] flex h-[175px] w-[165px] items-center justify-center rounded-[33px] bg-white">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>

            {/* Far Right - Purple (Tall) */}
            <div className="bg-primary-purple absolute top-0 left-[910px] flex h-[350px] w-[248px] items-center justify-center rounded-[33px]">
              <Image
                src="/homepage-discover/imagesmode.svg"
                alt=""
                width={67}
                height={67}
              />
            </div>
          </div>
        </div>

        {/* Simplified Grid for Mobile/Tablet */}
        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
          <div className="bg-secondary-mint flex aspect-square items-center justify-center rounded-[28px] opacity-70">
            <Image
              src="/homepage-discover/imagesmode.svg"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="bg-secondary-pink flex aspect-square items-center justify-center rounded-[28px] opacity-80">
            <Image
              src="/homepage-discover/imagesmode.svg"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="bg-primary-gold flex aspect-square items-center justify-center rounded-[28px]">
            <Image
              src="/homepage-discover/imagesmode.svg"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="bg-primary-navy flex aspect-square items-center justify-center rounded-[28px] opacity-70">
            <Image
              src="/homepage-discover/imagesmode.svg"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="bg-neutral-grey-background flex aspect-square items-center justify-center rounded-[28px] opacity-70">
            <Image
              src="/homepage-discover/imagesmode.svg"
              alt=""
              width={50}
              height={50}
            />
          </div>
          <div className="bg-primary-purple flex aspect-square items-center justify-center rounded-[28px]">
            <Image
              src="/homepage-discover/imagesmode.svg"
              alt=""
              width={50}
              height={50}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-primary-navy max-w-[745px] text-[20px] leading-[32px] font-semibold sm:text-[24px]">
          Discover our first-ever range of liners, created to keep things clean,
          comfy, and fuss-free.
        </p>
      </div>
    </AnimatedSection>
  );
}

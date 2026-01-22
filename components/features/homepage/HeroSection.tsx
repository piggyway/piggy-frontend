"use client";

import Image from "next/image";
import { AnimatedSection } from "./AnimatedSection";

const heroTileImages = {
  mint: "https://res.cloudinary.com/davy7cgyi/image/upload/v1769072025/Hompage_Banner_image_-_4_2x_mqnzbg.png",
  pink: "https://res.cloudinary.com/davy7cgyi/image/upload/v1769072025/Hompage_Banner_image_-_1_2x_d1erga.png",
  gold: "https://res.cloudinary.com/davy7cgyi/image/upload/v1769072025/Hompage_Banner_image_-_2_2x_ilpoyf.png",
  navy: "https://res.cloudinary.com/davy7cgyi/image/upload/v1769072026/Hompage_Banner_image_-_5_2x_pjrqz2.png",
  grey: "https://res.cloudinary.com/davy7cgyi/image/upload/v1769072026/Hompage_Banner_image_-_6_2x_skfpd4.png",
  purple:
    "https://res.cloudinary.com/davy7cgyi/image/upload/v1769072026/Hompage_Banner_image_-_3_2x_niu6lg.png",
};

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
            <div className="bg-secondary-mint absolute top-[175px] left-0 h-[175px] w-[248px] overflow-hidden rounded-[33px] opacity-70">
              <Image
                src={heroTileImages.gold}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 248px, 50vw"
              />
            </div>

            {/* Top Left - Pink (Tall) */}
            <div className="bg-secondary-pink absolute top-0 left-[248px] h-[350px] w-[432px] overflow-hidden rounded-[33px]">
              <Image
                src={heroTileImages.purple}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 432px, 60vw"
              />
            </div>
            
            <div className="absolute top-0 left-0 h-[175px] w-[248px] overflow-hidden rounded-[33px]">
              <Image
                src={heroTileImages.pink}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 248px, 50vw"
              />
            </div>


            {/* Middle Top - Gold */}
            <div className="bg-primary-gold absolute top-0 left-[680px] h-[175px] w-[165px] overflow-hidden rounded-[33px]">
              <Image
                src={heroTileImages.mint}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 165px, 33vw"
              />
            </div>

            {/* Middle Bottom - Navy */}
            <div className="bg-primary-navy absolute top-[175px] left-[680px] h-[175px] w-[165px] overflow-hidden rounded-[33px]">
              <Image
                src={heroTileImages.navy}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 165px, 33vw"
              />
            </div>

            {/* Right Top - Grey */}
            <div className="bg-neutral-grey-background absolute top-0 left-[845px] h-[350px] w-[298px] overflow-hidden rounded-[33px]">
              <Image
                src={heroTileImages.grey}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 298px, 33vw"
              />
            </div>

          </div>
        </div>

        {/* Simplified Grid for Mobile/Tablet */}
        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:hidden">
          <div className="bg-secondary-mint relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]">
            <Image
              src={heroTileImages.mint}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </div>
          <div className="bg-secondary-pink relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]">
            <Image
              src={heroTileImages.pink}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </div>
          <div className="bg-primary-gold relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]">
            <Image
              src={heroTileImages.gold}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </div>
          <div className="bg-primary-navy relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]">
            <Image
              src={heroTileImages.navy}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </div>
          <div className="bg-neutral-grey-background relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]">
            <Image
              src={heroTileImages.grey}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </div>
          <div className="bg-primary-purple relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]">
            <Image
              src={heroTileImages.purple}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
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

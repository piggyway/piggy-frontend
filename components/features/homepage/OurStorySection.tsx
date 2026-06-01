"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

export function OurStorySection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* White Container */}
        <div className="rounded-[32px] bg-white p-6 sm:p-8 md:p-10">
          {/* Desktop Layout */}
          <div className="hidden items-center gap-10 lg:flex">
            {/* Left Side - Text Content with decorative characters */}
            <div className="relative flex min-h-[300px] flex-1 flex-col justify-between">
              {/* Title */}
              <div className="mb-8 flex items-center gap-5">
                <h2 className="text-primary-navy text-[42px] leading-[42px] font-semibold tracking-[-0.21px]">
                  Our Story
                </h2>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <p className="text-primary-navy-light text-[24px] leading-[32px] font-semibold">
                  Our Story Designed by Pet Parents, for Pet Parents
                </p>
                <p className="text-primary-navy text-[20px] leading-[24px] font-medium">
                  We&apos;re guinea pig &amp; rabbit lovers creating products
                  that make life easier, healthier, and happier for pets and
                  their humans
                </p>
              </div>

              {/* Decorative Character Images */}
              <div className="pointer-events-none absolute top-0 left-[350px]">
                {/* Character 1 - smaller, positioned left and slightly down */}
                <div className="absolute top-[16px] left-0 h-[75px] w-[66px]">
                  <Image
                    src="/our-story/default1.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {/* Character 2 - larger, positioned right and at top */}
                <div className="absolute top-0 left-[67px] h-[93px] w-[103px]">
                  <Image
                    src="/our-story/default2.png"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Decorative Cards */}
            <div className="relative h-[300px] w-[520px] shrink-0">
              {/* Purple rounded square - bottom left */}
              <div className="bg-primary-purple absolute top-[150px] left-0 h-[150px] w-[201px] rounded-[33px]" />

              {/* Mint rounded squares - top left */}
              <div className="bg-secondary-mint absolute top-0 left-0 h-[150px] w-[68px] rounded-[33px]" />
              <div className="bg-secondary-mint absolute top-0 left-[68px] h-[150px] w-[133px] rounded-[33px]" />

              {/* Navy card with button - right side */}
              <Link
                href="/about-us"
                className="bg-primary-navy absolute top-0 left-[201px] flex h-[300px] w-[319px] items-end justify-end overflow-hidden rounded-[32px] p-8 transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="https://res.cloudinary.com/davy7cgyi/image/upload/v1780289236/709e9afff06075a1e2577fb7c0eb39ca8ed4ced6_l9smol.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="319px"
                />
                <div
                  className="border-neutral-stroke relative z-10 flex size-[48px] shrink-0 items-center justify-center rounded-full border bg-white p-3"
                  aria-label="Learn more"
                >
                  <ArrowUpRight
                    className="text-primary-navy h-6 w-6"
                    strokeWidth={2}
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="flex flex-col gap-6 lg:hidden">
            <h2 className="text-primary-navy text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
              Our Story
            </h2>
            <p className="text-primary-navy-light text-xl leading-[32px] font-semibold sm:text-[24px]">
              Our Story Designed by Pet Parents, for Pet Parents
            </p>
            <p className="text-primary-navy text-base leading-[24px] font-medium sm:text-[20px]">
              We&apos;re guinea pig &amp; rabbit lovers creating products that
              make life easier, healthier, and happier for pets and their humans
            </p>

            {/* Simplified card for mobile */}
            <Link
              href="/about-us"
              className="bg-primary-navy relative flex min-h-[200px] items-end justify-end overflow-hidden rounded-[32px] p-6 transition-transform active:scale-[0.98]"
            >
              <Image
                src="https://res.cloudinary.com/davy7cgyi/image/upload/v1780289236/709e9afff06075a1e2577fb7c0eb39ca8ed4ced6_l9smol.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 319px"
              />
              <div className="border-neutral-stroke relative z-10 flex items-center justify-center rounded-full border bg-white p-3">
                <ArrowUpRight className="text-primary-navy h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "./AnimatedSection";
import { Button } from "@/components/ui/button";

const BOARDING_LOGO_IMAGE = "/Boarding Logo.png";
const BOARDING_PAGE_HREF = "/piggyway-boarding";

const SPARKLES = [
  { className: "left-[10%] top-[20%] h-6 w-6 text-white/95" },
  { className: "left-[20%] bottom-[15%] h-7 w-7 text-secondary-pink" },
  { className: "left-[30%] top-[10%] h-6 w-6 text-secondary-blue/65" },
  { className: "right-[30%] top-[25%] h-6 w-6 text-secondary-mint/80" },
  { className: "right-[15%] top-[15%] h-5 w-5 text-secondary-blue/55" },
  { className: "right-[25%] bottom-[20%] h-6 w-6 text-primary-purple/65" },
  { className: "right-[10%] bottom-[10%] h-5 w-5 text-secondary-mint/55" },
];

function Sparkle({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 1.5L14.92 9.08L22.5 12L14.92 14.92L12 22.5L9.08 14.92L1.5 12L9.08 9.08L12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BoardingBannerSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 pb-12 sm:pb-16 md:pb-20">
        <section className="relative overflow-hidden rounded-[32px] border-[12px] border-white shadow-[0_18px_48px_rgba(5,4,81,0.08)]">
          <Image
            src="/Boarding Banner.png"
            alt="Boarding Banner Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/10" />

          {SPARKLES.map((sparkle, idx) => (
            <Sparkle
              key={idx}
              className={`absolute ${sparkle.className} z-10`}
            />
          ))}

          <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center sm:px-12 sm:py-16">
            <Image
              src={BOARDING_LOGO_IMAGE}
              alt="Piggy Way Boarding"
              width={227}
              height={122}
              className="mb-6 h-auto w-[160px] sm:w-[200px] lg:w-[227px]"
            />

            <h2 className="text-large sm:text-large lg:text-h4 mb-4 leading-[36px] font-semibold tracking-tight text-[#405aab] sm:leading-[44px] lg:leading-[50px]">
              Guinea Pig Boarding in Melbourne 🐹
            </h2>

            <p className="text-primary-navy text-p-ui sm:text-p-ui mb-8 max-w-[600px] leading-[26px] font-normal sm:leading-[30px]">
              Thoughtful boarding &amp; care for guinea pigs, designed to feel
              like home.
            </p>

            <Button
              asChild
              variant="secondary"
              className="text-subtle h-[40px] rounded-full bg-[#dcd7ff] px-6 leading-6 font-medium text-[#1a327e] shadow-none transition-colors hover:bg-[#c8c1ff]"
            >
              <Link href={BOARDING_PAGE_HREF}>Book with us</Link>
            </Button>
          </div>

          {/* Decorative Images */}
          {/* {BOARDING_PHOTOS.map((photo, idx) => (
            <img
              key={idx}
              src={photo.src}
              alt={photo.alt}
              className={`${photo.className} z-20`}
            />
          ))} */}
        </section>
      </div>
    </AnimatedSection>
  );
}

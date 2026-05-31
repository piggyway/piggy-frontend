"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "./AnimatedSection";
import { Button } from "@/components/ui/button";

const BOARDING_LOGO_IMAGE = "/Boarding Logo.png";
const BOARDING_PAGE_HREF = "/piggyway-boarding";

const BOARDING_PHOTOS = [
  {
    src: "https://www.figma.com/api/mcp/asset/39584d36-cfc6-462d-94c9-5a2419dfe39c",
    alt: "Guinea pig",
    className:
      "absolute -left-6 -top-8 h-[140px] w-[140px] sm:h-[180px] sm:w-[180px] lg:h-[220px] lg:w-[220px] object-cover rounded-[50px_50px_50px_100px] shadow-lg",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/dd1f521b-dc63-4071-8e5d-38ffcff47d1d",
    alt: "Guinea pig eating",
    className:
      "absolute right-[15%] -top-6 h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] object-cover rounded-full shadow-lg",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/0ab37bc5-68ca-4050-9e44-b533032b7f34",
    alt: "Guinea pig portrait",
    className:
      "absolute left-[10%] -bottom-10 h-[100px] w-[100px] sm:h-[130px] sm:w-[130px] lg:h-[150px] lg:w-[150px] object-cover rounded-full shadow-lg",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/ebfb04c7-f0d6-43d1-9900-5d07a1e627a6",
    alt: "Guinea pig resting",
    className:
      "absolute right-[20%] -bottom-12 h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[180px] lg:w-[180px] object-cover rounded-[30px] shadow-lg",
  },
  {
    src: "https://www.figma.com/api/mcp/asset/39584d36-cfc6-462d-94c9-5a2419dfe39c", // Reusing an image as placeholder for the 5th
    alt: "Guinea pig tunnel",
    className:
      "absolute -right-6 top-[20%] h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] lg:h-[240px] lg:w-[240px] object-cover rounded-[50px_100px_50px_50px] shadow-lg",
  }
];

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

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[420px] px-6 py-12 sm:px-12 sm:py-16 text-center">
            <Image
              src={BOARDING_LOGO_IMAGE}
              alt="Piggy Way Boarding"
              width={227}
              height={122}
              className="h-auto w-[160px] sm:w-[200px] lg:w-[227px] mb-6"
            />

            <h2 className="text-[#405aab] text-[28px] leading-[36px] sm:text-[36px] sm:leading-[44px] lg:text-[42px] lg:leading-[50px] font-semibold mb-4 tracking-tight">
              Guinea Pig Boarding in Melbourne 🐹
            </h2>

            <p className="text-primary-navy max-w-[600px] text-[18px] leading-[26px] sm:text-[21px] sm:leading-[30px] font-normal mb-8">
              Thoughtful boarding &amp; care for guinea pigs, designed to feel
              like home.
            </p>

            <Button
              asChild
              variant="secondary"
              className="bg-[#dcd7ff] hover:bg-[#c8c1ff] text-[#1a327e] h-[40px] rounded-full px-6 text-[14px] leading-6 font-medium shadow-none transition-colors"
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

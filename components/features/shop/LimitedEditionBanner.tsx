"use client";

import { Button } from "@/components/ui/button";
import { AnimatedSection } from "../homepage/AnimatedSection";

export function LimitedEditionBanner() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Header */}
        <div className="mb-8">
          <p className="text-primary-navy mb-2 text-lg leading-relaxed sm:text-xl">
            Fresh finds made for the season
          </p>
          <h2 className="text-primary-navy-light text-[32px] leading-tight font-semibold sm:text-[42px]">
            Limited Edition
          </h2>
        </div>

        {/* Banner Container */}
        <div className="relative flex min-h-[280px] items-stretch gap-4 sm:min-h-[320px]">
          {/* Left Decorative Elements */}
          <div className="hidden w-32 shrink-0 flex-col gap-4 md:flex">
            {/* Light blue rectangle */}
            <div className="flex flex-1 items-center justify-center rounded-[28px] bg-[#e8eef7]">
              <div className="h-16 w-16 rounded-lg bg-white/50" />
            </div>
            {/* Pink rounded shape */}
            <div className="flex h-32 items-center justify-center rounded-[28px] bg-[#ffc0cb]">
              <div className="h-16 w-16 rounded-lg bg-white/50" />
            </div>
          </div>

          {/* Main Banner - Navy Blue */}
          <div className="bg-primary-navy relative flex flex-1 items-center justify-center overflow-hidden rounded-[28px]">
            {/* Decorative icon in center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="h-24 w-24 rounded-lg bg-white/20" />
            </div>

            {/* Shop now button */}
            <Button
              className="text-primary-navy hover:bg-neutral-background relative z-10 rounded-full bg-white px-8 py-6 text-lg font-medium"
              onClick={() => console.log("Navigate to limited edition")}
            >
              Shop now
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

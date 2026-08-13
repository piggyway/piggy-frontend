"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export function PoopHappensSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto flex max-w-[1160px] flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:items-end sm:justify-end sm:gap-10">
        <h2 className="text-lead sm:text-large text-center text-[#405aab] sm:mb-6 sm:text-right">
          Poop happens... We clean.
        </h2>
        <div className="relative h-[75px] w-[150px] sm:h-[107px] sm:w-[214px]">
          <Image
            src="/Group 367.svg"
            alt="Poop scoop and brush"
            fill
            className="object-contain"
          />
        </div>
      </section>
    </AnimatedSection>
  );
}

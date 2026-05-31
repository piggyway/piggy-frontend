"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export function PoopHappensSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-8 flex justify-end items-end gap-10">
        <h2 className="text-[#405aab] text-[24px] sm:text-[32px] leading-[40px] font-semibold mb-6">
          Poop happens... We clean.
        </h2>
        <div className="w-[150px] h-[75px] sm:w-[214px] sm:h-[107px] relative rounded-[20px] flex items-center justify-center shrink-0">
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

"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export function PoopHappensSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto flex max-w-[1160px] items-end justify-end gap-10 px-4 py-8">
        <h2 className="text-lead sm:text-large mb-6 leading-[40px] font-semibold text-[#405aab]">
          Poop happens... We clean.
        </h2>
        <div className="relative flex h-[75px] w-[150px] shrink-0 items-center justify-center rounded-[20px] sm:h-[107px] sm:w-[214px]">
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

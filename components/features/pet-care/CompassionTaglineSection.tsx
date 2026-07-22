"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { COMPASSION_TAGLINE, PET_CARE_ASSETS } from "./constants";

export function CompassionTaglineSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col items-end justify-end gap-6 sm:flex-row sm:items-end">
          <p className="text-primary-navy-light text-large sm:text-large leading-10 font-semibold">
            {COMPASSION_TAGLINE}
          </p>
          <Image
            src={PET_CARE_ASSETS.compassionLogo}
            alt=""
            width={214}
            height={107}
            className="h-auto w-[160px] shrink-0 sm:w-[214px]"
          />
        </div>
      </section>
    </AnimatedSection>
  );
}

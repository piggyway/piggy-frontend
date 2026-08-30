"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { HERO_CONTENT, PET_CARE_ASSETS } from "./constants";

export function HeroSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 pt-12 pb-4 sm:pt-16 md:pt-20">
        <div className="mx-auto flex max-w-[1158px] flex-col items-center gap-9 text-center">
          <span className="bg-primary-purple-light text-primary-navy rounded-[20px] px-4 py-2 text-sm font-normal">
            {HERO_CONTENT.badge}
          </span>

          <h1 className="text-primary-navy text-large sm:text-h3 leading-tight font-semibold tracking-[-0.288px] sm:leading-[48px]">
            {HERO_CONTENT.title}
          </h1>

          <div className="flex w-full min-w-0 items-center justify-center gap-3 sm:gap-10">
            <Image
              src={PET_CARE_ASSETS.piggywayLogo}
              alt="Piggy Way Boarding"
              width={227}
              height={122}
              className="h-auto w-[110px] sm:w-[170px] lg:w-[227px]"
            />
            <Image
              src={PET_CARE_ASSETS.cross}
              alt=""
              width={35}
              height={35}
              className="size-[22px] sm:size-[28px] lg:size-[35px]"
            />
            <div className="border-secondary-mint relative size-[110px] overflow-hidden rounded-full border-[6px] sm:size-[150px] lg:size-[199px]">
              <Image
                src={PET_CARE_ASSETS.doctorSupsLogo}
                alt="Doctor Sups Veterinary"
                fill
                className="object-cover"
                sizes="199px"
              />
            </div>
          </div>

          <div className="text-primary-navy text-p-ui sm:text-lead flex flex-col gap-0 leading-8">
            <p className="font-bold">{HERO_CONTENT.paragraphs[0]}</p>
            <p className="font-normal">{HERO_CONTENT.paragraphs[1]}</p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

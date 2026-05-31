"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  BOARDING_CTA_CONTENT,
  PET_CARE_ASSETS,
  PET_CARE_ROUTES,
} from "./constants";

export function BoardingCtaSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col items-center gap-10 rounded-[32px] border-[12px] border-white bg-white p-6 sm:p-10 lg:flex-row lg:p-[40px]">
          <div className="flex flex-1 flex-col justify-between gap-10 self-stretch">
            <h2 className="text-primary-navy text-[32px] leading-[40px] font-semibold tracking-[-0.21px] sm:text-[42px] sm:leading-[42px]">
              {BOARDING_CTA_CONTENT.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-primary-navy-light text-[20px] leading-8 font-semibold sm:text-[24px]">
                  {BOARDING_CTA_CONTENT.eyebrow}
                </p>
                <p className="text-primary-navy text-[20px] leading-8 font-normal sm:text-[24px]">
                  {BOARDING_CTA_CONTENT.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <Link
                href={PET_CARE_ROUTES.contact}
                className="bg-primary-purple text-primary-navy flex items-center gap-2 rounded-[20px] px-4 py-2 text-sm font-normal transition-colors hover:bg-primary-purple/80"
              >
                <span>{BOARDING_CTA_CONTENT.buttonLabel}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[501/347] w-full max-w-[501px] shrink-0 overflow-hidden rounded-[32px] lg:w-[501px]">
            <Image
              src={PET_CARE_ASSETS.boardingCollage1}
              alt="Guinea pig boarding"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 501px, 100vw"
            />
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

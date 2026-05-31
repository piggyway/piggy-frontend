"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  MEET_DR_SUPS_CONTENT,
  PET_CARE_ASSETS,
  PET_CARE_ROUTES,
} from "./constants";

export function MeetDrSupsSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="relative overflow-hidden rounded-[32px] bg-white p-6 sm:p-10 lg:p-16">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
              <div className="flex flex-1 flex-col gap-10">
                <div className="flex items-start gap-6">
                  <div className="border-secondary-mint relative size-[86px] shrink-0 overflow-hidden rounded-full border-[4px]">
                    <Image
                      src={PET_CARE_ASSETS.doctorSupsLogo}
                      alt="Doctor Sups Veterinary"
                      fill
                      className="object-cover"
                      sizes="86px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-primary-navy text-[20px] leading-8 font-normal sm:text-[24px]">
                      {MEET_DR_SUPS_CONTENT.eyebrow}
                    </p>
                    <h2 className="text-primary-navy-light text-[32px] leading-9 font-semibold tracking-[-0.21px] sm:text-[42px] sm:leading-[42px]">
                      {MEET_DR_SUPS_CONTENT.title}
                    </h2>
                  </div>
                </div>

                <div className="text-primary-navy flex flex-col gap-6 text-[20px] leading-8 font-normal sm:text-[24px]">
                  {MEET_DR_SUPS_CONTENT.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-6">
                <div className="relative size-[260px] overflow-hidden rounded-full border-[12px] border-white sm:size-[320px] lg:size-[350px]">
                  <Image
                    src={PET_CARE_ASSETS.drSupsPhoto}
                    alt="Dr. Supanee"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 350px, (min-width: 640px) 320px, 260px"
                  />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-primary-navy-light text-[20px] leading-8 font-semibold sm:text-[24px]">
                    {MEET_DR_SUPS_CONTENT.photoCaptionName}
                  </p>
                  <p className="text-primary-navy text-[20px] leading-6 font-medium">
                    {MEET_DR_SUPS_CONTENT.photoCaptionCredentials.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Image
                src={PET_CARE_ASSETS.vetSupportIcon}
                alt=""
                width={31}
                height={28}
                className="h-7 w-[31px] shrink-0 object-contain"
              />
              <p className="text-primary-navy flex-1 text-[20px] leading-8 font-semibold sm:text-[24px]">
                {MEET_DR_SUPS_CONTENT.footerPrompt}
              </p>
              <Link
                href={PET_CARE_ROUTES.drSupsBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-purple text-primary-navy flex shrink-0 items-center gap-2 rounded-[20px] px-4 py-2 text-sm font-normal transition-colors hover:bg-primary-purple/80"
              >
                <span>{MEET_DR_SUPS_CONTENT.footerButtonLabel}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

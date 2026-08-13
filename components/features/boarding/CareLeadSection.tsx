"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ASSETS, CARE_LEAD_CONTENT } from "./constants";

export function CareLeadSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="relative overflow-hidden rounded-[32px] bg-white p-6 sm:p-10 lg:p-[40px]">
          <div className="grid items-start gap-[40px] lg:grid-cols-[1fr_350px]">
            <div className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[8px]">
                <p className="text-lead font-normal text-[#050451]">
                  {CARE_LEAD_CONTENT.eyebrow}
                </p>
                <h2 className="text-large sm:text-h4 tracking-[-0.21px] text-[#405aab]">
                  {CARE_LEAD_CONTENT.title}
                </h2>
              </div>

              <div className="text-p-ui sm:text-lead space-y-[32px] font-normal text-[#050451]">
                {CARE_LEAD_CONTENT.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p className="font-semibold">
                  &quot;{CARE_LEAD_CONTENT.quote}&quot;
                </p>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-[350px] flex-col items-center gap-[24px]">
              <div className="relative mx-auto h-[260px] w-[260px] overflow-hidden rounded-full border-[12px] border-white bg-gray-100 shadow-sm sm:h-[320px] sm:w-[320px] lg:h-[350px] lg:w-[350px]">
                <Image
                  src={BOARDING_ASSETS.careLeadImage}
                  alt={CARE_LEAD_CONTENT.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 350px, (min-width: 640px) 320px, 260px"
                />
              </div>
              <div className="flex flex-col gap-[8px] text-center">
                <p className="text-lead text-[#405aab]">
                  {CARE_LEAD_CONTENT.name}
                </p>
                <p className="text-p-ui text-[#050451]">
                  {CARE_LEAD_CONTENT.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

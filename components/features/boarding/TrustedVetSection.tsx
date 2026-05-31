"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ASSETS, BOARDING_ROUTES } from "./constants";

export function TrustedVetSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 pt-10 pb-16 sm:pt-12 sm:pb-20">
        <div className="rounded-[32px] border-[12px] border-white bg-white p-6 sm:p-10 flex flex-col lg:flex-row gap-10 items-center">
          
          <div className="flex flex-col flex-1 h-full min-h-[300px] justify-between">
            <h2 className="text-[#050451] text-[36px] leading-[40px] font-semibold tracking-[-0.21px] sm:text-[42px] sm:leading-[42px]">
              Looking for a trusted vet?
            </h2>
            
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex flex-col gap-2">
                <p className="text-[#405aab] text-[24px] leading-[32px] font-semibold">
                  Our Trusted Veterinary Partner 💜
                </p>
                <p className="text-[#050451] text-[24px] leading-[32px] font-normal">
                  We&apos;re proud to partner with Dr. Supanee, an experienced unusual pets veterinarian, helping support the care behind our guinea pig boarding.
                </p>
              </div>
              
              <Link
                href={BOARDING_ROUTES.story} // Update this link if needed
                className="bg-[#dcd7ff] text-[#050451] flex items-center justify-center gap-2 px-6 py-3 rounded-full w-fit hover:bg-[#c8c1ff] transition-colors"
              >
                <span className="text-[16px] leading-[24px] font-normal">Pet care</span>
                <div className="w-5 h-5 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[501/347] w-full max-w-[420px] shrink-0 lg:w-[420px]">
            <Image
              src={BOARDING_ASSETS.trustedVetImage}
              alt="Our trusted veterinary partner"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 420px, 100vw"
            />
          </div>

        </div>
      </section>
    </AnimatedSection>
  );
}

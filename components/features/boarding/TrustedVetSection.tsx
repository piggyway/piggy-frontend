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
        <div className="flex flex-col items-center gap-10 rounded-[32px] border-[12px] border-white bg-white p-6 sm:p-10 lg:flex-row">
          <div className="flex h-full min-h-[300px] flex-1 flex-col justify-between">
            <h2 className="text-large sm:text-h4 leading-[40px] font-semibold tracking-[-0.21px] text-[#050451] sm:leading-[42px]">
              Looking for a trusted vet?
            </h2>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-lead leading-[32px] font-semibold text-[#405aab]">
                  Our Trusted Veterinary Partner 💜
                </p>
                <p className="text-lead leading-[32px] font-normal text-[#050451]">
                  We&apos;re proud to partner with Dr. Supanee, an experienced
                  unusual pets veterinarian, helping support the care behind our
                  guinea pig boarding.
                </p>
              </div>

              <Link
                href={BOARDING_ROUTES.story} // Update this link if needed
                className="flex w-fit items-center justify-center gap-2 rounded-full bg-[#dcd7ff] px-6 py-3 text-[#050451] transition-colors hover:bg-[#c8c1ff]"
              >
                <span className="text-p leading-[24px] font-normal">
                  Pet care
                </span>
                <div className="flex h-5 w-5 items-center justify-center">
                  <ArrowUpRight className="h-4 w-4" />
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

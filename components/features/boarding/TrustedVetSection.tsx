"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ASSETS, BOARDING_ROUTES } from "./constants";

export function TrustedVetSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 pt-10 pb-16 sm:pt-12 sm:pb-20">
        <div className="flex flex-col items-center gap-10 rounded-[32px] bg-white p-6 sm:p-10 lg:flex-row">
          <div className="flex h-full min-h-[300px] flex-1 flex-col justify-center">
            <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
              Looking for a trusted vet?
            </h2>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-p-ui sm:text-lead text-primary-navy-light font-semibold">
                  Our Trusted Veterinary Partner 💜
                </p>
                <p className="text-p-ui sm:text-lead text-primary-navy font-normal">
                  We&apos;re proud to partner with Dr. Supanee, an experienced
                  unusual pets veterinarian, helping support the care behind our
                  guinea pig boarding.
                </p>
              </div>

              <Button
                asChild
                variant="secondary"
                className="text-p h-12 w-fit px-6 font-semibold shadow-none has-[>svg]:px-6"
              >
                <Link href={BOARDING_ROUTES.story}>
                  Pet care
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
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

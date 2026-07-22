"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ASSETS, BOARDING_ROUTES } from "./constants";

export function HeroIntroSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 pt-12 pb-4 sm:pt-16 md:pt-20 lg:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-primary-navy-light text-large sm:text-h4 leading-[38px] font-semibold tracking-[-0.21px] sm:leading-[42px]">
            Guinea Pig Boarding in Melbourne 🐹
          </h1>
          <p className="text-primary-navy text-large sm:text-h4 mt-2 leading-[34px] font-semibold sm:leading-[42px]">
            Thoughtful boarding and care for guinea pigs, designed to feel like
            home.
          </p>
        </div>

        <div className="relative mt-10 h-[280px] overflow-hidden rounded-[32px] border-[6px] border-white bg-white sm:h-[320px] lg:h-[310px]">
          <Image
            src={BOARDING_ASSETS.heroBackground}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1160px, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/48 via-white/18 to-transparent" />

          <div className="relative z-10 flex h-full items-center justify-start px-5 sm:px-8 lg:px-10">
            <div className="flex w-full max-w-[800px] flex-row items-center justify-start gap-5 sm:gap-6 lg:gap-10">
              <Image
                src={BOARDING_ASSETS.heroLogo}
                alt="Piggy Way Boarding"
                width={227}
                height={122}
                className="h-auto w-[142px] shrink-0 sm:w-[158px] lg:w-[178px]"
                sizes="(min-width: 1024px) 178px, (min-width: 640px) 158px, 142px"
              />

              <div className="flex max-w-[420px] flex-col items-start text-left">
                <p className="text-primary-navy text-p-ui sm:text-p-ui lg:text-lead leading-[28px] font-normal sm:leading-[30px] lg:leading-[31px]">
                  Thoughtful boarding &amp; care for guinea pigs, designed to
                  feel like home.
                </p>

                <Button
                  asChild
                  variant="secondary"
                  className="mt-4 h-9 px-4 text-sm font-normal shadow-none"
                >
                  <Link href={BOARDING_ROUTES.book}>Book with us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

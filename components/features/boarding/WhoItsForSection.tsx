"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ASSETS, WHO_ITS_FOR_ITEMS } from "./constants";

export function WhoItsForSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-10 rounded-[32px] bg-white p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
            <div className="flex flex-col gap-2">
              <h2 className="text-large sm:text-h4 leading-[38px] font-semibold tracking-[-0.21px] text-[#405aab] sm:leading-[42px]">
                Who It&apos;s For
              </h2>
              <p className="text-primary-navy text-xl leading-8 font-normal sm:text-2xl">
                Find out if our guinea pig boarding in Melbourne is the right
                fit for your little ones.
              </p>
            </div>
            <div className="relative h-[42px] w-[62px] shrink-0">
              <Image
                src={BOARDING_ASSETS.whoItsForIcon}
                alt="Guinea pig icon"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {WHO_ITS_FOR_ITEMS.map((item, index) => (
              <article
                key={index}
                className={`${item.colorClass} flex h-[190px] flex-col gap-5 rounded-[28px] p-6`}
              >
                <div className="flex items-center">
                  <h3 className="text-p-ui sm:text-lead leading-[28px] font-semibold text-[#050451] sm:leading-[32px]">
                    {item.title}
                  </h3>
                </div>
                <div className="flex flex-1 items-end">
                  <p className="text-body-medium sm:text-p leading-[24px] font-normal text-[#050451]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ASSETS, WHO_ITS_FOR_ITEMS } from "./constants";

export function WhoItsForSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[#405aab] text-[32px] leading-[38px] font-semibold tracking-[-0.21px] sm:text-[42px] sm:leading-[42px]">
                Who It&apos;s For
              </h2>
              <p className="text-primary-navy text-xl leading-8 font-normal sm:text-2xl">
                Find out if our guinea pig boarding is the right fit for your little ones.
              </p>
            </div>
            <div className="h-[42px] w-[62px] relative shrink-0">
              <Image 
                src={BOARDING_ASSETS.whoItsForIcon} 
                alt="Guinea pig icon" 
                fill 
                className="object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHO_ITS_FOR_ITEMS.map((item, index) => (
              <article
                key={index}
                className={`${item.colorClass} flex flex-col gap-5 h-[190px] p-6 rounded-[28px]`}
              >
                <div className="flex items-center">
                  <h3 className="text-[#050451] text-[20px] sm:text-[24px] font-semibold leading-[28px] sm:leading-[32px]">
                    {item.title}
                  </h3>
                </div>
                <div className="flex-1 flex items-end">
                  <p className="text-[#050451] text-[14px] sm:text-[16px] font-normal leading-[24px]">
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

"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { VET_EXPERTISE_CONTENT, VET_EXPERTISE_ITEMS } from "./constants";

export function VetExpertiseSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-primary-navy-light text-large sm:text-large leading-9 font-semibold sm:leading-10">
              {VET_EXPERTISE_CONTENT.title}
            </h2>
            <p className="text-primary-navy text-p-ui sm:text-lead leading-8 font-normal">
              {VET_EXPERTISE_CONTENT.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:gap-y-16">
            {VET_EXPERTISE_ITEMS.map((item) => (
              <article key={item.title} className="flex items-start gap-5">
                <div
                  className={`flex size-[90px] shrink-0 items-center justify-center rounded-[28px] p-6 ${item.iconBgClass}`}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={42}
                    height={42}
                    className="size-[42px] object-contain"
                  />
                </div>
                <div className="text-primary-navy flex flex-1 flex-col gap-2">
                  <h3 className="text-p-ui sm:text-lead leading-8 font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-p leading-6 font-normal">
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

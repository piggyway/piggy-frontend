"use client";

import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { WHO_ITS_FOR_ITEMS } from "./constants";

export function WhoItsForSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-10 rounded-[32px] bg-white p-6 sm:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
              Who It&apos;s For
            </h2>
            <p className="text-primary-navy text-p-ui sm:text-lead font-normal">
              Find out if our guinea pig boarding in Melbourne is the right fit
              for your little ones.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {WHO_ITS_FOR_ITEMS.map((item, index) => (
              <article
                key={index}
                className={`${item.colorClass} flex h-full flex-col gap-2 rounded-[28px] p-6 md:min-h-[190px]`}
              >
                <div className="flex items-center">
                  <h3 className="text-p-ui sm:text-lead text-primary-navy font-semibold">
                    {item.title}
                  </h3>
                </div>
                <p className="text-p text-primary-navy">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

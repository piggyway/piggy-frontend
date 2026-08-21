"use client";

import { Check } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  BOARDING_INCLUSIONS_CONTENT,
  BOARDING_RATES_CONTENT,
} from "./constants";

export function RatesAndInclusionsSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-10 rounded-[32px] bg-white p-6 sm:p-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
                {BOARDING_RATES_CONTENT.title}
              </h2>
              <p className="text-primary-navy text-p-ui sm:text-lead font-normal">
                {BOARDING_RATES_CONTENT.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {BOARDING_RATES_CONTENT.rates.map((rate) => (
                <div
                  key={rate.label}
                  className="bg-primary-purple-light flex flex-col items-start gap-2 rounded-[28px] p-6"
                >
                  <p className="text-primary-navy text-p font-normal">
                    {rate.label}
                  </p>
                  <p className="text-primary-navy text-large">
                    {rate.price}
                    <span className="text-p ml-1 font-normal">{rate.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <ul className="flex flex-col gap-3">
              {BOARDING_RATES_CONTENT.notes.map((note) => (
                <li
                  key={note}
                  className="text-primary-navy text-p-ui sm:text-lead flex items-start gap-3"
                >
                  <span className="bg-primary-gold mt-2 h-2 w-2 shrink-0 rounded-full sm:mt-3" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
                {BOARDING_INCLUSIONS_CONTENT.title}
              </h2>
              <p className="text-primary-navy text-p-ui sm:text-lead font-normal">
                {BOARDING_INCLUSIONS_CONTENT.lead}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {BOARDING_INCLUSIONS_CONTENT.groups.map((group) => (
                <article
                  key={group.title}
                  className={`${group.colorClass} flex h-full flex-col gap-4 rounded-[28px] p-6`}
                >
                  <h3 className="text-p-ui sm:text-lead text-primary-navy font-semibold">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-primary-navy text-p-ui sm:text-lead flex items-start gap-3"
                      >
                        <Check className="text-primary-navy-light mt-1 h-4 w-4 shrink-0 sm:mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

"use client";

import { Check } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  ADDITIONAL_SERVICES_CONTENT,
  PICKUP_DROPOFF_CONTENT,
} from "./constants";

export function PickupAndServicesSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-[32px] bg-white p-6 sm:p-10">
            <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
              {PICKUP_DROPOFF_CONTENT.title}
            </h2>
            <div className="text-primary-navy text-p-ui sm:text-lead space-y-4 font-normal">
              {PICKUP_DROPOFF_CONTENT.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[32px] bg-white p-6 sm:p-10">
            <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
              {ADDITIONAL_SERVICES_CONTENT.title}
            </h2>
            <p className="text-primary-navy text-p-ui sm:text-lead font-normal">
              {ADDITIONAL_SERVICES_CONTENT.lead}
            </p>

            <div className="bg-neutral-pink-background flex flex-col gap-4 rounded-[28px] p-6">
              <p className="text-p-ui sm:text-lead text-primary-navy font-semibold">
                {ADDITIONAL_SERVICES_CONTENT.listIntro}
              </p>
              <ul className="flex flex-col gap-3">
                {ADDITIONAL_SERVICES_CONTENT.items.map((item) => (
                  <li
                    key={item}
                    className="text-primary-navy text-p-ui sm:text-lead flex items-start gap-3"
                  >
                    <Check className="text-primary-navy-light mt-1 h-4 w-4 shrink-0 sm:mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-primary-navy text-p-ui sm:text-lead font-normal">
              {ADDITIONAL_SERVICES_CONTENT.closing}
            </p>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

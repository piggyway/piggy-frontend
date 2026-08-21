"use client";

import { Check } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  MEDICAL_BOARDING_CONTENT,
  VETERINARY_SUPPORT_CONTENT,
} from "./constants";

export function MedicalBoardingSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-10 rounded-[32px] bg-white p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
              {MEDICAL_BOARDING_CONTENT.title}
            </h2>

            <div className="text-primary-navy text-p-ui sm:text-lead space-y-4 font-normal">
              {MEDICAL_BOARDING_CONTENT.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="bg-secondary-mint flex flex-col gap-4 rounded-[28px] p-6">
              <p className="text-p-ui sm:text-lead text-primary-navy font-semibold">
                {MEDICAL_BOARDING_CONTENT.listIntro}
              </p>
              <ul className="flex flex-col gap-3">
                {MEDICAL_BOARDING_CONTENT.items.map((item) => (
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

            <div className="text-primary-navy text-p-ui sm:text-lead space-y-4 font-normal">
              {MEDICAL_BOARDING_CONTENT.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>

          <div className="bg-primary-purple-light flex flex-col gap-4 rounded-[28px] p-6 sm:p-8">
            <h2 className="text-lead sm:text-large text-primary-navy-light tracking-[-0.21px]">
              {VETERINARY_SUPPORT_CONTENT.title}
            </h2>
            <div className="text-primary-navy text-p-ui sm:text-lead space-y-4 font-normal">
              {VETERINARY_SUPPORT_CONTENT.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

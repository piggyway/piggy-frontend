"use client";

import { Button } from "@/components/ui/button";
import { AnimatedSection } from "./AnimatedSection";

export function CTASection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-8 sm:py-12">
        {/* Desktop Layout */}
        <div className="hidden items-center justify-center gap-6 lg:flex">
          {/* Pink Button */}
          <Button
            size="lg"
            className="bg-secondary-pink hover:bg-secondary-pink/90 h-[60px] min-w-[240px] rounded-full px-10 py-6 text-[18px] font-semibold text-white"
          >
            Book a Piggy Pop-up
          </Button>

          {/* Gray Square Placeholder */}
          <div className="bg-neutral-grey-background flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-[24px]">
            <span className="text-primary-navy/40 text-xs">Placeholder</span>
          </div>

          {/* Gold Button */}
          <Button
            size="lg"
            className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 h-[60px] min-w-[240px] rounded-full px-10 py-6 text-[18px] font-semibold"
          >
            Loved by Our Piggies
          </Button>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col items-stretch gap-4 lg:hidden">
          <Button
            size="lg"
            className="bg-secondary-pink hover:bg-secondary-pink/90 rounded-full px-8 py-6 text-base font-semibold text-white"
          >
            Book a Piggy Pop-up
          </Button>
          <Button
            size="lg"
            className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 rounded-full px-8 py-6 text-base font-semibold"
          >
            Loved by Our Piggies
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}

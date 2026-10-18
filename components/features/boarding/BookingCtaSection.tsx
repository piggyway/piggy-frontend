"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { BOARDING_ROUTES } from "./constants";

export function BookingCtaSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 pb-16 sm:pb-20">
        <div className="flex flex-col items-center gap-6 rounded-[32px] bg-white p-6 text-center sm:p-10">
          <h2 className="text-large sm:text-h4 text-primary-navy-light tracking-[-0.21px]">
            Ready to book a stay?
          </h2>
          <Button
            asChild
            variant="secondary"
            className="text-p h-12 px-6 font-semibold shadow-none"
          >
            <Link href={BOARDING_ROUTES.book}>Book a stay</Link>
          </Button>
        </div>
      </section>
    </AnimatedSection>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BOARDING_HERO_BOOK_BUTTON_ID,
  BOARDING_RATES_CONTENT,
  BOARDING_ROUTES,
} from "./constants";

export function StickyBookingBar() {
  const [isHeroButtonVisible, setIsHeroButtonVisible] = useState(true);

  useEffect(() => {
    const heroButton = document.getElementById(BOARDING_HERO_BOOK_BUTTON_ID);
    if (!heroButton) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsHeroButtonVisible(entry.isIntersecting);
    });
    observer.observe(heroButton);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "border-neutral-stroke sticky bottom-0 z-40 flex items-center justify-between gap-4 border-t bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-all duration-300 md:hidden",
        isHeroButtonVisible
          ? "invisible translate-y-full"
          : "visible translate-y-0"
      )}
    >
      <p className="text-primary-navy text-p-ui font-semibold">
        From ${BOARDING_RATES_CONTENT.rates[0].amount}/day
      </p>
      <Button
        asChild
        variant="secondary"
        className="text-p h-12 px-6 font-semibold shadow-none"
      >
        <Link href={BOARDING_ROUTES.book}>Book a stay</Link>
      </Button>
    </div>
  );
}

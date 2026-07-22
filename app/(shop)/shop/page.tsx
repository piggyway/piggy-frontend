import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/features/shop/HeroSection";
import { BestSellingSection } from "@/components/features/shop/BestSellingSection";
import { LimitedEditionBanner } from "@/components/features/shop/LimitedEditionBanner";
import { FeaturedPicksSection } from "@/components/features/shop/FeaturedPicksSection";
import { TestimonialsSection } from "@/components/features/shop/TestimonialsSection";
import { StarterKitsSection } from "@/components/features/shop/StarterKitsSection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

// ISR: refresh server-fetched sections (featured picks) without a redeploy
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse best sellers, featured picks and starter kits for guinea pigs and rabbits at Piggy Way Crossing.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={2} />
      <HeroSection />
      <BestSellingSection />
      <LimitedEditionBanner />
      <FeaturedPicksSection />
      <div className="py-12 sm:py-16 md:py-20">
        <TestimonialsSection />
      </div>
      <Suspense fallback={<div className="h-[400px]" />}>
        <StarterKitsSection />
      </Suspense>
    </div>
  );
}

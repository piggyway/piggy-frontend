import { Suspense } from "react";
import { HeroSection } from "@/components/features/shop/HeroSection";
import { BestSellingSection } from "@/components/features/shop/BestSellingSection";
import { LimitedEditionBanner } from "@/components/features/shop/LimitedEditionBanner";
import { FeaturedPicksSection } from "@/components/features/shop/FeaturedPicksSection";
import { TestimonialsSection } from "@/components/features/shop/TestimonialsSection";
import { StarterKitsSection } from "@/components/features/shop/StarterKitsSection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export default function ShopPage() {
  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={2} />
      <HeroSection />
      <BestSellingSection />
      <LimitedEditionBanner />
      <FeaturedPicksSection />
      <TestimonialsSection />
      <Suspense fallback={<div className="h-[400px]" />}>
        <StarterKitsSection />
      </Suspense>
    </div>
  );
}

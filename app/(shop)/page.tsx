import type { Metadata } from "next";
import { HeroSection } from "@/components/features/homepage/HeroSection";
import { BoardingBannerSection } from "@/components/features/homepage/BoardingBannerSection";
import { ShopByCategorySection } from "@/components/features/homepage/ShopByCategorySection";
import { PetCareTipsSection } from "@/components/features/homepage/PetCareTipsSection";
import { StarterKitsSection } from "@/components/features/homepage/StarterKitsSection";
import { TestimonialsSection } from "@/components/features/homepage/TestimonialsSection";
import { WhyShopSection } from "@/components/features/homepage/WhyShopSection";
import { OurStorySection } from "@/components/features/homepage/OurStorySection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
// import { WelcomeMessage } from "@/components/features/homepage/WelcomeMessage";
import { FirstLoginRedirect } from "@/components/features/auth/FirstLoginRedirect";

// ISR: refresh server-fetched sections (categories) without a redeploy
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <FirstLoginRedirect />
      <BackgroundBlobs variant={1} />
      {/* <WelcomeMessage /> */}
      <HeroSection />
      <BoardingBannerSection />
      <ShopByCategorySection />
      <PetCareTipsSection />
      {/* <StarterKitsSection /> */}
      <TestimonialsSection />
      <WhyShopSection />
      <OurStorySection />
    </div>
  );
}

import { HeroSection } from "@/components/features/homepage/HeroSection";
import { ShopByCategorySection } from "@/components/features/homepage/ShopByCategorySection";
import { PetCareTipsSection } from "@/components/features/homepage/PetCareTipsSection";
import { StarterKitsSection } from "@/components/features/homepage/StarterKitsSection";
import { TestimonialsSection } from "@/components/features/homepage/TestimonialsSection";
import { WhyShopSection } from "@/components/features/homepage/WhyShopSection";
import { OurStorySection } from "@/components/features/homepage/OurStorySection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export default function Home() {
  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={1} />
      <HeroSection />
      <ShopByCategorySection />
      <PetCareTipsSection />
      <StarterKitsSection />
      <TestimonialsSection />
      <WhyShopSection />
      <OurStorySection />
    </div>
  );
}

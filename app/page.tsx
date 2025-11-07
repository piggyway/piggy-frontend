import { HeroSection } from '@/components/features/homepage/HeroSection';
import { ShopByCategorySection } from '@/components/features/homepage/ShopByCategorySection';
import { PetCareTipsSection } from '@/components/features/homepage/PetCareTipsSection';
import { StarterKitsSection } from '@/components/features/homepage/StarterKitsSection';
import { TestimonialsSection } from '@/components/features/homepage/TestimonialsSection';
import { WhyShopSection } from '@/components/features/homepage/WhyShopSection';
import { CTASection } from '@/components/features/homepage/CTASection';
import { OurStorySection } from '@/components/features/homepage/OurStorySection';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-background-light">
      <HeroSection />
      <ShopByCategorySection />
      <PetCareTipsSection />
      <StarterKitsSection />
      <TestimonialsSection />
      <WhyShopSection />
      {/* <CTASection /> */}
      <OurStorySection />
    </div>
  );
}

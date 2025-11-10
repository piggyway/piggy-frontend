'use client';

import { Button } from '@/components/ui/button';
import { AnimatedSection } from './AnimatedSection';

export function CTASection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-[1160px]">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center gap-6">
          {/* Pink Button */}
          <Button
            size="lg"
            className="bg-secondary-pink text-white hover:bg-secondary-pink/90 rounded-full px-10 py-6 text-[18px] font-semibold h-[60px] min-w-[240px]"
          >
            Book a Piggy Pop-up
          </Button>

          {/* Gray Square Placeholder */}
          <div className="w-[100px] h-[100px] bg-neutral-grey-background rounded-[24px] flex items-center justify-center shrink-0">
            <span className="text-xs text-primary-navy/40">Placeholder</span>
          </div>

          {/* Gold Button */}
          <Button
            size="lg"
            className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 rounded-full px-10 py-6 text-[18px] font-semibold h-[60px] min-w-[240px]"
          >
            Loved by Our Piggies
          </Button>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col items-stretch gap-4">
          <Button
            size="lg"
            className="bg-secondary-pink text-white hover:bg-secondary-pink/90 rounded-full px-8 py-6 text-base font-semibold"
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

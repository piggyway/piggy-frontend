'use client';

import { Button } from '@/components/ui/button';
import { AnimatedSection } from '../homepage/AnimatedSection';

export function LimitedEditionBanner() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Header */}
        <div className="mb-8">
          <p className="text-lg sm:text-xl text-primary-navy leading-relaxed mb-2">
            Fresh finds made for the season
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-tight">
            Limited Edition
          </h2>
        </div>

        {/* Banner Container */}
        <div className="relative flex gap-4 items-stretch min-h-[280px] sm:min-h-[320px]">
          {/* Left Decorative Elements */}
          <div className="hidden md:flex flex-col gap-4 w-32 shrink-0">
            {/* Light blue rectangle */}
            <div className="flex-1 bg-[#e8eef7] rounded-[28px] flex items-center justify-center">
              <div className="w-16 h-16 bg-white/50 rounded-lg" />
            </div>
            {/* Pink rounded shape */}
            <div className="h-32 bg-[#ffc0cb] rounded-[28px] flex items-center justify-center">
              <div className="w-16 h-16 bg-white/50 rounded-lg" />
            </div>
          </div>

          {/* Main Banner - Navy Blue */}
          <div className="flex-1 bg-primary-navy rounded-[28px] flex items-center justify-center relative overflow-hidden">
            {/* Decorative icon in center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-24 h-24 bg-white/20 rounded-lg" />
            </div>

            {/* Shop now button */}
            <Button
              className="bg-white text-primary-navy hover:bg-neutral-background rounded-full px-8 py-6 text-lg font-medium relative z-10"
              onClick={() => console.log('Navigate to limited edition')}
            >
              Shop now
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

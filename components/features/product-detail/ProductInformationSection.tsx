'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatedSection } from '../homepage/AnimatedSection';
import { cn } from '@/lib/utils';

const productFeatures = [
  { title: 'Washable & reusable liner', description: 'Easy to clean, eco-friendly, and cost-saving' },
  { title: 'Soft & comfy surface', description: 'Gentle on guinea pig & rabbit paws, adds daily comfort' },
  { title: 'Multi-layer absorbent', description: 'Keeps cages dry, reduces cleaning time' },
  { title: 'Washable & reusable liner', description: 'easy to clean, eco-friendly, and cost-saving' },
  { title: 'Perfect fit for C&C cages', description: 'Designed for guinea pig & rabbit housing systems' },
  { title: 'Eco-conscious alternative', description: 'Reduces disposable bedding waste and saves money' },
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/20 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:bg-white/5 transition-colors px-4 -mx-4 rounded-lg"
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-primary-navy" />
          ) : (
            <ChevronDown className="w-5 h-5 text-primary-navy" />
          )}
        </div>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        )}
      >
        <div className="text-white/90 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function ProductInformationSection() {
  return (
    <AnimatedSection className="w-full py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-[1160px]">
        {/* Rounded Navy Container */}
        <div className="bg-primary-navy rounded-[28px] p-8 sm:p-10 md:p-12">
          <h2 className="text-[28px] sm:text-[32px] font-semibold text-primary-gold mb-8">
            Product Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Collapsible Sections */}
            <div className="space-y-2">
              <CollapsibleSection title="Product Features" defaultOpen>
                <div className="space-y-4">
                  {productFeatures.map((feature, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-white/80 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Specifications">
                <div className="space-y-2 text-sm">
                  <p><strong>Material:</strong> Soft fleece top layer, absorbent core, waterproof base</p>
                  <p><strong>Sizes Available:</strong> Small, Medium, Large</p>
                  <p><strong>Care Instructions:</strong> Machine washable, tumble dry low</p>
                  <p><strong>Colors:</strong> Mint, Piggy Party, Baby Blue, Navy</p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="How to Use / Care Instructions">
                <div className="space-y-2 text-sm">
                  <p><strong>Installation:</strong> Place liner in cage, smooth out wrinkles</p>
                  <p><strong>Daily Care:</strong> Spot clean as needed, shake off debris</p>
                  <p><strong>Washing:</strong> Machine wash cold, mild detergent, no fabric softener</p>
                  <p><strong>Drying:</strong> Tumble dry on low or hang to dry</p>
                  <p><strong>Storage:</strong> Store clean and dry when not in use</p>
                </div>
              </CollapsibleSection>
            </div>

            {/* Right: Image Placeholder */}
            <div className="hidden lg:block">
              <div className="w-full aspect-square rounded-[28px] bg-secondary-mint flex items-center justify-center">
                <div className="w-32 h-32 bg-white/30 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

'use client';

import Image from 'next/image';
import { FeaturedCard } from '@/components/ui/featured-card';
import { AnimatedSection } from '../homepage/AnimatedSection';

export function BestSellingSection() {
  const categories = [
    {
      id: 1,
      title: 'Liners',
      image: '/homepage-essentials/liner-example.png',
      bgColor: 'bg-neutral-pink-background',
    },
    {
      id: 2,
      title: 'Hut',
      image: '/homepage-essentials/hut-example.png',
      bgColor: 'bg-secondary-mint',
    },
    {
      id: 3,
      title: 'Combos',
      image: '/homepage-essentials/combo-example.png',
      bgColor: 'bg-primary-gold',
    },
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Header with Piggy Icon */}
        <div className="flex items-start justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-[20px] sm:text-[24px] font-normal text-primary-navy leading-[32px] mb-2">
              Our best 😊
            </p>
            <p className="text-lg text-primary-navy leading-relaxed max-w-2xl">
              Happy piggies & bunnies start here – cozy huts, tasty snacks, and everyday care made with love for little paws.
            </p>
          </div>
          {/* Decorative Piggy Icon */}
          <div className="hidden lg:block ml-8">
            <div className="w-20 h-20 relative">
              <Image
                src="/homepage-essentials/piggy-icon.png"
                alt="Piggy mascot"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <FeaturedCard
              key={category.id}
              title={category.title}
              image={category.image}
              className={category.bgColor}
              onClick={() => console.log(`Navigate to ${category.title}`)}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

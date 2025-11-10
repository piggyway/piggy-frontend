'use client';

import { Dog, Cat, Rabbit, Bird, Mouse } from 'lucide-react';
import { AnimatedSection } from '../homepage/AnimatedSection';

const pets = [
  { id: 'dog', name: 'Dog', icon: Dog, bgColor: 'bg-secondary-mint' },
  { id: 'cat', name: 'Cat', icon: Cat, bgColor: 'bg-[#e8e8f7]' },
  { id: 'rabbit', name: 'Rabbit', icon: Rabbit, bgColor: 'bg-neutral-grey-background' },
  { id: 'bird', name: 'Bird', icon: Bird, bgColor: 'bg-neutral-pink-background' },
  { id: 'mouse', name: 'Mouse', icon: Mouse, bgColor: 'bg-[#e8eef7]' },
];

export function PetIconsSection() {
  return (
    <AnimatedSection className="w-full py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-[1160px]">
        {/* Title */}
        <h2 className="text-[28px] sm:text-[32px] font-semibold text-primary-navy-light text-center mb-8">
          Suitable for small pets and more 🐰🐹
        </h2>

        {/* Pet Icons */}
        <div className="flex flex-wrap justify-center gap-6">
          {pets.map((pet) => {
            const Icon = pet.icon;
            return (
              <div
                key={pet.id}
                className={`${pet.bgColor} w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center`}
              >
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary-navy" strokeWidth={1.5} />
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

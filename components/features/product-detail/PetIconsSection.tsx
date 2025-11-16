"use client";

import { Dog, Cat, Rabbit, Bird, Mouse } from "lucide-react";
import { AnimatedSection } from "../homepage/AnimatedSection";

const pets = [
  { id: "dog", name: "Dog", icon: Dog, bgColor: "bg-secondary-mint" },
  { id: "cat", name: "Cat", icon: Cat, bgColor: "bg-[#e8e8f7]" },
  {
    id: "rabbit",
    name: "Rabbit",
    icon: Rabbit,
    bgColor: "bg-neutral-grey-background",
  },
  {
    id: "bird",
    name: "Bird",
    icon: Bird,
    bgColor: "bg-neutral-pink-background",
  },
  { id: "mouse", name: "Mouse", icon: Mouse, bgColor: "bg-[#e8eef7]" },
];

export function PetIconsSection() {
  return (
    <AnimatedSection className="w-full py-12 sm:py-16">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Title */}
        <h2 className="text-primary-navy-light mb-8 text-center text-[28px] font-semibold sm:text-[32px]">
          Suitable for small pets and more 🐰🐹
        </h2>

        {/* Pet Icons */}
        <div className="flex flex-wrap justify-center gap-6">
          {pets.map((pet) => {
            const Icon = pet.icon;
            return (
              <div
                key={pet.id}
                className={`${pet.bgColor} flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24`}
              >
                <Icon
                  className="text-primary-navy h-10 w-10 sm:h-12 sm:w-12"
                  strokeWidth={1.5}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

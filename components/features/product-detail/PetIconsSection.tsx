"use client";

import { Dog, Cat, Rabbit, Bird, Mouse, Circle } from "lucide-react";
import { GuineaPigIcon } from "@/components/icons/PetIcons";
import { AnimatedSection } from "../homepage/AnimatedSection";
import type { SpeciesInfo } from "@/lib/types/product";

// Map of species slugs to their icon and styling
const speciesMap: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    bgColor: string;
    emoji: string;
  }
> = {
  dog: {
    icon: Dog,
    bgColor: "bg-secondary-mint",
    emoji: "🐕",
  },
  cat: {
    icon: Cat,
    bgColor: "bg-[#e8e8f7]",
    emoji: "🐱",
  },
  rabbit: {
    icon: Rabbit,
    bgColor: "bg-neutral-grey-background",
    emoji: "🐰",
  },
  guinea_pig: {
    icon: GuineaPigIcon,
    bgColor: "bg-neutral-pink-background",
    emoji: "🐹",
  },
  guinea_pig_rabbit: {
    icon: Rabbit,
    bgColor: "bg-neutral-pink-background",
    emoji: "🐹🐰",
  },
  bird: {
    icon: Bird,
    bgColor: "bg-[#e8eef7]",
    emoji: "🐦",
  },
  mouse: {
    icon: Mouse,
    bgColor: "bg-[#e8eef7]",
    emoji: "🐭",
  },
};

interface PetIconsSectionProps {
  species?: SpeciesInfo[];
}

export function PetIconsSection({ species = [] }: PetIconsSectionProps) {
  // Filter pets based on species
  const displayPets = species
    .map((s) => {
      // Normalize slug: handle both "guinea-pig" and "guinea_pig" formats
      const slug = s.slug?.toLowerCase().replace(/-/g, "_") || "";
      const config = speciesMap[slug];
      if (!config) return null;

      return {
        id: slug,
        name: s.name || slug,
        icon: config.icon,
        bgColor: config.bgColor,
        emoji: config.emoji,
      };
    })
    .filter((pet): pet is NonNullable<typeof pet> => pet !== null);

  // If no species provided or no matching species found, show default message
  if (displayPets.length === 0) {
    return (
      <AnimatedSection className="w-full py-12 sm:py-16">
        <div className="container mx-auto max-w-[1160px] px-4">
          <h2 className="text-primary-navy-light mb-8 text-center text-[28px] font-semibold sm:text-[32px]">
            Suitable for small pets and more 🐰🐹
          </h2>
          <p className="text-primary-navy text-center text-base">
            This product is suitable for various small pets
          </p>
        </div>
      </AnimatedSection>
    );
  }

  // Build emoji string from all species
  const emojiString = displayPets.map((p) => p.emoji).join("");

  return (
    <AnimatedSection className="w-full py-12 sm:py-16">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Title */}
        <h2 className="text-primary-navy-light mb-8 text-center text-[28px] font-semibold sm:text-[32px]">
          Suitable for small pets and more 🐰🐹
        </h2>

        {/* Pet Icons */}
        <div className="flex flex-wrap justify-center gap-6">
          {displayPets.map((pet) => {
            const Icon = pet.icon;
            return (
              <div
                key={pet.id}
                className={`${pet.bgColor} flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24`}
                title={pet.name}
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

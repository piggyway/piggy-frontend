import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PetType {
  name: string;
  icon: string; // image path
  iconAlt?: string;
}

export interface ProductPetBannerProps {
  title?: string;
  pets: PetType[];
  className?: string;
}

export function ProductPetBanner({
  title = "Suitable for",
  pets,
  className,
}: ProductPetBannerProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-6", className)}>
      {/* Title */}
      <h2 className="text-primary-navy w-full text-xl leading-6 font-medium">
        {title}
      </h2>

      {/* Pet Icons Grid */}
      <div className="flex flex-wrap items-center gap-4">
        {pets.map((pet) => (
          <div key={pet.name} className="flex flex-col items-center gap-2">
            <div className="bg-neutral-stroke flex size-16 items-center justify-center overflow-hidden rounded-full">
              {pet.icon ? (
                <Image
                  src={pet.icon}
                  alt={pet.iconAlt || pet.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl">🐾</span>
              )}
            </div>
            <p className="text-primary-navy text-center text-sm leading-5 font-normal">
              {pet.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

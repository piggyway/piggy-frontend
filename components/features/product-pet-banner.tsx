import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface PetType {
  name: string
  icon: string // image path
  iconAlt?: string
}

export interface ProductPetBannerProps {
  title?: string
  pets: PetType[]
  className?: string
}

export function ProductPetBanner({
  title = "Suitable for",
  pets,
  className,
}: ProductPetBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-start w-full",
        className
      )}
    >
      {/* Title */}
      <h2 className="text-xl font-medium leading-6 text-primary-navy w-full">
        {title}
      </h2>

      {/* Pet Icons Grid */}
      <div className="flex gap-4 items-center flex-wrap">
        {pets.map((pet) => (
          <div
            key={pet.name}
            className="flex flex-col gap-2 items-center"
          >
            <div className="size-16 rounded-full bg-neutral-stroke flex items-center justify-center overflow-hidden">
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
            <p className="text-sm font-normal leading-5 text-primary-navy text-center">
              {pet.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}


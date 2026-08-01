"use client";

import Image from "next/image";
import Link from "next/link";
import { FeaturedCard } from "@/components/ui/featured-card";
import { AnimatedSection } from "../homepage/AnimatedSection";

export function BestSellingSection() {
  const categories = [
    {
      id: 1,
      title: "Liners",
      slug: "liner",
      image: "/homepage-essentials/liner-example.png",
      bgColor: "bg-neutral-pink-background",
    },
    {
      id: 2,
      title: "Hideout",
      slug: "hideout",
      image: "/homepage-essentials/hut-example.png",
      bgColor: "bg-secondary-mint",
    },
    {
      id: 3,
      title: "Combos",
      slug: "combo",
      image: "/homepage-essentials/combo-example.png",
      bgColor: "bg-primary-gold",
    },
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Header with Piggy Icon */}
        <div className="mb-8 flex items-start justify-between sm:mb-10">
          <div>
            <p className="text-primary-navy text-p-ui sm:text-lead mb-2 leading-[32px] font-normal">
              Our best 😊
            </p>
            <p className="text-primary-navy max-w-2xl text-lg leading-relaxed">
              Happy piggies & bunnies start here – cozy huts, tasty snacks, and
              everyday care made with love for little paws.
            </p>
          </div>
          {/* Decorative Piggy Icon */}
          <div className="ml-8 hidden lg:block">
            <div className="relative h-20 w-20">
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop-all?category=${category.slug}`}
            >
              <FeaturedCard
                title={category.title}
                image={category.image}
                className={category.bgColor}
              />
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

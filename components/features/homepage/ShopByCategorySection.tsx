'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export function ShopByCategorySection() {
  const categories = [
    {
      id: 1,
      title: 'Liners',
      image: '/homepage-essentials/liner-example.png',
      bgColor: 'bg-neutral-pink-background',
      textColor: 'text-primary-navy'
    },
    {
      id: 2,
      title: 'Hut',
      image: '/homepage-essentials/hut-example.png',
      bgColor: 'bg-secondary-mint',
      textColor: 'text-primary-navy'
    },
    {
      id: 3,
      title: 'C&C Cage',
      image: '/homepage-essentials/cage-example.png',
      bgColor: 'bg-primary-navy-light',
      textColor: 'text-white'
    },
    {
      id: 4,
      title: 'Snacks',
      image: '/homepage-essentials/snack-example.png',
      bgColor: 'bg-neutral-grey-background',
      textColor: 'text-primary-navy'
    },
    {
      id: 5,
      title: 'Combos',
      image: '/homepage-essentials/combo-example.png',
      bgColor: 'bg-primary-gold',
      textColor: 'text-primary-navy'
    },
    {
      id: 6,
      title: 'Merch',
      image: '/homepage-essentials/merch-example.png',
      bgColor: 'bg-secondary-blue',
      textColor: 'text-primary-navy'
    }
  ];

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-[1160px]">
        {/* Title */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[20px] sm:text-[24px] font-normal text-primary-navy leading-[32px] mb-2">
            Shop by Category
          </p>
          <h2 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-[42px] tracking-[-0.21px]">
            Guinea Pig & Rabbit Essentials
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href="/shop-all"
              className={`${category.bgColor} rounded-[28px] p-6 flex flex-col gap-5 hover:opacity-90 transition-opacity cursor-pointer`}
            >
              {/* Image */}
              <div className="relative w-full h-[200px] rounded-[24px] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title and Arrow Button */}
              <div className="flex items-center justify-between gap-4">
                <h3 className={`text-[20px] sm:text-[24px] font-semibold leading-[32px] ${category.textColor}`}>
                  {category.title}
                </h3>
                <div
                  className="bg-white border border-neutral-stroke rounded-full p-3 flex items-center justify-center shrink-0"
                  aria-label={`View ${category.title}`}
                >
                  <ArrowUpRight className="w-[11px] h-[11px] text-primary-navy" strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

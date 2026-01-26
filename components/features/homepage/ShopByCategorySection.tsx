"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { CategoryService } from "@/lib/services";
import type { Category } from "@/lib/types/models";

export function ShopByCategorySection() {
  // state management
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);

        const data = await CategoryService.getCategories({
          features: true,
          limit: 6,
        });

        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  // handle loading
  if (loading) {
    return (
      <div className="container mx-auto py-20">
        <div className="text-center">Loading categories...</div>
      </div>
    );
  }

  // handle error
  if (error) {
    return (
      <div className="container mx-auto py-20">
        <div className="text-center">Error: {error}</div>
      </div>
    );
  }

  // handle empty data
  if (categories.length === 0) {
    return (
      <div className="container mx-auto py-20">
        <div className="text-center">No categories available</div>
      </div>
    );
  }

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        <div className="rounded-[32px] bg-white p-6 sm:p-10 lg:p-12">
          {/* Title */}
          <div className="mb-8 sm:mb-10">
            <p className="text-primary-navy mb-2 text-[20px] leading-[32px] font-normal sm:text-[24px]">
              Shop by Category
            </p>
            <h2 className="text-primary-navy-light text-[32px] leading-[42px] font-semibold tracking-[-0.21px] sm:text-[42px]">
              Guinea Pig & Rabbit Essentials
            </h2>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop-all?category=${category.slug}`}
                className={`${category.bgColor} rounded-extra-large flex cursor-pointer flex-col gap-5 p-6 transition-opacity hover:opacity-90`}
              >
                {/* Image */}
                <div className="relative h-[200px] w-full overflow-hidden rounded-[24px]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Title and Arrow Button */}
                <div className="flex items-center justify-between gap-4">
                  <h3
                    className={`text-[20px] leading-[32px] font-semibold sm:text-[24px] ${category.textColor}`}
                  >
                    {category.title}
                  </h3>
                  <div
                    className="border-neutral-stroke flex shrink-0 items-center justify-center rounded-full border bg-white p-3"
                    aria-label={`View ${category.title}`}
                  >
                    <ArrowUpRight
                      className="text-primary-navy h-[11px] w-[11px]"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

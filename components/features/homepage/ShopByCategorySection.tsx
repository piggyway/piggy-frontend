import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { CategoryService } from "@/lib/services";

/**
 * Server component: categories are fetched during server rendering so the
 * category links are present in the initial HTML for crawlers.
 */
export async function ShopByCategorySection() {
  const categories = await CategoryService.getCategories({
    features: true,
    limit: 6,
  });

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
            <p className="text-primary-navy text-p-ui sm:text-lead mb-2 leading-[32px] font-normal">
              Shop by Category
            </p>
            <h2 className="text-primary-navy-light text-large sm:text-h4 leading-[42px] font-semibold tracking-[-0.21px]">
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
                    className={`text-p-ui sm:text-lead leading-[32px] font-semibold ${category.textColor}`}
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

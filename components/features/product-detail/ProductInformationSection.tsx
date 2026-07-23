"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  WashingMachine,
  Wind,
  Brush,
  Flame,
  FlaskConical,
  Ban,
  type LucideIcon,
} from "lucide-react";
import type { CareCard } from "@/lib/types/models";
import { AnimatedSection } from "../homepage/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductInformationSectionProps {
  productFeatures: string;
  specifications: string;
  careInstructions: string;
  detailInformationFiles: string[];
  /** Category-driven presentation, sourced from the CMS product-category. */
  specSectionTitle?: string | null;
  careSectionTitle?: string | null;
  careCards?: CareCard[];
}

/**
 * Maps a care card `icon` name (stored in the CMS `care_cards` JSON) to a
 * lucide icon. Keys MUST match the CMS-allowed icon names one-to-one; adding
 * an option is a two-side change (this map + the CMS choices). The fallback is
 * defensive only.
 */
const CARE_ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  WashingMachine,
  Wind,
  Brush,
  Flame,
  FlaskConical,
};

const DEFAULT_CARE_CARD_BG = "bg-neutral-background";

// Maps the first two accordion items to a carousel image index
const IMAGE_INDEX_BY_ITEM: Record<string, number> = {
  features: 0,
  specifications: 1,
};

export function ProductInformationSection({
  productFeatures,
  specifications,
  careInstructions,
  detailInformationFiles,
  specSectionTitle,
  careSectionTitle,
  careCards = [],
}: ProductInformationSectionProps) {
  const defaultProductFeatures = `
    <ul class="list-disc pl-5 space-y-2">
      <li>Premium quality materials ensuring durability and comfort.</li>
      <li>Designed with pet safety in mind, non-toxic and secure.</li>
      <li>Easy to clean and maintain for long-lasting use.</li>
      <li>Modern and stylish design that fits any home decor.</li>
    </ul>
  `;
  const defaultSpecifications = `
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Dimensions:</strong> Please refer to product images</li>
      <li><strong>Material:</strong> High-quality fabric</li>
      <li><strong>Weight:</strong> Lightweight and portable</li>
      <li><strong>Origin:</strong> Designed with love</li>
    </ul>
  `;
  const defaultCareInstructions = `
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold mb-2">How to use</h3>
        <p>Place in a comfortable spot for your pet. Ensure it is stable and accessible.</p>
      </div>
      <div>
        <h3 class="font-semibold mb-2">Care instructions</h3>
        <p>Machine wash cold on gentle cycle. Do not bleach. Tumble dry low. Do not iron.</p>
      </div>
    </div>
  `;
  const normalizeContent = (value: string, fallback: string) =>
    value?.trim() ? value : fallback;

  const accordionItems = [
    {
      id: "features",
      title: "Product Features",
      content: normalizeContent(productFeatures, defaultProductFeatures),
    },
    {
      id: "specifications",
      title: specSectionTitle?.trim() || "Size guide",
      content: normalizeContent(specifications, defaultSpecifications),
    },
    {
      id: "care",
      title: careSectionTitle?.trim() || "Liner Care & Cleaning Guide",
      content: normalizeContent(careInstructions, defaultCareInstructions),
    },
  ];

  const hasCareCards = careCards.length > 0;

  const carouselImages =
    detailInformationFiles && detailInformationFiles.length > 0
      ? detailInformationFiles
      : ["/default-product-image.png"];

  const [activeItem, setActiveItem] = useState("features");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Sync the carousel to the active (non-care) accordion item
  useEffect(() => {
    if (!carouselApi || activeItem === "care") return;
    carouselApi.scrollTo(IMAGE_INDEX_BY_ITEM[activeItem] ?? 0);
  }, [carouselApi, activeItem]);

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Rounded Navy Container */}
        <div className="bg-primary-navy flex flex-col gap-8 rounded-[20px] p-6 sm:rounded-[28px] sm:p-8 md:p-10 lg:p-12">
          <h2 className="text-primary-gold text-lead sm:text-large lg:text-large font-semibold">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Detail Information */}
            <div className="space-y-4">
              <Accordion
                type="single"
                collapsible
                defaultValue="features"
                onValueChange={(value) =>
                  setActiveItem(Array.isArray(value) ? (value[0] ?? "") : value)
                }
              >
                {accordionItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-white/20"
                  >
                    <AccordionTrigger className="[&>svg]:text-primary-navy w-full text-left text-white [&>svg]:ml-auto [&>svg]:!h-8 [&>svg]:!w-8 [&>svg]:rounded-full [&>svg]:bg-white [&>svg]:p-2">
                      <h2 className="text-primary-purple text-p-ui font-medium">
                        {item.title}
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="text-body-medium [&_h2]:text-p [&_h3]:text-subtle leading-relaxed text-white/90 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:font-semibold [&_h2]:text-white [&_h3]:font-semibold [&_h3]:text-white [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{
                          __html: item.content,
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right: image carousel (Features / Specifications) or care grid (Care) */}
            <div className="relative">
              {activeItem === "care" && hasCareCards ? (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {careCards.map((card, index) => {
                    const Icon = CARE_ICON_MAP[card.icon] ?? Sparkles;
                    return (
                      <div
                        key={`${card.title}-${index}`}
                        className={cn(
                          "flex flex-col items-center gap-3 rounded-[16px] p-4 text-center",
                          card.bg || DEFAULT_CARE_CARD_BG
                        )}
                      >
                        {card.forbidden ? (
                          <div className="relative flex size-12 items-center justify-center">
                            <Icon
                              className="size-6 text-slate-400"
                              strokeWidth={1.5}
                            />
                            <Ban
                              className="absolute inset-0 size-12 text-slate-400"
                              strokeWidth={1.25}
                            />
                          </div>
                        ) : (
                          <Icon
                            className="text-primary-navy size-12"
                            strokeWidth={1.5}
                          />
                        )}
                        <p className="text-primary-navy text-sm leading-5 font-medium">
                          {card.title}
                          {card.description && (
                            <span className="text-primary-navy/70 mt-0.5 block text-xs font-normal">
                              {card.description}
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Carousel className="w-full" setApi={setCarouselApi}>
                  <CarouselContent>
                    {carouselImages.map((image, index) => (
                      <CarouselItem key={`${image}-${index}`}>
                        <div className="bg-secondary-mint relative aspect-[4/3] overflow-hidden rounded-[20px] sm:rounded-[28px]">
                          <Image
                            src={image}
                            alt={`Detail information ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 460px"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {carouselImages.length > 1 && (
                    <>
                      <CarouselPrevious className="text-primary-navy border-white/40 bg-white/90 hover:bg-white sm:-left-8 lg:-left-10" />
                      <CarouselNext className="text-primary-navy border-white/40 bg-white/90 hover:bg-white sm:-right-8 lg:-right-10" />
                    </>
                  )}
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

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
import type { InfoSection } from "@/lib/types/product";
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
  /** CMS-driven sections; when present they replace the legacy three fields. */
  infoSections?: InfoSection[];
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

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
  /** True only for the legacy "care" item, which drives the care-grid panel. */
  isCare: boolean;
}

export function ProductInformationSection({
  productFeatures,
  specifications,
  careInstructions,
  detailInformationFiles,
  specSectionTitle,
  careSectionTitle,
  careCards = [],
  infoSections = [],
}: ProductInformationSectionProps) {
  const hasInfoSections = infoSections.length > 0;

  // CMS sections replace the legacy trio when present. Otherwise fall back to
  // the three legacy fields, keeping only the ones that carry real content
  // (no placeholder copy is ever rendered).
  const accordionItems: AccordionItemData[] = hasInfoSections
    ? infoSections.map((section) => ({
        id: `section-${section.id}`,
        title: section.title,
        content: section.content,
        isCare: false,
      }))
    : [
        {
          id: "features",
          title: "Product Features",
          content: productFeatures,
          isCare: false,
        },
        {
          id: "specifications",
          title: specSectionTitle?.trim() || "Size guide",
          content: specifications,
          isCare: false,
        },
        {
          id: "care",
          title: careSectionTitle?.trim() || "Liner Care & Cleaning Guide",
          content: careInstructions,
          isCare: true,
        },
      ].filter((item) => item.content?.trim());

  const hasCareCards = careCards.length > 0;
  const hasImages = (detailInformationFiles?.length ?? 0) > 0;
  const carouselImages = detailInformationFiles ?? [];

  const firstItemId = accordionItems[0]?.id ?? "";
  const [activeItem, setActiveItem] = useState(firstItemId);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const activeIndex = accordionItems.findIndex(
    (item) => item.id === activeItem
  );

  // Sync the carousel to the active accordion item, mapping section N -> image N
  // (clamped). This preserves the legacy features/specifications behavior and
  // extends naturally to dynamic sections.
  useEffect(() => {
    if (!carouselApi || carouselImages.length === 0) return;
    const target = Math.min(
      Math.max(activeIndex, 0),
      carouselImages.length - 1
    );
    carouselApi.scrollTo(target);
  }, [carouselApi, activeIndex, carouselImages.length]);

  // Nothing meaningful to render.
  if (accordionItems.length === 0 && !hasCareCards) {
    return null;
  }

  const activeItemData = accordionItems.find((item) => item.id === activeItem);
  const activeIsLegacyCare = activeItemData?.isCare ?? false;

  // Right panel: care grid on the legacy care item, or statically for dynamic
  // sections that have care cards but no images; carousel whenever images exist;
  // otherwise no right panel at all.
  const showCareGrid =
    hasCareCards && (activeIsLegacyCare || (hasInfoSections && !hasImages));
  const showCarousel = !showCareGrid && hasImages;
  const showRightPanel = showCareGrid || showCarousel;

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Rounded Navy Container */}
        <div className="bg-primary-navy flex flex-col gap-8 rounded-[20px] p-6 sm:rounded-[28px] sm:p-8 md:p-10 lg:p-12">
          <h2 className="text-primary-gold text-lead sm:text-large lg:text-large font-semibold">
            Product Information
          </h2>

          <div
            className={cn(
              "grid grid-cols-1 gap-8",
              showRightPanel && "lg:grid-cols-2 lg:gap-12"
            )}
          >
            {/* Left: Detail Information */}
            <div className="space-y-4">
              <Accordion
                type="single"
                collapsible
                defaultValue={firstItemId}
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

            {/* Right: image carousel or care grid */}
            {showRightPanel && (
              <div className="relative">
                {showCareGrid ? (
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
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

import Image from "next/image";
import {
  WashingMachine,
  PiggyBank,
  Sparkles,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "../homepage/AnimatedSection";
import { cn } from "@/lib/utils";
import type { FeatureCard, StoryBlock } from "@/lib/types/product";

interface ProductFeaturesSectionProps {
  productName?: string;
  subtitle?: string;
  description?: string;
  featureSectionTitle?: string;
  featureSectionSubtitle?: string;
  featureBannerText?: string;
  featureCards?: FeatureCard[];
  storyBlocks?: StoryBlock[];
}

// Keys must match the `icon` dropdown choices in the CMS
// (product_info_feature_cards.icon). Add an icon here and in the CMS together.
const ICON_MAP: Record<string, LucideIcon> = {
  WashingMachine,
  PiggyBank,
  Sparkles,
  Leaf,
};

// Keys must match the `background` dropdown choices in the CMS
// (product_info_feature_cards.background).
const BACKGROUND_MAP: Record<string, string> = {
  "secondary-mint": "bg-secondary-mint",
  "primary-light-gold": "bg-primary-light-gold",
  "neutral-pink-background": "bg-neutral-pink-background",
  "primary-purple": "bg-primary-purple",
};

export function ProductFeaturesSection({
  productName = "",
  subtitle = "",
  description = "",
  featureSectionTitle = "",
  featureSectionSubtitle = "",
  featureBannerText = "",
  featureCards = [],
  storyBlocks = [],
}: ProductFeaturesSectionProps) {
  // Without cards, story blocks, or any intro/banner copy the section is just
  // a pet icon and the product title, so render nothing at all.
  const hasContent =
    featureCards.length > 0 ||
    storyBlocks.length > 0 ||
    Boolean(subtitle.trim()) ||
    Boolean(description.trim()) ||
    Boolean(featureSectionTitle.trim()) ||
    Boolean(featureBannerText.trim());

  if (!hasContent) {
    return null;
  }

  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto flex max-w-[1160px] flex-col gap-12 px-4">
        {/* Gradient-border white card */}
        <div
          className="rounded-[32px] p-[12px]"
          style={{
            background:
              "linear-gradient(135deg, #DCD7FF, #E1F2EF, #EEEBFF, #FFFFFF, #FFDFDF)",
          }}
        >
          <div className="flex flex-col gap-12 rounded-[30px] bg-white p-6 sm:p-10 lg:p-16">
            {/* Intro */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative h-[46px] w-[68px]">
                <Image
                  src="/Group 564.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              {productName && (
                <h2 className="text-primary-navy-light text-large sm:text-large font-semibold">
                  {productName}
                </h2>
              )}
              {subtitle && (
                <p className="text-primary-navy text-lead leading-8 font-semibold">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-primary-navy text-lead max-w-2xl leading-8">
                  {description}
                </p>
              )}
            </div>

            {/* Feature cards */}
            {featureCards.length > 0 && (
              <>
                {/* Divider */}
                <div className="flex justify-center">
                  <div className="relative h-[26px] w-[45px]">
                    <Image
                      src="/baba.svg"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="bg-primary-navy flex flex-col gap-8 rounded-[28px] p-6 sm:p-8 md:p-10">
                  {(featureSectionTitle || featureSectionSubtitle) && (
                    <div className="flex flex-col gap-2">
                      {featureSectionTitle && (
                        <h3 className="text-lead text-white">
                          {featureSectionTitle}
                        </h3>
                      )}
                      {featureSectionSubtitle && (
                        <p className="text-p text-white">
                          {featureSectionSubtitle}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {featureCards.map((card, index) => {
                      const Icon = ICON_MAP[card.icon] ?? Sparkles;
                      const bgClass =
                        BACKGROUND_MAP[card.background] ?? "bg-secondary-mint";
                      return (
                        <div
                          key={`${card.label}-${index}`}
                          className={cn(
                            "flex flex-col items-center gap-4 rounded-[20px] p-6",
                            bgClass
                          )}
                        >
                          <Icon
                            className="text-primary-navy size-12"
                            strokeWidth={1.5}
                          />
                          <p className="text-primary-navy text-p text-center font-semibold">
                            {card.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Story blocks - alternating image / text (from CMS) */}
            {storyBlocks.length > 0 && (
              <>
                <div className="flex flex-col gap-10 sm:gap-12">
                  {storyBlocks.map((block, index) => (
                    <div
                      key={`${block.title}-${index}`}
                      className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12"
                    >
                      <div
                        className={cn(
                          "flex flex-col gap-4",
                          block.imageLeft ? "lg:order-2" : "lg:order-1"
                        )}
                      >
                        <h3 className="text-primary-navy-light text-lead">
                          {block.title}
                        </h3>
                        <p className="text-primary-navy text-p">
                          {block.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "bg-neutral-grey-background relative aspect-[4/3] w-full overflow-hidden rounded-[28px]",
                          block.imageLeft ? "lg:order-1" : "lg:order-2"
                        )}
                      >
                        <Image
                          src={block.imageUrl}
                          alt={block.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 560px"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="flex justify-center">
                  <div className="relative h-[26px] w-[45px]">
                    <Image
                      src="/baba.svg"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mess happens banner */}
        {featureBannerText && (
          <div className="flex items-end justify-end gap-6">
            <h2 className="text-primary-navy-light text-large text-center font-semibold">
              {featureBannerText}
            </h2>
            <div className="relative hidden h-[75px] w-[150px] shrink-0 sm:block sm:h-[107px] sm:w-[214px]">
              <Image
                src="/Group 367.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

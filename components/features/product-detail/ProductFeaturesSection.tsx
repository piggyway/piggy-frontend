import Image from "next/image";
import { WashingMachine, PiggyBank, Sparkles, Leaf } from "lucide-react";
import { AnimatedSection } from "../homepage/AnimatedSection";
import { cn } from "@/lib/utils";
import type { StoryBlock } from "@/lib/types/product";

interface ProductFeaturesSectionProps {
  productName?: string;
  storyBlocks?: StoryBlock[];
}

const FEATURE_CARDS = [
  {
    icon: WashingMachine,
    label: "Machine Wash & Tumble Dry",
    bg: "bg-secondary-mint",
  },
  {
    icon: PiggyBank,
    label: "Saves Money & Reduces Waste",
    bg: "bg-primary-light-gold",
  },
  {
    icon: Sparkles,
    label: "Shake it clean, less effort",
    bg: "bg-neutral-pink-background",
  },
  {
    icon: Leaf,
    label: "Eco-Friendly Choice",
    bg: "bg-primary-purple",
  },
];

export function ProductFeaturesSection({
  productName = "Comfy Base Liner",
  storyBlocks = [],
}: ProductFeaturesSectionProps) {
  return (
    <AnimatedSection className="w-full py-12 sm:py-16">
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
              <h2 className="text-primary-navy-light text-[28px] font-semibold sm:text-[32px]">
                {productName}
              </h2>
              <p className="text-primary-navy text-lg font-semibold">
                Reusable guinea pig cage liner designed for comfort,
                cleanliness, and long-term use.
              </p>
              <p className="max-w-2xl text-base leading-6 text-slate-400">
                Soft, absorbent, and easy to clean, this liner keeps your
                pet&apos;s space dry and comfortable while reducing waste.
                Designed to fit C&amp;C cages and flexible for different setups.
              </p>
            </div>

            {/* Divider */}
            <div className="flex justify-center">
              <div className="relative h-[26px] w-[45px]">
                <Image src="/baba.svg" alt="" fill className="object-contain" />
              </div>
            </div>

            {/* Feature cards */}
            <div className="bg-primary-navy flex flex-col gap-8 rounded-[28px] p-6 sm:p-8 md:p-10">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold text-white">
                  Reusable, Eco-Friendly &amp; Budget-Friendly
                </h3>
                <p className="text-base leading-6 text-white/80">
                  Simple to clean and designed for long-term use, helping you
                  cut down on waste and ongoing bedding costs.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {FEATURE_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className={cn(
                        "flex flex-col items-center gap-4 rounded-[20px] p-6",
                        card.bg
                      )}
                    >
                      <Icon
                        className="text-primary-navy size-12"
                        strokeWidth={1.5}
                      />
                      <p className="text-primary-navy text-center text-sm font-semibold">
                        {card.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

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
                        <h3 className="text-primary-navy-light text-3xl leading-10 font-semibold">
                          {block.title}
                        </h3>
                        <p className="text-primary-navy text-2xl leading-8 font-normal">
                          {block.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "bg-neutral-grey-background relative aspect-[4/3] w-full overflow-hidden rounded-[24px]",
                          block.imageLeft ? "lg:order-1" : "lg:order-2"
                        )}
                      >
                        <Image
                          src={block.imageUrl}
                          alt={block.title}
                          fill
                          className="object-contain p-6"
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
        <div className="flex items-center justify-center gap-6">
          <h2 className="text-primary-navy-light text-center text-[28px] font-semibold sm:text-[32px]">
            Mess happens. We absorb it.
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
      </div>
    </AnimatedSection>
  );
}

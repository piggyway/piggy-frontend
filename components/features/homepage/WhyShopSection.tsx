"use client";

import Image from "next/image";
import { AnimatedSection } from "./AnimatedSection";

function WhyShopImage({
  src,
  alt,
  fit = "cover",
}: {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
}) {
  return (
    <div className="relative h-[230px] overflow-hidden rounded-[32px] bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        className={fit === "contain" ? "object-contain p-4" : "object-cover"}
        sizes="(min-width: 1024px) 360px, 100vw"
      />
    </div>
  );
}

export function WhyShopSection() {
  return (
    <AnimatedSection className="w-full">
      <div className="container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        {/* Title and Description */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-primary-navy-light text-large sm:text-h4 mb-2 leading-[42px] font-semibold tracking-[-0.21px]">
            Why Shop With Us?
          </h2>
          <p className="text-primary-navy text-p-ui sm:text-lead leading-[32px] font-normal">
            We create comfy, easy-clean liners and accessories for guinea pigs
            and rabbits. Designed in Australia with love — soft, practical, and
            made for happy little paws.
          </p>
        </div>

        {/* 3 Column Card Layout - Desktop */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="flex items-start gap-6 pb-4">
            {/* Column 1 - White card on top, Gold card on bottom */}
            <div className="flex flex-1 flex-col gap-0">
              <WhyShopImage
                src="https://cdn.piggyway.com.au/eac334181353a0c5738356ce47560650abe42db5.jpg"
                alt="Three guinea pigs sitting together on a pink quilted fleece cage liner"
              />
              <div className="bg-primary-gold flex items-center justify-center rounded-[32px] p-8">
                <p className="text-primary-navy text-lead text-center leading-[32px] font-semibold">
                  Eco-Friendly Liners
                </p>
              </div>
            </div>

            {/* Column 2 - Purple card on top, White card on bottom */}
            <div className="flex flex-1 flex-col gap-0">
              <div className="bg-primary-purple flex items-center justify-center rounded-[32px] p-8">
                <p className="text-primary-navy text-lead text-center leading-[32px] font-semibold">
                  Easy-Clean Cages
                </p>
              </div>
              <WhyShopImage
                src="/shop-with-us/easy-clean-cages.jpg"
                alt="Guinea pig cage with fleece liners, hideouts and a tunnel"
              />
            </div>

            {/* Column 3 - White card on top, Pink card on bottom */}
            <div className="flex flex-1 flex-col gap-0">
              <WhyShopImage
                src="https://cdn.piggyway.com.au/c19f90dcb75798915f5bfb0d7ebe0047.jpg"
                alt="Three guinea pigs sharing a bowl of fresh vegetables"
              />
              <div className="bg-secondary-pink flex items-center justify-center rounded-[32px] p-8">
                <p className="text-lead text-center leading-[32px] font-semibold text-white">
                  Loved by Pet Parents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex flex-col">
            <WhyShopImage
              src="https://cdn.piggyway.com.au/eac334181353a0c5738356ce47560650abe42db5.jpg"
              alt="Three guinea pigs sitting together on a pink quilted fleece cage liner"
            />
            <div className="bg-primary-gold flex min-h-[120px] items-center justify-center rounded-[28px] p-6">
              <p className="text-primary-navy text-center text-xl font-semibold">
                Eco-Friendly Liners
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-primary-purple flex min-h-[120px] items-center justify-center rounded-[28px] p-6">
              <p className="text-primary-navy text-center text-xl font-semibold">
                Easy-Clean Cages
              </p>
            </div>
            <WhyShopImage
              src="/shop-with-us/easy-clean-cages.jpg"
              alt="Guinea pig cage with fleece liners, hideouts and a tunnel"
            />
          </div>
          <div className="flex flex-col">
            <WhyShopImage
              src="https://cdn.piggyway.com.au/c19f90dcb75798915f5bfb0d7ebe0047.jpg"
              alt="Three guinea pigs sharing a bowl of fresh vegetables"
            />
            <div className="bg-secondary-pink flex min-h-[120px] items-center justify-center rounded-[28px] p-6">
              <p className="text-center text-xl font-semibold text-white">
                Loved by Pet Parents
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

"use client";

import { useMemo } from "react";
import Image from "next/image";
import createDOMPurify from "dompurify";
import { AnimatedSection } from "../homepage/AnimatedSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductInformationSectionProps {
  detailInformation: string;
  detailInformationFiles: string[];
}

export function ProductInformationSection({
  detailInformation,
  detailInformationFiles,
}: ProductInformationSectionProps) {
  const sanitizedDetailInformation = useMemo(() => {
    if (!detailInformation) return "";
    if (typeof window === "undefined") return detailInformation;

    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(detailInformation);
  }, [detailInformation]);
  const hasDetailInformation = sanitizedDetailInformation.trim().length > 0;
  const hasDetailInformationFiles = detailInformationFiles.length > 0;
  const carouselImages = hasDetailInformationFiles
    ? detailInformationFiles
    : ["/default-product-image.png"];
  const accordionItems = useMemo(() => {
    if (!sanitizedDetailInformation) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedDetailInformation, "text/html");
    const body = doc.body;
    const sections: Array<{ id: string; title: string; content: string }> = [];
    let currentSection: { title: string; nodes: string[] } | null = null;
    let autoIndex = 1;

    Array.from(body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName.toLowerCase() === "h1") {
          if (currentSection) {
            sections.push({
              id: `detail-${sections.length}`,
              title: currentSection.title || `Section ${autoIndex}`,
              content: currentSection.nodes.join(""),
            });
            autoIndex += 1;
          }
          currentSection = {
            title: element.textContent?.trim() || `Section ${autoIndex}`,
            nodes: [],
          };
          return;
        }
      }

      if (!currentSection) {
        currentSection = { title: `Section ${autoIndex}`, nodes: [] };
      }
      currentSection.nodes.push(
        node.nodeType === Node.ELEMENT_NODE
          ? (node as HTMLElement).outerHTML
          : node.textContent || ""
      );
    });

    if (currentSection !== null) {
      const section = currentSection as { title: string; nodes: string[] };
      sections.push({
        id: `detail-${sections.length}`,
        title: section.title || `Section ${autoIndex}`,
        content: section.nodes.join(""),
      });
    }

    return sections;
  }, [sanitizedDetailInformation]);

  return (
    <AnimatedSection className="w-full py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-[1160px] px-4">
        {/* Rounded Navy Container */}
        <div className="bg-primary-navy flex flex-col gap-8 overflow-hidden rounded-[20px] p-6 sm:rounded-[28px] sm:p-8 md:p-10 lg:p-12">
          <h2 className="text-primary-gold text-[24px] font-semibold sm:text-[28px] lg:text-[32px]">
            Product Information
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Detail Information */}
            <div className="space-y-4">
              {hasDetailInformation && accordionItems.length > 0 ? (
                <Accordion type="single" collapsible defaultValue="detail-0">
                  {accordionItems.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="border-white/20"
                    >
                      <AccordionTrigger className="w-full text-left text-white [&>svg]:ml-auto">
                        <h1 className="text-xl font-semibold sm:text-2xl">
                          {item.title}
                        </h1>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className="text-sm leading-relaxed text-white/90 sm:text-base [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
                          dangerouslySetInnerHTML={{
                            __html: item.content,
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-white/80 sm:text-base">
                  Product details are being prepared.
                </p>
              )}
            </div>

            {/* Right: Detail Information Carousel */}
            <div className="relative">
              <Carousel className="w-full">
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
                    <CarouselPrevious className="text-primary-navy border-white/40 bg-white/90 hover:bg-white" />
                    <CarouselNext className="text-primary-navy border-white/40 bg-white/90 hover:bg-white" />
                  </>
                )}
              </Carousel>
              {!hasDetailInformationFiles && (
                <p className="mt-3 text-xs text-white/70">
                  Detail images are being prepared.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

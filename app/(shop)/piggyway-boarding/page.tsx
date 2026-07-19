import { Metadata } from "next";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { HeroIntroSection } from "@/components/features/boarding/HeroIntroSection";
import { WhoItsForSection } from "@/components/features/boarding/WhoItsForSection";
import { CareLeadSection } from "@/components/features/boarding/CareLeadSection";
import { PoopHappensSection } from "@/components/features/boarding/PoopHappensSection";
import { TrustedVetSection } from "@/components/features/boarding/TrustedVetSection";

export const metadata: Metadata = {
  title: { absolute: "Piggyway Boarding | Guinea Pig Boarding in Melbourne" },
  alternates: { canonical: "/piggyway-boarding" },
  description:
    "Thoughtful guinea pig boarding in Melbourne with routine-based care, gentle handling, and personalized support for every piggy.",
  keywords: [
    "guinea pig boarding melbourne",
    "small pet boarding",
    "guinea pig care melbourne",
    "pet boarding for guinea pigs",
    "indoor guinea pig boarding",
  ],
  openGraph: {
    title: "Piggyway Boarding | Guinea Pig Boarding in Melbourne",
    description:
      "Thoughtful guinea pig boarding and care in Melbourne, designed to feel like home.",
    type: "website",
    url: "/piggyway-boarding",
    images: [
      {
        url: "/Boarding Banner.png",
        width: 1200,
        height: 630,
        alt: "Piggyway Boarding in Melbourne",
      },
    ],
  },
};

export default function BoardingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Piggy Way Boarding",
    description:
      "Thoughtful boarding and care for guinea pigs in Melbourne, designed to feel like home.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Melbourne",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffbf5]">
      <BackgroundBlobs variant={1} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroIntroSection />
      <WhoItsForSection />
      <CareLeadSection />
      <PoopHappensSection />
      <TrustedVetSection />
    </div>
  );
}

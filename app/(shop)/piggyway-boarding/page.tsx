import type { Metadata } from "next";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { HeroIntroSection } from "@/components/features/boarding/HeroIntroSection";
import { WhoItsForSection } from "@/components/features/boarding/WhoItsForSection";
import { CareLeadSection } from "@/components/features/boarding/CareLeadSection";
import { PoopHappensSection } from "@/components/features/boarding/PoopHappensSection";
import { TrustedVetSection } from "@/components/features/boarding/TrustedVetSection";
import { getBaseUrl } from "@/lib/utils/seo";

const PAGE_TITLE = "Guinea Pig Boarding Melbourne";
const PAGE_DESCRIPTION =
  "Guinea pig boarding in Melbourne with routine-based care, gentle handling, and personalized support for every piggy.";
const PAGE_PATH = "/piggyway-boarding";
const OG_IMAGE_PATH = "/Boarding Banner.png";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  keywords: [
    "guinea pig boarding melbourne",
    "guinea pig boarding",
    "small pet boarding melbourne",
    "guinea pig care melbourne",
    "pet boarding for guinea pigs",
    "indoor guinea pig boarding",
  ],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    url: PAGE_PATH,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Guinea pig boarding in Melbourne - Piggy Way Crossing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function BoardingPage() {
  const siteUrl = getBaseUrl();
  const pageUrl = `${siteUrl}${PAGE_PATH}`;
  const imageUrl = `${siteUrl}${OG_IMAGE_PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Piggy Way Boarding",
    description: PAGE_DESCRIPTION,
    url: pageUrl,
    image: imageUrl,
    email: "support@piggyway.com.au",
    telephone: "+61 414 766 727",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14-16 Anderson St",
      addressLocality: "Templestowe",
      addressRegion: "VIC",
      postalCode: "3106",
      addressCountry: "AU",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: ["https://www.instagram.com/piggyway_crossing"],
  };

  return (
    <div className="bg-neutral-background-light relative min-h-screen">
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

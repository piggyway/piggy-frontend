import { Metadata } from "next";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { HeroSection } from "@/components/features/pet-care/HeroSection";
import { ArticlesSection } from "@/components/features/pet-care/ArticlesSection";
import { BoardingCtaSection } from "@/components/features/pet-care/BoardingCtaSection";
import { VetExpertiseSection } from "@/components/features/pet-care/VetExpertiseSection";
import { MeetDrSupsSection } from "@/components/features/pet-care/MeetDrSupsSection";
import { CompassionTaglineSection } from "@/components/features/pet-care/CompassionTaglineSection";
import { petCareArticles } from "@/lib/guides";
import { getBaseUrl } from "@/lib/utils/seo";

export const metadata: Metadata = {
  title: "Pet Care Tips & Education",
  description:
    "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips to keep your small pets happy and healthy.",
  alternates: { canonical: "/pet-care" },
  openGraph: {
    title: "Pet Care Tips & Education",
    description:
      "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips.",
    type: "website",
    images: ["/pet-care-tips/default1.png"],
  },
};

export default function PetCarePage() {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pet Care Tips & Education",
    description:
      "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips.",
    url: `${baseUrl}/pet-care`,
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/header-logo.png`,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: petCareArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/pet-care/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={1} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-10">
        <HeroSection />
        <ArticlesSection />
        <BoardingCtaSection />
        <VetExpertiseSection />
        <MeetDrSupsSection />
        <CompassionTaglineSection />
      </div>
    </div>
  );
}

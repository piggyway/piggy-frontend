import { Metadata } from "next";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { HeroSection } from "@/components/features/pet-care/HeroSection";
import { BoardingCtaSection } from "@/components/features/pet-care/BoardingCtaSection";
import { VetExpertiseSection } from "@/components/features/pet-care/VetExpertiseSection";
import { MeetDrSupsSection } from "@/components/features/pet-care/MeetDrSupsSection";
import { CompassionTaglineSection } from "@/components/features/pet-care/CompassionTaglineSection";

export const metadata: Metadata = {
  title: "Pet Care Tips & Education | Piggy Way Crossing",
  description:
    "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips to keep your small pets happy and healthy.",
  openGraph: {
    title: "Pet Care Tips & Education | Piggy Way Crossing",
    description:
      "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips.",
    type: "website",
  },
};

export default function PetCarePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pet Care Tips & Education",
    description:
      "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips.",
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: "https://piggyway.com.au/header-logo.png",
      },
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
        <BoardingCtaSection />
        <VetExpertiseSection />
        <MeetDrSupsSection />
        <CompassionTaglineSection />
      </div>
    </div>
  );
}

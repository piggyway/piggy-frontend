import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, Shield } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

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

const CARE_TOPICS = [
  {
    title: "Diet & Nutrition",
    description:
      "Understanding the essential balance of hay, pellets, and fresh veggies for your small pet's digestive health.",
    href: "/pet-care/guinea-pig-diet-guide",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Diet"
        width={60}
        height={60}
      />
    ),
    color: "bg-primary-navy",
    textColor: "text-white",
    accentColor: "bg-secondary-mint",
  },
  {
    title: "Housing Essentials",
    description:
      "How to set up the perfect habitat, choosing the right bedding, and maintaining a clean environment.",
    href: "#",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Housing"
        width={60}
        height={60}
      />
    ),
    color: "bg-white",
    textColor: "text-primary-navy",
    accentColor: "bg-primary-purple",
  },
  {
    title: "Health & Wellness",
    description:
      "Recognizing common ailments, grooming tips, and when to see a vet for your guinea pig or rabbit.",
    href: "#",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Health"
        width={60}
        height={60}
      />
    ),
    color: "bg-primary-gold",
    textColor: "text-primary-navy",
    accentColor: "bg-secondary-light-gold",
  },
  {
    title: "Bonding & Behavior",
    description:
      "Tips for taming, handling, and understanding the social needs of your furry friends.",
    href: "/pet-care/bonding-with-your-pet",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Bonding"
        width={60}
        height={60}
      />
    ),
    color: "bg-white",
    textColor: "text-primary-navy",
    accentColor: "bg-secondary-pink",
  },
];

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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <span className="bg-primary-purple/20 text-primary-navy mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
            Expert Knowledge Base
          </span>
          <h1 className="text-primary-navy mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Complete Care Guide for Your Small Pets
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            Everything you need to know about raising happy, healthy guinea pigs
            and rabbits. Written by experts, loved by pets.
          </p>
        </AnimatedSection>
      </section>

      {/* Topics Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {CARE_TOPICS.map((topic, index) => (
              <AnimatedSection
                key={index}
                className="group transition-transform hover:scale-[1.02]"
              >
                <Link
                  href={topic.href}
                  className={`relative flex min-h-[320px] h-full flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-sm ${topic.color}`}
                >
                  {/* Background Decor */}
                  <div
                    className={`absolute top-0 right-0 h-40 w-40 rounded-full opacity-20 blur-3xl ${topic.accentColor}`}
                  />

                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-sm">
                      {topic.icon}
                    </div>
                    <h3
                      className={`mb-3 text-2xl font-bold ${topic.textColor}`}
                    >
                      {topic.title}
                    </h3>
                    <p
                      className={`max-w-md text-lg ${
                        topic.textColor === "text-white"
                          ? "text-white/90"
                          : "text-gray-600"
                      }`}
                    >
                      {topic.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center justify-end">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-colors group-hover:bg-gray-50"
                      aria-label={`Read more about ${topic.title}`}
                    >
                      <ArrowUpRight className="text-primary-navy h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            <Heart className="text-primary-navy/20 mx-auto mb-6 h-12 w-12" />
            <h2 className="text-primary-navy mb-6 text-3xl font-bold sm:text-4xl">
              Join the Piggy Way Community
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Have questions? Our community of passionate pet parents is here to
              help. Share stories, get advice, and connect with fellow small pet
              lovers.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary-navy hover:bg-primary-navy-light rounded-full px-8 py-3 font-semibold text-white transition-colors">
                Join Community
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

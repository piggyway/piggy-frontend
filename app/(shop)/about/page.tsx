import { Metadata } from "next";
import Image from "next/image";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { Heart, Shield, Sparkles, Smile } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Piggy Way Crossing",
  description:
    "We are Piggy Way Crossing - passionate pet parents dedicated to creating the best products for guinea pigs and rabbits.",
  openGraph: {
    title: "About Us | Piggy Way Crossing",
    description:
      "We are Piggy Way Crossing - passionate pet parents dedicated to creating the best products for guinea pigs and rabbits.",
    type: "website",
  },
};

const VALUES = [
  {
    title: "Pet-First Design",
    description:
      "Every product is tested and approved by our own furry companions.",
    icon: <Heart className="text-secondary-pink h-6 w-6" />,
  },
  {
    title: "Quality & Safety",
    description:
      "We use only pet-safe materials and rigorous quality control standards.",
    icon: <Shield className="text-primary-gold h-6 w-6" />,
  },
  {
    title: "Community Driven",
    description:
      "Listening to feedback from pet parents to constantly improve.",
    icon: <Smile className="text-secondary-blue h-6 w-6" />,
  },
  {
    title: "Innovation",
    description: "Reimagining small pet care with modern, functional designs.",
    icon: <Sparkles className="text-primary-purple h-6 w-6" />,
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Piggy Way Crossing",
    description:
      "We are Piggy Way Crossing - passionate pet parents dedicated to creating the best products for guinea pigs and rabbits.",
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: "https://piggywaycrossing.com/header-logo.png",
      },
      foundingDate: "2024",
    },
  };

  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={2} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h1 className="text-primary-navy mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Designed by Pet Parents,
            <br />
            <span className="text-primary-navy-light">For Pet Parents</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            At Piggy Way Crossing, we believe small pets deserve the same
            quality, comfort, and style as any other family member.
          </p>
        </AnimatedSection>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-12">
        <AnimatedSection className="mx-auto max-w-[1160px]">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="bg-secondary-mint/30 relative min-h-[300px] p-8 sm:p-12 md:min-h-[500px]">
                {/* Decorative Images */}
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/our-story/default2.png"
                    alt="Happy Guinea Pig"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16">
                <h2 className="text-primary-navy mb-6 text-3xl font-bold">
                  Our Mission
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    It started with a simple problem: finding high-quality,
                    stylish, and safe products for our own guinea pigs was
                    harder than it should be.
                  </p>
                  <p>
                    We set out to change that. We combine veterinary knowledge
                    with modern design to create essentials that look good in
                    your home and feel great for your pets.
                  </p>
                  <p>
                    From ultra-soft liners to ergonomic hideouts, everything we
                    make is designed to enrich the lives of small animals and
                    simplify daily care for their owners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Values Grid */}
      <section className="container mx-auto px-4 py-24">
        <AnimatedSection>
          <div className="mb-12 text-center">
            <h2 className="text-primary-navy text-3xl font-bold">
              Why We Do It
            </h2>
          </div>
          <div className="mx-auto grid max-w-[1160px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-gray-50 p-3">
                  {value.icon}
                </div>
                <h3 className="text-primary-navy mb-2 text-xl font-bold">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}

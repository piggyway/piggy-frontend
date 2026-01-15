import { Metadata } from "next";
import Image from "next/image";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  Heart,
  Shield,
  Sparkles,
  Smile,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Piggy Way Crossing - Small Pet Supplies & Care",
  description:
    "Piggyway was created by people who live alongside guinea pigs — not as a hobby, but as family. Learn about our story, our purpose, and the journey of McFlurry that started it all.",
  keywords: [
    "guinea pig care",
    "Piggy Way Crossing story",
    "small animal rescue",
    "guinea pig supplies",
    "ethical pet care",
  ],
  openGraph: {
    title: "About Us | Piggy Way Crossing",
    description:
      "Piggyway was created by people who live alongside guinea pigs — not as a hobby, but as family. Learn about our story, our purpose, and the journey of McFlurry.",
    type: "website",
    url: "https://piggyway.com.au/about",
    images: [
      {
        url: "/our-story/default2.png",
        width: 1200,
        height: 630,
        alt: "Piggy Way Crossing Team",
      },
    ],
  },
};

const VALUES = [
  {
    title: "Clear Education",
    description:
      "We provide honest, accessible guidance to help owners make informed decisions about their pets' wellbeing.",
    icon: <HelpCircle className="text-secondary-pink h-6 w-6" />,
  },
  {
    title: "Real Experience",
    description:
      "Our healthy care habits are built on years of hands-on experience living with and caring for guinea pigs.",
    icon: <Heart className="text-primary-gold h-6 w-6" />,
  },
  {
    title: "Thoughtful Products",
    description:
      "We only offer products that genuinely help—carefully selected to support the health and happiness of your animals.",
    icon: <Sparkles className="text-secondary-blue h-6 w-6" />,
  },
  {
    title: "Compassionate Care",
    description:
      "We believe every guinea pig deserves patience, respect, and love, regardless of their background or health.",
    icon: <Smile className="text-primary-purple h-6 w-6" />,
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Piggy Way Crossing",
    description:
      "Piggyway was created by people who live alongside guinea pigs — not as a hobby, but as family.",
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: "https://piggyway.com.au/header-logo.png",
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
      <section className="container mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <AnimatedSection className="mx-auto max-w-4xl text-center">
          <h1 className="text-primary-navy mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Created by people who live alongside guinea pigs
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Not as a hobby, but as family. Every member of our team is a guinea
            pig carer.
          </p>
          <div className="mt-8 max-w-3xl mx-auto text-gray-600 italic">
            "In our hardest moments, these small, gentle animals have given us
            comfort, stability, and quiet emotional support. They’ve reminded us
            to slow down, to care deeply, and to show up every day. That
            connection is at the heart of Piggyway."
          </div>
        </AnimatedSection>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-12">
        <AnimatedSection className="mx-auto max-w-[1160px]">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-gray-100">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="bg-secondary-mint/30 relative min-h-[300px] p-8 sm:p-12 md:min-h-[500px]">
                {/* Decorative Images */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-64 w-64 md:h-80 md:w-80">
                    <Image
                      src="/our-story/default2.png"
                      alt="McFlurry the Guinea Pig"
                      fill
                      className="object-contain drop-shadow-md transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16">
                <span className="text-primary-pink mb-2 font-semibold tracking-wide uppercase">
                  Our Story
                </span>
                <h2 className="text-primary-navy mb-6 text-3xl font-bold sm:text-4xl">
                  It Began With McFlurry
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    He came into our lives unexpectedly, at a time when there
                    was no clear or reliable guidance on how to truly care for
                    guinea pigs. We didn’t start with experience or confidence —
                    only the determination to give him a safe home.
                  </p>
                  <p>
                    Before being rehomed, McFlurry had lived in poor conditions.
                    Out of fear, he hid in his small shelter, surrounded by old
                    hay and his own waste. Over time, he became critically ill,
                    suffering from a severe mite infestation and seizures. For a
                    moment, we almost lost him.
                  </p>
                  <p className="font-medium text-gray-900">
                    But giving up was never an option.
                  </p>
                  <p>
                    Despite financial hardship, we sought treatment through the
                    RSPCA and committed to his recovery. With patience, care,
                    and consistency, McFlurry survived — and slowly began to
                    thrive.
                  </p>
                  <p className="italic">
                    That journey changed us. It taught us how fragile guinea
                    pigs can be, how much daily care and hygiene truly matter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Purpose Section */}
      <section className="bg-white/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <span className="text-primary-purple mb-2 block font-semibold tracking-wide uppercase">
                Our Purpose
              </span>
              <h2 className="text-primary-navy text-3xl font-bold sm:text-4xl">
                So Others Don't Have to Learn Through Fear
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Our mission is to encourage responsible, informed guinea pig
                care — to help carers understand not only <strong>what</strong>{" "}
                to buy, but <strong>how and why</strong> it supports their
                animals’ wellbeing.
              </p>
            </div>
            <div className="mx-auto grid max-w-[1160px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value, index) => (
                <div
                  key={index}
                  className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-gray-100">
                    {value.icon}
                  </div>
                  <h3 className="text-primary-navy mb-3 text-xl font-bold">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-24 pt-12">
        <AnimatedSection className="mx-auto max-w-4xl rounded-[3rem] bg-gradient-to-br from-[#E6F4F1] to-[#F0F7FF] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <CheckCircle2 className="text-primary-mint h-8 w-8" />
          </div>
          <h2 className="text-primary-navy mb-6 text-3xl font-bold sm:text-4xl">
            A Kinder Future for Guinea Pigs
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            We believe guinea pigs deserve patience, respect, and love. And we
            believe carers deserve support they can trust. Piggyway is here to
            help build better care, deeper bonds, and a kinder future for guinea
            pigs and the people who love them. 🤍
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/shop-all"
              className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-900/10 transition-all hover:ring-gray-900/20"
            >
              Start Your Journey
            </a>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}

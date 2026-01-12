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
    "Discover the story behind Piggy Way Crossing. We're a team of passionate pet parents creating safe, cozy, and stylish products for guinea pigs and rabbits.",
  keywords: [
    "guinea pig supplies",
    "rabbit accessories",
    "small pet care",
    "fleece liners",
    "C&C cages",
    "Piggy Way Crossing story",
  ],
  openGraph: {
    title: "About Us | Piggy Way Crossing",
    description:
      "From our herd to yours: dedicated to creating the safest, most comfortable living spaces for small pets.",
    type: "website",
    url: "https://piggyway.com.au/about",
    images: [
      {
        url: "/our-story/default2.png", // Assuming this exists based on previous file
        width: 1200,
        height: 630,
        alt: "Piggy Way Crossing Team",
      },
    ],
  },
};

const VALUES = [
  {
    title: "Pet-First Design",
    description:
      "We don't just guess what pets like; we watch them. Every tunnel, hidey, and liner is tested by our own herd for maximum 'popcorning' potential.",
    icon: <Heart className="text-secondary-pink h-6 w-6" />,
  },
  {
    title: "Safety Obsessed",
    description:
      "Small pets are sensitive. That's why we use non-toxic materials, hidden seams, and guinea-pig-safe fabrics that prevent toe snags.",
    icon: <Shield className="text-primary-gold h-6 w-6" />,
  },
  {
    title: "Community Heart",
    description:
      "We're not some big faceless corporation. We're active in the rescue community and listen to fellow piggy parents to keep improving.",
    icon: <Smile className="text-secondary-blue h-6 w-6" />,
  },
  {
    title: "Built to Last",
    description:
      "Cage cleaning happens a lot. Our products are designed to withstand hundreds of wash cycles without losing their shape or softness.",
    icon: <Sparkles className="text-primary-purple h-6 w-6" />,
  },
];

const FAQS = [
  {
    question: "Are your materials safe for chewers?",
    answer:
      "Safety is our priority. While no fabric is 100% chew-proof against a determined bun or piggy, we use durable, high-quality fleece and cotton blends that are resistant to wear. We also structure our items to minimize loose threads that could pose a danger.",
  },
  {
    question: "How do I wash your fleece liners?",
    answer:
      "It's easy! Brush off hay and poop, then wash on a cold or warm cycle with pet-safe detergent. Avoid fabric softeners as they can affect the wicking ability of the fleece. Air dry or tumble dry on low heat.",
  },
  {
    question: "Where do you ship from?",
    answer:
      "We ship all our cozy creations directly from our workshop. We take pride in packing every order with care to ensure it arrives safely at your doorstep.",
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
        url: "https://piggyway.com.au/header-logo.png",
      },
      foundingDate: "2024",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: FAQS.map((faq, index) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
        position: index + 1,
      })),
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
            More Than Just a Pet Store,
            <br />
            <span className="text-primary-navy-light mt-2 block">
              We're a Piggy Paradise.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Welcome to Piggy Way Crossing. We believe that small pets deserve
            big love. Our mission is to provide the highest quality, safest, and
            most stylish supplies for your guinea pigs and rabbits, because they
            are family.
          </p>
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
                  {/* Placeholder for a lifestyle image of a guinea pig interacting with product */}
                  <div className="relative h-64 w-64 md:h-80 md:w-80">
                    <Image
                      src="/our-story/default2.png"
                      alt="Happy Guinea Pig in a cozy hidey"
                      fill
                      className="object-contain drop-shadow-md transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16">
                <span className="text-primary-pink mb-2 font-semibold tracking-wide uppercase">
                  Our Start
                </span>
                <h2 className="text-primary-navy mb-6 text-3xl font-bold sm:text-4xl">
                  It Started With a Wheek
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>
                    Like many of you, our journey began with a simple search for
                    better bedding. We found that most pet store options were
                    dusty, expensive, or just plain boring. We knew our piggies
                    deserved better.
                  </p>
                  <p>
                    So, we got to work. Combining a background in design with a
                    deep love for animals, Piggy Way Crossing was born. We
                    wanted to create a place where function meets
                    fashion—products that actually work for pet parents while
                    looking amazing in your home.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of happy herds across
                    the country, constantly innovating ("wheeking"?) to bring
                    you the best in small pet care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Values Grid */}
      <section className="bg-white/50 py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mb-16 text-center">
              <span className="text-primary-purple mb-2 block font-semibold tracking-wide uppercase">
                Our Promise
              </span>
              <h2 className="text-primary-navy text-3xl font-bold sm:text-4xl">
                The Piggy Way Standard
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                We take quality seriously. If it's not good enough for our pets,
                it's not good enough for yours.
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

      {/* FAQ Section - Using native details/summary for clear, lightweight interaction */}
      <section className="container mx-auto px-4 py-24">
        <AnimatedSection className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-primary-navy mb-4 text-3xl font-bold sm:text-4xl">
              Common Questions
            </h2>
            <p className="text-lg text-gray-600">
              Curious about our process? Here are some answers.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-gray-200 bg-white [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-50">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="text-primary-mint h-5 w-5" />
                    {faq.question}
                  </span>
                  <span className="text-gray-400 transition group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-gray-100 px-6 pt-2 pb-6 pl-[3.25rem] leading-relaxed text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-24">
        <AnimatedSection className="mx-auto max-w-4xl rounded-[3rem] bg-gradient-to-br from-[#E6F4F1] to-[#F0F7FF] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <CheckCircle2 className="text-primary-mint h-8 w-8" />
          </div>
          <h2 className="text-primary-navy mb-6 text-3xl font-bold sm:text-4xl">
            Join Our Community
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            We love seeing your setups! Follow us on social media and tag us to
            be featured. Let's make the world a better place for small pets, one
            popcorn at a time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* These would normally range from links to social accounts */}
            <a
              href="/products"
              className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-900/10 transition-all hover:ring-gray-900/20"
            >
              Shop Essentials
            </a>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}

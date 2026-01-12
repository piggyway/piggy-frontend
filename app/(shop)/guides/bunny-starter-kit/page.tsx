import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export const metadata: Metadata = {
  title:
    "Rabbit Starter Kit: Everything You Need for Day One | Piggy Way Crossing",
  description:
    "Preparing for a new bunny? Use our comprehensive checklist to ensure you have the right housing, food, and litter supplies ready.",
  openGraph: {
    title: "Rabbit Starter Kit: Everything You Need for Day One",
    description:
      "Preparing for a new bunny? Use our comprehensive checklist to ensure you have the right supplies.",
    type: "article",
    publishedTime: "2024-03-28T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Rabbit Care", "New Bunny Guide", "Checklist"],
  },
};

export default function BunnyStarterKitPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Rabbit Starter Kit: Everything You Need for Day One",
    image: "https://piggyway.com.au/shop-with-us/default.png",
    author: {
      "@type": "Organization",
      name: "Piggy Way Crossing Team",
      url: "https://piggyway.com.au",
    },
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: "https://piggyway.com.au/header-logo.png",
      },
    },
    datePublished: "2024-03-28",
    dateModified: "2024-03-28",
    description:
      "Preparing for a new bunny? Use our comprehensive checklist to ensure you have the right housing, food, and litter supplies ready.",
  };

  return (
    <div className="selection:bg-secondary-mint/20 min-h-screen bg-white font-sans text-gray-900">
      <BackgroundBlobs variant={1} className="opacity-30" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-10 container mx-auto max-w-3xl px-6 py-12 sm:py-20">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/"
            className="group hover:text-primary-navy inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-primary-navy mb-6 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Rabbit Starter Kit: Everything You Need
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="hidden sm:inline">•</span>
            <span>March 28, 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>4 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/shop-with-us/default.png"
            alt="Rabbit essentials"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-headings:text-primary-navy prose-a:text-secondary-mint prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none leading-relaxed text-gray-700">
          <p className="lead mb-8 text-xl text-gray-600">
            Rabbits make wonderful, intelligent companions, but they have very
            specific needs. Forget the backyard hutch—modern bunnies live
            indoors as part of the family.
          </p>

          <div className="my-10 rounded-xl border border-gray-200 bg-gray-50 p-8">
            <h3 className="text-primary-navy mt-0 mb-6 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="text-secondary-mint h-6 w-6" />
              The Bunny Checklist
            </h3>
            <ul className="m-0 grid list-none gap-3 pl-0">
              {[
                "Exercise Pen (X-Pen) or Large Enclosure",
                "Litter Box (Large cat size)",
                "Paper-Based Litter",
                "Unlimited Timothy Hay",
                "High-Quality Rabbit Pellets",
                "Heavy Ceramic Water Bowl",
                "Hideout / Cardboard Box",
                "Chew Toys (Untreated wood)",
                "Hay Feeder",
                "Cord Protectors (Bunny proofing!)",
              ].map((item, i) => (
                <li key={i} className="m-0 flex items-start gap-3 text-base">
                  <span className="text-secondary-mint mt-1 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-10 border-gray-200" />

          <h2>1. Housing: X-Pens &gt; Cages</h2>
          <p>
            Most commercial rabbit cages are too small. An exercise pen (X-Pen)
            for dogs is actually the best starter home for a bunny. It provides
            ample room to hop, stretch, and flop.
          </p>
          <p>
            Line the floor with a waterproof fleece liner to protect your
            carpets and give your bunny traction.
          </p>

          <h2>2. Litter Training Essentials</h2>
          <p>Yes, rabbits can be litter trained!</p>
          <ul>
            <li>
              <strong>The Box:</strong> Get a large cat litter box (no lid).
            </li>
            <li>
              <strong>The Litter:</strong> Use paper-based pellets (like
              Yesterday's News). Never use clumping clay litter.
            </li>
            <li>
              <strong>The Trick:</strong> Place a pile of hay inside the litter
              box. Rabbits like to poop where they eat!
            </li>
          </ul>

          <h2>3. Diet</h2>
          <p>Like guinea pigs, rabbits need 80% hay.</p>
          <ul>
            <li>
              <strong>Hay:</strong> Unlimited Timothy hay.
            </li>
            <li>
              <strong>Veg:</strong> Dark leafy greens (romaine, parsley,
              cilantro).
            </li>
            <li>
              <strong>Pellets:</strong> A small amount (1/4 cup per 5 lbs body
              weight) of plain timothy pellets.
            </li>
          </ul>

          <h2>4. Bunny Proofing</h2>
          <p>
            Rabbits love to chew wires. Before bringing your bunny home, cover
            all accessible cords with plastic tubing or block access to them. It
            protects your electronics and, more importantly, keeps your bunny
            safe from electric shock.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy mb-6 text-2xl font-bold">
            Bunny Essentials
          </h3>
          <div className="bg-secondary-mint/20 text-primary-navy relative overflow-hidden rounded-2xl p-8 sm:p-10">
            <div className="relative z-10 max-w-lg">
              <h4 className="mb-3 text-2xl font-bold">X-Pen Floor Liners</h4>
              <p className="text-primary-navy/80 mb-6 text-lg">
                Our extra-large liners are designed specifically for standard
                4x4 exercise pens. Waterproof, washable, and bunny-approved.
              </p>
              <Link
                href="/shop-all"
                className="bg-primary-navy hover:bg-primary-navy-light inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-sm transition-colors"
              >
                Shop Bunny Liners <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Decorative circle */}
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

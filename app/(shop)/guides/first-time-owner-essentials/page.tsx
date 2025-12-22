import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export const metadata: Metadata = {
  title:
    "First-Time Guinea Pig Owner: Complete Essentials Checklist | Piggy Way Crossing",
  description:
    "Bringing home your first guinea pigs? Here's the ultimate checklist of everything you need for a happy, healthy start.",
  openGraph: {
    title: "First-Time Guinea Pig Owner: Complete Essentials Checklist",
    description:
      "Bringing home your first guinea pigs? Here's the ultimate checklist of everything you need.",
    type: "article",
    publishedTime: "2024-03-15T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["New Owner Guide", "Guinea Pig Essentials", "Checklist"],
  },
};

export default function FirstTimeOwnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "First-Time Guinea Pig Owner: Complete Essentials Checklist",
    image: "https://piggywaycrossing.com/shop-with-us/default.png",
    author: {
      "@type": "Organization",
      name: "Piggy Way Crossing Team",
      url: "https://piggywaycrossing.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: "https://piggywaycrossing.com/header-logo.png",
      },
    },
    datePublished: "2024-03-15",
    dateModified: "2024-03-15",
    description:
      "Bringing home your first guinea pigs? Here's the ultimate checklist of everything you need for a happy, healthy start.",
  };

  return (
    <div className="selection:bg-primary-gold/20 min-h-screen bg-white font-sans text-gray-900">
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
            First-Time Guinea Pig Owner Checklist
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="hidden sm:inline">•</span>
            <span>March 15, 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>4 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/shop-with-us/default.png"
            alt="Guinea pig essentials collection"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-headings:text-primary-navy prose-a:text-primary-gold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none leading-relaxed text-gray-700">
          <p className="lead mb-8 text-xl text-gray-600">
            Congratulations on your new furry family members! To make your
            shopping trip easier, we've compiled the definitive list of
            must-haves for day one.
          </p>

          <div className="my-10 rounded-xl border border-gray-200 bg-gray-50 p-8">
            <h3 className="text-primary-navy mt-0 mb-6 flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="text-primary-gold h-6 w-6" />
              The Essential Checklist
            </h3>
            <ul className="m-0 grid list-none gap-3 pl-0">
              {[
                "Large Cage (Min 7.5 sq ft, ideally 10.5+)",
                "Appropriate Bedding (Fleece or Aspen)",
                "Unlimited Timothy Hay",
                "High-Quality Pellets (Plain, no seeds)",
                "Two Water Bottles (Glass preferred)",
                "Two Ceramic Food Bowls",
                "Hideouts (One per pig minimum)",
                "Vitamin C Supplements (or high-C veggies)",
                "Nail Clippers & Styptic Powder",
                "Small Animal Carrier",
              ].map((item, i) => (
                <li key={i} className="m-0 flex items-start gap-3 text-base">
                  <span className="text-primary-gold mt-1 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="my-10 border-gray-200" />

          <h2>1. Housing & Bedding</h2>
          <p>
            Your pigs need room to zoom! Skip the small pet store cages and opt
            for a C&C cage or a Midwest habitat. For bedding, fleece liners are
            the modern standard—they're reusable, save money over time, and are
            much cleaner than wood shavings.
          </p>

          <h2>2. Diet Basics</h2>
          <p>
            <strong>Hay is life.</strong> It should make up 80% of their diet.
            Stock up on a large bag of Timothy hay.
          </p>
          <p>
            For pellets, look for plain Timothy-based pellets (like Oxbow).
            Avoid the colorful mixes with seeds and dried fruit; they are
            unhealthy "junk food."
          </p>

          <h2>3. Hideouts & Comfort</h2>
          <p>
            Guinea pigs are prey animals and need to feel secure. A simple
            plastic igloo is fine, but soft fleece hideouts and tunnels provide
            extra comfort and warmth.
          </p>

          <h2>4. Health Kit</h2>
          <p>
            Be prepared for minor grooming. Guinea pig nails grow fast and need
            trimming every 2-4 weeks. A small pair of animal nail clippers is
            essential.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy mb-6 text-2xl font-bold">
            Get Started with Our Bundles
          </h3>
          <div className="bg-primary-navy relative overflow-hidden rounded-2xl p-8 text-white sm:p-10">
            <div className="relative z-10 max-w-lg">
              <h4 className="mb-3 text-2xl font-bold text-white">
                New Piggy Parent Starter Kit
              </h4>
              <p className="mb-6 text-lg text-white/80">
                We've bundled our best-selling fleece liners, a cozy hideout,
                and a hay bag into one convenient, discounted package.
              </p>
              <Link
                href="/shop-all"
                className="text-primary-navy inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold transition-colors hover:bg-gray-100"
              >
                Shop Starter Kits <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Decorative circle */}
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Check, X } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

/**
 * Dates taken from this file's git history: PUBLISHED_ON is the commit that
 * created the article, UPDATED_ON the last one that changed its copy.
 *
 * The previous values claimed March 2024, which is before this repository
 * existed (first commit 2025-10-27), so they were placeholders rather than
 * real dates. The byline, the OpenGraph tags and the Article JSON-LD all read
 * these constants so they cannot disagree.
 */
const PUBLISHED_ON = "2025-12-20";
const UPDATED_ON = "2026-08-06";

export const metadata: Metadata = {
  title: "Why Fleece Cage Liners Are a Game-Changer",
  description:
    "Still using wood shavings? Discover why fleece cage liners are the cleaner, healthier, and eco-friendly choice for guinea pigs.",
  alternates: { canonical: "/guides/cage-liner-benefits" },
  openGraph: {
    title: "Why Fleece Cage Liners Are a Game-Changer",
    description:
      "Still using wood shavings? Discover why fleece cage liners are the cleaner, healthier choice.",
    type: "article",
    images: ["/shop-with-us/default.png"],
    publishedTime: `${PUBLISHED_ON}T00:00:00.000Z`,
    authors: ["Piggy Way Crossing Team"],
    tags: ["Fleece Liners", "Cage Cleaning", "Sustainable Pet Care"],
  },
};

export default function CageLinerBenefitsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Why Fleece Cage Liners Are a Game-Changer",
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
    datePublished: PUBLISHED_ON,
    dateModified: UPDATED_ON,
    description:
      "Still using wood shavings? Discover why fleece cage liners are the cleaner, healthier, and eco-friendly choice for guinea pigs.",
  };

  return (
    <div className="selection:bg-secondary-blue/20 min-h-screen bg-white font-sans text-gray-900">
      <BackgroundBlobs variant={2} className="opacity-30" />
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
            Why Fleece Liners Are a Game-Changer
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              {new Date(PUBLISHED_ON).toLocaleDateString("en-AU", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>3 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/shop-with-us/default.png"
            alt="Fleece cage liner in use"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-a:text-primary-navy prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary-navy-light prose-headings:text-primary-navy prose-img:rounded-xl max-w-none leading-relaxed text-gray-700">
          <p className="lead mb-8 text-xl text-gray-600">
            If you&apos;re tired of buying bags of wood shavings, dealing with
            dust, and constantly scooping mess, it&apos;s time to switch to
            fleece.
          </p>

          <div className="not-prose my-10 grid gap-6 md:grid-cols-2">
            <div className="border-destructive/20 bg-destructive/10 rounded-xl border p-6">
              <h4 className="text-destructive mb-4 flex items-center gap-2 font-bold">
                <X className="h-5 w-5" /> Traditional Bedding
              </h4>
              <ul className="text-destructive space-y-2 text-sm">
                <li>• Dusty (bad for lungs)</li>
                <li>• Messy, gets everywhere</li>
                <li>• Recurring monthly cost</li>
                <li>• Hard to spot clean</li>
              </ul>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-6 shadow-sm">
              <h4 className="mb-4 flex items-center gap-2 font-bold text-green-800">
                <Check className="h-5 w-5" /> Fleece Liners
              </h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Dust-free & hypo-allergenic</li>
                <li>• Stays in the cage</li>
                <li>• One-time purchase</li>
                <li>• Easy daily sweep</li>
              </ul>
            </div>
          </div>

          <hr className="my-10 border-gray-200" />

          <h2>1. Healthier for Lungs</h2>
          <p>
            Guinea pigs have sensitive respiratory systems. Wood shavings—even
            &quot;safe&quot; ones like aspen—can be dusty. Pine and cedar
            shavings contain aromatic oils (phenols) that can damage the liver
            and respiratory tract over time.
          </p>
          <p>
            Fleece is virtually dust-free, making it the safest option for your
            pet (and great for owners with allergies too!).
          </p>

          <h2>2. Saves Money in the Long Run</h2>
          <p>
            While the initial cost of a few liners is higher than a bag of
            bedding, they are reusable for years. Imagine never having to buy
            disposable bedding again. The savings add up quickly.
          </p>

          <h2>3. Easier Spot Cleaning</h2>
          <p>
            With fleece, daily maintenance is a breeze. Simply use a hand broom
            or vacuum to sweep up poops once or twice a day. No more wrestling
            with messy clumps of soiled wood chips.
          </p>

          <h2>4. Comfort & Style</h2>
          <p>
            Fleece is soft and warm. It mimics the feeling of natural ground
            better than hard pellets or shavings. Plus, it comes in endless
            patterns and colors to match your home decor!
          </p>

          <h2>How Piggy Way Crossing Liners Are Different</h2>
          <p>Not all liners are created equal. Ours feature:</p>
          <ul>
            <li>
              <strong>Wicking Fleece Top Layer:</strong> Pulls moisture down
              instantly so the surface stays dry.
            </li>
            <li>
              <strong>Absorbent Core:</strong> Traps liquid and odor
              effectively.
            </li>
            <li>
              <strong>Waterproof Base:</strong> Protects your cage floor from
              leaks.
            </li>
          </ul>
          <p>
            If absorbency matters most to you, the{" "}
            <Link href="/shop/liner/bouncy-fluffy-liner">
              Bouncy Fluffy Liner
            </Link>{" "}
            is the softest of the range. Browse the{" "}
            <Link href="/shop-all?category=liner">full liner range</Link> to
            compare sizes and colours.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy mb-6 text-2xl font-bold">
            Ready to Switch?
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop/liner/comfy-base-liner"
              className="group hover:border-secondary-blue block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-secondary-blue mb-2 text-lg font-bold transition-colors">
                Comfy Base Liner
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                A budget-friendly everyday liner, easy to use and simple to
                clean.
              </p>
              <span className="text-secondary-blue flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/shop/liner/cool-breeze-liner"
              className="group hover:border-secondary-blue block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-secondary-blue mb-2 text-lg font-bold transition-colors">
                Cool Breeze Liner
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                A premium cool-touch liner that resists hay and fur and shakes
                clean easily.
              </p>
              <span className="text-secondary-blue flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Bonding & Building Trust with Your Guinea Pig | Piggy Way Crossing",
  description:
    "Bonding with a guinea pig is a quiet, emotional process. Learn how to build trust through patience, consistency, and gentle everyday moments.",
  openGraph: {
    title: "Bonding & Building Trust with Your Guinea Pig | Piggy Way Crossing",
    description:
      "Bonding with a guinea pig is a quiet, emotional process. Learn how to build trust through patience, consistency, and gentle everyday moments.",
    type: "article",
    publishedTime: "2024-03-25T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Bonding", "Guinea Pig Care", "Trust Training"],
  },
};

export default function BondingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bonding & Building Trust with Your Guinea Pig",
    image: "https://piggyway.com.au/pet-care-tips/default1.png",
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
    datePublished: "2024-03-25",
    dateModified: new Date().toISOString().split("T")[0],
    description:
      "Bonding with a guinea pig is a quiet, emotional process built through everyday moments.",
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1C1C1E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[680px] px-6 py-12 md:py-20">
        {/* Navigation */}
        <nav className="mb-12">
          <Link
            href="/pet-care"
            className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pet Care
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-gray-900 leading-[1.1]">
            Bonding & Building Trust with Your Guinea Pig
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="text-gray-300">•</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900">
          <p className="text-xl leading-relaxed text-gray-600 mb-10 font-normal">
            Bonding with a guinea pig is a quiet, emotional process built through
            everyday moments. Trust grows when their world feels safe,
            predictable, and filled with gentle connection.
          </p>
          <p>
            For prey animals, feeling secure always comes first — affection
            follows naturally.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            Positive Experiences & Enrichment
          </h2>
          <p>
            Positive experiences help lay the foundation. Offering special,
            high-value treats creates joy and anticipation, helping guinea pigs
            associate your presence with comfort and good things.
          </p>
          <p>
            Enrichment matters too. Tunnels, foraging activities, and new
            textures give them reasons to explore and feel confident in their
            space. A fulfilled guinea pig is a calmer one, and calm is where
            trust begins.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            Safety in Hideouts
          </h2>
          <p>
            Soft, well-sized hideouts allow them to rest without fear. Many
            guinea pigs instinctively choose corners for toileting, so setting up
            clean, thoughtfully arranged toilet areas in those spots supports
            both comfort and routine.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 my-8">
            <p className="m-0 text-gray-700 italic">
              "When a hide is placed over or beside the toilet area, they can eat
              and rest while feeling protected — a small detail that makes a big
              emotional difference."
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            Daily Interaction
          </h2>
          <p>
            Just as important is daily interaction. Spending time with your
            guinea pig every day helps them grow accustomed to human presence and
            learn that people bring warmth, not fear.
          </p>
          <p>
            Sitting nearby, speaking softly, hand-feeding treats, or simply
            sharing quiet time allows them to connect at their own pace. Through
            these gentle moments, they begin to feel included in your life.
          </p>

          <hr className="my-12 border-gray-100" />

          <p className="text-lg font-medium text-gray-900">
            Over time, your patience becomes safety, your presence becomes
            familiar, and your care becomes trust.
          </p>
          <p className="text-gray-600">
            In that trust, guinea pigs open up — showing curiosity, comfort, and
            the soft, unspoken bond that forms when warmth is shared and
            received.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-20 border-t border-gray-100 pt-12">
          <h3 className="text-gray-900 mb-6 text-xl font-bold">
            Bonding Tools
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <h4 className="mb-2 text-lg font-bold text-gray-900">
                Cuddle Sacks
              </h4>
              <p className="text-gray-600 mb-6 text-sm">
                The perfect safe space for lap time snuggles.
              </p>
              <Link
                href="/shop-all"
                className="inline-flex items-center gap-2 font-medium text-gray-900 hover:text-gray-700 underline underline-offset-4 decoration-gray-300"
              >
                Shop Comfort <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <h4 className="mb-2 text-lg font-bold text-gray-900">
                Playpens & Mats
              </h4>
              <p className="text-gray-600 mb-6 text-sm">
                Set up a secure, waterproof area for floor time bonding.
              </p>
              <Link
                href="/shop-all"
                className="inline-flex items-center gap-2 font-medium text-gray-900 hover:text-gray-700 underline underline-offset-4 decoration-gray-300"
              >
                Shop Setup <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

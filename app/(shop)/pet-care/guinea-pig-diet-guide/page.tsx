import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export const metadata: Metadata = {
  title: "Guinea Pig Diet Guide: What to Feed Your Piggy | Piggy Way Crossing",
  description:
    "Complete guide to a healthy guinea pig diet. Learn about the perfect balance of hay, pellets, and fresh vegetables for optimal health and longevity.",
  openGraph: {
    title: "Guinea Pig Diet Guide: What to Feed Your Piggy",
    description:
      "Complete guide to a healthy guinea pig diet. Learn about the perfect balance of hay, pellets, and fresh vegetables.",
    type: "article",
    publishedTime: "2024-03-20T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Guinea Pig Diet", "Pet Nutrition", "Small Animal Care"],
  },
};

export default function DietGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guinea Pig Diet Guide: What to Feed Your Piggy",
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
    datePublished: "2024-03-20",
    dateModified: "2024-03-20",
    description:
      "Complete guide to a healthy guinea pig diet. Learn about the perfect balance of hay, pellets, and fresh vegetables for optimal health and longevity.",
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
            href="/pet-care"
            className="group hover:text-primary-navy inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Pet Care
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-primary-navy mb-6 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Guinea Pig Diet Guide: What to Feed Your Piggy
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="hidden sm:inline">•</span>
            <span>March 20, 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>5 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/pet-care-tips/default1.png"
            alt="Guinea pig eating fresh vegetables"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-headings:text-primary-navy prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-lg prose-p:leading-8 prose-a:text-secondary-mint prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none leading-relaxed text-gray-700">
          <p className="lead mb-8 text-xl text-gray-600">
            A balanced diet is the foundation of a happy, healthy guinea pig.
            Unlike many other pets, guinea pigs have very specific dietary
            requirements that must be met daily to prevent serious health
            issues.
          </p>

          <hr className="my-10 border-gray-200" />

          <h2>The Golden Rule: 80% Hay</h2>
          <p>
            The most critical component of a guinea pig's diet is high-quality
            hay. It should make up about{" "}
            <strong>80% of their total food intake</strong>. Why is hay so
            important?
          </p>
          <ul>
            <li>
              <strong>Digestive Health:</strong> The fiber in hay keeps their
              digestive system moving properly. Gut stasis is a serious risk for
              small pets.
            </li>
            <li>
              <strong>Dental Health:</strong> Guinea pig teeth never stop
              growing. Chewing on tough hay helps grind them down naturally.
            </li>
          </ul>
          <p>
            Timothy hay is the standard for adult guinea pigs. Orchard grass is
            a good alternative for those with allergies. Alfalfa hay should only
            be given to babies (under 6 months) or pregnant/nursing mothers due
            to its high calcium content.
          </p>

          <h2>Fresh Vegetables (10-15%)</h2>
          <p>
            Fresh veggies provide essential vitamins and hydration. Aim for
            about 1 cup of fresh vegetables per guinea pig, per day.
          </p>
          <h3>Best Daily Staples</h3>
          <ul>
            <li>Romaine lettuce (never iceberg)</li>
            <li>Green or red leaf lettuce</li>
            <li>Capsicum (excellent source of Vitamin C!)</li>
            <li>Cos heart lettuce</li>
            <li>Cucumber</li>
          </ul>

          <div className="my-8 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-6">
            <h4 className="mt-0 mb-2 font-bold text-blue-900">
              Important Note on Vitamin C
            </h4>
            <p className="mb-0 text-sm text-blue-800">
              Guinea pigs cannot produce their own Vitamin C (just like
              humans!). Scurvy is a real risk, so ensure they get plenty of
              Vitamin C-rich foods like capsicum daily.
            </p>
          </div>

          <h2>Pellets (5%)</h2>
          <p>
            Choose a high-quality, plain timothy-based pellet fortified with
            Vitamin C. Avoid "muesli" style mixes with seeds, nuts, or colored
            bits—these are choking hazards and are high in sugar/fat.
          </p>
          <p>
            <strong>Amount:</strong> About 15g per adult guinea pig per day
            is sufficient.
          </p>

          <h2>Foods to Avoid</h2>
          <p>Never feed your guinea pig:</p>
          <ul>
            <li>Iceberg lettuce (no nutritional value, causes diarrhea)</li>
            <li>Potatoes</li>
            <li>Onions and garlic</li>
            <li>Avocado (too high in fat)</li>
            <li>Nuts and seeds</li>
            <li>Dairy or meat products (they are strict herbivores)</li>
          </ul>

          <h2>Did You Know?</h2>
          <p>
            Guinea pigs practice <em>coprophagy</em>—eating their own soft poop
            (cecotropes). This might sound gross to us, but it's essential for
            them to absorb all the nutrients from their food, especially Vitamin
            B!
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy mb-6 text-2xl font-bold">
            Recommended Products
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop-all"
              className="group hover:border-secondary-mint block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-secondary-mint mb-2 text-lg font-bold transition-colors">
                Premium Fleece Liners
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                Keep their dining area clean with our absorbent, easy-wash
                liners.
              </p>
              <span className="text-secondary-mint flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/shop-all"
              className="group hover:border-primary-gold block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-primary-gold mb-2 text-lg font-bold transition-colors">
                Hay Bags & Accessories
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                Stylish hay bags to keep their favorite food accessible and
                tidy.
              </p>
              <span className="text-primary-gold flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

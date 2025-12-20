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
    image: "https://piggywaycrossing.com/pet-care-tips/default1.png",
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
    datePublished: "2024-03-20",
    dateModified: "2024-03-20",
    description:
      "Complete guide to a healthy guinea pig diet. Learn about the perfect balance of hay, pellets, and fresh vegetables for optimal health and longevity.",
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-secondary-mint/20">
      <BackgroundBlobs variant={1} className="opacity-30" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-3xl px-6 py-12 sm:py-20 relative z-10">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/pet-care"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Pet Care
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary-navy sm:text-4xl md:text-5xl leading-tight mb-6">
            Guinea Pig Diet Guide: What to Feed Your Piggy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 sm:justify-start justify-center">
            <span className="font-medium text-gray-900">Piggy Way Crossing Team</span>
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
        <article className="prose prose-lg prose-headings:text-primary-navy prose-a:text-secondary-mint prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none text-gray-700 leading-relaxed">
          <p className="lead text-xl text-gray-600 mb-8">
            A balanced diet is the foundation of a happy, healthy guinea pig. Unlike many other pets, guinea pigs have very specific dietary requirements that must be met daily to prevent serious health issues.
          </p>

          <hr className="my-10 border-gray-200" />

          <h2>The Golden Rule: 80% Hay</h2>
          <p>
            The most critical component of a guinea pig's diet is high-quality hay. It should make up about <strong>80% of their total food intake</strong>. Why is hay so important?
          </p>
          <ul>
            <li><strong>Digestive Health:</strong> The fiber in hay keeps their digestive system moving properly. Gut stasis is a serious risk for small pets.</li>
            <li><strong>Dental Health:</strong> Guinea pig teeth never stop growing. Chewing on tough hay helps grind them down naturally.</li>
          </ul>
          <p>
            Timothy hay is the standard for adult guinea pigs. Orchard grass is a good alternative for those with allergies. Alfalfa hay should only be given to babies (under 6 months) or pregnant/nursing mothers due to its high calcium content.
          </p>

          <h2>Fresh Vegetables (10-15%)</h2>
          <p>
            Fresh veggies provide essential vitamins and hydration. Aim for about 1 cup of fresh vegetables per guinea pig, per day.
          </p>
          <h3>Best Daily Staples</h3>
          <ul>
            <li>Romaine lettuce (never iceberg)</li>
            <li>Green or red leaf lettuce</li>
            <li>Bell peppers (excellent source of Vitamin C!)</li>
            <li>Cilantro</li>
            <li>Cucumber</li>
            <li>Zucchini</li>
          </ul>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <h4 className="text-blue-900 font-bold mt-0 mb-2">Important Note on Vitamin C</h4>
            <p className="text-blue-800 text-sm mb-0">
              Guinea pigs cannot produce their own Vitamin C (just like humans!). Scurvy is a real risk, so ensure they get plenty of Vitamin C-rich foods like bell peppers daily.
            </p>
          </div>

          <h2>Pellets (5%)</h2>
          <p>
            Choose a high-quality, plain timothy-based pellet fortified with Vitamin C. Avoid "muesli" style mixes with seeds, nuts, or colored bits—these are choking hazards and are high in sugar/fat.
          </p>
          <p>
            <strong>Amount:</strong> About 1/8 cup per adult guinea pig per day is sufficient.
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
            Guinea pigs practice <em>coprophagy</em>—eating their own soft poop (cecotropes). This might sound gross to us, but it's essential for them to absorb all the nutrients from their food, especially Vitamin B!
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-primary-navy mb-6">Recommended Products</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop-all"
              className="group block rounded-xl border border-gray-200 p-6 transition-all hover:border-secondary-mint hover:shadow-md bg-white"
            >
              <h4 className="font-bold text-lg text-primary-navy mb-2 group-hover:text-secondary-mint transition-colors">
                Premium Fleece Liners
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Keep their dining area clean with our absorbent, easy-wash liners.
              </p>
              <span className="text-sm font-semibold text-secondary-mint flex items-center gap-1">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
            
            <Link
              href="/shop-all"
              className="group block rounded-xl border border-gray-200 p-6 transition-all hover:border-primary-gold hover:shadow-md bg-white"
            >
              <h4 className="font-bold text-lg text-primary-navy mb-2 group-hover:text-primary-gold transition-colors">
                Hay Bags & Accessories
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Stylish hay bags to keep their favorite food accessible and tidy.
              </p>
              <span className="text-sm font-semibold text-primary-gold flex items-center gap-1">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

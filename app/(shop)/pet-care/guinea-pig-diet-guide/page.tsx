import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guinea Pig Diet Guide",
  description:
    "A clear, practical guide to feeding guinea pigs well — at every life stage. Learn about hay, vegetables, pellets, and essential supplements.",
  alternates: { canonical: "/pet-care/guinea-pig-diet-guide" },
  openGraph: {
    title: "Guinea Pig Diet Guide",
    description:
      "A clear, practical guide to feeding guinea pigs well — at every life stage. Learn about hay, vegetables, pellets, and essential supplements.",
    type: "article",
    publishedTime: "2024-03-20T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Guinea Pig Diet", "Pet Nutrition", "Small Animal Care"],
    images: ["/pet-care-tips/default1.png"],
  },
};

export default function DietGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guinea Pig Diet Guide",
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
      "A clear, practical guide to feeding guinea pigs well — at every life stage.",
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
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pet Care
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-8 text-3xl leading-[1.1] font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            Guinea Pig Diet Guide
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
        <article className="prose prose-lg prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 max-w-none">
          <p className="mb-6 text-xl leading-relaxed font-normal text-gray-600">
            <em>
              A clear, practical guide to feeding guinea pigs well — at every
              life stage.
            </em>
          </p>
          <p className="mb-10">
            A well-planned diet supports not just health, but a{" "}
            <strong>longer, happier life</strong> for your guinea pigs 🤍
          </p>

          <div className="my-10 rounded-2xl border border-gray-100 bg-gray-50 p-8">
            <h3 className="mt-0 mb-6 text-xl font-bold text-gray-900">
              Must-Eat Priority List
              <span className="mt-1 block text-base font-normal text-gray-500">
                (in order of importance)
              </span>
            </h3>
            <ol className="m-0 list-decimal space-y-2 pl-5 font-medium text-gray-800">
              <li>Hay</li>
              <li>Vegetables</li>
              <li>Pellets</li>
              <li>Vitamin C supplements</li>
            </ol>
          </div>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            1) Feed by Age First 🐹
          </h2>
          <p>
            Guinea pig diets must change with age.
            <br />
            We generally group them into three stages:
          </p>
          <ul className="mt-4 list-none space-y-2 pl-0">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Young guinea pigs:</strong> 0–6 months
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Adult guinea pigs:</strong> 6 months–4 years
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Senior guinea pigs:</strong> 4 years and above
              </span>
            </li>
          </ul>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            2) Hay — Their Lifelong Staple 🌾
          </h2>
          <p>
            No matter the age,{" "}
            <strong>hay must be available at all times</strong>
            .
            <br />
            It supports digestion, dental health, and overall wellbeing.
          </p>
          <p className="mt-6 mb-2 font-bold">Best choices:</p>
          <ul className="list-none space-y-2 pl-0">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Timothy hay</strong> — top recommendation
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Oaten hay</strong> — acceptable as a secondary option
              </span>
            </li>
          </ul>
          <p className="mt-6 inline-block rounded-lg border border-yellow-100 bg-yellow-50 p-4">
            <strong>Why Timothy hay?</strong>
            <br />
            It’s higher in fibre and lower in natural sugars, making it ideal
            for long-term, unlimited feeding.
          </p>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            3) Alfalfa — Only for Young Guinea Pigs 🌱
          </h2>
          <p>
            Young guinea pigs (0–6 months) need <strong>Alfalfa hay</strong>.
            <br />
            It’s higher in calcium and protein, supporting growth and
            development.
          </p>
          <ul className="mt-4 list-none space-y-2 pl-0">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>Can be offered **unlimited** during early growth</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>From around **3 months**, gradually reduce alfalfa</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>Increase Timothy and other grass hays</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                By **6 months**, fully transition to Timothy as the main hay
              </span>
            </li>
          </ul>

          <div className="mt-10 mb-6">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Variety Is a Good Thing 🌾
            </h3>
            <p>
              Offering multiple hay types helps provide more balanced nutrition
              — as long as <strong>Timothy remains the main hay</strong>.
            </p>
            <p>
              In Australia, you’ll often find <strong>Pasture hay</strong> in
              supermarkets.
              <br />
              We like to call it <em>“guinea pigs’ obsession hay”</em> — they go
              absolutely wild for it.
            </p>
            <ul className="mt-4 list-none space-y-2 pl-0">
              <li className="flex items-start gap-3">
                <span className="text-gray-400 select-none">•</span>
                <span>Extremely high palatability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 select-none">•</span>
                <span>Best given in **small amounts**</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400 select-none">•</span>
                <span>Adds enrichment and dietary variety</span>
              </li>
            </ul>
          </div>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            4) Vegetables 🥬
          </h2>
          <p>
            Fresh vegetables are an essential daily part of the diet.
            <br />
            Variety matters, but <strong>balance matters more</strong>.
          </p>
          <p className="mb-8">
            Below is a real-life veggie rotation based on what works well in
            everyday feeding.
          </p>

          <div className="grid gap-8">
            {/* Leafy Greens */}
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-6">
              <h4 className="mt-0 mb-4 text-lg font-bold text-gray-900">
                Leafy Greens (Daily Base)
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 font-bold text-gray-900">
                    Cos (Romaine) Lettuce
                  </p>
                  <p className="mb-2 text-sm">
                    Our everyday staple. Gentle, hydrating, and easy on the gut.
                    <br />
                    For three guinea pigs, we use around{" "}
                    <strong>half a head per day</strong>.
                  </p>
                  <p className="inline-block rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                    🚫 Iceberg lettuce is not recommended
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-bold text-gray-900">
                    Mixed Leaf Salad
                  </p>
                  <p className="text-sm">
                    A great option for busy days. Easy to portion and share
                    between multiple guinea pigs.
                  </p>
                </div>
              </div>
            </div>

            {/* Vitamin C */}
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-6">
              <h4 className="mt-0 mb-4 text-lg font-bold text-gray-900">
                Vitamin C–Rich Vegetables
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 font-bold text-gray-900">Capsicum</p>
                  <p className="text-sm">
                    An excellent Vitamin C source. Red and yellow generally
                    contain more Vitamin C than green. Smaller, sweeter ones are
                    often better accepted by picky eaters.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-bold text-gray-900">Tomato</p>
                  <p className="text-sm">
                    Another good Vitamin C source. Helpful when guinea pigs
                    refuse capsicum.
                  </p>
                </div>
              </div>
            </div>

            {/* Hydrating */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
              <h4 className="mt-0 mb-4 text-lg font-bold text-gray-900">
                Hydrating Vegetables
              </h4>
              <div>
                <p className="mb-1 font-bold text-gray-900">Cucumber</p>
                <p className="mb-3 text-sm">
                  Refreshing, especially in summer. Too much can cause bloating,
                  so use to balance higher-calcium greens.
                </p>
                <p className="inline-block rounded bg-blue-100/50 px-2 py-1 text-xs font-medium text-blue-800">
                  Tip: If guinea pigs are out for a few hours without a water
                  bottle, cucumber helps with hydration.
                </p>
              </div>
            </div>

            {/* Calcium Rich */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <h4 className="mt-0 mb-2 text-lg font-bold text-gray-900">
                Calcium-Rich Vegetables
                <span className="mt-1 block text-sm font-normal text-gray-500">
                  (Feed in Small Amounts - moderation is important)
                </span>
              </h4>
              <div className="mt-4 space-y-6">
                <div>
                  <p className="mb-1 font-bold text-gray-900">
                    Parsley (curly or continental)
                  </p>
                  <p className="text-sm">
                    Very popular. Best paired with Cucumber or Cos lettuce.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-bold text-gray-900">
                    Kale (including Turkish kale)
                  </p>
                  <p className="mb-2 text-sm">
                    High in calcium but fits well if cos lettuce is the main
                    green.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Tip: Rinse thoroughly to remove insects.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-bold text-gray-900">
                    Carrot Tops & Silverbeet
                  </p>
                  <p className="text-sm">
                    Feed in very small amounts/moderation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-3 font-bold text-gray-900">
                Vegetables for Variety
              </h4>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong>Fennel:</strong> Green leafy parts preferred.
                </li>
                <li>
                  <strong>Corn Silk & Leaves:</strong> Mildly diuretic, good for
                  chewing. (Corn itself is for humans!)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-bold text-gray-900">
                Herbs to Rotate 🌿
              </h4>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>Sage</li>
                <li>Mint</li>
                <li>Basil</li>
                <li>Endive</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-purple-100 bg-purple-50 p-4">
            <h4 className="mt-0 mb-2 font-bold text-purple-900">
              Fruit — Always in Small Amounts 🍓
            </h4>
            <p className="m-0 text-sm text-purple-800">
              Blueberry, Grape, etc. — Fruit is a treat, not a daily food.
            </p>
          </div>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            5) Pellets — How to Choose 🥣
          </h2>
          <p>
            Pellets help support balanced nutrition.
            <br />
            If you choose <strong>Oxbow</strong>, you can select directly by
            age:
          </p>
          <div className="my-4 flex gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              Young
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              Adult
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              Senior
            </span>
          </div>
          <p>This is exactly how our own guinea pigs are fed.</p>

          <h3 className="mt-8 mb-4 text-lg font-bold text-gray-900">
            Other Pellet Options (for Mixing)
          </h3>
          <ul className="list-none space-y-3 pl-0">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Selective Naturals</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Burgess:</strong> The blackcurrant version is popular
                but can cause weight gain if overfed.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>
                <strong>Origins:</strong> Higher Vitamin C content.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-gray-600 italic">
            Our approach: <strong>small amounts for variety</strong>, with Oxbow
            as the main pellet.
          </p>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            6) Vitamin C — Non-Negotiable 🍅
          </h2>
          <p>
            Guinea pigs <strong>cannot produce Vitamin C</strong> on their own.
            <br />
            Even with vegetables, supplementation is recommended.
          </p>
          <p>
            We regularly use <strong>Oxbow Vitamin C tablets</strong> as a
            long-term essential.
          </p>
          <p className="mt-4">Oxbow also offers other supplements:</p>
          <ul className="mt-2 list-none space-y-2 pl-0">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>Joint support</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>Skin & coat</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>Digestive health</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 select-none">•</span>
              <span>Urinary support</span>
            </li>
          </ul>
          <p className="mt-6 text-gray-500 italic">
            Choose based on individual needs. (We personally keep a small supply
            on hand — just in case.)
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-20 border-t border-gray-100 pt-12">
          <h3 className="mb-6 text-xl font-bold text-gray-900">
            Shop Essentials
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-8 transition-colors hover:bg-gray-100">
              <h4 className="mb-2 text-lg font-bold text-gray-900">
                Premium Hay & Food
              </h4>
              <p className="mb-6 text-sm text-gray-600">
                High-quality Timothy hay and Oxbow pellets for daily nutrition.
              </p>
              <Link
                href="/shop-all"
                className="inline-flex items-center gap-2 font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 hover:text-gray-700"
              >
                Shop Food <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

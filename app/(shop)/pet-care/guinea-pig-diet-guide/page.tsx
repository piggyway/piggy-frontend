import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Guinea Pig Diet Guide | Piggy Way Crossing",
  description:
    "A clear, practical guide to feeding guinea pigs well — at every life stage. Learn about hay, vegetables, pellets, and essential supplements.",
  openGraph: {
    title: "Guinea Pig Diet Guide | Piggy Way Crossing",
    description:
      "A clear, practical guide to feeding guinea pigs well — at every life stage. Learn about hay, vegetables, pellets, and essential supplements.",
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
    dateModified: new Date().toISOString().split("T")[0],
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
            className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pet Care
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-gray-900 leading-[1.1]">
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
        <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900">
          <p className="text-xl leading-relaxed text-gray-600 mb-6 font-normal">
            <em>
              A clear, practical guide to feeding guinea pigs well — at every life
              stage.
            </em>
          </p>
          <p className="mb-10">
            A well-planned diet supports not just health, but a{" "}
            <strong>longer, happier life</strong> for your guinea pigs 🤍
          </p>

          <div className="my-10 p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold mb-6 mt-0 text-gray-900">
              Must-Eat Priority List
              <span className="block text-base font-normal text-gray-500 mt-1">
                (in order of importance)
              </span>
            </h3>
            <ol className="list-decimal pl-5 space-y-2 m-0 font-medium text-gray-800">
              <li>Hay</li>
              <li>Vegetables</li>
              <li>Pellets</li>
              <li>Vitamin C supplements</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            1) Feed by Age First 🐹
          </h2>
          <p>
            Guinea pig diets must change with age.
            <br />
            We generally group them into three stages:
          </p>
          <ul className="list-none pl-0 space-y-2 mt-4">
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

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            2) Hay — Their Lifelong Staple 🌾
          </h2>
          <p>
            No matter the age, <strong>hay must be available at all times</strong>
            .
            <br />
            It supports digestion, dental health, and overall wellbeing.
          </p>
          <p className="font-bold mt-6 mb-2">Best choices:</p>
          <ul className="list-none pl-0 space-y-2">
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
          <p className="mt-6 bg-yellow-50 p-4 rounded-lg inline-block border border-yellow-100">
            <strong>Why Timothy hay?</strong>
            <br />
            It’s higher in fibre and lower in natural sugars, making it ideal
            for long-term, unlimited feeding.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            3) Alfalfa — Only for Young Guinea Pigs 🌱
          </h2>
          <p>
            Young guinea pigs (0–6 months) need <strong>Alfalfa hay</strong>.
            <br />
            It’s higher in calcium and protein, supporting growth and
            development.
          </p>
          <ul className="list-none pl-0 space-y-2 mt-4">
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
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Variety Is a Good Thing 🌾
            </h3>
            <p>
              Offering multiple hay types helps provide more balanced nutrition —
              as long as <strong>Timothy remains the main hay</strong>.
            </p>
            <p>
              In Australia, you’ll often find <strong>Pasture hay</strong> in
              supermarkets.
              <br />
              We like to call it <em>“guinea pigs’ obsession hay”</em> — they go
              absolutely wild for it.
            </p>
            <ul className="list-none pl-0 space-y-2 mt-4">
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

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
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
            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
              <h4 className="text-lg font-bold text-gray-900 mt-0 mb-4">
                Leafy Greens (Daily Base)
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    Cos (Romaine) Lettuce
                  </p>
                  <p className="text-sm mb-2">
                    Our everyday staple. Gentle, hydrating, and easy on the gut.
                    <br />
                    For three guinea pigs, we use around{" "}
                    <strong>half a head per day</strong>.
                  </p>
                  <p className="text-xs font-medium text-red-600 bg-red-50 inline-block px-2 py-1 rounded">
                    🚫 Iceberg lettuce is not recommended
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
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
            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
              <h4 className="text-lg font-bold text-gray-900 mt-0 mb-4">
                Vitamin C–Rich Vegetables
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Capsicum</p>
                  <p className="text-sm">
                    An excellent Vitamin C source. Red and yellow generally
                    contain more Vitamin C than green. Smaller, sweeter ones are
                    often better accepted by picky eaters.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Tomato</p>
                  <p className="text-sm">
                    Another good Vitamin C source. Helpful when guinea pigs
                    refuse capsicum.
                  </p>
                </div>
              </div>
            </div>

            {/* Hydrating */}
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h4 className="text-lg font-bold text-gray-900 mt-0 mb-4">
                Hydrating Vegetables
              </h4>
              <div>
                <p className="font-bold text-gray-900 mb-1">Cucumber</p>
                <p className="text-sm mb-3">
                  Refreshing, especially in summer. Too much can cause bloating,
                  so use to balance higher-calcium greens.
                </p>
                <p className="text-xs font-medium text-blue-800 bg-blue-100/50 inline-block px-2 py-1 rounded">
                  Tip: If guinea pigs are out for a few hours without a water
                  bottle, cucumber helps with hydration.
                </p>
              </div>
            </div>

            {/* Calcium Rich */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h4 className="text-lg font-bold text-gray-900 mt-0 mb-2">
                Calcium-Rich Vegetables
                <span className="block text-sm font-normal text-gray-500 mt-1">
                  (Feed in Small Amounts - moderation is important)
                </span>
              </h4>
              <div className="space-y-6 mt-4">
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    Parsley (curly or continental)
                  </p>
                  <p className="text-sm">
                    Very popular. Best paired with Cucumber or Cos lettuce.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    Kale (including Turkish kale)
                  </p>
                  <p className="text-sm mb-2">
                    High in calcium but fits well if cos lettuce is the main
                    green.
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Tip: Rinse thoroughly to remove insects.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
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
              <h4 className="font-bold text-gray-900 mb-3">
                Vegetables for Variety
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
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
              <h4 className="font-bold text-gray-900 mb-3">
                Herbs to Rotate 🌿
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Sage</li>
                <li>Mint</li>
                <li>Basil</li>
                <li>Endive</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-2 mt-0">
              Fruit — Always in Small Amounts 🍓
            </h4>
            <p className="text-sm text-purple-800 m-0">
              Blueberry, Grape, etc. — Fruit is a treat, not a daily food.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            5) Pellets — How to Choose 🥣
          </h2>
          <p>
            Pellets help support balanced nutrition.
            <br />
            If you choose <strong>Oxbow</strong>, you can select directly by
            age:
          </p>
          <div className="flex gap-3 my-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              Young
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              Adult
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              Senior
            </span>
          </div>
          <p>This is exactly how our own guinea pigs are fed.</p>

          <h3 className="text-lg font-bold mt-8 mb-4 text-gray-900">
            Other Pellet Options (for Mixing)
          </h3>
          <ul className="list-none pl-0 space-y-3">
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
          <p className="mt-4 italic text-gray-600">
            Our approach: <strong>small amounts for variety</strong>, with Oxbow
            as the main pellet.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
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
          <ul className="list-none pl-0 space-y-2 mt-2">
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
          <h3 className="text-gray-900 mb-6 text-xl font-bold">
            Shop Essentials
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <h4 className="mb-2 text-lg font-bold text-gray-900">
                Premium Hay & Food
              </h4>
              <p className="text-gray-600 mb-6 text-sm">
                High-quality Timothy hay and Oxbow pellets for daily nutrition.
              </p>
              <Link
                href="/shop-all"
                className="inline-flex items-center gap-2 font-medium text-gray-900 hover:text-gray-700 underline underline-offset-4 decoration-gray-300"
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

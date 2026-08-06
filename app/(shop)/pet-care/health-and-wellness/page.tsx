import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
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
const PUBLISHED_ON = "2025-12-24";
const UPDATED_ON = "2025-12-24";

export const metadata: Metadata = {
  title: "Small Pet Health & Wellness Guide",
  description:
    "Essential health guide for guinea pigs and rabbits. Learn to recognize common ailments, grooming tips, and when to visit the vet.",
  alternates: { canonical: "/pet-care/health-and-wellness" },
  openGraph: {
    title: "Small Pet Health & Wellness Guide",
    description:
      "Essential health guide for guinea pigs and rabbits. Learn to recognize common ailments, grooming tips, and when to visit the vet.",
    type: "article",
    images: ["/pet-care-tips/default1.png"],
    publishedTime: `${PUBLISHED_ON}T00:00:00.000Z`,
    authors: ["Piggy Way Crossing Team"],
    tags: ["Pet Health", "Guinea Pig Care", "Rabbit Care", "Wellness"],
  },
};

export default function HealthWellnessPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Small Pet Health & Wellness Guide",
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
    datePublished: PUBLISHED_ON,
    dateModified: UPDATED_ON,
    description:
      "Essential health guide for guinea pigs and rabbits. Learn to recognize common ailments, grooming tips, and when to visit the vet.",
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
            Health & Wellness Essentials
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              {new Date(PUBLISHED_ON).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>6 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/pet-care-tips/default1.png"
            alt="Healthy guinea pig being groomed"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-a:text-primary-navy prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary-navy-light prose-headings:text-primary-navy prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-lg prose-p:leading-8 prose-img:rounded-xl max-w-none leading-relaxed text-gray-700">
          <p className="lead mb-8 text-xl text-gray-600">
            Prevention is always better than cure. Because small pets like
            guinea pigs and rabbits are prey animals, they are experts at hiding
            illness. Learning to spot subtle signs of health issues is a
            superpower every owner needs.
          </p>

          <hr className="my-10 border-gray-200" />

          <h2>Daily Health Checks</h2>
          <p>
            Make health checks part of your daily cuddle routine. It only takes
            a minute but can save a life.
          </p>
          <ul>
            <li>
              <strong>Eyes:</strong> Should be bright, clear, and free of
              discharge or crust.
            </li>
            <li>
              <strong>Nose:</strong> Clean and dry. No sneezing or mucus.
            </li>
            <li>
              <strong>Breathing:</strong> Silent and rhythmic. No wheezing,
              clicking, or labored breaths.
            </li>
            <li>
              <strong>Poop:</strong> Regular output, normal shape and
              consistency. (Yes, you become a poop expert!)
            </li>
            <li>
              <strong>Appetite:</strong> Eager to eat. A pet refusing food needs
              immediate vet attention.
            </li>
          </ul>

          <h2>Weekly Grooming Routine</h2>
          <h3>Nail Trimming</h3>
          <p>
            Overgrown nails can curl back into the footpad, causing pain and
            infection. Trim tips every 2-4 weeks. If you&apos;re nervous, ask
            your vet to demonstrate or use a file.
          </p>

          <h3>Brushing</h3>
          <p>
            Long-haired breeds need daily brushing to prevent painful mats.
            Short-haired breeds benefit from a weekly brush to remove loose hair
            and check for skin issues like mites or lice.
          </p>

          <h3>Boar Cleaning (Guinea Pigs)</h3>
          <p>
            Male guinea pigs need their &quot;sac&quot; cleaned occasionally to
            prevent impaction. It&apos;s not glamorous, but it&apos;s necessary
            for their comfort.
          </p>

          <div className="my-8 rounded-r-lg border-l-4 border-red-500 bg-red-50 p-6">
            <h4 className="mt-0 mb-2 font-bold text-red-900">
              Emergency Signs - Go to Vet Immediately
            </h4>
            <ul className="mb-0 text-sm text-red-800">
              <li>Not eating or pooping for 12 hours (Gut Stasis risk)</li>
              <li>Labored breathing or gasping</li>
              <li>Lethargy or inability to move</li>
              <li>Bleeding or obvious broken bones</li>
              <li>Bloated, hard tummy</li>
            </ul>
          </div>

          <h2>Finding a Vet</h2>
          <p>
            Not all vets see &quot;exotics.&quot; Ensure you find a vet
            experienced with guinea pigs or rabbits <em>before</em> an emergency
            happens. Look for &quot;exotic animal&quot; specialists.
          </p>

          <h2>Weight Monitoring</h2>
          <p>
            Invest in a kitchen scale. Weigh your pet weekly and track it. A
            sudden weight drop is often the first and only sign of illness
            before other symptoms appear.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy mb-6 text-2xl font-bold">
            Health Essentials
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop-all"
              className="group hover:border-secondary-mint block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-secondary-mint mb-2 text-lg font-bold transition-colors">
                Grooming Kits
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                Safe nail clippers and soft brushes designed for small animals.
              </p>
              <span className="text-secondary-mint flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/pet-care/guinea-pig-diet-guide"
              className="group hover:border-primary-gold block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-primary-gold mb-2 text-lg font-bold transition-colors">
                Proper Nutrition
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                Diet is the #1 factor in health. Review our diet guide.
              </p>
              <span className="text-primary-gold flex items-center gap-1 text-sm font-semibold">
                Read Guide <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

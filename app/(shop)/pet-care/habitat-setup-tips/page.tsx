import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

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
  title: "Setting Up the Perfect Habitat for Small Pets",
  description:
    "Learn how to create a safe, comfortable, and enriching environment for your guinea pigs or rabbits. From cage size to bedding choices.",
  alternates: { canonical: "/pet-care/habitat-setup-tips" },
  openGraph: {
    title: "Setting Up the Perfect Habitat for Small Pets",
    description:
      "Learn how to create a safe, comfortable, and enriching environment for your guinea pigs or rabbits.",
    type: "article",
    images: ["/pet-care-tips/default1.png"],
    publishedTime: `${PUBLISHED_ON}T00:00:00.000Z`,
    authors: ["Piggy Way Crossing Team"],
    tags: ["Habitat Setup", "Cage Ideas", "Small Animal Care"],
  },
};

export default function HabitatSetupPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Setting Up the Perfect Habitat for Small Pets",
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
      "Learn how to create a safe, comfortable, and enriching environment for your guinea pigs or rabbits. From cage size to bedding choices.",
  };

  return (
    <div className="min-h-screen bg-white text-gray-600">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-10 sm:py-16">
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
        <header className="mb-8 text-left">
          <h1 className="text-primary-navy-light text-large sm:text-h4 mb-6">
            Setting Up the Perfect Habitat for Small Pets
          </h1>
          <div className="text-subtle flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500">
            <span className="text-primary-navy font-medium">
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
            <span>6 min read</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg prose-headings:text-primary-navy prose-h2:text-lead sm:prose-h2:text-large prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lead prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-primary-navy prose-a:text-primary-navy prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary-navy-light max-w-none break-words text-gray-600">
          <p className="text-body mb-8 text-gray-600">
            Your pet&apos;s habitat is their entire world. It&apos;s where they
            sleep, eat, play, and exercise. Creating a spacious, safe, and
            stimulating environment is key to their physical health and mental
            well-being.
          </p>

          <hr className="my-10 border-gray-200" />

          <h2>Space: Bigger is Always Better</h2>
          <p>
            The most common mistake new owners make is buying a cage that is too
            small. Pet store cages are often woefully inadequate.
          </p>
          <ul>
            <li>
              <strong>Guinea Pigs:</strong> Need a minimum of 7.5 square feet
              for a pair, but 10.5+ square feet is recommended. C&C (Cubes and
              Coroplast) cages are a popular, customizable choice.
            </li>
            <li>
              <strong>Rabbits:</strong> Ideally should be free-roam or have an
              exercise pen (x-pen) setup. A standard &quot;hutch&quot; is rarely
              enough room for a bunny to hop and binky.
            </li>
          </ul>

          <h2>Bedding: Comfort & Hygiene</h2>
          <p>
            Your choice of bedding impacts odor control, cleaning ease, and your
            pet&apos;s respiratory health.
          </p>
          <h3>Our Liners</h3>
          <p>
            Our liners are made to replace fleece, not sit on top of it. The
            absorbent layers are built in, so you do not wick or layer anything
            underneath. The Cool Breeze surface does not hold hay or fur, so one
            shake cleans it, and the non-slip base keeps the liner flat. See the{" "}
            <Link href="/shop-all?category=liner">liner range</Link>.
          </p>
          <h3>Other Options</h3>
          <ul>
            <li>
              <strong>Aspen Shavings:</strong> Safe wood option, but can be
              messy.
            </li>
            <li>
              <strong>Paper Bedding:</strong> Soft and absorbent, but disposable
              costs add up.
            </li>
            <li>
              <strong>Avoid:</strong> Cedar and Pine shavings (unless
              kiln-dried). The aromatic oils can damage small animal respiratory
              tracts and livers.
            </li>
          </ul>

          <h2>Hideouts & Security</h2>
          <p>
            Small animals are prey species. They need multiple places to hide to
            feel safe.
          </p>
          <ul>
            <li>
              Provide at least one hideout per animal to prevent squabbles.
            </li>
            <li>
              Mix it up with wooden huts, tunnels, and cuddle sacks. The{" "}
              <Link href="/shop/hideout/piggy-wooden-house">
                Piggy Wooden House
              </Link>{" "}
              is a solid-walled option that blocks out light and noise.
            </li>
            <li>
              Open-ended tunnels are great for running through during
              &quot;zoomies.&quot;
            </li>
          </ul>

          <h2>Enrichment & Boredom Busters</h2>
          <p>A bored pet is an unhappy pet. Keep their minds active with:</p>
          <ul>
            <li>
              <strong>Foraging:</strong> Hide treats or pellets in hay piles or
              treat balls.
            </li>
            <li>
              <strong>Chew Toys:</strong> Willow balls, apple sticks, and
              cardboard tubes are safe and fun to destroy.
            </li>
            <li>
              <strong>Rotation:</strong> Switch out toys weekly to keep things
              fresh.
            </li>
          </ul>

          <h2>Location, Location, Location</h2>
          <p>Where you put the cage matters too:</p>
          <div className="my-6 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-6">
            <p className="mb-0 text-sm text-yellow-800">
              <strong>Temperature Warning:</strong> Keep away from direct
              sunlight, drafts, and radiators. Guinea pigs are prone to
              heatstroke above 75°F (24°C).
            </p>
          </div>
          <p>
            Place them in a family area (like a living room) so they feel part
            of the &quot;herd,&quot; but avoid high-noise areas like right next
            to a TV or stereo.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy text-lead mb-6">
            Upgrade Their Home
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop-all?category=liner"
              className="group hover:border-primary-purple block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-primary-navy-light text-p-ui mb-2 transition-colors">
                Shop Liners
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                The foundation of a clean and cozy habitat.
              </p>
              <span className="text-primary-navy-light flex items-center gap-1 text-sm font-semibold">
                View Collection <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/shop/hideout/piggy-wooden-house"
              className="group hover:border-secondary-pink block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-primary-navy-light text-p-ui mb-2 transition-colors">
                Piggy Wooden House
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                A safe space for sleeping and snuggling.
              </p>
              <span className="text-primary-navy-light flex items-center gap-1 text-sm font-semibold">
                View Product <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

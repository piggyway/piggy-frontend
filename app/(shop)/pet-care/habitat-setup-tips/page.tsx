import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export const metadata: Metadata = {
  title: "Setting Up the Perfect Habitat for Small Pets | Piggy Way Crossing",
  description:
    "Learn how to create a safe, comfortable, and enriching environment for your guinea pigs or rabbits. From cage size to bedding choices.",
  openGraph: {
    title: "Setting Up the Perfect Habitat for Small Pets",
    description:
      "Learn how to create a safe, comfortable, and enriching environment for your guinea pigs or rabbits.",
    type: "article",
    publishedTime: "2024-03-22T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Habitat Setup", "Cage Ideas", "Small Animal Care"],
  },
};

export default function HabitatSetupPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Setting Up the Perfect Habitat for Small Pets",
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
    datePublished: "2024-03-22",
    dateModified: "2024-03-22",
    description:
      "Learn how to create a safe, comfortable, and enriching environment for your guinea pigs or rabbits. From cage size to bedding choices.",
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-primary-purple/20">
      <BackgroundBlobs variant={2} className="opacity-30" />
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
            Setting Up the Perfect Habitat for Small Pets
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 sm:justify-start justify-center">
            <span className="font-medium text-gray-900">Piggy Way Crossing Team</span>
            <span className="hidden sm:inline">•</span>
            <span>March 22, 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>6 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/pet-care-tips/default1.png"
            alt="Cozy guinea pig habitat setup"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-headings:text-primary-navy prose-a:text-primary-purple prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none text-gray-700 leading-relaxed">
          <p className="lead text-xl text-gray-600 mb-8">
            Your pet's habitat is their entire world. It's where they sleep, eat,
            play, and exercise. Creating a spacious, safe, and stimulating
            environment is key to their physical health and mental well-being.
          </p>

          <hr className="my-10 border-gray-200" />

          <h2>Space: Bigger is Always Better</h2>
          <p>
            The most common mistake new owners make is buying a cage that is too
            small. Pet store cages are often woefully inadequate.
          </p>
          <ul>
            <li>
              <strong>Guinea Pigs:</strong> Need a minimum of 7.5 square feet for a
              pair, but 10.5+ square feet is recommended. C&C (Cubes and Coroplast)
              cages are a popular, customizable choice.
            </li>
            <li>
              <strong>Rabbits:</strong> Ideally should be free-roam or have an
              exercise pen (x-pen) setup. A standard "hutch" is rarely enough room
              for a bunny to hop and binky.
            </li>
          </ul>

          <h2>Bedding: Comfort & Hygiene</h2>
          <p>
            Your choice of bedding impacts odor control, cleaning ease, and your
            pet's respiratory health.
          </p>
          <h3>Fleece Liners (Our Favorite!)</h3>
          <p>
            Reusable fleece liners are eco-friendly, soft on sensitive paws, and
            dust-free (great for respiratory health). They wick moisture away to an
            absorbent layer underneath, keeping the surface dry. Plus, they look
            adorable!
          </p>
          <h3>Other Options</h3>
          <ul>
            <li><strong>Aspen Shavings:</strong> Safe wood option, but can be messy.</li>
            <li><strong>Paper Bedding:</strong> Soft and absorbent, but disposable costs add up.</li>
            <li><strong>Avoid:</strong> Cedar and Pine shavings (unless kiln-dried). The aromatic oils can damage small animal respiratory tracts and livers.</li>
          </ul>

          <h2>Hideouts & Security</h2>
          <p>
            Small animals are prey species. They need multiple places to hide to feel
            safe.
          </p>
          <ul>
            <li>Provide at least one hideout per animal to prevent squabbles.</li>
            <li>Mix it up with wooden huts, fleece tunnels, and cuddle sacks.</li>
            <li>Open-ended tunnels are great for running through during "zoomies."</li>
          </ul>

          <h2>Enrichment & Boredom Busters</h2>
          <p>A bored pet is an unhappy pet. Keep their minds active with:</p>
          <ul>
            <li><strong>Foraging:</strong> Hide treats or pellets in hay piles or treat balls.</li>
            <li><strong>Chew Toys:</strong> Willow balls, apple sticks, and cardboard tubes are safe and fun to destroy.</li>
            <li><strong>Rotation:</strong> Switch out toys weekly to keep things fresh.</li>
          </ul>

          <h2>Location, Location, Location</h2>
          <p>Where you put the cage matters too:</p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6 rounded-r-lg">
            <p className="text-yellow-800 text-sm mb-0">
              <strong>Temperature Warning:</strong> Keep away from direct sunlight, drafts, and radiators. Guinea pigs are prone to heatstroke above 75°F (24°C).
            </p>
          </div>
          <p>
            Place them in a family area (like a living room) so they feel part of the "herd," but avoid high-noise areas like right next to a TV or stereo.
          </p>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-primary-navy mb-6">Upgrade Their Home</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop-all"
              className="group block rounded-xl border border-gray-200 p-6 transition-all hover:border-primary-purple hover:shadow-md bg-white"
            >
              <h4 className="font-bold text-lg text-primary-navy mb-2 group-hover:text-primary-purple transition-colors">
                Shop Fleece Liners
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                The foundation of a clean and cozy habitat.
              </p>
              <span className="text-sm font-semibold text-primary-purple flex items-center gap-1">
                View Collection <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
            
            <Link
              href="/shop-all"
              className="group block rounded-xl border border-gray-200 p-6 transition-all hover:border-secondary-pink hover:shadow-md bg-white"
            >
              <h4 className="font-bold text-lg text-primary-navy mb-2 group-hover:text-secondary-pink transition-colors">
                Cozy Hideouts
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Safe spaces for sleeping and snuggling.
              </p>
              <span className="text-sm font-semibold text-secondary-pink flex items-center gap-1">
                View Collection <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

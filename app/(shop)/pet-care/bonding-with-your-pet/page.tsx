import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";

export const metadata: Metadata = {
  title:
    "Bonding Tips: Building Trust with Guinea Pigs & Rabbits | Piggy Way Crossing",
  description:
    "Patience is key to bonding with small pets. Learn proven techniques to tame your guinea pig or rabbit and build a lasting friendship.",
  openGraph: {
    title: "Bonding Tips: Building Trust with Guinea Pigs & Rabbits",
    description:
      "Patience is key to bonding with small pets. Learn proven techniques to tame your guinea pig or rabbit.",
    type: "article",
    publishedTime: "2024-03-25T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Bonding", "Taming", "Small Animal Behavior"],
  },
};

export default function BondingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bonding Tips: Building Trust with Guinea Pigs & Rabbits",
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
    datePublished: "2024-03-25",
    dateModified: "2024-03-25",
    description:
      "Patience is key to bonding with small pets. Learn proven techniques to tame your guinea pig or rabbit and build a lasting friendship.",
  };

  return (
    <div className="selection:bg-secondary-pink/20 min-h-screen bg-white font-sans text-gray-900">
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
            Bonding Tips: Building Trust with Small Pets
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
            <span className="font-medium text-gray-900">
              Piggy Way Crossing Team
            </span>
            <span className="hidden sm:inline">•</span>
            <span>March 25, 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>5 min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          <Image
            src="/pet-care-tips/default1.png"
            alt="Bonding with a guinea pig"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-headings:text-primary-navy prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-lg prose-p:leading-8 prose-a:text-secondary-pink prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none leading-relaxed text-gray-700">
          <p className="lead mb-8 text-xl text-gray-600">
            Earning the trust of a prey animal is one of the most rewarding
            experiences a pet owner can have. Unlike dogs, who often love
            instantly, guinea pigs and rabbits require patience, consistency,
            and a lot of snacks.
          </p>

          <hr className="my-10 border-gray-200" />

          <h2>Understanding the Prey Mindset</h2>
          <p>
            To bond with your pet, you must first think like them. In the wild,
            everything wants to eat them. Fast movements, loud noises, and being
            picked up (like a hawk swooping down) are terrifying instincts to
            overcome.
          </p>
          <div className="my-6 rounded-r-lg border-l-4 border-pink-400 bg-pink-50 p-6">
            <p className="mb-0 font-bold text-pink-900">
              The Golden Rule: Let them come to you. Never force interaction.
            </p>
          </div>

          <h2>Step 1: The "Invisible" Presence</h2>
          <p>
            When you first bring your pet home, give them space. For the first
            few days, just sit near their cage and talk softly or read a book
            aloud. Let them get used to your scent and the sound of your voice
            without the pressure of interaction.
          </p>

          <h2>Step 2: The Way to the Heart (Food!)</h2>
          <p>
            Food is your best bonding tool. Start hand-feeding their favorite
            veggies (parsley, cilantro, or a piece of pepper).
          </p>
          <ul>
            <li>Hold the food still and let them approach.</li>
            <li>
              Don't try to touch them yet—just let them associate your hand with
              good things.
            </li>
            <li>Be patient! This might take days or weeks.</li>
          </ul>

          <h2>Step 3: Floor Time</h2>
          <p>
            Once they take food from your hand comfortably, move to a secure
            floor area (like a playpen or a blocked-off room).
          </p>
          <ul>
            <li>
              <strong>Lie Down:</strong> Get on their level. Standing up makes
              you a scary giant. Lying down makes you less threatening.
            </li>
            <li>
              <strong>Be a Statue:</strong> Let them investigate you. They might
              sniff you, climb on you, or nibble your clothes. Stay still!
            </li>
            <li>
              <strong>Positive Reinforcement:</strong> Have treats ready for
              brave interactions.
            </li>
          </ul>

          <h2>Lap Time & Handling</h2>
          <p>Only attempt picking them up once they trust you.</p>
          <ul>
            <li>
              <strong>Scoop, Don't Grab:</strong> Support their bum and chest
              securely.
            </li>
            <li>
              <strong>Use a Snuggle Sack:</strong> Many pigs feel safer being
              picked up inside a cuddle sack or tunnel rather than by bare
              hands.
            </li>
            <li>
              <strong>Short Sessions:</strong> Start with 5-10 minutes of lap
              time with food.
            </li>
          </ul>

          <h2>Signs of Affection</h2>
          <p>How do you know it's working? Look for these signs:</p>
          <ul>
            <li>
              <strong>Wheeking:</strong> Excited squeaking when they see you (or
              the fridge!).
            </li>
            <li>
              <strong>Popcorning:</strong> Jumping for joy in mid-air.
            </li>
            <li>
              <strong>Pancaking:</strong> Relaxing flat on the ground with legs
              kicked out.
            </li>
            <li>
              <strong>Purring:</strong> A low, vibrating rumble (usually happy,
              though pitch matters!).
            </li>
          </ul>

          <div className="my-8 rounded-lg border border-green-100 bg-green-50 p-6">
            <h4 className="mt-0 mb-2 font-bold text-green-800">
              Pro Tip: Routine
            </h4>
            <p className="mb-0 text-sm text-green-700">
              Animals love predictability. Try to bond at the same time every
              day, like during morning veggie time or evening TV time.
              Consistency builds trust faster!
            </p>
          </div>
        </article>

        {/* Read Next Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-primary-navy mb-6 text-2xl font-bold">
            Bonding Tools
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/shop-all"
              className="group hover:border-secondary-pink block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-secondary-pink mb-2 text-lg font-bold transition-colors">
                Cuddle Sacks
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                The perfect safe space for lap time snuggles.
              </p>
              <span className="text-secondary-pink flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/shop-all"
              className="group hover:border-secondary-mint block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
            >
              <h4 className="text-primary-navy group-hover:text-secondary-mint mb-2 text-lg font-bold transition-colors">
                Playpens & Mats
              </h4>
              <p className="mb-4 text-sm text-gray-600">
                Set up a secure, waterproof area for floor time bonding.
              </p>
              <span className="text-secondary-mint flex items-center gap-1 text-sm font-semibold">
                Shop Now <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Everything You Need to Begin",
  description:
    "Guinea pigs have a way of stealing hearts — and they deserve thoughtful care in return. Learn about the commitment, daily care, and philosophy of keeping guinea pigs.",
  alternates: { canonical: "/guides/bunny-starter-kit" },
  openGraph: {
    title: "Everything You Need to Begin",
    description:
      "Guinea pigs have a way of stealing hearts — and they deserve thoughtful care in return. Learn about the commitment, daily care, and philosophy of keeping guinea pigs.",
    type: "article",
    publishedTime: "2024-03-28T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Guinea Pig Care", "Beginner Guide", "Philosophy"],
    images: ["/shop-with-us/default.png"],
  },
};

export default function BeginnerGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Everything You Need to Begin",
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
    datePublished: "2024-03-28",
    dateModified: "2024-03-28",
    description:
      "Guinea pigs have a way of stealing hearts — and they deserve thoughtful care in return.",
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
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-8 text-3xl leading-[1.1] font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            Everything You Need to Begin
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
          <p className="mb-10 text-xl leading-relaxed font-normal text-gray-600">
            Guinea pigs have a way of stealing hearts — and they deserve
            thoughtful care in return.
          </p>

          <p>
            Guinea pigs, also known as cavies, are small rodents with calm,
            gentle personalities. Naturally quiet and observant, they’re
            incredibly sensitive to their surroundings. As prey animals, they’re
            born cautious, so trust doesn’t come instantly — it’s built slowly
            through consistency, patience, and kindness.
          </p>

          <p>
            But once they feel safe, something special happens: their individual
            personalities begin to shine. You’ll notice the affection,
            curiosity, quiet confidence, and those tiny expressions that let you
            know a real connection has formed.
          </p>

          <hr className="my-12 border-gray-100" />

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            A Gentle Nature Comes With Real Responsibility
          </h2>
          <p>
            Guinea pigs may look simple to care for, but they truly thrive on
            consistency. Because they produce a lot of waste, their living space
            needs daily attention.
          </p>
          <p>
            Cleaning isn’t optional — it’s a core part of caring for them
            properly. Leftover food and waste can quickly cause unpleasant
            smells and potential health issues, so it’s{" "}
            <strong>
              strongly recommended to spend around 30 minutes every day cleaning
              their space
            </strong>
            .
          </p>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            What Caring for Guinea Pigs Looks Like Day to Day
          </h2>
          <ul className="list-none space-y-3 pl-0">
            {[
              "Fresh vegetables prepared daily",
              "Hay available at all times",
              "Regular nail trims",
              "Ongoing grooming for long-haired guinea pigs",
              "Awareness of temperature changes, especially during warmer months",
              "Routine health checks",
            ].map((item, i) => (
              <li key={i} className="relative flex items-start gap-3 pl-0">
                <span className="mt-1 text-xl leading-none text-gray-400 select-none">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            Here in Australia, many owners visit an exotic vet or the RSPCA,
            with an <strong>annual body check recommended</strong>.
          </p>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            Thinking Ahead Matters
          </h2>
          <p>Life happens — holidays, work, the unexpected.</p>
          <p>
            🐾 Guinea pigs need proper boarding or dedicated pet care when
            you’re away.
            <br />
            If you ever need support, our boarding service{" "}
            <Link
              href="/piggyway-boarding"
              className="text-primary-navy hover:text-primary-navy-light font-medium underline underline-offset-4"
            >
              Guineapig_Boarding
            </Link>{" "}
            is here to help — you can contact us directly via email to arrange
            boarding care.
          </p>
          <p>
            And like all animals, they may need medical attention.
            <br />
            Specialised treatment can be costly, so being prepared truly makes
            all the difference.
          </p>

          <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900">
            Our Philosophy
          </h2>
          <p>
            At <strong>Piggyway_Crossing</strong>, we believe the relationship
            goes both ways.
          </p>
          <p className="my-8 text-xl font-medium text-gray-900">
            It’s not just that guinea pigs need us —<br />
            we need them too.
          </p>
          <p>
            They bring comfort, calm, and a quiet kind of joy into everyday
            life. In their gentle presence, many of us find emotional support,
            grounding, and reassurance.
          </p>
          <p>
            They are kind.
            <br />
            They are soft-hearted.
            <br />
            They are quietly loving.
          </p>
          <p>
            They ask for time, care, and commitment — emotionally, financially,
            and practically. We care for them as family, not because we have to,
            but because the connection we share is meaningful.
          </p>
          <p>
            Guinea pigs give more than they take.
            <br />
            And that’s why they deserve our time, our patience, and our
            wholehearted love. 🤍
          </p>

          <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center">
            <p className="m-0 text-lg font-medium text-gray-900">
              If you’re ready to begin,
              <br />
              <span className="font-normal text-gray-600">
                we’re here to support you every step of the way. 🤍
              </span>
            </p>
          </div>

          <p>
            Setting up their home? Start with a{" "}
            <Link
              href="/shop-all?category=liner"
              className="text-primary-navy hover:text-primary-navy-light font-medium underline underline-offset-4"
            >
              fleece cage liner
            </Link>{" "}
            for a dust-free floor, and add the{" "}
            <Link
              href="/shop/hideout/piggy-wooden-house"
              className="text-primary-navy hover:text-primary-navy-light font-medium underline underline-offset-4"
            >
              Piggy Wooden House
            </Link>{" "}
            so they have somewhere to retreat.
          </p>
        </article>
      </div>
    </div>
  );
}

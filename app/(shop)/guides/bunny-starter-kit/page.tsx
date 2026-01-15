import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Everything You Need to Begin | Piggy Way Crossing",
  description:
    "Guinea pigs have a way of stealing hearts — and they deserve thoughtful care in return. Learn about the commitment, daily care, and philosophy of keeping guinea pigs.",
  openGraph: {
    title: "Everything You Need to Begin | Piggy Way Crossing",
    description:
      "Guinea pigs have a way of stealing hearts — and they deserve thoughtful care in return. Learn about the commitment, daily care, and philosophy of keeping guinea pigs.",
    type: "article",
    publishedTime: "2024-03-28T00:00:00.000Z",
    authors: ["Piggy Way Crossing Team"],
    tags: ["Guinea Pig Care", "Beginner Guide", "Philosophy"],
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
    dateModified: new Date().toISOString().split("T")[0],
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
            className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-gray-900 leading-[1.1]">
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
        <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900">
          <p className="text-xl leading-relaxed text-gray-600 mb-10 font-normal">
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

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
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

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            What Caring for Guinea Pigs Looks Like Day to Day
          </h2>
          <ul className="list-none pl-0 space-y-3">
            {[
              "Fresh vegetables prepared daily",
              "Hay available at all times",
              "Regular nail trims",
              "Ongoing grooming for long-haired guinea pigs",
              "Awareness of temperature changes, especially during warmer months",
              "Routine health checks",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 relative pl-0">
                <span className="text-gray-400 select-none text-xl leading-none mt-1">
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

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            Thinking Ahead Matters
          </h2>
          <p>
            Life happens — holidays, work, the unexpected.
          </p>
          <p>
            🐾 Guinea pigs need proper boarding or dedicated pet care when
            you’re away.
            <br />
            If you ever need support, our boarding service{" "}
            <strong>Guineapig_Boarding</strong> is here to help — you can
            contact us directly via email to arrange boarding care.
          </p>
          <p>
            And like all animals, they may need medical attention.
            <br />
            Specialised treatment can be costly, so being prepared truly makes
            all the difference.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            Our Philosophy
          </h2>
          <p>
            At <strong>Piggyway_Crossing</strong>, we believe the relationship
            goes both ways.
          </p>
          <p className="text-xl font-medium text-gray-900 my-8">
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

          <div className="mt-12 p-8 bg-gray-50 rounded-2xl text-center">
            <p className="text-lg font-medium text-gray-900 m-0">
              If you’re ready to begin,
              <br />
              <span className="text-gray-600 font-normal">
                we’re here to support you every step of the way. 🤍
              </span>
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

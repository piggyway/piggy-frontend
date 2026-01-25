import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart, Shield, Stethoscope } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export const metadata: Metadata = {
  title: "Pet Care Tips & Education | Piggy Way Crossing",
  description:
    "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips to keep your small pets happy and healthy.",
  openGraph: {
    title: "Pet Care Tips & Education | Piggy Way Crossing",
    description:
      "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips.",
    type: "website",
  },
};

const CARE_TOPICS = [
  {
    title: "Diet & Nutrition",
    description:
      "Understanding the essential balance of hay, pellets, and fresh veggies for your small pet's digestive health.",
    href: "/pet-care/guinea-pig-diet-guide",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Diet"
        width={60}
        height={60}
      />
    ),
    color: "bg-primary-navy",
    textColor: "text-white",
    accentColor: "bg-secondary-mint",
  },
  {
    title: "Housing Essentials",
    description:
      "How to set up the perfect habitat, choosing the right bedding, and maintaining a clean environment.",
    href: "#",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Housing"
        width={60}
        height={60}
      />
    ),
    color: "bg-white",
    textColor: "text-primary-navy",
    accentColor: "bg-primary-purple",
  },
  {
    title: "Health & Wellness",
    description:
      "Recognizing common ailments, grooming tips, and when to see a vet for your guinea pig or rabbit.",
    href: "#",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Health"
        width={60}
        height={60}
      />
    ),
    color: "bg-primary-gold",
    textColor: "text-primary-navy",
    accentColor: "bg-secondary-light-gold",
  },
  {
    title: "Bonding & Behavior",
    description:
      "Tips for taming, handling, and understanding the social needs of your furry friends.",
    href: "/pet-care/bonding-with-your-pet",
    icon: (
      <Image
        src="/pet-care-tips/default1.png"
        alt="Bonding"
        width={60}
        height={60}
      />
    ),
    color: "bg-white",
    textColor: "text-primary-navy",
    accentColor: "bg-secondary-pink",
  },
];

export default function PetCarePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Pet Care Tips & Education",
    description:
      "Expert care guides for guinea pigs and rabbits. Learn about proper diet, housing, bonding, and health tips.",
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: "https://piggyway.com.au/header-logo.png",
      },
    },
  };

  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={1} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <span className="bg-primary-purple/20 text-primary-navy mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
            Expert Veterinary Care
          </span>
          <h1 className="text-primary-navy mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Meet Our Trusted Vet Partner
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            We are proud to partner with Doctor Sups Veterinary, providing exceptional care for your beloved pocket pets in Melbourne.
          </p>
        </AnimatedSection>
      </section>

      {/* Topics Grid */}
      {/* <section className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {CARE_TOPICS.map((topic, index) => (
              <AnimatedSection
                key={index}
                className="group transition-transform hover:scale-[1.02]"
              >
                <Link
                  href={topic.href}
                  className={`relative flex min-h-[320px] h-full flex-col justify-between overflow-hidden rounded-[32px] p-8 shadow-sm ${topic.color}`}
                >
                  <div
                    className={`absolute top-0 right-0 h-40 w-40 rounded-full opacity-20 blur-3xl ${topic.accentColor}`}
                  />

                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-sm">
                      {topic.icon}
                    </div>
                    <h3
                      className={`mb-3 text-2xl font-bold ${topic.textColor}`}
                    >
                      {topic.title}
                    </h3>
                    <p
                      className={`max-w-md text-lg ${
                        topic.textColor === "text-white"
                          ? "text-white/90"
                          : "text-gray-600"
                      }`}
                    >
                      {topic.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 flex items-center justify-end">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-colors group-hover:bg-gray-50"
                      aria-label={`Read more about ${topic.title}`}
                    >
                      <ArrowUpRight className="text-primary-navy h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section> */}

      {/* Partner Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="mx-auto max-w-[1160px]">
          <AnimatedSection className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-sm sm:p-12">
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full bg-secondary-mint/30 blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-purple/10 px-4 py-1.5 text-sm font-semibold text-primary-navy">
                  <Stethoscope className="h-4 w-4" />
                  <span>Trusted Veterinary Partner</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-primary-navy sm:text-4xl">
                  Doctor Sups Veterinary
                </h2>
                <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                  Dr. Supanee (“Dr. Sups”) is the founder of Doctor Sups Veterinary and a highly experienced Unusual Pets Veterinarian. Since graduating in 2016, she has dedicated her career to providing compassionate, low-stress care for pocket pets — with a special focus on rabbits, guinea pigs, and other small companions. With advanced training and memberships in Unusual Pets Medicine & Surgery, Dr. Sups is passionate about supporting owners with expert guidance and gentle veterinary care.
                </p>
                <p className="mb-8 text-lg font-medium text-primary-navy">
                  Learn more and book with Dr. Sups here:
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.doctorsups.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary-navy px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-primary-navy-light hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Visit Doctor Sups Website
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
              
              {/* Doctor Image */}
              <div className="relative mt-8 h-80 w-80 shrink-0 overflow-hidden rounded-full border-[6px] border-white shadow-xl md:mt-0 lg:h-96 lg:w-96">
                <Image
                  src="/Screenshot 2024-11-12 174328.avif"
                  alt="Dr. Supanee"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Community Section */}
      {/* <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="mx-auto max-w-4xl text-center">
            <Heart className="text-primary-navy/20 mx-auto mb-6 h-12 w-12" />
            <h2 className="text-primary-navy mb-6 text-3xl font-bold sm:text-4xl">
              Join the Piggy Way Community
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Have questions? Our community of passionate pet parents is here to
              help. Share stories, get advice, and connect with fellow small pet
              lovers.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary-navy hover:bg-primary-navy-light rounded-full px-8 py-3 font-semibold text-white transition-colors">
                Join Community
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section> */}
    </div>
  );
}

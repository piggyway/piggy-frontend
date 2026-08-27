import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { guideArticles } from "@/lib/guides";
import { getBaseUrl } from "@/lib/utils/seo";

const PAGE_TITLE = "Guinea Pig & Rabbit Care Guides";
const PAGE_DESCRIPTION =
  "Practical care guides for guinea pigs and rabbits: setup checklists for new owners, bedding comparisons and everyday routines from the Piggy Way Crossing team.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    images: ["/pet-care-tips/default1.png"],
  },
};

export default function GuidesPage() {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${baseUrl}/guides`,
    publisher: {
      "@type": "Organization",
      name: "Piggy Way Crossing",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/header-logo.png`,
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guideArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/guides/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={1} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-10 container mx-auto max-w-[1160px] px-4 py-12 sm:py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-primary-navy text-p-ui sm:text-lead mb-2 font-normal">
            Learn, Love, Care
          </p>
          <h1 className="text-primary-navy-light text-large sm:text-h4 font-semibold tracking-[-0.21px]">
            {PAGE_TITLE}
          </h1>
          <p className="text-primary-navy mt-4 text-base leading-7">
            Small pets are easy to love and easy to get wrong. These guides
            cover the questions we are asked most in store: what a first cage
            actually needs, how our liners compare with loose bedding and
            fleece, and what daily care looks like once the excitement settles.
            Every guide is written by the Piggy Way Crossing team and updated as
            our advice changes. For diet, bonding and health articles, plus our
            vet partner, visit{" "}
            <Link
              href="/pet-care"
              className="hover:text-primary-navy-light underline underline-offset-4"
            >
              pet care tips and education
            </Link>
            .
          </p>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guideArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/guides/${article.slug}`}
              className="group block h-full"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary-navy-light transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto gap-2">
                  <span className="text-primary-navy text-sm font-semibold">
                    Read the guide
                  </span>
                  <ArrowUpRight className="text-primary-navy size-4 shrink-0" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

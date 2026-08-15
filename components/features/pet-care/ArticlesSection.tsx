import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { petCareArticles } from "@/lib/guides";

export function ArticlesSection() {
  return (
    <AnimatedSection className="w-full">
      <section className="container mx-auto max-w-[1160px] px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-primary-navy-light text-large sm:text-h4 leading-9 font-semibold tracking-[-0.21px] sm:leading-[42px]">
            Care Articles
          </h2>
          <p className="text-primary-navy text-p-ui sm:text-lead leading-8 font-normal">
            Everyday care advice for guinea pigs and rabbits, written by the
            Piggy Way Crossing team. For setup checklists and bedding
            comparisons, read our{" "}
            <Link
              href="/guides"
              className="hover:text-primary-navy-light underline underline-offset-4"
            >
              guinea pig and rabbit care guides
            </Link>
            .
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {petCareArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/pet-care/${article.slug}`}
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
                    Read the article
                  </span>
                  <ArrowUpRight className="text-primary-navy size-4 shrink-0" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </AnimatedSection>
  );
}

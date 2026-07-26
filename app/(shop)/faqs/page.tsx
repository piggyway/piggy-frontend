import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about our products, shipping, and guinea pig care.",
  alternates: { canonical: "/faqs" },
};

const FAQS = [
  {
    category: "Products & Care",
    questions: [
      {
        q: "What bedding is best for guinea pigs?",
        a: "We highly recommend fleece liners! They are reusable, eco-friendly, and super soft on sensitive guinea pig feet. Unlike wood shavings, they are dust-free which helps prevent respiratory issues.",
      },
      {
        q: "Are your treats suitable for rabbits too?",
        a: "Yes! Most of our treats are suitable for both guinea pigs and rabbits. However, always check the product description for specific dietary information.",
      },
      {
        q: "How often should I clean my C&C cage?",
        a: "We recommend spot cleaning daily (sweeping up poops) and doing a full cage clean and liner change every 3-5 days, depending on the number of piggies you have.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within Australia. We are working on expanding to New Zealand soon!",
      },
      {
        q: "Can I change my order after placing it?",
        a: "We process orders quickly! Please contact us immediately. If your order hasn't been packed yet, we'll do our best to help.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-neutral-background-light min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-3xl">
          <h1 className="text-primary-navy mb-4 text-center text-4xl font-bold sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mb-12 text-center text-lg text-gray-600">
            Have a question? We&apos;re here to help!
          </p>

          <div className="space-y-10">
            {FAQS.map((section, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-primary-navy mb-6 text-2xl font-bold">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${idx}-${index}`}
                      className="border-neutral-stroke"
                    >
                      <AccordionTrigger className="data-[state=open]:text-primary-navy text-left text-lg font-medium text-gray-900">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-base leading-relaxed text-gray-600">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a
                href="/contact"
                className="text-primary-navy font-semibold hover:underline"
              >
                Contact us
              </a>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

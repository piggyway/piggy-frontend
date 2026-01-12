import { Metadata } from "next";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export const metadata: Metadata = {
  title: "Returns Policy | Piggy Way Crossing",
  description:
    "Our simple 30-day return policy. If you or your pet aren't satisfied, we're here to help.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-neutral-background-light min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-3xl">
          <h1 className="text-primary-navy mb-8 text-center text-4xl font-bold sm:text-5xl">
            Returns Policy
          </h1>

          <div className="mb-12 rounded-2xl bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="bg-secondary-mint flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
                <RefreshCw className="text-primary-navy h-8 w-8" />
              </div>
              <div>
                <h3 className="text-primary-navy text-xl font-bold">
                  30-Day Hassle-Free Returns
                </h3>
                <p className="text-gray-600">
                  Not quite right? No problem. Return any unused item in its
                  original packaging within 30 days for a full refund or
                  exchange.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-12 text-gray-700">
            <section>
              <h2 className="text-primary-navy mb-6 flex items-center gap-2 text-2xl font-bold">
                <CheckCircle className="h-6 w-6 text-green-500" />
                What can be returned?
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-primary-navy mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  <p>Items in original, unused condition</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary-navy mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  <p>Items with all original tags and packaging intact</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary-navy mt-1.5 h-2 w-2 shrink-0 rounded-full" />
                  <p>Faulty or damaged goods (covered under warranty)</p>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-primary-navy mb-6 flex items-center gap-2 text-2xl font-bold">
                <AlertCircle className="h-6 w-6 text-red-400" />
                Non-returnable items
              </h2>
              <p className="mb-4">
                For health and safety reasons, we cannot accept returns on:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                  <p>Opened food or treat packages</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                  <p>Used bedding or cages (unless faulty)</p>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-300" />
                  <p>Personalised items</p>
                </li>
              </ul>
            </section>

            <section className="rounded-2xl bg-gray-50 p-8">
              <h2 className="text-primary-navy mb-4 text-2xl font-bold">
                How to make a return
              </h2>
              <ol className="text-primary-navy list-decimal space-y-4 pl-5 font-medium">
                <li className="pl-2">
                  <span className="block font-normal text-gray-700">
                    Contact our support team at returns@piggyway.com.au with your
                    order number.
                  </span>
                </li>
                <li className="pl-2">
                  <span className="block font-normal text-gray-700">
                    We'll send you a Returns Authorisation form and shipping
                    label.
                  </span>
                </li>
                <li className="pl-2">
                  <span className="block font-normal text-gray-700">
                    Pack your items securely and drop them off at your nearest
                    post office.
                  </span>
                </li>
                <li className="pl-2">
                  <span className="block font-normal text-gray-700">
                    Once received, we'll process your refund within 3-5 business
                    days.
                  </span>
                </li>
              </ol>
            </section>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

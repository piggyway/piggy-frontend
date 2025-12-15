import { Metadata } from "next";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export const metadata: Metadata = {
  title: "Terms & Conditions | Piggy Way Crossing",
  description: "Terms and conditions for using the Piggy Way Crossing website.",
};

export default function TermsPage() {
  return (
    <div className="bg-neutral-background-light min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-sm sm:p-12">
          <h1 className="text-primary-navy mb-8 text-3xl font-bold sm:text-4xl">
            Terms & Conditions
          </h1>
          <div className="prose prose-lg prose-headings:text-primary-navy prose-a:text-primary-navy text-gray-600">
            <p className="text-sm text-gray-400">Last updated: December 2024</p>
            <h3>1. Introduction</h3>
            <p>
              Welcome to Piggy Way Crossing. By accessing our website and
              purchasing our products, you agree to be bound by these Terms &
              Conditions.
            </p>

            <h3>2. Product Information</h3>
            <p>
              We adhere to strict quality standards for all our small pet
              products. However, as some items are handmade, slight variations
              in colour or size may occur.
            </p>
            <p>
              Always supervise your pets with new toys or accessories.
              Discontinue use if any product becomes damaged.
            </p>

            <h3>3. Pricing & Payment</h3>
            <p>
              All prices are in Australian Dollars (AUD) and include GST. We
              accept payments via major credit cards, PayPal, and Afterpay.
            </p>

            <h3>4. Shipping</h3>
            <p>
              Please refer to our{" "}
              <a href="/shipping-delivery">Shipping Policy</a> for details on
              delivery times and costs.
            </p>

            <h3>5. Intellectual Property</h3>
            <p>
              All content on this site (images, text, logos) is the property of
              Piggy Way Crossing and cannot be used without permission.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, Piggy Way Crossing shall
              not be liable for any indirect or consequential damages arising
              from the use of our website or products.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

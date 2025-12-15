import { Metadata } from "next";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Piggy Way Crossing",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-neutral-background-light min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-sm sm:p-12">
          <h1 className="text-primary-navy mb-8 text-3xl font-bold sm:text-4xl">
            Privacy Policy
          </h1>
          <div className="prose prose-lg prose-headings:text-primary-navy prose-a:text-primary-navy text-gray-600">
            <p className="text-sm text-gray-400">Last updated: December 2024</p>
            <h3>1. What We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when
              you place an order, create an account, or contact us. This may
              include your name, email, shipping address, and payment details.
            </p>

            <h3>2. How We Use Your Data</h3>
            <p>We use your information to:</p>
            <ul>
              <li>Process and deliver your orders</li>
              <li>Send order updates and tracking info</li>
              <li>Respond to your customer service inquiries</li>
              <li>Improve our website and product offerings</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>
              We implement a variety of security measures to maintain the safety
              of your personal information. Your payment information is
              processed securely by third-party providers and is never stored
              directly on our servers.
            </p>

            <h3>4. Third-Party Services</h3>
            <p>
              We may share necessary data with trusted third parties (e.g.,
              couriers like Australia Post) solely for the purpose of delivering
              our services to you.
            </p>

            <h3>5. Cookies</h3>
            <p>
              We use cookies to enhance your browsing experience and analyze
              site traffic. You can choose to disable cookies in your browser
              settings.
            </p>

            <h3>6. Your Rights</h3>
            <p>
              You have the right to access, correct, or delete your personal
              information. Contact us at privacy@piggyway.com for any
              privacy-related concerns.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

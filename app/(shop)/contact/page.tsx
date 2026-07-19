import { Metadata } from "next";
import { Mail, Instagram, ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { ContactForm } from "@/components/features/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Piggy Way team. We'd love to hear from you!",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-neutral-background-light min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-[1160px]">
          <div className="mb-12 text-center">
            <h1 className="text-primary-navy mb-4 text-4xl font-bold sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We love hearing from fellow pet parents! Whether you have a
              question about a product or just want to share a cute photo of
              your piggy.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-primary-navy flex h-full flex-col justify-between rounded-[32px] p-8 text-white sm:p-12">
                <div>
                  <h2 className="mb-8 text-3xl font-bold">Contact Us</h2>
                  <div className="space-y-8">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-white/60">
                          Email Support
                        </p>
                        <a
                          href="mailto:support@piggyway.com.au"
                          className="hover:text-secondary-mint text-xl font-semibold transition-colors"
                        >
                          support@piggyway.com.au
                        </a>
                        <p className="mt-1 text-sm text-white/80">
                          We&apos;ll get back to you within 24 hours
                        </p>
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Instagram className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-white/60">
                          Follow Us
                        </p>
                        <a
                          href="https://www.instagram.com/piggyway_crossing?igsh=MW82azZrM3dqb3cxbQ%3D%3D&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-xl font-semibold transition-colors hover:text-[#E1306C]"
                        >
                          @piggyway_crossing
                          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                        <p className="mt-1 text-sm text-white/80">
                          Join our community for cute updates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Text */}
                <div className="mt-12 hidden sm:block">
                  <p className="leading-relaxed text-white/80">
                    Connect with us on social media or send us an email. We are
                    always happy to help with any questions regarding our
                    products or just to chat about small pets!
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

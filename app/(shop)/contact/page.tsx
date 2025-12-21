import { Metadata } from "next";
import { Mail, MapPin, Instagram } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { ContactForm } from "@/components/features/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Piggy Way Crossing",
  description:
    "Get in touch with the Piggy Way team. We'd love to hear from you!",
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
              We love hearing from fellow pet parents! whether you have a
              question about a product or just want to share a cute photo of
              your piggy.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-primary-navy rounded-[32px] p-8 text-white sm:p-12">
                <h2 className="mb-6 text-2xl font-bold">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-white/60">Email Us</p>
                      <a
                        href="mailto:hello@piggyway.com"
                        className="hover:text-primary-gold text-lg font-semibold"
                      >
                        hello@piggyway.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-white/60">
                        Follow Us
                      </p>
                      <a
                        href="#"
                        className="hover:text-primary-gold text-lg font-semibold"
                      >
                        @piggywaycrossing
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="mb-1 font-medium text-white/60">Location</p>
                      <p className="text-lg font-semibold">Sydney, Australia</p>
                      <p className="text-sm text-white/80">
                        (Online Store Only)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-8">
                <h3 className="text-primary-navy mb-2 text-xl font-bold">
                  Business Hours
                </h3>
                <p className="mb-4 text-gray-600">
                  Our support team is available:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium">Saturday</span>
                    <span className="text-gray-600">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span className="text-gray-600">Closed</span>
                  </div>
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

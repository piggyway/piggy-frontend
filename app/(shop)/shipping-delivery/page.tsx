import { Metadata } from "next";
import { Truck, Clock, Globe } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Piggy Way Crossing",
  description:
    "Learn about our shipping rates, delivery times, and policies. Free shipping on orders over $99.",
};

export default function ShippingPage() {
  return (
    <div className="bg-neutral-background-light min-h-screen py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-3xl">
          <h1 className="text-primary-navy mb-8 text-center text-4xl font-bold sm:text-5xl">
            Shipping & Delivery
          </h1>

          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="bg-primary-purple/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Truck className="text-primary-navy h-6 w-6" />
              </div>
              <h3 className="text-primary-navy mb-2 font-bold">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600">On all orders over $99</p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="bg-secondary-mint mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Clock className="text-primary-navy h-6 w-6" />
              </div>
              <h3 className="text-primary-navy mb-2 font-bold">
                Fast Dispatch
              </h3>
              <p className="text-sm text-gray-600">Orders ship within 24h</p>
            </div>
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="bg-primary-gold mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Globe className="text-primary-navy h-6 w-6" />
              </div>
              <h3 className="text-primary-navy mb-2 font-bold">Nationwide</h3>
              <p className="text-sm text-gray-600">Shipping across Australia</p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-8 text-gray-700">
            <section className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-primary-navy mb-4 text-2xl font-bold">
                Shipping Rates
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>Standard Shipping (Orders under $99)</span>
                  <span className="font-semibold">$9.95</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Standard Shipping (Orders $99+)</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-semibold">$14.95</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-primary-navy mb-4 text-2xl font-bold">
                Delivery Times
              </h2>
              <p className="mb-4">
                We ship all orders from our warehouse in Sydney. Delivery times
                vary based on your location:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Metro Areas (East Coast): 2-4 business days</li>
                <li>Regional Areas: 4-7 business days</li>
                <li>Western Australia & NT: 7-10 business days</li>
                <li>Express Shipping: 1-3 business days (Metro)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-primary-navy mb-4 text-2xl font-bold">
                Order Tracking
              </h2>
              <p>
                Once your order has been dispatched, you will receive a
                confirmation email with a tracking number. You can track your
                delivery status at any time via the link in your email or by
                logging into your account.
              </p>
            </section>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

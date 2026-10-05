import { Metadata } from "next";
import { Truck, Clock, Globe } from "lucide-react";
import { AnimatedSection } from "@/components/features/homepage/AnimatedSection";
import { ServerConfigService } from "@/lib/services/config.server";
import { DELIVERY_ZONES } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const { freeShippingThreshold } =
    await ServerConfigService.getShippingConfig();
  return {
    title: "Shipping & Delivery",
    description: `Learn about our shipping rates, delivery times, and policies. Free shipping on orders over $${freeShippingThreshold}.`,
    alternates: { canonical: "/shipping-delivery" },
  };
}

export default async function ShippingPage() {
  const { freeShippingThreshold, standardShippingFee } =
    await ServerConfigService.getShippingConfig();

  return (
    <div className="bg-neutral-background-light min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection className="mx-auto max-w-3xl">
          <h1 className="text-primary-navy-light text-large sm:text-h4 mb-8 text-center">
            Shipping & Delivery
          </h1>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 rounded-2xl bg-white p-5 shadow-sm md:block md:p-6 md:text-center">
              <div className="bg-primary-purple/20 row-span-2 flex h-12 w-12 items-center justify-center rounded-full md:mx-auto md:mb-4">
                <Truck className="text-primary-navy h-6 w-6" />
              </div>
              <h3 className="text-primary-navy text-p-ui md:mb-2">
                Free Shipping
              </h3>
              <p className="text-subtle text-gray-600">
                On all orders over ${freeShippingThreshold}
              </p>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 rounded-2xl bg-white p-5 shadow-sm md:block md:p-6 md:text-center">
              <div className="bg-secondary-mint row-span-2 flex h-12 w-12 items-center justify-center rounded-full md:mx-auto md:mb-4">
                <Clock className="text-primary-navy h-6 w-6" />
              </div>
              <h3 className="text-primary-navy text-p-ui md:mb-2">
                Fast Dispatch
              </h3>
              <p className="text-subtle text-gray-600">
                Orders ship within 24h
              </p>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 rounded-2xl bg-white p-5 shadow-sm md:block md:p-6 md:text-center">
              <div className="bg-primary-gold row-span-2 flex h-12 w-12 items-center justify-center rounded-full md:mx-auto md:mb-4">
                <Globe className="text-primary-navy h-6 w-6" />
              </div>
              <h3 className="text-primary-navy text-p-ui md:mb-2">
                Nationwide
              </h3>
              <p className="text-subtle text-gray-600">
                Shipping across Australia
              </p>
            </div>
          </div>

          <div className="text-p sm:text-body mx-auto max-w-2xl space-y-8 text-gray-600">
            <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-primary-navy text-lead mb-4">
                Shipping Rates
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b pb-3">
                  <span>
                    Standard Shipping (Orders under ${freeShippingThreshold})
                  </span>
                  <span className="font-semibold tabular-nums">
                    ${standardShippingFee.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                  <span>
                    Standard Shipping (Orders ${freeShippingThreshold}+)
                  </span>
                  <span className="text-primary-navy font-semibold">FREE</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-primary-navy text-lead mb-4">
                Delivery Times
              </h2>
              <p className="mb-4">
                We ship all orders from our warehouse in Sydney. Delivery times
                vary based on your location:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {DELIVERY_ZONES.map((zone) => (
                  <li key={zone.label}>
                    {zone.label}: {zone.minDays}-{zone.maxDays} business days
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-primary-navy text-lead mb-4">
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

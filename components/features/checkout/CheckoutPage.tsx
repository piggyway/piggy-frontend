"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutSummary } from "./CheckoutSummary";
import { EmailStep } from "./steps/EmailStep";
import { AddressStep } from "./steps/AddressStep";
import { PaymentForm } from "./PaymentForm";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/features/cart/CartProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api/client";
import type {
  CheckoutShippingAddress,
  PaymentIntentAmounts,
} from "@/lib/types/checkout";
import { formatCents } from "@/lib/utils/format";

const EMPTY_ADDRESS: CheckoutShippingAddress = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "AU",
};

const STEPS = [
  { id: 1, title: "Contact" },
  { id: 2, title: "Shipping" },
  { id: 3, title: "Payment" },
];

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const { cart, isLoading, ensureLoaded } = useCart();
  const router = useRouter();

  // Checkout State
  const [email, setEmail] = React.useState("");
  const [fulfillmentType, setFulfillmentType] = React.useState<
    "delivery" | "pickup"
  >("delivery");
  const [selectedLocationId, setSelectedLocationId] = React.useState<
    number | undefined
  >();
  const [selectedSlotId, setSelectedSlotId] = React.useState<
    number | undefined
  >();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [shippingAddress, setShippingAddress] =
    React.useState<CheckoutShippingAddress>(EMPTY_ADDRESS);
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = React.useState<string | null>(
    null
  );
  const [amounts, setAmounts] = React.useState<PaymentIntentAmounts | null>(
    null
  );
  const [marketingOptIn, setMarketingOptIn] = React.useState(false);

  // Ensure cart is loaded
  React.useEffect(() => {
    // We only want to ensure loaded if we are NOT in a payment redirect flow
    // or if we really need to check cart validity.
    // However, CartProvider's ensureLoaded might be strict about auth.
    // Let's wrap it to handle errors gracefully.
    ensureLoaded().catch(() => null);
  }, [ensureLoaded]);

  async function handleProceedToPayment() {
    if (!cart) return;

    setIsCheckingOut(true);

    try {
      const payload = {
        email,
        fulfillmentType,
        pickupLocationId: selectedLocationId,
        pickupSlotId: selectedSlotId,
        promoCode: cart.appliedCouponCode || undefined,
        marketingOptIn,
        shippingAddress:
          fulfillmentType === "delivery" ? shippingAddress : undefined,
        // Re-use the existing intent (updates the amount) when the user
        // goes back and changes cart, address, or fulfillment type.
        paymentIntentId: paymentIntentId || undefined,
      };

      const res = await fetchWithAuth("/api/checkout/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        redirectOnAuthError: false,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.clientSecret) {
        const message =
          data?.error?.message ||
          data?.message ||
          "Failed to start checkout. Please try again.";
        throw new Error(message);
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setAmounts(data.amounts);
      setCurrentStep(3);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Payment failed. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  // If cart is empty (and not loading), redirect or show empty state
  if (!isLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 text-center lg:py-16">
        <h1 className="text-primary-navy text-large mb-4">
          Your Cart is Empty
        </h1>
        <Button onClick={() => router.push("/")} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const totalLabel = amounts
    ? formatCents(amounts.totalCents, amounts.currency)
    : "";

  return (
    <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-8">
        <Link
          href="/cart"
          className="text-subtle-medium text-primary-navy-light hover:underline"
        >
          ← Back to cart
        </Link>

        <h1 className="text-primary-navy text-large">Checkout</h1>

        {/* Step Indicators */}
        <div className="flex w-full max-w-full min-w-0 items-center gap-1 sm:w-auto sm:gap-3">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div className="h-0.5 min-w-2 flex-1 rounded-full bg-slate-300 sm:w-7 sm:flex-none" />
                )}
                <div
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-2 py-2 sm:px-[18px]",
                    isCompleted && "bg-primary-navy border border-green-600",
                    isActive && "bg-primary-navy",
                    !isCompleted &&
                      !isActive &&
                      "border-neutral-stroke border bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "text-detail flex size-5 items-center justify-center rounded-full font-semibold",
                      isCompleted && "bg-green-600 text-white",
                      isActive && "bg-primary-gold text-primary-navy",
                      !isCompleted &&
                        !isActive &&
                        "bg-neutral-stroke text-slate-600"
                    )}
                  >
                    {isCompleted ? <Check className="size-3" /> : step.id}
                  </span>
                  <span
                    className={cn(
                      "hidden sm:inline",
                      isCompleted && "text-subtle-semibold text-green-600",
                      isActive && "text-subtle-semibold text-white",
                      !isCompleted &&
                        !isActive &&
                        "text-subtle-medium text-slate-600"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left Column: Steps */}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            {currentStep === 1 && (
              <EmailStep
                onNext={nextStep}
                email={email}
                setEmail={setEmail}
                onOptInChange={setMarketingOptIn}
              />
            )}
            {currentStep === 2 && (
              <AddressStep
                onNext={handleProceedToPayment}
                onBack={prevStep}
                email={email}
                fulfillmentType={fulfillmentType}
                setFulfillmentType={setFulfillmentType}
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocationId}
                selectedSlotId={selectedSlotId}
                setSelectedSlotId={setSelectedSlotId}
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
                isLoading={isCheckingOut}
              />
            )}
            {currentStep === 3 && clientSecret && (
              <PaymentForm
                clientSecret={clientSecret}
                email={email}
                totalLabel={totalLabel}
                onBack={() => setCurrentStep(2)}
              />
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px] lg:shrink-0">
            <div className="border-neutral-stroke sticky top-8 flex flex-col rounded-[24px] border bg-white px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[640px]">
              <CheckoutSummary
                fulfillmentType={fulfillmentType}
                confirmedAmounts={currentStep === 3 ? amounts : null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

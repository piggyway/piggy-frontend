"use client";

import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { CheckoutSummary } from "./CheckoutSummary";
import { EmailStep } from "./steps/EmailStep";
import { AddressStep } from "./steps/AddressStep";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/features/cart/CartProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Contact" },
  { id: 2, title: "Shipping" },
];

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const { cart, isLoading, ensureLoaded } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  // Checkout State
  const [email, setEmail] = React.useState("");
  const [fulfillmentType, setFulfillmentType] = React.useState<"delivery" | "pickup">("delivery");
  const [selectedLocationId, setSelectedLocationId] = React.useState<number | undefined>();
  const [selectedSlotId, setSelectedSlotId] = React.useState<number | undefined>();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  
  // Ensure cart is loaded
  React.useEffect(() => {
    // We only want to ensure loaded if we are NOT in a payment redirect flow
    // or if we really need to check cart validity.
    // However, CartProvider's ensureLoaded might be strict about auth.
    // Let's wrap it to handle errors gracefully.
    ensureLoaded().catch(() => null);
  }, [ensureLoaded]);

  async function handleCheckout() {
    if (!cart) return;
    
    setIsCheckingOut(true);

    try {
       const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      const payload = {
        email,
        fulfillmentType,
        pickupLocationId: selectedLocationId,
        pickupSlotId: selectedSlotId,
        cartId: cart.id,
        currency: cart.currency,
        promoCode: cart.appliedCouponCode || undefined,
        userId: (session?.user as any)?.id,
        cartItems: cart.items.map(item => ({
            id: item.id,
            productRid: item.productRid,
            variantRid: item.variantRid,
            productTitle: item.productTitle,
            variantSku: item.variantSku,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            lineSubtotalCents: item.lineSubtotalCents,
            imageUrl: item.imageUrl,
            currency: item.currency
        }))
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      const url = data?.url;

      if (!res.ok || !url) {
        const message =
          data?.error?.message ||
          data?.message ||
          "Failed to start checkout. Please try again.";
        throw new Error(message);
      }

      // Redirect to Stripe Checkout
      window.location.assign(url);
    } catch (err: any) {
      toast.error(err?.message || "Payment failed. Please try again.");
      setIsCheckingOut(false);
    }
  }

  // If cart is empty (and not loading), redirect or show empty state
  if (!isLoading && (!cart || cart.items.length === 0)) {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-12 text-center lg:py-16">
          <h1 className="text-primary-navy mb-4 text-3xl font-bold">
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

  return (
    <div className="container mx-auto px-4 pt-32 pb-48 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-primary-navy text-3xl font-bold">Checkout</h1>
        <p className="text-slate-500">Complete your order</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Left Column: Steps */}
        <div className="flex-1">
          {/* Step Indicators */}
          <div className="mb-8 flex items-center gap-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    currentStep === step.id
                      ? "text-primary-navy font-semibold"
                      : currentStep > step.id
                        ? "text-green-600"
                        : "text-slate-400"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <div
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border text-xs",
                        currentStep === step.id
                          ? "border-primary-navy bg-primary-navy text-white"
                          : "border-slate-300"
                      )}
                    >
                      {step.id}
                    </div>
                  )}
                  <span>{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="mx-4 h-px w-8 bg-slate-200" />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[600px] space-y-6">
            {currentStep === 1 && (
                <EmailStep 
                    onNext={nextStep} 
                    email={email}
                    setEmail={setEmail}
                />
            )}
            {currentStep === 2 && (
              <AddressStep 
                onNext={handleCheckout} 
                onBack={prevStep}
                fulfillmentType={fulfillmentType}
                setFulfillmentType={setFulfillmentType}
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocationId}
                selectedSlotId={selectedSlotId}
                setSelectedSlotId={setSelectedSlotId}
                isLoading={isCheckingOut}
              />
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-96 lg:shrink-0">
          <div className="border-neutral-stroke sticky top-8 rounded-lg border bg-white p-6">
            <h2 className="text-primary-navy mb-4 text-xl font-semibold">
              Order Summary
            </h2>
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

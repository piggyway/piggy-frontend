"use client";

import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { CheckoutSummary } from "./CheckoutSummary";
import { EmailStep } from "./steps/EmailStep";
import { AddressStep } from "./steps/AddressStep";
import { PaymentStep } from "./steps/PaymentStep";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Contact" },
  { id: 2, title: "Shipping" },
  { id: 3, title: "Payment" },
];

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
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
            {currentStep === 1 && <EmailStep onNext={nextStep} />}
            {currentStep === 2 && (
              <AddressStep onNext={nextStep} onBack={prevStep} />
            )}
            {currentStep === 3 && <PaymentStep onBack={prevStep} />}
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

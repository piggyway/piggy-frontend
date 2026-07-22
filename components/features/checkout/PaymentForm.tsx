"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { stripePromise } from "@/lib/stripe";
import { colors } from "@/lib/design-tokens/colors";

/**
 * Card details are collected inside Stripe-hosted iframes (Payment Element),
 * so raw card numbers never touch our DOM or servers (PCI SAQ A).
 */

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: colors.primary.navy,
    colorText: colors.primary.navy,
    colorTextSecondary: colors.slate[600],
    colorTextPlaceholder: colors.slate[400],
    colorBackground: colors.neutral.white,
    borderRadius: "12px",
    fontFamily: "Outfit, sans-serif",
    fontSizeBase: "15px",
  },
  rules: {
    ".Input": {
      border: `1px solid ${colors.neutral.stroke}`,
      boxShadow: "none",
      padding: "14px 16px",
    },
    ".Input:focus": {
      border: `1px solid ${colors.primary.navy}`,
      boxShadow: `0 0 0 1px ${colors.primary.navy}`,
    },
    ".Label": {
      color: colors.primary.navy,
      fontWeight: "500",
    },
  },
};

const fonts = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap",
  },
];

interface PaymentFormProps {
  clientSecret: string;
  email: string;
  totalLabel: string;
  onBack: () => void;
}

export function PaymentForm({
  clientSecret,
  email,
  totalLabel,
  onBack,
}: PaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance, fonts, locale: "en-AU" }}
    >
      <PaymentFormInner email={email} totalLabel={totalLabel} onBack={onBack} />
    </Elements>
  );
}

function PaymentFormInner({
  email,
  totalLabel,
  onBack,
}: Omit<PaymentFormProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        receipt_email: email,
      },
    });

    // Only reached when confirmation fails immediately (card declined,
    // validation error, 3DS abandoned). On success Stripe redirects to
    // return_url and this code never runs. Card and validation errors are
    // already shown inline by the Payment Element, so only surface the
    // rest here to avoid a duplicated message.
    if (error.type !== "card_error" && error.type !== "validation_error") {
      setErrorMessage(
        error.message || "Payment failed. Please try again or use another card."
      );
    }
    setIsSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-neutral-stroke flex w-full flex-col gap-6 rounded-[24px] border bg-white px-6 py-8 sm:px-10 sm:py-9 lg:min-h-[640px]"
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-primary-navy text-[22px] font-semibold">Payment</h2>
        <p className="text-subtle text-slate-600">
          All transactions are secure and encrypted. Card details go directly to
          Stripe and never touch our servers.
        </p>
      </div>

      <PaymentElement
        options={{ layout: "tabs", wallets: { link: "never" } }}
      />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-[12px] bg-red-50 px-4 py-3 text-[14px] text-red-600"
        >
          {errorMessage}
        </p>
      )}

      <div className="bg-neutral-stroke h-px w-full lg:mt-auto" />

      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="border-neutral-stroke text-subtle-medium h-12 rounded-full px-7"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || isSubmitting}
          className="h-[52px] rounded-full px-8 text-[16px] font-semibold"
        >
          {isSubmitting ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Lock className="size-3.5" />
          )}
          Pay {totalLabel}
        </Button>
      </div>
    </form>
  );
}

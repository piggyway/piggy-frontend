"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CartItemPayload = {
  id: string;
  productTitle: string;
  variantSku: string | null;
  quantity: number;
  unitPriceCents: number;
  lineSubtotalCents: number;
  imageUrl: string;
  currency: string;
};

type CheckoutPayload = {
  email?: string;
  fullName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  cartItems?: CartItemPayload[];
  currency?: string;
};

type CheckoutButtonProps = {
  payload?: CheckoutPayload;
  disabled?: boolean;
  label?: string;
  className?: string;
  onError?: (message: string | null) => void;
};

export default function CheckoutButton({
  payload,
  disabled,
  label = "Continue to Checkout",
  className,
  onError,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (payload && !payload.email) {
      onError?.("Please provide an email address before continuing.");
      return;
    }

    setLoading(true);
    onError?.(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        let message = "Unable to start checkout right now.";
        
        if (errorBody) {
          // Handle different error response structures
          if (typeof errorBody?.error === "string") {
            message = errorBody.error;
          } else if (typeof errorBody?.error?.message === "string") {
            message = errorBody.error.message;
          } else if (typeof errorBody?.message === "string") {
            message = errorBody.message;
          } else if (typeof errorBody === "string") {
            message = errorBody;
          }
        }
        
        onError?.(message);
        return;
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        const message = "No checkout URL returned from server.";
        onError?.(message);
        console.error(message, data);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      onError?.("Something went wrong starting checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCheckout}
      disabled={disabled || loading}
      size="lg"
      className={className}
    >
      {loading ? "Processing..." : label}
    </Button>
  );
}

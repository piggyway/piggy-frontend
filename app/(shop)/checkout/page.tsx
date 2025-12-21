"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/features/cart/CartProvider";
import { useUser } from "@/contexts/UserContext";
import { PromoService } from "@/lib/services/promo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Store, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// --- Types ---
type CheckoutContactForm = {
  email: string;
};

// --- Formatters ---
const formatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

// --- Mock Data ---
const PICKUP_TIMES = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const PICKUP_DATES = [
  "Today, Oct 24",
  "Tomorrow, Oct 25",
  "Mon, Oct 27",
  "Tue, Oct 28",
];

export default function CheckoutPage() {
  const {
    cart,
    isLoading,
    isMutating,
    error,
    ensureLoaded,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const { data: session } = useSession();

  // Ensure cart is loaded on checkout page
  useEffect(() => {
    ensureLoaded().catch(() => null);
  }, [ensureLoaded]);

  // State
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">(
    "delivery"
  );

  // Forms
  const [contactForm, setContactForm] = useState<CheckoutContactForm>({
    email: "",
  });

  // Pickup State
  const [pickupDate, setPickupDate] = useState<string>(PICKUP_DATES[0]);
  const [pickupTime, setPickupTime] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  // Promo code UI state (status + validation message)
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Auto-fill user info
  useEffect(() => {
    if (isAuthenticated && user) {
      setContactForm((prev) => ({
        ...prev,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  // Derived State
  const totals = useMemo(() => {
    if (!cart) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cart.totals.subtotalCents;
    const taxBase = subtotal - cart.totals.discountCents;
    const tax = Math.round(taxBase * 0.1);
    const shipping = fulfillmentType === "pickup" ? 0 : 0; // Free shipping logic or logic here
    const grandTotal = Math.max(
      0,
      subtotal + shipping + tax - cart.totals.discountCents
    );

    return {
      subtotal,
      shipping,
      tax,
      total: grandTotal,
    };
  }, [cart, fulfillmentType]);

  // Validation
  const canSubmit = useMemo(() => {
    if (!cart) return false;

    // Always require an email for Stripe Checkout
    if (!contactForm.email.trim()) return false;

    // Check Fulfillment
    if (fulfillmentType === "delivery") {
      // Address will be collected on Stripe Checkout
      return true;
    } else {
      // Pickup
      return !!pickupDate && !!pickupTime;
    }
  }, [cart, fulfillmentType, contactForm, pickupDate, pickupTime]);

  // Handlers
  const handlePayment = async () => {
    if (!cart) return;

    setIsProcessing(true);
    setPromoError(null);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          email: contactForm.email,
          fulfillmentType,
          cartId: cart.id,
          pickupDate: fulfillmentType === "pickup" ? pickupDate : undefined,
          pickupTime: fulfillmentType === "pickup" ? pickupTime : undefined,
          promoCode: cart.appliedCouponCode || undefined,
          userId: (session?.user as any)?.id,
          cartItems: cart.items.map((item) => ({
            id: item.id,
            productRid: item.productRid,
            variantRid: item.variantRid,
            productTitle: item.productTitle,
            variantSku: item.variantSku,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            lineSubtotalCents: item.lineSubtotalCents,
            imageUrl: item.imageUrl,
            currency: item.currency,
          })),
          currency: cart.currency,
        }),
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
      setIsProcessing(false);
    }
  };

  const handleContactChange = (value: string) => {
    setContactForm((prev) => ({ ...prev, email: value }));
  };

  const handleApplyPromo = async () => {
    if (!cart) return;

    const code = promoCode.trim();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    setPromoError(null);
    try {
      const validation = await PromoService.validatePromoCode(
        code,
        cart.totals.subtotalCents
      );

      if (!validation.valid) {
        setPromoError(validation.message || "Invalid promo code");
        return;
      }

      await applyPromoCode(code);
      setPromoCode("");
    } catch {
      setPromoError("Failed to validate promo code");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = async () => {
    await removePromoCode();
    setPromoCode("");
    setPromoError(null);
  };

  // Loading / Empty States
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 text-center lg:py-16">
        <p className="text-lg text-slate-600">Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
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

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-400">Checkout</p>
        <h1 className="text-primary-navy text-3xl font-bold">
          Complete your order
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* 1. Fulfillment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={fulfillmentType}
                onValueChange={(v) =>
                  setFulfillmentType(v as "delivery" | "pickup")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="delivery" className="gap-2">
                    <Truck className="size-4" /> Delivery
                  </TabsTrigger>
                  <TabsTrigger value="pickup" className="gap-2">
                    <Store className="size-4" /> Pickup
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* 2. Addresses or Time Slots */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>
                {fulfillmentType === "delivery"
                  ? "Delivery"
                  : "Pickup Schedule"}
              </CardTitle>
              <CardDescription>
                {fulfillmentType === "delivery"
                  ? "You'll enter delivery address on Stripe Checkout."
                  : "When would you like to come by?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {fulfillmentType === "delivery" ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Delivery address and phone number will be collected on
                    Stripe Checkout.
                  </p>
                </div>
              ) : (
                /* Pickup Form */
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Select a Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {PICKUP_DATES.map((date) => (
                        <button
                          key={date}
                          onClick={() => setPickupDate(date)}
                          className={cn(
                            "flex-shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                            pickupDate === date
                              ? "bg-primary-navy border-primary-navy text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Select a Time</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {PICKUP_TIMES.map((time) => (
                        <button
                          key={time}
                          onClick={() => setPickupTime(time)}
                          className={cn(
                            "rounded-md border px-3 py-2 text-center text-sm transition-all",
                            pickupTime === time
                              ? "border-primary-navy bg-primary-navy/5 text-primary-navy ring-primary-navy font-semibold ring-1"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="rounded-b-lg border-t bg-slate-50 pt-6">
              <div className="w-full">
                <Button
                  size="lg"
                  className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
                  disabled={!canSubmit || isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? "Processing..." : "Continue to payment"}
                </Button>
                <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-slate-500">
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    Encrypted
                  </span>
                  Payments are processed securely
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* 3. Contact */}
          {/* <Card>
            <CardHeader className="border-b">
              <CardTitle>Contact</CardTitle>
              <CardDescription>
                We'll send your receipt and order updates to this email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={contactForm.email}
                  onChange={(e) => handleContactChange(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </CardContent>
          </Card> */}

          {/* 4. Payment Details */}
          {/* <Card>
            <CardFooter className="rounded-b-lg border-t bg-slate-50 pt-6">
              <div className="w-full">
                <Button
                  size="lg"
                  className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
                  disabled={!canSubmit || isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? "Processing..." : "Continue to payment"}
                </Button>
                <p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-slate-500">
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    Encrypted
                  </span>
                  Payments are processed securely
                </p>
              </div>
            </CardFooter>
          </Card> */}
        </div>

        {/* Right Column: Order Summary (Simplified View) */}
        <div className="h-fit space-y-6">
          <Card className="sticky top-24 bg-slate-50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">
                    {formatter.format(totals.subtotal / 100)}
                  </span>
                </div>
                {cart.totals.discountCents > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-medium text-green-600">
                      -{formatter.format(cart.totals.discountCents / 100)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium">
                    {totals.shipping === 0
                      ? "Free"
                      : formatter.format(totals.shipping / 100)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-medium">
                    {formatter.format(totals.tax / 100)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>{formatter.format(totals.total / 100)}</span>
                </div>
              </div>

              {/* Promo code status */}
              <div className="border-t pt-4">
                {cart.appliedCouponCode ? (
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-green-800">
                        {cart.appliedCouponCode}
                      </span>
                      <span className="text-xs text-green-600">
                        Promo code applied
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromo}
                      disabled={isMutating}
                      className="h-8 w-8 p-0 text-green-700 hover:bg-green-100 hover:text-green-900"
                      aria-label="Remove promo code"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Promo Code</p>
                    <div className="flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyPromo();
                          }
                        }}
                        placeholder="Enter code"
                        disabled={isMutating || isValidatingPromo}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0"
                        onClick={handleApplyPromo}
                        disabled={
                          isMutating || isValidatingPromo || !promoCode.trim()
                        }
                      >
                        {isValidatingPromo ? "Validating..." : "Apply"}
                      </Button>
                    </div>
                    {(promoError || error) && (
                      <p className="text-xs text-red-500">
                        {promoError || error}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium">
                  Items ({cart.items.length})
                </p>
                <div className="max-h-40 space-y-1 overflow-y-auto pr-2 text-sm text-slate-500">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="flex-1 truncate pr-4">
                        {item.quantity}x {item.productTitle}
                      </span>
                      <span>{item.formattedLineSubtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

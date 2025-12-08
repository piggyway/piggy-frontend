"use client";

import { useMemo, useState, useEffect } from "react";
import CheckoutButton from "@/components/features/checkout/CheckoutButton";
import { mockAddresses } from "@/lib/mock/account";
import { useCart } from "@/components/features/cart/CartProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ShippingForm = {
  email: string;
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    mockAddresses[0]?.id || "new"
  );

  const [form, setForm] = useState<ShippingForm>({
    email: "zianwang9911@gmail.com",
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (selectedAddressId === "new") {
      setForm((prev) => ({
        ...prev,
        fullName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }));
    } else {
      const address = mockAddresses.find((a) => a.id === selectedAddressId);
      if (address) {
        setForm((prev) => ({
          ...prev,
          fullName: `${address.firstName} ${address.lastName}`,
          phone: "", // Phone not in address type usually, keeping empty or need update
          address1: address.street,
          address2: address.apartment || "",
          city: address.city,
          state: address.state,
          postalCode: address.zipCode,
          country: address.country,
        }));
      }
    }
  }, [selectedAddressId]);
  const [error, setError] = useState<string | null>(null);

  const requiredComplete = useMemo(() => {
    const requiredKeys: Array<keyof ShippingForm> = [
      "email",
      "fullName",
      "address1",
      "city",
      "state",
      "postalCode",
      "country",
    ];
    return requiredKeys.every((key) => form[key].trim().length > 0);
  }, [form]);

  // Calculate tax and shipping from cart totals
  // Note: cart.totals.grandTotalCents already includes discount
  // We'll calculate tax separately for display purposes
  const totals = useMemo(() => {
    if (!cart) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
      };
    }
    const subtotal = cart.totals.subtotalCents;
    // Calculate tax (assuming 10% tax rate on subtotal after discount, adjust as needed)
    const taxBase = subtotal - cart.totals.discountCents;
    const tax = Math.round(taxBase * 0.1); // 10% tax
    return {
      subtotal,
      shipping: 0, // Free shipping for now
      tax,
    };
  }, [cart]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="text-center">
          <p className="text-lg text-slate-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary-navy">
            Your Cart is Empty
          </h1>
          <p className="mb-8 text-slate-600">
            Please add items to your cart before checkout.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-400">Checkout</p>
        <h1 className="text-primary-navy text-3xl font-bold">
          Complete your order
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="border-b">
            <div>
              <CardTitle>Contact &amp; Shipping</CardTitle>
              <CardDescription>
                Fill in your details before continuing to secure payment on
                Stripe.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Address Selection */}
            <div className="space-y-4">
              <label className="text-primary-navy text-sm font-medium">
                Select Address
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {mockAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedAddressId === addr.id
                        ? "border-primary-navy bg-primary-navy/5 ring-primary-navy ring-1"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900">
                          {addr.label}
                        </p>
                        <p className="text-sm text-slate-500">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="text-sm text-slate-500">{addr.street}</p>
                        <p className="text-sm text-slate-500">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <div className="bg-primary-navy flex h-5 w-5 items-center justify-center rounded-full">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => setSelectedAddressId("new")}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition-all ${
                    selectedAddressId === "new"
                      ? "border-primary-navy bg-primary-navy/5 ring-primary-navy ring-1"
                      : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-xl text-slate-600">+</span>
                  </div>
                  <p className="font-medium text-slate-900">New Address</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-primary-navy text-sm font-medium">
                  Full Name *
                </label>
                <Input
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Sofia Davis"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-primary-navy text-sm font-medium">
                  Phone
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-primary-navy text-sm font-medium">
                Email Address *
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="sofia@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-primary-navy text-sm font-medium">
                Address Line 1 *
              </label>
              <Input
                value={form.address1}
                onChange={(e) => handleChange("address1", e.target.value)}
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-primary-navy text-sm font-medium">
                Address Line 2
              </label>
              <Input
                value={form.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
                placeholder="Apt, suite, etc. (optional)"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-primary-navy text-sm font-medium">
                  City *
                </label>
                <Input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Seattle"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-primary-navy text-sm font-medium">
                  State / Province *
                </label>
                <Input
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="WA"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-primary-navy text-sm font-medium">
                  Postal Code *
                </label>
                <Input
                  value={form.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="98101"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-primary-navy text-sm font-medium">
                  Country / Region *
                </label>
                <Input
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="United States"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                You will be redirected to Stripe to securely enter payment.
              </div>
              <CheckoutButton
                payload={{
                  ...form,
                  cartItems: cart.items.map((item) => ({
                    id: String(item.id),
                    productTitle: item.productTitle,
                    variantSku: item.variantSku,
                    quantity: item.quantity,
                    unitPriceCents: item.unitPriceCents,
                    lineSubtotalCents: item.lineSubtotalCents,
                    imageUrl: item.imageUrl,
                    currency: item.currency || cart.currency || "usd",
                  })),
                  currency: cart.currency || "usd",
                }}
                onError={setError}
                disabled={!requiredComplete}
                label="Continue to Payment"
                className="w-full sm:w-auto"
              />
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your items before paying.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 py-4"
                >
                  <div>
                    <p className="text-primary-navy font-medium">
                      {item.productTitle}
                    </p>
                    {item.variantSku && (
                      <p className="text-sm text-slate-500">
                        SKU: {item.variantSku}
                      </p>
                    )}
                    <p className="text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-primary-navy text-sm font-semibold">
                    {item.formattedLineSubtotal}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-primary-navy space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{cart.totals.formattedSubtotal}</span>
              </div>
              {cart.totals.discountCents > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>{cart.totals.formattedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0
                    ? "Free"
                    : formatter.format(totals.shipping / 100)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatter.format(totals.tax / 100)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex w-full items-center justify-between">
              <div className="text-sm text-slate-500">Total</div>
              <div className="text-primary-navy text-xl font-semibold">
                {cart.totals.formattedGrandTotal}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

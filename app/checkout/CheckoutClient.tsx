"use client";

import { useMemo, useState } from "react";
import CheckoutButton from "@/components/features/checkout/CheckoutButton";
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

const orderItems = [
  {
    name: "Cozy Guinea Pig Hideout",
    detail: "Large / Blue",
    price: 2499,
  },
  {
    name: "Premium Timothy Hay",
    detail: "5kg Box",
    price: 7998,
  },
];

const totals = {
  subtotal: orderItems.reduce((sum, item) => sum + item.price, 0),
  shipping: 0,
  tax: 1050,
};

export function CheckoutClient() {
  const [form, setForm] = useState<ShippingForm>({
    email: "",
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
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

  const grandTotal = totals.subtotal + totals.shipping + totals.tax;

  const handleChange = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
      <Card>
        <CardHeader className="border-b">
          <div>
            <CardTitle>Contact &amp; Shipping</CardTitle>
            <CardDescription>
              Fill in your details before continuing to secure payment on Stripe.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-navy">
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
              <label className="text-sm font-medium text-primary-navy">
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
            <label className="text-sm font-medium text-primary-navy">
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
            <label className="text-sm font-medium text-primary-navy">
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
            <label className="text-sm font-medium text-primary-navy">
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
              <label className="text-sm font-medium text-primary-navy">
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
              <label className="text-sm font-medium text-primary-navy">
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
              <label className="text-sm font-medium text-primary-navy">
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
              <label className="text-sm font-medium text-primary-navy">
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
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
              payload={form}
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
            {orderItems.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-3 py-4"
              >
                <div>
                  <p className="font-medium text-primary-navy">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.detail}</p>
                </div>
                <p className="text-sm font-semibold text-primary-navy">
                  {formatter.format(item.price / 100)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm text-primary-navy">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatter.format(totals.subtotal / 100)}</span>
            </div>
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
            <div className="text-xl font-semibold text-primary-navy">
              {formatter.format(grandTotal / 100)}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

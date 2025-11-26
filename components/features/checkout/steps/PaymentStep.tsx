"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PaymentStepProps {
  onBack: () => void;
}

export function PaymentStep({ onBack }: PaymentStepProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Order placed successfully! (Mock)");
    }, 2000);
  }

  return (
    <Card className="flex min-h-[600px] flex-col">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your card information to complete your purchase.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col justify-between gap-6"
        >
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cardholder Name
              </label>
              <Input
                id="name"
                placeholder="Sofia Davis"
                required
                className="bg-white"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="number"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Card Number
              </label>
              <div className="relative">
                <Input
                  id="number"
                  placeholder="0000 0000 0000 0000"
                  required
                  className="bg-white pl-10"
                />
                <CreditCard className="absolute top-2.5 left-3 size-4 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="expiry"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Expiry Date
                </label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  required
                  className="bg-white"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="cvv"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  CVV
                </label>
                <Input
                  id="cvv"
                  placeholder="123"
                  required
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-primary-navy hover:bg-primary-navy/90 text-white"
              disabled={isLoading}
            >
              {isLoading && (
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              Pay Now
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

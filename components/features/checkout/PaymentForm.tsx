"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Payment processed (mock)!");
    }, 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your card information to complete your purchase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Cardholder Name
            </label>
            <Input id="name" placeholder="Sofia Davis" required className="bg-white" />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Card Number
            </label>
            <div className="relative">
              <Input id="number" placeholder="0000 0000 0000 0000" required className="bg-white pl-10" />
              <CreditCard className="absolute left-3 top-2.5 size-4 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="expiry" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Expiry Date
              </label>
              <Input id="expiry" placeholder="MM/YY" required className="bg-white" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="cvv" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                CVV
              </label>
              <Input id="cvv" placeholder="123" required className="bg-white" />
            </div>
          </div>

          <Button className="w-full bg-primary-navy hover:bg-primary-navy/90 text-white" disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            Pay Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

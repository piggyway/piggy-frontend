"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Truck } from "lucide-react";
import { useState } from "react";

export function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="mx-auto max-w-md text-center">
          <div className="bg-primary-purple/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Truck className="text-primary-navy size-6" />
          </div>
          <h2 className="text-primary-navy mb-2 text-2xl font-semibold">
            Track Your Order
          </h2>
          <p className="mb-6 text-gray-500">
            Enter your order number below to check the status of your shipment.
          </p>

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Order Number (e.g. ORD-2023-001)"
                className="pl-10"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? "Searching..." : "Track Order"}
            </Button>
          </form>
        </div>
      </div>

      {/* Example Result Placeholder - In a real app, show results here */}
      {/* <div className="rounded-lg bg-white p-6 shadow-sm">
        ...
      </div> */}
    </div>
  );
}

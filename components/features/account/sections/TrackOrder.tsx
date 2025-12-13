"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2, Package, Search, Truck, MapPin } from "lucide-react";
import { useState } from "react";

interface TrackingEvent {
  status: string;
  date: string;
  location: string;
  description: string;
  completed: boolean;
}

interface TrackingResult {
  orderId: string;
  estimatedDelivery: string;
  carrier: string;
  events: TrackingEvent[];
}

const mockTrackingData: TrackingResult = {
  orderId: "ORD-2023-001",
  estimatedDelivery: "Oct 22, 2023",
  carrier: "FedEx",
  events: [
    {
      status: "Delivered",
      date: "Oct 22, 2023 - 10:38 AM",
      location: "Guinea Town, CA",
      description: "Package delivered to front porch",
      completed: true,
    },
    {
      status: "Out for Delivery",
      date: "Oct 22, 2023 - 8:15 AM",
      location: "Guinea Town, CA",
      description: "Driver is on the way",
      completed: true,
    },
    {
      status: "In Transit",
      date: "Oct 21, 2023 - 6:42 PM",
      location: "San Bernardino, CA",
      description: "Arrived at distribution center",
      completed: true,
    },
    {
      status: "Shipped",
      date: "Oct 20, 2023 - 4:30 PM",
      location: "Los Angeles, CA",
      description: "Package has left the facility",
      completed: true,
    },
    {
      status: "Order Placed",
      date: "Oct 19, 2023 - 2:15 PM",
      location: "Online",
      description: "Order confirmed and ready for processing",
      completed: true,
    },
  ],
};

export function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResult(mockTrackingData);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div
          className={cn(
            "mx-auto transition-all duration-300",
            result ? "max-w-4xl" : "max-w-md text-center"
          )}
        >
          {!result && (
            <div className="bg-primary-purple/20 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
              <Truck className="text-primary-navy size-6" />
            </div>
          )}

          <h2
            className={cn(
              "text-primary-navy mb-2 font-semibold",
              result ? "text-xl" : "text-2xl"
            )}
          >
            Track Your Order
          </h2>

          {!result && (
            <p className="mb-6 text-gray-500">
              Enter your order number below to check the status of your
              shipment.
            </p>
          )}

          <form
            onSubmit={handleTrack}
            className={cn("flex gap-2", result ? "" : "flex-col space-y-4")}
          >
            <div className="relative flex-1">
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
            <Button
              type="submit"
              className={cn(result ? "w-auto" : "w-full")}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Track"}
            </Button>
          </form>
        </div>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 rounded-lg border bg-white p-6 shadow-sm duration-500">
          {/* Status Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Tracking Number</p>
              <p className="text-xl font-bold text-gray-900">
                {result.orderId}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="text-xl font-bold text-green-600">
                {result.estimatedDelivery}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Valid through</p>
              <p className="font-medium text-gray-900">{result.carrier}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative space-y-8 pl-4 before:absolute before:inset-y-2 before:left-[27px] before:w-0.5 before:bg-gray-200">
            {result.events.map((event, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Icon Marker */}
                <div
                  className={cn(
                    "relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-white",
                    event.completed
                      ? "border-green-500 text-green-500"
                      : "border-gray-300 text-gray-300"
                  )}
                >
                  {event.completed ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <div className="size-2 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 pt-0.5">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <p
                      className={cn(
                        "font-semibold",
                        event.completed ? "text-gray-900" : "text-gray-500"
                      )}
                    >
                      {event.status}
                    </p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                  {event.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="size-3" />
                      {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

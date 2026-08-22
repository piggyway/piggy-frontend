"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle2,
  MapPin,
  Package,
  Store,
  Truck,
} from "lucide-react";
import { OrderService } from "@/lib/services/order";
import type { OrderStatus } from "@/lib/types/order";
import { motion, AnimatePresence } from "framer-motion";

interface ShippingAddress {
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

interface TrackingData {
  order_number: string;
  status: OrderStatus;
  date_updated: string;
  date_created: string;
  shipped_at: string | null;
  delivery_method: string | null;
  shipping_address: ShippingAddress | null;
}

interface TrackOrderProps {
  initialOrderNumber?: string | null;
}

const statusPill: Partial<
  Record<OrderStatus, { label: string; className: string }>
> = {
  pending_payment: {
    label: "Pending payment",
    className: "bg-primary-gold/20 text-primary-navy",
  },
  paid: { label: "Paid", className: "bg-secondary-mint text-green-600" },
  processing: {
    label: "Processing",
    className: "bg-primary-gold/20 text-primary-navy",
  },
  shipped: {
    label: "Shipped",
    className: "bg-primary-purple text-primary-navy",
  },
  completed: {
    label: "Delivered",
    className: "bg-secondary-mint text-green-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-neutral-pink-background text-rose-600",
  },
  refunded: {
    label: "Refunded",
    className: "bg-neutral-grey-background text-slate-600",
  },
  disputed: { label: "Disputed", className: "bg-orange-100 text-orange-700" },
};

const STEP_ICONS: Record<string, React.ElementType> = {
  paid: CheckCircle2,
  processing: Package,
  shipped: Truck,
  completed: CheckCircle2,
};

export function TrackOrder({ initialOrderNumber }: TrackOrderProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber ?? "");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoTrackedRef = useRef(false);

  const track = useCallback(async (value: string) => {
    if (!value.trim()) {
      setError("Please enter an order number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const data = await OrderService.getOrderTracking(value.trim());
      setTrackingData(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Order not found. Please check your order number."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-track when opened from an order's "Track this order" button
  useEffect(() => {
    if (!autoTrackedRef.current && initialOrderNumber) {
      autoTrackedRef.current = true;
      void track(initialOrderNumber);
    }
  }, [initialOrderNumber, track]);

  const getStatusTimeline = (
    status: OrderStatus,
    deliveryMethod: string | null
  ) => {
    const isPickup = deliveryMethod === "pickup";

    const steps = [
      {
        key: "paid",
        label: "Order placed",
        description: "We have received your order and payment.",
      },
      {
        key: "processing",
        label: "Processing",
        description: "We are carefully packing your items.",
      },
      {
        key: "shipped",
        label: isPickup ? "Ready for pickup" : "Shipped",
        description: isPickup
          ? "Your order is ready for collection at our store."
          : "Your order is on the way to you.",
      },
      {
        key: "completed",
        label: isPickup ? "Picked up" : "Delivered",
        description: isPickup
          ? "You have successfully picked up your order."
          : "Your package has been safely delivered.",
      },
    ];

    const statusOrder = ["paid", "processing", "shipped", "completed"];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, idx) => ({
      ...step,
      completed: idx < currentIndex,
      current: idx === currentIndex,
    }));
  };

  const pill = trackingData ? statusPill[trackingData.status] : undefined;
  const isPickup = trackingData?.delivery_method === "pickup";
  let displayStatus = pill?.label ?? "";
  if (trackingData && isPickup) {
    if (trackingData.status === "shipped") displayStatus = "Ready for Pickup";
    if (trackingData.status === "completed") displayStatus = "Picked Up";
  }

  const address = trackingData?.shipping_address;
  const addr = address?.address;

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          placeholder="Enter order number (e.g. ORD-MJ5OLFL4-37QE)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void track(orderNumber);
          }}
          className="border-neutral-stroke text-subtle text-primary-navy focus:border-primary-navy focus:ring-primary-navy/20 h-12 min-w-0 flex-1 rounded-full border bg-white pl-5 outline-none placeholder:text-slate-400 focus:ring-2"
        />
        <Button
          onClick={() => void track(orderNumber)}
          disabled={isLoading}
          className="text-subtle-semibold h-12 rounded-full px-7"
        >
          {isLoading ? "Searching..." : "Track order"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-subtle rounded-[14px] border border-red-200 bg-red-50 px-5 py-3.5 text-red-600"
        >
          {error}
        </motion.div>
      )}

      {/* Tracking Results */}
      <AnimatePresence mode="wait">
        {trackingData && (
          <motion.div
            key={trackingData.order_number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="flex w-full flex-col gap-6 lg:flex-row lg:items-start"
          >
            {/* Left: timeline */}
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div className="border-neutral-stroke flex flex-col gap-6 rounded-[20px] border bg-white px-6 py-7 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-[3px]">
                    <h3 className="text-primary-navy text-p-ui font-semibold">
                      Order {trackingData.order_number}
                    </h3>
                    <p className="text-subtle text-slate-400">
                      Placed on{" "}
                      {new Date(trackingData.date_created).toLocaleDateString(
                        "en-AU"
                      )}
                    </p>
                  </div>
                  {pill && (
                    <span
                      className={cn(
                        "text-subtle-semibold rounded-full px-4 py-1.5",
                        pill.className
                      )}
                    >
                      {displayStatus}
                    </span>
                  )}
                </div>

                {/* Timeline */}
                {["paid", "processing", "shipped", "completed"].includes(
                  trackingData.status
                ) && (
                  <div className="flex flex-col">
                    {getStatusTimeline(
                      trackingData.status,
                      trackingData.delivery_method
                    ).map((step, idx, steps) => {
                      const StepIcon = STEP_ICONS[step.key] ?? Package;
                      const isLast = idx === steps.length - 1;
                      const reached = step.completed || step.current;
                      return (
                        <div key={step.key} className="flex items-start gap-4">
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-full",
                              step.current
                                ? "bg-primary-navy"
                                : step.completed
                                  ? "bg-secondary-mint"
                                  : "border-neutral-stroke border-2 bg-white"
                            )}
                          >
                            {step.completed && (
                              <Check className="size-4 text-green-600" />
                            )}
                            {step.current && (
                              <StepIcon className="size-4 text-white" />
                            )}
                          </div>
                          <div
                            className={cn(
                              "flex min-w-0 flex-1 flex-col gap-[3px]",
                              !isLast && "pb-7"
                            )}
                          >
                            <p
                              className={cn(
                                "text-p font-semibold",
                                reached ? "text-primary-navy" : "text-slate-400"
                              )}
                            >
                              {step.label}
                            </p>
                            <p
                              className={cn(
                                "text-subtle",
                                reached ? "text-slate-600" : "text-slate-400"
                              )}
                            >
                              {step.description}
                            </p>
                            {step.key === "shipped" &&
                              reached &&
                              trackingData.shipped_at && (
                                <p className="text-detail text-slate-400">
                                  {new Date(
                                    trackingData.shipped_at
                                  ).toLocaleDateString("en-AU")}{" "}
                                  ·{" "}
                                  {new Date(
                                    trackingData.shipped_at
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-neutral-stroke h-px w-full" />

                <p className="text-detail text-slate-400">
                  Last updated{" "}
                  {new Date(trackingData.date_updated).toLocaleDateString(
                    "en-AU"
                  )}{" "}
                  at{" "}
                  {new Date(trackingData.date_updated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {!isPickup && (
                <div className="bg-secondary-mint rounded-[14px] px-5 py-3.5">
                  <p className="text-subtle-medium text-primary-navy">
                    Most orders arrive within 7–14 business days.
                  </p>
                </div>
              )}
            </div>

            {/* Right: info cards */}
            <div className="flex w-full flex-col gap-5 lg:w-[340px] lg:shrink-0">
              {!isPickup && address && (
                <div className="border-neutral-stroke flex flex-col gap-3.5 rounded-[20px] border bg-white px-6 py-[22px]">
                  <h4 className="text-primary-navy text-p font-semibold">
                    Delivery address
                  </h4>
                  {address.name && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-subtle text-slate-400">
                        Recipient
                      </span>
                      <span className="text-subtle-medium text-primary-navy">
                        {address.name}
                      </span>
                    </div>
                  )}
                  {addr && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-subtle text-slate-400">
                        Address
                      </span>
                      <span className="text-subtle-medium text-primary-navy">
                        {[
                          addr.line1,
                          addr.line2,
                          [addr.city, addr.state, addr.postal_code]
                            .filter(Boolean)
                            .join(" "),
                          addr.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  {address.phone && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-subtle text-slate-400">Phone</span>
                      <span className="text-subtle-medium text-primary-navy">
                        {address.phone}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isPickup && (
                <div className="border-neutral-stroke flex flex-col gap-2.5 rounded-[20px] border bg-white px-6 py-[22px]">
                  <div className="flex items-center gap-2.5">
                    <Store className="text-primary-navy size-[18px]" />
                    <h4 className="text-primary-navy text-p font-semibold">
                      Pickup order
                    </h4>
                  </div>
                  <p className="text-subtle text-slate-600">
                    This is a pickup order. Please collect from our store when
                    ready.
                  </p>
                </div>
              )}

              <div className="border-neutral-stroke flex flex-col items-start gap-2.5 rounded-[20px] border bg-white px-6 py-[22px]">
                <h4 className="text-primary-navy text-p font-semibold">
                  Need a hand?
                </h4>
                <p className="text-subtle text-slate-600">
                  Questions about your delivery — we usually reply within a day.
                </p>
                <Link
                  href="/contact"
                  className="text-subtle-semibold text-primary-navy-light hover:underline"
                >
                  Contact support →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle state */}
      {!trackingData && !error && !isLoading && (
        <div className="border-neutral-stroke flex flex-col items-center gap-3 rounded-[20px] border bg-white px-8 py-12 text-center">
          <div className="bg-secondary-mint flex size-12 items-center justify-center rounded-full">
            <MapPin className="text-primary-navy size-5" />
          </div>
          <p className="text-subtle text-slate-600">
            Enter your order number above to check the delivery status.
          </p>
        </div>
      )}
    </div>
  );
}

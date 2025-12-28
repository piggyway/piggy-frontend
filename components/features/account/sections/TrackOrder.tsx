"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Search,
  CreditCard,
  XCircle,
  RotateCcw,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { OrderService } from "@/lib/services/order";
import type { OrderStatus } from "@/lib/types/order";
import { motion, AnimatePresence } from "framer-motion";

interface TrackingData {
  order_number: string;
  status: OrderStatus;
  date_updated: string;
  date_created: string;
  shipped_at: string | null;
  delivery_method: string | null;
  shipping_address: any;
}

export function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const data = await OrderService.getOrderTracking(orderNumber.trim());
      setTrackingData(data);
    } catch (e: any) {
      setError(e.message || "Order not found. Please check your order number.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig: Record<
    OrderStatus,
    { label: string; color: string; icon: any }
  > = {
    pending_payment: {
      label: "Pending Payment",
      color: "yellow",
      icon: CreditCard,
    },
    paid: { label: "Payment Received", color: "green", icon: Wallet },
    processing: { label: "Processing Order", color: "blue", icon: Package },
    shipped: { label: "Shipped", color: "purple", icon: Truck },
    completed: { label: "Delivered", color: "green", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", color: "red", icon: XCircle },
    refunded: { label: "Refunded", color: "gray", icon: RotateCcw },
    disputed: { label: "Disputed", color: "orange", icon: AlertCircle },
  };

  const getStatusTimeline = (
    status: OrderStatus,
    deliveryMethod: string | null
  ) => {
    const isPickup = deliveryMethod === "pickup";

    const steps = [
      {
        key: "paid",
        label: "Order Placed",
        description: "We have received your order and payment.",
      },
      {
        key: "processing",
        label: "Processing",
        description: "We are currently packing your items with care.",
      },
      {
        key: "shipped",
        label: isPickup ? "Ready for Pickup" : "Shipped",
        description: isPickup
          ? "Your order is ready for collection at our store."
          : "Your order is on the way to you.",
      },
      {
        key: "completed",
        label: isPickup ? "Picked Up" : "Delivered",
        description: isPickup
          ? "You have successfully picked up your order."
          : "Your package has been safely delivered.",
      },
    ];

    const statusOrder = ["paid", "processing", "shipped", "completed"];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, idx) => ({
      ...step,
      completed: idx <= currentIndex,
    }));
  };

  const formatAddress = (address: any) => {
    if (!address || !address.address) return null;
    const addr = address.address;
    return (
      <div className="text-sm text-gray-600">
        {address.name && (
          <p className="font-medium text-gray-900">{address.name}</p>
        )}
        <p>{addr.line1}</p>
        {addr.line2 && <p>{addr.line2}</p>}
        <p>
          {[addr.city, addr.state, addr.postal_code].filter(Boolean).join(" ")}
        </p>
        {addr.country && <p>{addr.country}</p>}
        {address.phone && <p className="mt-1">{address.phone}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-primary-navy text-2xl font-semibold">
          Track Your Order
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your order number to check the delivery status
        </p>
      </div>

      {/* Search Form */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Enter order number (e.g., ORD-MJ5OLFL4-37QE)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleTrack()}
            className="pl-9"
          />
        </div>
        <Button
          onClick={handleTrack}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? "Searching..." : "Track Order"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm text-red-600">{error}</p>
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
            className="space-y-6"
          >
            {/* Order Status Card */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order {trackingData.order_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(trackingData.date_created).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    statusConfig[trackingData.status].color === "green"
                      ? "bg-green-100 text-green-700"
                      : statusConfig[trackingData.status].color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : statusConfig[trackingData.status].color === "purple"
                          ? "bg-purple-100 text-purple-700"
                          : statusConfig[trackingData.status].color === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : statusConfig[trackingData.status].color === "red"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {(() => {
                    const config = statusConfig[trackingData.status];
                    const StatusIcon = config.icon;
                    return (
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span>
                          {trackingData.delivery_method === "pickup"
                            ? trackingData.status === "shipped"
                              ? "Ready for Pickup"
                              : trackingData.status === "completed"
                                ? "Picked Up"
                                : config.label
                            : config.label}
                        </span>
                      </div>
                    );
                  })()}
                </span>
              </div>

              {/* Status Timeline */}
              {["paid", "processing", "shipped", "completed"].includes(
                trackingData.status
              ) && (
                <div className="space-y-4">
                  {getStatusTimeline(
                    trackingData.status,
                    trackingData.delivery_method
                  ).map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                          step.completed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          <div className="size-3 rounded-full border-2 border-current" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <p
                          className={`font-medium ${
                            step.completed ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {step.description}
                        </p>
                        {step.key === "shipped" && trackingData.shipped_at && (
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(
                              trackingData.shipped_at
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              trackingData.shipped_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Last Updated */}
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(trackingData.date_updated).toLocaleDateString()} at{" "}
                  {new Date(trackingData.date_updated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            {trackingData.delivery_method === "delivery" &&
              trackingData.shipping_address && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-lg border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-purple-50 p-2 text-purple-600">
                      <MapPin className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-2 font-medium text-gray-900">
                        Delivery Address
                      </p>
                      {formatAddress(trackingData.shipping_address)}
                    </div>
                  </div>
                </motion.div>
              )}

            {/* Pickup Information */}
            {trackingData.delivery_method === "pickup" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-lg border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-50 p-2 text-blue-600">
                    <Package className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-2 font-medium text-gray-900">
                      Pickup Order
                    </p>
                    <p className="text-sm text-gray-600">
                      This is a pickup order. Please collect from our store when
                      ready.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

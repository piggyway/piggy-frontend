"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Wallet,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { OrderService } from "@/lib/services/order";
import type { OrderStatus, OrderWithItems } from "@/lib/types/order";
import { motion } from "framer-motion";

interface OrderDetailsProps {
  orderNumber: string;
  onBack: () => void;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: any }
> = {
  pending_payment: {
    label: "Pending payment",
    color: "bg-yellow-100 text-yellow-800",
    icon: CreditCard,
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700",
    icon: Wallet,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    color: "bg-slate-100 text-slate-700",
    icon: RotateCcw,
  },
  disputed: {
    label: "Disputed",
    color: "bg-orange-100 text-orange-700",
    icon: AlertCircle,
  },
};

export function OrderDetails({ orderNumber, onBack }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const detail = await OrderService.getOrderDetail(orderNumber);
        if (cancelled) return;
        setOrder(detail);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to load order");
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  const handleRefund = () => {
    toast.success("Refund request initiated successfully.");
  };

  const handleConfirmReceipt = () => {
    toast.success("Reception confirmed. Thank you!");
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <h2 className="text-primary-navy text-2xl font-bold">
            Order Details
          </h2>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-1/3 rounded bg-gray-100"></div>
          <div className="h-40 rounded bg-gray-100"></div>
          <div className="h-20 rounded bg-gray-100"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <h2 className="text-primary-navy text-2xl font-bold">
            Order Details
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-red-500">{error || "Order not found"}</p>
          <Button onClick={() => onBack()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const shipping = order.shipping_address as any;
  const shippingName = shipping?.name ?? shipping?.customer_name ?? null;
  const shippingPhone = shipping?.phone ?? null;
  const addr = shipping?.address ?? null;
  const hasShippingAddress = Boolean(
    addr?.line1 || addr?.city || addr?.postal_code
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h2 className="text-primary-navy text-2xl font-bold">
            Order Details
          </h2>
          <p className="text-sm text-gray-500">Order: {order.order_number}</p>
        </div>
        <div className="ml-auto">
          {(() => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                  config.color
                )}
              >
                <StatusIcon className="h-4 w-4" />
                {config.label}
              </span>
            );
          })()}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          {/* Order Items */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Order Items
            </h3>
            <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 overflow-hidden rounded-md border bg-white">
                      <Image
                        src={item.image_url || "/default-product-image.png"}
                        alt={item.product_title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product_title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} ×{" "}
                        {currencyFormatter.format(item.unit_price_cents / 100)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {currencyFormatter.format(item.line_total_cents / 100)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>
                  {currencyFormatter.format(order.subtotal_amt / 100)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-gray-900">
                <span>Total</span>
                <span>
                  {currencyFormatter.format(order.grand_total_amt / 100)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {order.status === "completed" && (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleConfirmReceipt}
              >
                Confirm Receipt
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleRefund}
            >
              Request Refund
            </Button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 pt-[43px]">
          <div className="rounded-lg border border-gray-100 p-4">
            <h4 className="mb-4 font-semibold text-gray-900">Order Info</h4>
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                  <Package className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Order Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.date_created).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                  <Truck className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Delivery Method
                  </p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {order.delivery_method === "delivery"
                      ? "Home Delivery"
                      : order.delivery_method === "pickup"
                        ? "Store Pickup"
                        : order.delivery_method || "Delivery"}
                  </p>
                </div>
              </div>

              {/* Shipping Status */}
              {(order.status === "shipped" || order.status === "completed") &&
                order.shipped_at && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-50 p-2 text-green-600">
                      <Package className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Shipping Status
                      </p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {order.status === "completed" ? "Delivered" : "Shipped"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.shipped_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 p-4">
            <h4 className="mb-4 font-semibold text-gray-900">
              Shipping Address
            </h4>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-purple-50 p-2 text-purple-600">
                <MapPin className="size-4" />
              </div>
              <div>
                {hasShippingAddress ? (
                  <>
                    {shippingName && (
                      <p className="text-sm font-medium text-gray-900">
                        {shippingName}
                      </p>
                    )}
                    <div className="mt-1 text-sm text-gray-600">
                      <p>{addr?.line1}</p>
                      {addr?.line2 && <p>{addr.line2}</p>}
                      <p>
                        {[addr?.city, addr?.state, addr?.postal_code]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      {addr?.country && <p>{addr.country}</p>}
                      {shippingPhone && <p className="mt-1">{shippingPhone}</p>}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    No shipping address (pickup order).
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 p-4">
            <h4 className="mb-4 font-semibold text-gray-900">Payment</h4>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-orange-50 p-2 text-orange-600">
                <CreditCard className="size-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Payment Method
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Visa ending in 4242
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

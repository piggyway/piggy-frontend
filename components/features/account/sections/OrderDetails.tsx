"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { OrderService } from "@/lib/services/order";
import type { OrderStatus, OrderWithItems } from "@/lib/types/order";
import { motion } from "framer-motion";

interface OrderDetailsProps {
  orderNumber: string;
  onBack: () => void;
  onTrack?: (orderNumber: string) => void;
}

const statusPill: Record<OrderStatus, { label: string; className: string }> = {
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
    className: "border-neutral-stroke border bg-white text-slate-600",
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

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-slate-400">{label}</span>
      <span className="text-subtle-medium text-primary-navy">{value}</span>
    </div>
  );
}

export function OrderDetails({
  orderNumber,
  onBack,
  onTrack,
}: OrderDetailsProps) {
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
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load order");
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

  const backLink = (
    <button
      type="button"
      onClick={onBack}
      className="text-subtle-medium text-primary-navy-light hover:underline"
    >
      ← Back to orders
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-start gap-6">
        {backLink}
        <div className="w-full animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded-full bg-white" />
          <div className="h-64 rounded-[20px] bg-white" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[400px] flex-col items-start gap-6">
        {backLink}
        <div className="border-neutral-stroke flex w-full flex-col items-center gap-4 rounded-[20px] border bg-white p-12 text-center">
          <p className="text-subtle text-red-500">
            {error || "Order not found"}
          </p>
          <Button onClick={onBack} variant="outline" className="rounded-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const shipping = order.shipping_address as {
    name?: string;
    customer_name?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  } | null;
  const shippingName = shipping?.name ?? shipping?.customer_name ?? null;
  const shippingPhone = shipping?.phone ?? null;
  const addr = shipping?.address ?? null;
  const hasShippingAddress = Boolean(
    addr?.line1 || addr?.city || addr?.postal_code
  );

  const isPickup = order.delivery_method === "pickup";
  const deliveryMethodLabel = isPickup ? "Store Pickup" : "Home Delivery";
  let displayStatus = statusPill[order.status].label;
  if (isPickup) {
    if (order.status === "shipped") displayStatus = "Ready for Pickup";
    if (order.status === "completed") displayStatus = "Picked Up";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-start gap-6"
    >
      {backLink}

      {/* Head */}
      <div className="flex w-full flex-wrap items-center justify-between gap-3.5">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary-navy text-[24px] font-semibold">
            Order {order.order_number}
          </h2>
          <p className="text-subtle text-slate-400">
            Placed {new Date(order.date_created).toLocaleDateString("en-AU")} ·{" "}
            {deliveryMethodLabel}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-semibold",
            statusPill[order.status].className
          )}
        >
          {displayStatus}
        </span>
      </div>

      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left: items + actions */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="border-neutral-stroke flex flex-col gap-[18px] rounded-[20px] border bg-white px-6 py-7 sm:px-8">
            <h3 className="text-primary-navy text-[18px] font-semibold">
              Order items
            </h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="border-neutral-stroke relative size-16 shrink-0 overflow-hidden rounded-[14px] border bg-white">
                  <Image
                    src={item.image_url || "/default-product-image.png"}
                    alt={item.product_title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="text-primary-navy truncate text-[15px] font-medium">
                    {item.product_title}
                  </p>
                  <p className="text-[13px] text-slate-400">
                    {currencyFormatter.format(item.unit_price_cents / 100)} each
                  </p>
                  {item.add_ons && item.add_ons.length > 0 && (
                    <div className="mt-0.5 flex flex-col gap-0.5">
                      {item.add_ons.map((addOn, addOnIdx) => (
                        <p
                          key={`${addOn.add_on_rid ?? addOn.name}-${addOnIdx}`}
                          className="text-[12px] text-slate-400"
                        >
                          + {addOn.name} (
                          {currencyFormatter.format(
                            addOn.unit_price_cents / 100
                          )}
                          )
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[13px] text-slate-400">
                  × {item.quantity}
                </span>
                <span className="text-primary-navy text-[15px] font-semibold">
                  {currencyFormatter.format(item.line_total_cents / 100)}
                </span>
              </div>
            ))}

            <div className="bg-neutral-stroke h-px w-full" />

            <div className="flex items-center justify-between">
              <span className="text-subtle text-slate-600">Subtotal</span>
              <span className="text-subtle-medium text-primary-navy">
                {currencyFormatter.format(order.subtotal_amt / 100)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-subtle text-slate-600">Shipping</span>
              <span className="text-subtle-medium text-primary-navy">Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-navy text-[16px] font-medium">
                Total
              </span>
              <span className="text-primary-navy text-[20px] font-bold">
                {currencyFormatter.format(order.grand_total_amt / 100)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3.5">
            {order.status === "completed" && (
              <Button
                onClick={handleConfirmReceipt}
                className="text-subtle-semibold h-[46px] rounded-full px-7"
              >
                Confirm receipt
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleRefund}
              className="text-subtle-semibold h-[46px] rounded-full border-[1.5px] border-rose-600 px-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Request refund
            </Button>
          </div>
        </div>

        {/* Right: info cards */}
        <div className="flex w-full flex-col gap-5 lg:w-[340px] lg:shrink-0">
          <div className="border-neutral-stroke flex flex-col gap-3.5 rounded-[20px] border bg-white px-6 py-5">
            <h4 className="text-primary-navy text-[16px] font-semibold">
              Order info
            </h4>
            <InfoRow
              label="Order date"
              value={new Date(order.date_created).toLocaleDateString("en-AU")}
            />
            <InfoRow label="Delivery method" value={deliveryMethodLabel} />
            {(order.status === "shipped" || order.status === "completed") &&
              order.shipped_at && (
                <InfoRow
                  label="Shipping status"
                  value={`${
                    order.status === "completed" ? "Delivered" : "Shipped"
                  } · ${new Date(order.shipped_at).toLocaleDateString("en-AU")}`}
                />
              )}
          </div>

          <div className="border-neutral-stroke flex flex-col gap-3.5 rounded-[20px] border bg-white px-6 py-5">
            <h4 className="text-primary-navy text-[16px] font-semibold">
              Shipping address
            </h4>
            {hasShippingAddress ? (
              <>
                {shippingName && (
                  <InfoRow label="Recipient" value={shippingName} />
                )}
                <InfoRow
                  label="Address"
                  value={[
                    addr?.line1,
                    addr?.line2,
                    [addr?.city, addr?.state, addr?.postal_code]
                      .filter(Boolean)
                      .join(" "),
                    addr?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
                {shippingPhone && (
                  <InfoRow label="Phone" value={shippingPhone} />
                )}
              </>
            ) : (
              <p className="text-subtle text-slate-600">
                No shipping address (pickup order).
              </p>
            )}
          </div>

          <div className="border-neutral-stroke flex flex-col gap-3.5 rounded-[20px] border bg-white px-6 py-5">
            <h4 className="text-primary-navy text-[16px] font-semibold">
              Payment
            </h4>
            <InfoRow label="Method" value="Paid securely via Stripe" />
          </div>

          {onTrack && (
            <Button
              variant="outline"
              onClick={() => onTrack(order.order_number)}
              className="border-primary-navy text-subtle-semibold text-primary-navy h-[46px] w-full rounded-full border-[1.5px]"
            >
              Track this order →
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

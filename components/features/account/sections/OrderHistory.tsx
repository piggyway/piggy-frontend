"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Package,
  Truck,
  Store,
  Copy,
  CreditCard,
  Wallet,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  Clock,
} from "lucide-react";
import { OrderService } from "@/lib/services/order";
import type { OrderWithItems, OrderStatus } from "@/lib/types/order";
import { normalizeImageUrl } from "@/lib/utils/images";
import { motion, AnimatePresence } from "framer-motion";

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

const FALLBACK_IMAGE = "/default-product-image.png";

interface OrderHistoryProps {
  onOrderClick: (orderNumber: string) => void;
}

export function OrderHistory({ onOrderClick }: OrderHistoryProps) {
  const PAGE_SIZE = 10;

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const listContainerRef = useRef<HTMLDivElement>(null);

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
        const result = await OrderService.getOrders(currentPage, PAGE_SIZE);
        if (cancelled) return;
        setOrders(result.orders);
        setTotalItems(result.meta.total);
        const computedTotalPages = Math.max(
          1,
          Math.ceil(result.meta.total / result.meta.limit)
        );
        setTotalPages(computedTotalPages);

        // If we somehow landed on an invalid page (e.g. total decreased), snap back.
        if (currentPage > computedTotalPages) {
          setCurrentPage(computedTotalPages);
          return;
        }
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Failed to load orders");
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Order History
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Order History
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-red-50 p-3">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <p className="mb-2 text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <div className="min-h-[400px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Order History
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-gray-50 p-4">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">
            No orders yet
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Looks like you haven't placed any orders yet.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[800px] flex-col space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="mx-1 flex flex-shrink-0 items-center justify-between">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Order History
        </h2>
      </div>

      <div ref={listContainerRef} className="flex-1 overflow-y-auto pr-2">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {isLoading && orders.length > 0 && (
              <motion.div
                key="loading-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sticky top-0 z-10 rounded-lg border bg-white/80 p-3 text-sm text-slate-600 backdrop-blur"
              >
                Loading…
              </motion.div>
            )}
          </AnimatePresence>

          {orders.map((order) => {
            // Determine active status display logic (including Pickup vs Shipping)
            const isPickup = order.delivery_method === "pickup";
            let displayStatus = statusConfig[order.status].label;
            if (isPickup) {
              if (order.status === "shipped")
                displayStatus = "Ready for Pickup";
              if (order.status === "completed") displayStatus = "Picked Up";
            }

            return (
              <motion.div
                key={order.order_number}
                variants={itemVariants}
                className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {new Date(order.date_created).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{order.order_number}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.order_number);
                          toast.success("Order number copied to clipboard");
                        }}
                        className="hover:text-primary-navy text-gray-400 transition-colors"
                        title="Copy order number"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Delivery Method Badge */}
                    {isPickup ? (
                      <div className="flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        <Store className="h-3 w-3" />
                        Pickup
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                        <Truck className="h-3 w-3" />
                        Delivery
                      </div>
                    )}
                  </div>

                  {(() => {
                    const config = statusConfig[order.status];
                    const StatusIcon = config.icon;
                    return (
                      <span
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                          config.color
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {displayStatus}
                      </span>
                    );
                  })()}
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => {
                      const imageUrl =
                        normalizeImageUrl(item.image_url, {
                          maxWidth: 200,
                        }) || FALLBACK_IMAGE;

                      return (
                        <div
                          key={idx}
                          className="flex gap-4 p-4 hover:bg-gray-50/50"
                        >
                          {/* Product Image */}
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white">
                            <Image
                              src={imageUrl}
                              alt={item.product_title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex flex-1 flex-col justify-between sm:flex-row sm:gap-8">
                            <div className="flex-1 space-y-1">
                              <h4 className="line-clamp-2 font-medium text-gray-900">
                                {item.product_title}
                              </h4>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                {item.variant_attributes &&
                                  Array.isArray(item.variant_attributes) &&
                                  item.variant_attributes.map((attr, i) => (
                                    <span
                                      key={i}
                                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs"
                                    >
                                      {attr.option_name}: {attr.option_value}
                                    </span>
                                  ))}
                              </div>
                            </div>

                            <div className="mt-2 flex items-end justify-between sm:mt-0 sm:flex-col sm:items-end sm:justify-start sm:text-right">
                              <p className="font-medium text-gray-900">
                                {currencyFormatter.format(
                                  item.unit_price_cents / 100
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                x {item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback if no items (should ideally not happen with updated backend)
                    <div className="p-8 text-center text-gray-500">
                      No items found for this order.
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="text-primary-navy text-lg font-bold">
                      {currencyFormatter.format(order.grand_total_amt / 100)}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOrderClick(order.order_number)}
                    >
                      Track Order
                    </Button> */}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onOrderClick(order.order_number)}
                    >
                      Order Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination */}
      <div className="flex flex-shrink-0 flex-col gap-3 border-t pt-4">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <PaginationInfo
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            total={totalItems}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              const safePage = Math.min(Math.max(1, page), totalPages);
              if (safePage === currentPage) return;
              setCurrentPage(safePage);
              // Reset scroll position when page changes
              listContainerRef.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

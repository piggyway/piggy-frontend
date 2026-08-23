"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Copy, Package } from "lucide-react";
import { OrderService } from "@/lib/services/order";
import type { OrderWithItems, OrderStatus } from "@/lib/types/order";
import { normalizeImageUrl } from "@/lib/utils/images";
import { formatCents } from "@/lib/utils/format";
import { motion, AnimatePresence } from "framer-motion";

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
    className: "bg-neutral-pink-background text-destructive",
  },
  refunded: {
    label: "Refunded",
    className: "bg-neutral-grey-background text-slate-600",
  },
  disputed: { label: "Disputed", className: "bg-orange-100 text-orange-700" },
};

const FILTERS: { id: string; label: string; statuses: OrderStatus[] | null }[] =
  [
    { id: "all", label: "All orders", statuses: null },
    { id: "processing", label: "Processing", statuses: ["paid", "processing"] },
    { id: "shipped", label: "Shipped", statuses: ["shipped"] },
    { id: "delivered", label: "Delivered", statuses: ["completed"] },
  ];

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
  const [activeFilter, setActiveFilter] = useState("all");
  const listContainerRef = useRef<HTMLDivElement>(null);

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
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load orders");
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const activeStatuses = FILTERS.find((f) => f.id === activeFilter)?.statuses;
  const visibleOrders = activeStatuses
    ? orders.filter((order) => activeStatuses.includes(order.status))
    : orders;

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
      <div className="flex min-h-[400px] flex-col gap-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-[20px] bg-white" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-neutral-stroke flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-[24px] border bg-white p-12 text-center">
        <div className="bg-destructive/10 rounded-full p-3">
          <Package className="text-destructive size-8" />
        </div>
        <p className="text-subtle text-destructive">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="rounded-full"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <div className="border-neutral-stroke flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-[24px] border bg-white p-12 text-center">
        <div className="rounded-full bg-slate-50 p-4">
          <Package className="size-12 text-slate-300" />
        </div>
        <h3 className="text-primary-navy text-p-ui font-semibold">
          No orders yet
        </h3>
        <p className="text-subtle text-muted-foreground">
          Looks like you haven&apos;t placed any orders yet.
        </p>
        <Button
          onClick={() => (window.location.href = "/")}
          className="text-subtle-semibold mt-2 h-[46px] rounded-full px-7"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Status filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex h-10 items-center justify-center rounded-full px-5",
                isActive
                  ? "bg-primary-navy text-subtle-semibold text-white"
                  : "border-neutral-stroke text-subtle-medium border bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div ref={listContainerRef}>
        <motion.div
          className="flex flex-col gap-6"
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
                className="border-neutral-stroke text-subtle rounded-[14px] border bg-white/80 p-3 text-slate-600 backdrop-blur"
              >
                Loading…
              </motion.div>
            )}
          </AnimatePresence>

          {visibleOrders.length === 0 && (
            <div className="border-neutral-stroke text-subtle text-muted-foreground rounded-[20px] border bg-white px-8 py-10 text-center">
              No orders with this status on the current page.
            </div>
          )}

          {visibleOrders.map((order) => {
            // Determine active status display logic (including Pickup vs Shipping)
            const isPickup = order.delivery_method === "pickup";
            let displayStatus = statusPill[order.status].label;
            if (isPickup) {
              if (order.status === "shipped")
                displayStatus = "Ready for Pickup";
              if (order.status === "completed") displayStatus = "Picked Up";
            }

            return (
              <motion.div
                key={order.order_number}
                variants={itemVariants}
                className="border-neutral-stroke flex flex-col gap-5 rounded-[20px] border bg-white px-6 py-[26px] sm:px-8"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-primary-navy text-p font-semibold">
                        {order.order_number}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.order_number);
                          toast.success("Order number copied to clipboard");
                        }}
                        className="hover:text-primary-navy text-muted-foreground transition-colors"
                        title="Copy order number"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                    <span className="text-subtle text-muted-foreground">
                      Placed{" "}
                      {new Date(order.date_created).toLocaleDateString("en-AU")}{" "}
                      · {isPickup ? "Pickup" : "Delivery"}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-detail rounded-full px-3.5 py-[5px] font-semibold",
                      statusPill[order.status].className
                    )}
                  >
                    {displayStatus}
                  </span>
                </div>

                <div className="bg-neutral-stroke h-px w-full" />

                {/* Items */}
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => {
                    const imageUrl =
                      normalizeImageUrl(item.image_url, {
                        maxWidth: 200,
                      }) || FALLBACK_IMAGE;

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="border-neutral-stroke relative size-16 shrink-0 overflow-hidden rounded-[14px] border bg-white">
                          <Image
                            src={imageUrl}
                            alt={item.product_title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                          <p className="text-primary-navy text-p truncate font-medium">
                            {item.product_title}
                          </p>
                          {item.variant_attributes &&
                            Array.isArray(item.variant_attributes) &&
                            item.variant_attributes.length > 0 && (
                              <p className="text-subtle text-muted-foreground truncate">
                                {item.variant_attributes
                                  .map(
                                    (attr) =>
                                      `${attr.option_name}: ${attr.option_value}`
                                  )
                                  .join(" · ")}
                              </p>
                            )}
                        </div>
                        <span className="text-subtle text-muted-foreground">
                          × {item.quantity}
                        </span>
                        <span className="text-primary-navy text-p font-semibold">
                          {formatCents(item.line_total_cents)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-subtle text-muted-foreground py-4 text-center">
                    No items found for this order.
                  </p>
                )}

                {/* Footer */}
                <div className="bg-neutral-background-light flex items-center justify-between gap-3 rounded-[14px] py-2.5 pr-3 pl-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-subtle text-slate-600">Total</span>
                    <span className="text-primary-navy text-p-ui font-semibold">
                      {formatCents(order.grand_total_amt)}
                    </span>
                  </div>
                  <Button
                    onClick={() => onOrderClick(order.order_number)}
                    className="text-subtle-semibold h-[42px] rounded-full px-6"
                  >
                    Order details →
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination */}
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
            listContainerRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />
      </div>
    </div>
  );
}

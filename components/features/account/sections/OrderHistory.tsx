"use client";

import { Button } from "@/components/ui/button";
import { mockOrders } from "@/lib/mock/account";
import { OrderStatus } from "@/lib/types/account";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import Image from "next/image";

const statusColors: Record<OrderStatus, string> = {
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

interface OrderHistoryProps {
  onOrderClick: (orderId: string) => void;
}

export function OrderHistory({ onOrderClick }: OrderHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Order History
        </h2>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b bg-gray-50 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <span className="font-medium text-gray-900">{order.id}</span>
                <span className="text-sm text-gray-500">{order.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    statusColors[order.status]
                  )}
                >
                  {order.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={() => onOrderClick(order.id)}
                >
                  View Details
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-col gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 overflow-hidden rounded-md border bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="size-4" />
                  {order.trackingNumber ? (
                    <span>Tracking: {order.trackingNumber}</span>
                  ) : (
                    <span>Tracking not available</span>
                  )}
                </div>
                <p className="text-primary-navy text-lg font-bold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

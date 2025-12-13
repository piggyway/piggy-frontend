"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types/account";
import { cn } from "@/lib/utils";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { OrderStatus } from "@/lib/types/account";

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
}

const statusColors: Record<OrderStatus, string> = {
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const handleRefund = () => {
    toast.success("Refund request initiated successfully.");
  };

  const handleConfirmReceipt = () => {
    toast.success("Reception confirmed. Thank you!");
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h2 className="text-primary-navy text-2xl font-bold">
            Order Details
          </h2>
          <p className="text-sm text-gray-500">ID: {order.id}</p>
        </div>
        <div className="ml-auto">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              statusColors[order.status]
            )}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          {/* Order Items */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
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
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-gray-900">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {order.status === "Delivered" && (
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
        <div className="space-y-6">
          {/* Date */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                <Package className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">{order.date}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address (Static for now as not in Order type, using Mock) */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-purple-50 p-2 text-purple-600">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Shipping Address
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  Jane Doe
                </p>
                <p className="text-sm text-gray-600">
                  123 Piggy Lane
                  <br />
                  Guinea Town, CA 90210
                  <br />
                  USA
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method (Static for now) */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-orange-50 p-2 text-orange-600">
                <CreditCard className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Payment Method
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  Visa ending in 4242
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

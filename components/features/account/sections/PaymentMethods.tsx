"use client";

import { Button } from "@/components/ui/button";
import { mockPaymentMethods } from "@/lib/mock/account";
import { CreditCard, Plus, Trash2 } from "lucide-react";

export function PaymentMethods() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-primary-navy text-large">
          Payment Methods
        </h2>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add New Method
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockPaymentMethods.map((method) => (
          <div
            key={method.id}
            className="relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {method.isDefault && (
              <span className="bg-primary-purple/20 text-primary-navy text-detail absolute top-4 right-4 rounded-full px-2 py-1 font-medium">
                Default
              </span>
            )}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-md bg-gray-100">
                <CreditCard className="size-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{method.type}</h3>
                {method.last4 && (
                  <p className="text-p text-gray-500">
                    •••• •••• •••• {method.last4}
                  </p>
                )}
                {method.expiryDate && (
                  <p className="text-p text-gray-400">
                    Expires {method.expiryDate}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="size-3" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

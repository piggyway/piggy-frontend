"use client";

import { Button } from "@/components/ui/button";
import { mockAddresses } from "@/lib/mock/account";
import { Edit2, MapPin, Plus, Trash2 } from "lucide-react";

export function AddressBook() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary-navy">Address Book</h2>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockAddresses.map((address) => (
          <div key={address.id} className="relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            {address.isDefault && (
              <span className="absolute right-4 top-4 rounded-full bg-primary-purple/20 px-2 py-1 text-xs font-medium text-primary-navy">
                Default
              </span>
            )}
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-gray-100 p-2">
                <MapPin className="size-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{address.label}</h3>
                <p className="text-sm text-gray-500">{address.firstName} {address.lastName}</p>
              </div>
            </div>
            <div className="mb-6 space-y-1 text-sm text-gray-600">
              <p>{address.street}</p>
              {address.apartment && <p>{address.apartment}</p>}
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Edit2 className="size-3" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                <Trash2 className="size-3" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


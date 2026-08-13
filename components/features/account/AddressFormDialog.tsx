"use client";

import { useState } from "react";
import type { Address, AddressType } from "@/lib/types/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type AddressFormValues = {
  type: AddressType;
  isDefault: boolean;
  recipientName: string | null;
  addressText: string;
  postalCode: string;
  countryCode: string;
  phoneAu: string | null;
};

export type UpsertAddressInput = AddressFormValues & { id?: string };

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
  onSave: (payload: UpsertAddressInput) => void;
}

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
  onSave,
}: AddressFormDialogProps) {
  const [formData, setFormData] = useState<AddressFormValues>({
    type: "shipping",
    isDefault: false,
    recipientName: null,
    addressText: "",
    postalCode: "",
    countryCode: "AU",
    phoneAu: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset the form whenever the dialog is (re)opened for a different address.
  // State is adjusted during render (instead of in an effect) per React guidance.
  const [prevKey, setPrevKey] = useState<string | null>(null);
  const currentKey = open ? `${address?.id ?? "new"}` : null;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    if (currentKey !== null) {
      if (address) {
        setFormData({
          type: address.type,
          isDefault: address.isDefault,
          recipientName: address.recipientName,
          addressText: address.addressText,
          postalCode: address.postalCode,
          countryCode: address.countryCode,
          phoneAu: address.phoneAu,
        });
      } else {
        setFormData({
          type: "shipping",
          isDefault: false,
          recipientName: null,
          addressText: "",
          postalCode: "",
          countryCode: "AU",
          phoneAu: null,
        });
      }
      setErrors({});
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.addressText.trim())
      newErrors.addressText = "Address is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";
    if (!/^[A-Za-z]{2}$/.test(formData.countryCode.trim()))
      newErrors.countryCode = "Country code must be 2 letters (e.g., AU)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave(address ? { id: address.id, ...formData } : formData);

    onOpenChange(false);
  };

  const handleChange = (
    field: keyof AddressFormValues,
    value: string | boolean | null
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData({ ...formData, [field]: value } as any);
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {address ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Type */}
          <div className="space-y-2">
            <label className="text-p font-medium text-gray-700">
              Address Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                handleChange("type", e.target.value as AddressType)
              }
              className="text-p w-full rounded-md border border-gray-200 bg-white px-3 py-2"
            >
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Recipient Name */}
          <div className="space-y-2">
            <label className="text-p font-medium text-gray-700">
              Recipient Name
            </label>
            <Input
              value={formData.recipientName ?? ""}
              onChange={(e) =>
                handleChange("recipientName", e.target.value || null)
              }
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-p font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.addressText}
              onChange={(e) => handleChange("addressText", e.target.value)}
              placeholder="Street, suburb, state"
              className={errors.addressText ? "border-red-500" : ""}
            />
            {errors.addressText && (
              <p className="text-subtle text-red-500">{errors.addressText}</p>
            )}
          </div>

          {/* Postal / CountryCode */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-p font-medium text-gray-700">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-subtle text-red-500">{errors.postalCode}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-p font-medium text-gray-700">
                Country Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.countryCode}
                onChange={(e) =>
                  handleChange("countryCode", e.target.value.toUpperCase())
                }
                placeholder="AU"
                className={errors.countryCode ? "border-red-500" : ""}
              />
              {errors.countryCode && (
                <p className="text-subtle text-red-500">{errors.countryCode}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-p font-medium text-gray-700">
              Phone (AU)
            </label>
            <Input
              value={formData.phoneAu ?? ""}
              onChange={(e) => handleChange("phoneAu", e.target.value || null)}
              placeholder="+61400111222"
            />
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isDefault" className="text-p text-gray-700">
              Set as default address
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {address ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

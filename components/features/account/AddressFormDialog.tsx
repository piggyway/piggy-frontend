"use client";

import { useState, useEffect } from "react";
import { Address } from "@/lib/types/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address;
  onSave: (address: Omit<Address, "id"> | Address) => void;
}

export function AddressFormDialog({
  open,
  onOpenChange,
  address,
  onSave,
}: AddressFormDialogProps) {
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    label: "",
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        label: "",
        firstName: "",
        lastName: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        isDefault: false,
      });
    }
    setErrors({});
  }, [address, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) newErrors.label = "Address label is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (address) {
      onSave({ ...address, ...formData });
    } else {
      onSave(formData);
    }

    onOpenChange(false);
  };

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
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
          {/* Address Label */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Address Label <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="e.g., Home, Work"
              className={errors.label ? "border-red-500" : ""}
            />
            {errors.label && (
              <p className="text-xs text-red-500">{errors.label}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.street}
              onChange={(e) => handleChange("street", e.target.value)}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <p className="text-xs text-red-500">{errors.street}</p>
            )}
          </div>

          {/* Apartment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Apartment, Suite, etc. (Optional)
            </label>
            <Input
              value={formData.apartment || ""}
              onChange={(e) => handleChange("apartment", e.target.value)}
            />
          </div>

          {/* City, State, Zip */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && (
                <p className="text-xs text-red-500">{errors.zipCode}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <Input
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
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
            <label htmlFor="isDefault" className="text-sm text-gray-700">
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

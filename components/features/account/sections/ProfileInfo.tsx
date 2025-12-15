"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { profileValidators } from "@/lib/validators/profile";
import { onboardingStorage } from "@/lib/utils/onboarding";
import { useUser } from "@/contexts/UserContext";
import { Address } from "@/lib/types/account";
import { addressStorage } from "@/lib/utils/addressStorage";
import { mockAddresses } from "@/lib/mock/account";
import { AddressFormDialog } from "../AddressFormDialog";
import { Edit2, MapPin, Plus, Trash2 } from "lucide-react";

interface ProfileInfoProps {
  autoEdit?: boolean;
  onComplete?: () => void;
}

export function ProfileInfo({ autoEdit = false, onComplete }: ProfileInfoProps) {
  const { user: contextUser, updateUser } = useUser();
  const router = useRouter();
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(autoEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Address management state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Initialize user data from UserContext
  useEffect(() => {
    if (contextUser) {
      setUser({
        firstName: contextUser.firstName || "",
        lastName: contextUser.lastName || "",
        email: contextUser.email || "",
        phone: contextUser.phone || "",
      });
    }
  }, [contextUser]);

  // Auto-enter edit mode (first login) and focus on first input
  useEffect(() => {
    if (autoEdit) {
      setIsEditing(true);
      // Wait for DOM update before focusing
      setTimeout(() => {
        firstNameInputRef.current?.focus();
      }, 100);
    }
  }, [autoEdit]);

  // Initialize addresses from localStorage or mock data
  useEffect(() => {
    const stored = addressStorage.getAll();
    if (stored.length > 0) {
      setAddresses(stored);
    } else {
      // First load, use mock data
      setAddresses(mockAddresses);
      addressStorage.save(mockAddresses);
    }
  }, []);

  const validateField = (field: string, value: string): string => {
    if (profileValidators[field as keyof typeof profileValidators]) {
      return profileValidators[field as keyof typeof profileValidators](value);
    }
    return "";
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    newErrors.firstName = validateField("firstName", user.firstName);
    newErrors.lastName = validateField("lastName", user.lastName);

    // Only validate email and phone if not in autoEdit mode (first-time login)
    if (!autoEdit) {
      newErrors.email = validateField("email", user.email);
      newErrors.phone = validateField("phone", user.phone);
    }

    // Filter out empty errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAll()) {
      return;
    }

    setIsSaving(true);

    try {
      // Use UserContext to update user data (handles backend API, localStorage, and session)
      await updateUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });

      // Mark onboarding as completed
      onboardingStorage.setProfileCompleted();

      setIsEditing(false);

      // Notify parent component of completion
      if (onComplete) {
        onComplete();
      }

      // If first login (autoEdit mode), redirect to homepage after save
      if (autoEdit) {
        // Redirect to homepage
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors({ general: "Failed to save profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
    // Real-time validation
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  // Address management handlers
  const handleAddNewAddress = () => {
    setEditingAddress(undefined);
    setDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSaveAddress = (addressData: Omit<Address, "id"> | Address) => {
    if ("id" in addressData) {
      // Update existing address
      addressStorage.update(addressData.id, addressData);
    } else {
      // Add new address
      addressStorage.add(addressData);
    }

    // Refresh list
    setAddresses(addressStorage.getAll());
  };

  const handleDeleteAddress = (id: string) => {
    if (deleteConfirm === id) {
      addressStorage.delete(id);
      setAddresses(addressStorage.getAll());
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-primary-navy text-2xl font-semibold">
          Profile Information
        </h2>
        {!autoEdit && (
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Edit Profile"}
          </Button>
        )}
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            ref={firstNameInputRef}
            disabled={!isEditing}
            value={user.firstName}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            disabled={!isEditing}
            value={user.lastName}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>

        {/* Email - only show if not first-time login */}
        {!autoEdit && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              disabled={!isEditing}
              value={user.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              type="email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        )}

        {/* Phone Number - only show if not first-time login */}
        {!autoEdit && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              disabled={!isEditing}
              value={user.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        )}
      </div>

      {/* Save Button for autoEdit mode */}
      {autoEdit && isEditing && (
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      )}

      {/* Addresses Section - only show if not first-time login */}
      {!autoEdit && (
        <div className="space-y-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Saved Addresses
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleAddNewAddress}
            >
              <Plus className="size-4" />
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <MapPin className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <h4 className="mb-1 text-base font-medium text-gray-900">
                No addresses yet
              </h4>
              <p className="mb-3 text-sm text-gray-500">
                Add your first address to get started
              </p>
              <Button size="sm" onClick={handleAddNewAddress}>
                <Plus className="mr-2 size-4" />
                Add Address
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="relative rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  {address.isDefault && (
                    <span className="bg-primary-purple/20 text-primary-navy absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium">
                      Default
                    </span>
                  )}
                  <div className="mb-3 flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-gray-100 p-2">
                      <MapPin className="size-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{address.label}</h4>
                      <p className="text-sm text-gray-500">
                        {address.firstName} {address.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 space-y-0.5 text-sm text-gray-600">
                    <p>{address.street}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit2 className="size-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 gap-2 ${
                        deleteConfirm === address.id
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      }`}
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="size-3" />
                      {deleteConfirm === address.id ? "Confirm?" : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Address Form Dialog */}
          <AddressFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            address={editingAddress}
            onSave={handleSaveAddress}
          />
        </div>
      )}
    </div>
  );
}

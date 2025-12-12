"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { profileValidators } from "@/lib/validators/profile";
import { onboardingStorage } from "@/lib/utils/onboarding";
import { useUser } from "@/contexts/UserContext";

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
      // Use UserContext to update user data (handles both localStorage and session)
      await updateUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });

      // Mark onboarding as completed
      onboardingStorage.setProfileCompleted();

      // TODO: Replace with API call when backend is ready
      // await updateUserProfile(user);

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
    </div>
  );
}

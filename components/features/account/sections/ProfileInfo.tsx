"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { profileValidators } from "@/lib/validators/profile";
import { onboardingStorage } from "@/lib/utils/onboarding";
import { useUser } from "@/contexts/UserContext";
import { AddressBook } from "./AddressBook";

interface ProfileInfoProps {
  autoEdit?: boolean;
  onComplete?: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
};

export function ProfileInfo({
  autoEdit = false,
  onComplete,
}: ProfileInfoProps) {
  const { user: contextUser, updateUser } = useUser();
  const router = useRouter();
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
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
      // Use UserContext to update user data (handles backend API, localStorage, and session).
      // Email is the login identity and the backend has no phone field on
      // users, so only the name fields are persisted.
      await updateUser({
        firstName: user.firstName,
        lastName: user.lastName,
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

  const visibleFields = ["firstName", "lastName"] as const;

  return (
    <div className="flex flex-col gap-6">
      {/* Profile information */}
      <div className="border-neutral-stroke flex flex-col gap-6 rounded-[24px] border bg-white px-6 py-8 sm:px-10 sm:py-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-primary-navy text-lead">Profile information</h2>
          {!autoEdit && (
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving}
              className={
                isEditing
                  ? "text-subtle-semibold h-[42px] rounded-full px-6"
                  : "border-primary-navy text-subtle-semibold text-primary-navy h-[42px] rounded-full border-[1.5px] px-6"
              }
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Edit profile"}
            </Button>
          )}
        </div>

        {errors.general && (
          <div className="text-subtle bg-destructive/10 text-destructive rounded-[12px] p-3">
            {errors.general}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {visibleFields.map((field) => (
            <div key={field} className="flex flex-col gap-2">
              <label className="text-subtle-medium text-primary-navy">
                {FIELD_LABELS[field]}
                <span className="text-destructive"> *</span>
              </label>
              <Input
                ref={field === "firstName" ? firstNameInputRef : undefined}
                disabled={!isEditing}
                type="text"
                value={user[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className={`text-p h-12 rounded-[12px] bg-white px-4 text-slate-600 disabled:opacity-100 ${
                  errors[field] ? "border-destructive" : ""
                }`}
              />
              {errors[field] && (
                <p className="text-subtle text-destructive">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Save Button for autoEdit mode */}
        {autoEdit && isEditing && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="text-subtle-semibold h-[42px] rounded-full px-6"
            >
              {isSaving ? "Saving..." : "Save profile"}
            </Button>
          </div>
        )}
      </div>

      {/* Address book - only show if not first-time login */}
      {!autoEdit && <AddressBook />}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

interface UserButtonProps {
  size?: "desktop" | "mobile";
}

export function UserButton({ size = "desktop" }: UserButtonProps) {
  const { user, isLoading, isAuthenticated } = useUser();
  const [imageError, setImageError] = useState(false);

  // Size configuration
  const sizeConfig = {
    desktop: { container: "h-12 w-12", text: "text-lg", icon: "h-5 w-5" },
    mobile: { container: "h-10 w-10", text: "text-base", icon: "h-4 w-4" },
  };
  const config = sizeConfig[size];

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          config.container,
          "animate-pulse rounded-full bg-gray-300"
        )}
        aria-label="Loading user account"
      />
    );
  }

  // Authenticated state
  if (isAuthenticated && user) {
    const href = "/account";
    const ariaLabel =
      `User account - ${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    // Get first initial
    const getInitial = () => {
      if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
      if (user?.lastName) return user.lastName.charAt(0).toUpperCase();
      return null;
    };

    const initial = getInitial();

    // Has avatar and not failed to load
    if (user?.avatarUrl && !imageError) {
      return (
        <Link
          href={href}
          className={cn(
            config.container,
            "bg-primary-navy hover:bg-primary-navy-light relative overflow-hidden rounded-full transition-colors"
          )}
          aria-label={ariaLabel}
        >
          <Image
            src={user.avatarUrl}
            alt={user?.firstName || "User"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </Link>
      );
    }

    // Display first initial
    if (initial) {
      return (
        <Link
          href={href}
          className={cn(
            config.container,
            config.text,
            "bg-primary-navy hover:bg-primary-navy-light flex items-center justify-center rounded-full font-semibold text-white transition-colors"
          )}
          aria-label={ariaLabel}
        >
          {initial}
        </Link>
      );
    }

    // Fallback to default User icon (logged in but no name)
    return (
      <Link
        href={href}
        className={cn(
          config.container,
          "bg-primary-navy hover:bg-primary-navy-light flex items-center justify-center rounded-full text-white transition-colors"
        )}
        aria-label={ariaLabel || "User account"}
      >
        <User className={config.icon} />
      </Link>
    );
  }

  // Not logged in state
  return (
    <Link
      href="/login"
      className={cn(
        config.container,
        "bg-primary-navy hover:bg-primary-navy-light flex items-center justify-center rounded-full text-white transition-colors"
      )}
      aria-label="User account login"
    >
      <User className={config.icon} />
    </Link>
  );
}

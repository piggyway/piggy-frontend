"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

/**
 * Component that redirects first-time users to /account page
 * Only redirects once per session to avoid redirect loops
 */
export function FirstLoginRedirect() {
  const { isAuthenticated, isFirstLogin, isLoading } = useUser();
  const router = useRouter();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only check once per session
    if (hasCheckedRef.current || isLoading) return;

    // Check if user is authenticated and is first login
    if (isAuthenticated && isFirstLogin) {
      // Mark as checked before redirecting
      hasCheckedRef.current = true;

      // Redirect to account page for first-time users
      router.push("/account");
    } else if (isAuthenticated) {
      // User has completed profile, mark as checked
      hasCheckedRef.current = true;
    }
  }, [isAuthenticated, isFirstLogin, isLoading, router]);

  // This component doesn't render anything
  return null;
}

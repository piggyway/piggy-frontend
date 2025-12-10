"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Component that redirects first-time users to /account page
 * Only redirects once per session to avoid redirect loops
 */
export function FirstLoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only check once per session
    if (hasCheckedRef.current || status === "loading") return;

    // Check if user is authenticated
    if (status === "authenticated" && session?.user) {
      // Check session first
      let isFirstLogin = !session.user.firstName || !session.user.lastName;

      // If session doesn't have data, check localStorage as fallback
      if (isFirstLogin && typeof window !== "undefined") {
        try {
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            // If localStorage has firstName and lastName, user has completed profile
            if (profile.firstName && profile.lastName) {
              isFirstLogin = false;
            }
          }
        } catch (error) {
          console.log("Error reading profile from localStorage:", error);
        }
      }

      if (isFirstLogin) {
        // Mark as checked before redirecting
        hasCheckedRef.current = true;

        // Redirect to account page for first-time users
        router.push("/account");
      } else {
        // User has completed profile, mark as checked
        hasCheckedRef.current = true;
      }
    }
  }, [status, session, router]);

  // This component doesn't render anything
  return null;
}

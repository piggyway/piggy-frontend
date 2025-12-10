"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function WelcomeMessage() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    // Only check user data when authenticated
    if (status === "authenticated") {
      // Prioritize getting from session
      let firstName = session?.user?.firstName;
      let lastName = session?.user?.lastName || "";

      // If session doesn't have it, try reading from localStorage
      if (!firstName && typeof window !== "undefined") {
        try {
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            firstName = profile.firstName;
            lastName = profile.lastName || "";
          }
        } catch (error) {
          console.log("Error reading profile from localStorage:", error);
        }
      }

      // If there's a user name, show welcome message
      if (firstName) {
        setUserName({ firstName, lastName });
        setTimeout(() => setShow(true), 100);
      } else {
        setUserName(null);
        setShow(false);
      }
    } else {
      // If not logged in or loading state, clear data
      setUserName(null);
      setShow(false);
    }
  }, [status, session?.user?.firstName, session?.user?.lastName]);

  // Only render when authenticated and has user name, otherwise take no space
  if (status !== "authenticated" || !userName || !show) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="relative z-10 mb-8 mt-8 rounded-2xl border border-primary-navy/10 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
        <h2 className="text-primary-navy text-2xl font-semibold md:text-3xl">
          Hello, {userName.firstName} {userName.lastName}! 👋
        </h2>
        <p className="mt-2 text-gray-600">
          Welcome back to PiggyWay. Discover the best for your furry friends.
        </p>
      </div>
    </div>
  );
}

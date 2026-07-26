"use client";

import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

export function WelcomeMessage() {
  const { user, isAuthenticated } = useUser();
  const canShow = Boolean(isAuthenticated && user?.firstName);
  const [revealed, setRevealed] = useState(false);

  if (!canShow && revealed) {
    setRevealed(false);
  }

  useEffect(() => {
    if (!canShow) return;
    const id = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(id);
  }, [canShow]);

  // Only render when authenticated and has user name, otherwise take no space
  if (!canShow || !revealed || !user?.firstName) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="border-primary-navy/10 relative z-10 mt-8 mb-8 rounded-2xl border bg-white/80 p-6 shadow-lg backdrop-blur-sm">
        <h2 className="text-primary-navy text-2xl font-semibold md:text-3xl">
          Hello, {user.firstName} {user.lastName}! 👋
        </h2>
        <p className="mt-2 text-gray-600">
          Welcome back to PiggyWay. Discover the best for your furry friends.
        </p>
      </div>
    </div>
  );
}

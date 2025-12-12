"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  updateUser: (data: Partial<UserProfile>) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Sync user data from session and localStorage
  useEffect(() => {
    if (status === "authenticated") {
      let userData: UserProfile | null = null;

      // Priority 1: Get from session
      if (session?.user) {
        userData = {
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          email: session.user.email,
          phone: session.user.phone,
          avatarUrl: session.user.avatarUrl,
        };
      }

      // Priority 2: Fallback to localStorage if session doesn't have firstName
      if (!userData?.firstName && typeof window !== "undefined") {
        try {
          const storedProfile = localStorage.getItem("userProfile");
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            userData = {
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              phone: profile.phone,
              avatarUrl: profile.avatarUrl,
            };
          }
        } catch (error) {
          console.log("Error reading profile from localStorage:", error);
        }
      }

      setUser(userData);

      // Check if first login
      const isIncomplete = !userData?.firstName || !userData?.lastName;
      setIsFirstLogin(isIncomplete);
    } else {
      setUser(null);
      setIsFirstLogin(false);
    }
  }, [status, session]);

  // Update user data (save to both localStorage and session)
  const updateUser = async (data: Partial<UserProfile>) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify({
        ...updatedUser,
        savedAt: new Date().toISOString(),
      }));
    }

    // Update session
    try {
      await update({
        user: {
          ...session?.user,
          ...data,
        },
      });
    } catch (error) {
      console.log("Session update info:", error);
    }

    // Update isFirstLogin status
    const isIncomplete = !updatedUser.firstName || !updatedUser.lastName;
    setIsFirstLogin(isIncomplete);
  };

  // Clear user data (for logout)
  const clearUser = () => {
    setUser(null);
    setIsFirstLogin(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("pendingProfileUpdate");
      localStorage.removeItem("onboardingStatus");
      localStorage.removeItem("userAddresses");
    }
  };

  const value: UserContextType = {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isFirstLogin,
    updateUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

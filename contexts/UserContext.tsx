"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { UserService } from "@/lib/services/user";
import { fetchWithAuth } from "@/lib/api/client";

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
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const hasEnsuredCartRef = useRef(false);

  // Always sync accessToken to localStorage as soon as it's available
  useEffect(() => {
    if (status !== "authenticated") return;
    if (typeof window === "undefined") return;

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    const authToken = accessToken.startsWith("Bearer")
      ? accessToken
      : `Bearer ${accessToken}`;
    localStorage.setItem("access_token", authToken);
  }, [status, (session as any)?.accessToken]);

  // Ensure a default (empty) cart exists after login (for both new and returning users).
  // This is a fire-and-forget call: backend can create the cart lazily if missing.
  useEffect(() => {
    if (status !== "authenticated") {
      hasEnsuredCartRef.current = false;
      return;
    }

    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;
    if (hasEnsuredCartRef.current) return;

    // Wait until user profile is loaded to avoid calling APIs with incomplete auth state
    if (!hasLoadedRef.current) return;

    hasEnsuredCartRef.current = true;

    // Trigger cart creation on backend if it doesn't exist yet
    fetchWithAuth("/api/cart", { method: "GET" }).catch((err) => {
      console.warn("[UserContext] Failed to ensure default cart:", err);
    });
  }, [status, (session as any)?.accessToken, user]);

  // Sync user data from session, backend API, and localStorage
  // Only run once when authenticated
  useEffect(() => {
    // Skip if already loaded or currently loading
    if (hasLoadedRef.current || isLoadingRef.current) {
      return;
    }

    if (status === "authenticated") {
      // Wait until accessToken is available; otherwise backend calls will 401 and we'll mark as loaded incorrectly
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        return;
      }

      isLoadingRef.current = true;

      // Fetch user profile from backend
      const loadUserProfile = async () => {
        try {
          // Try to get from backend first
          const backendProfile = await UserService.getProfile();
          
          if (backendProfile) {
            const userData: UserProfile = {
              firstName: backendProfile.firstName || undefined,
              lastName: backendProfile.lastName || undefined,
              email: backendProfile.email || undefined,
              phone: undefined,
              avatarUrl: undefined,
            };
            setUser(userData);

            // Check if first login
            const isIncomplete = !backendProfile.firstName || !backendProfile.lastName;
            setIsFirstLogin(isIncomplete);
            hasLoadedRef.current = true;
            isLoadingRef.current = false;
            return;
          }
        } catch (error) {
          console.log("Failed to load profile from backend, falling back to session/localStorage:", error);
        }

        // Fallback: Get from session
        let userData: UserProfile | null = null;
        if (session?.user) {
          userData = {
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            email: session.user.email,
            phone: session.user.phone,
            avatarUrl: session.user.avatarUrl,
          };
        }

        // Fallback: Get from localStorage if session doesn't have firstName
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
        const isIncomplete = !userData?.firstName || !userData?.lastName;
        setIsFirstLogin(isIncomplete);
        hasLoadedRef.current = true;
        isLoadingRef.current = false;
      };

      loadUserProfile();
    } else if (status === "unauthenticated") {
      setUser(null);
      setIsFirstLogin(false);
      hasLoadedRef.current = false;
      isLoadingRef.current = false;
    }
  }, [status, (session as any)?.accessToken]); // Depend on accessToken so first login can load after session is ready

  // Update user data (save to backend and localStorage only - no session update to avoid loops)
  const updateUser = async (data: Partial<UserProfile>) => {
    // Optimistically update local state
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    let finalUser = updatedUser;
    let backendSuccess = false;

    // Save to backend API
    try {
      const result = await UserService.updateProfile({
        firstName: data.firstName !== undefined ? data.firstName || null : undefined,
        lastName: data.lastName !== undefined ? data.lastName || null : undefined,
        displayName: (data as any).displayName !== undefined ? (data as any).displayName || null : undefined,
      });

      if (!result.success) {
        console.error("Failed to update profile on backend:", result.error);
        // Don't revert - keep the optimistic update for better UX
        // The data is still saved to localStorage below
      } else {
        backendSuccess = true;
        // Update local state with backend response if available
        if (result.user) {
          const backendUser: UserProfile = {
            firstName: result.user.firstName || undefined,
            lastName: result.user.lastName || undefined,
            email: result.user.email || undefined,
            phone: updatedUser?.phone,
            avatarUrl: updatedUser?.avatarUrl,
          };
          setUser(backendUser);
          finalUser = backendUser;
        }
      }
    } catch (error) {
      console.error("Error updating profile on backend:", error);
      // Continue anyway - save to localStorage and create cart
    }

    // Save to localStorage as backup (always, even if backend failed)
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify({
        ...finalUser,
        savedAt: new Date().toISOString(),
      }));
    }

    // Update isFirstLogin status based on what we have locally
    const isIncomplete = !finalUser.firstName || !finalUser.lastName;
    setIsFirstLogin(isIncomplete);

    // If backend failed, throw error so UI can show appropriate message
    if (!backendSuccess) {
      throw new Error("Failed to save profile to server");
    }
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token");
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

/**
 * User Service
 * Business logic layer for user profile operations
 */

import { apiClient } from "@/lib/api/client";

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface UpdateUserProfilePayload {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
  error?: string;
}

export class UserService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      const headers = this.getAuthHeaders();
      const response = await fetch("/api/users/me", {
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to get user profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[UserService] Failed to get user profile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    payload: UpdateUserProfilePayload
  ): Promise<UpdateUserProfileResponse> {
    try {
      const headers = this.getAuthHeaders();
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[UserService] Failed to update user profile:", error);
      return {
        success: false,
        error: "update_profile_failed",
        message: "Failed to update user profile",
      };
    }
  }

  /**
   * Resolve auth headers from browser storage or env for backend calls
   */
  private static getAuthHeaders(): HeadersInit {
    // Client-side: try to pull a token from storage
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      if (token) {
        return {
          Authorization: token.startsWith("Bearer") ? token : `Bearer ${token}`,
        };
      }
    }

    // Server-side fallback (useful for local testing)
    if (process.env.NEXT_PUBLIC_API_AUTH_TOKEN) {
      return {
        Authorization: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
      };
    }

    return {};
  }
}

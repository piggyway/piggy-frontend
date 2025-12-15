/**
 * User Service
 * Business logic layer for user profile operations
 */

import { fetchWithAuth } from "@/lib/api/client";

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
      const response = await fetchWithAuth("/api/users/me", { method: "GET" });

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
      const response = await fetchWithAuth("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
}




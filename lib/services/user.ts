/**
 * User Service
 * Business logic layer for user profile operations
 */

import { fetchWithAuth } from "@/lib/api/client";
import type { Address, AddressType } from "@/lib/types/account";

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

export interface CreateAddressPayload {
  type: AddressType;
  isDefault?: boolean;
  recipientName?: string | null;
  addressText: string;
  postalCode: string;
  countryCode?: string;
  phoneAu?: string | null;
}

export interface UpdateAddressPayload {
  type?: AddressType;
  isDefault?: boolean;
  recipientName?: string | null;
  addressText?: string;
  postalCode?: string;
  countryCode?: string;
  phoneAu?: string | null;
}

export class UserService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await fetchWithAuth("/api/users/me", {
        method: "GET",
        redirectOnAuthError: false,
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

  /**
   * List current user's saved addresses
   */
  static async getAddresses(): Promise<Address[] | null> {
    try {
      const response = await fetchWithAuth("/api/users/me/addresses", {
        method: "GET",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to list addresses");
      }

      return (data?.data as Address[]) ?? [];
    } catch (error) {
      console.error("[UserService] Failed to list addresses:", error);
      return null;
    }
  }

  /**
   * Create a new address
   */
  static async createAddress(
    payload: CreateAddressPayload
  ): Promise<Address | null> {
    try {
      const response = await fetchWithAuth("/api/users/me/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create address");
      }

      return (data?.data as Address) ?? null;
    } catch (error) {
      console.error("[UserService] Failed to create address:", error);
      return null;
    }
  }

  /**
   * Update an address
   */
  static async updateAddress(
    addressId: string,
    payload: UpdateAddressPayload & { id?: string }
  ): Promise<Address | null> {
    try {
      // Avoid accidentally sending `id` in the payload
      const body: UpdateAddressPayload & { id?: string } = {
        ...(payload ?? {}),
      };
      delete body.id;
      const response = await fetchWithAuth(
        `/api/users/me/addresses/${addressId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update address");
      }

      return (data?.data as Address) ?? null;
    } catch (error) {
      console.error("[UserService] Failed to update address:", error);
      return null;
    }
  }

  /**
   * Delete an address
   */
  static async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const response = await fetchWithAuth(
        `/api/users/me/addresses/${addressId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete address");
      }

      return true;
    } catch (error) {
      console.error("[UserService] Failed to delete address:", error);
      return false;
    }
  }

  /**
   * Set an address as default (for its type)
   */
  static async setDefaultAddress(addressId: string): Promise<Address | null> {
    try {
      const response = await fetchWithAuth(
        `/api/users/me/addresses/${addressId}/default`,
        { method: "PATCH" }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to set default address");
      }

      return (data?.data as Address) ?? null;
    } catch (error) {
      console.error("[UserService] Failed to set default address:", error);
      return null;
    }
  }
}

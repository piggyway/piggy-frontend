import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchWithAuth } from "@/lib/api/client";
import type {
  PickupLocation,
  PickupSlot,
  PickupLocationsResponse,
  PickupSlotsResponse,
} from "@/lib/types/pickup";
import { reportError } from "@/lib/monitoring/report";

export class PickupService {
  /**
   * Fetch active pickup locations
   */
  static async getLocations(): Promise<PickupLocation[]> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PICKUP_LOCATIONS, {
        method: "GET",
      });

      const data: PickupLocationsResponse = await response.json();

      if (!data.success || !data.data) {
        const errorMsg =
          typeof data.error === "object"
            ? JSON.stringify(data.error)
            : data.error || data.message || "Failed to fetch pickup locations";
        throw new Error(errorMsg);
      }

      return data.data;
    } catch (error) {
      console.error("[PickupService] Failed to fetch locations:", error);
      reportError(error, { scope: "PickupService.getLocations" });
      return [];
    }
  }

  /**
   * Fetch pickup slots by location and date
   * @param locationId
   * @param date YYYY-MM-DD
   */
  static async getSlotsByDate(
    locationId: number,
    date: string
  ): Promise<PickupSlot[]> {
    try {
      console.log(
        `[PickupService] Fetching slots for location ${locationId} on ${date}`
      );

      const response = await fetchWithAuth(API_ENDPOINTS.PICKUP_SLOTS_BY_DATE, {
        method: "GET",
        params: {
          location_id: locationId,
          date,
        },
      });

      const data: PickupSlotsResponse = await response.json();

      if (!data.success || !data.data) {
        const errorMsg =
          typeof data.error === "object"
            ? JSON.stringify(data.error, null, 2)
            : data.error || data.message || "Failed to fetch pickup slots";
        console.error("[PickupService] API Error Response:", data);
        reportError(data, { scope: "PickupService.getSlots.response" });
        throw new Error(errorMsg);
      }

      return data.data;
    } catch (error) {
      console.error("[PickupService] Failed to fetch slots:", error);
      reportError(error, { scope: "PickupService.getSlots" });
      // Re-throw to let the component handle empty state if needed,
      // or just return empty array but log the error
      return [];
    }
  }

  /**
   * Fetch available dates for a location
   * @param locationId
   */
  static async getAvailableDates(locationId: number): Promise<string[]> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.PICKUP_AVAILABLE_DATES,
        {
          method: "GET",
          params: {
            location_id: locationId,
          },
        }
      );

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Failed to fetch available dates");
      }

      return data.data;
    } catch (error) {
      console.error("[PickupService] Failed to fetch available dates:", error);
      reportError(error, { scope: "PickupService.getAvailableDates" });
      return [];
    }
  }
}

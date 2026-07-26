export interface PickupLocation {
  id: number;
  name: string;
  address: string;
  instructions?: string | null;
  timezone: string;
  inventory: number;
}

export interface PickupSlot {
  id: number;
  locationId: number;
  slotDate: string;
  startAt: string;
  endAt: string;
}

export type PickupApiError = string | Record<string, unknown>;

export interface PickupLocationsResponse {
  success: boolean;
  data: PickupLocation[];
  error?: PickupApiError;
  message?: string;
}

export interface PickupSlotsResponse {
  success: boolean;
  data: PickupSlot[];
  error?: PickupApiError;
  message?: string;
}

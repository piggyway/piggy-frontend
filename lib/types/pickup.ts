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

export interface PickupLocationsResponse {
  success: boolean;
  data: PickupLocation[];
  error?: any;
  message?: string;
}

export interface PickupSlotsResponse {
  success: boolean;
  data: PickupSlot[];
  error?: any;
  message?: string;
}

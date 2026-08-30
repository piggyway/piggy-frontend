/**
 * Boarding Domain Types
 * camelCase shapes consumed by components. The backend speaks snake_case;
 * `lib/services/boarding.ts` owns the mapping between the two.
 */

// Must stay in sync with the Directus `boarding_bookings.status` dropdown choices (allowOther: false).
export type BoardingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed";

export type BoardingPetType = "Guinea pig" | "Rabbit" | "Other";

export type BoardingPetSex = "Female" | "Male" | "Unknown";

export type BoardingPetDesexed = "Yes" | "No" | "Not sure";

export interface BoardingBookingPet {
  id: number;
  name: string;
  type: BoardingPetType;
  breed: string | null;
  age: string | null;
  sex: BoardingPetSex | null;
  weight: string | null;
  desexed: BoardingPetDesexed | null;
  vetContact: string | null;
  feedingRoutine: string | null;
  medicalNotes: string | null;
}

export interface BoardingBooking {
  id: number;
  uuid: string;
  reference: string;
  userId: string | null;
  status: BoardingStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dropOffDate: string;
  dropOffTime: string;
  pickUpDate: string;
  pickUpTime: string;
  nights: number;
  emergencyName: string | null;
  emergencyPhone: string | null;
  emergencyNotes: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
  pets: BoardingBookingPet[];
}

export interface CreateBoardingPetInput {
  name: string;
  type: BoardingPetType;
  breed?: string | null;
  age?: string | null;
  sex?: BoardingPetSex | null;
  weight?: string | null;
  desexed?: BoardingPetDesexed | null;
  vetContact?: string | null;
  feedingRoutine?: string | null;
  medicalNotes?: string | null;
}

export interface CreateBoardingBookingInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dropOffDate: string;
  dropOffTime: string;
  pickUpDate: string;
  pickUpTime: string;
  pets: CreateBoardingPetInput[];
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyNotes?: string | null;
}

export interface CreateBoardingBookingResult {
  booking: BoardingBooking;
  notificationSent: boolean;
  userNotificationSent: boolean;
}

/** Sanitized guest lookup result - no phone, emergency, medical, or internal ids. */
export interface BoardingLookupResult {
  reference: string;
  status: BoardingStatus;
  firstName: string;
  dropOffDate: string;
  dropOffTime: string;
  pickUpDate: string;
  pickUpTime: string;
  nights: number;
  pets: Array<{ name: string; type: string }>;
}

export interface BoardingBookingListMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface BoardingBookingList {
  bookings: BoardingBooking[];
  meta: BoardingBookingListMeta;
}

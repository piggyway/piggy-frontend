import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchWithAuth } from "@/lib/api/client";
import type {
  BoardingBooking,
  BoardingBookingList,
  BoardingBookingListMeta,
  BoardingBookingPet,
  BoardingPetDesexed,
  BoardingPetSex,
  BoardingPetType,
  BoardingStatus,
  CreateBoardingBookingInput,
  CreateBoardingBookingResult,
  CreateBoardingPetInput,
} from "@/lib/types/boarding";

/**
 * Error carrying the HTTP status of a failed boarding request, so callers can
 * tell a validation failure (400) from rate limiting (429) or auth (401/404).
 */
export class BoardingApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BoardingApiError";
    this.status = status;
  }
}

interface BoardingPetResponse {
  id: number;
  name: string;
  type: BoardingPetType;
  breed: string | null;
  age: string | null;
  sex: BoardingPetSex | null;
  weight: string | null;
  desexed: BoardingPetDesexed | null;
  vet_contact: string | null;
  feeding_routine: string | null;
  medical_notes: string | null;
}

interface BoardingBookingResponse {
  id: number;
  uuid: string;
  reference: string;
  user_id: string | null;
  status: BoardingStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  drop_off_date: string;
  drop_off_time: string;
  pick_up_date: string;
  pick_up_time: string;
  nights: number;
  emergency_name: string | null;
  emergency_phone: string | null;
  emergency_notes: string | null;
  date_created: string | null;
  date_updated: string | null;
  pets: BoardingPetResponse[];
}

interface BoardingErrorResponse {
  success?: false;
  error?: string;
  message?: string;
}

/**
 * Normalise a Postgres timestamp such as "2026-07-27 09:50:14.296+00" into
 * ISO-8601. The raw format parses in V8 but is not standard, so Safari can
 * return an Invalid Date from it.
 */
function toIsoTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;

  const withSeparator = value.replace(" ", "T");
  const hasZone = /(Z|[+-]\d{2}(:?\d{2})?)$/.test(withSeparator);
  const withZone = hasZone
    ? withSeparator.replace(/([+-]\d{2})$/, "$1:00")
    : `${withSeparator}Z`;

  const parsed = new Date(withZone);
  if (Number.isNaN(parsed.getTime())) {
    console.error("[BoardingService] Unparsable timestamp:", value);
    return null;
  }

  return parsed.toISOString();
}

function transformPet(pet: BoardingPetResponse): BoardingBookingPet {
  return {
    id: pet.id,
    name: pet.name,
    type: pet.type,
    breed: pet.breed,
    age: pet.age,
    sex: pet.sex,
    weight: pet.weight,
    desexed: pet.desexed,
    vetContact: pet.vet_contact,
    feedingRoutine: pet.feeding_routine,
    medicalNotes: pet.medical_notes,
  };
}

function transformBooking(booking: BoardingBookingResponse): BoardingBooking {
  return {
    id: booking.id,
    uuid: booking.uuid,
    reference: booking.reference,
    userId: booking.user_id,
    status: booking.status,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    dropOffDate: booking.drop_off_date,
    dropOffTime: booking.drop_off_time,
    pickUpDate: booking.pick_up_date,
    pickUpTime: booking.pick_up_time,
    nights: booking.nights,
    emergencyName: booking.emergency_name,
    emergencyPhone: booking.emergency_phone,
    emergencyNotes: booking.emergency_notes,
    dateCreated: toIsoTimestamp(booking.date_created),
    dateUpdated: toIsoTimestamp(booking.date_updated),
    pets: (booking.pets ?? []).map(transformPet),
  };
}

function toPetPayload(pet: CreateBoardingPetInput) {
  return {
    name: pet.name,
    type: pet.type,
    breed: pet.breed ?? null,
    age: pet.age ?? null,
    sex: pet.sex ?? null,
    weight: pet.weight ?? null,
    desexed: pet.desexed ?? null,
    vet_contact: pet.vetContact ?? null,
    feeding_routine: pet.feedingRoutine ?? null,
    medical_notes: pet.medicalNotes ?? null,
  };
}

function toBookingPayload(input: CreateBoardingBookingInput) {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone,
    drop_off_date: input.dropOffDate,
    drop_off_time: input.dropOffTime,
    pick_up_date: input.pickUpDate,
    pick_up_time: input.pickUpTime,
    emergency_name: input.emergencyName ?? null,
    emergency_phone: input.emergencyPhone ?? null,
    emergency_notes: input.emergencyNotes ?? null,
    pets: input.pets.map(toPetPayload),
  };
}

async function readError(
  response: Response,
  fallback: string
): Promise<BoardingApiError> {
  let message = fallback;

  try {
    const body: BoardingErrorResponse = await response.json();
    message = body.error || body.message || fallback;
  } catch {
    // Non-JSON body (gateway error page); keep the fallback message
  }

  return new BoardingApiError(message, response.status);
}

/**
 * Create a boarding booking. Auth is optional: guests may submit, and a signed
 * in user is attached server side from the bearer token.
 */
export async function createBoardingBooking(
  input: CreateBoardingBookingInput
): Promise<CreateBoardingBookingResult> {
  const response = await fetchWithAuth(API_ENDPOINTS.BOARDING, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toBookingPayload(input)),
    redirectOnAuthError: false,
  });

  if (!response.ok) {
    const error = await readError(response, "Failed to create booking");
    console.error("[BoardingService] Failed to create booking:", error);
    throw error;
  }

  const data: {
    data: BoardingBookingResponse;
    notification_sent: boolean;
    user_notification_sent: boolean;
  } = await response.json();

  return {
    booking: transformBooking(data.data),
    notificationSent: data.notification_sent,
    // Default true when the field is missing so an older backend deploy does
    // not flash the "could not send receipt" warning for every booking.
    userNotificationSent: data.user_notification_sent ?? true,
  };
}

/**
 * List the signed in user's boarding bookings, newest first.
 */
export async function getBoardingBookings(
  limit = 10,
  offset = 0
): Promise<BoardingBookingList> {
  const response = await fetchWithAuth(API_ENDPOINTS.BOARDING, {
    method: "GET",
    params: { limit, offset },
  });

  if (!response.ok) {
    const error = await readError(response, "Failed to get bookings");
    console.error("[BoardingService] Failed to get bookings:", error);
    throw error;
  }

  const data: {
    data: BoardingBookingResponse[];
    meta: BoardingBookingListMeta;
  } = await response.json();

  return {
    bookings: data.data.map(transformBooking),
    meta: data.meta,
  };
}

/**
 * Fetch a single boarding booking by its reference. The backend returns 404 for
 * references that belong to another user or to a guest.
 */
export async function getBoardingBookingByReference(
  reference: string
): Promise<BoardingBooking> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.BOARDING_BY_REFERENCE(reference),
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const error = await readError(response, "Failed to get booking detail");
    console.error("[BoardingService] Failed to get booking detail:", error);
    throw error;
  }

  const data: { data: BoardingBookingResponse } = await response.json();

  return transformBooking(data.data);
}

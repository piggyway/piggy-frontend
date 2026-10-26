// Saves the in-progress boarding booking in localStorage so a visitor who
// leaves the page can come back and continue where they stopped.

import type { BoardingHousingArrangement } from "@/lib/types/boarding";
import type { PetForm } from "./BookingDetailsStep";

const STORAGE_KEY = "boardingBookingDraft";

export interface BookingDatesDraft {
  step: "dates" | "details";
  startDate: string | null;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
}

export interface BookingDetailsDraft {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pets: PetForm[];
  housing: BoardingHousingArrangement | null;
  housingNotes: string;
  emergency: {
    name: string;
    phone: string;
    notes: string;
  };
}

export interface BookingDraft {
  dates?: BookingDatesDraft;
  details?: BookingDetailsDraft;
}

function write(draft: BookingDraft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export const bookingDraftStorage = {
  load: (): BookingDraft => {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data) as BookingDraft;
    } catch {
      // A corrupt draft cannot be recovered; drop it so the form starts fresh.
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  },

  saveDates: (dates: BookingDatesDraft) => {
    write({ ...bookingDraftStorage.load(), dates });
  },

  saveDetails: (details: BookingDetailsDraft) => {
    write({ ...bookingDraftStorage.load(), details });
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

/**
 * Drops saved dates that are no longer bookable (drop-off in the past, or
 * pick-up not after drop-off) and returns to the dates step when the saved
 * stay is no longer complete.
 */
export function restoreDates(
  dates: BookingDatesDraft | undefined,
  today: string
): BookingDatesDraft {
  let startDate = dates?.startDate ?? null;
  let startTime = dates?.startTime ?? null;
  let endDate = dates?.endDate ?? null;
  let endTime = dates?.endTime ?? null;

  if (startDate && startDate < today) {
    startDate = null;
    startTime = null;
    endDate = null;
    endTime = null;
  }
  if (endDate && (!startDate || endDate <= startDate)) {
    endDate = null;
    endTime = null;
  }

  const step =
    dates?.step === "details" && startTime && endDate && endTime
      ? "details"
      : "dates";

  return { step, startDate, startTime, endDate, endTime };
}

import type {
  BoardingHousingArrangement,
  CreateBoardingBookingInput,
} from "@/lib/types/boarding";

type HousingInput = Pick<
  CreateBoardingBookingInput,
  "housingArrangement" | "housingNotes"
>;

/**
 * Booking housing fields from the form answer. One pet sends nulls; notes are
 * only sent with "specified". Throws on an answer that validation should have
 * blocked.
 */
export function toHousingInput(
  petCount: number,
  arrangement: BoardingHousingArrangement | null,
  notes: string
): HousingInput {
  if (petCount < 2) return { housingArrangement: null, housingNotes: null };
  if (!arrangement) {
    throw new Error("Housing arrangement is required for 2 or more pets");
  }
  if (arrangement !== "specified") {
    return { housingArrangement: arrangement, housingNotes: null };
  }
  const trimmed = notes.trim();
  if (!trimmed) {
    throw new Error(
      "Housing notes are required when the arrangement is specified"
    );
  }
  return { housingArrangement: arrangement, housingNotes: trimmed };
}

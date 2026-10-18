import { BOARDING_RATES_CONTENT } from "@/components/features/boarding/constants";
import type { BoardingPetType } from "@/lib/types/boarding";

const MAX_ESTIMATE_NIGHTS = 14;

export type StayQuoteReason = "other-species" | "large-group" | "long-stay";

export type StayEstimate =
  | {
      status: "estimate";
      nights: number;
      nightlyRate: number;
      rateLabel: string;
      total: number;
    }
  | { status: "quote"; reason: StayQuoteReason };

export function estimateStay(
  nights: number,
  petTypes: readonly BoardingPetType[]
): StayEstimate | null {
  if (nights < 1 || petTypes.length === 0) return null;
  if (petTypes.some((type) => type !== "Guinea pig")) {
    return { status: "quote", reason: "other-species" };
  }
  const rate = BOARDING_RATES_CONTENT.rates.find(
    (entry) => entry.pets === petTypes.length
  );
  if (!rate) return { status: "quote", reason: "large-group" };
  if (nights > MAX_ESTIMATE_NIGHTS) {
    return { status: "quote", reason: "long-stay" };
  }
  return {
    status: "estimate",
    nights,
    nightlyRate: rate.amount,
    rateLabel: rate.label,
    total: nights * rate.amount,
  };
}

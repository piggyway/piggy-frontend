import type { BoardingStatus } from "@/lib/types/boarding";

// Keys must stay in sync with the Directus `boarding_bookings.status` dropdown choices.
export const BOARDING_STATUS_PILL: Record<
  BoardingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-primary-gold/20 text-primary-navy",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-secondary-mint text-green-600",
  },
  declined: {
    label: "Declined",
    className: "bg-neutral-pink-background text-rose-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-neutral-grey-background text-slate-600",
  },
  completed: {
    label: "Completed",
    className: "bg-secondary-blue/40 text-primary-navy",
  },
};

export const UNKNOWN_BOARDING_STATUS_PILL = {
  label: "Unknown",
  className: "border-neutral-stroke border bg-white text-slate-600",
};

import { BOARDING_DEPOSIT_PERCENT } from "@/components/features/boarding/constants";
import { formatCents } from "@/lib/utils/format";
import type { StayEstimate, StayQuoteReason } from "./stay-estimate";

const QUOTE_REASON_LABELS: Record<StayQuoteReason, string> = {
  "other-species": "Pets other than guinea pigs are priced individually.",
  "large-group": "Larger groups are priced individually.",
  "long-stay": "Longer stays are priced individually.",
};

function formatDollars(amount: number): string {
  return formatCents(amount * 100);
}

function describeEstimate(
  estimate: StayEstimate,
  isFromPrice: boolean
): { amount: string; detail: string } {
  if (estimate.status === "quote") {
    return {
      amount: "We'll quote this stay",
      detail: QUOTE_REASON_LABELS[estimate.reason],
    };
  }
  if (isFromPrice) {
    return {
      amount: `From ${formatDollars(estimate.total)}`,
      detail: `Based on ${estimate.rateLabel}. The nightly rate depends on how many guinea pigs stay.`,
    };
  }
  const nightsLabel = `${estimate.nights} ${estimate.nights === 1 ? "night" : "nights"}`;
  return {
    amount: formatDollars(estimate.total),
    detail: `${nightsLabel} × ${formatDollars(estimate.nightlyRate)} (${estimate.rateLabel})`,
  };
}

interface StaySummaryCardProps {
  dropOff: string;
  pickUp: string;
  nights: string;
  pets: string;
  estimate: StayEstimate | null;
  isFromPrice: boolean;
  children: React.ReactNode;
}

export function StaySummaryCard({
  dropOff,
  pickUp,
  nights,
  pets,
  estimate,
  isFromPrice,
  children,
}: StaySummaryCardProps) {
  const estimateText = estimate && describeEstimate(estimate, isFromPrice);
  const rows = [
    { label: "Drop-off", value: dropOff },
    { label: "Pick-up", value: pickUp },
    { label: "Nights", value: nights },
    { label: "Pets", value: pets },
  ];

  return (
    <div className="border-neutral-stroke flex flex-col gap-[18px] rounded-[24px] border bg-white px-7 py-[26px]">
      <h2 className="text-primary-navy text-lead">Stay summary</h2>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-subtle text-slate-600">{row.label}</span>
          <span className="text-p text-primary-navy font-medium">
            {row.value}
          </span>
        </div>
      ))}

      <div className="bg-neutral-stroke h-px w-full" />

      {estimateText && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-subtle text-slate-600">Estimated total</span>
            <span className="text-p text-primary-navy text-right font-semibold">
              {estimateText.amount}
            </span>
          </div>
          <p className="text-subtle text-slate-600">{estimateText.detail}</p>
        </div>
      )}

      <div className="bg-secondary-mint flex flex-col gap-1 rounded-[12px] px-3.5 py-2.5">
        <p className="text-primary-navy text-subtle font-medium">
          Estimate only - we confirm the final price after reviewing your
          request. No payment today.
        </p>
        <p className="text-primary-navy text-subtle">
          Once confirmed, a {BOARDING_DEPOSIT_PERCENT.normal}% deposit secures
          your stay ({BOARDING_DEPOSIT_PERCENT.peak}% and non-refundable in Peak
          Season).
        </p>
      </div>

      {children}
    </div>
  );
}

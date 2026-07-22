import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Drop-off" },
  { number: 2, label: "Pick-up" },
  { number: 3, label: "Details" },
  { number: 4, label: "Confirm" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        return (
          <div key={step.number} className="flex items-center gap-3">
            {idx > 0 && (
              <div className="h-0.5 w-7 rounded-[1px] bg-slate-300" />
            )}
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-[18px] py-2",
                isActive
                  ? "bg-primary-navy"
                  : isCompleted
                    ? "border border-green-600 bg-white"
                    : "border-neutral-stroke border bg-white"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
                  isActive
                    ? "bg-primary-gold text-primary-navy"
                    : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-neutral-stroke text-slate-600"
                )}
              >
                {isCompleted ? <Check className="size-3" /> : step.number}
              </span>
              <span
                className={cn(
                  "text-[14px]",
                  isActive
                    ? "font-semibold text-white"
                    : isCompleted
                      ? "font-semibold text-green-600"
                      : "font-medium text-slate-600"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

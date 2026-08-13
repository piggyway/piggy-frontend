import { Fragment } from "react";
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
    <div className="flex w-full min-w-0 max-w-full items-center gap-1 sm:w-auto sm:gap-3">
      {STEPS.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        return (
          <Fragment key={step.number}>
            {idx > 0 && (
              <div className="h-0.5 min-w-2 flex-1 rounded-[1px] bg-slate-300 sm:w-7 sm:flex-none" />
            )}
            <div
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-2 py-2 sm:px-[18px]",
                isActive
                  ? "bg-primary-navy"
                  : isCompleted
                    ? "border border-green-600 bg-white"
                    : "border-neutral-stroke border bg-white"
              )}
            >
              <span
                className={cn(
                  "text-detail flex size-5 items-center justify-center rounded-full font-semibold",
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
                  "text-subtle hidden sm:inline",
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
          </Fragment>
        );
      })}
    </div>
  );
}

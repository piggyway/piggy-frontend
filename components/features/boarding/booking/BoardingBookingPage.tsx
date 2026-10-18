"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import { StayCalendarCard } from "./StayCalendarCard";
import { describeEstimate, StaySummaryCard } from "./StaySummaryCard";
import { StepIndicator } from "./StepIndicator";
import {
  BookingDetailsStep,
  type BookingSubmission,
} from "./BookingDetailsStep";
import { BookingSubmittedStep } from "./BookingSubmittedStep";
import { formatStayLabel, nightsBetween, todayKey } from "./stay-dates";
import { estimateStay } from "./stay-estimate";

type BookingStep = "dates" | "details" | "submitted";

export function BoardingBookingPage() {
  const [today] = useState(() => todayKey());
  const [step, setStep] = useState<BookingStep>("dates");
  const [submission, setSubmission] = useState<BookingSubmission | null>(null);
  // The details form stays mounted after the first visit so going back to
  // the dates step does not wipe what the user has typed.
  const [detailsMounted, setDetailsMounted] = useState(false);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const hasTrackedStart = useRef(false);

  useEffect(() => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackEvent("boarding_start");
  }, []);

  const handleSelectDate = (key: string) => {
    if (!startDate || endDate || key <= startDate) {
      setStartDate(key);
      setEndDate(null);
      return;
    }
    setEndDate(key);
  };

  const nights =
    startDate && endDate ? nightsBetween(startDate, endDate) : null;
  const nightsLabel =
    nights !== null ? `${nights} ${nights === 1 ? "night" : "nights"}` : "—";
  const fromEstimate =
    nights !== null ? estimateStay(nights, ["Guinea pig"]) : null;
  const dropOffLabel = startDate ? formatStayLabel(startDate, startTime) : "—";
  const pickUpLabel = endDate ? formatStayLabel(endDate, endTime) : "—";
  const estimateAmount = fromEstimate
    ? describeEstimate(fromEstimate, true).amount
    : null;
  const canContinue = Boolean(startDate && startTime && endDate && endTime);

  const goToStep = (next: BookingStep) => {
    if (next === "details") setDetailsMounted(true);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueToDetails = () => {
    trackEvent("boarding_step_1_done");
    goToStep("details");
  };

  const handleSubmitted = (result: BookingSubmission) => {
    setSubmission(result);
    setStep("submitted");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === "submitted" && submission) {
    return (
      <BookingSubmittedStep
        submission={submission}
        dropOff={dropOffLabel}
        pickUp={pickUpLabel}
        nights={nightsLabel}
      />
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-primary-navy text-large sm:text-h4 tracking-[-0.21px]">
              {step === "details" ? "Boarding Details" : "Book a Boarding Stay"}
            </h1>
            <p className="text-p text-slate-600">
              {step === "dates"
                ? "Choose your drop-off and pick-up dates, then a time for each."
                : "Tell us about you and your pets — takes about two minutes."}
            </p>
          </div>

          <StepIndicator currentStep={step === "dates" ? 1 : 2} />

          {/* Step 1 — Dates */}
          <div
            className={
              step === "dates"
                ? "flex flex-col gap-6 lg:flex-row lg:items-start"
                : "hidden"
            }
          >
            <div className="min-w-0 flex-1">
              <StayCalendarCard
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
                minDate={today}
                onSelectDate={handleSelectDate}
                onSelectStartTime={setStartTime}
                onSelectEndTime={setEndTime}
              />
            </div>

            <div className="w-full lg:sticky lg:top-6 lg:w-[320px] lg:shrink-0">
              <StaySummaryCard
                dropOff={dropOffLabel}
                pickUp={pickUpLabel}
                nights={nightsLabel}
                pets="Added next step"
                estimate={fromEstimate}
                isFromPrice
              >
                <Button
                  onClick={handleContinueToDetails}
                  disabled={!canContinue}
                  className="text-p hidden h-[50px] w-full rounded-full font-semibold lg:inline-flex"
                >
                  Continue to Details →
                </Button>
              </StaySummaryCard>
            </div>
          </div>

          {/* Step 2 — Details */}
          {detailsMounted && (
            <div className={step === "details" ? "" : "hidden"}>
              <BookingDetailsStep
                dropOffLabel={dropOffLabel}
                pickUpLabel={pickUpLabel}
                nightsLabel={nightsLabel}
                nights={nights}
                dropOffDate={startDate}
                dropOffTime={startTime}
                pickUpDate={endDate}
                pickUpTime={endTime}
                onBack={() => goToStep("dates")}
                onSubmitted={handleSubmitted}
              />
            </div>
          )}
        </div>
      </div>

      {step === "dates" && (
        <div className="border-neutral-stroke sticky bottom-0 z-40 flex items-center justify-between gap-4 border-t bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
          <div className="flex min-w-0 flex-col">
            <span className="text-subtle text-slate-600">
              {nights !== null ? nightsLabel : "Select your dates"}
            </span>
            {estimateAmount && (
              <span className="text-p text-primary-navy font-semibold">
                {estimateAmount}
              </span>
            )}
          </div>
          <Button
            onClick={handleContinueToDetails}
            disabled={!canContinue}
            className="text-p h-12 shrink-0 rounded-full px-6 font-semibold"
          >
            Continue →
          </Button>
        </div>
      )}
    </div>
  );
}

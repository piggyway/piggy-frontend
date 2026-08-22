"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StayCalendarCard } from "./StayCalendarCard";
import { StaySummaryCard } from "./StaySummaryCard";
import { StepIndicator } from "./StepIndicator";
import {
  BookingDetailsStep,
  type BookingSubmission,
} from "./BookingDetailsStep";
import { BookingSubmittedStep } from "./BookingSubmittedStep";
import {
  addDaysToKey,
  formatStayLabel,
  nightsBetween,
  todayKey,
} from "./stay-dates";

type BookingStep = "dropoff" | "pickup" | "details" | "submitted";

export function BoardingBookingPage() {
  const [today] = useState(() => todayKey());
  const [step, setStep] = useState<BookingStep>("dropoff");
  const [submission, setSubmission] = useState<BookingSubmission | null>(null);
  // The details form stays mounted after the first visit so going back to
  // the dates step does not wipe what the user has typed.
  const [detailsMounted, setDetailsMounted] = useState(false);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const handleSelectStart = (key: string) => {
    setStartDate(key);
    // Pick-up must be at least one night after drop-off.
    if (endDate && endDate <= key) setEndDate(null);
  };

  const nights =
    startDate && endDate ? nightsBetween(startDate, endDate) : null;
  const nightsLabel =
    nights !== null ? `${nights} ${nights === 1 ? "night" : "nights"}` : "—";
  const dropOffLabel = startDate ? formatStayLabel(startDate, startTime) : "—";
  const pickUpLabel = endDate ? formatStayLabel(endDate, endTime) : "—";
  const canContinueToPickup = Boolean(startDate && startTime);
  const canContinue = Boolean(startDate && startTime && endDate && endTime);

  const goToStep = (next: BookingStep) => {
    if (next === "details") setDetailsMounted(true);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-primary-navy text-large sm:text-h4 tracking-[-0.21px]">
            {step === "details" ? "Boarding Details" : "Book a Boarding Stay"}
          </h1>
          <p className="text-p text-slate-600">
            {step === "dropoff"
              ? "Choose the date and time you'll drop your pets off."
              : step === "pickup"
                ? "Choose the date and time you'll pick your pets up."
                : "Tell us about you and your pets — takes about two minutes."}
          </p>
        </div>

        <StepIndicator
          currentStep={step === "dropoff" ? 1 : step === "pickup" ? 2 : 3}
        />

        {/* Step 1 — Drop-off */}
        <div
          className={
            step === "dropoff"
              ? "flex flex-col gap-6 lg:flex-row lg:items-start"
              : "hidden"
          }
        >
          <div className="min-w-0 flex-1">
            <StayCalendarCard
              title="Start — Drop-off"
              timeLabel="Drop-off time"
              iconClassName="bg-secondary-mint"
              selectedDate={startDate}
              selectedTime={startTime}
              minDate={today}
              rangeStart={startDate}
              rangeEnd={endDate}
              onSelectDate={handleSelectStart}
              onSelectTime={setStartTime}
            />
          </div>

          <div className="w-full lg:sticky lg:top-6 lg:w-[320px] lg:shrink-0">
            <StaySummaryCard
              dropOff={dropOffLabel}
              pickUp={pickUpLabel}
              nights={nightsLabel}
              pets="Added next step"
            >
              <Button
                onClick={() => goToStep("pickup")}
                disabled={!canContinueToPickup}
                className="text-p h-[50px] w-full rounded-full font-semibold"
              >
                Continue to Pick-up →
              </Button>
            </StaySummaryCard>
          </div>
        </div>

        {/* Step 2 — Pick-up */}
        <div
          className={
            step === "pickup"
              ? "flex flex-col gap-6 lg:flex-row lg:items-start"
              : "hidden"
          }
        >
          <div className="min-w-0 flex-1">
            <StayCalendarCard
              title="End — Pick-up"
              timeLabel="Pick-up time"
              iconClassName="bg-primary-gold/20"
              selectedDate={endDate}
              selectedTime={endTime}
              minDate={startDate ? addDaysToKey(startDate, 1) : today}
              rangeStart={startDate}
              rangeEnd={endDate}
              onSelectDate={setEndDate}
              onSelectTime={setEndTime}
            />
          </div>

          <div className="w-full lg:sticky lg:top-6 lg:w-[320px] lg:shrink-0">
            <StaySummaryCard
              dropOff={dropOffLabel}
              pickUp={pickUpLabel}
              nights={nightsLabel}
              pets="Added next step"
            >
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => goToStep("details")}
                  disabled={!canContinue}
                  className="text-p h-[50px] w-full rounded-full font-semibold"
                >
                  Continue to Details →
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToStep("dropoff")}
                  className="border-neutral-stroke text-p h-[50px] w-full rounded-full font-medium"
                >
                  ← Back to Drop-off
                </Button>
              </div>
            </StaySummaryCard>
          </div>
        </div>

        {/* Step 3 — Details */}
        {detailsMounted && (
          <div className={step === "details" ? "" : "hidden"}>
            <BookingDetailsStep
              dropOffLabel={dropOffLabel}
              pickUpLabel={pickUpLabel}
              nightsLabel={nightsLabel}
              dropOffDate={startDate}
              dropOffTime={startTime}
              pickUpDate={endDate}
              pickUpTime={endTime}
              onBack={() => goToStep("pickup")}
              onSubmitted={handleSubmitted}
            />
          </div>
        )}
      </div>
    </div>
  );
}

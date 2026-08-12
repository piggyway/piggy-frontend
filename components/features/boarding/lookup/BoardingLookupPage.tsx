"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BoardingApiError,
  lookupBoardingBooking,
} from "@/lib/services/boarding";
import type { BoardingLookupResult } from "@/lib/types/boarding";
import {
  BOARDING_STATUS_PILL,
  UNKNOWN_BOARDING_STATUS_PILL,
} from "@/components/features/boarding/status-pill";
import { BOARDING_ROUTES } from "@/components/features/boarding/constants";

function formatBookingDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-AU");
}

function formatTimeOfDay(value: string): string {
  return value.slice(0, 5);
}

export function BoardingLookupPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BoardingLookupResult | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedReference = reference.trim();
    const trimmedEmail = email.trim();

    if (!trimmedReference || !trimmedEmail) {
      setError("Enter both your reference number and email.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const booking = await lookupBoardingBooking(
        trimmedReference,
        trimmedEmail
      );
      setResult(booking);
    } catch (err) {
      if (err instanceof BoardingApiError && err.status === 404) {
        setError(
          "Booking not found. Check your reference and email, then try again."
        );
      } else if (err instanceof BoardingApiError && err.status === 429) {
        setError("Too many attempts. Please wait a minute and try again.");
      } else {
        setError("We couldn't look up your booking. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pill = result
    ? (BOARDING_STATUS_PILL[result.status] ?? UNKNOWN_BOARDING_STATUS_PILL)
    : null;

  const petsLabel =
    result && result.pets.length > 0
      ? result.pets.map((pet) => `${pet.name} (${pet.type})`).join(", ")
      : null;

  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 pt-16 pb-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h1 className="text-primary-navy text-[36px] leading-tight font-semibold">
          Track your request
        </h1>
        <p className="text-p max-w-md text-slate-600">
          Enter the reference from your confirmation email and the email you
          used when booking.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-neutral-stroke flex w-full max-w-[480px] flex-col gap-5 rounded-[24px] border bg-white px-7 py-8"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="boarding-reference"
            className="text-subtle-medium text-primary-navy"
          >
            Reference
          </label>
          <Input
            id="boarding-reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="PB-XXXXXXXX-XXXX"
            autoComplete="off"
            className="h-12 rounded-[12px] px-4 text-[15px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="boarding-email"
            className="text-subtle-medium text-primary-navy"
          >
            Email
          </label>
          <Input
            id="boarding-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-12 rounded-[12px] px-4 text-[15px]"
          />
        </div>

        {error && (
          <p className="rounded-[12px] border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] font-medium text-rose-800">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-[50px] w-full rounded-full text-[15px] font-semibold"
        >
          {isLoading ? "Looking up…" : "Check status"}
        </Button>
      </form>

      {result && pill && (
        <div className="border-neutral-stroke flex w-full max-w-[480px] flex-col gap-[18px] rounded-[24px] border bg-white px-7 py-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-slate-400">Reference</span>
              <span className="text-primary-navy text-[18px] font-semibold tracking-wide">
                {result.reference}
              </span>
            </div>
            <span
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12px] font-semibold",
                pill.className
              )}
            >
              {pill.label}
            </span>
          </div>

          <div className="bg-neutral-stroke h-px w-full" />

          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Name</span>
            <span className="text-subtle-medium text-primary-navy">
              {result.firstName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Drop-off</span>
            <span className="text-subtle-medium text-primary-navy">
              {formatBookingDate(result.dropOffDate)} ·{" "}
              {formatTimeOfDay(result.dropOffTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Pick-up</span>
            <span className="text-subtle-medium text-primary-navy">
              {formatBookingDate(result.pickUpDate)} ·{" "}
              {formatTimeOfDay(result.pickUpTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Nights</span>
            <span className="text-subtle-medium text-primary-navy">
              {result.nights}
            </span>
          </div>
          {petsLabel && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-subtle shrink-0 text-slate-600">Pets</span>
              <span className="text-subtle-medium text-primary-navy text-right">
                {petsLabel}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3.5">
        <Button
          asChild
          variant="outline"
          className="border-primary-navy text-primary-navy h-[50px] rounded-full border-[1.5px] px-9 text-[15px] font-semibold"
        >
          <Link href={BOARDING_ROUTES.book}>Book a stay</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-neutral-stroke h-[50px] rounded-full px-9 text-[15px] font-medium"
        >
          <Link href="/piggyway-boarding">Back to Boarding</Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { formatBookingDate } from "@/lib/utils/format";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BoardingApiError,
  cancelBoardingBooking,
  lookupBoardingBooking,
} from "@/lib/services/boarding";
import type { BoardingLookupResult } from "@/lib/types/boarding";
import {
  BOARDING_STATUS_PILL,
  UNKNOWN_BOARDING_STATUS_PILL,
} from "@/components/features/boarding/status-pill";
import { BOARDING_ROUTES } from "@/components/features/boarding/constants";
import { CancelBookingDialog } from "@/components/features/boarding/CancelBookingDialog";

function formatTimeOfDay(value: string): string {
  return value.slice(0, 5);
}

export function BoardingLookupPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BoardingLookupResult | null>(null);
  // Credentials that produced the current result - cancel must not use the
  // live inputs, which the user may edit after a successful lookup.
  const [lookupCredentials, setLookupCredentials] = useState<{
    reference: string;
    email: string;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

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
    setCancelError(null);
    setResult(null);
    setLookupCredentials(null);

    try {
      const booking = await lookupBoardingBooking(
        trimmedReference,
        trimmedEmail
      );
      setResult(booking);
      setLookupCredentials({
        reference: trimmedReference,
        email: trimmedEmail,
      });
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

  const handleCancel = async () => {
    if (!result || !lookupCredentials) return;
    setIsCancelling(true);
    setCancelError(null);

    try {
      const cancelled = await cancelBoardingBooking(
        lookupCredentials.reference,
        lookupCredentials.email
      );
      setResult(cancelled.booking);
      setConfirmOpen(false);
      toast.success("Your boarding request has been cancelled.");
    } catch (err) {
      if (err instanceof BoardingApiError && err.status === 409) {
        setCancelError("This booking can no longer be cancelled online.");
        try {
          const refreshed = await lookupBoardingBooking(
            lookupCredentials.reference,
            lookupCredentials.email
          );
          setResult(refreshed);
        } catch {
          // Keep the 409 banner; leave the card as-is if refresh fails.
        }
      } else if (err instanceof BoardingApiError && err.status === 404) {
        setCancelError(
          "Booking not found. Check your reference and email, then try again."
        );
      } else if (err instanceof BoardingApiError && err.status === 429) {
        setCancelError(
          "Too many attempts. Please wait a minute and try again."
        );
      } else {
        setCancelError("We couldn't cancel this request. Please try again.");
      }
      setConfirmOpen(false);
    } finally {
      setIsCancelling(false);
    }
  };

  const pill = result
    ? (BOARDING_STATUS_PILL[result.status] ?? UNKNOWN_BOARDING_STATUS_PILL)
    : null;

  const petsLabel =
    result && result.pets.length > 0
      ? result.pets.map((pet) => `${pet.name} (${pet.type})`).join(", ")
      : null;

  const canCancel = result?.status === "pending";

  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 pt-16 pb-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h1 className="text-primary-navy text-large sm:text-h4 tracking-[-0.21px]">
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
            className="text-p h-12 rounded-[12px] px-4"
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
            className="text-p h-12 rounded-[12px] px-4"
          />
        </div>

        {error && (
          <p className="text-subtle bg-destructive/10 text-destructive border-destructive/30 rounded-[12px] border px-3.5 py-2.5 font-medium">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="text-p h-[50px] w-full rounded-full font-semibold"
        >
          {isLoading ? "Looking up…" : "Check status"}
        </Button>
      </form>

      {result && pill && (
        <div className="border-neutral-stroke flex w-full max-w-[480px] flex-col gap-[18px] rounded-[24px] border bg-white px-7 py-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-subtle text-muted-foreground">
                Reference
              </span>
              <span className="text-primary-navy text-p-ui font-semibold tracking-wide">
                {result.reference}
              </span>
            </div>
            <span
              className={cn(
                "text-detail rounded-full px-3.5 py-1.5 font-semibold",
                pill.className
              )}
            >
              {pill.label}
            </span>
          </div>

          <div className="bg-neutral-stroke h-px w-full" />

          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Name</span>
            <span className="text-p text-primary-navy font-medium">
              {result.firstName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Drop-off</span>
            <span className="text-p text-primary-navy font-medium">
              {formatBookingDate(result.dropOffDate)} ·{" "}
              {formatTimeOfDay(result.dropOffTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Pick-up</span>
            <span className="text-p text-primary-navy font-medium">
              {formatBookingDate(result.pickUpDate)} ·{" "}
              {formatTimeOfDay(result.pickUpTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">Nights</span>
            <span className="text-p text-primary-navy font-medium">
              {result.nights}
            </span>
          </div>
          {petsLabel && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-subtle shrink-0 text-slate-600">Pets</span>
              <span className="text-p text-primary-navy text-right font-medium">
                {petsLabel}
              </span>
            </div>
          )}

          {cancelError && (
            <p className="text-subtle bg-destructive/10 text-destructive border-destructive/30 rounded-[12px] border px-3.5 py-2.5 font-medium">
              {cancelError}
            </p>
          )}

          {canCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCancelError(null);
                setConfirmOpen(true);
              }}
              className="text-subtle text-destructive hover:bg-destructive/10 border-destructive/40 h-[46px] w-full rounded-full border-[1.5px] font-semibold"
            >
              Cancel request
            </Button>
          )}
        </div>
      )}

      <CancelBookingDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isCancelling) setConfirmOpen(open);
        }}
        reference={
          result?.reference ?? lookupCredentials?.reference ?? reference
        }
        isSubmitting={isCancelling}
        onConfirm={handleCancel}
      />

      <div className="flex flex-wrap items-center justify-center gap-3.5">
        <Button
          asChild
          variant="outline"
          className="border-primary-navy text-primary-navy text-p h-[50px] rounded-full border-[1.5px] px-9 font-semibold"
        >
          <Link href={BOARDING_ROUTES.book}>Book a stay</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-neutral-stroke text-p h-[50px] rounded-full px-9 font-medium"
        >
          <Link href="/piggyway-boarding">Back to Boarding</Link>
        </Button>
      </div>
    </div>
  );
}

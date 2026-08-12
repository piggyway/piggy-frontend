"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Home } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BoardingApiError,
  cancelBoardingBooking,
  getBoardingBookingByReference,
} from "@/lib/services/boarding";
import type { BoardingBooking } from "@/lib/types/boarding";
import {
  BOARDING_STATUS_PILL,
  UNKNOWN_BOARDING_STATUS_PILL,
} from "@/components/features/boarding/status-pill";
import { CancelBookingDialog } from "@/components/features/boarding/CancelBookingDialog";

interface BoardingDetailsProps {
  reference: string;
  onBack: () => void;
}

function formatBookingDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-AU");
}

function formatTime(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-[12px] text-slate-400 sm:min-w-[140px]">
        {label}
      </span>
      <span className="text-subtle-medium text-primary-navy sm:text-right">
        {value}
      </span>
    </div>
  );
}

export function BoardingDetails({ reference, onBack }: BoardingDetailsProps) {
  const [booking, setBooking] = useState<BoardingBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsNotFound(false);
        const detail = await getBoardingBookingByReference(reference);
        if (cancelled) return;
        setBooking(detail);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof BoardingApiError && e.status === 404) {
          setIsNotFound(true);
          setError(null);
        } else {
          setError(e instanceof Error ? e.message : "Failed to load booking");
        }
        setBooking(null);
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      toast.success("Reference copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the reference. Please copy it manually.");
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelBoardingBooking(booking.reference, booking.email);
      setBooking({ ...booking, status: "cancelled" });
      setConfirmOpen(false);
      toast.success("Your boarding request has been cancelled.");
    } catch (err) {
      if (err instanceof BoardingApiError && err.status === 409) {
        setCancelError("This booking can no longer be cancelled online.");
        try {
          const refreshed = await getBoardingBookingByReference(
            booking.reference
          );
          setBooking(refreshed);
        } catch {
          // Keep the 409 banner; leave the card as-is if refresh fails.
        }
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

  const backLink = (
    <button
      type="button"
      onClick={onBack}
      className="text-subtle-medium text-primary-navy-light hover:underline"
    >
      &larr; Back to boarding
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-start gap-6">
        {backLink}
        <div className="w-full animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded-full bg-white" />
          <div className="h-64 rounded-[20px] bg-white" />
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="flex min-h-[400px] flex-col items-start gap-6">
        {backLink}
        <div className="border-neutral-stroke flex w-full flex-col items-center gap-4 rounded-[20px] border bg-white p-12 text-center">
          <div className="bg-secondary-mint flex size-12 items-center justify-center rounded-full">
            <Home className="text-primary-navy size-5" />
          </div>
          <h3 className="text-primary-navy text-[16px] font-semibold">
            Booking not found
          </h3>
          <p className="text-subtle max-w-md text-slate-600">
            We couldn&apos;t find this boarding request on your account. It may
            belong to another login, or the reference may be wrong.
          </p>
          <Button onClick={onBack} variant="outline" className="rounded-full">
            Back to boarding
          </Button>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[400px] flex-col items-start gap-6">
        {backLink}
        <div className="border-neutral-stroke flex w-full flex-col items-center gap-4 rounded-[20px] border bg-white p-12 text-center">
          <p className="text-subtle text-red-500">
            {error || "Failed to load booking"}
          </p>
          <Button onClick={onBack} variant="outline" className="rounded-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const pill =
    BOARDING_STATUS_PILL[booking.status] ?? UNKNOWN_BOARDING_STATUS_PILL;
  const canCancel = booking.status === "pending";

  return (
    <div className="flex flex-col items-start gap-6">
      {backLink}

      <div className="flex w-full flex-wrap items-center justify-between gap-3.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-primary-navy text-[24px] font-semibold tracking-wide">
              {booking.reference}
            </h2>
            <button
              type="button"
              onClick={handleCopyReference}
              className="hover:text-primary-navy text-slate-400 transition-colors"
              title="Copy reference"
              aria-label="Copy reference"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
          <p className="text-subtle text-slate-600">Boarding request details</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3.5 py-[5px] text-[12px] font-semibold",
              pill.className
            )}
          >
            {pill.label}
          </span>
          {canCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCancelError(null);
                setConfirmOpen(true);
              }}
              className="h-9 rounded-full border-[1.5px] border-rose-300 px-4 text-[13px] font-semibold text-rose-700 hover:bg-rose-50"
            >
              Cancel request
            </Button>
          )}
        </div>
      </div>

      {cancelError && (
        <p className="w-full rounded-[12px] border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] font-medium text-rose-800">
          {cancelError}
        </p>
      )}

      <div className="border-neutral-stroke flex w-full flex-col gap-5 rounded-[20px] border bg-white px-6 py-[26px] sm:px-8">
        <h3 className="text-primary-navy text-[16px] font-semibold">Stay</h3>
        <div className="flex flex-col gap-3">
          <InfoRow
            label="Drop-off"
            value={`${formatBookingDate(booking.dropOffDate)} at ${formatTime(booking.dropOffTime)}`}
          />
          <InfoRow
            label="Pick-up"
            value={`${formatBookingDate(booking.pickUpDate)} at ${formatTime(booking.pickUpTime)}`}
          />
          <InfoRow
            label="Nights"
            value={`${booking.nights} ${booking.nights === 1 ? "night" : "nights"}`}
          />
        </div>
      </div>

      <div className="border-neutral-stroke flex w-full flex-col gap-5 rounded-[20px] border bg-white px-6 py-[26px] sm:px-8">
        <h3 className="text-primary-navy text-[16px] font-semibold">Contact</h3>
        <div className="flex flex-col gap-3">
          <InfoRow
            label="Name"
            value={`${booking.firstName} ${booking.lastName}`}
          />
          <InfoRow label="Email" value={booking.email} />
          <InfoRow label="Phone" value={booking.phone} />
        </div>
      </div>

      {(booking.emergencyName ||
        booking.emergencyPhone ||
        booking.emergencyNotes) && (
        <div className="border-neutral-stroke flex w-full flex-col gap-5 rounded-[20px] border bg-white px-6 py-[26px] sm:px-8">
          <h3 className="text-primary-navy text-[16px] font-semibold">
            Emergency contact
          </h3>
          <div className="flex flex-col gap-3">
            <InfoRow label="Name" value={booking.emergencyName} />
            <InfoRow label="Phone" value={booking.emergencyPhone} />
            <InfoRow label="Notes" value={booking.emergencyNotes} />
          </div>
        </div>
      )}

      <div className="border-neutral-stroke flex w-full flex-col gap-5 rounded-[20px] border bg-white px-6 py-[26px] sm:px-8">
        <h3 className="text-primary-navy text-[16px] font-semibold">
          Pets ({booking.pets.length})
        </h3>
        <div className="flex flex-col gap-4">
          {booking.pets.map((pet, index) => (
            <div
              key={pet.id}
              className="border-neutral-stroke rounded-[16px] border px-4 py-4"
            >
              <p className="text-primary-navy mb-3 text-[15px] font-semibold">
                {index + 1}. {pet.name}
              </p>
              <div className="flex flex-col gap-2.5">
                <InfoRow label="Type" value={pet.type} />
                <InfoRow label="Breed" value={pet.breed} />
                <InfoRow label="Age" value={pet.age} />
                <InfoRow label="Sex" value={pet.sex} />
                <InfoRow label="Weight" value={pet.weight} />
                <InfoRow label="Desexed" value={pet.desexed} />
                <InfoRow label="Vet contact" value={pet.vetContact} />
                <InfoRow label="Feeding routine" value={pet.feedingRoutine} />
                <InfoRow label="Medical notes" value={pet.medicalNotes} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CancelBookingDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isCancelling) setConfirmOpen(open);
        }}
        reference={booking.reference}
        isSubmitting={isCancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}

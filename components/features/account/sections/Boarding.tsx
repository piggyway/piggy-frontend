"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBoardingBookings } from "@/lib/services/boarding";
import type { BoardingBooking } from "@/lib/types/boarding";
import {
  BOARDING_STATUS_PILL,
  UNKNOWN_BOARDING_STATUS_PILL,
} from "@/components/features/boarding/status-pill";

function formatBookingDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-AU");
}

interface BoardingProps {
  onBookingClick?: (reference: string) => void;
}

export function Boarding({ onBookingClick }: BoardingProps) {
  const [bookings, setBookings] = useState<BoardingBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getBoardingBookings();
        if (cancelled) return;
        setBookings(result.bookings);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load bookings");
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary-navy text-lead">My boarding</h2>
          <p className="text-subtle text-slate-600">
            Your pets&apos; stays with us &mdash; past and upcoming.
          </p>
        </div>
        <Button
          asChild
          className="text-subtle-semibold h-[46px] gap-1.5 rounded-full px-[26px]"
        >
          <Link href="/piggyway-boarding/book">
            <Plus className="size-4" />
            New booking
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-[20px] bg-white" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="border-neutral-stroke flex flex-col items-center gap-3 rounded-[20px] border bg-white px-8 py-12 text-center">
          <div className="rounded-full bg-red-50 p-3">
            <Home className="size-5 text-red-500" />
          </div>
          <h3 className="text-primary-navy text-p font-semibold">
            Couldn&apos;t load your bookings
          </h3>
          <p className="text-subtle text-red-500">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2 rounded-full"
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && bookings.length === 0 && (
        <div className="border-neutral-stroke flex flex-col items-center gap-3 rounded-[20px] border bg-white px-8 py-12 text-center">
          <div className="bg-secondary-mint flex size-12 items-center justify-center rounded-full">
            <Home className="text-primary-navy size-5" />
          </div>
          <h3 className="text-primary-navy text-p font-semibold">
            No boarding bookings yet
          </h3>
          <p className="text-subtle text-slate-400">
            Book your pet&apos;s first stay with us and it will show up here.
          </p>
        </div>
      )}

      {!isLoading && !error && bookings.length > 0 && (
        <div className="flex flex-col gap-6">
          {bookings.map((booking) => {
            const pill =
              BOARDING_STATUS_PILL[booking.status] ??
              UNKNOWN_BOARDING_STATUS_PILL;
            const petNames = booking.pets.map((pet) => pet.name).join(", ");
            const interactive = typeof onBookingClick === "function";

            return (
              <div
                key={booking.uuid}
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                onClick={
                  interactive
                    ? () => onBookingClick(booking.reference)
                    : undefined
                }
                onKeyDown={
                  interactive
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onBookingClick(booking.reference);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "border-neutral-stroke flex flex-col gap-5 rounded-[20px] border bg-white px-6 py-[26px] sm:px-8",
                  interactive &&
                    "focus-visible:ring-primary-navy cursor-pointer transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3.5">
                  <span className="text-primary-navy text-p font-semibold">
                    {booking.reference}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-detail rounded-full px-3.5 py-[5px] font-semibold",
                        pill.className
                      )}
                    >
                      {pill.label}
                    </span>
                    {interactive && (
                      <ChevronRight
                        className="size-4 text-slate-400"
                        aria-hidden
                      />
                    )}
                  </div>
                </div>

                <div className="bg-neutral-stroke h-px w-full" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-primary-navy text-p font-medium">
                      {formatBookingDate(booking.dropOffDate)} &rarr;{" "}
                      {formatBookingDate(booking.pickUpDate)}
                    </span>
                    <span className="text-subtle text-slate-400">
                      {booking.nights}{" "}
                      {booking.nights === 1 ? "night" : "nights"}
                    </span>
                  </div>
                  <span className="text-subtle text-slate-600">
                    {booking.pets.length}{" "}
                    {booking.pets.length === 1 ? "pet" : "pets"}
                    {petNames && ` · ${petNames}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

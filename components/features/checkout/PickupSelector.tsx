"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PickupService } from "@/lib/services/pickup";
import type { PickupLocation, PickupSlot } from "@/lib/types/pickup";

interface PickupSelectorProps {
  onLocationChange: (locationId: number) => void;
  onSlotChange: (slotId: number) => void;
  selectedLocationId?: number;
  selectedSlotId?: number;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateLabel(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString("en-AU", { weekday: "short" });
  const month = date.toLocaleDateString("en-AU", { month: "short" });
  return `${weekday} ${d} ${month}`;
}

/**
 * Shows only the suburb / postcode / state portion of a full street address
 * (e.g. "Unit 4 14-16 Anderson St, Templestowe, 3106, VIC" ->
 * "Templestowe, 3106, VIC") so the exact warehouse address is not exposed
 * before an order is placed.
 */
function formatLocationArea(address: string): string {
  const parts = address.split(",").map((part) => part.trim());
  return parts.length > 3 ? parts.slice(-3).join(", ") : address;
}

function formatSlotTime(slot: PickupSlot, field: "startAt" | "endAt") {
  const date = new Date(`${slot.slotDate}T${slot[field]}`);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function PickupSelector({
  onLocationChange,
  onSlotChange,
  selectedLocationId,
  selectedSlotId,
}: PickupSelectorProps) {
  const [locations, setLocations] = React.useState<PickupLocation[]>([]);
  const [slots, setSlots] = React.useState<PickupSlot[]>([]);
  const [availableDates, setAvailableDates] = React.useState<string[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [viewMonth, setViewMonth] = React.useState<{
    year: number;
    month: number;
  }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [loadingLocations, setLoadingLocations] = React.useState(false);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [loadingDates, setLoadingDates] = React.useState(false);

  // Fetch locations on mount
  React.useEffect(() => {
    async function fetchLocations() {
      setLoadingLocations(true);
      try {
        const data = await PickupService.getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setLoadingLocations(false);
      }
    }
    fetchLocations();
  }, []);

  // Fetch available dates when location changes
  React.useEffect(() => {
    if (!selectedLocationId) {
      setAvailableDates([]);
      setSelectedDate("");
      return;
    }

    async function fetchDates() {
      setLoadingDates(true);
      try {
        const dates = await PickupService.getAvailableDates(
          selectedLocationId!
        );
        setAvailableDates(dates);
        // Jump the calendar to the first month that has availability
        if (dates.length > 0) {
          const [y, m] = dates[0].split("-").map(Number);
          setViewMonth({ year: y, month: m - 1 });
        }
      } catch (error) {
        console.error("Failed to fetch available dates", error);
      } finally {
        setLoadingDates(false);
      }
    }
    fetchDates();
  }, [selectedLocationId]);

  // Fetch slots when location or date changes
  React.useEffect(() => {
    if (!selectedLocationId || !selectedDate) {
      setSlots([]);
      return;
    }

    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const data = await PickupService.getSlotsByDate(
          selectedLocationId!,
          selectedDate
        );
        setSlots(data);
      } catch (error) {
        console.error("Failed to fetch slots", error);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedLocationId, selectedDate]);

  const handleLocationChange = (value: string) => {
    const id = parseInt(value, 10);
    onLocationChange(id);
    onSlotChange(0); // Reset slot when location changes
    setSelectedDate(""); // Reset date when location changes
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onSlotChange(0); // Reset slot when date changes
  };

  const changeMonth = (delta: number) => {
    setViewMonth(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);
  const availableSet = React.useMemo(
    () => new Set(availableDates),
    [availableDates]
  );

  // Calendar grid for the current view month (weeks start on Monday)
  const { year, month } = viewMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = (new Date(year, month, 1).getDay() + 6) % 7;
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, i) => {
    const dayOffset = i - leadingDays;
    const cellDate = new Date(year, month, dayOffset + 1);
    const inMonth = cellDate.getMonth() === month;
    const key = toDateKey(
      cellDate.getFullYear(),
      cellDate.getMonth(),
      cellDate.getDate()
    );
    return { key, day: cellDate.getDate(), inMonth };
  });

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const headSubtitle = selectedSlot
    ? `${formatDateLabel(selectedDate)} · ${formatSlotTime(selectedSlot, "startAt")}`
    : selectedDate
      ? formatDateLabel(selectedDate)
      : "Select a date";

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Pickup location */}
      <div className="flex flex-col gap-2">
        <label className="text-subtle-medium text-primary-navy">
          Pickup location
        </label>
        <Select
          value={selectedLocationId?.toString()}
          onValueChange={handleLocationChange}
          disabled={loadingLocations}
        >
          <SelectTrigger className="border-neutral-stroke h-12 rounded-[12px] pr-3.5 pl-4 text-[15px] text-slate-600">
            {/* flex! beats SelectTrigger's [&>span]:line-clamp-1, which would
                otherwise stack the icon above the text */}
            <span className="flex! min-w-0 items-center gap-2.5">
              <MapPin className="text-primary-navy size-4 shrink-0" />
              <SelectValue placeholder="Select a pickup location" />
            </span>
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name} &mdash; {formatLocationArea(location.address)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedLocation?.instructions && (
          <p className="text-[13px] text-slate-400">
            {selectedLocation.instructions}
          </p>
        )}
      </div>

      {selectedLocationId && (
        <div className="flex w-full flex-col gap-6">
          {/* Calendar + time slots */}
          <div className="border-neutral-stroke flex w-full flex-col gap-4 rounded-[24px] border bg-white px-7 py-6">
            <div className="flex items-center gap-3">
              <span className="bg-secondary-mint flex size-9 shrink-0 items-center justify-center rounded-full">
                <CalendarIcon className="text-primary-navy size-[17px]" />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-primary-navy text-[16px] font-semibold">
                  Pickup
                </span>
                <span className="text-[13px] text-slate-400">
                  {headSubtitle}
                </span>
              </div>
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="border-neutral-stroke flex size-7 items-center justify-center rounded-full border bg-white"
              >
                <ChevronLeft className="text-primary-navy size-3" />
              </button>
              <span className="text-primary-navy text-[15px] font-semibold">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="border-neutral-stroke flex size-7 items-center justify-center rounded-full border bg-white"
              >
                <ChevronRight className="text-primary-navy size-3" />
              </button>
            </div>

            {/* Day grid */}
            {loadingDates ? (
              <p className="text-[13px] text-slate-400">
                Loading available dates...
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {WEEKDAYS.map((wd) => (
                    <span
                      key={wd}
                      className="flex h-6 flex-1 items-center justify-center text-[11px] font-medium text-slate-400"
                    >
                      {wd}
                    </span>
                  ))}
                </div>
                {Array.from({ length: cells.length / 7 }, (_, week) => (
                  <div key={week} className="flex gap-1">
                    {cells
                      .slice(week * 7, week * 7 + 7)
                      .map(({ key, day, inMonth }) => {
                        const isAvailable = inMonth && availableSet.has(key);
                        const isSelected = selectedDate === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => handleDateSelect(key)}
                            className={cn(
                              "flex h-[38px] flex-1 items-center justify-center rounded-[10px] text-[13px]",
                              isSelected
                                ? "bg-primary-navy font-semibold text-white"
                                : isAvailable
                                  ? "text-primary-navy hover:bg-primary-purple-light"
                                  : "text-slate-300"
                            )}
                          >
                            {day}
                          </button>
                        );
                      })}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-neutral-stroke h-px w-full" />

            <div className="flex items-center justify-between">
              <span className="text-primary-navy text-[13px] font-medium">
                Pickup time slot
              </span>
              <span className="text-[11px] text-slate-400">1-hour blocks</span>
            </div>

            {!selectedDate ? (
              <p className="text-[13px] text-slate-400">
                Select a date to see available time slots.
              </p>
            ) : loadingSlots ? (
              <p className="text-[13px] text-slate-400">Loading slots...</p>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => onSlotChange(slot.id)}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-full text-[13px]",
                        isSelected
                          ? "bg-primary-navy font-semibold text-white"
                          : "border-neutral-stroke hover:border-primary-navy border bg-white text-slate-600"
                      )}
                    >
                      {formatSlotTime(slot, "startAt")}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-slate-400">
                No available slots for this date.
              </p>
            )}
          </div>

          {selectedSlot && (
            <div className="bg-secondary-mint flex w-full flex-col gap-1 rounded-[16px] px-5 py-4">
              <span className="text-[12px] text-slate-600">Your pickup</span>
              <span className="text-primary-navy text-[17px] font-semibold">
                {formatDateLabel(selectedDate)} ·{" "}
                {formatSlotTime(selectedSlot, "startAt")}–
                {formatSlotTime(selectedSlot, "endAt")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

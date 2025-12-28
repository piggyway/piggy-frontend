"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
        // Automatically select first available date if not already selected
        if (dates.length > 0 && !selectedDate) {
          // Optional: setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Failed to fetch available dates", error);
      } finally {
        setLoadingDates(false);
      }
    }
    fetchDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  return (
    <div className="space-y-6">
      {/* Location Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4" />
          Select Pickup Location
        </label>
        <Select
          value={selectedLocationId?.toString()}
          onValueChange={handleLocationChange}
          disabled={loadingLocations}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name} ({location.address})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedLocation && (
          <p className="ml-1 text-xs text-slate-500">
            {selectedLocation.address}
            {selectedLocation.instructions &&
              ` • ${selectedLocation.instructions}`}
          </p>
        )}
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <CalendarIcon className="h-4 w-4" />
          Select Date
        </label>
        {selectedLocationId ? (
          <div className="space-y-2">
            {loadingDates ? (
              <div className="text-sm text-slate-500">
                Loading available dates...
              </div>
            ) : availableDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableDates.map((date) => {
                  const dateObj = new Date(date);
                  const displayDate = dateObj.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => handleDateSelect(date)}
                      className={cn(
                        "h-auto px-4 py-2",
                        selectedDate === date
                          ? "bg-primary-navy hover:bg-primary-navy/90 text-white"
                          : "hover:bg-slate-50"
                      )}
                    >
                      {displayDate}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">
                No available dates found for this location.
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">
            Please select a location first.
          </div>
        )}
      </div>

      {/* Slot Selection */}
      {selectedDate && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Select Time Slot
          </label>
          {loadingSlots ? (
            <div className="text-sm text-slate-500">Loading slots...</div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map((slot) => {
                const startDate = new Date(`${slot.slotDate}T${slot.startAt}`);
                const endDate = new Date(`${slot.slotDate}T${slot.endAt}`);

                const startTime = startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endTime = endDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Button
                    key={slot.id}
                    variant={selectedSlotId === slot.id ? "default" : "outline"}
                    className={cn(
                      "flex h-auto flex-row items-center justify-center gap-1 py-3 text-sm",
                      selectedSlotId === slot.id
                        ? "bg-primary-navy hover:bg-primary-navy/90 text-white"
                        : "hover:bg-slate-50"
                    )}
                    onClick={() => onSlotChange(slot.id)}
                  >
                    <span>{startTime}</span>
                    <span>-</span>
                    <span>{endTime}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-center text-sm text-slate-500">
              No available slots for this date.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

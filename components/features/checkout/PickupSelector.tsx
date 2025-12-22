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
import { Input } from "@/components/ui/input";

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
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [loadingLocations, setLoadingLocations] = React.useState(false);
  const [loadingSlots, setLoadingSlots] = React.useState(false);

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
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    onSlotChange(0); // Reset slot when date changes
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  return (
    <div className="space-y-6">
      {/* Location Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
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
          <p className="text-xs text-slate-500 ml-1">
            {selectedLocation.address}
            {selectedLocation.instructions &&
              ` • ${selectedLocation.instructions}`}
          </p>
        )}
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Select Date
        </label>
        <Input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={selectedDate}
          onChange={handleDateChange}
          disabled={!selectedLocationId}
        />
      </div>

      {/* Slot Selection */}
      {selectedDate && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
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
                      "h-auto py-3 text-sm flex flex-row items-center justify-center gap-1",
                      selectedSlotId === slot.id
                        ? "bg-primary-navy text-white hover:bg-primary-navy/90"
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
            <div className="p-4 border border-dashed rounded-md text-center text-sm text-slate-500">
              No available slots for this date.
            </div>
          )}
        </div>
      )}
    </div>
  );
}


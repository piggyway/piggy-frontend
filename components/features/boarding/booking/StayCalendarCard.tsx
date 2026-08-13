"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatStayLabel, keyToDate, toDateKey } from "./stay-dates";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// Must stay in sync with the backend's BOARDING_TIME_SLOTS: it rejects any
// other time with a 400, so changing one side requires changing the other.
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

interface DayCell {
  key: string;
  day: number;
  inMonth: boolean;
}

interface StayCalendarCardProps {
  title: string;
  timeLabel: string;
  iconClassName: string;
  selectedDate: string | null;
  selectedTime: string | null;
  minDate: string;
  rangeStart: string | null;
  rangeEnd: string | null;
  onSelectDate: (key: string) => void;
  onSelectTime: (time: string) => void;
}

export function StayCalendarCard({
  title,
  timeLabel,
  iconClassName,
  selectedDate,
  selectedTime,
  minDate,
  rangeStart,
  rangeEnd,
  onSelectDate,
  onSelectTime,
}: StayCalendarCardProps) {
  const [view, setView] = useState(() => {
    const base = selectedDate ? keyToDate(selectedDate) : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  // Both calendars stay mounted, so the pick-up view can be left behind on an
  // earlier month once a later drop-off date pushes minDate forward. Adjust the
  // view during render (React's recommended pattern) instead of in an effect,
  // and only when minDate actually changes so manual paging still works.
  const [prevMinDate, setPrevMinDate] = useState(minDate);
  if (minDate !== prevMinDate) {
    setPrevMinDate(minDate);
    const min = keyToDate(minDate);
    if (min.getFullYear() * 12 + min.getMonth() > view.year * 12 + view.month) {
      setView({ year: min.getFullYear(), month: min.getMonth() });
    }
  }

  const changeMonth = (offset: number) => {
    setView((prev) => {
      const date = new Date(prev.year, prev.month + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(
    "en-AU",
    { month: "long", year: "numeric" }
  );

  // Monday-first grid, padded with prev/next month days (rendered disabled).
  const leadDays = (new Date(view.year, view.month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const daysInPrevMonth = new Date(view.year, view.month, 0).getDate();
  const cellCount = Math.ceil((leadDays + daysInMonth) / 7) * 7;

  const cells: DayCell[] = Array.from({ length: cellCount }, (_, i) => {
    const offset = i - leadDays;
    if (offset < 0) {
      const day = daysInPrevMonth + offset + 1;
      return {
        key: toDateKey(view.year, view.month - 1, day),
        day,
        inMonth: false,
      };
    }
    if (offset >= daysInMonth) {
      const day = offset - daysInMonth + 1;
      return {
        key: toDateKey(view.year, view.month + 1, day),
        day,
        inMonth: false,
      };
    }
    return {
      key: toDateKey(view.year, view.month, offset + 1),
      day: offset + 1,
      inMonth: true,
    };
  });

  return (
    <div className="border-neutral-stroke flex min-w-0 flex-1 flex-col gap-4 rounded-[24px] border bg-white px-7 py-[26px]">
      {/* Head */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            iconClassName
          )}
        >
          <CalendarDays className="text-primary-navy size-[17px]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-primary-navy text-lead">{title}</p>
          <p className="text-subtle text-slate-400">
            {selectedDate
              ? formatStayLabel(selectedDate, selectedTime)
              : "Select a date & time"}
          </p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
          className="border-neutral-stroke flex size-7 items-center justify-center rounded-full border bg-white text-slate-600 transition-colors hover:border-slate-300"
        >
          <ChevronLeft className="size-3" />
        </button>
        <p className="text-primary-navy text-p-ui font-semibold">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
          className="border-neutral-stroke flex size-7 items-center justify-center rounded-full border bg-white text-slate-600 transition-colors hover:border-slate-300"
        >
          <ChevronRight className="size-3" />
        </button>
      </div>

      {/* Day grid */}
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="text-detail flex h-6 items-center justify-center font-medium text-slate-400"
            >
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const isSelected = cell.inMonth && cell.key === selectedDate;
            const isInRange =
              cell.inMonth &&
              !isSelected &&
              rangeStart !== null &&
              rangeEnd !== null &&
              cell.key >= rangeStart &&
              cell.key <= rangeEnd;
            const isDisabled = !cell.inMonth || cell.key < minDate;

            return (
              <button
                key={cell.key}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectDate(cell.key)}
                className={cn(
                  "text-p flex h-[38px] items-center justify-center rounded-[10px] transition-colors",
                  isSelected
                    ? "bg-primary-navy font-semibold text-white"
                    : isDisabled
                      ? "text-slate-300"
                      : isInRange
                        ? "bg-primary-purple-light text-primary-navy"
                        : "text-primary-navy hover:bg-primary-purple-light"
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      {/* Time slots */}
      <div className="flex items-baseline justify-between">
        <p className="text-primary-navy text-p font-semibold">{timeLabel}</p>
        <p className="text-detail text-slate-400">1-hour blocks</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {TIME_SLOTS.map((slot) => {
          const isSelected = slot === selectedTime;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectTime(slot)}
              className={cn(
                "text-p flex h-9 items-center justify-center rounded-full transition-colors",
                isSelected
                  ? "bg-primary-navy font-semibold text-white"
                  : "border-neutral-stroke border bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

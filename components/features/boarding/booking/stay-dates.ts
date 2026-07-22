// Date helpers for the boarding booking flow. Dates are passed around as
// local "YYYY-MM-DD" keys so they compare correctly as plain strings.

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function keyToDate(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(): string {
  const now = new Date();
  return toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDaysToKey(key: string, days: number): string {
  const date = keyToDate(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

export function nightsBetween(startKey: string, endKey: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round(
    (keyToDate(endKey).getTime() - keyToDate(startKey).getTime()) / msPerDay
  );
}

export function formatStayLabel(key: string, time?: string | null): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(keyToDate(key));
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const label = `${get("weekday")} ${get("day")} ${get("month")}`;
  return time ? `${label} · ${time}` : label;
}

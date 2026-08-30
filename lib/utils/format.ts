const AU_LOCALE = "en-AU";

/**
 * Short AU date used across bookings and orders, e.g. "12/03/2026".
 * Falls back to the raw value when it cannot be parsed as a date.
 */
export function formatBookingDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(AU_LOCALE);
}

/** Long AU date for article bylines, e.g. "12 March 2026". */
export function formatLongDate(
  value: string | Date,
  options?: { timeZone?: string }
): string {
  const parsed = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString(AU_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/** Format a cents amount as currency, e.g. formatCents(1299) -> "$12.99". */
export function formatCents(
  amountCents: number | null | undefined,
  currency = "AUD"
): string {
  return new Intl.NumberFormat(AU_LOCALE, {
    style: "currency",
    currency: (currency || "AUD").toUpperCase(),
  }).format((amountCents ?? 0) / 100);
}

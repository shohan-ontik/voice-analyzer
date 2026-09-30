// Fixed time zone so server and client render the same string (avoids hydration mismatch).
const bnDateFormatter = new Intl.DateTimeFormat("bn-BD", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

// "2026-11-16T05:08:40.468Z" -> "১৬ নভেম্বর, ২০২৬"
export function formatBnDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : bnDateFormatter.format(date);
}

const bnTimeFormatter = new Intl.DateTimeFormat("bn-BD", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Dhaka",
});

// "2026-11-16T05:08:40.468Z" -> "১১:০৮:৪০ AM"
export function formatBnTime(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : bnTimeFormatter.format(date);
}

const bnRelativeFormatter = new Intl.RelativeTimeFormat("bn-BD", { numeric: "auto" });

const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "year", seconds: 365 * 24 * 3600 },
  { unit: "month", seconds: 30 * 24 * 3600 },
  { unit: "week", seconds: 7 * 24 * 3600 },
  { unit: "day", seconds: 24 * 3600 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
];

// "2026-11-16T05:08:40.468Z" -> "৭ ঘন্টা আগে"
export function formatBnRelative(iso: string, now = Date.now()) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return iso;
  const diffSec = Math.round((time - now) / 1000);
  const abs = Math.abs(diffSec);
  const match = RELATIVE_UNITS.find((u) => abs >= u.seconds);
  if (!match) return bnRelativeFormatter.format(0, "second");
  return bnRelativeFormatter.format(Math.round(diffSec / match.seconds), match.unit);
}

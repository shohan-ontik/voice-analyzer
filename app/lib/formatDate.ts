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

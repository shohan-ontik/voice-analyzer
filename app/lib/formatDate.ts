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

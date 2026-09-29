import type { Metadata } from "next";
import { connection } from "next/server";
import { RefreshHealthButton } from "../components/health/RefreshHealthButton";
import { checkHealth, type HealthStatus } from "../lib/apiClient";
import { formatBnTime } from "../lib/formatDate";

export const metadata: Metadata = {
  title: "System Health",
};

const STATUS_COPY: Record<HealthStatus["status"], { label: string; description: string; tone: string; dot: string }> = {
  up: {
    label: "সব সিস্টেম সচল",
    description: "সার্ভার ও ডাটাবেস দুটোই স্বাভাবিকভাবে কাজ করছে।",
    tone: "bg-success-soft text-success",
    dot: "bg-success",
  },
  degraded: {
    label: "আংশিক সমস্যা",
    description: "সার্ভার চালু আছে, কিন্তু ডাটাবেসে সংযোগ করা যাচ্ছে না।",
    tone: "bg-warning-soft text-warning-ink",
    dot: "bg-warning",
  },
  down: {
    label: "সার্ভার বন্ধ",
    description: "ব্যাকএন্ড সার্ভারের কাছ থেকে কোনো সাড়া পাওয়া যাচ্ছে না।",
    tone: "bg-error-soft text-error",
    dot: "bg-error",
  },
};

function ComponentRow({ name, state }: { name: string; state: "up" | "down" | "unknown" }) {
  const styles = {
    up: { label: "সচল", className: "bg-success-soft text-success" },
    down: { label: "বন্ধ", className: "bg-error-soft text-error" },
    unknown: { label: "অজানা", className: "bg-background text-foreground-muted" },
  }[state];

  return (
    <div className="flex items-center justify-between gap-3 py-3.5 border-b border-border last:border-b-0">
      <span className="text-[14px] font-medium text-foreground">{name}</span>
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles.className}`}>{styles.label}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[12px] text-foreground-muted">{label}</span>
      <span className="text-[14px] font-semibold text-foreground tabular-nums break-words">{value}</span>
    </div>
  );
}

export default async function HealthPage() {
  // Every visit (and every refresh) must hit the backend live.
  await connection();
  const health = await checkHealth();
  const copy = STATUS_COPY[health.status];
  const backendState = health.status === "down" ? "down" : "up";

  return (
    <div className="flex-1 flex items-center justify-center bg-background px-4 py-10 font-bangla">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display font-bold text-[22px] text-foreground">সিস্টেম হেলথ</h1>
          <RefreshHealthButton />
        </div>

        <div className={`rounded-2xl p-5 flex items-start gap-3 ${copy.tone}`}>
          <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${copy.dot}`} />
          <div className="flex flex-col gap-1">
            <span className="font-display font-bold text-[16px]">{copy.label}</span>
            <span className="text-[13px] text-foreground">{copy.description}</span>
            {health.error && <span className="text-[12.5px] text-foreground-muted">{health.error}</span>}
          </div>
        </div>

        <div className="bg-background-elevated border border-border rounded-2xl px-5">
          <ComponentRow name="API সার্ভার" state={backendState} />
          <ComponentRow name="ডাটাবেস" state={health.database} />
        </div>

        <div className="bg-background-elevated border border-border rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Stat label="রেসপন্স টাইম" value={`${health.latencyMs} ms`} />
          <Stat label="HTTP স্ট্যাটাস" value={health.httpStatus?.toString() ?? "—"} />
          <Stat label="সর্বশেষ চেক" value={formatBnTime(health.checkedAt)} />
        </div>
      </div>
    </div>
  );
}

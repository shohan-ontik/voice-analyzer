"use client";

import { useEffect, useState } from "react";
import { authFetch } from "../../lib/clientFetch";
import type { StatsSummary } from "../../lib/types";
import { MicIcon } from "../icons";
import { ProgressBar } from "../shared/ProgressBar";

// Mirrors the API's monthly cap on non-exam pitch sessions.
const MONTHLY_PITCH_LIMIT = 125;

export function PitchesRemainingCard() {
  const [pitchesRemaining, setPitchesRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    authFetch("/api/sessions/stats")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled)
          setPitchesRemaining((body as StatsSummary).pitchesRemainingThisMonth);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const remainingPercent =
    pitchesRemaining !== null
      ? (pitchesRemaining / MONTHLY_PITCH_LIMIT) * 100
      : 0;

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-navy-soft text-navy flex items-center justify-center shrink-0">
            <MicIcon size={16} />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-baseline lg:gap-2">
            <div className="font-display font-bold text-[15px] text-foreground">
              এই মাসে বাকি পিচ
            </div>
          </div>
        </div>
        <div className="font-display font-bold text-[22px] text-navy shrink-0">
          {pitchesRemaining ?? "…"}
          <span className="text-[13px] font-semibold text-foreground-muted">
            {" "}
            / {MONTHLY_PITCH_LIMIT}
          </span>
        </div>
      </div>
      <ProgressBar percent={100 - remainingPercent} size="md" />
    </div>
  );
}

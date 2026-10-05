"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authFetch } from "../lib/clientFetch";
import { formatBnDayMonth } from "../lib/formatDate";
import type { StatsSummary } from "../lib/types";
import { MONTHLY_PITCH_LIMIT } from "./home/PitchesRemainingCard";
import { MicIcon, SparkleIcon, XIcon } from "./icons";
import { ProgressBar } from "./shared/ProgressBar";

type QuotaTone = { icon: string; number: string; bar: string; card: string };

// Full/healthy quota is navy, under 50% is yellowish, exhausted is reddish.
function getQuotaTone(remaining: number | null): QuotaTone {
  if (remaining === null) {
    return { icon: "bg-navy-soft text-navy", number: "text-navy", bar: "bg-navy", card: "border-border bg-background-elevated" };
  }
  if (remaining <= 0) {
    return { icon: "bg-error-soft text-error", number: "text-error", bar: "bg-error", card: "border-error/30 bg-error-soft/40" };
  }
  if (remaining / MONTHLY_PITCH_LIMIT < 0.5) {
    return { icon: "bg-warning-soft text-warning-ink", number: "text-warning-ink", bar: "bg-warning", card: "border-warning/40 bg-warning-soft/50" };
  }
  return { icon: "bg-navy-soft text-navy", number: "text-navy", bar: "bg-navy", card: "border-border bg-background-elevated" };
}

const formatBnNumber = (n: number) => n.toLocaleString("bn-BD");

export function PracticeAgainButton({
  href,
  label = "আবার প্র্যাকটিস করুন",
  className = "cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[13.5px]",
}: Readonly<{ href: string; label?: string; className?: string }>) {
  const [open, setOpen] = useState(false);
  const [pitchesRemaining, setPitchesRemaining] = useState<number | null>(null);
  const [resetsAt, setResetsAt] = useState<string | null>(null);

  useEffect(() => {
    if (!open || pitchesRemaining !== null) return;
    let cancelled = false;
    authFetch("/api/sessions/stats")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled) {
          const stats = body as StatsSummary;
          setPitchesRemaining(stats.pitchesRemainingThisMonth);
          setResetsAt(stats.pitchQuotaResetsAt);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, pitchesRemaining]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const tone = getQuotaTone(pitchesRemaining);
  const remainingPercent = pitchesRemaining === null ? 0 : (pitchesRemaining / MONTHLY_PITCH_LIMIT) * 100;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <SparkleIcon size={14} />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-2 py-4 sm:p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[560px] rounded-2xl bg-background-elevated p-4 sm:p-6 flex flex-col items-center gap-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="self-end -mt-2 -mr-2 text-foreground-muted hover:text-foreground p-1 cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <XIcon size={18} />
            </button>

            <div className={`w-full rounded-2xl border p-4 flex flex-col gap-3 text-left -mt-4 ${tone.card}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone.icon}`}>
                  <MicIcon size={18} />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[13px] text-foreground-muted">এই মাসে বাকি পিচ</h2>
                  <div className={`font-display font-bold text-[26px] leading-tight ${tone.number}`}>
                    {pitchesRemaining === null ? "…" : formatBnNumber(pitchesRemaining)}
                    <span className="text-[13px] font-semibold text-foreground-muted">
                      {" "}
                      / {formatBnNumber(MONTHLY_PITCH_LIMIT)}
                    </span>
                  </div>
                </div>
              </div>
              <ProgressBar percent={remainingPercent} fillClassName={tone.bar} size="md" />
              {resetsAt && <p className="text-[12px] text-foreground-muted">{formatBnDayMonth(resetsAt)} রিসেট হবে</p>}
            </div>

            <Link
              href={href}
              className="w-full mt-2 text-center px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[13.5px] cursor-pointer"
            >
              কন্টিনিউ করুন
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

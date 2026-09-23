"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authFetch } from "../lib/clientFetch";
import type { StatsSummary } from "../lib/types";
import { MicIcon, SparkleIcon, XIcon } from "./icons";

export function PracticeAgainButton({
  href,
  label = "আবার প্র্যাকটিস করুন",
  className = "cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[13.5px]",
}: Readonly<{ href: string; label?: string; className?: string }>) {
  const [open, setOpen] = useState(false);
  const [pitchesRemaining, setPitchesRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!open || pitchesRemaining !== null) return;
    let cancelled = false;
    authFetch("/api/sessions/stats")
      .then(async (res) => {
        const body = await res.json();
        if (res.ok && !cancelled) setPitchesRemaining((body as StatsSummary).pitchesRemainingThisMonth);
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

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <SparkleIcon size={14} />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[360px] rounded-2xl bg-background-elevated p-6 flex flex-col items-center gap-4 text-center"
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

            <div className="w-14 h-14 rounded-full bg-navy-soft text-navy flex items-center justify-center -mt-4">
              <MicIcon size={22} />
            </div>

            <h2 className="font-display font-bold text-[17px] text-foreground">আপনার বাকি পিচ</h2>

            <div className="font-display font-bold text-[40px] text-navy leading-none">
              {pitchesRemaining ?? "…"}
            </div>

            <p className="text-[13px] text-foreground-muted leading-relaxed">
              এই মাসে আপনার আর {pitchesRemaining ?? "…"}টি পিচ রেকর্ড করার সুযোগ আছে।
            </p>

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

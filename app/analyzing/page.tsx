"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = [
  "Uploading your recording…",
  "Transcribing your speech…",
  "Scoring pacing and pronunciation…",
  "Evaluating tone and soft skills…",
];

const TIPS = [
  "Pausing after your key point boosts perceived confidence.",
  "Naming the customer's problem before your solution builds trust fast.",
  "A strong close repeats one clear next step — don't leave it open-ended.",
];

const CIRCUMFERENCE = 464.9;

export default function AnalyzingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [viewed, setViewed] = useState(false);

  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tipTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    progressTimer.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 2);
        if (next >= 100 && progressTimer.current) {
          clearInterval(progressTimer.current);
          progressTimer.current = null;
        }
        return next;
      });
    }, 140);
    tipTimer.current = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3400);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
      if (tipTimer.current) clearInterval(tipTimer.current);
    };
  }, []);

  const done = progress >= 100;
  const stageIdx = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));
  const dashOffset = CIRCUMFERENCE * (1 - progress / 100);

  function viewResults() {
    setViewed(true);
    setTimeout(() => router.push("/results"), 300);
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-7 max-w-[520px] text-center">
        <div className="relative w-[168px] h-[168px] flex items-center justify-center">
          <svg width="168" height="168" viewBox="0 0 168 168" className={done ? "" : "animate-spin"} style={{ animationDuration: "2.6s" }}>
            <circle cx="84" cy="84" r="74" fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="84"
              cy="84"
              r="74"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 84 84)"
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            {done ? (
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <div className="font-display font-bold text-2xl text-foreground">{progress}%</div>
            )}
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-[28px] mb-2.5 text-foreground">
            {done ? "Great energy in that pitch!" : "Analyzing your pitch…"}
          </div>
          <div className="text-[15px] text-foreground-muted leading-relaxed">
            {done ? "Everything's scored and ready for you." : STAGES[stageIdx]}
          </div>
        </div>

        {done && (
          <button
            type="button"
            onClick={viewResults}
            disabled={viewed}
            className="flex items-center gap-2 px-[26px] py-3.5 rounded-xl font-display font-semibold text-sm text-accent-ink disabled:opacity-70"
            style={{ background: viewed ? "var(--foreground-muted)" : "var(--accent)" }}
          >
            {viewed ? "Opening results…" : "View My Results"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}

        <div className="mt-3 p-[18px_22px] rounded-2xl bg-background-elevated border border-border flex gap-3 items-start text-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
          </svg>
          <div className="text-[13.5px] leading-relaxed text-foreground">
            <span className="font-bold text-teal">Tip — </span>
            {TIPS[tipIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}

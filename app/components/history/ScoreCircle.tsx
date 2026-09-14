"use client";

import { useEffect, useState } from "react";

const CIRCUMFERENCE = 540.4;

// Animates the ring from empty to `score` on mount — the only reason this
// piece needs to be a client component.
export function ScoreCircle({ score }: { score: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const offset = mounted ? CIRCUMFERENCE * (1 - score / 100) : CIRCUMFERENCE;

  return (
    <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="86" fill="none" stroke="var(--border)" strokeWidth="12" />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="font-display font-bold text-[44px] text-foreground">{score}</div>
        <div className="text-xs text-foreground-muted">out of 100</div>
      </div>
    </div>
  );
}

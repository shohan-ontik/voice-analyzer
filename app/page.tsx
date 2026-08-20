"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TopNav } from "./components/TopNav";
import { SCENARIOS, useAppState } from "./providers";

export default function Home() {
  const router = useRouter();
  const { scenario, setScenario } = useAppState();
  const [starting, setStarting] = useState(false);

  const selectedLabel = SCENARIOS.find((s) => s.key === scenario)!.label;

  function startSession() {
    setStarting(true);
    setTimeout(() => router.push("/record"), 550);
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <TopNav />

      <div className="px-16 pt-16 pb-10 max-w-[760px]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-bold tracking-wide uppercase mb-5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Sales Pitch Trainer
        </div>
        <h1 className="font-display font-bold text-[52px] leading-[1.08] tracking-tight mb-4 text-foreground">
          Practice until your pitch feels unstoppable.
        </h1>
        <p className="text-[17px] leading-relaxed text-foreground-muted mb-9 max-w-[560px]">
          Read a script aloud on camera or mic, and get instant AI feedback on
          your presentation, accuracy, pronunciation and soft skills — right
          after you finish.
        </p>

        {starting ? (
          <div className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-accent-soft text-accent font-display font-semibold text-base">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-9-9" />
            </svg>
            Preparing your script — {selectedLabel}...
          </div>
        ) : (
          <button
            type="button"
            onClick={startSession}
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-accent text-accent-ink font-display font-semibold text-base hover:-translate-y-px transition-transform"
          >
            Start New Session
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-16 pb-11">
        <div className="text-[13px] font-bold tracking-wide uppercase text-foreground-muted mb-4">
          Choose a scenario
        </div>
        <div className="flex gap-3 flex-wrap">
          {SCENARIOS.map((s) => {
            const isSel = s.key === scenario;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setScenario(s.key)}
                className={`px-5 py-3 rounded-full text-sm font-semibold border-[1.5px] transition-colors ${
                  isSel
                    ? "bg-accent border-accent text-accent-ink"
                    : "bg-transparent border-border text-foreground-muted"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-16 pb-16 grid grid-cols-3 gap-5 max-w-[760px]">
        <StatCard
          label="Last score"
          value="82"
          icon={<path d="M3 3v18h18M19 9l-5 5-4-4-3 3" strokeWidth="2" />}
        />
        <StatCard
          label="Sessions this week"
          value="4"
          icon={
            <>
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
            </>
          }
        />
        <StatCard
          label="Day streak"
          value="6"
          accent
          icon={
            <path
              d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a6 6 0 0 1-12 0c0-1 .5-2.5 1.5-3.5"
              strokeWidth="2"
            />
          }
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="p-[22px] rounded-2xl bg-background-elevated border border-border">
      <div className="flex items-center gap-2 mb-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent ? "var(--accent)" : "var(--teal)"}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
        <div className="text-xs font-semibold text-foreground-muted">
          {label}
        </div>
      </div>
      <div className="font-display font-bold text-[28px] text-foreground">
        {value}
      </div>
    </div>
  );
}

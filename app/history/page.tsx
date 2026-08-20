"use client";

import { useState } from "react";
import { TopNav } from "../components/TopNav";
import { SCENARIOS, type ScenarioKey } from "../providers";

type Session = {
  id: number;
  key: ScenarioKey;
  category: string;
  date: string;
  score: number;
  snippet: string;
  sub: { label: string; value: number }[];
};

const SESSIONS: Session[] = [
  {
    id: 1,
    key: "elevator",
    category: "Elevator Pitch",
    date: "Today, 10:14 AM",
    score: 82,
    snippet: "Strong pitch — a few tweaks and you're there.",
    sub: [
      { label: "Presentation", value: 88 },
      { label: "Correctness", value: 74 },
      { label: "Pronunciation", value: 79 },
      { label: "Soft Skills", value: 85 },
    ],
  },
  {
    id: 2,
    key: "objection",
    category: "Objection Handling",
    date: "Yesterday, 4:02 PM",
    score: 71,
    snippet: "Good recovery, but hesitated on price pushback.",
    sub: [
      { label: "Presentation", value: 70 },
      { label: "Correctness", value: 68 },
      { label: "Pronunciation", value: 81 },
      { label: "Soft Skills", value: 66 },
    ],
  },
  {
    id: 3,
    key: "demo",
    category: "Product Demo",
    date: "Mon, 2:40 PM",
    score: 90,
    snippet: "Excellent — ready to pitch live.",
    sub: [
      { label: "Presentation", value: 93 },
      { label: "Correctness", value: 88 },
      { label: "Pronunciation", value: 90 },
      { label: "Soft Skills", value: 89 },
    ],
  },
  {
    id: 4,
    key: "cold",
    category: "Cold Call",
    date: "Mon, 9:15 AM",
    score: 64,
    snippet: "Good start — keep practicing the basics.",
    sub: [
      { label: "Presentation", value: 62 },
      { label: "Correctness", value: 60 },
      { label: "Pronunciation", value: 75 },
      { label: "Soft Skills", value: 59 },
    ],
  },
  {
    id: 5,
    key: "elevator",
    category: "Elevator Pitch",
    date: "Last Fri, 3:22 PM",
    score: 77,
    snippet: "Strong pitch — a few tweaks and you're there.",
    sub: [
      { label: "Presentation", value: 80 },
      { label: "Correctness", value: 71 },
      { label: "Pronunciation", value: 76 },
      { label: "Soft Skills", value: 81 },
    ],
  },
  {
    id: 6,
    key: "demo",
    category: "Product Demo",
    date: "Last Thu, 11:05 AM",
    score: 85,
    snippet: "Excellent — ready to pitch live.",
    sub: [
      { label: "Presentation", value: 87 },
      { label: "Correctness", value: 82 },
      { label: "Pronunciation", value: 84 },
      { label: "Soft Skills", value: 87 },
    ],
  },
];

function scoreTone(score: number) {
  if (score >= 85) return { bg: "var(--accent-soft)", color: "var(--accent)" };
  if (score >= 70) return { bg: "var(--teal-soft)", color: "var(--teal)" };
  return { bg: "var(--border)", color: "var(--foreground-muted)" };
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<ScenarioKey | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = SESSIONS.filter((s) => filter === "all" || s.key === filter);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <TopNav />

      <div className="flex items-center justify-between px-16 py-7">
        <div className="font-display font-bold text-[22px] text-foreground">Session History</div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-soft text-teal text-[13px] font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          Avg this week: 78 (+6)
        </div>
      </div>

      <div className="px-16 pb-16 max-w-[920px] mx-auto w-full">
        <div className="flex gap-2.5 mb-7 flex-wrap">
          <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          {SCENARIOS.map((s) => (
            <FilterChip key={s.key} label={s.label} active={filter === s.key} onClick={() => setFilter(s.key)} />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((s) => {
            const tone = scoreTone(s.score);
            const isOpen = expandedId === s.id;
            return (
              <div key={s.id} className="border border-border rounded-2xl bg-background-elevated overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId((prev) => (prev === s.id ? null : s.id))}
                  className="w-full text-left p-[18px_22px] flex items-center gap-4.5"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-base flex-shrink-0"
                    style={{ background: tone.bg, color: tone.color }}
                  >
                    {s.score}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="font-display font-semibold text-[15px] text-foreground">{s.category}</div>
                      <div className="text-xs text-foreground-muted">{s.date}</div>
                    </div>
                    <div className="text-[13px] text-foreground-muted">{s.snippet}</div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--foreground-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-[22px] pb-5 pl-[78px] flex flex-col gap-2.5">
                    {s.sub.map((sub) => (
                      <div key={sub.label} className="flex items-center gap-3">
                        <div className="w-24 text-[12.5px] text-foreground-muted">{sub.label}</div>
                        <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${sub.value}%` }} />
                        </div>
                        <div className="w-[26px] text-right text-[12.5px] font-semibold text-foreground">{sub.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-[18px] py-2.5 rounded-full text-[13.5px] font-semibold border-[1.5px] transition-colors ${
        active ? "bg-accent border-accent text-accent-ink" : "bg-transparent border-border text-foreground-muted"
      }`}
    >
      {label}
    </button>
  );
}

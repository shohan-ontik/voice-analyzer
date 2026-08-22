"use client";

import { useEffect, useMemo, useState } from "react";
import { TopNav } from "../components/TopNav";
import type { PracticeSessionRecord, StatsSummary } from "../lib/types";

function scoreTone(score: number) {
  if (score >= 85) return { bg: "var(--accent-soft)", color: "var(--accent)" };
  if (score >= 70) return { bg: "var(--teal-soft)", color: "var(--teal)" };
  return { bg: "var(--border)", color: "var(--foreground-muted)" };
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<PracticeSessionRecord[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/sessions").then((res) => res.json()),
      fetch("/api/sessions/stats").then((res) => res.json()),
    ])
      .then(([sessionsBody, statsBody]) => {
        setSessions(sessionsBody.items ?? []);
        setStats(statsBody ?? null);
      })
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const topicNames = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.topicName))),
    [sessions]
  );
  const filtered = sessions.filter((s) => filter === "all" || s.topicName === filter);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <TopNav />

      <div className="flex items-center justify-between px-16 py-7">
        <div className="font-display font-bold text-[22px] text-foreground">Session History</div>
        {stats?.averageScoreThisWeek != null && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-soft text-teal text-[13px] font-semibold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            Avg this week: {stats.averageScoreThisWeek}
          </div>
        )}
      </div>

      <div className="px-16 pb-16 max-w-[920px] mx-auto w-full">
        {loading ? (
          <div className="text-center text-foreground-muted py-16">Loading…</div>
        ) : error ? (
          <div className="text-center text-red-600 py-16">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-foreground-muted py-16">
            No sessions yet — head back to Practice to record your first pitch.
          </div>
        ) : (
          <>
            <div className="flex gap-2.5 mb-7 flex-wrap">
              <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
              {topicNames.map((name) => (
                <FilterChip key={name} label={name} active={filter === name} onClick={() => setFilter(name)} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filtered.map((s) => {
                const tone = scoreTone(s.overallScore);
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
                        {s.overallScore}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-1">
                          <div className="font-display font-semibold text-[15px] text-foreground">{s.topicName}</div>
                          <div className="text-xs text-foreground-muted">{formatDate(s.createdAt)}</div>
                        </div>
                        <div className="text-[13px] text-foreground-muted">{s.verdict}</div>
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
                        {s.categories.map((cat) => (
                          <div key={cat.name} className="flex items-center gap-3">
                            <div className="w-28 text-[12.5px] text-foreground-muted">{cat.name}</div>
                            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                              <div className="h-full rounded-full bg-accent" style={{ width: `${cat.score}%` }} />
                            </div>
                            <div className="w-[26px] text-right text-[12.5px] font-semibold text-foreground">
                              {cat.score}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
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

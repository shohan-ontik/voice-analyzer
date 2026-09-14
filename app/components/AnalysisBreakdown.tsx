"use client";

import { useEffect, useState } from "react";
import type { AnalysisCategory, TranscriptSegment } from "../lib/analysis";

export function AnalysisBreakdown({
  categories,
  transcript,
}: {
  categories: AnalysisCategory[];
  transcript: TranscriptSegment[];
}) {
  const [mounted, setMounted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="text-[13px] font-bold uppercase tracking-wide text-foreground-muted mb-1">Score breakdown</div>

      {categories.map((cat) => {
        const isOpen = !!expanded[cat.name];
        return (
          <div key={cat.name} className="border border-border rounded-2xl bg-background-elevated overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded((prev) => ({ ...prev, [cat.name]: !prev[cat.name] }))}
              className="cursor-pointer w-full text-left p-4 sm:p-[18px_22px] flex items-center gap-3 sm:gap-4"
            >
              <div className="w-[34px] h-[34px] rounded-[9px] bg-teal-soft flex items-center justify-center flex-shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4" />
                  <path d="M9 11V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7" />
                  <path d="M9 11h6" />
                  <path d="M15 11h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display font-semibold text-[15px] text-foreground">{cat.name}</div>
                  <div className="font-display font-bold text-[15px] text-foreground">{cat.score}</div>
                </div>
                <div className="h-[7px] rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-700"
                    style={{ width: mounted ? `${cat.score}%` : "0%" }}
                  />
                </div>
                <div className="text-[13px] text-foreground-muted mt-2.5">{cat.feedback}</div>
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
              <div className="px-4 sm:px-[22px] pb-5 pl-8 sm:pl-[72px] flex flex-col gap-2">
                {cat.tips.map((tip) => (
                  <div key={tip} className="flex gap-2 text-[13px] text-foreground items-start">
                    <div className="w-[5px] h-[5px] rounded-full bg-accent mt-[7px] flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Transcript */}
      <div className="mt-3 border border-border rounded-2xl bg-background-elevated">
        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          className="cursor-pointer w-full text-left p-4 sm:p-[18px_22px] flex items-center justify-between"
        >
          <div className="font-display font-semibold text-[15px] text-foreground">View transcript</div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--foreground-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200"
            style={{ transform: showTranscript ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {showTranscript && (
          <div className="px-4 sm:px-[22px] pb-4 sm:pb-[22px]">
            <div className="font-bangla text-base sm:text-lg leading-[1.8] sm:leading-[2] text-foreground">
              {transcript.map((seg, i) => (
                <span
                  key={i}
                  style={
                    seg.kind === "filler"
                      ? { color: "var(--foreground-muted)", textDecoration: "line-through" }
                      : seg.kind === "pronunciation"
                      ? { color: "var(--accent)", textDecoration: "underline", textDecorationThickness: "2px", textUnderlineOffset: "4px" }
                      : undefined
                  }
                >
                  {seg.text}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-3.5 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <div className="w-[26px] h-[3px] rounded-sm" style={{ background: "var(--foreground-muted)" }} />
                Filler word
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <div className="w-[26px] h-[3px] rounded-sm bg-accent" />
                Needs pronunciation practice
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

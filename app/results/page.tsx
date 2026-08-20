"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackHeader } from "../components/BackHeader";
import { SCENARIOS, useAppState } from "../providers";

type Category = {
  key: string;
  name: string;
  score: number;
  feedback: string;
  tips: string[];
  icon: "presentation" | "correctness";
};

const CATEGORIES: Category[] = [
  {
    key: "presentation",
    name: "Presentation",
    score: 88,
    feedback: "Confident tone and steady pace throughout.",
    tips: ["Add a stronger opening hook in the first line.", "Slow down slightly on the closing sentence."],
    icon: "presentation",
  },
  {
    key: "correctness",
    name: "Correctness",
    score: 74,
    feedback: "You covered most of the script, but skipped one key phrase.",
    tips: ["You dropped the cost-saving benefit — mention it explicitly.", "Re-read the full passage once before retaking."],
    icon: "correctness",
  },
  {
    key: "pronunciation",
    name: "Pronunciation",
    score: 79,
    feedback: "Clear delivery with one recurring slip.",
    tips: ["ব্যবহার came out rushed twice — slow down on compound words.", "Otherwise crisp and easy to follow."],
    icon: "correctness",
  },
  {
    key: "soft",
    name: "Soft Skills",
    score: 85,
    feedback: "Warm, persuasive tone that builds trust.",
    tips: ["Add a brief pause before your call-to-action.", "Mirror the customer's own words back to them."],
    icon: "presentation",
  },
];

const TRANSCRIPT: { text: string; kind: "plain" | "filler" | "pronunciation" }[] = [
  { text: "আমাদের নতুন প্রোডাক্ট আপনার ব্যবসার কাজ আরও সহজ করে তুলবে। ", kind: "plain" },
  { text: "এটি ", kind: "plain" },
  { text: "মানে ", kind: "filler" },
  { text: "ব্যবহার ", kind: "pronunciation" },
  {
    text: "করা যেমন সহজ, তেমনই কার্যকর। প্রতিদিন হাজারো মানুষ এটি ব্যবহার করে সময় ও খরচ দুটোই বাঁচাচ্ছেন। আজই আমাদের সাথে যুক্ত হয়ে আপনার ব্যবসাকে নিয়ে যান এক নতুন উচ্চতায়।",
    kind: "plain",
  },
];

const OVERALL = Math.round(CATEGORIES.reduce((s, c) => s + c.score, 0) / CATEGORIES.length);
const CIRCUMFERENCE = 540.4;

function verdictFor(score: number) {
  if (score >= 85) return "Excellent — ready to pitch live";
  if (score >= 70) return "Strong pitch — a few tweaks and you're there";
  if (score >= 50) return "Good start — keep practicing the basics";
  return "Let's rebuild this one together";
}

export default function ResultsPage() {
  const { scenario, recording } = useAppState();
  const scenarioLabel = SCENARIOS.find((s) => s.key === scenario)!.label;

  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const overallOffset = mounted ? CIRCUMFERENCE * (1 - OVERALL / 100) : CIRCUMFERENCE;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <BackHeader title={`${scenarioLabel} — Results`} subtitle="Recorded today · 0:42" />

      <div className="grid grid-cols-[420px_1fr]">
        {/* Left: overall + recording playback */}
        <div className="p-12 border-r border-border flex flex-col items-center gap-6">
          <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
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
                strokeDashoffset={overallOffset}
                transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <div className="font-display font-bold text-[44px] text-foreground">{OVERALL}</div>
              <div className="text-xs text-foreground-muted">out of 100</div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-[19px] mb-1.5 text-foreground">{verdictFor(OVERALL)}</div>
            <div className="text-[13.5px] text-foreground-muted leading-relaxed">
              Based on presentation, correctness, pronunciation and soft skills.
            </div>
          </div>

          {recording ? (
            <div className="w-full rounded-2xl overflow-hidden border border-border bg-background-elevated">
              {recording.mode === "video" ? (
                <video src={recording.blobUrl} controls className="w-full h-auto block" />
              ) : (
                <div className="p-4">
                  <audio src={recording.blobUrl} controls className="w-full" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full rounded-2xl border border-dashed border-border p-4 text-center text-xs text-foreground-muted">
              No recording in this session — showing sample results.
            </div>
          )}

          <div className="w-full flex flex-col gap-2.5 mt-2">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="w-full py-3.5 rounded-xl bg-accent text-accent-ink font-display font-semibold text-sm flex items-center justify-center gap-2"
            >
              {saved && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {saved ? "Saved" : "Save & Continue"}
            </button>
            <Link
              href="/record"
              className="w-full py-3.5 rounded-xl border-[1.5px] border-border text-foreground font-display font-semibold text-sm text-center"
            >
              Try Again
            </Link>
          </div>
        </div>

        {/* Right: breakdown + transcript */}
        <div className="p-12 flex flex-col gap-3.5">
          <div className="text-[13px] font-bold uppercase tracking-wide text-foreground-muted mb-1">Score breakdown</div>

          {CATEGORIES.map((cat) => {
            const isOpen = !!expanded[cat.key];
            return (
              <div key={cat.key} className="border border-border rounded-2xl bg-background-elevated overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                  className="w-full text-left p-[18px_22px] flex items-center gap-4"
                >
                  <div className="w-[34px] h-[34px] rounded-[9px] bg-teal-soft flex items-center justify-center flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {cat.icon === "presentation" ? (
                        <>
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 3.5 12 7 8 3.5" />
                        </>
                      ) : (
                        <>
                          <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4" />
                          <path d="M9 11V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7" />
                          <path d="M9 11h6" />
                          <path d="M15 11h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                        </>
                      )}
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
                  <div className="px-[22px] pb-5 pl-[72px] flex flex-col gap-2">
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
              className="w-full text-left p-[18px_22px] flex items-center justify-between"
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
              <div className="px-[22px] pb-[22px]">
                <div className="font-bangla text-lg leading-[2] text-foreground">
                  {TRANSCRIPT.map((seg, i) => (
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
                <div className="flex gap-5 mt-4 pt-3.5 border-t border-border">
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
      </div>
    </div>
  );
}

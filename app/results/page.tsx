"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnalysisBreakdown } from "../components/AnalysisBreakdown";
import { BackHeader } from "../components/BackHeader";
import { useAppState } from "../providers";
import type { AnalysisResult } from "../lib/analysis";
import { authFetch } from "../lib/clientFetch";

const MOCK_ANALYSIS: AnalysisResult = {
  overall: 82,
  verdict: "Strong pitch — a few tweaks and you're there",
  categories: [
    {
      name: "Presentation",
      score: 88,
      feedback: "Confident tone and steady pace throughout.",
      tips: ["Add a stronger opening hook in the first line.", "Slow down slightly on the closing sentence."],
    },
    {
      name: "Correctness",
      score: 74,
      feedback: "You covered most of the script, but skipped one key phrase.",
      tips: [
        "You dropped the cost-saving benefit — mention it explicitly.",
        "Re-read the full passage once before retaking.",
      ],
    },
    {
      name: "Pronunciation",
      score: 79,
      feedback: "Clear delivery with one recurring slip.",
      tips: ["ব্যবহার came out rushed twice — slow down on compound words.", "Otherwise crisp and easy to follow."],
    },
    {
      name: "Soft Skills",
      score: 85,
      feedback: "Warm, persuasive tone that builds trust.",
      tips: ["Add a brief pause before your call-to-action.", "Mirror the customer's own words back to them."],
    },
  ],
  transcript: [
    { text: "আমাদের নতুন প্রোডাক্ট আপনার ব্যবসার কাজ আরও সহজ করে তুলবে। ", kind: "plain" },
    { text: "এটি ", kind: "plain" },
    { text: "মানে ", kind: "filler" },
    { text: "ব্যবহার ", kind: "pronunciation" },
    {
      text: "করা যেমন সহজ, তেমনই কার্যকর। প্রতিদিন হাজারো মানুষ এটি ব্যবহার করে সময় ও খরচ দুটোই বাঁচাচ্ছেন। আজই আমাদের সাথে যুক্ত হয়ে আপনার ব্যবসাকে নিয়ে যান এক নতুন উচ্চতায়।",
      kind: "plain",
    },
  ],
};

const CIRCUMFERENCE = 540.4;

export default function ResultsPage() {
  const { selectedTopic, recording, analysis } = useAppState();
  const scenarioLabel = selectedTopic?.name ?? "Practice Session";
  const result = analysis ?? MOCK_ANALYSIS;
  const isSample = !analysis;

  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  async function handleSave() {
    if (!analysis || saved || saving) return;

    setSaving(true);
    setSaveError(null);
    try {
      const res = await authFetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: selectedTopic?.id ?? null,
          topicName: selectedTopic?.name ?? "Practice Session",
          overall: analysis.overall,
          verdict: analysis.verdict,
          categories: analysis.categories,
          transcript: analysis.transcript,
        }),
      });
      const responseBody = await res.json();
      if (!res.ok) throw new Error(responseBody?.error?.message ?? "Failed to save this session.");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save this session.");
    } finally {
      setSaving(false);
    }
  }

  const overallOffset = mounted ? CIRCUMFERENCE * (1 - result.overall / 100) : CIRCUMFERENCE;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <BackHeader
        title={`${scenarioLabel} — Results`}
        subtitle={recording ? `Recorded today · 0:${String(recording.durationSec).padStart(2, "0")}` : "Sample results"}
      />

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
              <div className="font-display font-bold text-[44px] text-foreground">{result.overall}</div>
              <div className="text-xs text-foreground-muted">out of 100</div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-[19px] mb-1.5 text-foreground">{result.verdict}</div>
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
          {isSample && recording && (
            <div className="w-full rounded-xl bg-teal-soft text-teal text-xs text-center py-2.5 px-3">
              Showing sample scores — analysis hasn&apos;t run for this recording yet.
            </div>
          )}

          <div className="w-full flex flex-col gap-2.5 mt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSample || saving || saved}
              title={isSample ? "Nothing to save — this is a sample result." : undefined}
              className="w-full py-3.5 rounded-xl bg-accent text-accent-ink font-display font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saved && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {saved ? "Saved" : saving ? "Saving…" : "Save & Continue"}
            </button>
            {saveError && <div className="text-[13px] text-red-600 text-center">{saveError}</div>}
            <Link
              href="/record"
              className="w-full py-3.5 rounded-xl border-[1.5px] border-border text-foreground font-display font-semibold text-sm text-center"
            >
              Try Again
            </Link>
          </div>
        </div>

        {/* Right: breakdown + transcript */}
        <div className="p-12">
          <AnalysisBreakdown categories={result.categories} transcript={result.transcript} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "../lib/analysis";
import { TopNav } from "../components/TopNav";
import { useAppState } from "../providers";

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
// Progress eases toward this cap while the real request is in flight, then
// jumps to 100 only once the response actually arrives.
const CAP_WHILE_WAITING = 92;

export default function AnalyzingPage() {
  const router = useRouter();
  const { selectedTopic, recording, setAnalysis } = useAppState();

  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [viewed, setViewed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tipTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    tipTimer.current = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3400);
    return () => {
      if (tipTimer.current) clearInterval(tipTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!recording) {
      router.replace("/record");
      return;
    }
    if (!selectedTopic) {
      router.replace("/");
      return;
    }
    if (requestedRef.current) return;
    requestedRef.current = true;

    progressTimer.current = setInterval(() => {
      setProgress((prev) => (prev >= CAP_WHILE_WAITING ? prev : prev + 2));
    }, 140);

    async function run() {
      try {
        const formData = new FormData();
        formData.append("file", recording!.blob, "recording.webm");
        formData.append("mode", recording!.mode);
        formData.append("passage", selectedTopic!.passage);
        formData.append("topicName", selectedTopic!.name);

        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error || "Analysis failed.");

        if (progressTimer.current) clearInterval(progressTimer.current);
        setProgress(100);
        setDone(true);
        setAnalysis(body as AnalysisResult);
      } catch (e) {
        if (progressTimer.current) clearInterval(progressTimer.current);
        setError(
          e instanceof Error ? e.message : "Analysis failed. Please try again.",
        );
      }
    }

    run();

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  const stageIdx = Math.min(
    STAGES.length - 1,
    Math.floor((progress / 100) * STAGES.length),
  );
  const dashOffset = CIRCUMFERENCE * (1 - progress / 100);

  function viewResults() {
    setViewed(true);
    setTimeout(() => router.push("/results"), 300);
  }

  function retry() {
    router.replace("/record");
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <TopNav />
      <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-7 max-w-[520px] text-center">
        <div className="relative w-[168px] h-[168px] flex items-center justify-center">
          <svg
            width="168"
            height="168"
            viewBox="0 0 168 168"
            className={done || error ? "" : "animate-spin"}
            style={{ animationDuration: "2.6s" }}
          >
            <circle
              cx="84"
              cy="84"
              r="74"
              fill="none"
              stroke="var(--border)"
              strokeWidth="10"
            />
            <circle
              cx="84"
              cy="84"
              r="74"
              fill="none"
              stroke={error ? "var(--foreground-muted)" : "var(--accent)"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 84 84)"
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            {error ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--foreground-muted)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : done ? (
              <svg
                width="46"
                height="46"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <div className="font-display font-bold text-2xl text-foreground">
                {progress}%
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-[28px] mb-2.5 text-foreground">
            {error
              ? "Something went wrong"
              : done
                ? "Great energy in that pitch!"
                : "Analyzing your pitch…"}
          </div>
          <div className="text-[15px] text-foreground-muted leading-relaxed">
            {error ||
              (done
                ? "Everything's scored and ready for you."
                : STAGES[stageIdx])}
          </div>
        </div>

        {error ? (
          <button
            type="button"
            onClick={retry}
            className="flex items-center gap-2 px-[26px] py-3.5 rounded-xl bg-accent text-accent-ink font-display font-semibold text-sm"
          >
            Back to Recording
          </button>
        ) : (
          done && (
            <button
              type="button"
              onClick={viewResults}
              disabled={viewed}
              className="flex items-center gap-2 px-[26px] py-3.5 rounded-xl font-display font-semibold text-sm text-accent-ink disabled:opacity-70"
              style={{
                background: viewed
                  ? "var(--foreground-muted)"
                  : "var(--accent)",
              }}
            >
              {viewed ? "Opening results…" : "View My Results"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )
        )}

        {!error && (
          <div className="mt-3 p-[18px_22px] rounded-2xl bg-background-elevated border border-border flex gap-3 items-start text-left">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-0.5"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
            </svg>
            <div className="text-[13.5px] leading-relaxed text-foreground">
              <span className="font-bold text-teal">Tip — </span>
              {TIPS[tipIndex]}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

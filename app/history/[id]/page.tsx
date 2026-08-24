"use client";

import { use, useEffect, useState } from "react";
import { AnalysisBreakdown } from "../../components/AnalysisBreakdown";
import { BackHeader } from "../../components/BackHeader";
import { TopNav } from "../../components/TopNav";
import type { PracticeSessionRecord } from "../../lib/types";

const CIRCUMFERENCE = 540.4;

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [session, setSession] = useState<PracticeSessionRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message ?? "Failed to load this session.");
        setSession(body);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load this session."));
  }, [id]);

  useEffect(() => {
    if (!session) return;
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [session]);

  if (error) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <TopNav />
        <BackHeader title="Session" backHref="/history" />
        <div className="flex-1 flex items-center justify-center text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <TopNav />
        <BackHeader title="Session" backHref="/history" />
        <div className="flex-1 flex items-center justify-center text-sm text-foreground-muted">Loading…</div>
      </div>
    );
  }

  const overallOffset = mounted ? CIRCUMFERENCE * (1 - session.overallScore / 100) : CIRCUMFERENCE;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <TopNav />
      <BackHeader
        title={`${session.topicName} — Results`}
        subtitle={formatDate(session.createdAt)}
        backHref="/history"
      />

      <div className="grid grid-cols-[420px_1fr]">
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
              <div className="font-display font-bold text-[44px] text-foreground">{session.overallScore}</div>
              <div className="text-xs text-foreground-muted">out of 100</div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-[19px] mb-1.5 text-foreground">{session.verdict}</div>
            <div className="text-[13.5px] text-foreground-muted leading-relaxed">
              Practiced {formatDate(session.createdAt)}.
            </div>
          </div>
        </div>

        <div className="p-12">
          <AnalysisBreakdown categories={session.categories} transcript={session.transcript} />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircleIcon, GlobeIcon, RefreshIcon, SparkleIcon, SpeakerIcon, VideoIcon } from "./icons";
import type { PitchScenario } from "../lib/types";

const LANGUAGES = [
  { key: "bn", label: "বাংলা" },
  { key: "banglish", label: "Banglish" },
  { key: "en", label: "English" },
];

export function ScenarioBriefing({
  topicTitle,
  scenario,
  recordHref,
  onRegenerate,
  regenerating,
}: {
  topicTitle: string;
  scenario: PitchScenario;
  recordHref: string;
  onRegenerate?: () => void;
  regenerating?: boolean;
}) {
  const [language, setLanguage] = useState("bn");

  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-5 lg:p-8 flex flex-col gap-5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-navy text-navy-ink flex items-center justify-center shrink-0">
          <SparkleIcon size={17} />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-bold text-navy">রোলপ্লে প্র্যাকটিস সিনারিও</div>
          <div className="font-display font-bold text-[16px] text-foreground truncate">{topicTitle}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap rounded-xl bg-background border border-border px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-foreground-muted">
          <GlobeIcon size={15} />
          সিনারিওর ল্যাঙ্গুয়েজ:
        </span>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-border/50">
          {LANGUAGES.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLanguage(l.key)}
              className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-semibold transition-colors cursor-pointer ${
                language === l.key ? "bg-navy text-navy-ink" : "text-foreground-muted"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-navy text-navy-ink flex items-center justify-center font-display font-bold text-[14px] shrink-0">
              {scenario.clientInitials}
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-[14.5px] text-foreground truncate">
                {scenario.clientName}
              </div>
              <div className="text-[12px] text-foreground-muted truncate">{scenario.clientTitle}</div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-[1.5px] border-navy/25 text-navy font-display font-semibold text-[12.5px] shrink-0 cursor-pointer"
          >
            <SpeakerIcon size={14} />
            ক্লায়েন্টের ভয়েস শুনুন
          </button>
        </div>

        <div className="rounded-lg bg-navy-soft p-3.5">
          <div className="text-[12px] font-bold text-navy mb-1.5">ক্লায়েন্টের অবজেকশন / কোশ্চেন</div>
          <p className="text-[13.5px] text-foreground italic leading-relaxed">&ldquo;{scenario.objection}&rdquo;</p>
        </div>
      </div>

      <div>
        <div className="text-[13px] font-bold text-navy mb-2">আপনার মেইন অবজেক্টিভ</div>
        <div className="rounded-xl bg-background p-4 text-[13.5px] text-foreground-muted leading-relaxed">
          {scenario.objective}
        </div>
      </div>

      <div>
        <div className="text-[13px] font-bold text-navy mb-2">ইভালুয়েশন ক্রাইটেরিয়া</div>
        <div className="flex flex-col gap-2">
          {scenario.criteria.map((criterion) => (
            <div key={criterion} className="flex items-start gap-2.5">
              <CheckCircleIcon size={16} className="text-success shrink-0 mt-0.5" />
              <p className="text-[13px] text-foreground-muted leading-relaxed">{criterion}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-border flex-wrap">
        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground-muted hover:text-foreground cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshIcon size={15} className={regenerating ? "animate-spin" : undefined} />
          {regenerating ? "AI সিনারিও তৈরি হচ্ছে…" : "নতুন সিনারিও জেনারেট করুন"}
        </button>

        <Link
          href={recordHref}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-navy text-navy-ink font-display font-semibold text-[13.5px] cursor-pointer"
        >
          <VideoIcon size={15} />
          রেকর্ডিং স্টার্ট করুন
        </Link>
      </div>
    </div>
  );
}

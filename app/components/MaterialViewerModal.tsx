"use client";

import { useEffect, useRef, useState } from "react";
import { MATERIAL_TYPE_META } from "./MaterialRow";
import { ScenarioBriefingModal } from "./ScenarioBriefingModal";
import { CheckCircleIcon, FileIcon, PauseIcon, PlayIcon, SparkleIcon, XIcon } from "./icons";
import type { LearningMaterial, PitchScenario } from "../lib/modulesData";

function durationSeconds(meta: string) {
  const match = meta.match(/\d+/);
  return match ? parseInt(match[0], 10) * 60 : 60;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MaterialViewerModal({
  material,
  chapterHeadline,
  scenario,
  onClose,
}: {
  material: LearningMaterial;
  chapterHeadline: string;
  scenario: PitchScenario;
  onClose: () => void;
}) {
  const isTimeBased = material.type !== "pdf";
  const totalSeconds = isTimeBased ? durationSeconds(material.meta) : 0;

  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(() => Math.round(totalSeconds * 0.35));
  const [marked, setMarked] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isTimeBased || !playing) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => (prev >= totalSeconds ? totalSeconds : prev + 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, isTimeBased, totalSeconds]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const typeMeta = MATERIAL_TYPE_META[material.type];
  const progressPercent = isTimeBased && totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-full max-w-[960px] max-h-[90vh] overflow-y-auto rounded-2xl bg-background-elevated flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeMeta.iconWrapClass}`}>
              <typeMeta.Icon size={17} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-foreground-muted uppercase truncate">
                {chapterHeadline}
              </div>
              <div className="font-display font-bold text-[16px] text-foreground truncate">{material.title}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-foreground-muted hover:text-foreground p-1"
            aria-label="বন্ধ করুন"
          >
            <XIcon size={18} />
          </button>
        </div>

        {material.type === "pdf" ? (
          <div className="p-14 flex flex-col items-center justify-center gap-3 text-center bg-background">
            <div className="w-16 h-16 rounded-xl bg-navy-soft text-navy flex items-center justify-center">
              <FileIcon size={28} />
            </div>
            <div className="font-display font-bold text-[16px] text-foreground">{material.title}</div>
            <div className="text-[13px] text-foreground-muted">
              {material.meta} • {material.filename}
            </div>
          </div>
        ) : (
          <div className="bg-navy px-8 py-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="w-16 h-16 rounded-full bg-navy-border text-white flex items-center justify-center"
              aria-label={playing ? "পজ করুন" : "প্লে করুন"}
            >
              {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
            </button>

            <div className="text-center">
              <div className="font-display font-bold text-[16px] text-white mb-1">{material.title}</div>
              <div className="text-[13px] text-white/60">
                {material.type === "video" ? "ভিডিও লেসন" : "অডিও লেসন"} • {material.meta}
              </div>
            </div>

            <div className="w-full flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="text-white shrink-0"
                aria-label={playing ? "পজ করুন" : "প্লে করুন"}
              >
                {playing ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
              </button>
              <span className="text-[12px] text-white/70 shrink-0 tabular-nums">
                {formatTime(elapsed)} / {material.meta}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-navy-border" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 p-5 border-t border-border flex-wrap">
          <button
            type="button"
            onClick={() => setMarked((m) => !m)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-[1.5px] font-display font-semibold text-[13px] transition-colors ${
              marked ? "bg-success border-success text-white" : "border-success/40 text-success"
            }`}
          >
            <CheckCircleIcon size={15} />
            {marked ? "কমপ্লিট হয়েছে" : "কমপ্লিট হিসেবে মার্ক করুন"}
          </button>

          <button
            type="button"
            onClick={() => setShowScenario(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-navy text-navy-ink font-display font-semibold text-[13px]"
          >
            <SparkleIcon size={14} />
            পিচ প্র্যাকটিস স্টার্ট করুন
          </button>
        </div>
      </div>

      {showScenario && (
        <ScenarioBriefingModal
          topicTitle={chapterHeadline}
          scenario={scenario}
          onClose={() => setShowScenario(false)}
        />
      )}
    </div>
  );
}

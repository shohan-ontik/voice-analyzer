"use client";

import { useEffect, useRef, useState } from "react";
import { MATERIAL_TYPE_META } from "./MaterialRow";
import { ScenarioBriefingModal } from "./ScenarioBriefingModal";
import { CheckCircleIcon, PauseIcon, PlayIcon, SparkleIcon, XIcon } from "./icons";
import type { LearningMaterial, PitchScenario } from "../lib/types";

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
  completed,
  onMarkComplete,
  onClose,
}: {
  material: LearningMaterial;
  chapterHeadline: string;
  scenario: PitchScenario;
  completed: boolean;
  onMarkComplete: () => void;
  onClose: () => void;
}) {
  // Audio playback is still a mocked timer — only video is wired to a real
  // stream so far.
  const isFakeTimeBased = material.type === "audio";
  const totalSeconds = isFakeTimeBased ? durationSeconds(material.meta) : 0;

  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(() => Math.round(totalSeconds * 0.35));
  const [showScenario, setShowScenario] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isFakeTimeBased || !playing) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => (prev >= totalSeconds ? totalSeconds : prev + 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, isFakeTimeBased, totalSeconds]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const typeMeta = MATERIAL_TYPE_META[material.type];
  const progressPercent = isFakeTimeBased && totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0;

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
          <iframe
            key={material.id}
            src={`/api/materials/${material.id}/pdf`}
            title={material.title}
            className="w-full h-[70vh] bg-background border-0"
          />
        ) : material.type === "video" ? (
          <video
            key={material.id}
            controls
            autoPlay
            className="w-full max-h-[70vh] bg-black"
            src={`/api/materials/${material.id}/video`}
          />
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
              <div className="text-[13px] text-white/60">অডিও লেসন • {material.meta}</div>
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
            onClick={onMarkComplete}
            disabled={completed}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-[1.5px] font-display font-semibold text-[13px] transition-colors ${
              completed
                ? "bg-success border-success text-white cursor-default"
                : "border-success/40 text-success cursor-pointer"
            }`}
          >
            <CheckCircleIcon size={15} />
            {completed ? "কমপ্লিট হয়েছে" : "কমপ্লিট হিসেবে মার্ক করুন"}
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

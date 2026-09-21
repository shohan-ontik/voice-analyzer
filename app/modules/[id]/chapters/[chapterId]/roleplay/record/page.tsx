"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, XIcon } from "../../../../../../components/icons";
import type { AnalysisResult } from "../../../../../../lib/analysis";
import { chapterHeadline } from "../../../../../../lib/chapterHeadline";
import { authFetch } from "../../../../../../lib/clientFetch";
import {
  reportCacheKey,
  writeCachedReport,
} from "../../../../../../lib/roleplayReportCache";
import {
  readCachedScenario,
  scenarioCacheKey,
} from "../../../../../../lib/roleplayScenarioCache";
import type { PitchScenario } from "../../../../../../lib/types";
import { useModule } from "../../../../../../lib/useModules";

function buildReferenceFacts(
  chapterDescription: string,
  scenario: PitchScenario,
) {
  return `${chapterDescription}

ক্লায়েন্টের অবজেকশন/প্রশ্ন: ${scenario.objection}
রেপের উদ্দেশ্য: ${scenario.objective}
মূল্যায়ন মানদণ্ড:
${scenario.criteria.map((c) => `- ${c}`).join("\n")}`;
}

type Status = "requesting" | "countdown" | "recording" | "stopped";

const COUNTDOWN_SECONDS = 5;
const MAX_PITCH_SECONDS = 120;

function pickAudioMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") return undefined;
  return candidates.find((c) => MediaRecorder.isTypeSupported(c));
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ChapterRoleplayRecordPage() {
  const router = useRouter();
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const { trainingModule, error: loadError, loading } = useModule(id);
  const chapter = trainingModule?.chapters.find((c) => c.slug === chapterId);
  const scenarioKey = scenarioCacheKey(id, chapterId);

  const [aiScenario] = useState(() => readCachedScenario(scenarioKey));
  const [status, setStatus] = useState<Status>("requesting");
  const [micError, setMicError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [referenceExpanded, setReferenceExpanded] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  function startRecording(stream: MediaStream) {
    chunksRef.current = [];
    const mimeType = pickAudioMimeType();
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType ?? "audio/webm",
      });
      blobRef.current = blob;
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(blob);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    };
    recorderRef.current = recorder;
    recorder.start();
    setSeconds(0);
    setStatus("recording");
    if (timerRef.current) clearInterval(timerRef.current);
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 1;
      setSeconds(elapsed);
      if (elapsed >= MAX_PITCH_SECONDS) stopRecording();
    }, 1000);
  }

  function beginCountdown(stream: MediaStream) {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setStatus("countdown");
    setCountdown(COUNTDOWN_SECONDS);
    countdownTimerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownTimerRef.current)
            clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          startRecording(stream);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        beginCountdown(stream);
      })
      .catch(() => {
        if (!cancelled)
          setMicError(
            "মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি বা এটি উপলব্ধ নেই। ব্রাউজার পারমিশন চেক করুন।",
          );
      });

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive")
        recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function stopRecording() {
    recorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("stopped");
  }

  function retake() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewUrl(null);
    blobRef.current = null;
    if (streamRef.current) beginCountdown(streamRef.current);
  }

  async function finishAndAnalyze() {
    if (!blobRef.current || !trainingModule || !chapter) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const headline = chapterHeadline(chapter.title);
      const formData = new FormData();
      formData.append("file", blobRef.current, "recording.webm");
      formData.append("mode", "audio");
      formData.append(
        "passage",
        buildReferenceFacts(chapter.description, scenario),
      );
      formData.append("topicName", headline);

      const res = await authFetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();
      if (!res.ok)
        throw new Error(
          body?.error ?? "বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
        );

      const result = body as AnalysisResult;

      // Best-effort: not awaited, a persistence failure shouldn't block the
      // local report from showing.
      authFetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: null,
          topicName: headline,
          chapterId: chapter.id,
          overall: result.overall,
          verdict: result.verdict,
          categories: result.categories,
          transcript: result.transcript,
        }),
      }).catch(() => {});

      writeCachedReport(reportCacheKey(id, chapterId), {
        result,
        moduleTitle: trainingModule.title,
        chapterTitle: headline,
      });
      router.push(`${chapterHref}/roleplay/record/report`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      );
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[13.5px] text-foreground-muted">
        লোড হচ্ছে…
      </div>
    );
  }

  if (loadError || !trainingModule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">
          {loadError ?? "মডিউল খুঁজে পাওয়া যায়নি।"}
        </p>
        <Link
          href="/modules"
          className="text-[13px] font-semibold text-navy cursor-pointer"
        >
          সকল মডিউল ফিরে যান
        </Link>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">
          অধ্যায় খুঁজে পাওয়া যায়নি।
        </p>
        <Link
          href={`/modules/${trainingModule.slug}`}
          className="text-[13px] font-semibold text-navy cursor-pointer"
        >
          মডিউলে ফিরে যান
        </Link>
      </div>
    );
  }

  const chapterHref = `/modules/${trainingModule.slug}/chapters/${chapter.slug}`;
  const scenario = aiScenario ?? chapter.scenario;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="hidden lg:flex items-center gap-2 px-10 pt-8 text-[13px]">
        <Link
          href={chapterHref}
          className="flex items-center gap-1 font-semibold text-foreground-muted hover:text-foreground cursor-pointer"
        >
          <ArrowLeftIcon size={14} />
          অধ্যায়ে ফিরুন
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-10">
        <div className="relative w-full max-w-[420px] lg:max-w-[960px] min-h-[640px] lg:min-h-[600px] rounded-[28px] lg:rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]">
          <div
            className="flex flex-col flex-1"
            style={{
              background:
                "linear-gradient(180deg, var(--navy) 0%, var(--navy-border) 100%)",
            }}
          >
            <div className="flex items-center justify-between p-4 lg:p-6">
              <Link
                href={chapterHref}
                aria-label="বন্ধ করুন"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-navy-ink/10 text-navy-ink flex items-center justify-center cursor-pointer lg:hidden"
              >
                <XIcon size={16} />
              </Link>

              <div className="hidden lg:block font-display font-bold text-[15px] text-navy-ink">
                {scenario.clientName}
              </div>

              {status === "recording" && !micError && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-ink/10">
                  <div
                    className="w-2 h-2 rounded-full bg-accent"
                    style={{ animation: "rec-pulse 1.1s ease-in-out infinite" }}
                  />
                  <span className="font-display font-semibold text-[13px] text-navy-ink tabular-nums">
                    {formatTime(seconds)} / {formatTime(MAX_PITCH_SECONDS)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 lg:px-10 text-center">
              {micError ? (
                <p className="text-[13.5px] text-navy-ink/85 leading-relaxed max-w-[320px]">
                  {micError}
                </p>
              ) : (
                <>
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-navy-ink/10 border-2 border-navy-ink/20 flex items-center justify-center font-display font-bold text-[28px] lg:text-[36px] text-navy-ink">
                    {scenario.clientInitials}
                  </div>
                  <div className="font-display font-bold text-[18px] lg:text-[22px] text-navy-ink">
                    {scenario.clientName}
                  </div>
                  <div className="text-[13px] lg:text-[14px] text-navy-ink/70">
                    {scenario.clientTitle}
                  </div>
                  {status === "requesting" && (
                    <div className="text-[12.5px] text-navy-ink/60 mt-2">
                      মাইক্রোফোন প্রস্তুত হচ্ছে…
                    </div>
                  )}
                  {status === "countdown" && (
                    <div className="flex flex-col items-center gap-2 mt-3">
                      <div
                        key={countdown}
                        className="font-display font-bold text-[40px] lg:text-[56px] text-navy-ink"
                        style={{ animation: "rec-pulse 1s ease-in-out" }}
                      >
                        {countdown}
                      </div>
                      <div className="text-[12.5px] lg:text-[13px] text-navy-ink/60">
                        রেকর্ডিং শুরু হচ্ছে {countdown} সেকেন্ডে…
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {!micError && (
              <div className="flex flex-col items-center gap-4 pb-8 lg:pb-12 px-6">
                {status === "recording" && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    aria-label="রেকর্ডিং বন্ধ করুন"
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ background: "var(--accent)" }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="var(--accent-ink)"
                    >
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                )}

                {status === "stopped" && (
                  <div className="w-full flex flex-col items-center gap-3">
                    {previewUrl && (
                      <audio
                        controls
                        src={previewUrl}
                        className="w-full max-w-[280px]"
                      />
                    )}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={retake}
                        disabled={submitting}
                        className="px-4 py-2.5 rounded-lg border-[1.5px] border-navy-ink/30 text-navy-ink font-display font-semibold text-[13px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        আবার রেকর্ড করুন
                      </button>
                      <button
                        type="button"
                        onClick={finishAndAnalyze}
                        disabled={submitting}
                        className="px-5 py-2.5 rounded-lg bg-white text-navy font-display font-semibold text-[13px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {submitting ? "বিশ্লেষণ চলছে…" : "সাবমিট"}
                      </button>
                    </div>
                    {submitError && (
                      <p className="text-[12px] text-navy-ink bg-navy-ink/10 rounded-lg px-3 py-2 max-w-[280px] text-center">
                        {submitError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-background-elevated rounded-t-[24px] lg:rounded-t-none lg:w-[320px] lg:border-l lg:border-border px-5 pt-4 pb-5 lg:p-6 flex flex-col gap-2">
            <span className="font-display font-bold text-[13.5px] text-foreground">
              সিনারিও রেফারেন্স
            </span>
            {referenceExpanded && (
              <p className="text-[13px] text-foreground-muted leading-relaxed italic">
                &ldquo;{scenario.objection}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

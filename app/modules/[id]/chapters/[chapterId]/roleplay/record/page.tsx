"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, XIcon } from "../../../../../../components/icons";
import { useModule } from "../../../../../../lib/useModules";

type Status = "requesting" | "recording" | "stopped";

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
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const { trainingModule, error: loadError, loading } = useModule(id);

  const [status, setStatus] = useState<Status>("requesting");
  const [micError, setMicError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [referenceExpanded, setReferenceExpanded] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  function startRecording(stream: MediaStream) {
    chunksRef.current = [];
    const mimeType = pickAudioMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType ?? "audio/webm" });
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
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
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
        startRecording(stream);
      })
      .catch(() => {
        if (!cancelled) setMicError("মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি বা এটি উপলব্ধ নেই। ব্রাউজার পারমিশন চেক করুন।");
      });

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
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
    if (streamRef.current) startRecording(streamRef.current);
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-[13.5px] text-foreground-muted">লোড হচ্ছে…</div>;
  }

  if (loadError || !trainingModule) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">{loadError ?? "মডিউল খুঁজে পাওয়া যায়নি।"}</p>
        <Link href="/modules" className="text-[13px] font-semibold text-navy cursor-pointer">
          সকল মডিউল ফিরে যান
        </Link>
      </div>
    );
  }

  const chapter = trainingModule.chapters.find((c) => c.slug === chapterId);

  if (!chapter) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-[13.5px] text-foreground-muted">অধ্যায় খুঁজে পাওয়া যায়নি।</p>
        <Link href={`/modules/${trainingModule.slug}`} className="text-[13px] font-semibold text-navy cursor-pointer">
          মডিউলে ফিরে যান
        </Link>
      </div>
    );
  }

  const chapterHref = `/modules/${trainingModule.slug}/chapters/${chapter.slug}`;
  const scenario = chapter.scenario;

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4 lg:p-10">
      <div
        className="relative w-full max-w-[420px] min-h-[640px] rounded-[28px] overflow-hidden flex flex-col shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]"
        style={{ background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-border) 100%)" }}
      >
        <div className="flex items-center justify-between p-4">
          <Link
            href={chapterHref}
            aria-label="বন্ধ করুন"
            className="w-9 h-9 rounded-full bg-navy-ink/10 text-navy-ink flex items-center justify-center cursor-pointer"
          >
            <XIcon size={16} />
          </Link>

          {status !== "requesting" && !micError && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-ink/10">
              {status === "recording" && (
                <div className="w-2 h-2 rounded-full bg-accent" style={{ animation: "rec-pulse 1.1s ease-in-out infinite" }} />
              )}
              <span className="font-display font-semibold text-[13px] text-navy-ink tabular-nums">{formatTime(seconds)}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          {micError ? (
            <p className="text-[13.5px] text-navy-ink/85 leading-relaxed">{micError}</p>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-navy-ink/10 border-2 border-navy-ink/20 flex items-center justify-center font-display font-bold text-[28px] text-navy-ink">
                {scenario.clientInitials}
              </div>
              <div className="font-display font-bold text-[18px] text-navy-ink">{scenario.clientName}</div>
              <div className="text-[13px] text-navy-ink/70">{scenario.clientTitle}</div>
              {status === "requesting" && (
                <div className="text-[12.5px] text-navy-ink/60 mt-2">মাইক্রোফোন প্রস্তুত হচ্ছে…</div>
              )}
            </>
          )}
        </div>

        {!micError && (
          <div className="flex flex-col items-center gap-4 pb-8 px-6">
            {status === "recording" && (
              <button
                type="button"
                onClick={stopRecording}
                aria-label="রেকর্ডিং বন্ধ করুন"
                className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                style={{ background: "var(--accent)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-ink)">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            )}

            {status === "stopped" && (
              <div className="w-full flex flex-col items-center gap-4">
                {previewUrl && <audio controls src={previewUrl} className="w-full max-w-[280px]" />}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={retake}
                    className="px-4 py-2.5 rounded-lg border-[1.5px] border-navy-ink/30 text-navy-ink font-display font-semibold text-[13px] cursor-pointer"
                  >
                    আবার রেকর্ড করুন
                  </button>
                  <Link
                    href={chapterHref}
                    className="px-5 py-2.5 rounded-lg bg-white text-navy font-display font-semibold text-[13px] cursor-pointer"
                  >
                    শেষ করুন
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-background-elevated rounded-t-[24px] px-5 pt-4 pb-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setReferenceExpanded((e) => !e)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="font-display font-bold text-[13.5px] text-foreground">সিনারিও রেফারেন্স</span>
            <ChevronDownIcon
              size={16}
              className={`text-foreground-muted transition-transform ${referenceExpanded ? "" : "rotate-180"}`}
            />
          </button>
          {referenceExpanded && (
            <p className="text-[13px] text-foreground-muted leading-relaxed italic">&ldquo;{scenario.objection}&rdquo;</p>
          )}
        </div>
      </div>
    </div>
  );
}

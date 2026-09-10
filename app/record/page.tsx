"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, MicIcon, XIcon } from "../components/icons";
import { useAppState } from "../providers";

type Status = "idle" | "recording" | "stopped";

const BAR_COUNT = 28;

function pickAudioMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") return undefined;
  return candidates.find((c) => MediaRecorder.isTypeSupported(c));
}

function formatTime(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function RecordPage() {
  const router = useRouter();
  const { selectedTopic, setRecording } = useAppState();

  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0.08));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const [referenceExpanded, setReferenceExpanded] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Acquire the mic stream once on mount and keep it live for the whole
  // session, so the level bars can animate before the user taps record.
  useEffect(() => {
    let cancelled = false;

    async function go() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setError(null);
        setStreamReady(true);

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        let frame = 0;
        const tick = () => {
          frame += 1;
          if (frame % 2 === 0 && analyserRef.current) {
            analyserRef.current.getByteFrequencyData(data);
            const next = Array.from({ length: BAR_COUNT }, (_, i) => {
              const v = data[i % data.length] / 255;
              return Math.max(0.08, v);
            });
            setLevels(next);
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setError("Microphone access was denied or unavailable. Check your browser permissions.");
      }
    }

    go();

    return () => {
      cancelled = true;
      setStreamReady(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => {});
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = pickAudioMimeType();
    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
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
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

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
    setSeconds(0);
    setStatus("idle");
  }

  function analyze() {
    if (!blobRef.current) return;
    setRecording(blobRef.current, "audio", seconds);
    router.push("/analyzing");
  }

  const helper = error
    ? error
    : status === "recording"
      ? "Recording — read at a natural, confident pace."
      : status === "stopped"
        ? "Nice work! Retake if needed, or send it for analysis."
        : "Tap the button to start recording.";

  if (!selectedTopic) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="text-foreground-muted text-sm">No topic selected.</div>
          <Link href="/" className="text-accent font-display font-semibold text-sm cursor-pointer">
            Choose a topic to practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-4 lg:p-10">
      <div
        className="relative w-full max-w-[420px] min-h-[640px] rounded-[28px] overflow-hidden flex flex-col shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]"
        style={{ background: "linear-gradient(180deg, var(--navy) 0%, var(--navy-border) 100%)" }}
      >
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-navy-ink/10 text-navy-ink flex items-center justify-center cursor-pointer"
          >
            <XIcon size={16} />
          </Link>

          {(status === "recording" || status === "stopped") && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-ink/10">
              {status === "recording" && (
                <div className="w-2 h-2 rounded-full bg-accent" style={{ animation: "rec-pulse 1.1s ease-in-out infinite" }} />
              )}
              <span className="font-display font-semibold text-[13px] text-navy-ink tabular-nums">{formatTime(seconds)}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          {error ? (
            <p className="text-[13.5px] text-navy-ink/85 leading-relaxed">{error}</p>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-navy-ink/10 border-2 border-navy-ink/20 flex items-center justify-center text-navy-ink">
                <MicIcon size={32} />
              </div>
              <div className="font-display font-bold text-[18px] text-navy-ink">{selectedTopic.name}</div>

              <div className="flex items-end gap-[3px] h-16 mt-2">
                {levels.map((v, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-[2px] transition-[height] duration-150"
                    style={{
                      height: `${Math.round(v * 100)}%`,
                      background:
                        status === "recording" ? "var(--accent)" : "color-mix(in oklch, var(--navy-ink) 35%, transparent)",
                    }}
                  />
                ))}
              </div>

              <div className="text-[12.5px] text-navy-ink/60 mt-1">{helper}</div>
            </>
          )}
        </div>

        {!error && (
          <div className="flex flex-col items-center gap-4 pb-8 px-6">
            {status === "idle" && (
              <button
                type="button"
                disabled={!streamReady}
                onClick={startRecording}
                aria-label="Start recording"
                className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer disabled:opacity-40"
                style={{ background: "var(--accent)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent-ink)">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </button>
            )}

            {status === "recording" && (
              <button
                type="button"
                onClick={stopRecording}
                aria-label="Stop recording"
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
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={analyze}
                    className="px-5 py-2.5 rounded-lg bg-white text-navy font-display font-semibold text-[13px] cursor-pointer"
                  >
                    Analyze Pitch
                  </button>
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
            <span className="font-display font-bold text-[13.5px] text-foreground">Key facts to cover</span>
            <ChevronDownIcon
              size={16}
              className={`text-foreground-muted transition-transform ${referenceExpanded ? "" : "rotate-180"}`}
            />
          </button>
          {referenceExpanded && (
            <>
              <p className="font-bangla text-[15px] leading-relaxed text-foreground">{selectedTopic.passage}</p>
              <div className="pt-2 mt-1 border-t border-border flex items-start gap-2 text-foreground-muted text-[11.5px] leading-relaxed">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                This isn&apos;t a script — pitch it in your own words. You&apos;ll be marked on accuracy, not on matching
                this wording.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

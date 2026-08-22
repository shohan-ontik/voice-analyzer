"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BackHeader } from "../components/BackHeader";
import { useAppState, type RecordingMode } from "../providers";

type Status = "idle" | "recording" | "stopped";

const BAR_COUNT = 28;

function pickMimeType(mode: RecordingMode) {
  const candidates =
    mode === "video"
      ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"]
      : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
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

  const [mode, setMode] = useState<RecordingMode>("video");
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<number[]>(() => Array(BAR_COUNT).fill(0.08));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const blobRef = useRef<Blob | null>(null);

  // Acquire (or re-acquire) the camera/mic stream whenever the mode changes.
  useEffect(() => {
    let cancelled = false;

    async function go() {
      try {
        const constraints: MediaStreamConstraints =
          mode === "video" ? { video: { facingMode: "user" }, audio: true } : { audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setError(null);
        setStreamReady(true);

        if (videoRef.current && mode === "video") {
          videoRef.current.srcObject = stream;
        }

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
        if (!cancelled) setError("Camera/microphone access was denied or unavailable. Check your browser permissions.");
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
    };
  }, [mode]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startRecording() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = pickMimeType(mode);
    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType ?? (mode === "video" ? "video/webm" : "audio/webm") });
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      if (mode === "video" && videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
      }
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
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    blobRef.current = null;
    setSeconds(0);
    setStatus("idle");
    if (videoRef.current && mode === "video" && streamRef.current) {
      videoRef.current.src = "";
      videoRef.current.srcObject = streamRef.current;
    }
  }

  function analyze() {
    if (!blobRef.current) return;
    setRecording(blobRef.current, mode, seconds);
    router.push("/analyzing");
  }

  function changeMode(next: RecordingMode) {
    if (status !== "idle" || next === mode) return;
    setMode(next);
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
      <div className="flex-1 flex flex-col items-center justify-center bg-background gap-4 text-center px-6">
        <div className="text-foreground-muted text-sm">No topic selected.</div>
        <Link href="/" className="text-accent font-display font-semibold text-sm">
          Choose a topic to practice
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <BackHeader
        title={selectedTopic.name}
        badge="Passage 1 of 1"
        right={
          <div className="flex items-center gap-3.5">
            {status === "recording" && (
              <div className="flex items-center gap-2">
                <div className="w-[9px] h-[9px] rounded-full bg-accent" style={{ animation: "rec-pulse 1.1s ease-in-out infinite" }} />
                <div className="text-xs font-bold tracking-wide text-accent">REC</div>
              </div>
            )}
            <div className="font-display font-semibold text-[22px] tabular-nums min-w-16 text-right text-foreground">
              {formatTime(seconds)}
            </div>
          </div>
        }
      />

      <div className="flex-1 grid grid-cols-[1.3fr_1fr] gap-8 p-10 max-w-[1440px] w-full mx-auto">
        {/* Passage card */}
        <div className="bg-background-elevated border border-border rounded-[20px] p-10 flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wide text-foreground-muted mb-5">Read this aloud</div>
          <div className="font-bangla text-[29px] leading-[1.85] text-foreground flex-1">{selectedTopic.passage}</div>
          <div className="mt-6 pt-5 border-t border-border flex items-center gap-2.5 text-foreground-muted text-[13px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Speak clearly and read the full passage — take a breath before you start.
          </div>
        </div>

        {/* Recording panel */}
        <div className="flex flex-col gap-5">
          <div className="inline-flex p-1 rounded-xl bg-background-elevated border border-border self-start">
            <button
              type="button"
              onClick={() => changeMode("video")}
              className={`px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold ${
                mode === "video" ? "bg-accent text-accent-ink" : "text-foreground-muted"
              }`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => changeMode("audio")}
              className={`px-[18px] py-[9px] rounded-[9px] text-[13px] font-semibold ${
                mode === "audio" ? "bg-accent text-accent-ink" : "text-foreground-muted"
              }`}
            >
              Audio
            </button>
          </div>

          <div
            className="flex-1 rounded-[20px] bg-background-elevated border flex items-center justify-center relative overflow-hidden min-h-[360px]"
            style={{
              borderColor: status === "recording" ? "var(--accent)" : "var(--border)",
              animation: status === "recording" ? "rec-ring 1.6s ease-out infinite" : undefined,
            }}
          >
            {error ? (
              <div className="text-center text-foreground-muted text-sm px-8">{error}</div>
            ) : mode === "video" ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={status !== "stopped"}
                controls={status === "stopped"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-end gap-[5px] h-[120px]">
                {levels.map((v, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-[3px] transition-[height] duration-150"
                    style={{
                      height: `${Math.round(v * 100)}%`,
                      background: status === "recording" ? "var(--accent)" : "var(--teal-soft)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {status !== "stopped" ? (
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                type="button"
                disabled={!!error || !streamReady}
                onClick={status === "recording" ? stopRecording : startRecording}
                className="w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-40"
                style={{ background: status === "recording" ? "var(--foreground)" : "var(--accent)" }}
              >
                {status === "recording" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent-ink)">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--accent-ink)">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3.5 py-2">
              <button
                type="button"
                onClick={retake}
                className="flex items-center gap-2 px-[22px] py-3.5 rounded-xl border-[1.5px] border-border text-foreground font-display font-semibold text-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Retake
              </button>
              <button
                type="button"
                onClick={analyze}
                className="flex items-center gap-2 px-[26px] py-3.5 rounded-xl bg-accent text-accent-ink font-display font-semibold text-sm"
              >
                Analyze Pitch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
          <div className="text-center text-[13px] text-foreground-muted">{helper}</div>
        </div>
      </div>
    </div>
  );
}

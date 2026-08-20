"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ScenarioKey = "cold" | "demo" | "objection" | "elevator";

export const SCENARIOS: { key: ScenarioKey; label: string }[] = [
  { key: "cold", label: "Cold Call" },
  { key: "demo", label: "Product Demo" },
  { key: "objection", label: "Objection Handling" },
  { key: "elevator", label: "Elevator Pitch" },
];

export const PITCH_PASSAGE_BN =
  "আমাদের নতুন প্রোডাক্ট আপনার ব্যবসার কাজ আরও সহজ করে তুলবে। এটি ব্যবহার করা যেমন সহজ, তেমনই কার্যকর। প্রতিদিন হাজারো মানুষ এটি ব্যবহার করে সময় ও খরচ দুটোই বাঁচাচ্ছেন। আজই আমাদের সাথে যুক্ত হয়ে আপনার ব্যবসাকে নিয়ে যান এক নতুন উচ্চতায়।";

export type RecordingMode = "video" | "audio";

type Recording = {
  blobUrl: string;
  mode: RecordingMode;
  durationSec: number;
};

type AppState = {
  scenario: ScenarioKey;
  setScenario: (key: ScenarioKey) => void;
  recording: Recording | null;
  setRecording: (blob: Blob, mode: RecordingMode, durationSec: number) => void;
  clearRecording: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioKey>("elevator");
  const [recording, setRecordingState] = useState<Recording | null>(null);
  const lastUrl = useRef<string | null>(null);

  const setRecording = useCallback((blob: Blob, mode: RecordingMode, durationSec: number) => {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    const blobUrl = URL.createObjectURL(blob);
    lastUrl.current = blobUrl;
    setRecordingState({ blobUrl, mode, durationSec });
  }, []);

  const clearRecording = useCallback(() => {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    lastUrl.current = null;
    setRecordingState(null);
  }, []);

  const value = useMemo(
    () => ({ scenario, setScenario, recording, setRecording, clearRecording }),
    [scenario, recording, setRecording, clearRecording]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

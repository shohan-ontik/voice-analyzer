"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ScenarioKey } from "./lib/pitch";
import type { AnalysisResult } from "./lib/analysis";

export { SCENARIOS, PITCH_PASSAGE_BN } from "./lib/pitch";
export type { ScenarioKey } from "./lib/pitch";
export type { AnalysisResult } from "./lib/analysis";

export type RecordingMode = "video" | "audio";

type Recording = {
  blob: Blob;
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
  analysis: AnalysisResult | null;
  setAnalysis: (result: AnalysisResult) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioKey>("elevator");
  const [recording, setRecordingState] = useState<Recording | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const lastUrl = useRef<string | null>(null);

  const setRecording = useCallback((blob: Blob, mode: RecordingMode, durationSec: number) => {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    const blobUrl = URL.createObjectURL(blob);
    lastUrl.current = blobUrl;
    setRecordingState({ blob, blobUrl, mode, durationSec });
    setAnalysis(null);
  }, []);

  const clearRecording = useCallback(() => {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    lastUrl.current = null;
    setRecordingState(null);
    setAnalysis(null);
  }, []);

  const value = useMemo(
    () => ({ scenario, setScenario, recording, setRecording, clearRecording, analysis, setAnalysis }),
    [scenario, recording, setRecording, clearRecording, analysis]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

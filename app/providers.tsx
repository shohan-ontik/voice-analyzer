"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Topic } from "./lib/types";
import type { AnalysisResult } from "./lib/analysis";
import { authFetch } from "./lib/clientFetch";

export type { Topic } from "./lib/types";
export type { AnalysisResult } from "./lib/analysis";

export type RecordingMode = "video" | "audio";

type Recording = {
  blob: Blob;
  blobUrl: string;
  mode: RecordingMode;
  durationSec: number;
};

type AppState = {
  topics: Topic[];
  topicsLoading: boolean;
  topicsError: string | null;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string) => void;
  selectedTopic: Topic | null;
  recording: Recording | null;
  setRecording: (blob: Blob, mode: RecordingMode, durationSec: number) => void;
  clearRecording: () => void;
  analysis: AnalysisResult | null;
  setAnalysis: (result: AnalysisResult) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [recording, setRecordingState] = useState<Recording | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    authFetch("/api/topics")
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message ?? "Failed to load topics.");
        if (cancelled) return;
        const items = body.items as Topic[];
        setTopics(items);
        setSelectedTopicId((prev) => prev ?? items[0]?.id ?? null);
      })
      .catch((err) => {
        if (!cancelled) setTopicsError(err instanceof Error ? err.message : "Failed to load topics.");
      })
      .finally(() => {
        if (!cancelled) setTopicsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const selectedTopic = useMemo(
    () => topics.find((t) => t.id === selectedTopicId) ?? null,
    [topics, selectedTopicId]
  );

  const value = useMemo(
    () => ({
      topics,
      topicsLoading,
      topicsError,
      selectedTopicId,
      setSelectedTopicId,
      selectedTopic,
      recording,
      setRecording,
      clearRecording,
      analysis,
      setAnalysis,
    }),
    [topics, topicsLoading, topicsError, selectedTopicId, selectedTopic, recording, setRecording, clearRecording, analysis]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

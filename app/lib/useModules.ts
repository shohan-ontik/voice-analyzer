"use client";

import { useCallback, useEffect, useState } from "react";
import { authFetch } from "./clientFetch";
import type { TrainingModule } from "./types";

export function useModules() {
  const [modules, setModules] = useState<TrainingModule[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    authFetch("/api/modules")
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message ?? "Failed to load modules.");
        if (!cancelled) setModules(body.items as TrainingModule[]);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load modules.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { modules, error };
}

export function useModule(slug: string | undefined) {
  const [trainingModule, setTrainingModule] = useState<TrainingModule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Bumping this re-runs the effect below without flashing the loading
  // state back to true — used after a mutation like mark-complete, where we
  // want the freshly-fetched data to just replace what's on screen.
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    authFetch(`/api/modules/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message ?? "Failed to load this module.");
        if (!cancelled) {
          setTrainingModule(body as TrainingModule);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load this module.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, refreshIndex]);

  const refetch = useCallback(() => setRefreshIndex((n) => n + 1), []);

  return { trainingModule, error, loading, refetch };
}

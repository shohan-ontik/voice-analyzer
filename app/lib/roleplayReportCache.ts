import type { AnalysisResult } from "./analysis";

// The record page runs the AI analysis and stashes the result here; the
// report page (a separate route/navigation) reads it back out.
export type RoleplayReport = {
  result: AnalysisResult;
  moduleTitle: string;
  chapterTitle: string;
};

export function reportCacheKey(moduleSlug: string, chapterSlug: string) {
  return `roleplay-report:${moduleSlug}:${chapterSlug}`;
}

export function readCachedReport(key: string): RoleplayReport | null {
  if (typeof window === "undefined") return null;
  const cached = sessionStorage.getItem(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as RoleplayReport;
  } catch {
    return null;
  }
}

export function writeCachedReport(key: string, report: RoleplayReport) {
  sessionStorage.setItem(key, JSON.stringify(report));
}

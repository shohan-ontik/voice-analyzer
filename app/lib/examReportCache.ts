import type { AnalysisResult } from "./analysis";

// The exam record page runs the AI analysis and stashes the result here; the
// exam report page (a separate route/navigation) reads it back out. Local
// only — there's no backend endpoint yet to persist an exam attempt tied to
// a specific ModuleExam, so this cache is the only place the category
// breakdown for an attempt survives the navigation.
export type ExamReport = {
  result: AnalysisResult;
  moduleTitle: string;
  examTitle: string;
  passMark: number;
  passed: boolean;
};

export function examReportCacheKey(moduleSlug: string) {
  return `exam-report:${moduleSlug}`;
}

export function readCachedExamReport(key: string): ExamReport | null {
  if (typeof window === "undefined") return null;
  const cached = sessionStorage.getItem(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as ExamReport;
  } catch {
    return null;
  }
}

export function writeCachedExamReport(key: string, report: ExamReport) {
  sessionStorage.setItem(key, JSON.stringify(report));
}

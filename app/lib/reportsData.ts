import type { PracticeSessionRecord } from "./types";

export type ReportKind = "practice" | "exam";

export type EvaluationReport = {
  id: string;
  score: number;
  kind: ReportKind;
  date: string;
  title: string;
  chapter?: string;
  feedback: string;
  passed: boolean;
};

// /history's initial page load and its "load more" fetches must agree on
// this, or a session can be skipped or repeated across pages.
export const HISTORY_PAGE_SIZE = 10;

export function formatReportDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function toEvaluationReport(session: PracticeSessionRecord): EvaluationReport {
  return {
    id: session.id,
    score: session.overallScore,
    // type "exam" => a graded module exam attempt; "pitch_practice" covers
    // both ad-hoc /record pitches and chapter roleplay practice.
    kind: session.type === "exam" ? "exam" : "practice",
    date: formatReportDate(session.createdAt),
    title: session.topicName,
    feedback: session.verdict,
    passed: session.overallScore >= session.passMark,
  };
}

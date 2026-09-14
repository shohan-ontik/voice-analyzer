export type ReportKind = "practice" | "exam";

export type EvaluationReport = {
  id: string;
  score: number;
  kind: ReportKind;
  date: string;
  title: string;
  chapter?: string;
  feedback: string;
};

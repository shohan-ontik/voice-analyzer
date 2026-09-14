import { redirect } from "next/navigation";
import { HistoryFilters } from "../components/history/HistoryFilters";
import { ReportRow } from "../components/history/ReportRow";
import { ApiClientError, listOwnPracticeSessions } from "../lib/apiClient";
import type { EvaluationReport } from "../lib/reportsData";
import { getSessionToken } from "../lib/session";
import type { PracticeSessionRecord } from "../lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function toReport(session: PracticeSessionRecord): EvaluationReport {
  return {
    id: session.id,
    score: session.overallScore,
    // examId set => a graded module exam attempt; everything else (ad-hoc
    // /record pitches and chapter roleplay practice) counts as practice.
    kind: session.examId ? "exam" : "practice",
    date: formatDate(session.createdAt),
    title: session.topicName,
    feedback: session.verdict,
  };
}

export default async function HistoryPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  let reports: EvaluationReport[];
  try {
    const { items } = await listOwnPracticeSessions(token, { pageSize: 100 });
    reports = items.map(toReport);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  const entries = reports.map((report) => ({
    report,
    node: <ReportRow key={report.id} report={report} />,
  }));

  return (
    <div className="flex-1 flex flex-col bg-background">
      <HistoryFilters entries={entries} />
    </div>
  );
}

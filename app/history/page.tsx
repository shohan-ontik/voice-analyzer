import { redirect } from "next/navigation";
import { HistoryFilters } from "../components/history/HistoryFilters";
import { ApiClientError, listOwnPracticeSessions } from "../lib/apiClient";
import { HISTORY_PAGE_SIZE, toEvaluationReport } from "../lib/reportsData";
import { getSessionToken } from "../lib/session";

export default async function HistoryPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  let initialReports;
  let total;
  try {
    const { items, total: itemsTotal } = await listOwnPracticeSessions(token, {
      page: 1,
      pageSize: HISTORY_PAGE_SIZE,
    });
    initialReports = items.map(toEvaluationReport);
    total = itemsTotal;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <HistoryFilters initialReports={initialReports} total={total} />
    </div>
  );
}

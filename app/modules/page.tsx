import { redirect } from "next/navigation";
import { ModulesFilters } from "../components/modules/ModulesFilters";
import { ApiClientError, listModules } from "../lib/apiClient";
import { getSessionToken } from "../lib/session";
import type { TrainingModuleSummary } from "../lib/types";

export const MODULES_PAGE_SIZE = 10;

export default async function ModulesPage() {
  const token = await getSessionToken();
  if (!token) redirect("/login");

  let modules: TrainingModuleSummary[];
  let total: number;
  try {
    const result = await listModules(token, { page: 1, pageSize: MODULES_PAGE_SIZE });
    modules = result.items;
    total = result.total;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) redirect("/login");
    throw err;
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ModulesFilters initialModules={modules} initialTotal={total} pageSize={MODULES_PAGE_SIZE} />
    </div>
  );
}
